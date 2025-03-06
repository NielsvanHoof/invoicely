<?php

namespace App\Services\Reminders;

use App\Enums\InvoiceStatus;
use App\Enums\ReminderType;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Invoice;
use App\Models\Reminder;
use Illuminate\Support\Facades\Log;

class ReminderService
{
    /**
     * Schedule reminders for an invoice.
     */
    public function scheduleReminders(Invoice $invoice): void
    {
        $invoice->load('reminders');
        // Delete any existing unsent reminders for this invoice
        $invoice->reminders()->whereNull('sent_at')->delete();

        // Schedule based on invoice status
        if ($invoice->status === InvoiceStatus::DRAFT) {
            // No reminders for draft invoices
            return;
        }

        if ($invoice->status === InvoiceStatus::PAID) {
            // Schedule thank you reminder for paid invoices
            $this->scheduleThankYouReminder($invoice);

            return;
        }

        // For sent invoices, schedule upcoming and potentially overdue reminders
        if ($invoice->status === InvoiceStatus::SENT) {
            $this->scheduleUpcomingReminder($invoice);

            // If due date is in the past, also schedule an overdue reminder
            if ($invoice->due_date->isPast()) {
                $this->scheduleOverdueReminder($invoice);
            }
        }

        // For overdue invoices, schedule overdue reminder
        if ($invoice->status === InvoiceStatus::OVERDUE) {
            $this->scheduleOverdueReminder($invoice);
        }
    }

    /**
     * Schedule an upcoming payment reminder.
     */
    protected function scheduleUpcomingReminder(Invoice $invoice): void
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
            'message' => $this->formatMessage(ReminderType::UPCOMING, $invoice),
        ]);
    }

    /**
     * Schedule an overdue payment reminder.
     */
    protected function scheduleOverdueReminder(Invoice $invoice): void
    {
        // Schedule immediately for overdue invoices
        Reminder::create([
            'invoice_id' => $invoice->id,
            'type' => ReminderType::OVERDUE->value,
            'scheduled_date' => now(),
            'message' => $this->formatMessage(ReminderType::OVERDUE, $invoice),
        ]);
    }

    /**
     * Schedule a thank you reminder for paid invoices.
     */
    protected function scheduleThankYouReminder(Invoice $invoice): void
    {
        Reminder::create([
            'invoice_id' => $invoice->id,
            'type' => ReminderType::THANK_YOU->value,
            'scheduled_date' => now(),
            'message' => $this->formatMessage(ReminderType::THANK_YOU, $invoice),
        ]);
    }

    /**
     * Format a reminder message with invoice details.
     */
    public function formatMessage(ReminderType $type, Invoice $invoice): string
    {
        $template = $type->defaultMessage();

        $replacements = [
            '{{invoice_number}}' => $invoice->invoice_number,
            '{{amount}}' => '$'.number_format($invoice->amount, 2),
            '{{due_date}}' => $invoice->due_date->format('F j, Y'),
            '{{client_name}}' => $invoice->client_name,
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    /**
     * Mark a reminder as sent.
     */
    public function markAsSent(Reminder $reminder): void
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
