<?php

namespace App\Http\Controllers;

use App\Queries\Dashboard\FetchDashboardStatsQuery;
use App\Queries\Dashboard\FetchLatestInvoicesQuery;
use App\Queries\Dashboard\FetchRecentActivityQuery;
use App\Queries\Dashboard\FetchUpcomingInvoicesQuery;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private FetchDashboardStatsQuery $fetchDashboardStatsQuery,
        private FetchLatestInvoicesQuery $fetchLatestInvoicesQuery,
        private FetchUpcomingInvoicesQuery $fetchUpcomingInvoicesQuery,
        private FetchRecentActivityQuery $fetchRecentActivityQuery
    ) {}

    public function index(): Response
    {
        $user = Auth::user();

        $stats = $this->fetchDashboardStatsQuery->execute($user);
        $latestInvoices = $this->fetchLatestInvoicesQuery->execute($user);
        $upcomingInvoices = $this->fetchUpcomingInvoicesQuery->execute($user);
        $recentActivity = $this->fetchRecentActivityQuery->execute($user);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'latestInvoices' => $latestInvoices,
            'upcomingInvoices' => $upcomingInvoices,
            'recentActivity' => Inertia::defer(fn () => $recentActivity),
        ]);
    }
}
