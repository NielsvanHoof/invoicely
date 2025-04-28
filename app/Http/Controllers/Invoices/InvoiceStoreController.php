<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\StoreInvoiceRequest;
use Illuminate\Support\Facades\Auth;

class InvoiceStoreController extends Controller
{
    public function __invoke(StoreInvoiceRequest $request)
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
}
