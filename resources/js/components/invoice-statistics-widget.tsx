import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { BarChart3, CalendarCheck, Clock, TrendingUp } from 'lucide-react';

interface InvoiceStatisticsProps {
    stats: {
        totalOutstanding: number;
        overdueCount: number;
        upcomingCount: number;
        averageDaysOverdue: number;
    };
}

export function InvoiceStatisticsWidget({ stats }: InvoiceStatisticsProps) {
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth?.user?.currency || 'USD';

    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="border-sidebar-border/70 dark:border-sidebar-border border-b pb-3">
                <CardTitle className="flex items-center text-base font-semibold sm:text-lg">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Invoice Statistics
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Outstanding Amount</span>
                    <span className="text-xl font-bold">{formatCurrency(stats.totalOutstanding, userCurrency)}</span>
                </div>
                <div className="flex flex-col space-y-1">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Overdue Invoices</span>
                    <div className="flex items-center">
                        <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-xl font-bold">{stats.overdueCount}</span>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Upcoming Due</span>
                    <div className="flex items-center">
                        <CalendarCheck className="mr-1 h-4 w-4 text-blue-500" />
                        <span className="text-xl font-bold">{stats.upcomingCount}</span>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Avg. Days Overdue</span>
                    <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-amber-500" />
                        <span className="text-xl font-bold">{stats.averageDaysOverdue}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
