<?php

namespace App\Data\Invoices;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

class FetchInvoicesData extends Data
{
    public function __construct(
        public ?string $search = null,

        public ?string $status = null,

        #[MapInputName('date_from')]
        public ?string $dateFrom = null,

        #[MapInputName('date_to')]
        public ?string $dateTo = null,

        #[MapInputName('amount_from')]
        public ?float $amountFrom = null,

        #[MapInputName('amount_to')]
        public ?float $amountTo = null,
    ) {}
}
