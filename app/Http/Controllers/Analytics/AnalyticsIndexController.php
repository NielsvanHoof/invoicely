<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Queries\Analytics\FetchFinancialMetricsQuery;
use App\Queries\Analytics\FetchMonthlyRevenueQuery;
use App\Queries\Analytics\FetchStatusDistributionQuery;
use App\Queries\Analytics\FetchTopClientsQuery;
use Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsIndexController extends Controller
{
    public function __construct(
        private FetchFinancialMetricsQuery $fetchFinancialMetricsQuery,
        private FetchStatusDistributionQuery $fetchStatusDistributionQuery,
        private FetchMonthlyRevenueQuery $fetchMonthlyRevenueQuery,
        private FetchTopClientsQuery $fetchTopClientsQuery
    ) {}

    public function __invoke(): Response|RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! Gate::allows('view-analytics', $user)) {
            return redirect()->route('dashboard');
        }

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
