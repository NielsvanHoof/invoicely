<?php

namespace App\Data\Analytics;

use Spatie\LaravelData\Data;

class FetchFinancialMetricsData extends Data
{
    public function __construct(
        public float $totalOutstanding,
        public float $avgTimeToPayment,
        public float $overduePercentage,
        public float $totalRevenue,
    ) {}
}
