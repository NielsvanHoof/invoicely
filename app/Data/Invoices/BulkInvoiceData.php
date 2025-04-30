<?php

namespace App\Data\Invoices;

use Spatie\LaravelData\Data;

class BulkInvoiceData extends Data
{
    /**
     * @param  array<int>  $invoice_ids
     */
    public function __construct(
        public string $action,
        public array $invoice_ids,
    ) {}
}
