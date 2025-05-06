<?php

namespace App\Queries\Analytics;

use App\Data\Analytics\FetchMonthlyRevenueData;
use App\Enums\InvoiceStatus;
use App\Models\User;
use App\Queries\BaseQuery;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use stdClass;

class FetchMonthlyRevenueQuery extends BaseQuery
{
    /**
     * Get monthly revenue data for the last 6 months.
     *
     * @return non-empty-list<array{month: non-falsy-string, revenue: int|float}>
     */
    public function execute(User $user): array
    {
        return $this->getCachedData($user, 'monthly-revenue', function () {
            $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

            /** @var array<FetchMonthlyRevenueData> $monthlyRevenue */
            $monthlyRevenue = DB::table('invoices')
                ->where('status', InvoiceStatus::PAID->value)
                ->where('issue_date', '>=', $sixMonthsAgo)
                ->select([
                    DB::raw('CAST(EXTRACT(YEAR FROM issue_date) AS INTEGER) as year'),
                    DB::raw('CAST(EXTRACT(MONTH FROM issue_date) AS INTEGER) as month'),
                    DB::raw('CAST(SUM(amount) AS DECIMAL(10,2)) as revenue'),
                ])
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get()
                ->map(fn (stdClass $record) => FetchMonthlyRevenueData::from([
                    'year' => (int) $record->year,
                    'month' => (int) $record->month,
                    'revenue' => (float) $record->revenue,
                ]))
                ->all();

            $result = [];
            // Initialize with zero values for all months
            for ($i = 0; $i < 6; $i++) {
                $date = Carbon::now()->subMonths(5 - $i)->startOfMonth();
                $result[] = [
                    'month' => $date->format('M Y'),
                    'revenue' => 0.0,
                ];
            }

            // Fill in actual values
            foreach ($monthlyRevenue as $record) {
                $date = Carbon::createFromDate($record->year, $record->month, 1);
                foreach ($result as &$item) {
                    if ($item['month'] === $date->format('M Y')) {
                        $item['revenue'] = $record->revenue;
                        break;
                    }
                }
            }

            return $result;
        });
    }
}
