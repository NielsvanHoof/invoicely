<?php

namespace App\Actions\Invoices;

use App\Actions\Files\DeleteFileAction;
use App\Data\Invoices\BulkInvoiceData;
use App\Enums\InvoiceStatus;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Invoice;
use App\Models\User;

class BulkDeleteInvoicesAction
{
    public function __construct(
        private DeleteFileAction $deleteFileAction,
    ) {}

    /**
     * Delete multiple invoices.
     *
     * @return array{deletedCount: int, failedCount: int|array{deletedCount: mixed, failedCount: int}}
     */
    public function execute(BulkInvoiceData $data, User $user): array
    {
        $invoices = Invoice::query()->whereIn('id', $data->invoice_ids)->get();
        $deletedCount = 0;
        $failedCount = 0;

        $deletableInvoices = $invoices->filter(fn (Invoice $invoice) => $invoice->status !== InvoiceStatus::PAID);

        $failedCount = count($data->invoice_ids) - $deletableInvoices->count();

        if ($deletableInvoices->isEmpty()) {
            return ['deletedCount' => 0, 'failedCount' => $failedCount];
        }

        foreach ($deletableInvoices as $invoice) {
            if ($invoice->file_path) {
                $this->deleteFileAction->execute($invoice->file_path);
            }
        }

        $deletedCount = Invoice::query()->whereIn('id', $deletableInvoices->pluck('id')->toArray())->delete();

        if ($deletedCount > 0) {
            InvalidateDashBoardCacheEvent::dispatch($user);
            InvalidateAnalyticsCacheEvent::dispatch($user);
        }

        return ['deletedCount' => $deletedCount, 'failedCount' => $failedCount];
    }
}
