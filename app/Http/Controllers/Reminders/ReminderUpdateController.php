<?php

namespace App\Http\Controllers\Reminders;

use App\Data\Reminders\UpdateReminderData;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Reminder;
use Illuminate\Http\RedirectResponse;

class ReminderUpdateController extends Controller
{
    public function __invoke(UpdateReminderData $data, Invoice $invoice, Reminder $reminder): RedirectResponse
    {
        $this->authorize('update', $invoice);

        // Don't allow updating reminders that have already been sent
        if ($reminder->sent_at) {
            return redirect()->route('reminders.index', [$invoice, $reminder])
                ->with('error', 'Cannot update a reminder that has already been sent.');
        }

        $reminder->update($data->toArray());

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('reminders.index', [$invoice, $reminder])
            ->with('success', 'Reminder updated successfully.');
    }
}
