<?php

namespace App\Services\Analytics;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get key financial metrics.
     *
     * @return array<string, float|int>
     */
    public function getFinancialMetrics(User $user): array
    {
        $cacheKey = $this->getCacheKey($user, 'financial-metrics');

        return Cache::remember($cacheKey, 60, function () use ($user) {
            $invoices = Invoice::query()
                ->forUser($user)
                ->get();

            $totalOutstanding = $invoices
                ->whereIn('status', [InvoiceStatus::SENT->value, InvoiceStatus::OVERDUE->value])
                ->sum('amount');

            $paidInvoices = $invoices->where('status', InvoiceStatus::PAID->value);

            // Calculate average time to payment in days for paid invoices
            $avgTimeToPayment = 0;
            if ($paidInvoices->count() > 0) {
                $totalDays = 0;

                /** @var Invoice $invoice */
                foreach ($paidInvoices as $invoice) {
                    // Using created_at as a proxy for when the invoice was generated
                    // In a real app, you might want to use the date the invoice was changed to 'sent' status
                    $issuedDate = $invoice->issue_date;
                    $paidDate = $invoice->updated_at; // Assuming updated_at reflects when it was marked paid
                    $totalDays += $issuedDate->diffInDays($paidDate);
                }
                $avgTimeToPayment = $totalDays / $paidInvoices->count();
            }

            $overduePercentage = 0;
            if ($invoices->count() > 0) {
                $overdueCount = $invoices->where('status', InvoiceStatus::OVERDUE->value)->count();
                $overduePercentage = ($overdueCount / $invoices->count()) * 100;
            }

            return [
                'totalOutstanding' => $totalOutstanding,
                'avgTimeToPayment' => round($avgTimeToPayment, 1),
                'overduePercentage' => round($overduePercentage, 1),
                'totalRevenue' => $paidInvoices->sum('amount'),
            ];
        });
    }

    /**
     * Get invoice status distribution.
     *
     * @return array<int, array{name: string, value: int}>
     */
    public function getStatusDistribution(User $user): array
    {
        $cacheKey = $this->getCacheKey($user, 'status-distribution');

        return Cache::remember($cacheKey, 60, function () use ($user) {
            $statusCounts = Invoice::query()
                ->forUser($user)
                ->select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            $result = [];
            foreach (InvoiceStatus::cases() as $status) {
                $result[] = [
                    'name' => ucfirst($status->value),
                    'value' => $statusCounts[$status->value] ?? 0,
                ];
            }

            return $result;
        });
    }

    /**
     * Get monthly revenue data for the last 6 months.
     *
     * @return array<int, array{month: string, revenue: float}>
     */
    public function getMonthlyRevenue(User $user): array
    {
        $cacheKey = $this->getCacheKey($user, 'monthly-revenue');

        return Cache::remember($cacheKey, 60, function () use ($user) {
            $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

            $monthlyRevenue = Invoice::query()
                ->forUser($user)
                ->where('status', InvoiceStatus::PAID->value)
                ->where('issue_date', '>=', $sixMonthsAgo)
                ->select(
                    DB::raw('EXTRACT(YEAR FROM issue_date) as year'),
                    DB::raw('EXTRACT(MONTH FROM issue_date) as month'),
                    DB::raw('SUM(amount) as revenue')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            $result = [];
            // Initialize with zero values for all months
            for ($i = 0; $i < 6; $i++) {
                $date = Carbon::now()->subMonths(5 - $i)->startOfMonth();
                $result[] = [
                    'month' => $date->format('M Y'),
                    'revenue' => 0,
                ];
            }

            // Fill in actual values
            foreach ($monthlyRevenue as $record) {
                $date = Carbon::createFromDate($record->year, $record->month, 1);
                foreach ($result as &$item) {
                    if ($item['month'] === $date->format('M Y')) {
                        $item['revenue'] = (float) $record->revenue;
                        break;
                    }
                }
            }

            return $result;
        });
    }

    /**
     * Get top clients by revenue.
     *
     * @return array<int, array{client: string, revenue: float}>
     */
    public function getTopClients(User $user, int $limit = 5): array
    {
        $cacheKey = $this->getCacheKey($user, 'top-clients');

        return Cache::remember($cacheKey, 60, function () use ($user, $limit) {
            return Invoice::query()
                ->forUser($user)
                ->where('status', InvoiceStatus::PAID->value)
                ->select('client_name', DB::raw('SUM(amount) as revenue'))
                ->groupBy('client_name')
                ->orderByDesc('revenue')
                ->limit($limit)
                ->get()
                ->map(function ($item) {
                    return [
                        'client' => $item->client_name,
                        'revenue' => (float) $item->revenue,
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Invalidate all analytics cache for a user.
     */
    public function invalidateCache(User $user): void
    {
        $cacheKeys = [
            $this->getCacheKey($user, 'financial-metrics'),
            $this->getCacheKey($user, 'status-distribution'),
            $this->getCacheKey($user, 'monthly-revenue'),
            $this->getCacheKey($user, 'top-clients'),
        ];

        foreach ($cacheKeys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Generate a cache key for a user and analytics type.
     */
    protected function getCacheKey(User $user, string $type): string
    {
        $userKey = $user->team_id ?? 'user-'.$user->id;

        return "analytics.{$userKey}.{$type}";
    }
}
