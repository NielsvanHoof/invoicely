<?php

namespace App\Http\Controllers;

use App\Events\InvalidateDashBoardCacheEvent;
use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Mail\Invoices\InvoiceReceivedMail;
use App\Models\Invoice;
use App\Services\Invoices\InvoiceFileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Laravel\Scout\Builder;

class InvoiceController extends Controller
{
    public function resourceAbilityMap(): array
    {
        return [
            ...parent::resourceAbilityMap(),
            'downloadFile' => 'downloadFile',
        ];
    }

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

        $filters = [
            'status' => $request->input('status', ''),
            'date_from' => $request->input('date_from', ''),
            'date_to' => $request->input('date_to', ''),
            'amount_from' => $request->input('amount_from', ''),
            'amount_to' => $request->input('amount_to', ''),
        ];

        $invoices = Invoice::search($search)
            ->when($user->team_id, function (Builder $query) use ($user) {
                $query->where('team_id', $user->team_id);
            })
            ->when(! $user->team_id, function (Builder $query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->when($filters['status'], function (Builder $query) use ($filters) {
                $query->where('status', $filters['status']);
            })
            ->when($filters['date_from'], function (Builder $query) use ($filters) {
                $query->whereDate('created_at', '>=', $filters['date_from']);
            })
            ->when($filters['date_to'], function (Builder $query) use ($filters) {
                $query->whereDate('created_at', '<=', $filters['date_to']);
            })
            ->when($filters['amount_from'], function (Builder $query) use ($filters) {
                $query->where('amount', '>=', $filters['amount_from']);
            })
            ->when($filters['amount_to'], function (Builder $query) use ($filters) {
                $query->where('amount', '<=', $filters['amount_to']);
            })
            ->latest()
            ->paginate(10);

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
            'file_path' => $filePath ?? null,
        ]);

        if ($validated['client_email'] && App::isLocal()) {
            Mail::to($validated['email'])->send(new InvoiceReceivedMail($invoice));
        }

        InvalidateDashBoardCacheEvent::dispatch($user);

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
        $user = Auth::user();
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

        InvalidateDashBoardCacheEvent::dispatch($user);

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $user = Auth::user();

        if ($invoice->file_path) {
            $this->fileService->deleteFile($invoice->file_path);
        }

        $invoice->delete();

        InvalidateDashBoardCacheEvent::dispatch($user);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    /**
     * Generate a secure download URL for the invoice file.
     */
    public function downloadFile(Invoice $invoice)
    {
        if (! $invoice->file_path) {
            return response()->json(['error' => 'No file attached to this invoice'], 404);
        }

        $temporaryUrl = $this->fileService->getTemporaryUrl($invoice->file_path);

        if (! $temporaryUrl) {
            return response()->json(['error' => 'Could not generate download link'], 500);
        }

        return response()->json(['url' => $temporaryUrl]);
    }
}
