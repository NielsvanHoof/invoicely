<?php

namespace App\Http\Controllers\Reminders;

use App\Enums\ReminderType;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Helpers\ReminderMessageFormatter;
use App\Http\Controllers\Controller;
use App\Data\Reminders\StoreReminderData;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;

class ReminderStoreController extends Controller
{
    public function __construct(
        private ReminderMessageFormatter $reminderMessageFormatter,
    ) {
    }

    public function __invoke(StoreReminderData $data, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        // Get the default message if none provided
        if (empty($data->message)) {
            $reminderType = ReminderType::from($data->type);
            $data->message = $this->reminderMessageFormatter->format($reminderType, $invoice);
        }

        $invoice->reminders()->create($data->toArray());

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('reminders.index', $invoice)
            ->with('success', 'Reminder scheduled successfully.');
    }
}
