<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceEditController extends Controller
{
    public function __invoke(Invoice $invoice): Response
    {
        $this->authorize('update', $invoice);

        $invoice->load('reminders');

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
        ]);
    }
}
