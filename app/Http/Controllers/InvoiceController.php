<?php

namespace App\Http\Controllers;

use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Services\Invoices\InvoiceFileService;
use App\Services\Invoices\InvoiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Enums\InvoiceStatus;
use App\Enums\ReminderType;

class InvoiceController extends Controller
{
    public function resourceAbilityMap(): array
    {
        return [
            ...parent::resourceAbilityMap(),
            'downloadFile' => 'downloadFile',
        ];
    }

    public function __construct(
        protected InvoiceFileService $fileService,
        protected InvoiceService $invoiceService
    ) {
        $this->authorizeResource(Invoice::class, 'invoice');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $filters = [
            'status' => $request->input('status', ''),
            'date_from' => $request->input('date_from', ''),
            'date_to' => $request->input('date_to', ''),
            'amount_from' => $request->input('amount_from', ''),
            'amount_to' => $request->input('amount_to', ''),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $invoices = Invoice::query()
            ->getInvoices($search, $filters, $sort)
            ->paginate(10);

        return Inertia::render('invoices/index', [
            'invoices' => Inertia::merge($invoices),
            'search' => $search,
            'filters' => $filters,
            'sort' => $sort,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('invoices/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        $validated = $request->except('file');
        $user = Auth::user();

        $invoice = $this->invoiceService->createInvoice(
            $validated,
            $request->file('file'),
            $user->id,
            $user->team_id
        );

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load('reminders');

        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        $invoice->load('reminders');

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $validated = $request->except('file');

        $this->invoiceService->updateInvoice(
            $invoice,
            $validated,
            $request->file('file'),
            $request->input('remove_file', false),
            Auth::id()
        );

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $this->invoiceService->deleteInvoice($invoice);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    /**
     * Generate a secure download URL for the invoice file.
     */
    public function downloadFile(Invoice $invoice)
    {
        if (!$invoice->file_path) {
            return response()->json(['error' => 'No file attached to this invoice'], 404);
        }

        $temporaryUrl = $this->fileService->getTemporaryUrl($invoice->file_path);

        if (!$temporaryUrl) {
            return response()->json(['error' => 'Could not generate download link'], 500);
        }

        return response()->json(['url' => $temporaryUrl]);
    }

    public function bulkAction(Request $request)
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
                return back()->with('success', $count . ' invoice(s) marked as sent.');

            case 'mark_as_paid':
                $count = $this->invoiceService->bulkUpdateStatus($invoiceIds, InvoiceStatus::PAID, $userId);
                return back()->with('success', $count . ' invoice(s) marked as paid.');

            case 'mark_as_overdue':
                $count = $this->invoiceService->bulkUpdateStatus($invoiceIds, InvoiceStatus::OVERDUE, $userId);
                return back()->with('success', $count . ' invoice(s) marked as overdue.');

            case 'create_reminder_upcoming':
                $count = $this->invoiceService->bulkCreateReminders($invoiceIds, ReminderType::UPCOMING, $userId);
                return back()->with('success', $count . ' upcoming payment reminder(s) created.');

            case 'create_reminder_overdue':
                $count = $this->invoiceService->bulkCreateReminders($invoiceIds, ReminderType::OVERDUE, $userId);
                return back()->with('success', $count . ' overdue payment reminder(s) created.');

            case 'create_reminder_thank_you':
                $count = $this->invoiceService->bulkCreateReminders($invoiceIds, ReminderType::THANK_YOU, $userId);
                return back()->with('success', $count . ' thank you reminder(s) created.');

            case 'delete':
                $result = $this->invoiceService->bulkDeleteInvoices($invoiceIds, $userId);
                $successMessage = $result['deletedCount'] . ' invoice(s) deleted.';
                if ($result['failedCount'] > 0) {
                    $successMessage .= ' (' . $result['failedCount'] . ' could not be deleted, possibly because they were already paid).';
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
