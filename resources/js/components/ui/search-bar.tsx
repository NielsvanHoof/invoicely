import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getActiveFilters } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { LoaderIcon, SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
    initialValue?: string;
    onSearch?: (value: string) => void;
    placeholder?: string;
    routeName?: string;
    routeParams?: Record<string, string | number>;
    className?: string;
    preserveFilters?: boolean;
    preserveScroll?: boolean;
    only?: string[];
}

export function SearchBar({
    initialValue = '',
    onSearch,
    placeholder = 'Search...',
    routeName,
    routeParams,
    className = '',
    preserveFilters = true,
    preserveScroll = true,
    only = [],
}: SearchBarProps) {
    // Ensure we always have a string value, never undefined or null
    const [searchTerm, setSearchTerm] = useState<string>(initialValue ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { filters, sort } = usePage().props as { filters?: Record<string, string>; sort?: Record<string, string> };

    // Update searchTerm when initialValue changes, ensuring it's always a string
    useEffect(() => {
        setSearchTerm(initialValue ?? '');
    }, [initialValue]);

    const debouncedSearch = debounce((value: string) => {
        setIsSearching(true);

        if (onSearch) {
            onSearch(value);
            setIsSearching(false);
            return;
        }

        if (!routeName) {
            console.warn('SearchBar: routeName is required when onSearch is not provided');
            setIsSearching(false);
            return;
        }

        // Get only the active filters using the utility function
        const activeFilters = preserveFilters ? getActiveFilters(filters, sort) : {};

        router.get(
            route(routeName, routeParams),
            {
                search: value,
                ...activeFilters,
            },
            {
                preserveState: true,
                preserveScroll,
                only,
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

        if (!routeName) {
            console.warn('SearchBar: routeName is required when onSearch is not provided');
            setIsSearching(false);
            return;
        }

        // Get only the active filters using the utility function
        const activeFilters = preserveFilters ? getActiveFilters(filters, sort) : {};

        router.get(
            route(routeName, routeParams),
            {
                search: '',
                ...activeFilters,
            },
            {
                preserveState: true,
                preserveScroll,
                only,
                onFinish: () => setIsSearching(false),
            },
        );

        // Focus the input after clearing
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Clear search on Escape key
        if (e.key === 'Escape' && searchTerm) {
            e.preventDefault();
            clearSearch();
        }
    };

    return (
        <div className={`relative w-full ${className}`} role="search" aria-label="Search">
            <div className="relative">
                <Input
                    ref={inputRef}
                    type="search"
                    inputMode="search"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`pr-10 transition-all duration-200 ${isFocused ? 'ring-primary/50 ring-2' : ''}`}
                    aria-label={placeholder}
                    aria-busy={isSearching}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3" aria-hidden="true">
                    {isSearching ? (
                        <LoaderIcon className="text-muted-foreground h-4 w-4 animate-spin" aria-label="Searching..." />
                    ) : searchTerm ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearSearch}
                            className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors"
                            aria-label="Clear search"
                            title="Clear search (Esc)"
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    ) : (
                        <SearchIcon className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                    )}
                </div>
            </div>
            {searchTerm && (
                <div className="text-muted-foreground mt-1 text-xs" role="status" aria-live="polite">
                    Press Esc to clear search
                </div>
            )}
        </div>
    );
} 