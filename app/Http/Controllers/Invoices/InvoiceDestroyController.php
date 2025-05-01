<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;

class InvoiceDestroyController extends Controller
{
    /**
     * Remove the specified resource from storage.
     */
    public function __invoke(Invoice $invoice)
    {
        $this->authorize('delete', $invoice);

        $this->invoiceService->deleteInvoice($invoice);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}
