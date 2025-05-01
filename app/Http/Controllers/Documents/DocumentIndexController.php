<?php

namespace App\Http\Controllers\Documents;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class DocumentIndexController extends Controller
{
    public function __invoke(Invoice $invoice): Response
    {
        return Inertia::render('invoices/documents/index', [
            'invoice' => $invoice,
        ]);
    }
}
