<?php

namespace App\Http\Controllers\Reminders;

use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Controllers\Controller;
use App\Models\Invoice;

class ReminderScheduleDefaultsController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $this->reminderService->scheduleReminders($invoice);

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('reminders.index', $invoice)
            ->with('success', 'Default reminders scheduled successfully.');
    }
}
