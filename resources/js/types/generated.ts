export type BulkInvoiceData = {
    action: string;
    invoice_ids: Array<number>;
};
export type CreateTeamData = {
    name: string;
};
export enum CurrencyType {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    JPY = 'JPY',
    CAD = 'CAD',
    AUD = 'AUD',
    CHF = 'CHF',
    CNY = 'CNY',
    INR = 'INR',
    BRL = 'BRL',
}
export enum DocumentType {
    CONTRACT = 'contract',
    INVOICE = 'invoice',
    RECEIPT = 'receipt',
    OTHER = 'other',
}
export enum InvoiceStatus {
    DRAFT = 'draft',
    SENT = 'sent',
    PAID = 'paid',
    OVERDUE = 'overdue',
}
export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
}
export enum ReminderType {
    UPCOMING = 'upcoming',
    OVERDUE = 'overdue',
    THANK_YOU = 'thank_you',
}
export type RemoveTeamMemberData = {
    user_id: number;
};
export type StoreClientData = {
    name: string;
    email: string;
    company_name: string;
    phone: string;
    address: string;
};
export type StoreDocumentData = {
    name: string;
    category: DocumentType;
    file: any;
};
export type StoreInvoiceData = {
    invoice_number: string;
    client_name: string;
    client_email: string;
    client_address: string | null;
    amount: number;
    issue_date: string;
    due_date: string;
    status: InvoiceStatus;
    notes: string | null;
    file: any | null;
};
export type StoreReminderData = {
    type: ReminderType;
    scheduled_date: string;
    message: any | string | null;
};
export type TeamInvitationData = {
    email: string;
    name: string;
};
export type TeamMemberRemovalData = {
    user_id: number;
};
export type UpdateInvoiceData = {
    invoice_number: any | string | null;
    client_name: any | string | null;
    client_email: any | string | null;
    client_address: any | string | null;
    amount: any | number | null;
    issue_date: any | string | null;
    due_date: any | string | null;
    status: InvoiceStatus | any | null;
    notes: any | string | null;
    file: any | any | null;
    remove_file: any | boolean | null;
};
export type UpdateReminderData = {
    scheduled_date: string;
    message: any | string | null;
};
export type UpdateTeamData = {
    name: string;
};
