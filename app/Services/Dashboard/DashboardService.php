<?php

namespace App\Services\Dashboard;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\Reminder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    /**
     * Cache TTL in minutes
     */
    protected int $cacheTtl = 60;

    /**
     * Get dashboard statistics for a user.
     *
     * @return array<string, int|float>
     */
    public function getStats(User $user): array
    {
        $cacheKey = $this->getCacheKey($user, 'stats');

        return Cache::remember($cacheKey, $this->cacheTtl, fn () => [
            'totalInvoices' => $this->getTotalInvoices($user),
            'totalPaid' => $this->getTotalByStatus($user, InvoiceStatus::PAID),
            'totalOverdue' => $this->getTotalByStatus($user, InvoiceStatus::OVERDUE),
            'totalPending' => $this->getTotalPendingAmount($user),
            'totalOutstanding' => $this->getTotalOutstandingAmount($user),
            'overdueCount' => $this->getOverdueInvoiceCount($user),
            'upcomingCount' => $this->getUpcomingInvoiceCount($user),
            'averageDaysOverdue' => $this->getAverageDaysOverdue($user),
        ]);
    }

    /**
     * Get latest invoices for a user.
     *
     * @return Collection<int, Invoice>
     */
    public function getLatestInvoices(User $user, int $limit = 5): Collection
    {
        $cacheKey = $this->getCacheKey($user, 'latest-invoices');

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($limit) {
            return Invoice::query()
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

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($limit) {
            return Invoice::query()
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

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($limit) {
            // Get recent invoices (created or updated)
            $recentInvoices = Invoice::query()
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

            // Get recent reminders
            $recentReminders = Reminder::query()
                ->with('invoice')
                ->latest('created_at')
                ->take($limit)
                ->get()
                ->map(function (Reminder $reminder) {
                    return [
                        'id' => $reminder->invoice->id,
                        'reminder_id' => $reminder->id,
                        'type' => 'reminder',
                        'reminder_type' => $reminder->type,
                        'invoice_number' => $reminder->invoice->invoice_number,
                        'client_name' => $reminder->invoice->client_name,
                        'amount' => $reminder->invoice->amount,
                        'status' => $reminder->invoice->status,
                        'sent_at' => $reminder->sent_at ? $reminder->sent_at->toIso8601String() : null,
                        'scheduled_date' => $reminder->scheduled_date->toIso8601String(),
                        // Store dates as ISO 8601 formatted strings
                        'date' => $reminder->created_at->toIso8601String(),
                        // Add a timestamp for sorting
                        'timestamp' => $reminder->created_at->timestamp,
                    ];
                })
                ->toArray();

            $allActivity = array_merge($recentInvoices, $recentReminders);
            usort($allActivity, function ($a, $b) {
                return $b['timestamp'] - $a['timestamp'];
            });

            return array_slice($allActivity, 0, $limit);
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
        return Invoice::query()->count();
    }

    /**
     * Get total amount for invoices with a specific status.
     */
    protected function getTotalByStatus(User $user, InvoiceStatus $status): float
    {
        return Invoice::query()
            ->where('status', $status)
            ->sum('amount');
    }

    /**
     * Get total amount for pending invoices (draft or sent).
     */
    protected function getTotalPendingAmount(User $user): float
    {
        return Invoice::query()
            ->whereIn('status', [InvoiceStatus::DRAFT, InvoiceStatus::SENT])
            ->sum('amount');
    }

    /**
     * Get total outstanding amount (pending + overdue).
     */
    protected function getTotalOutstandingAmount(User $user): float
    {
        return Invoice::query()
            ->whereIn('status', [InvoiceStatus::DRAFT, InvoiceStatus::SENT, InvoiceStatus::OVERDUE])
            ->sum('amount');
    }

    /**
     * Get count of overdue invoices.
     */
    protected function getOverdueInvoiceCount(User $user): int
    {
        return Invoice::query()
            ->where('status', InvoiceStatus::OVERDUE)
            ->count();
    }

    /**
     * Get count of upcoming invoices.
     */
    protected function getUpcomingInvoiceCount(User $user): int
    {
        return Invoice::query()
            ->whereDate('due_date', '>=', now())
            ->whereDate('due_date', '<=', now()->addDays(7))
            ->whereNotIn('status', [InvoiceStatus::PAID])
            ->count();
    }

    /**
     * Get average days overdue for overdue invoices.
     */
    protected function getAverageDaysOverdue(User $user): int
    {
        $overdueInvoices = Invoice::query()
            ->where('status', InvoiceStatus::OVERDUE)
            ->get();

        if ($overdueInvoices->isEmpty()) {
            return 0;
        }

        $totalDaysOverdue = 0;
        $now = Carbon::now();

        foreach ($overdueInvoices as $invoice) {
            $dueDate = Carbon::parse($invoice->due_date);
            $totalDaysOverdue += $now->diffInDays($dueDate);
        }

        return (int) round($totalDaysOverdue / $overdueInvoices->count());
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
