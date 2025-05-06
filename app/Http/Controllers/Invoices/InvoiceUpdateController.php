<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\Invoices\UpdateInvoiceAction;
use App\Data\Invoices\UpdateInvoiceData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;

class InvoiceUpdateController extends Controller
{
    public function __invoke(UpdateInvoiceData $data, Invoice $invoice, UpdateInvoiceAction $action): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $action->execute($invoice, $data);

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }
}
