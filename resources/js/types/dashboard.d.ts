import { Invoice } from '@/types';

export interface ActivityItem {
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

export interface DashboardProps {
    stats: {
        totalInvoices: number;
        totalPaid: number;
        totalOverdue: number;
        totalPending: number;
        totalOutstanding: number;
        overdueCount: number;
        upcomingCount: number;
        averageDaysOverdue: number;
    };
    latestInvoices: Invoice[];
    upcomingInvoices: Invoice[];
    recentActivity: ActivityItem[];
}
