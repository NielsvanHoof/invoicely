import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Reminder } from '@/types';
import { UpdateReminderData } from '@/types/generated';
import { useForm } from '@inertiajs/react';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

interface EditReminderDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    reminder: Reminder | null;
    invoiceId: number;
}

export function EditReminderDialog({ isOpen, onOpenChange, reminder, invoiceId }: EditReminderDialogProps) {
    const form = useForm<UpdateReminderData>({
        scheduled_date: '',
        message: '',
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!reminder) return;

        form.put(route('reminders.update', { invoice: invoiceId, reminder: reminder.id }), {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Reminder</DialogTitle>
                    <DialogDescription>Update the reminder details.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
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
                                value={form.data.scheduled_date}
                                onChange={(e) => form.setData('scheduled_date', e.target.value)}
                                aria-label="Select new scheduled date"
                            />
                        </div>
                        {form.errors.scheduled_date && (
                            <p className="text-sm text-red-500" role="alert">
                                {form.errors.scheduled_date}
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
                            value={form.data.message}
                            onChange={(e) => form.setData('message', e.target.value)}
                            aria-label="Edit reminder message"
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
                            aria-label={form.processing ? 'Updating reminder...' : 'Update reminder'}
                        >
                            {form.processing ? 'Updating...' : 'Update Reminder'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 