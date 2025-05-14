import { Link } from '@inertiajs/react';
import { LucideIcon, SearchIcon, FilterIcon } from 'lucide-react';
import React from 'react';

interface ActionButton {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
    ariaLabel?: string;
}

type EmptyStateType = 'default' | 'search' | 'filter';

interface EmptyStateProps {
    // Content
    title?: string;
    description?: string;
    icon?: LucideIcon;
    
    // State type
    type?: EmptyStateType;
    searchTerm?: string;
    
    // Actions
    actions?: ActionButton[];
    primaryAction?: ActionButton;
    secondaryAction?: ActionButton;
    
    // Optional styling
    className?: string;
    iconClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    actionsClassName?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon,
    type = 'default',
    searchTerm,
    actions = [],
    primaryAction,
    secondaryAction,
    className = '',
    iconClassName = '',
    titleClassName = '',
    descriptionClassName = '',
    actionsClassName = '',
}: EmptyStateProps) {
    // Determine the appropriate icon based on the state
    const defaultIcon = type === 'search' ? SearchIcon : type === 'filter' ? FilterIcon : Icon;

    // Get the appropriate title and description based on the state
    const getTitle = () => {
        if (title) return title;
        
        switch (type) {
            case 'search':
                return searchTerm ? `No results found for "${searchTerm}"` : 'No search results';
            case 'filter':
                return 'No items match your filters';
            default:
                return 'No items found';
        }
    };

    const getDescription = () => {
        if (description) return description;
        
        switch (type) {
            case 'search':
                return 'Try adjusting your search terms or browse all items.';
            case 'filter':
                return 'Try adjusting your filter criteria or browse all items.';
            default:
                return 'Get started by creating your first item.';
        }
    };

    // Combine provided actions with primary/secondary actions
    const allActions = [
        ...(primaryAction ? [primaryAction] : []),
        ...(secondaryAction ? [secondaryAction] : []),
        ...actions,
    ];

    return (
        <div
            className={`flex h-[450px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center ${className}`}
            role="status"
            aria-live="polite"
        >
            {defaultIcon && (
                <div className={`bg-muted flex h-20 w-20 items-center justify-center rounded-full ${iconClassName}`} aria-hidden="true">
                    {React.createElement(defaultIcon, { className: "text-muted-foreground h-10 w-10" })}
                </div>
            )}

            <h3 className={`mt-4 text-lg font-semibold ${titleClassName}`}>{getTitle()}</h3>

            <p className={`text-muted-foreground mt-2 max-w-md text-sm ${descriptionClassName}`}>{getDescription()}</p>

            {allActions.length > 0 && (
                <div className={`mt-6 flex flex-col gap-3 sm:flex-row ${actionsClassName}`}>
                    {allActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                action.variant === 'secondary'
                                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                            aria-label={action.ariaLabel || action.label}
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
} 