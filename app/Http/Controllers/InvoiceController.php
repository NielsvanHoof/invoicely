<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravel\Scout\Builder;

class InvoiceController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Invoice::class, 'invoice');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $user = Auth::user();

        $invoices = Invoice::search($search)
            ->when($user->team_id, function (Builder $query) use ($user) {
                $query->where('team_id', $user->team_id);
            })
            ->when(! $user->team_id, function (Builder $query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('invoices/index', [
            'invoices' => Inertia::merge($invoices),
            'search' => $search,
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'client_name' => 'required|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_address' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|in:draft,sent,paid,overdue',
            'notes' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ]);

        $filePath = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time().'_'.$file->getClientOriginalName();

            // Store the file in the 'invoices' directory using the s3 disk (Minio)
            $filePath = Storage::disk('s3')->putFileAs(
                'invoices/'.auth()->id(),
                $file,
                $fileName
            );
        }

        $user = Auth::user();

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'invoice_number' => $validated['invoice_number'],
            'client_name' => $validated['client_name'],
            'client_email' => $validated['client_email'],
            'client_address' => $validated['client_address'],
            'amount' => $validated['amount'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'file_path' => $filePath,
            'team_id' => $user->team_id ?? null,
        ]);

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        // Check if the invoice belongs to the authenticated user
        if ($invoice->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'invoice_number' => 'required|string|unique:invoices,invoice_number,'.$invoice->id,
            'client_name' => 'required|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_address' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|in:draft,sent,paid,overdue',
            'notes' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'remove_file' => 'nullable|boolean',
        ]);

        $filePath = $invoice->file_path;

        // Handle file removal if requested
        if ($request->input('remove_file') && $filePath) {
            Storage::disk('s3')->delete($filePath);
            $filePath = null;
        }

        // Handle new file upload
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($filePath) {
                Storage::disk('s3')->delete($filePath);
            }

            $file = $request->file('file');
            $fileName = time().'_'.$file->getClientOriginalName();

            // Store the file in the 'invoices' directory using the s3 disk (Minio)
            $filePath = Storage::disk('s3')->putFileAs(
                'invoices/'.auth()->id(),
                $file,
                $fileName
            );
        }

        $invoice->update([
            'invoice_number' => $validated['invoice_number'],
            'client_name' => $validated['client_name'],
            'client_email' => $validated['client_email'],
            'client_address' => $validated['client_address'],
            'amount' => $validated['amount'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'file_path' => $filePath,
        ]);

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        // Check if the invoice belongs to the authenticated user
        if ($invoice->user_id !== auth()->id()) {
            abort(403);
        }

        // Delete the associated file if it exists
        if ($invoice->file_path) {
            Storage::disk('s3')->delete($invoice->file_path);
        }

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}
