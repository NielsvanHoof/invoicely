import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Document } from '@/types';
import { router } from '@inertiajs/react';

interface DeleteDocumentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document | null;
    invoiceId: number;
}

export function DeleteDocumentDialog({ isOpen, onOpenChange, document, invoiceId }: DeleteDocumentDialogProps) {
    function handleDelete() {
        if (!document) return;

        router.delete(route('documents.destroy', [invoiceId, document.id]), {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Document</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this document? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
