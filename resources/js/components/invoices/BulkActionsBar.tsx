import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Invoice } from '@/types';
import { router } from '@inertiajs/react';
import { AlertCircle, BellIcon, CheckCircle, ChevronDown, ClockIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BulkActionsBarProps {
    selectedInvoices: Invoice[];
    onClearSelection: () => void;
}

export function BulkActionsBar({ selectedInvoices, onClearSelection }: BulkActionsBarProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // No selected invoices
    if (selectedInvoices.length === 0) {
        return null;
    }

    const handleAction = (action: string) => {
        if (selectedInvoices.length === 0 || isSubmitting) return;

        setIsSubmitting(true);

        const invoiceIds = selectedInvoices.map((invoice) => invoice.id);

        router.post(
            route('invoices.bulk-action'),
            {
                action,
                invoice_ids: invoiceIds,
            },
            {
                onSuccess: () => {
                    onClearSelection();
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <div className="bg-background border-sidebar-border/70 dark:border-sidebar-border sticky bottom-4 z-10 flex items-center justify-between rounded-xl border p-2 shadow-md">
            <div className="flex items-center gap-2">
                <span className="font-medium">
                    {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? 's' : ''} selected
                </span>
                <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-xs">
                    Clear
                </Button>
            </div>
            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <BellIcon className="h-4 w-4" />
                            <span>Reminders</span>
                            <ChevronDown className="h-3 w-3 opacity-70" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('create_reminder_upcoming')}>
                            <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
                            Send Upcoming Payment Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('create_reminder_overdue')}>
                            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                            Send Overdue Payment Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('create_reminder_thank_you')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Send Thank You Reminder
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <span>Status</span>
                            <ChevronDown className="h-3 w-3 opacity-70" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('mark_as_sent')}>Mark as Sent</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('mark_as_paid')}>Mark as Paid</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('mark_as_overdue')}>Mark as Overdue</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                        if (
                            confirm(`Are you sure you want to delete ${selectedInvoices.length} invoice${selectedInvoices.length !== 1 ? 's' : ''}?`)
                        ) {
                            handleAction('delete');
                        }
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                </Button>
            </div>
        </div>
    );
}
