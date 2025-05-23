import { ActivityTimeline } from '@/components/dashboard/activity-timeline';
import { LatestInvoices } from '@/components/dashboard/latest-invoices';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { UpcomingInvoices } from '@/components/dashboard/upcoming-invoices';
import { InvoiceStatisticsWidget } from '@/components/invoice-statistics-widget';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem, type Invoice } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface ActivityItem {
    id: string;
    type: 'created' | 'updated' | 'reminder';
    invoice_number: string;
    client_name: string;
    amount: number;
    status: string;
    date: string;
    reminder_type?: string;
    reminder_id?: string;
    sent_at?: string;
    scheduled_date?: string;
    timestamp: string;
}

interface DashboardProps {
    stats: {
        totalInvoices: number;
        totalPaid: number;
        totalOverdue: number;
        totalPending: number;
        totalOutstanding: number;
        overdueCount: number;
        upcomingCount: number;
        averageDaysOverdue: number;
    };
    latestInvoices: Invoice[];
    upcomingInvoices: Invoice[];
    recentActivity: ActivityItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard({ stats, latestInvoices, upcomingInvoices, recentActivity }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth?.user?.currency || 'USD';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <main className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6" role="main">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Analytics</h1>

                <StatsOverview
                    stats={{
                        totalInvoices: stats.totalInvoices,
                        totalPaid: stats.totalPaid,
                        totalPending: stats.totalPending,
                        totalOverdue: stats.totalOverdue,
                    }}
                    userCurrency={userCurrency}
                />

                <section aria-labelledby="invoice-stats-heading" className="mt-2">
                    <h2 id="invoice-stats-heading" className="sr-only">
                        Invoice Statistics
                    </h2>
                    <InvoiceStatisticsWidget
                        stats={{
                            totalOutstanding: stats.totalOutstanding,
                            overdueCount: stats.overdueCount,
                            upcomingCount: stats.upcomingCount,
                            averageDaysOverdue: stats.averageDaysOverdue,
                        }}
                    />
                </section>

                <LatestInvoices invoices={latestInvoices} userCurrency={userCurrency} />
                <UpcomingInvoices invoices={upcomingInvoices} userCurrency={userCurrency} />
                <ActivityTimeline activities={recentActivity} userCurrency={userCurrency} />
            </main>
        </AppLayout>
    );
}
