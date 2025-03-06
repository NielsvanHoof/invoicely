import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Format a date string
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
        return 'just now';
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Less than a day
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Less than a week
    if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    // Default to formatted date
    return formatDate(date.toISOString());
}

/**
 * Filter an object to only include properties with non-empty values
 * Useful for filtering out empty params in API requests
 */
export function getActiveFilters(filters: Record<string, string | undefined> | undefined): Record<string, string> {
    if (!filters) return {};

    return Object.entries(filters).reduce(
        (acc, [key, value]) => {
            if (value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        },
        {} as Record<string, string>,
    );
}
