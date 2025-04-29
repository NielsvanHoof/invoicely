<?php

namespace App\Http\Controllers\Reminders;

use App\Enums\ReminderType;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reminders\StoreReminderRequest;
use App\Models\Invoice;

class ReminderStoreController extends Controller
{
    public function __invoke(StoreReminderRequest $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $validated = $request->validated();

        // Get the default message if none provided
        if (empty($validated['message'])) {
            $reminderType = ReminderType::from($validated['type']);
            $validated['message'] = $this->reminderService->formatMessage($reminderType, $invoice);
        }

        $invoice->reminders()->create($validated);

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('reminders.index', $invoice)
            ->with('success', 'Reminder scheduled successfully.');
    }
}
