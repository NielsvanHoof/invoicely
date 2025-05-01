<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class InvoiceCreateController extends Controller
{
    public function __invoke()
    {
        $this->authorize('create', Invoice::class);

        return Inertia::render('invoices/create');
    }
}
