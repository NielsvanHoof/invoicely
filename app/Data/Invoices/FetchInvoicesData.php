<?php

namespace App\Data\Invoices;

use Spatie\LaravelData\Data;

class FetchInvoicesData extends Data
{
    public function __construct(
        public ?string $search = null,

        public ?string $sort_field = 'created_at',

        public ?string $sort_direction = 'desc',

        public ?string $status = null,

        public ?string $date_from = null,

        public ?string $date_to = null,

        public ?float $amount_from = null,

        public ?float $amount_to = null,
    ) {}
}
