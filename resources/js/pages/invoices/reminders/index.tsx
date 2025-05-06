import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type Invoice, type Reminder } from '@/types';
import { ReminderType, StoreReminderData, UpdateReminderData } from '@/types/generated';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertTriangleIcon, ArrowLeftIcon, BellIcon, CalendarIcon, PencilIcon, PlusIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';
import React, { useState } from 'react';

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

    const form = useForm<StoreReminderData>({
        type: ReminderType.UPCOMING,
        scheduled_date: new Date().toISOString().split('T')[0],
        message: '',
    });

    const editForm = useForm<UpdateReminderData>({
        scheduled_date: '',
        message: '',
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('reminders.store', { invoice: invoice.id }), {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                form.reset();
            },
        });
    }

    function onEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedReminder) return;

        editForm.put(route('reminders.update', { invoice: invoice.id, reminder: selectedReminder.id }), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setSelectedReminder(null);
                editForm.reset();
            },
        });
    }

    function handleEditClick(reminder: Reminder) {
        setSelectedReminder(reminder);
        const date = new Date(reminder.scheduled_date);
        const formattedDate = date.toISOString().split('T')[0];

        editForm.setData({
            scheduled_date: formattedDate,
            message: reminder.message,
        });
        setIsEditDialogOpen(true);
    }

    function handleDeleteClick(reminder: Reminder) {
        setSelectedReminder(reminder);
        setIsDeleteDialogOpen(true);
    }

    function confirmDelete() {
        if (!selectedReminder) return;
        router.delete(route('reminders.destroy', { invoice: invoice.id, reminder: selectedReminder.id }));
        setIsDeleteDialogOpen(false);
    }

    function handleScheduleDefaults() {
        setIsScheduleDefaultsDialogOpen(true);
    }

    function confirmScheduleDefaults() {
        router.post(route('reminders.schedule-defaults', { invoice: invoice.id }));
        setIsScheduleDefaultsDialogOpen(false);
    }

    function getReminderStatusBadge(reminder: Reminder) {
        if (reminder.sent_at) {
            return (
                <span
                    className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    role="status"
                    aria-label="Reminder sent"
                >
                    Sent
                </span>
            );
        }

        const scheduledDate = new Date(reminder.scheduled_date);
        const now = new Date();

        if (scheduledDate < now) {
            return (
                <span
                    className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    role="status"
                    aria-label="Reminder due"
                >
                    Due
                </span>
            );
        }

        return (
            <span
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                role="status"
                aria-label="Reminder scheduled"
            >
                Scheduled
            </span>
        );
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
                        <Button variant="outline" onClick={handleScheduleDefaults} className="flex-shrink-0" aria-label="Schedule default reminders">
                            <RefreshCwIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span>Schedule Defaults</span>
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex-shrink-0" aria-label="Add new reminder">
                                    <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                                    <span>Add Reminder</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add New Reminder</DialogTitle>
                                    <DialogDescription>Create a new reminder for this invoice.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="text-sm font-medium">
                                            Reminder Type
                                        </Label>
                                        <Select
                                            value={form.data.type}
                                            onValueChange={(value) => form.setData('type', value as ReminderType)}
                                            aria-label="Select reminder type"
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a reminder type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(ReminderType).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.errors.type && (
                                            <p className="text-sm text-red-500" role="alert">
                                                {form.errors.type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="scheduled_date" className="text-sm font-medium">
                                            Scheduled Date
                                        </Label>
                                        <div className="relative">
                                            <CalendarIcon
                                                className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                                                aria-hidden="true"
                                            />
                                            <Input
                                                id="scheduled_date"
                                                type="date"
                                                className="pl-10"
                                                value={form.data.scheduled_date}
                                                onChange={(e) => form.setData('scheduled_date', e.target.value)}
                                                aria-label="Select scheduled date"
                                            />
                                        </div>
                                        {form.errors.scheduled_date && (
                                            <p className="text-sm text-red-500" role="alert">
                                                {form.errors.scheduled_date}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-sm font-medium">
                                            Message (Optional)
                                        </Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Leave blank to use the default message template"
                                            className="min-h-[100px] resize-y"
                                            value={form.data.message}
                                            onChange={(e) => form.setData('message', e.target.value)}
                                            aria-label="Reminder message"
                                        />
                                        {form.errors.message && (
                                            <p className="text-sm text-red-500" role="alert">
                                                {form.errors.message}
                                            </p>
                                        )}
                                    </div>

                                    <DialogFooter className="mt-6">
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                            aria-label={form.processing ? 'Scheduling reminder...' : 'Schedule reminder'}
                                        >
                                            {form.processing ? 'Scheduling...' : 'Schedule Reminder'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                {/* Reminders List */}
                {invoice.reminders?.length === 0 ? (
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                        <CardContent className="pt-6">
                            <div
                                className="flex flex-col items-center justify-center py-12 text-center"
                                role="status"
                                aria-label="No reminders available"
                            >
                                <div className="bg-muted mb-4 rounded-full p-3">
                                    <BellIcon className="text-muted-foreground h-6 w-6" aria-hidden="true" />
                                </div>
                                <h3 className="mb-1 text-lg font-medium">No reminders yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    No reminders have been scheduled for this invoice. Create your first reminder to help ensure timely payment.
                                </p>
                                <Button onClick={() => setIsAddDialogOpen(true)} aria-label="Add your first reminder">
                                    <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Add Your First Reminder
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4" role="list" aria-label="Reminders list">
                        {invoice.reminders?.map((reminder) => (
                            <Card
                                key={reminder.id}
                                className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border"
                                role="listitem"
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">
                                                    {reminder.type}
                                                </CardTitle>
                                                {getReminderStatusBadge(reminder)}
                                            </div>
                                            <div className="text-muted-foreground mt-1 flex items-center text-sm">
                                                <CalendarIcon className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
                                                Scheduled for {formatDate(reminder.scheduled_date)}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-2 sm:mt-0">
                                            {!reminder.sent_at && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditClick(reminder)}
                                                        className="h-8"
                                                        aria-label={`Edit reminder scheduled for ${formatDate(reminder.scheduled_date)}`}
                                                    >
                                                        <PencilIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                                        <span className="hidden sm:inline">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(reminder)}
                                                        className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                                                        aria-label={`Delete reminder scheduled for ${formatDate(reminder.scheduled_date)}`}
                                                    >
                                                        <TrashIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="border-muted bg-muted/20 rounded-r-sm border-l-4 py-2 pl-4 text-sm italic"
                                        role="article"
                                        aria-label="Reminder message"
                                    >
                                        {reminder.message}
                                    </div>
                                    {reminder.sent_at && (
                                        <div className="text-muted-foreground mt-4 flex items-center text-xs">
                                            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true"></span>
                                            Sent on {formatDate(reminder.sent_at)}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Reminder Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Reminder</DialogTitle>
                        <DialogDescription>Update the reminder details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_scheduled_date" className="text-sm font-medium">
                                Scheduled Date
                            </Label>
                            <div className="relative">
                                <CalendarIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
                                <Input
                                    id="edit_scheduled_date"
                                    type="date"
                                    className="pl-10"
                                    value={editForm.data.scheduled_date}
                                    onChange={(e) => editForm.setData('scheduled_date', e.target.value)}
                                    aria-label="Select new scheduled date"
                                />
                            </div>
                            {editForm.errors.scheduled_date && (
                                <p className="text-sm text-red-500" role="alert">
                                    {editForm.errors.scheduled_date}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_message" className="text-sm font-medium">
                                Message
                            </Label>
                            <Textarea
                                id="edit_message"
                                className="min-h-[100px] resize-y"
                                value={editForm.data.message}
                                onChange={(e) => editForm.setData('message', e.target.value)}
                                aria-label="Edit reminder message"
                            />
                            {editForm.errors.message && (
                                <p className="text-sm text-red-500" role="alert">
                                    {editForm.errors.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                aria-label={editForm.processing ? 'Updating reminder...' : 'Update reminder'}
                            >
                                {editForm.processing ? 'Updating...' : 'Update Reminder'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <AlertTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            <DialogTitle>Delete Reminder</DialogTitle>
                        </div>
                        <DialogDescription>Are you sure you want to delete this reminder? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} aria-label="Cancel deletion">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} aria-label="Confirm deletion">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Defaults Confirmation Dialog */}
            <Dialog open={isScheduleDefaultsDialogOpen} onOpenChange={setIsScheduleDefaultsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Schedule Default Reminders</DialogTitle>
                        <DialogDescription>
                            This will schedule default reminders based on the invoice status. Any existing unsent reminders will be replaced.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsScheduleDefaultsDialogOpen(false)} aria-label="Cancel scheduling defaults">
                            Cancel
                        </Button>
                        <Button onClick={confirmScheduleDefaults} aria-label="Confirm scheduling defaults">
                            Schedule Defaults
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
