<?php

namespace App\Listeners;

use App\Events\InvalidateAnalyticsCacheEvent;
use App\Queries\Analytics\FetchFinancialMetricsQuery;
use App\Queries\Analytics\FetchMonthlyRevenueQuery;
use App\Queries\Analytics\FetchStatusDistributionQuery;
use App\Queries\Analytics\FetchTopClientsQuery;

class InvalidateAnalyticsCacheListener
{
    public function __construct(
        private FetchFinancialMetricsQuery $fetchFinancialMetricsQuery,
        private FetchStatusDistributionQuery $fetchStatusDistributionQuery,
        private FetchMonthlyRevenueQuery $fetchMonthlyRevenueQuery,
        private FetchTopClientsQuery $fetchTopClientsQuery
    ) {}

    /**
     * Handle the event.
     */
    public function handle(InvalidateAnalyticsCacheEvent $event): void
    {
        $this->fetchFinancialMetricsQuery->invalidateCache($event->user, 'financial-metrics');
        $this->fetchStatusDistributionQuery->invalidateCache($event->user, 'status-distribution');
        $this->fetchMonthlyRevenueQuery->invalidateCache($event->user, 'monthly-revenue');
        $this->fetchTopClientsQuery->invalidateCache($event->user, 'top-clients');
    }
}
