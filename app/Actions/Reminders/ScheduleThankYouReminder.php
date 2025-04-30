<?php

namespace App\Actions\Reminders;

use App\Enums\ReminderType;
use App\Models\Invoice;
use App\Models\Reminder;

class ScheduleThankYouReminder
{
    public function execute(Invoice $invoice): void
    {
        Reminder::create([
            'invoice_id' => $invoice->id,
            'type' => ReminderType::THANK_YOU->value,
            'scheduled_date' => now(),
            'message' => Reminder::formatMessage(ReminderType::THANK_YOU, $invoice),
        ]);
    }
}
