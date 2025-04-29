<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class InvoiceCreateController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('invoices/create');
    }
}
