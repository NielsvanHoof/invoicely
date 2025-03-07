<?php

namespace App\Http\Controllers;

use App\Services\Dashboard\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService)
    {
        //
    }

    public function index()
    {
        $user = Auth::user();

        $stats = $this->dashboardService->getStats($user);
        $latestInvoices = $this->dashboardService->getLatestInvoices($user);
        $upcomingInvoices = $this->dashboardService->getUpcomingInvoices($user);
        $recentActivity = $this->dashboardService->getRecentActivity($user);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'latestInvoices' => $latestInvoices,
            'upcomingInvoices' => $upcomingInvoices,
            'recentActivity' => Inertia::defer(fn () => $recentActivity),
        ]);
    }
}
