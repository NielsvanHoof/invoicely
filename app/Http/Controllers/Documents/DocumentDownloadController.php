<?php

namespace App\Http\Controllers\Documents;

use App\Http\Controllers\Controller;
use App\Models\Document;

class DocumentDownloadController extends Controller
{
    public function __invoke(Document $document)
    {
        $url = $this->fileService->getTemporaryUrl($document->url);

        if (! $url) {
            return redirect()->back()->with('error', 'Failed to generate download link');
        }

        return response()->json(['url' => $url]);
    }
}
