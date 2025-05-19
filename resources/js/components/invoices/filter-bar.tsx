import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getActiveFilters } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { FilterIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterBarProps {
    filters: {
        status?: string;
        date_from?: string;
        date_to?: string;
        amount_from?: string;
        amount_to?: string;
    };
}

export function FilterBar({ filters }: FilterBarProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const { search, sort } = usePage().props as { search?: string; sort?: Record<string, string> };

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const activeFilters = getActiveFilters(localFilters, sort);
        const params = {
            ...activeFilters,
            ...(search ? { search } : {}),
        };
        router.get(route('invoices.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const params = search ? { search } : {};
        router.get(route('invoices.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '');
    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="bg-background/90 border-muted mb-6 rounded-lg border p-4 shadow-sm">
            <form
                className="grid grid-cols-1 items-end gap-4 md:grid-cols-3 lg:grid-cols-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters();
                }}
            >
                <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                        value={localFilters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                        aria-labelledby="status-filter"
                    >
                        <SelectTrigger id="status-filter" className="w-full">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Date From</Label>
                    <Input
                        id="date-from"
                        type="date"
                        value={localFilters.date_from || ''}
                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                        placeholder="From"
                        aria-label="Filter by date from"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Date To</Label>
                    <Input
                        id="date-to"
                        type="date"
                        value={localFilters.date_to || ''}
                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                        placeholder="To"
                        aria-label="Filter by date to"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Amount From</Label>
                    <Input
                        id="amount-from"
                        type="number"
                        value={localFilters.amount_from || ''}
                        onChange={(e) => handleFilterChange('amount_from', e.target.value)}
                        placeholder="Min"
                        step="0.01"
                        aria-label="Filter by minimum amount"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-sm font-medium">Amount To</Label>
                    <Input
                        id="amount-to"
                        type="number"
                        value={localFilters.amount_to || ''}
                        onChange={(e) => handleFilterChange('amount_to', e.target.value)}
                        placeholder="Max"
                        step="0.01"
                        aria-label="Filter by maximum amount"
                    />
                </div>
                <div className="col-span-full mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <Button type="submit" className="w-full sm:w-auto" aria-label="Apply selected filters">
                        <FilterIcon className="mr-2 h-4 w-4" />
                        Apply Filters
                    </Button>
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="outline"
                            className="flex w-full items-center gap-1 sm:w-auto"
                            onClick={clearFilters}
                            aria-label="Clear all filters"
                        >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Clear Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs">{activeFilterCount}</span>
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
