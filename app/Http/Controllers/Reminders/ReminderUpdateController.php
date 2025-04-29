<?php

namespace App\Http\Controllers\Reminders;

use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reminders\UpdateReminderRequest;
use App\Models\Invoice;
use App\Models\Reminder;

class ReminderUpdateController extends Controller
{
    public function __invoke(UpdateReminderRequest $request, Invoice $invoice, Reminder $reminder)
    {
        $this->authorize('update', $invoice);

        // Don't allow updating reminders that have already been sent
        if ($reminder->sent_at) {
            return redirect()->route('reminders.index', [$invoice, $reminder])
                ->with('error', 'Cannot update a reminder that has already been sent.');
        }

        $validated = $request->validated();

        $reminder->update($validated);

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('reminders.index', [$invoice, $reminder])
            ->with('success', 'Reminder updated successfully.');
    }
}
