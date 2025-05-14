import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface MetricsCardProps {
    title: string;
    value: string | number;
    description: string;
    trend?: number;
    isInverse?: boolean;
    currency?: string;
}

export function MetricsCard({ title, value, description, trend, isInverse = false, currency }: MetricsCardProps) {
    // Helper to determine if a metric is positive/negative
    const getTrendIndicator = (value: number, isInverse: boolean = false) => {
        if (value === 0) return null;

        const isPositive = isInverse ? value < 0 : value > 0;

        return (
            <span className={cn('ml-2 inline-flex items-center text-sm', isPositive ? 'text-green-600' : 'text-red-500')}>
                {isPositive ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
            </span>
        );
    };

    // Format value if it's a number and currency is provided
    const formattedValue = typeof value === 'number' && currency ? formatCurrency(value, currency) : value;

    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
            <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline">
                    <div className="text-2xl font-bold">{formattedValue}</div>
                    {trend !== undefined && getTrendIndicator(trend, isInverse)}
                </div>
                <CardDescription className="mt-2 text-xs">{description}</CardDescription>
            </CardContent>
        </Card>
    );
}
