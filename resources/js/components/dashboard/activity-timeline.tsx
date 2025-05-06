import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { Deferred, Link } from '@inertiajs/react';
import { Activity, BellIcon, CheckCircle, PlusCircle, RefreshCw } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'created' | 'updated' | 'reminder';
    invoice_number: string;
    client_name: string;
    amount: number;
    status: string;
    date: string;
    reminder_type?: string;
    reminder_id?: string;
    sent_at?: string;
    scheduled_date?: string;
    timestamp: string;
}

interface ActivityTimelineProps {
    activities: ActivityItem[];
    userCurrency: string;
}

export function ActivityTimeline({ activities, userCurrency }: ActivityTimelineProps) {
    // Function to get the appropriate icon for activity type
    const getActivityIcon = (type: string, status: string) => {
        if (type === 'created') return PlusCircle;
        if (type === 'reminder') return BellIcon;
        if (status === 'paid') return CheckCircle;
        return RefreshCw;
    };

    // Function to get the activity description
    const getActivityDescription = (type: string, status: string, reminderType?: string) => {
        if (type === 'created') return 'Created new invoice';
        if (type === 'reminder') {
            if (reminderType === 'upcoming') return 'Created upcoming payment reminder';
            if (reminderType === 'overdue') return 'Created overdue payment reminder';
            if (reminderType === 'thank_you') return 'Created thank you reminder';
            return 'Created reminder';
        }
        if (status === 'paid') return 'Marked as paid';
        if (status === 'sent') return 'Sent to client';
        if (status === 'overdue') return 'Marked as overdue';
        return 'Updated invoice';
    };

    return (
        <section aria-labelledby="activity-heading" className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
            <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-between border-b p-4">
                <h2 id="activity-heading" className="flex items-center text-lg font-semibold">
                    <Activity className="mr-2 h-5 w-5" aria-hidden="true" />
                    Recent Activity
                </h2>
            </div>

            <div className="p-4">
                <Deferred data="recentActivity" fallback={<Skeleton className="h-20 w-full" />}>
                    <div className="space-y-4">
                        {activities?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Activity className="mb-2 h-8 w-8 text-neutral-400" aria-hidden="true" />
                                <p className="text-sm text-neutral-500">No recent activity to display</p>
                                <p className="mt-1 text-xs text-neutral-400">Your activity feed will appear here as you create and manage invoices</p>
                            </div>
                        ) : (
                            activities?.map((activity) => {
                                const ActivityIcon = getActivityIcon(activity.type, activity.status);
                                return (
                                    <div
                                        key={`${activity.id}-${activity.type}-${activity.timestamp}${activity.reminder_id ? `-${activity.reminder_id}` : ''}`}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                                                activity.type === 'reminder'
                                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500'
                                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500'
                                            }`}
                                            aria-hidden="true"
                                        >
                                            <ActivityIcon className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">
                                                    {getActivityDescription(activity.type, activity.status, activity.reminder_type)}
                                                </p>
                                                <span className="text-xs text-neutral-500">{formatRelativeTime(new Date(activity.date))}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={
                                                        activity.type === 'reminder'
                                                            ? route('reminders.index', activity.id)
                                                            : route('invoices.show', activity.id)
                                                    }
                                                    className="text-xs text-neutral-600 hover:underline dark:text-neutral-400"
                                                    aria-label={`View ${activity.type === 'reminder' ? 'reminder' : 'invoice'} ${activity.invoice_number}`}
                                                >
                                                    {activity.invoice_number} - {activity.client_name}
                                                </Link>
                                                <span className="text-xs font-medium">{formatCurrency(activity.amount, userCurrency)}</span>
                                            </div>
                                            {activity.type === 'reminder' && activity.scheduled_date && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-neutral-500">
                                                        {activity.sent_at
                                                            ? `Sent: ${formatDate(activity.sent_at)}`
                                                            : `Scheduled: ${formatDate(activity.scheduled_date)}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Deferred>
            </div>
        </section>
    );
}
