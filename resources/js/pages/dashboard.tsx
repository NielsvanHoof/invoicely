import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { StatCard } from '@/components/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { type BreadcrumbItem, type Invoice } from '@/types';
import { Deferred, Head, Link } from '@inertiajs/react';
import { Activity, BellIcon, CheckCircle, Clock, CreditCard, DollarSign, FileText, PlusCircle, RefreshCw, TrendingUp } from 'lucide-react';

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
}

interface DashboardProps {
    stats: {
        totalInvoices: number;
        totalPaid: number;
        totalOverdue: number;
        totalPending: number;
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
    // Function to get the appropriate icon for activity type
    const getActivityIcon = (type: string, status: string) => {
        if (type === 'created') return PlusCircle;
        if (type === 'reminder') return BellIcon;
        if (status === 'paid') return CheckCircle;
        return RefreshCw;
    };

    // Function to get the activity description
    const getActivityDescription = (type: string, status: string, reminderType?: string) => {
        if (type === 'created') return 'Created new invoice';
        if (type === 'reminder') {
            if (reminderType === 'upcoming') return 'Created upcoming payment reminder';
            if (reminderType === 'overdue') return 'Created overdue payment reminder';
            if (reminderType === 'thank_you') return 'Created thank you reminder';
            return 'Created reminder';
        }
        if (status === 'paid') return 'Marked as paid';
        if (status === 'sent') return 'Sent to client';
        if (status === 'overdue') return 'Marked as overdue';
        return 'Updated invoice';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">Analytics</h1>

                {/* Stats Cards */}
                <div className="grid auto-rows-min grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
                    <StatCard title="Total Invoices" value={stats.totalInvoices.toString()} icon={FileText} description="All time" />
                    <StatCard title="Total Paid" value={formatCurrency(stats.totalPaid)} icon={DollarSign} description="All time" />
                    <StatCard title="Total Pending" value={formatCurrency(stats.totalPending)} icon={CreditCard} description="Awaiting payment" />
                    <StatCard title="Total Overdue" value={formatCurrency(stats.totalOverdue)} icon={TrendingUp} description="Needs attention" />
                </div>

                {/* Latest Invoices - Card for mobile, Table for larger screens */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border mt-4 rounded-xl border">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-between border-b p-3 sm:p-4">
                        <h2 className="text-base font-semibold sm:text-lg">Latest Invoices</h2>
                        <Link href="/invoices" className="text-xs text-blue-600 hover:underline sm:text-sm dark:text-blue-400">
                            View all
                        </Link>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {latestInvoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-6 text-center text-neutral-500">
                                            No invoices found. Create your first invoice to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    latestInvoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                                                    {invoice.invoice_number}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{invoice.client_name}</TableCell>
                                            <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                                            <TableCell className="hidden md:table-cell">{formatDate(invoice.issue_date)}</TableCell>
                                            <TableCell>
                                                <InvoiceStatusBadge status={invoice.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden">
                        {latestInvoices.length === 0 ? (
                            <div className="py-6 text-center text-sm text-neutral-500">
                                No invoices found. Create your first invoice to get started.
                            </div>
                        ) : (
                            <div className="divide-sidebar-border/70 dark:divide-sidebar-border divide-y">
                                {latestInvoices.map((invoice) => (
                                    <div key={invoice.id} className="p-3">
                                        <div className="flex items-center justify-between">
                                            <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline">
                                                {invoice.invoice_number}
                                            </Link>
                                            <InvoiceStatusBadge status={invoice.status} />
                                        </div>
                                        <div className="mt-1 text-sm text-neutral-500">{invoice.client_name}</div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                                            <div className="text-xs text-neutral-500">{formatDate(invoice.issue_date)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Invoices - Card for mobile, Table for larger screens */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border mt-4 rounded-xl border">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-between border-b p-3 sm:p-4">
                        <h2 className="flex items-center text-base font-semibold sm:text-lg">
                            <Clock className="mr-2 h-4 w-4" />
                            Upcoming Invoices
                        </h2>
                        <Link href="/invoices" className="text-xs text-blue-600 hover:underline sm:text-sm dark:text-blue-400">
                            View all
                        </Link>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcomingInvoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-6 text-center text-neutral-500">
                                            No upcoming invoices found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    upcomingInvoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                                                    {invoice.invoice_number}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{invoice.client_name}</TableCell>
                                            <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                                            <TableCell className="hidden md:table-cell">{formatDate(invoice.due_date)}</TableCell>
                                            <TableCell>
                                                <InvoiceStatusBadge status={invoice.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden">
                        {upcomingInvoices.length === 0 ? (
                            <div className="py-6 text-center text-sm text-neutral-500">No upcoming invoices found.</div>
                        ) : (
                            <div className="divide-sidebar-border/70 dark:divide-sidebar-border divide-y">
                                {upcomingInvoices.map((invoice) => (
                                    <div key={invoice.id} className="p-3">
                                        <div className="flex items-center justify-between">
                                            <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline">
                                                {invoice.invoice_number}
                                            </Link>
                                            <InvoiceStatusBadge status={invoice.status} />
                                        </div>
                                        <div className="mt-1 text-sm text-neutral-500">{invoice.client_name}</div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                                            <div className="text-xs text-neutral-500">Due: {formatDate(invoice.due_date)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border mt-4 rounded-xl border">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-between border-b p-3 sm:p-4">
                        <h2 className="flex items-center text-base font-semibold sm:text-lg">
                            <Activity className="mr-2 h-4 w-4" />
                            Recent Activity
                        </h2>
                    </div>

                    <div className="p-4">
                        <Deferred data="recentActivity" fallback={<Skeleton className="h-20 w-full" />}>
                            <div className="space-y-4">
                                {recentActivity?.map((activity) => {
                                    const ActivityIcon = getActivityIcon(activity.type, activity.status);
                                    return (
                                        <div
                                            key={`${activity.id}-${activity.type}${activity.reminder_id ? `-${activity.reminder_id}` : ''}`}
                                            className="flex items-start gap-3"
                                        >
                                            <div
                                                className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                                                    activity.type === 'reminder'
                                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500'
                                                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500'
                                                }`}
                                            >
                                                <ActivityIcon className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium">
                                                        {getActivityDescription(activity.type, activity.status, activity.reminder_type)}
                                                    </p>
                                                    <span className="text-xs text-neutral-500">{formatRelativeTime(new Date(activity.date))}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={
                                                            activity.type === 'reminder'
                                                                ? route('reminders.index', activity.id)
                                                                : route('invoices.show', activity.id)
                                                        }
                                                        className="text-xs text-neutral-600 hover:underline dark:text-neutral-400"
                                                    >
                                                        {activity.invoice_number} - {activity.client_name}
                                                    </Link>
                                                    <span className="text-xs font-medium">{formatCurrency(activity.amount)}</span>
                                                </div>
                                                {activity.type === 'reminder' && activity.scheduled_date && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-neutral-500">
                                                            {activity.sent_at
                                                                ? `Sent: ${formatDate(activity.sent_at)}`
                                                                : `Scheduled: ${formatDate(activity.scheduled_date)}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Deferred>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
