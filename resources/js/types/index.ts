import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    currency: string;
    created_at: string;
    updated_at: string;
}

export interface Invoice {
    id: number;
    user_id: number;
    invoice_number: string;
    client_name: string;
    client_email: string | null;
    client_address: string | null;
    amount: number;
    issue_date: string;
    due_date: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    notes: string | null;
    file_path: string | null;
    created_at: string;
    updated_at: string;
    reminders_count?: number;
    documents_count?: number;
    reminders?: Reminder[];
    documents?: Document[];
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface Team {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    owner_id: number;
}

export interface Reminder {
    id: number;
    invoice_id: string;
    type: 'upcoming' | 'overdue' | 'thank_you';
    scheduled_date: string;
    sent_at: string | null;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: number;
    invoice_id: number;
    name: string;
    url: string;
    type: string;
    mime_type: string;
    size: number;
    category: 'contract' | 'invoice' | 'receipt' | 'other';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
