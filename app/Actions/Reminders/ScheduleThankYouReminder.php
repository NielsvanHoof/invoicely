<?php

namespace App\Actions\Reminders;

use App\Enums\ReminderType;
use App\Models\Invoice;
use App\Models\Reminder;
use App\Helpers\ReminderMessageFormatter;

class ScheduleThankYouReminder
{
    public function __construct(
        private ReminderMessageFormatter $reminderMessageFormatter,
    ) {}

    public function execute(Invoice $invoice): void
    {
        Reminder::create([
            'invoice_id' => $invoice->id,
            'type' => ReminderType::THANK_YOU->value,
            'scheduled_date' => now(),
            'message' => $this->reminderMessageFormatter->format(ReminderType::THANK_YOU, $invoice),
        ]);
    }
}
