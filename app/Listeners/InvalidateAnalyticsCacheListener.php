<?php

namespace App\Listeners;

use App\Actions\Analytics\GetFinancialMetricsAction;
use App\Actions\Analytics\GetMonthlyRevenueAction;
use App\Actions\Analytics\GetStatusDistributionAction;
use App\Actions\Analytics\GetTopClientsAction;
use App\Events\InvalidateAnalyticsCacheEvent;

class InvalidateAnalyticsCacheListener
{
    public function __construct(
        private GetFinancialMetricsAction $getFinancialMetricsAction,
        private GetStatusDistributionAction $getStatusDistributionAction,
        private GetMonthlyRevenueAction $getMonthlyRevenueAction,
        private GetTopClientsAction $getTopClientsAction
    ) {}

    /**
     * Handle the event.
     */
    public function handle(InvalidateAnalyticsCacheEvent $event): void
    {
        $this->getFinancialMetricsAction->invalidateCache($event->user, 'financial-metrics');
        $this->getStatusDistributionAction->invalidateCache($event->user, 'status-distribution');
        $this->getMonthlyRevenueAction->invalidateCache($event->user, 'monthly-revenue');
        $this->getTopClientsAction->invalidateCache($event->user, 'top-clients');
    }
}
