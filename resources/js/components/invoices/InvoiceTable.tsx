import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type Invoice } from '@/types';
import { Link } from '@inertiajs/react';
import { BellIcon, EyeIcon, FileEditIcon, MoreHorizontalIcon, PaperclipIcon, TrashIcon } from 'lucide-react';

interface InvoiceTableProps {
    invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border hidden rounded-xl border md:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden lg:table-cell">Issue Date</TableHead>
                        <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                                        {invoice.invoice_number}
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        {invoice.file_path && <PaperclipIcon className="h-3.5 w-3.5 text-neutral-400" />}
                                        {invoice.reminders_count !== undefined && (
                                            <div
                                                className="flex items-center"
                                                title={
                                                    invoice.reminders_count > 0
                                                        ? `${invoice.reminders_count} reminder${invoice.reminders_count !== 1 ? 's' : ''}`
                                                        : 'No reminders'
                                                }
                                            >
                                                <BellIcon
                                                    className={`h-3.5 w-3.5 ${invoice.reminders_count > 0 ? 'text-amber-500' : 'text-neutral-300'}`}
                                                />
                                                {invoice.reminders_count > 0 && (
                                                    <span className="ml-0.5 text-xs font-medium text-amber-600">{invoice.reminders_count}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{invoice.client_name}</TableCell>
                            <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                            <TableCell className="hidden lg:table-cell">{formatDate(invoice.issue_date)}</TableCell>
                            <TableCell className="hidden lg:table-cell">{formatDate(invoice.due_date)}</TableCell>
                            <TableCell>
                                <InvoiceStatusBadge status={invoice.status} />
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontalIcon className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={route('invoices.show', invoice.id)}>
                                                <EyeIcon className="mr-2 h-4 w-4" />
                                                View
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('invoices.edit', invoice.id)}>
                                                <FileEditIcon className="mr-2 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('reminders.index', invoice.id)}>
                                                <BellIcon
                                                    className={`mr-2 h-4 w-4 ${invoice.reminders_count && invoice.reminders_count > 0 ? 'text-amber-500' : ''}`}
                                                />
                                                Reminders{' '}
                                                {invoice.reminders_count && invoice.reminders_count > 0 ? `(${invoice.reminders_count})` : ''}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('invoices.destroy', invoice.id)} method="delete" className="text-destructive">
                                                <TrashIcon className="mr-2 h-4 w-4" />
                                                Delete
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
