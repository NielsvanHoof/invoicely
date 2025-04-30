<?php

namespace App\Http\Controllers\Documents;

use App\Actions\Files\StoreFileAction;
use App\Enums\DocumentType;
use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Invoice;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DocumentStoreController extends Controller
{

    public function __invoke(Request $request, Invoice $invoice, StoreFileAction $storeFileAction)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:2048'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(DocumentType::class)],
        ]);

        $filePath = $storeFileAction->execute(
            $validated['file'],
            Auth::id(),
            "documents/{$invoice->invoice_number}"
        );

        if (! $filePath) {
            return redirect()->back()->with('error', 'Failed to upload document');
        }

        Document::create([
            'name' => $validated['name'],
            'type' => 'document',
            'url' => $filePath,
            'size' => $validated['file']->getSize(),
            'mime_type' => $validated['file']->getMimeType(),
            'category' => $validated['category'],
            'invoice_id' => $invoice->id,
        ]);

        return redirect()->back()->with('success', 'Document uploaded successfully');
    }
}
