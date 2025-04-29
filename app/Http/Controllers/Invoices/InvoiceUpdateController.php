<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Models\Invoice;

class InvoiceUpdateController extends Controller
{
    public function __invoke(UpdateInvoiceRequest $request, Invoice $invoice)
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
}
