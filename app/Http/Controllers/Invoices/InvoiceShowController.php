<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class InvoiceShowController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        return Inertia::render('invoices/invoice.show', [
            'invoice' => $invoice,
        ]);
    }
}
