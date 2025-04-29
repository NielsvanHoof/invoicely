<?php

namespace App\Listeners;

use App\Actions\Dashboard\GetDashboardStatsAction;
use App\Actions\Dashboard\GetLatestInvoicesAction;
use App\Actions\Dashboard\GetRecentActivityAction;
use App\Actions\Dashboard\GetUpcomingInvoicesAction;
use App\Events\InvalidateDashBoardCacheEvent;
use Illuminate\Contracts\Queue\ShouldQueue;

class InvalidateDashBoardCacheListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct(
        private GetDashboardStatsAction $getDashboardStatsAction,
        private GetLatestInvoicesAction $getLatestInvoicesAction,
        private GetUpcomingInvoicesAction $getUpcomingInvoicesAction,
        private GetRecentActivityAction $getRecentActivityAction
    ) {}

    /**
     * Handle the event.
     */
    public function handle(InvalidateDashBoardCacheEvent $event): void
    {
        $this->getDashboardStatsAction->invalidateCache($event->user, 'stats');
        $this->getLatestInvoicesAction->invalidateCache($event->user, 'latest-invoices');
        $this->getUpcomingInvoicesAction->invalidateCache($event->user, 'upcoming-invoices');
        $this->getRecentActivityAction->invalidateCache($event->user, 'recent-activity');
    }
}
