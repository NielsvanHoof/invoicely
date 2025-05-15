<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\Invoices\BulkInvoiceAction;
use App\Data\Invoices\BulkInvoiceData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class InvoiceBulkActionController extends Controller
{
    public function __invoke(BulkInvoiceData $data, BulkInvoiceAction $action): RedirectResponse
    {
        $this->authorize('bulkAction', Invoice::class);

        $user = Auth::user();

        $result = $action->execute($data, $user);

        if (isset($result['error'])) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', 'Invoices updated successfully');
    }
}
