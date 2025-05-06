<?php

namespace App\Actions\Reminders;

use App\Enums\ReminderType;
use App\Helpers\ReminderMessageFormatter;
use App\Models\Invoice;
use App\Models\Reminder;

class ScheduleOverdueReminder
{
    public function __construct(
        private ReminderMessageFormatter $reminderMessageFormatter,
    ) {}

    public function execute(Invoice $invoice): void
    {
        // Schedule immediately for overdue invoices
        Reminder::create([
            'invoice_id' => $invoice->id,
            'type' => ReminderType::OVERDUE->value,
            'scheduled_date' => now(),
            'message' => $this->reminderMessageFormatter->format(ReminderType::OVERDUE, $invoice),
        ]);
    }
}
