<?php

namespace App\Queries\Analytics;

use App\Data\Analytics\FetchFinancialMetricsData;
use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use App\Queries\BaseQuery;

class FetchFinancialMetricsQuery extends BaseQuery
{
    /**
     * Get financial metrics for the user.
     */
    public function execute(User $user): FetchFinancialMetricsData
    {
        return $this->getCachedData($user, 'financial-metrics', function () {
            $invoices = Invoice::query()->get();

            $totalOutstanding = $invoices
                ->whereIn('status', [InvoiceStatus::SENT, InvoiceStatus::OVERDUE])
                ->sum('amount');

            $paidInvoices = $invoices->where('status', InvoiceStatus::PAID);

            // Calculate average time to payment in days for paid invoices
            $avgTimeToPayment = 0;
            if ($paidInvoices->count() > 0) {
                $totalDays = 0;

                foreach ($paidInvoices as $invoice) {
                    $issuedDate = $invoice->issue_date;
                    $paidDate = $invoice->updated_at;
                    $totalDays += $issuedDate->diffInDays($paidDate);
                }
                $avgTimeToPayment = $totalDays / $paidInvoices->count();
            }

            $overduePercentage = 0;
            if ($invoices->count() > 0) {
                $overdueCount = $invoices->where('status', InvoiceStatus::OVERDUE)->count();
                $overduePercentage = ($overdueCount / $invoices->count()) * 100;
            }

            return FetchFinancialMetricsData::from([
                'totalOutstanding' => $totalOutstanding,
                'avgTimeToPayment' => round($avgTimeToPayment, 1),
                'overduePercentage' => round($overduePercentage, 1),
                'totalRevenue' => $paidInvoices->sum('amount'),
            ]);
        });
    }
}
