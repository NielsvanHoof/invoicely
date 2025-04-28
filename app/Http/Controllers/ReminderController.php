<?php

namespace App\Http\Controllers;

use App\Enums\ReminderType;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Requests\Reminders\StoreReminderRequest;
use App\Http\Requests\Reminders\UpdateReminderRequest;
use App\Models\Invoice;
use App\Models\Reminder;
use App\Services\Reminders\ReminderService;
use Inertia\Inertia;

class ReminderController extends Controller
{
    public function __construct(protected ReminderService $reminderService) {}

    /**
     * Display a listing of the reminders for an invoice.
     */
    public function index(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load('reminders');

        return Inertia::render('reminders/index', [
            'invoice' => $invoice,
            'types' => $this->getReminderTypes(),
        ]);
    }

    /**
     * Store a newly created reminder in storage.
     */
    public function store(StoreReminderRequest $request, Invoice $invoice)
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

        return redirect()->route('invoices.reminders.index', $invoice)
            ->with('success', 'Reminder scheduled successfully.');
    }

    /**
     * Update the specified reminder in storage.
     */
    public function update(UpdateReminderRequest $request, Invoice $invoice, Reminder $reminder)
    {
        $this->authorize('update', $invoice);

        // Don't allow updating reminders that have already been sent
        if ($reminder->sent_at) {
            return redirect()->route('invoices.reminders.index', [$invoice, $reminder])
                ->with('error', 'Cannot update a reminder that has already been sent.');
        }

        $validated = $request->validated();

        $reminder->update($validated);

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('invoices.reminders.index', [$invoice, $reminder])
            ->with('success', 'Reminder updated successfully.');
    }

    /**
     * Remove the specified reminder from storage.
     */
    public function destroy(Invoice $invoice, Reminder $reminder)
    {
        $this->authorize('update', $invoice);

        // Don't allow deleting reminders that have already been sent
        if ($reminder->sent_at) {
            return redirect()->route('invoices.reminders.index', [$invoice, $reminder])
                ->with('error', 'Cannot delete a reminder that has already been sent.');
        }

        $reminder->delete();

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('invoices.reminders.index', [$invoice, $reminder])
            ->with('success', 'Reminder deleted successfully.');
    }

    /**
     * Schedule all default reminders for an invoice.
     */
    public function scheduleDefaults(Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $this->reminderService->scheduleReminders($invoice);

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);

        return redirect()->route('invoices.reminders.index', $invoice)
            ->with('success', 'Default reminders scheduled successfully.');
    }

    /**
     * Get all reminder types for the dropdown.
     */
    private function getReminderTypes(): array
    {
        return collect(ReminderType::cases())->map(function ($type) {
            return [
                'value' => $type->value,
                'label' => $type->label(),
            ];
        })->toArray();
    }
}
