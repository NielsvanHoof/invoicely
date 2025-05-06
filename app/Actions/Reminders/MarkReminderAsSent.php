<?php

namespace App\Actions\Reminders;

use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Reminder;
use Illuminate\Support\Facades\Log;

class MarkReminderAsSent
{
    public function execute(Reminder $reminder): void
    {
        $reminder->update([
            'sent_at' => now(),
        ]);

        // Load the invoice with user to dispatch the event
        $reminder->load('invoice.user');

        // Invalidate dashboard cache
        if ($reminder->invoice && $reminder->invoice->user) {
            InvalidateDashBoardCacheEvent::dispatch($reminder->invoice->user);
        }

        Log::info('Reminder sent', [
            'reminder_id' => $reminder->id,
            'invoice_id' => $reminder->invoice_id,
            'type' => $reminder->type,
        ]);
    }
}
