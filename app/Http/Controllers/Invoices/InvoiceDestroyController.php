<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\Invoices\DeleteInvoiceAction;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;

class InvoiceDestroyController extends Controller
{
    /**
     * Remove the specified resource from storage.
     */
    public function __invoke(Invoice $invoice, DeleteInvoiceAction $action): RedirectResponse
    {
        $this->authorize('delete', $invoice);

        $deleted = $action->execute($invoice);

        if (! $deleted) {
            return redirect()->route('invoices.index')
                ->with('error', 'Failed to delete invoice.');
        }

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}
