import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';

interface ScheduleDefaultsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceId: number;
}

export function ScheduleDefaultsDialog({ isOpen, onOpenChange, invoiceId }: ScheduleDefaultsDialogProps) {
    function handleScheduleDefaults() {
        router.post(route('reminders.schedule-defaults', { invoice: invoiceId }));
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule Default Reminders</DialogTitle>
                    <DialogDescription>
                        This will schedule default reminders based on the invoice status. Any existing unsent reminders will be replaced.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} aria-label="Cancel scheduling defaults">
                        Cancel
                    </Button>
                    <Button onClick={handleScheduleDefaults} aria-label="Confirm scheduling defaults">
                        Schedule Defaults
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
