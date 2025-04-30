<?php

namespace App\Http\Controllers\Documents;

use App\Actions\Files\StoreFileAction;
use App\Data\Documents\StoreDocumentData;
use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Invoice;
use Auth;

class DocumentStoreController extends Controller
{
    public function __invoke(StoreDocumentData $data, Invoice $invoice, StoreFileAction $storeFileAction)
    {
        $filePath = $storeFileAction->execute(
            $data->file,
            Auth::id(),
            "documents/{$invoice->invoice_number}"
        );

        if (! $filePath) {
            return redirect()->back()->with('error', 'Failed to upload document');
        }

        Document::create([
            'name' => $data->name,
            'type' => 'document',
            'url' => $filePath,
            'size' => $data->file->getSize(),
            'mime_type' => $data->file->getMimeType(),
            'category' => $data->category,
            'invoice_id' => $invoice->id,
        ]);

        return redirect()->back()->with('success', 'Document uploaded successfully');
    }
}
