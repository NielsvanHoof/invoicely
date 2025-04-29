<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class InvoiceEditController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        $invoice->load('reminders');

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
        ]);
    }
}
