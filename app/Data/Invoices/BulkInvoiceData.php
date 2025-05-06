<?php

namespace App\Data\Invoices;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BulkInvoiceData extends Data
{
    /**
     * @param  array<int>  $invoice_ids
     */
    public function __construct(
        public string $action,

        /** @var array<int> */
        public array $invoice_ids,
    ) {}
}
