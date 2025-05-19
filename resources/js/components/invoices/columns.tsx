import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice as InvoiceModel } from '@/types/models';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BellIcon, CircleEllipsisIcon, EyeIcon, FileEditIcon, FileText, MoreHorizontalIcon, PaperclipIcon, TrashIcon } from 'lucide-react';
import React from 'react';

export type Invoice = InvoiceModel;
export type InvoiceColumn = InvoiceModel;

/**
 * Renders the invoice number cell with popover for attachments and reminders.
 */
function InvoiceNumberCell({ invoice }: { invoice: Invoice }) {
    // Only true if there is a file_path or documents_count > 0
    const hasAttachments = Boolean(invoice.file_path) || (typeof invoice.documents_count === 'number' && invoice.documents_count > 0);
    // Only true if reminders_count > 0
    const hasReminders = typeof invoice.reminders_count === 'number' && invoice.reminders_count > 0;

    return (
        <div className="flex items-center gap-1.5">
            <Link
                href={`/invoices/${invoice.id}`}
                className="focus:ring-primary rounded hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
                {invoice.invoice_number}
            </Link>
            {(hasAttachments || hasReminders) && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-6 w-6 p-0" aria-label="View attachments and notifications">
                            <CircleEllipsisIcon className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2" align="start">
                        <div className="space-y-2">
                            {invoice.file_path && (
                                <div className="flex items-center gap-2 text-sm">
                                    <PaperclipIcon className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                                    <span>Has invoice attachment</span>
                                </div>
                            )}
                            {invoice.documents_count !== undefined && invoice.documents_count > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                    <span>
                                        {invoice.documents_count} document{invoice.documents_count !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            {hasReminders && (
                                <div className="flex items-center gap-2 text-sm">
                                    <BellIcon className="h-4 w-4 text-amber-500" aria-hidden="true" />
                                    <span>
                                        {invoice.reminders_count} reminder{invoice.reminders_count !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}

export function columns(userCurrency: string): ColumnDef<InvoiceColumn>[] {
    return [
        {
            id: 'select',
            /** Checkbox for selecting all/individual invoices */
            header: ({ table }) => {
                const ref = React.useRef<HTMLButtonElement>(null);
                React.useEffect(() => {
                    if (ref.current) {
                        const input = ref.current.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
                        if (input) input.indeterminate = table.getIsSomePageRowsSelected();
                    }
                }, [table.getIsSomePageRowsSelected()]);
                return (
                    <Checkbox
                        ref={ref}
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                );
            },
            cell: ({ row }) => {
                const ref = React.useRef<HTMLButtonElement>(null);
                React.useEffect(() => {
                    if (ref.current) {
                        const input = ref.current.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
                        if (input) input.indeterminate = row.getIsSomeSelected();
                    }
                }, [row.getIsSomeSelected()]);
                return (
                    <Checkbox
                        ref={ref}
                        checked={row.getIsSelected()}
                        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                        aria-label={`Select invoice ${(row.original as Invoice).invoice_number}`}
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'invoice_number',
            header: 'Invoice #',
            /** Invoice number with popover for attachments/reminders */
            cell: ({ row }) => <InvoiceNumberCell invoice={row.original} />,
        },
        {
            accessorKey: 'client_name',
            header: 'Client',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            /** Formatted currency cell */
            cell: ({ row }) => formatCurrency(row.original.amount, userCurrency),
        },
        {
            accessorKey: 'issue_date',
            header: 'Issue Date',
            /** Formatted issue date */
            cell: ({ row }) => formatDate(row.original.issue_date),
        },
        {
            accessorKey: 'due_date',
            header: 'Due Date',
            /** Formatted due date */
            cell: ({ row }) => formatDate(row.original.due_date),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            /** Status badge cell */
            cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
        },
        {
            id: 'actions',
            /** Dropdown menu for row actions */
            cell: ({ row }) => {
                const invoice = row.original;
                const hasReminders = typeof invoice.reminders_count === 'number' && invoice.reminders_count > 0;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label={`Actions for invoice ${invoice.invoice_number}`}>
                                <MoreHorizontalIcon className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/invoices/${invoice.id}`} className="flex items-center">
                                    <EyeIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/invoices/${invoice.id}/edit`} className="flex items-center">
                                    <FileEditIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/invoices/${invoice.id}/reminders`} className="flex items-center">
                                    <BellIcon className={`mr-2 h-4 w-4 ${hasReminders ? 'text-amber-500' : ''}`} aria-hidden="true" />
                                    Reminders {hasReminders ? `(${invoice.reminders_count})` : ''}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/invoices/${invoice.id}`} method="delete" className="text-destructive flex items-center">
                                    <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Delete
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
