import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type Invoice } from '@/types';
import { Link } from '@inertiajs/react';

interface LatestInvoicesProps {
    invoices: Invoice[];
    userCurrency: string;
}

export function LatestInvoices({ invoices, userCurrency }: LatestInvoicesProps) {
    return (
        <section aria-labelledby="latest-invoices-heading" className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
            <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-between border-b p-4">
                <h2 id="latest-invoices-heading" className="text-lg font-semibold">
                    Latest Invoices
                </h2>
                <Link href="/invoices" className="text-sm text-blue-600 hover:underline dark:text-blue-400" aria-label="View all invoices">
                    View all
                </Link>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead scope="col">Invoice #</TableHead>
                            <TableHead scope="col">Client</TableHead>
                            <TableHead scope="col">Amount</TableHead>
                            <TableHead scope="col" className="hidden md:table-cell">
                                Date
                            </TableHead>
                            <TableHead scope="col">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-8 text-center text-neutral-500">
                                    No invoices found. Create your first invoice to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((invoice) => (
                                <TableRow key={`${invoice.id}-${invoice.invoice_number}`}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/invoices/${invoice.id}`}
                                            className="hover:underline"
                                            aria-label={`View invoice ${invoice.invoice_number}`}
                                        >
                                            {invoice.invoice_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{invoice.client_name}</TableCell>
                                    <TableCell>{formatCurrency(invoice.amount, userCurrency)}</TableCell>
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
                {invoices.length === 0 ? (
                    <div className="py-8 text-center text-sm text-neutral-500">No invoices found. Create your first invoice to get started.</div>
                ) : (
                    <div className="divide-sidebar-border/70 dark:divide-sidebar-border divide-y">
                        {invoices.map((invoice) => (
                            <div key={`${invoice.id}-${invoice.invoice_number}`} className="p-4">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/invoices/${invoice.id}`}
                                        className="font-medium hover:underline"
                                        aria-label={`View invoice ${invoice.invoice_number}`}
                                    >
                                        {invoice.invoice_number}
                                    </Link>
                                    <InvoiceStatusBadge status={invoice.status} />
                                </div>
                                <div className="mt-1 text-sm text-neutral-500">{invoice.client_name}</div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="font-medium">{formatCurrency(invoice.amount, userCurrency)}</div>
                                    <div className="text-xs text-neutral-500">{formatDate(invoice.issue_date)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
