import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ReminderType, StoreReminderData } from '@/types/generated';
import { useForm } from '@inertiajs/react';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import React from 'react';

interface AddReminderDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceId: number;
}

export function AddReminderDialog({ isOpen, onOpenChange, invoiceId }: AddReminderDialogProps) {
    const form = useForm<StoreReminderData>({
        type: ReminderType.UPCOMING,
        scheduled_date: new Date().toISOString().split('T')[0],
        message: '',
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('reminders.store', { invoice: invoiceId }), {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                            <CalendarIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
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
    );
}
