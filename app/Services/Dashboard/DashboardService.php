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
     * Get upcoming invoices for a user (due in the future and not paid).
     *
     * @return Collection<int, Invoice>
     */
    public function getUpcomingInvoices(User $user, int $limit = 5): Collection
    {
        $cacheKey = $this->getCacheKey($user, 'upcoming-invoices');

        return Cache::remember($cacheKey, 60, function () use ($user, $limit) {
            return Invoice::query()
                ->forUser($user)
                ->whereDate('due_date', '>=', now())
                ->whereNotIn('status', [InvoiceStatus::PAID])
                ->orderBy('due_date')
                ->take($limit)
                ->get();
        });
    }

    /**
     * Get recent activity for a user.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getRecentActivity(User $user, int $limit = 10): array
    {
        $cacheKey = $this->getCacheKey($user, 'recent-activity');

        return Cache::remember($cacheKey, 60, function () use ($user, $limit) {
            // Get recent invoices (created or updated)
            $recentInvoices = Invoice::query()
                ->forUser($user)
                ->latest('updated_at')
                ->take($limit)
                ->get()
                ->map(function (Invoice $invoice) {
                    $isNew = $invoice->created_at->diffInHours($invoice->updated_at) < 1;
                    $date = $isNew ? $invoice->created_at : $invoice->updated_at;

                    return [
                        'id' => $invoice->id,
                        'type' => $isNew ? 'created' : 'updated',
                        'invoice_number' => $invoice->invoice_number,
                        'client_name' => $invoice->client_name,
                        'amount' => $invoice->amount,
                        'status' => $invoice->status,
                        // Store dates as ISO 8601 formatted strings
                        'date' => $date->toIso8601String(),
                        // Add a timestamp for sorting
                        'timestamp' => $date->timestamp,
                    ];
                })
                ->toArray();

            // Sort by timestamp (most recent first)
            usort($recentInvoices, function ($a, $b) {
                return $b['timestamp'] - $a['timestamp'];
            });

            return array_slice($recentInvoices, 0, $limit);
        });
    }

    /**
     * Invalidate the cache for a user.
     */
    public function invalidateCache(User $user): void
    {
        Cache::forget($this->getCacheKey($user, 'stats'));
        Cache::forget($this->getCacheKey($user, 'latest-invoices'));
        Cache::forget($this->getCacheKey($user, 'upcoming-invoices'));
        Cache::forget($this->getCacheKey($user, 'recent-activity'));
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
