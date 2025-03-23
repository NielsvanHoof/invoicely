import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getActiveFilters } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { LoaderIcon, SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchBarProps {
    initialValue?: string;
    onSearch?: (value: string) => void;
    placeholder?: string;
    routeName?: string;
}

export function SearchBar({ initialValue = '', onSearch, placeholder = 'Search...', routeName = 'invoices.index' }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [isSearching, setIsSearching] = useState(false);
    const { filters } = usePage().props as { filters?: Record<string, string> };

    // Update searchTerm when initialValue changes
    useEffect(() => {
        setSearchTerm(initialValue);
    }, [initialValue]);

    const debouncedSearch = debounce((value: string) => {
        setIsSearching(true);

        if (onSearch) {
            onSearch(value);
            setIsSearching(false);
            return;
        }

        // Get only the active filters using the utility function
        const activeFilters = getActiveFilters(filters);

        router.get(
            route(routeName),
            {
                search: value,
                // Preserve only active filters
                ...activeFilters,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['invoices', 'search'],
                onFinish: () => setIsSearching(false),
            },
        );
    }, 300);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setIsSearching(true);

        if (onSearch) {
            onSearch('');
            setIsSearching(false);
            return;
        }

        // Get only the active filters using the utility function
        const activeFilters = getActiveFilters(filters);

        router.get(
            route(routeName),
            {
                search: '',
                // Preserve only active filters
                ...activeFilters,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['invoices', 'search'],
                onFinish: () => setIsSearching(false),
            },
        );
    };

    return (
        <div className="relative w-full">
            <div className="relative">
                <Input
                    type="search"
                    inputMode="search"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pr-10"
                    aria-label={placeholder}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isSearching ? (
                        <LoaderIcon className="text-muted-foreground h-4 w-4 animate-spin" />
                    ) : searchTerm ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearSearch}
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                            aria-label="Clear search"
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    ) : (
                        <SearchIcon className="text-muted-foreground h-4 w-4" />
                    )}
                </div>
            </div>
        </div>
    );
}
