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
     *     deletedCount: int,
     *     failedCount: int,
     *     error?: string,
     * }|int
     */
    public function execute(BulkInvoiceData $data, User $user): array|int
    {
        switch ($data->action) {
            case 'mark_as_sent':
                $count = $this->bulkUpdateInvoiceStatusAction->execute($data, InvoiceStatus::SENT, $user);

                return $count;

            case 'mark_as_paid':
                $count = $this->bulkUpdateInvoiceStatusAction->execute($data, InvoiceStatus::PAID, $user);

                return $count;

            case 'mark_as_overdue':
                $count = $this->bulkUpdateInvoiceStatusAction->execute($data, InvoiceStatus::OVERDUE, $user);

                return $count;

            case 'create_reminder_upcoming':
                $count = $this->bulkCreateInvoiceRemindersAction->execute($data, ReminderType::UPCOMING, $user);

                return $count;

            case 'create_reminder_overdue':
                $count = $this->bulkCreateInvoiceRemindersAction->execute($data, ReminderType::OVERDUE, $user);

                return $count;

            case 'create_reminder_thank_you':
                $count = $this->bulkCreateInvoiceRemindersAction->execute($data, ReminderType::THANK_YOU, $user);

                return $count;

            case 'delete':
                $result = $this->bulkDeleteInvoicesAction->execute($data, $user);
                $successMessage = $result['deletedCount'].' invoice(s) deleted.';
                if ($result['failedCount'] > 0) {
                    $successMessage .= ' ('.$result['failedCount'].' could not be deleted, possibly because they were already paid).';
                }
                if ($result['deletedCount'] === 0 && $result['failedCount'] > 0) {
                    return ['error' => 'None of the selected invoices could be deleted, possibly because they were already paid.'];
                }

                return $result;

            default:
                return ['error' => 'Unsupported bulk action specified.'];
        }
    }
}
