import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentType, StoreDocumentData } from '@/types/generated';
import { useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import React from 'react';

interface AddDocumentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceId: number;
}

export function AddDocumentDialog({ isOpen, onOpenChange, invoiceId }: AddDocumentDialogProps) {
    const form = useForm<StoreDocumentData>({
        file: null as File | null,
        name: '',
        category: DocumentType.OTHER,
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('documents.store', invoiceId), {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <span>Add Document</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Document</DialogTitle>
                    <DialogDescription>Upload a new document for this invoice.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Document Name</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Enter document name"
                            className={form.errors.name ? 'border-red-300' : ''}
                            aria-invalid={!!form.errors.name}
                            aria-describedby={form.errors.name ? 'name-error' : undefined}
                        />
                        {form.errors.name && (
                            <p id="name-error" className="text-sm text-red-600" role="alert">
                                {form.errors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={form.data.category} onValueChange={(value) => form.setData('category', value as DocumentType)}>
                            <SelectTrigger className={form.errors.category ? 'border-red-300' : ''}>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={DocumentType.CONTRACT}>Contract</SelectItem>
                                <SelectItem value={DocumentType.INVOICE}>Invoice</SelectItem>
                                <SelectItem value={DocumentType.RECEIPT}>Receipt</SelectItem>
                                <SelectItem value={DocumentType.OTHER}>Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.errors.category && (
                            <p className="text-sm text-red-600" role="alert">
                                {form.errors.category}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <FileUpload
                            onChange={(file) => form.setData('file', file)}
                            accept="application/pdf,image/*,.doc,.docx"
                            maxSize={2} // 2MB limit
                            aria-invalid={!!form.errors.file}
                            aria-describedby={form.errors.file ? 'file-error' : undefined}
                        />
                        {form.errors.file && (
                            <p id="file-error" className="text-sm text-red-600" role="alert">
                                {form.errors.file}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Uploading...' : 'Upload Document'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 