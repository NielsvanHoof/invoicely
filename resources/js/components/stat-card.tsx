import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon?: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
    return (
        <div className={cn('border-sidebar-border/70 dark:border-sidebar-border flex flex-col space-y-2 rounded-xl border p-6', className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                    <h3 className="mt-1 text-2xl font-bold">{value}</h3>
                </div>
                {Icon && (
                    <div className="rounded-full bg-neutral-100 p-2 dark:bg-neutral-800">
                        <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                    </div>
                )}
            </div>

            {(description || trend) && (
                <div className="flex items-center space-x-2">
                    {trend && (
                        <span
                            className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                            )}
                        >
                            {trend.isPositive ? '+' : '-'}
                            {Math.abs(trend.value)}%
                        </span>
                    )}
                    {description && <span className="text-xs text-neutral-500 dark:text-neutral-400">{description}</span>}
                </div>
            )}
        </div>
    );
}
