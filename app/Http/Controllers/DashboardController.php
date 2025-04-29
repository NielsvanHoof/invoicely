<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\GetDashboardStatsAction;
use App\Actions\Dashboard\GetLatestInvoicesAction;
use App\Actions\Dashboard\GetRecentActivityAction;
use App\Actions\Dashboard\GetUpcomingInvoicesAction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private GetDashboardStatsAction $getDashboardStatsAction,
        private GetLatestInvoicesAction $getLatestInvoicesAction,
        private GetUpcomingInvoicesAction $getUpcomingInvoicesAction,
        private GetRecentActivityAction $getRecentActivityAction
    ) {}

    public function index()
    {
        $user = Auth::user();

        $stats = $this->getDashboardStatsAction->execute($user);
        $latestInvoices = $this->getLatestInvoicesAction->execute($user);
        $upcomingInvoices = $this->getUpcomingInvoicesAction->execute($user);
        $recentActivity = $this->getRecentActivityAction->execute($user);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'latestInvoices' => $latestInvoices,
            'upcomingInvoices' => $upcomingInvoices,
            'recentActivity' => Inertia::defer(fn () => $recentActivity),
        ]);
    }
}
