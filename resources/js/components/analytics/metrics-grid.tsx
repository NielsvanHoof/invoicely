import { FinancialMetrics } from '@/types/analytics';
import { MetricsCard } from './metrics-card';

interface MetricsGridProps {
    metrics: FinancialMetrics;
    currency: string;
}

export function MetricsGrid({ metrics, currency }: MetricsGridProps) {
    return (
        <div className="grid auto-rows-min grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
            <MetricsCard
                title="Outstanding Balance"
                value={metrics.totalOutstanding}
                description="Total amount pending from clients"
                trend={5}
                isInverse={true}
                currency={currency}
            />
            <MetricsCard
                title="Payment Time"
                value={`${metrics.avgTimeToPayment} days`}
                description="Average time to receive payment"
                trend={-2}
                isInverse={true}
            />
            <MetricsCard
                title="Overdue Rate"
                value={`${metrics.overduePercentage}%`}
                description="Percentage of invoices past due date"
                trend={2}
                isInverse={true}
            />
            <MetricsCard
                title="Total Revenue"
                value={metrics.totalRevenue}
                description="Total collected from paid invoices"
                trend={8}
                currency={currency}
            />
        </div>
    );
}
