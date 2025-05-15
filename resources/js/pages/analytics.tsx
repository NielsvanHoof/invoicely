import { AnalyticsHeader } from '@/components/analytics/analytics-header';
import { MetricsGrid } from '@/components/analytics/metrics-grid';
import { RevenueChart } from '@/components/analytics/revenue-chart';
import { StatusDistributionChart } from '@/components/analytics/status-distribution-chart';
import { TopClientsChart } from '@/components/analytics/top-clients-chart';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { AnalyticsPageProps } from '@/types/analytics';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Analytics({ financialMetrics, statusDistribution, monthlyRevenue, topClients }: AnalyticsPageProps) {
    const [timeRange, setTimeRange] = useState('6months');
    const [chartView, setChartView] = useState<'line' | 'bar'>('line');

    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth?.user?.currency || 'USD';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Analytics',
            href: route('analytics.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <AnalyticsHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />

                <MetricsGrid metrics={financialMetrics} currency={userCurrency} />

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RevenueChart data={monthlyRevenue} currency={userCurrency} chartView={chartView} onChartViewChange={setChartView} />
                    <StatusDistributionChart data={statusDistribution} />
                </div>

                <TopClientsChart data={topClients} currency={userCurrency} />
            </div>
        </AppLayout>
    );
}
