<?php

namespace App\Http\Controllers\Documents;

use App\Actions\Files\GetTemporaryUrlAction;
use App\Http\Controllers\Controller;
use App\Models\Document;

class DocumentDownloadController extends Controller
{
    public function __invoke(Document $document, GetTemporaryUrlAction $action)
    {
        $url = $action->execute($document->url);

        if (! $url) {
            return redirect()->back()->with('error', 'Failed to generate download link');
        }

        return redirect()->away($url);
    }
}
