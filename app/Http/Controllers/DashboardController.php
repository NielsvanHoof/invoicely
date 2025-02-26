<?php

namespace App\Http\Controllers;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $totalInvoices = Cache::remember('total-invoices', 60, function () use ($user) {
            return Invoice::where('user_id', $user->id)->count();
        });

        $totalPaid = Cache::remember('total-paid', 60, function () use ($user) {
            return Invoice::where('user_id', $user->id)
                ->where('status', InvoiceStatus::PAID)
                ->sum('amount');
        });

        $totalOverdue = Cache::remember('total-overdue', 60, function () use ($user) {
            return Invoice::where('user_id', $user->id)
                ->where('status', InvoiceStatus::OVERDUE)
                ->sum('amount');
        });

        $totalPending = Cache::remember('total-pending', 60, function () use ($user) {
            return Invoice::where('user_id', $user->id)
                ->whereIn('status', [InvoiceStatus::DRAFT, InvoiceStatus::SENT])
                ->sum('amount');
        });

        $latestInvoices = Cache::remember('latest-invoices', 60, function () use ($user) {
            return Invoice::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get();
        });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalInvoices' => $totalInvoices,
                'totalPaid' => $totalPaid,
                'totalOverdue' => $totalOverdue,
                'totalPending' => $totalPending,
            ],
            'latestInvoices' => $latestInvoices,
        ]);
    }
}
