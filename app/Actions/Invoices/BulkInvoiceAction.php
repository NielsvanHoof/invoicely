<?php

namespace App\Actions\Invoices;

use App\Data\Invoices\BulkInvoiceData;
use App\Enums\InvoiceStatus;
use App\Enums\ReminderType;
use App\Models\User;

class BulkInvoiceAction
{
    public function __construct(
        private BulkUpdateInvoiceStatusAction $bulkUpdateInvoiceStatusAction,
        private BulkCreateInvoiceRemindersAction $bulkCreateInvoiceRemindersAction,
        private BulkDeleteInvoicesAction $bulkDeleteInvoicesAction,
    ) {}

    /**
     * Execute a bulk action on multiple invoices.
     *
     * @return array{
     *     success: bool,
     *     count?: int,
     *     deletedCount?: int,
     *     failedCount?: int,
     *     error?: string,
     *     message?: string
     * }
     */
    public function execute(BulkInvoiceData $data, User $user): array
    {
        return match ($data->action) {
            'mark_as_sent' => $this->handleStatusUpdate($data, InvoiceStatus::SENT, $user),
            'mark_as_paid' => $this->handleStatusUpdate($data, InvoiceStatus::PAID, $user),
            'mark_as_overdue' => $this->handleStatusUpdate($data, InvoiceStatus::OVERDUE, $user),
            'create_reminder_upcoming' => $this->handleReminderCreation($data, ReminderType::UPCOMING, $user),
            'create_reminder_overdue' => $this->handleReminderCreation($data, ReminderType::OVERDUE, $user),
            'create_reminder_thank_you' => $this->handleReminderCreation($data, ReminderType::THANK_YOU, $user),
            'delete' => $this->handleDeletion($data, $user),
            default => [
                'success' => false,
                'error' => 'Unsupported bulk action specified.',
            ]
        };
    }

    /**
     * Handle status update operations
     *
     * @return array{
     *     success: bool,
     *     count?: int,
     *     error?: string,
     *     message?: string
     * }
     */
    private function handleStatusUpdate(BulkInvoiceData $data, InvoiceStatus $status, User $user): array
    {
        $count = $this->bulkUpdateInvoiceStatusAction->execute($data, $status, $user);

        return [
            'success' => true,
            'count' => $count,
            'message' => "Successfully updated {$count} invoice(s) to {$status->value} status.",
        ];
    }

    /**
     * Handle reminder creation operations
     *
     * @return array{
     *     success: bool,
     *     count?: int,
     *     error?: string,
     *     message?: string
     * }
     */
    private function handleReminderCreation(BulkInvoiceData $data, ReminderType $type, User $user): array
    {
        $count = $this->bulkCreateInvoiceRemindersAction->execute($data, $type, $user);

        return [
            'success' => true,
            'count' => $count,
            'message' => "Successfully created {$count} {$type->value} reminder(s).",
        ];
    }

    /**
     * Handle invoice deletion operations
     *
     * @return array{
     *     success: bool,
     *     deletedCount?: int,
     *     failedCount?: int,
     *     error?: string,
     *     message?: string
     * }
     */
    private function handleDeletion(BulkInvoiceData $data, User $user): array
    {
        $result = $this->bulkDeleteInvoicesAction->execute($data, $user);

        if ($result['deletedCount'] === 0 && $result['failedCount'] > 0) {
            return [
                'success' => false,
                'error' => 'None of the selected invoices could be deleted, possibly because they were already paid.',
            ];
        }

        $message = "{$result['deletedCount']} invoice(s) deleted.";
        if ($result['failedCount'] > 0) {
            $message .= " ({$result['failedCount']} could not be deleted, possibly because they were already paid).";
        }

        return [
            'success' => true,
            'deletedCount' => $result['deletedCount'],
            'failedCount' => $result['failedCount'],
            'message' => $message,
        ];
    }
}
