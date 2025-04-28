import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatFileSize } from '@/lib/utils';
import { type BreadcrumbItem, type Document, type Invoice } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FileIcon, PlusIcon, SearchIcon, TrashIcon, UploadIcon, FilterIcon } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface DocumentsIndexProps {
    invoice: Invoice;
}

export default function DocumentsIndex({ invoice }: DocumentsIndexProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
            title: 'Documents',
            href: route('invoices.documents.index', invoice.id),
        },
    ];

    const form = useForm({
        file: null as File | null,
        name: '',
        category: 'other',
    });

    // Filter documents based on search and category
    const filteredDocuments = useMemo(() => {
        return invoice.documents?.filter((doc) => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
            return matchesSearch && matchesCategory;
        }) || [];
    }, [invoice.documents, searchQuery, selectedCategory]);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('invoices.documents.store', invoice.id), {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                form.reset();
            },
        });
    }

    function handleDeleteClick(document: Document) {
        setSelectedDocument(document);
        setIsDeleteDialogOpen(true);
    }

    function handleDelete() {
        if (!selectedDocument) return;

        router.delete(route('invoices.documents.destroy', [invoice.id, selectedDocument.id]), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setSelectedDocument(null);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Documents for Invoice #${invoice.invoice_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Documents</h1>
                        <p className="text-muted-foreground mt-1">Manage documents for Invoice #{invoice.invoice_number}</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={form.data.category}
                                        onValueChange={(value) => form.setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="contract">Contract</SelectItem>
                                            <SelectItem value="invoice">Invoice</SelectItem>
                                            <SelectItem value="receipt">Receipt</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file">File</Label>
                                    <Input id="file" type="file" onChange={(e) => form.setData('file', e.target.files?.[0] || null)} />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={form.processing}>
                                        {form.processing ? 'Uploading...' : 'Upload Document'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="h-4 w-4 text-muted-foreground" />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="contract">Contracts</SelectItem>
                                <SelectItem value="invoice">Invoices</SelectItem>
                                <SelectItem value="receipt">Receipts</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredDocuments.map((document) => (
                        <Card key={document.id} className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                        <FileIcon className="h-5 w-5 text-neutral-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{document.name}</h3>
                                            <Badge variant="outline">{document.category}</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            {formatFileSize(document.size)} • {formatDate(document.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(route('invoices.documents.download', [invoice.id, document.id]), '_blank')}
                                        className="h-8"
                                    >
                                        <UploadIcon className="mr-1.5 h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Download</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteClick(document)}
                                        className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                                    >
                                        <TrashIcon className="mr-1.5 h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Delete</span>
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}

                    {filteredDocuments.length === 0 && (
                        <Card className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <FileIcon className="h-8 w-8 text-neutral-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                                    {searchQuery || selectedCategory !== 'all'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Upload documents related to this invoice, such as contracts, receipts, or additional supporting materials.'}
                                </p>
                                <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Upload your first document
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Document</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this document? This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
