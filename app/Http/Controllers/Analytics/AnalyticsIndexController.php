<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Queries\Analytics\FetchFinancialMetricsQuery;
use App\Queries\Analytics\FetchMonthlyRevenueQuery;
use App\Queries\Analytics\FetchStatusDistributionQuery;
use App\Queries\Analytics\FetchTopClientsQuery;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnalyticsIndexController extends Controller
{
    public function __construct(
        private FetchFinancialMetricsQuery $fetchFinancialMetricsQuery,
        private FetchStatusDistributionQuery $fetchStatusDistributionQuery,
        private FetchMonthlyRevenueQuery $fetchMonthlyRevenueQuery,
        private FetchTopClientsQuery $fetchTopClientsQuery
    ) {}

    public function __invoke()
    {
        $user = Auth::user();

        $financialMetrics = $this->fetchFinancialMetricsQuery->execute($user);
        $statusDistribution = $this->fetchStatusDistributionQuery->execute($user);
        $monthlyRevenue = $this->fetchMonthlyRevenueQuery->execute($user);
        $topClients = $this->fetchTopClientsQuery->execute($user);

        return Inertia::render('analytics', [
            'financialMetrics' => $financialMetrics,
            'statusDistribution' => $statusDistribution,
            'monthlyRevenue' => $monthlyRevenue,
            'topClients' => $topClients,
        ]);
    }
}
