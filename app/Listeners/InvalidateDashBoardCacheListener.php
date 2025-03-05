<?php

namespace App\Listeners;

use App\Events\InvalidateDashBoardCacheEvent;
use App\Services\Dashboard\DashboardService;
use Illuminate\Contracts\Queue\ShouldQueue;

class InvalidateDashBoardCacheListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct(protected DashboardService $dashboardService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(InvalidateDashBoardCacheEvent $event): void
    {
        $this->dashboardService->invalidateCache($event->user);
    }
}
