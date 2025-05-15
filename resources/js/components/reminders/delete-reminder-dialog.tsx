import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Reminder } from '@/types';
import { router } from '@inertiajs/react';
import { AlertTriangleIcon } from 'lucide-react';

interface DeleteReminderDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    reminder: Reminder | null;
    invoiceId: number;
}

export function DeleteReminderDialog({ isOpen, onOpenChange, reminder, invoiceId }: DeleteReminderDialogProps) {
    function handleDelete() {
        if (!reminder) return;
        router.delete(route('reminders.destroy', { invoice: invoiceId, reminder: reminder.id }));
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <AlertTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        <DialogTitle>Delete Reminder</DialogTitle>
                    </div>
                    <DialogDescription>Are you sure you want to delete this reminder? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} aria-label="Cancel deletion">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} aria-label="Confirm deletion">
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
