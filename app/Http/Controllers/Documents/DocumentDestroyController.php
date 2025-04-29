<?php

namespace App\Http\Controllers\Documents;

use App\Http\Controllers\Controller;
use App\Models\Document;

class DocumentDestroyController extends Controller
{
    public function __invoke(Document $document)
    {
        $this->fileService->deleteFile($document->url);

        $document->delete();

        return redirect()->back()->with('success', 'Document deleted successfully');
    }
}
