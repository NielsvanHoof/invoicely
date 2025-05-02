import { Link } from '@inertiajs/react';
import { FileTextIcon, FilterIcon, SearchIcon } from 'lucide-react';

interface EmptyStateProps {
    isSearchResult?: boolean;
    searchTerm?: string;
    hasFilters?: boolean;
}

export function EmptyState({ isSearchResult, searchTerm, hasFilters }: EmptyStateProps) {
    // Determine the appropriate icon based on the state
    const Icon = isSearchResult ? SearchIcon : hasFilters ? FilterIcon : FileTextIcon;

    // Get the appropriate title and description based on the state
    const getTitle = () => {
        if (isSearchResult) {
            return `No invoices found for "${searchTerm}"`;
        }
        if (hasFilters) {
            return 'No invoices match your filters';
        }
        return 'No invoices yet';
    };

    const getDescription = () => {
        if (isSearchResult) {
            return 'Try adjusting your search terms or browse all invoices.';
        }
        if (hasFilters) {
            return 'Try adjusting your filter criteria or browse all invoices.';
        }
        return 'Get started by creating your first invoice.';
    };

    const getActionText = () => {
        if (isSearchResult || hasFilters) {
            return 'View All Invoices';
        }
        return 'Create Invoice';
    };

    const getActionRoute = () => {
        if (isSearchResult || hasFilters) {
            return route('invoices.index');
        }
        return route('invoices.create');
    };

    return (
        <div
            className="flex h-[450px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
            role="status"
            aria-live="polite"
        >
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full" aria-hidden="true">
                <Icon className="text-muted-foreground h-10 w-10" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">{getTitle()}</h3>

            <p className="text-muted-foreground mt-2 max-w-md text-sm">{getDescription()}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                    href={getActionRoute()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    aria-label={getActionText()}
                >
                    {getActionText()}
                </Link>

                {(isSearchResult || hasFilters) && (
                    <Link
                        href={route('invoices.create')}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        aria-label="Create new invoice"
                    >
                        Create New Invoice
                    </Link>
                )}
            </div>
        </div>
    );
}
