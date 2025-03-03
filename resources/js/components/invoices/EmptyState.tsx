import { Link } from '@inertiajs/react';
import { FileTextIcon } from 'lucide-react';

interface EmptyStateProps {
    isSearchResult?: boolean;
    searchTerm?: string;
    hasFilters?: boolean;
}

export function EmptyState({ isSearchResult, searchTerm, hasFilters }: EmptyStateProps) {
    return (
        <div className="flex h-[450px] flex-col items-center justify-center rounded-lg border border-dashed">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
                <FileTextIcon className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
                {isSearchResult ? `No invoices found for "${searchTerm}"` : hasFilters ? 'No invoices match your filters' : 'No invoices yet'}
            </h3>
            <p className="text-muted-foreground mt-2 text-center text-sm">
                {isSearchResult
                    ? 'Try adjusting your search or browse all invoices.'
                    : hasFilters
                      ? 'Try adjusting your filters or browse all invoices.'
                      : 'Get started by creating your first invoice.'}
            </p>
            <div className="mt-6">
                <Link
                    href={route('invoices.create')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
                >
                    Create Invoice
                </Link>
            </div>
        </div>
    );
}
