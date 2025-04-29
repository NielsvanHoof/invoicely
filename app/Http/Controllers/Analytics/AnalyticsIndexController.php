<?php

namespace App\Http\Controllers\Analytics;

use App\Actions\Analytics\GetFinancialMetricsAction;
use App\Actions\Analytics\GetMonthlyRevenueAction;
use App\Actions\Analytics\GetStatusDistributionAction;
use App\Actions\Analytics\GetTopClientsAction;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnalyticsIndexController extends Controller
{
    public function __construct(
        private GetFinancialMetricsAction $getFinancialMetricsAction,
        private GetStatusDistributionAction $getStatusDistributionAction,
        private GetMonthlyRevenueAction $getMonthlyRevenueAction,
        private GetTopClientsAction $getTopClientsAction
    ) {}

    public function __invoke()
    {
        $user = Auth::user();

        $financialMetrics = $this->getFinancialMetricsAction->execute($user);
        $statusDistribution = $this->getStatusDistributionAction->execute($user);
        $monthlyRevenue = $this->getMonthlyRevenueAction->execute($user);
        $topClients = $this->getTopClientsAction->execute($user);

        return Inertia::render('analytics', [
            'financialMetrics' => $financialMetrics,
            'statusDistribution' => $statusDistribution,
            'monthlyRevenue' => $monthlyRevenue,
            'topClients' => $topClients,
        ]);
    }
}
