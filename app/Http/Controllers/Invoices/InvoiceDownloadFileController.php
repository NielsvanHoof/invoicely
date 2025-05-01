<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\Files\GetTemporaryUrlAction;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class InvoiceDownloadFileController extends Controller
{
    public function __invoke(Invoice $invoice, GetTemporaryUrlAction $action): RedirectResponse|JsonResponse
    {
        $this->authorize('downloadFile', $invoice);

        if (! $invoice->file_path) {
            return response()->json(['error' => 'No file attached to this invoice'], 404);
        }

        $temporaryUrl = $action->execute($invoice->file_path);

        if (! $temporaryUrl) {
            return response()->json(['error' => 'Could not generate download link'], 500);
        }

        return redirect()->away($temporaryUrl);
    }
}
