<?php

namespace App\Actions\Reminders;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;

class ScheduleRemindersAction
{
    public function __construct(
        private ScheduleUpcomingReminder $scheduleUpcomingReminder,
        private ScheduleOverdueReminder $scheduleOverdueReminder,
        private ScheduleThankYouReminder $scheduleThankYouReminder,
    ) {}

    public function execute(Invoice $invoice): void
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
            $this->scheduleThankYouReminder->execute($invoice);

            return;
        }

        // For sent invoices, schedule upcoming and potentially overdue reminders
        if ($invoice->status === InvoiceStatus::SENT) {
            $this->scheduleUpcomingReminder->execute($invoice);

            // If due date is in the past, also schedule an overdue reminder
            if ($invoice->due_date->isPast()) {
                $this->scheduleOverdueReminder->execute($invoice);
            }
        }

        // For overdue invoices, schedule overdue reminder
        if ($invoice->status === InvoiceStatus::OVERDUE) {
            $this->scheduleOverdueReminder->execute($invoice);
        }
    }
}
