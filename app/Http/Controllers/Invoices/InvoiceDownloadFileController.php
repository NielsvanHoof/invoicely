<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;

class InvoiceDownloadFileController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        $this->authorize('downloadFile', $invoice);

        if (! $invoice->file_path) {
            return response()->json(['error' => 'No file attached to this invoice'], 404);
        }

        $temporaryUrl = $this->fileService->getTemporaryUrl($invoice->file_path);

        if (! $temporaryUrl) {
            return response()->json(['error' => 'Could not generate download link'], 500);
        }

        return response()->json(['url' => $temporaryUrl]);
    }
}
