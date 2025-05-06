<?php

namespace App\Listeners;

use App\Events\InvalidateDashBoardCacheEvent;
use App\Queries\Dashboard\FetchDashboardStatsQuery;
use App\Queries\Dashboard\FetchLatestInvoicesQuery;
use App\Queries\Dashboard\FetchRecentActivityQuery;
use App\Queries\Dashboard\FetchUpcomingInvoicesQuery;
use Illuminate\Contracts\Queue\ShouldQueue;

class InvalidateDashBoardCacheListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct(
        private FetchDashboardStatsQuery $fetchDashboardStatsQuery,
        private FetchLatestInvoicesQuery $fetchLatestInvoicesQuery,
        private FetchUpcomingInvoicesQuery $fetchUpcomingInvoicesQuery,
        private FetchRecentActivityQuery $fetchRecentActivityQuery
    ) {}

    /**
     * Handle the event.
     */
    public function handle(InvalidateDashBoardCacheEvent $event): void
    {
        $this->fetchDashboardStatsQuery->invalidateCache($event->user, 'stats');
        $this->fetchLatestInvoicesQuery->invalidateCache($event->user, 'latest-invoices');
        $this->fetchUpcomingInvoicesQuery->invalidateCache($event->user, 'upcoming-invoices');
        $this->fetchRecentActivityQuery->invalidateCache($event->user, 'recent-activity');
    }
}
