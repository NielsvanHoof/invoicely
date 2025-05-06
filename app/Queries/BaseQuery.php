<?php

namespace App\Queries;

use App\Models\User;
use Closure;
use Illuminate\Support\Facades\Cache;

abstract class BaseQuery
{
    /**
     * Cache TTL in minutes
     */
    protected int $cacheTtl = 60;

    /**
     * Generate a cache key for a user and analytics type.
     */
    protected function getCacheKey(User $user, string $type): string
    {
        $userKey = $user->team_id ?? 'user-'.$user->id;

        return "analytics.{$userKey}.{$type}";
    }

    /**
     * Get cached data or compute it if not cached.
     *
     * @template T
     *
     * @param  Closure(): T  $compute
     * @return T
     */
    protected function getCachedData(User $user, string $type, Closure $compute): mixed
    {
        $cacheKey = $this->getCacheKey($user, $type);

        return Cache::remember($cacheKey, $this->cacheTtl, $compute);
    }

    /**
     * Invalidate cache for a specific analytics type.
     */
    public function invalidateCache(User $user, string $type): void
    {
        $cacheKey = $this->getCacheKey($user, $type);
        Cache::forget($cacheKey);
    }
}
