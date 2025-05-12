<?php

namespace App\Http\Controllers\Documents;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Invoice;
use App\Queries\Documents\FetchDocumentsQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentIndexController extends Controller
{
    public function __invoke(Request $request, Invoice $invoice, FetchDocumentsQuery $fetchDocumentsQuery): Response
    {
        $this->authorize('viewAny', Document::class);

        $documents = $fetchDocumentsQuery->execute(
            invoice: $invoice,
            search: $request->input('search'),
            category: $request->input('category')
        )->latest()->paginate(10);

        return Inertia::render('invoices/documents/document.index', [
            'invoice' => $invoice,
            'documents' => $documents,
            'search' => $request->input('search'),
            'filters' => [
                'category' => $request->input('category'),
            ],
        ]);
    }
}
