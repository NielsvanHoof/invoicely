<?php

namespace App\Data\Analytics;

use Spatie\LaravelData\Data;

class FetchStatusDistributionData extends Data
{
    public function __construct(
        public string $name,
        public int $value,
    ) {}
}
