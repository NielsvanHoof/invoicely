<?php

namespace App\Actions\Reminders;

use App\Enums\ReminderType;
use App\Models\Invoice;
use App\Models\Reminder;

class ScheduleUpcomingReminder
{
    public function execute(Invoice $invoice): void
    {
        // Schedule 3 days before due date
        $scheduledDate = $invoice->due_date->copy()->subDays(3);

        // If the scheduled date is in the past, don't create a reminder
        if ($scheduledDate->isPast()) {
            return;
        }

        Reminder::create([
            'invoice_id' => $invoice->id,
            'type' => ReminderType::UPCOMING->value,
            'scheduled_date' => $scheduledDate,
            'message' => Reminder::formatMessage(ReminderType::UPCOMING, $invoice),
        ]);
    }
}
