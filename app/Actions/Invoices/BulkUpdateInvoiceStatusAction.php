<?php

namespace App\Actions\Invoices;

use App\Data\Invoices\BulkInvoiceData;
use App\Enums\InvoiceStatus;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Invoice;
use App\Models\User;

class BulkUpdateInvoiceStatusAction
{
    public function execute(BulkInvoiceData $data, InvoiceStatus $status, User $user): int
    {
        $updateData = ['status' => $status];

        $updateData['paid_at'] = ($status === InvoiceStatus::PAID) ? now() : null;

        $count = Invoice::whereIn('id', $data->invoice_ids)
            ->whereNot('status', $status)
            ->update($updateData);

        InvalidateDashBoardCacheEvent::dispatch($user);
        InvalidateAnalyticsCacheEvent::dispatch($user);

        return $count;
    }
}
