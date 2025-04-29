<?php

namespace App\Actions\Dashboard;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;

class GetDashboardStatsAction extends BaseDashboardAction
{
    /**
     * Get dashboard statistics for a user.
     *
     * @return array<string, int|float>
     */
    public function execute(User $user): array
    {
        return $this->getCachedData($user, 'stats', function () {
            return [
                'totalInvoices' => $this->getTotalInvoices(),
                'totalPaid' => $this->getTotalByStatus(InvoiceStatus::PAID),
                'totalOverdue' => $this->getTotalByStatus(InvoiceStatus::OVERDUE),
                'totalPending' => $this->getTotalPendingAmount(),
                'totalOutstanding' => $this->getTotalOutstandingAmount(),
                'overdueCount' => $this->getOverdueInvoiceCount(),
                'upcomingCount' => $this->getUpcomingInvoiceCount(),
                'averageDaysOverdue' => $this->getAverageDaysOverdue(),
            ];
        });
    }

    /**
     * Get total number of invoices.
     */
    protected function getTotalInvoices(): int
    {
        return Invoice::query()->count();
    }

    /**
     * Get total amount for invoices with a specific status.
     */
    protected function getTotalByStatus(InvoiceStatus $status): float
    {
        return Invoice::query()
            ->where('status', $status)
            ->sum('amount');
    }

    /**
     * Get total amount for pending invoices (draft or sent).
     */
    protected function getTotalPendingAmount(): float
    {
        return Invoice::query()
            ->whereIn('status', [InvoiceStatus::DRAFT, InvoiceStatus::SENT])
            ->sum('amount');
    }

    /**
     * Get total outstanding amount (pending + overdue).
     */
    protected function getTotalOutstandingAmount(): float
    {
        return Invoice::query()
            ->whereIn('status', [InvoiceStatus::DRAFT, InvoiceStatus::SENT, InvoiceStatus::OVERDUE])
            ->sum('amount');
    }

    /**
     * Get count of overdue invoices.
     */
    protected function getOverdueInvoiceCount(): int
    {
        return Invoice::query()
            ->where('status', InvoiceStatus::OVERDUE)
            ->count();
    }

    /**
     * Get count of upcoming invoices.
     */
    protected function getUpcomingInvoiceCount(): int
    {
        return Invoice::query()
            ->whereDate('due_date', '>=', now())
            ->whereDate('due_date', '<=', now()->addDays(7))
            ->whereNotIn('status', [InvoiceStatus::PAID])
            ->count();
    }

    /**
     * Get average days overdue for overdue invoices.
     */
    protected function getAverageDaysOverdue(): int
    {
        $overdueInvoices = Invoice::query()
            ->where('status', InvoiceStatus::OVERDUE)
            ->get();

        if ($overdueInvoices->isEmpty()) {
            return 0;
        }

        $totalDaysOverdue = 0;
        $now = Carbon::now();

        foreach ($overdueInvoices as $invoice) {
            $dueDate = Carbon::parse($invoice->due_date);
            $totalDaysOverdue += $now->diffInDays($dueDate);
        }

        return (int) round($totalDaysOverdue / $overdueInvoices->count());
    }
}
