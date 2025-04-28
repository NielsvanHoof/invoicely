import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type Invoice, type Reminder, type ReminderType } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangleIcon, BellIcon, CalendarIcon, PencilIcon, PlusIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';
import React, { useState } from 'react';

interface RemindersIndexProps {
    invoice: Invoice;
    types: ReminderType[];
}

export default function RemindersIndex({ invoice, types }: RemindersIndexProps) {
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
            href: route('invoices.reminders.index', invoice.id),
        },
    ];

    const form = useForm({
        type: '',
        scheduled_date: new Date().toISOString().split('T')[0],
        message: '',
    });

    const editForm = useForm({
        scheduled_date: '',
        message: '',
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('invoices.reminders.store', invoice.id), {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                form.reset();
            },
        });
    }

    function onEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedReminder) return;

        editForm.put(route('invoices.reminders.update', [invoice.id, selectedReminder.id]), {
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
        router.delete(route('invoices.reminders.destroy', [invoice.id, selectedReminder.id]));
        setIsDeleteDialogOpen(false);
    }

    function handleScheduleDefaults() {
        setIsScheduleDefaultsDialogOpen(true);
    }

    function confirmScheduleDefaults() {
        router.post(route('invoices.reminders.schedule-defaults', invoice.id));
        setIsScheduleDefaultsDialogOpen(false);
    }

    function getReminderStatusBadge(reminder: Reminder) {
        if (reminder.sent_at) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Sent
                </span>
            );
        }

        const scheduledDate = new Date(reminder.scheduled_date);
        const now = new Date();

        if (scheduledDate < now) {
            return (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Due
                </span>
            );
        }

        return (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Scheduled
            </span>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reminders for Invoice #${invoice.invoice_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Payment Reminders</h1>
                        <p className="text-muted-foreground mt-1">Manage payment reminders for Invoice #{invoice.invoice_number}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={handleScheduleDefaults} className="flex-shrink-0">
                            <RefreshCwIcon className="mr-2 h-4 w-4" />
                            <span>Schedule Defaults</span>
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex-shrink-0">
                                    <PlusIcon className="mr-2 h-4 w-4" />
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
                                        <Select value={form.data.type} onValueChange={(value) => form.setData('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a reminder type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.errors.type && <p className="text-sm text-red-500">{form.errors.type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="scheduled_date" className="text-sm font-medium">
                                            Scheduled Date
                                        </Label>
                                        <div className="relative">
                                            <CalendarIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                            <Input
                                                id="scheduled_date"
                                                type="date"
                                                className="pl-10"
                                                value={form.data.scheduled_date}
                                                onChange={(e) => form.setData('scheduled_date', e.target.value)}
                                            />
                                        </div>
                                        {form.errors.scheduled_date && <p className="text-sm text-red-500">{form.errors.scheduled_date}</p>}
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
                                        />
                                        {form.errors.message && <p className="text-sm text-red-500">{form.errors.message}</p>}
                                    </div>

                                    <DialogFooter className="mt-6">
                                        <Button type="submit" disabled={form.processing}>
                                            {form.processing ? 'Scheduling...' : 'Schedule Reminder'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {invoice.reminders?.length === 0 ? (
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-muted mb-4 rounded-full p-3">
                                    <BellIcon className="text-muted-foreground h-6 w-6" />
                                </div>
                                <h3 className="mb-1 text-lg font-medium">No reminders yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    No reminders have been scheduled for this invoice. Create your first reminder to help ensure timely payment.
                                </p>
                                <Button onClick={() => setIsAddDialogOpen(true)}>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add Your First Reminder
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {invoice.reminders?.map((reminder) => (
                            <Card key={reminder.id} className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                                <CardHeader className="pb-2">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">
                                                    {types.find((t) => t.value === reminder.type)?.label || reminder.type}
                                                </CardTitle>
                                                {getReminderStatusBadge(reminder)}
                                            </div>
                                            <div className="text-muted-foreground mt-1 flex items-center text-sm">
                                                <CalendarIcon className="mr-1.5 inline h-3.5 w-3.5" />
                                                Scheduled for {formatDate(reminder.scheduled_date)}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-2 sm:mt-0">
                                            {!reminder.sent_at && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => handleEditClick(reminder)} className="h-8">
                                                        <PencilIcon className="mr-1.5 h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(reminder)}
                                                        className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                                                    >
                                                        <TrashIcon className="mr-1.5 h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-muted bg-muted/20 rounded-r-sm border-l-4 py-2 pl-4 text-sm italic">
                                        {reminder.message}
                                    </div>
                                    {reminder.sent_at && (
                                        <div className="text-muted-foreground mt-4 flex items-center text-xs">
                                            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
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
                                <CalendarIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    id="edit_scheduled_date"
                                    type="date"
                                    className="pl-10"
                                    value={editForm.data.scheduled_date}
                                    onChange={(e) => editForm.setData('scheduled_date', e.target.value)}
                                />
                            </div>
                            {editForm.errors.scheduled_date && <p className="text-sm text-red-500">{editForm.errors.scheduled_date}</p>}
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
                            />
                            {editForm.errors.message && <p className="text-sm text-red-500">{editForm.errors.message}</p>}
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="submit" disabled={editForm.processing}>
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
                            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                            <DialogTitle>Delete Reminder</DialogTitle>
                        </div>
                        <DialogDescription>Are you sure you want to delete this reminder? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
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
                        <Button variant="outline" onClick={() => setIsScheduleDefaultsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmScheduleDefaults}>Schedule Defaults</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
