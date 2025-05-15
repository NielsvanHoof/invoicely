import { AddDocumentDialog } from '@/components/documents/add-document-dialog';
import { DeleteDocumentDialog } from '@/components/documents/delete-document-dialog';
import { DocumentFilters } from '@/components/documents/document-filters';
import { DocumentHeader } from '@/components/documents/document-header';
import { DocumentList } from '@/components/documents/document-list';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Invoice } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface DocumentsIndexProps {
    invoice: Invoice;
    documents: PaginatedData<Document>;
    search?: string;
    filters: {
        category?: string;
    };
}

export default function DocumentsIndex({ invoice, documents, search = '', filters = {} }: DocumentsIndexProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

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
            href: route('documents.index', invoice.id),
        },
    ];

    function handleDeleteClick(document: Document) {
        setSelectedDocument(document);
        setIsDeleteDialogOpen(true);
    }

    function handleCategoryChange(value: string) {
        router.get(
            route('documents.index', invoice.id),
            {
                search,
                category: value === 'all' ? '' : value,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['documents', 'filters'],
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Documents for Invoice #${invoice.invoice_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <DocumentHeader invoiceNumber={invoice.invoice_number} invoiceId={invoice.id}>
                    <AddDocumentDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} invoiceId={invoice.id} />
                </DocumentHeader>

                <DocumentFilters search={search} category={filters.category || ''} invoiceId={invoice.id} onCategoryChange={handleCategoryChange} />

                <DocumentList documents={documents.data} invoiceId={invoice.id} onDeleteClick={handleDeleteClick} />

                <DeleteDocumentDialog
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    document={selectedDocument}
                    invoiceId={invoice.id}
                />
            </div>
        </AppLayout>
    );
}
