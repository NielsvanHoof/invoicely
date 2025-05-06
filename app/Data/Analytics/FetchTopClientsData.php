<?php

namespace App\Data\Analytics;

use Spatie\LaravelData\Data;

class FetchTopClientsData extends Data
{
    public function __construct(
        public string $client,
        public float $revenue,
    ) {}
}
