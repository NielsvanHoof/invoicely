<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;

class InvoiceUpdateController extends Controller
{
    public function __invoke(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

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
