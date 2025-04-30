<?php

namespace App\Actions\Invoices;

use App\Data\Invoices\BulkInvoiceData;
use App\Enums\InvoiceStatus;
use App\Enums\ReminderType;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Invoice;
use App\Models\Reminder;
use App\Models\User;

class BulkCreateInvoiceRemindersAction
{
    public function execute(BulkInvoiceData $data, ReminderType $type, User $user): int
    {
        $invoices = Invoice::query()->whereIn('id', $data->invoice_ids)->get();
        $reminderCount = 0;
        $remindersToInsert = [];
        $now = now();

        foreach ($invoices as $invoice) {
            $shouldCreate = match ($type) {
                ReminderType::THANK_YOU => $invoice->status === InvoiceStatus::PAID,
                ReminderType::UPCOMING => $invoice->due_date > now(),
                ReminderType::OVERDUE => $invoice->due_date < now(),
                default => false,
            };

            if ($shouldCreate) {
                $reminderCount++;

                $remindersToInsert[] = ['invoice_id' => $invoice->id, 'type' => $type->value, 'scheduled_date' => $now->addDay(), 'message' => $type->defaultMessage()];
            }
        }

        if (! empty($remindersToInsert)) {
            Reminder::query()->insert($remindersToInsert);
        }

        if ($reminderCount > 0 && $user) {
            InvalidateDashBoardCacheEvent::dispatch($user);
            InvalidateAnalyticsCacheEvent::dispatch($user);
        }

        return $reminderCount;
    }
}
