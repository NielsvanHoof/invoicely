import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import React from 'react';

interface DocumentHeaderProps {
    invoiceNumber: string;
    invoiceId: number;
    children: React.ReactNode;
}

export function DocumentHeader({ invoiceNumber, invoiceId, children }: DocumentHeaderProps) {
    return (
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="h-8 w-8" aria-label="Go back to invoice">
                    <Link href={route('invoices.show', invoiceId)}>
                        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Documents</h1>
                    <p className="text-muted-foreground mt-1">Manage documents for Invoice #{invoiceNumber}</p>
                </div>
            </div>
            {children}
        </div>
    );
}
