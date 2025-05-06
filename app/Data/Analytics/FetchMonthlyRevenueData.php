<?php

namespace App\Data\Analytics;

use Spatie\LaravelData\Data;

class FetchMonthlyRevenueData extends Data
{
    public function __construct(
        public int $year,
        public int $month,
        public float $revenue,
    ) {}
}
