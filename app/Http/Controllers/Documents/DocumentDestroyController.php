<?php

namespace App\Http\Controllers\Documents;

use App\Actions\Files\DeleteFileAction;
use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;

class DocumentDestroyController extends Controller
{
    public function __invoke(Document $document, DeleteFileAction $action): RedirectResponse
    {
        $this->authorize('delete', $document);

        $action->execute($document->url);

        $document->delete();

        return redirect()->back()->with('success', 'Document deleted successfully');
    }
}
