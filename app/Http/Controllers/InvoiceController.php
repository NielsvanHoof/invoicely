<?php

namespace App\Http\Controllers;

use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Services\Invoices\InvoiceFileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Scout\Builder;

class InvoiceController extends Controller
{
    public function __construct(protected InvoiceFileService $fileService)
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
    public function store(StoreInvoiceRequest $request)
    {
        $validated = $request->except('file');
        $user = Auth::user();
        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $this->fileService->storeFile(
                $request->file('file'),
                $user->id
            );
        }

        $invoice = Invoice::create([
            ...$validated,
            'user_id' => $user->id,
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
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $validated = $request->except('file');

        $filePath = $this->fileService->handleFileUpdate(
            $invoice->file_path,
            $request->file('file'),
            $request->input('remove_file', false),
            Auth::id()
        );

        $invoice->update([
            ...$validated,
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
        if ($invoice->file_path) {
            $this->fileService->deleteFile($invoice->file_path);
        }

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}
