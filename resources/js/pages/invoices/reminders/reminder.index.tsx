import { AddReminderDialog } from '@/components/reminders/add-reminder-dialog';
import { DeleteReminderDialog } from '@/components/reminders/delete-reminder-dialog';
import { EditReminderDialog } from '@/components/reminders/edit-reminder-dialog';
import { ReminderCard } from '@/components/reminders/reminder-card';
import { ScheduleDefaultsDialog } from '@/components/reminders/schedule-defaults-dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Invoice, Reminder } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, BellIcon, RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';

interface RemindersIndexProps {
    invoice: Invoice;
}

export default function RemindersIndex({ invoice }: RemindersIndexProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isScheduleDefaultsDialogOpen, setIsScheduleDefaultsDialogOpen] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Invoices',
            href: route('invoices.index'),
        },
        {
            title: invoice.invoice_number,
            href: route('invoices.show', invoice.id),
        },
        {
            title: 'Reminders',
            href: route('reminders.index', { invoice: invoice.id }),
        },
    ];

    function handleEditClick(reminder: Reminder) {
        setSelectedReminder(reminder);
        setIsEditDialogOpen(true);
    }

    function handleDeleteClick(reminder: Reminder) {
        setSelectedReminder(reminder);
        setIsDeleteDialogOpen(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reminders for Invoice #${invoice.invoice_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                {/* Header Section */}
                <header className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8" aria-label="Go back to invoice">
                            <Link href={route('invoices.show', invoice.id)}>
                                <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Payment Reminders</h1>
                            <p className="text-muted-foreground mt-1">Manage payment reminders for Invoice #{invoice.invoice_number}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsScheduleDefaultsDialogOpen(true)}
                            className="flex-shrink-0"
                            aria-label="Schedule default reminders"
                        >
                            <RefreshCwIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span>Schedule Defaults</span>
                        </Button>
                        <AddReminderDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} invoiceId={invoice.id} />
                    </div>
                </header>

                {/* Reminders List */}
                {invoice.reminders?.length === 0 ? (
                    <EmptyState
                        title="No reminders yet"
                        description="Create your first reminder to help ensure timely payment"
                        type="default"
                        icon={BellIcon}
                        className="h-[300px]"
                    />
                ) : (
                    <div className="space-y-4" role="list" aria-label="Reminders list">
                        {invoice.reminders?.map((reminder) => (
                            <ReminderCard key={reminder.id} reminder={reminder} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
                        ))}
                    </div>
                )}
            </div>

            <EditReminderDialog isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} reminder={selectedReminder} invoiceId={invoice.id} />

            <DeleteReminderDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                reminder={selectedReminder}
                invoiceId={invoice.id}
            />

            <ScheduleDefaultsDialog isOpen={isScheduleDefaultsDialogOpen} onOpenChange={setIsScheduleDefaultsDialogOpen} invoiceId={invoice.id} />
        </AppLayout>
    );
}
