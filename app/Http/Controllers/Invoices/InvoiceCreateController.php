<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceCreateController extends Controller
{
    public function __invoke(): Response
    {
        $this->authorize('create', Invoice::class);

        return Inertia::render('invoices/invoice.create');
    }
}
