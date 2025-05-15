import { SearchBar } from '@/components/ui/search-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterIcon } from 'lucide-react';

interface DocumentFiltersProps {
    search: string;
    category: string;
    invoiceId: number;
    onCategoryChange: (value: string) => void;
}

export function DocumentFilters({ search, category, invoiceId, onCategoryChange }: DocumentFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <SearchBar
                    initialValue={search}
                    placeholder="Search documents..."
                    aria-label="Search documents"
                    routeName="documents.index"
                    routeParams={{ invoice: invoiceId }}
                    only={['documents', 'search']}
                />
            </div>
            <div className="flex items-center gap-2">
                <FilterIcon className="text-muted-foreground h-4 w-4" />
                <Select value={category || 'all'} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="contract">Contracts</SelectItem>
                        <SelectItem value="invoice">Invoices</SelectItem>
                        <SelectItem value="receipt">Receipts</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
