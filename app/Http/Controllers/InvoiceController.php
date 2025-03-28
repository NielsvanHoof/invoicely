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

        $invoices = Invoice::query()->getPaginatedInvoices($search, $filters)->latest()->paginate(10);

        return Inertia::render('invoices/index', [
            'invoices' => Inertia::merge($invoices),
            'search' => $search,
            'filters' => $filters,
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
        $invoices = Invoice::query()->whereIn('id', $invoiceIds)->get();

        if ($invoices->isEmpty()) {
            return back()->with('error', 'No invoices found.');
        }

        switch ($action) {
            case 'mark_as_sent':
                foreach ($invoices as $invoice) {
                    $invoice->status = InvoiceStatus::SENT;
                    $invoice->save();
                }
                return back()->with('success', count($invoices) . ' invoice(s) marked as sent.');

            case 'mark_as_paid':
                foreach ($invoices as $invoice) {
                    $invoice->status = InvoiceStatus::PAID;
                    $invoice->paid_at = now();
                    $invoice->save();
                }
                return back()->with('success', count($invoices) . ' invoice(s) marked as paid.');

            case 'mark_as_overdue':
                foreach ($invoices as $invoice) {
                    $invoice->status = InvoiceStatus::OVERDUE;
                    $invoice->save();
                }
                return back()->with('success', count($invoices) . ' invoice(s) marked as overdue.');

            case 'create_reminder_upcoming':
                $reminderCount = 0;
                foreach ($invoices as $invoice) {
                    if ($invoice->status !== InvoiceStatus::PAID) {
                        $invoice->reminders()->create([
                            'type' => ReminderType::UPCOMING,
                            'scheduled_date' => now()->addDay(),
                            'message' => ReminderType::UPCOMING->defaultMessage(),
                        ]);
                        $reminderCount++;
                    }
                }
                return back()->with('success', $reminderCount . ' upcoming payment reminder(s) created.');

            case 'create_reminder_overdue':
                $reminderCount = 0;
                foreach ($invoices as $invoice) {
                    if ($invoice->status !== InvoiceStatus::PAID) {
                        $invoice->reminders()->create([
                            'type' => ReminderType::OVERDUE,
                            'scheduled_date' => now()->addDay(),
                            'message' => ReminderType::OVERDUE->defaultMessage(),
                        ]);
                        $reminderCount++;
                    }
                }
                return back()->with('success', $reminderCount . ' overdue payment reminder(s) created.');

            case 'create_reminder_thank_you':
                $reminderCount = 0;
                foreach ($invoices as $invoice) {
                    if ($invoice->status === InvoiceStatus::PAID) {
                        $invoice->reminders()->create([
                            'type' => ReminderType::THANK_YOU,
                            'scheduled_date' => now()->addDay(),
                            'message' => ReminderType::THANK_YOU->defaultMessage(),
                        ]);
                        $reminderCount++;
                    }
                }
                return back()->with('success', $reminderCount . ' thank you reminder(s) created.');

            case 'delete':
                // First check if the invoices can be deleted
                $canDeleteCount = 0;
                foreach ($invoices as $invoice) {
                    // Logic to check if invoice can be deleted (add any business rules here)
                    $canDeleteCount++;
                }

                if ($canDeleteCount === 0) {
                    return back()->with('error', 'None of the selected invoices can be deleted.');
                }

                // Delete the invoices
                foreach ($invoices as $invoice) {
                    $invoice->delete();
                }

                return back()->with('success', count($invoices) . ' invoice(s) deleted.');

            default:
                return back()->with('error', 'Invalid action.');
        }
    }
}
