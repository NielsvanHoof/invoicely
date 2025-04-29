<?php

namespace App\Http\Controllers\Documents;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class DocumentIndexController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        return Inertia::render('invoices/documents/index', [
            'invoice' => $invoice,
        ]);
    }
}
