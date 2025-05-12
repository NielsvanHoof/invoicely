import { EmptyState } from '@/components/ui/empty-state';
import { type Document } from '@/types';
import { FileIcon } from 'lucide-react';
import React from 'react';
import { DocumentCard } from './document-card';

interface DocumentListProps {
    documents: Document[];
    invoiceId: number;
    onDeleteClick: (document: Document) => void;
}

export function DocumentList({ documents, invoiceId, onDeleteClick }: DocumentListProps) {
    return (
        <div className="grid gap-4">
            {documents.map((document) => (
                <DocumentCard
                    key={document.id}
                    document={document}
                    invoiceId={invoiceId}
                    onDeleteClick={onDeleteClick}
                />
            ))}

            {documents.length === 0 && (
                <EmptyState
                    title="No documents found"
                    description="Upload documents related to this invoice, such as contracts, receipts, or additional supporting materials."
                    type="default"
                    icon={FileIcon}
                    className="h-[300px]"
                />
            )}
        </div>
    );
} 