<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\Invoices\BulkInvoiceAction;
use App\Data\Invoices\BulkInvoiceData;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class InvoiceBulkActionController extends Controller
{
    public function __invoke(BulkInvoiceData $data, BulkInvoiceAction $action)
    {
        $user = Auth::user();

        $result = $action->execute($data, $user);

        if (is_array($result)) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', 'Invoices updated successfully');
    }
}
