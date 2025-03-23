import { EmptyState, FilterBar, InvoiceCard, InvoiceTable, SearchBar } from '@/components/invoices';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Invoice, type PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

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

export default function InvoicesIndex({ invoices, search, filters = {} }: InvoicesIndexProps) {
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
                {(invoices.total > 0 || search || Object.values(filters).some(Boolean)) && (
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <SearchBar initialValue={search} placeholder="Search invoices..." />
                        </div>
                        <div className="w-full">
                            <FilterBar filters={filters} />
                        </div>
                    </div>
                )}

                {/* Search results info */}
                {(search || Object.values(filters).some(Boolean)) && (
                    <div className="text-muted-foreground text-sm">
                        {invoices.total === 0 ? (
                            <p>No results found</p>
                        ) : (
                            <p>
                                Found {invoices.total} result{invoices.total !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                )}

                {invoices.total === 0 ? (
                    <EmptyState isSearchResult={!!search} searchTerm={search} hasFilters={Object.values(filters).some(Boolean)} />
                ) : (
                    <>
                        {/* Desktop view - Table */}
                        <InvoiceTable invoices={invoices.data} />

                        {/* Mobile view - Cards */}
                        <div className="space-y-4 md:hidden">
                            {invoices.data.map((invoice) => (
                                <InvoiceCard key={invoice.id} invoice={invoice} />
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
                    </>
                )}
            </div>
        </AppLayout>
    );
}
