import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { FilterIcon, XIcon } from 'lucide-react';
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
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        // Only include filters that have values
        const activeFilters = Object.entries(localFilters).reduce(
            (acc, [key, value]) => {
                if (value !== undefined && value !== '') {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        router.get(route('invoices.index'), activeFilters, {
            preserveState: true,
            preserveScroll: true,
        });
        setIsOpen(false);
    };

    const clearFilters = () => {
        router.get(
            route('invoices.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
        setIsOpen(false);
    };

    const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '');

    return (
        <div className="relative">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsOpen(!isOpen)}>
                <FilterIcon className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {Object.values(filters).filter(Boolean).length}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="bg-background absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border p-4 shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-medium">Filters</h3>
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 w-8 p-0">
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={localFilters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
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
                                <label className="text-sm font-medium">Date From</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_from || ''}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Date To</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_to || ''}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Amount From</label>
                                <Input
                                    type="number"
                                    value={localFilters.amount_from || ''}
                                    onChange={(e) => handleFilterChange('amount_from', e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Amount To</label>
                                <Input
                                    type="number"
                                    value={localFilters.amount_to || ''}
                                    onChange={(e) => handleFilterChange('amount_to', e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <Button className="w-full" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
