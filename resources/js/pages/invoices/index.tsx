import { BulkActionsBar, EmptyState, FilterBar, InvoiceCard, InvoiceTable, SearchBar } from '@/components/invoices';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { getActiveFilters } from '@/lib/utils';
import { type BreadcrumbItem, type Invoice, type PaginatedData } from '@/types';
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
        title: 'Dashboard',
        href: route('dashboard'),
    },
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Invoices</h1>
                    <Link
                        href={route('invoices.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium sm:w-auto"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New Invoice
                    </Link>
                </div>

                {/* Search and filters section - Always show if we have invoices or if we're searching */}
                {(invoices.total > 0 || search || Object.values(filters).some(Boolean) || isCustomSort) && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full">
                                <SearchBar initialValue={search} placeholder="Search invoices..." />
                            </div>
                            {isCustomSort && (
                                <Button variant="outline" size="sm" onClick={handleResetSort} className="w-full sm:w-auto">
                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                    Reset Sort
                                </Button>
                            )}
                        </div>
                        <div className="w-full">
                            <FilterBar filters={filters} />
                        </div>
                    </div>
                )}

                {/* Search results info */}
                {(search || Object.values(filters).some(Boolean) || isCustomSort) && (
                    <div className="text-muted-foreground text-sm">
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

                {invoices.total === 0 ? (
                    <EmptyState isSearchResult={!!search} searchTerm={search} hasFilters={Object.values(filters).some(Boolean)} />
                ) : (
                    <>
                        {/* Desktop view - Table */}
                        <InvoiceTable
                            invoices={invoices.data}
                            selectedInvoices={selectedInvoices}
                            onSelectInvoice={handleSelectInvoice}
                            onSelectAll={handleSelectAll}
                            sort={sort}
                            onSort={handleSort}
                        />

                        {/* Mobile view - Cards */}
                        <div className="space-y-4 md:hidden">
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
                        <BulkActionsBar selectedInvoices={selectedInvoices} onClearSelection={clearSelection} />
                    </>
                )}
            </div>
        </AppLayout>
    );
}
