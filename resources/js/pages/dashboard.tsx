import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { StatCard } from '@/components/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type Invoice } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, CreditCard, DollarSign, FileText, TrendingUp } from 'lucide-react';

interface DashboardProps {
    stats: {
        totalInvoices: number;
        totalPaid: number;
        totalOverdue: number;
        totalPending: number;
    };
    latestInvoices: Invoice[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard({ stats, latestInvoices }: DashboardProps) {
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

                {/* Activity Chart Placeholder */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative mt-4 flex h-48 items-center justify-center rounded-xl border sm:h-64">
                    <div className="flex flex-col items-center text-neutral-500 dark:text-neutral-400">
                        <BarChart3 className="mb-2 h-8 w-8 sm:h-12 sm:w-12" />
                        <p className="text-sm sm:text-base">Invoice Activity Chart</p>
                        <p className="text-xs">Coming soon</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
