import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { formatDate, formatFileSize } from '@/lib/utils';
import { type Document } from '@/types';
import { FileIcon, TrashIcon, UploadIcon } from 'lucide-react';

interface DocumentCardProps {
    document: Document;
    invoiceId: number;
    onDeleteClick: (document: Document) => void;
}

export function DocumentCard({ document, invoiceId, onDeleteClick }: DocumentCardProps) {
    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
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
                        onClick={() => window.open(route('documents.download', [invoiceId, document.id]), '_blank')}
                        className="h-8"
                    >
                        <UploadIcon className="mr-1.5 h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteClick(document)}
                        className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                    >
                        <TrashIcon className="mr-1.5 h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
}
