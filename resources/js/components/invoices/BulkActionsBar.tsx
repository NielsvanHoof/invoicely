import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
                    setIsDeleteDialogOpen(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const selectedCount = selectedInvoices.length;
    const isPlural = selectedCount !== 1;

    return (
        <>
            <div
                className="bg-background border-sidebar-border/70 dark:border-sidebar-border sticky bottom-4 z-10 flex items-center justify-between rounded-xl border p-2 shadow-md"
                role="toolbar"
                aria-label="Bulk actions"
            >
                <div className="flex items-center gap-2">
                    <span className="font-medium" aria-live="polite">
                        {selectedCount} invoice{isPlural ? 's' : ''} selected
                    </span>
                    <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-xs" aria-label="Clear selection">
                        Clear
                    </Button>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1" aria-label="Reminder actions">
                                <BellIcon className="h-4 w-4" aria-hidden="true" />
                                <span>Reminders</span>
                                <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction('create_reminder_upcoming')} className="flex items-center">
                                <ClockIcon className="mr-2 h-4 w-4 text-blue-500" aria-hidden="true" />
                                Send Upcoming Payment Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('create_reminder_overdue')} className="flex items-center">
                                <AlertCircle className="mr-2 h-4 w-4 text-red-500" aria-hidden="true" />
                                Send Overdue Payment Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('create_reminder_thank_you')} className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" aria-hidden="true" />
                                Send Thank You Reminder
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1" aria-label="Status actions">
                                <span>Status</span>
                                <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
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
                        onClick={() => setIsDeleteDialogOpen(true)}
                        aria-label={`Delete ${selectedCount} invoice${isPlural ? 's' : ''}`}
                    >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span>Delete</span>
                    </Button>
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Invoices</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedCount} invoice{isPlural ? 's' : ''}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} aria-label="Cancel deletion">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleAction('delete')}
                            disabled={isSubmitting}
                            aria-label={isSubmitting ? 'Deleting invoices...' : 'Confirm deletion'}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
