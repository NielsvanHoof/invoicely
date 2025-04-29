<?php

namespace App\Http\Controllers\Invoices;

use App\Enums\InvoiceStatus;
use App\Enums\ReminderType;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvoiceBulkActionController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string',
            'invoice_ids' => 'required|array',
            'invoice_ids.*' => 'required|string',
        ]);

        $action = $validated['action'];
        $invoiceIds = $validated['invoice_ids'];
        $userId = Auth::id();

        switch ($action) {
            case 'mark_as_sent':
                $count = $this->invoiceService->bulkUpdateStatus($invoiceIds, InvoiceStatus::SENT, $userId);

                return back()->with('success', $count.' invoice(s) marked as sent.');

            case 'mark_as_paid':
                $count = $this->invoiceService->bulkUpdateStatus($invoiceIds, InvoiceStatus::PAID, $userId);

                return back()->with('success', $count.' invoice(s) marked as paid.');

            case 'mark_as_overdue':
                $count = $this->invoiceService->bulkUpdateStatus($invoiceIds, InvoiceStatus::OVERDUE, $userId);

                return back()->with('success', $count.' invoice(s) marked as overdue.');

            case 'create_reminder_upcoming':
                $count = $this->invoiceService->bulkCreateReminders($invoiceIds, ReminderType::UPCOMING, $userId);

                return back()->with('success', $count.' upcoming payment reminder(s) created.');

            case 'create_reminder_overdue':
                $count = $this->invoiceService->bulkCreateReminders($invoiceIds, ReminderType::OVERDUE, $userId);

                return back()->with('success', $count.' overdue payment reminder(s) created.');

            case 'create_reminder_thank_you':
                $count = $this->invoiceService->bulkCreateReminders($invoiceIds, ReminderType::THANK_YOU, $userId);

                return back()->with('success', $count.' thank you reminder(s) created.');

            case 'delete':
                $result = $this->invoiceService->bulkDeleteInvoices($invoiceIds, $userId);
                $successMessage = $result['deletedCount'].' invoice(s) deleted.';
                if ($result['failedCount'] > 0) {
                    $successMessage .= ' ('.$result['failedCount'].' could not be deleted, possibly because they were already paid).';
                }
                if ($result['deletedCount'] === 0 && $result['failedCount'] > 0) {
                    return back()->with('error', 'None of the selected invoices could be deleted, possibly because they were already paid.');
                }

                return back()->with('success', $successMessage);

            default:
                return back()->with('error', 'Unsupported bulk action specified.');
        }
    }
}
