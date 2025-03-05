<?php

namespace App\Listeners;

use App\Events\InvalidateAnalyticsCacheEvent;
use App\Services\Analytics\AnalyticsService;

class InvalidateAnalyticsCacheListener
{
    /**
     * Create the event listener.
     */
    public function __construct(protected AnalyticsService $analyticsService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(InvalidateAnalyticsCacheEvent $event): void
    {
        $this->analyticsService->invalidateCache($event->user);
    }
}
