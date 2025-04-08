<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Invoice;
use App\Services\FileService;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function __construct(protected FileService $fileService) {}

    public function index(Invoice $invoice)
    {
        return Inertia::render('invoices/documents/index', [
            'invoice' => $invoice->load('documents'),
        ]);
    }

    public function store(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:2048',
            'name' => 'required|string|max:255',
        ]);

        $filePath = $this->fileService->storeFile(
            $validated['file'],
            Auth::id(),
            'documents'
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
            'invoice_id' => $invoice->id,
        ]);

        return redirect()->back()->with('success', 'Document uploaded successfully');
    }

    public function download(Invoice $invoice, Document $document)
    {
        $url = $this->fileService->getTemporaryUrl($document->file_path);

        if (! $url) {
            return redirect()->back()->with('error', 'Failed to generate download link');
        }

        return response()->json(['url' => $url]);
    }

    public function destroy(Invoice $invoice, Document $document)
    {
        $this->fileService->deleteFile($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', 'Document deleted successfully');
    }
}
