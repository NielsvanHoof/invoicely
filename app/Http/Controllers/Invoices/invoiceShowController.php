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

        $invoice->load('reminders');

        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
        ]);
    }
}