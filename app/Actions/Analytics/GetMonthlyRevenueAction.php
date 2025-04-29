<?php

namespace App\Actions\Analytics;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GetMonthlyRevenueAction extends BaseAnalyticsAction
{
    /**
     * Get monthly revenue data for the last 6 months.
     *
     * @return array<int, array{month: string, revenue: float}>
     */
    public function execute(User $user): array
    {
        return $this->getCachedData($user, 'monthly-revenue', function () {
            $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

            $monthlyRevenue = Invoice::query()
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
}
