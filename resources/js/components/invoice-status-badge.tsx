import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

interface InvoiceStatusBadgeProps {
    status: InvoiceStatus;
    className?: string;
}

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
    draft: {
        label: 'Draft',
        className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    },
    sent: {
        label: 'Sent',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    paid: {
        label: 'Paid',
        className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    overdue: {
        label: 'Overdue',
        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge variant="outline" className={cn(config.className, className)}>
            {config.label}
        </Badge>
    );
}
