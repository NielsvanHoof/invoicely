<?php

namespace App\Http\Controllers\Reminders;

use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Reminder;
use Illuminate\Http\RedirectResponse;

class ReminderDestroyController extends Controller
{
    public function __invoke(Invoice $invoice, Reminder $reminder): RedirectResponse
    {
        $this->authorize('update', $invoice);

        // Don't allow deleting reminders that have already been sent
        if ($reminder->sent_at) {
            return redirect()->route('reminders.index', [$invoice, $reminder])
                ->with('error', 'Cannot delete a reminder that has already been sent.');
        }

        $reminder->delete();

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('reminders.index', [$invoice, $reminder])
            ->with('success', 'Reminder deleted successfully.');
    }
}
