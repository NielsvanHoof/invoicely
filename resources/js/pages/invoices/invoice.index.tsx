import { BulkActionsBar, FilterBar, InvoiceCard, InvoiceTable } from '@/components/invoices';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { SearchBar } from '@/components/ui/search-bar';
import AppLayout from '@/layouts/app-layout';
import { getActiveFilters } from '@/lib/utils';
import { BreadcrumbItem, PaginatedData } from '@/types';
import { Invoice } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowUpDown, PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface InvoicesIndexProps {
    invoices: PaginatedData<Invoice>;
    search?: string;
    filters?: {
        status?: string;
        date_from?: string;
        date_to?: string;
        amount_from?: string;
        amount_to?: string;
    };
    sort?: {
        field: string;
        direction: 'asc' | 'desc';
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: route('invoices.index'),
    },
];

export default function InvoicesIndex({ invoices, search, filters = {}, sort = { field: 'created_at', direction: 'desc' } }: InvoicesIndexProps) {
    const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);

    const handleSelectInvoice = (invoice: Invoice, isSelected: boolean) => {
        setSelectedInvoices((prev) => {
            if (isSelected) {
                return prev.some((i) => i.id === invoice.id) ? prev : [...prev, invoice];
            } else {
                return prev.filter((i) => i.id !== invoice.id);
            }
        });
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedInvoices(invoices.data);
        } else {
            setSelectedInvoices([]);
        }
    };

    const clearSelection = () => {
        setSelectedInvoices([]);
    };

    const handleSort = (field: string) => {
        const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';

        // Only include active filters and sort parameters
        const params = {
            ...getActiveFilters(filters, { field, direction: newDirection }),
            ...(search ? { search } : {}),
            ...(field !== 'created_at' ? { sort_field: field, sort_direction: newDirection } : {}),
        };

        router.get(route('invoices.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetSort = () => {
        // Only include active filters, removing sort parameters
        const params = {
            ...getActiveFilters(filters, undefined),
            ...(search ? { search } : {}),
        };

        router.get(route('invoices.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const isCustomSort = sort.field !== 'created_at' || sort.direction !== 'desc';
    const hasActiveFilters = Object.values(filters).some(Boolean);
    const showSearchAndFilters = invoices.total > 0 || search || hasActiveFilters || isCustomSort;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4" role="main">
                {/* Header Section */}
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Invoices</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage and track your invoices</p>
                    </div>
                    <Link
                        href={route('invoices.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors sm:w-auto"
                        aria-label="Create new invoice"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        New Invoice
                    </Link>
                </header>

                {/* Search and Filters Section */}
                {showSearchAndFilters && (
                    <section aria-label="Search and filters" className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full">
                                <SearchBar
                                    initialValue={search}
                                    placeholder="Search invoices..."
                                    aria-label="Search invoices"
                                    routeName="invoices.index"
                                    only={['invoices', 'search']}
                                />
                            </div>
                            {isCustomSort && (
                                <Button variant="outline" size="sm" onClick={handleResetSort} className="w-full sm:w-auto" aria-label="Reset sorting">
                                    <ArrowUpDown className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Reset Sort
                                </Button>
                            )}
                        </div>
                        <div className="w-full">
                            <FilterBar filters={filters} />
                        </div>
                    </section>
                )}

                {/* Search Results Info */}
                {(search || hasActiveFilters || isCustomSort) && (
                    <div className="text-muted-foreground text-sm" role="status" aria-live="polite">
                        {invoices.total === 0 ? (
                            <p>No results found</p>
                        ) : (
                            <p>
                                Found {invoices.total} result{invoices.total !== 1 ? 's' : ''}
                                {selectedInvoices.length > 0 && <span className="ml-2">({selectedInvoices.length} selected)</span>}
                            </p>
                        )}
                    </div>
                )}

                {/* Main Content */}
                {invoices.total === 0 ? (
                    <EmptyState
                        type={search ? 'search' : hasActiveFilters ? 'filter' : 'default'}
                        searchTerm={search}
                        primaryAction={{
                            label: search || hasActiveFilters ? 'View All Invoices' : 'Create Invoice',
                            href: search || hasActiveFilters ? route('invoices.index') : route('invoices.create'),
                            variant: 'primary',
                        }}
                        secondaryAction={
                            search || hasActiveFilters
                                ? {
                                      label: 'Create New Invoice',
                                      href: route('invoices.create'),
                                      variant: 'secondary',
                                  }
                                : undefined
                        }
                    />
                ) : (
                    <section aria-label="Invoice list">
                        {/* Desktop view - Table */}
                        <div className="hidden md:block">
                            <InvoiceTable
                                invoices={invoices.data}
                                selectedInvoices={selectedInvoices}
                                onSelectInvoice={handleSelectInvoice}
                                onSelectAll={handleSelectAll}
                                sort={sort}
                                onSort={handleSort}
                            />
                        </div>

                        {/* Mobile view - Cards */}
                        <div className="space-y-4 md:hidden" role="list">
                            {invoices.data.map((invoice) => (
                                <InvoiceCard
                                    key={invoice.id}
                                    invoice={invoice}
                                    isSelected={selectedInvoices.some((i) => i.id === invoice.id)}
                                    onSelectInvoice={handleSelectInvoice}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="border-sidebar-border/70 dark:border-sidebar-border mt-4 rounded-xl border">
                            <Pagination
                                links={invoices.links}
                                prevPageUrl={invoices.prev_page_url}
                                nextPageUrl={invoices.next_page_url}
                                from={invoices.from}
                                to={invoices.to}
                                total={invoices.total}
                            />
                        </div>

                        {/* Bulk Actions Bar */}
                        {selectedInvoices.length > 0 && <BulkActionsBar selectedInvoices={selectedInvoices} onClearSelection={clearSelection} />}
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
