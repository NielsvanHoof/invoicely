<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\Invoices\StoreInvoiceAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Support\Facades\Auth;

class InvoiceStoreController extends Controller
{
    public function __invoke(StoreInvoiceRequest $request, StoreInvoiceAction $action)
    {
        $this->authorize('create', Invoice::class);

        $validated = $request->except('file');
        $user = Auth::user();

        $invoice = $action->execute($validated, $request->file('file'), $user->id, $user->team_id ?? null);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice created successfully.');
    }
}
