<?php

namespace App\Actions\Invoices;

use App\Actions\Files\HandleFileUpdateAction;
use App\Actions\Reminders\ScheduleRemindersAction;
use App\Data\Invoices\UpdateInvoiceData;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Invoice;

class UpdateInvoiceAction
{
    public function __construct(
        protected HandleFileUpdateAction $handleFileUpdateAction,
        protected ScheduleRemindersAction $scheduleRemindersAction,
    ) {}

    public function execute(Invoice $invoice, UpdateInvoiceData $data): Invoice
    {
        $filePath = $this->handleFileUpdateAction->execute(
            $invoice->file_path,
            $data->file,
            $data->remove_file,
            $invoice->user_id,
            "{$invoice->user_id}/invoices"
        );

        $invoice->update([
            ...$data->toArray(),
            'file_path' => $filePath,
        ]);

        // Schedule reminders for the updated invoice
        $this->scheduleRemindersAction->execute($invoice);

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);
        InvalidateAnalyticsCacheEvent::dispatch($invoice->user);

        return $invoice;
    }
}
