import { StatCard } from '@/components/stat-card';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, DollarSign, FileText, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
    stats: {
        totalInvoices: number;
        totalPaid: number;
        totalPending: number;
        totalOverdue: number;
    };
    userCurrency: string;
}

export function StatsOverview({ stats, userCurrency }: StatsOverviewProps) {
    return (
        <section aria-labelledby="stats-heading" className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <h2 id="stats-heading" className="sr-only">
                Statistics Overview
            </h2>
            <StatCard key="total-invoices" title="Total Invoices" value={stats.totalInvoices.toString()} icon={FileText} description="All time" />
            <StatCard
                key="total-paid"
                title="Total Paid"
                value={formatCurrency(stats.totalPaid, userCurrency)}
                icon={DollarSign}
                description="All time"
            />
            <StatCard
                key="total-pending"
                title="Total Pending"
                value={formatCurrency(stats.totalPending, userCurrency)}
                icon={CreditCard}
                description="Awaiting payment"
            />
            <StatCard
                key="total-overdue"
                title="Total Overdue"
                value={formatCurrency(stats.totalOverdue, userCurrency)}
                icon={TrendingUp}
                description="Needs attention"
            />
        </section>
    );
}
