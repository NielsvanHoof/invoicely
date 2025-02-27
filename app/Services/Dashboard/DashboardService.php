<?php

namespace App\Services\Dashboard;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    /**
     * Get dashboard statistics for a user.
     *
     * @return array<string, int|float>
     */
    public function getStats(User $user): array
    {
        $cacheKey = $this->getCacheKey($user, 'stats');

        return Cache::remember($cacheKey, 60, function () use ($user) {
            return [
                'totalInvoices' => $this->getTotalInvoices($user),
                'totalPaid' => $this->getTotalByStatus($user, InvoiceStatus::PAID),
                'totalOverdue' => $this->getTotalByStatus($user, InvoiceStatus::OVERDUE),
                'totalPending' => $this->getTotalPendingAmount($user),
            ];
        });
    }

    /**
     * Get latest invoices for a user.
     *
     * @return Collection<int, Invoice>
     */
    public function getLatestInvoices(User $user, int $limit = 5): Collection
    {
        $cacheKey = $this->getCacheKey($user, 'latest-invoices');

        return Cache::remember($cacheKey, 60, function () use ($user, $limit) {
            return Invoice::query()
                ->forUser($user)
                ->latest()
                ->take($limit)
                ->get();
        });
    }

    /**
     * Get total number of invoices for a user.
     */
    protected function getTotalInvoices(User $user): int
    {
        return Invoice::query()->forUser($user)->count();
    }

    /**
     * Get total amount for invoices with a specific status.
     */
    protected function getTotalByStatus(User $user, InvoiceStatus $status): float
    {
        return Invoice::query()
            ->forUser($user)
            ->where('status', $status)
            ->sum('amount');
    }

    /**
     * Get total amount for pending invoices (draft or sent).
     */
    protected function getTotalPendingAmount(User $user): float
    {
        return Invoice::query()
            ->forUser($user)
            ->whereIn('status', [InvoiceStatus::DRAFT, InvoiceStatus::SENT])
            ->sum('amount');
    }

    /**
     * Generate a cache key for the user and type.
     */
    protected function getCacheKey(User $user, string $type): string
    {
        $contextId = $user->team_id ?? $user->id;
        $contextType = $user->team_id ? 'team' : 'user';

        return "dashboard.{$contextType}.{$contextId}.{$type}";
    }
}
