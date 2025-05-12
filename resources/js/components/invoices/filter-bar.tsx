import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getActiveFilters } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { FilterIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const filterDialogRef = useRef<HTMLDivElement>(null);
    const { search, sort } = usePage().props as { search?: string; sort?: Record<string, string> };

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Handle click outside to close filter dialog
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isOpen &&
                filterDialogRef.current &&
                !filterDialogRef.current.contains(event.target as Node) &&
                !filterButtonRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Handle escape key to close filter dialog
    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        }

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [isOpen]);

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
        setIsOpen(false);
    };

    const clearFilters = () => {
        const params = search ? { search } : {};
        router.get(route('invoices.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
        setIsOpen(false);
    };

    const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '');
    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="relative w-full sm:w-auto">
            <Button
                ref={filterButtonRef}
                variant="outline"
                size="sm"
                className="w-full gap-2 sm:w-auto"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                aria-controls="filter-dialog"
            >
                <FilterIcon className="h-4 w-4" aria-hidden="true" />
                Filters
                {hasActiveFilters && <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">{activeFilterCount}</span>}
            </Button>

            {isOpen && (
                <div
                    ref={filterDialogRef}
                    id="filter-dialog"
                    role="dialog"
                    aria-label="Filter options"
                    aria-modal="true"
                    className="bg-background fixed inset-0 top-0 right-0 z-50 h-full w-full overflow-auto border p-4 shadow-lg sm:absolute sm:inset-auto sm:top-full sm:mt-2 sm:h-auto sm:w-80 sm:overflow-visible sm:rounded-lg"
                >
                    <div className="bg-background sticky top-0 mb-4 flex items-center justify-between pb-4">
                        <h3 className="font-medium">Filters</h3>
                        <div className="flex items-center gap-2">
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 w-8 p-0" aria-label="Clear all filters">
                                    <XIcon className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 p-0 sm:hidden"
                                aria-label="Close filters"
                            >
                                <XIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label id="status-filter-label" className="text-sm font-medium">
                                Status
                            </label>
                            <Select
                                value={localFilters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                                aria-labelledby="status-filter-label"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date-from" className="text-sm font-medium">
                                    Date From
                                </label>
                                <Input
                                    id="date-from"
                                    type="date"
                                    value={localFilters.date_from || ''}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    aria-label="Filter by date from"
                                />
                            </div>
                            <div>
                                <label htmlFor="date-to" className="text-sm font-medium">
                                    Date To
                                </label>
                                <Input
                                    id="date-to"
                                    type="date"
                                    value={localFilters.date_to || ''}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    aria-label="Filter by date to"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="amount-from" className="text-sm font-medium">
                                    Amount From
                                </label>
                                <Input
                                    id="amount-from"
                                    type="number"
                                    value={localFilters.amount_from || ''}
                                    onChange={(e) => handleFilterChange('amount_from', e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                    aria-label="Filter by minimum amount"
                                />
                            </div>
                            <div>
                                <label htmlFor="amount-to" className="text-sm font-medium">
                                    Amount To
                                </label>
                                <Input
                                    id="amount-to"
                                    type="number"
                                    value={localFilters.amount_to || ''}
                                    onChange={(e) => handleFilterChange('amount_to', e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                    aria-label="Filter by maximum amount"
                                />
                            </div>
                        </div>

                        <div className="bg-background sticky bottom-0 flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                className="w-full sm:hidden"
                                onClick={() => setIsOpen(false)}
                                aria-label="Cancel filter changes"
                            >
                                Cancel
                            </Button>
                            <Button className="w-full" onClick={applyFilters} aria-label="Apply selected filters">
                                Apply Filters
                            </Button>
                        </div>

                        {hasActiveFilters && (
                            <Button variant="outline" className="mt-2 w-full sm:hidden" onClick={clearFilters} aria-label="Clear all filters">
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
