<?php

namespace App\Http\Controllers;

use App\Services\Analytics\AnalyticsService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function __construct(protected AnalyticsService $analyticsService)
    {
        //
    }

    /**
     * Display the analytics dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        $financialMetrics = $this->analyticsService->getFinancialMetrics($user);
        $statusDistribution = $this->analyticsService->getStatusDistribution($user);
        $monthlyRevenue = $this->analyticsService->getMonthlyRevenue($user);
        $topClients = $this->analyticsService->getTopClients($user);

        return Inertia::render('analytics', [
            'financialMetrics' => $financialMetrics,
            'statusDistribution' => $statusDistribution,
            'monthlyRevenue' => $monthlyRevenue,
            'topClients' => $topClients,
        ]);
    }
}