<?php

namespace App\Actions\Dashboard;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

abstract class BaseDashboardAction
{
    /**
     * Cache TTL in minutes
     */
    protected int $cacheTtl = 60;

    /**
     * Generate a cache key for a user and dashboard type.
     */
    protected function getCacheKey(User $user, string $type): string
    {
        $contextId = $user->team_id ?? $user->id;
        $contextType = $user->team_id ? 'team' : 'user';

        return "dashboard.{$contextType}.{$contextId}.{$type}";
    }

    /**
     * Get cached data or compute it if not cached.
     */
    protected function getCachedData(User $user, string $type, callable $compute): mixed
    {
        $cacheKey = $this->getCacheKey($user, $type);

        return Cache::remember($cacheKey, $this->cacheTtl, $compute);
    }

    /**
     * Invalidate cache for a specific dashboard type.
     */
    public function invalidateCache(User $user, string $type): void
    {
        $cacheKey = $this->getCacheKey($user, $type);
        Cache::forget($cacheKey);
    }
}
