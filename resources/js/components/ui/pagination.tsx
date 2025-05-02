import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    from: number;
    to: number;
    total: number;
}

export function Pagination({ links, prevPageUrl, nextPageUrl, from, to, total }: PaginationProps) {
    const pageLinks = links.filter(
        (link) => !link.label.includes('Previous') && !link.label.includes('Next')
    );

    const currentPage = links.find(link => link.active)?.label || '1';
    const totalPages = pageLinks.length;

    return (
        <nav 
            className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4 sm:gap-0"
            aria-label="Pagination"
        >
            <div 
                className="text-sm text-muted-foreground text-center sm:text-left"
                aria-live="polite"
            >
                Showing <span className="font-medium">{from}</span> to{' '}
                <span className="font-medium">{to}</span> of{' '}
                <span className="font-medium">{total}</span> results
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!prevPageUrl}
                    asChild={!!prevPageUrl}
                    aria-label="Go to previous page"
                    aria-disabled={!prevPageUrl}
                >
                    {prevPageUrl ? (
                        <Link 
                            href={prevPageUrl} 
                            preserveScroll
                            className="flex items-center"
                        >
                            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Previous Page</span>
                        </Link>
                    ) : (
                        <span className="flex items-center">
                            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Previous Page</span>
                        </span>
                    )}
                </Button>

                <div 
                    className="hidden sm:flex sm:items-center sm:space-x-2"
                    role="list"
                    aria-label="Page numbers"
                >
                    {pageLinks.map((link, i) => {
                        // Handle ellipsis
                        if (link.label === '...') {
                            return (
                                <Button 
                                    key={`ellipsis-${i}`} 
                                    variant="outline" 
                                    size="sm" 
                                    disabled
                                    aria-hidden="true"
                                >
                                    <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                            );
                        }

                        // Handle page links
                        return link.url ? (
                            <Button
                                key={link.label}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild={!link.active}
                                aria-current={link.active ? 'page' : undefined}
                                aria-label={`Go to page ${link.label}`}
                            >
                                {link.active ? (
                                    <span>{link.label}</span>
                                ) : (
                                    <Link 
                                        href={link.url} 
                                        preserveScroll
                                        className="flex items-center justify-center"
                                    >
                                        {link.label}
                                    </Link>
                                )}
                            </Button>
                        ) : (
                            <Button 
                                key={link.label} 
                                variant="outline" 
                                size="sm" 
                                disabled
                                aria-disabled="true"
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                </div>

                {/* Mobile current page indicator */}
                <div 
                    className="sm:hidden flex items-center"
                    aria-label={`Current page ${currentPage} of ${totalPages}`}
                >
                    <span className="text-sm px-2">
                        Page {currentPage}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!nextPageUrl}
                    asChild={!!nextPageUrl}
                    aria-label="Go to next page"
                    aria-disabled={!nextPageUrl}
                >
                    {nextPageUrl ? (
                        <Link 
                            href={nextPageUrl} 
                            preserveScroll
                            className="flex items-center"
                        >
                            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Next Page</span>
                        </Link>
                    ) : (
                        <span className="flex items-center">
                            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Next Page</span>
                        </span>
                    )}
                </Button>
            </div>
        </nav>
    );
} 