<?php

namespace App\Actions\Invoices;

use App\Actions\Files\DeleteFileAction;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Invoice;
use App\Models\User;

class DeleteInvoiceAction
{
    public function __construct(
        private DeleteFileAction $deleteFileAction,
    ) {}

    public function execute(Invoice $invoice): bool
    {
        if ($invoice->file_path) {
            $this->deleteFileAction->execute($invoice->file_path);
        }

        $deleted = $invoice->delete();

        if ($deleted) {
            $user = User::find($invoice->user_id);

            InvalidateDashBoardCacheEvent::dispatch($user);
            InvalidateAnalyticsCacheEvent::dispatch($user);
        }

        return $deleted;
    }
}
