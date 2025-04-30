<?php

namespace App\Actions\Reminders;

use App\Enums\ReminderType;
use App\Models\Invoice;
use App\Models\Reminder;

class ScheduleOverdueReminder
{
    public function execute(Invoice $invoice): void
    {
        // Schedule immediately for overdue invoices
        Reminder::create([
            'invoice_id' => $invoice->id,
            'type' => ReminderType::OVERDUE->value,
            'scheduled_date' => now(),
            'message' => Reminder::formatMessage(ReminderType::OVERDUE, $invoice),
        ]);
    }
}
