import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarIcon, CreditCardIcon, FileTextIcon, MailIcon, MapPinIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';

export interface InvoiceFormData {
    invoice_number: string;
    client_name: string;
    client_email: string;
    client_address: string;
    amount: string;
    issue_date: string;
    due_date: string;
    status: string;
    notes: string;
    file: File | null;
}

export interface InvoiceFormErrors {
    invoice_number?: string;
    client_name?: string;
    client_email?: string;
    client_address?: string;
    amount?: string;
    issue_date?: string;
    due_date?: string;
    status?: string;
    notes?: string;
    file?: string;
}

interface InvoiceFormProps {
    data: InvoiceFormData;
    errors: InvoiceFormErrors;
    processing: boolean;
    isEditing?: boolean;
    onDataChange: (key: keyof InvoiceFormData, value: string | File | null) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function InvoiceForm({ data, errors, processing, isEditing = false, onDataChange, onSubmit }: InvoiceFormProps) {
    const [previewAmount, setPreviewAmount] = useState<string>(data.amount || '0.00');
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth?.user?.currency || 'USD';

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onDataChange('amount', value);

        // Update preview amount
        if (value && !isNaN(parseFloat(value))) {
            setPreviewAmount(parseFloat(value).toFixed(2));
        } else {
            setPreviewAmount('0.00');
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 p-2 sm:p-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <Link href={route('invoices.index')}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{isEditing ? 'Edit Invoice' : 'Create Invoice'}</h1>
            </div>

            {/* Mobile Preview Card - Shown only on small screens */}
            <div className="lg:hidden">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Invoice Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">{data.invoice_number || 'INV-0001'}</h3>
                                <InvoiceStatusBadge status={data.status as 'draft' | 'sent' | 'paid' | 'overdue'} />
                            </div>
                            <div className="mt-2 text-xl font-bold">{formatCurrency(parseFloat(previewAmount), userCurrency)}</div>
                            <div className="mt-2 text-xs text-neutral-500">{data.client_name ? data.client_name : 'Client Name'}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={onSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Invoice Information</CardTitle>
                                <CardDescription>Enter the details for your {isEditing ? 'invoice' : 'new invoice'}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <FileTextIcon className="h-4 w-4 text-neutral-500" />
                                            <Label htmlFor="invoice_number">Invoice Number</Label>
                                        </div>
                                        <Input
                                            id="invoice_number"
                                            value={data.invoice_number}
                                            onChange={(e) => onDataChange('invoice_number', e.target.value)}
                                            placeholder="INV-0001"
                                            className={errors.invoice_number ? 'border-red-300' : ''}
                                        />
                                        {errors.invoice_number && <p className="text-sm text-red-600">{errors.invoice_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select defaultValue={data.status} onValueChange={(value) => onDataChange('status', value)}>
                                            <SelectTrigger className={errors.status ? 'border-red-300' : ''}>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="sent">Sent</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="overdue">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                                    </div>
                                </div>

                                <div className="border-sidebar-border/70 dark:border-sidebar-border border-t pt-6">
                                    <h3 className="mb-4 text-sm font-medium text-neutral-500">Client Information</h3>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4 text-neutral-500" />
                                                <Label htmlFor="client_name">Client Name</Label>
                                            </div>
                                            <Input
                                                id="client_name"
                                                value={data.client_name}
                                                onChange={(e) => onDataChange('client_name', e.target.value)}
                                                placeholder="Client Name"
                                                className={errors.client_name ? 'border-red-300' : ''}
                                            />
                                            {errors.client_name && <p className="text-sm text-red-600">{errors.client_name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <MailIcon className="h-4 w-4 text-neutral-500" />
                                                    <Label htmlFor="client_email">Client Email</Label>
                                                </div>
                                                <Input
                                                    id="client_email"
                                                    type="email"
                                                    value={data.client_email || ''}
                                                    onChange={(e) => onDataChange('client_email', e.target.value)}
                                                    placeholder="client@example.com"
                                                    className={errors.client_email ? 'border-red-300' : ''}
                                                />
                                                {errors.client_email && <p className="text-sm text-red-600">{errors.client_email}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <CreditCardIcon className="h-4 w-4 text-neutral-500" />
                                                    <Label htmlFor="amount">Amount</Label>
                                                </div>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.amount}
                                                    onChange={handleAmountChange}
                                                    placeholder="0.00"
                                                    className={errors.amount ? 'border-red-300' : ''}
                                                />
                                                {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon className="h-4 w-4 text-neutral-500" />
                                                <Label htmlFor="client_address">Client Address</Label>
                                            </div>
                                            <Textarea
                                                id="client_address"
                                                value={data.client_address || ''}
                                                onChange={(e) => onDataChange('client_address', e.target.value)}
                                                placeholder="Client Address"
                                                rows={3}
                                                className={errors.client_address ? 'border-red-300' : ''}
                                            />
                                            {errors.client_address && <p className="text-sm text-red-600">{errors.client_address}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-sidebar-border/70 dark:border-sidebar-border border-t pt-6">
                                    <h3 className="mb-4 text-sm font-medium text-neutral-500">Dates</h3>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-neutral-500" />
                                                <Label htmlFor="issue_date">Issue Date</Label>
                                            </div>
                                            <Input
                                                id="issue_date"
                                                type="date"
                                                value={data.issue_date}
                                                onChange={(e) => onDataChange('issue_date', e.target.value)}
                                                className={errors.issue_date ? 'border-red-300' : ''}
                                            />
                                            {errors.issue_date && <p className="text-sm text-red-600">{errors.issue_date}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-neutral-500" />
                                                <Label htmlFor="due_date">Due Date</Label>
                                            </div>
                                            <Input
                                                id="due_date"
                                                type="date"
                                                value={data.due_date}
                                                onChange={(e) => onDataChange('due_date', e.target.value)}
                                                className={errors.due_date ? 'border-red-300' : ''}
                                            />
                                            {errors.due_date && <p className="text-sm text-red-600">{errors.due_date}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-sidebar-border/70 dark:border-sidebar-border border-t pt-6">
                                    <h3 className="mb-4 text-sm font-medium text-neutral-500">Additional Information</h3>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes || ''}
                                                onChange={(e) => onDataChange('notes', e.target.value)}
                                                placeholder="Additional notes..."
                                                rows={3}
                                                className={errors.notes ? 'border-red-300' : ''}
                                            />
                                            {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Attachment</Label>
                                            <FileUpload
                                                onChange={(file) => onDataChange('file', file)}
                                                accept="application/pdf,image/*,.doc,.docx"
                                                maxSize={10}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col justify-end space-y-2 border-t pt-6 sm:flex-row sm:space-y-0 sm:space-x-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update Invoice' : 'Create Invoice'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                {/* Desktop Preview Panel */}
                <div className="hidden lg:block">
                    <div className="sticky top-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Invoice Preview</CardTitle>
                                <CardDescription>How your invoice will appear</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                                        <h3 className="font-medium">{data.invoice_number || 'INV-0001'}</h3>
                                        <div className="mt-2 text-2xl font-bold">{formatCurrency(parseFloat(previewAmount), userCurrency)}</div>

                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Status:</span>
                                                <InvoiceStatusBadge status={data.status as 'draft' | 'sent' | 'paid' | 'overdue'} />
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Issue Date:</span>
                                                <span>{formatDate(data.issue_date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Due Date:</span>
                                                <span>{formatDate(data.due_date)}</span>
                                            </div>
                                        </div>

                                        {data.client_name && (
                                            <div className="mt-4 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-700">
                                                <h4 className="font-medium">{data.client_name}</h4>
                                                {data.client_email && <p className="text-sm">{data.client_email}</p>}
                                            </div>
                                        )}

                                        {data.file && (
                                            <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                                                <svg
                                                    className="h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                    />
                                                </svg>
                                                <span>Attachment included</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center text-sm text-neutral-500">
                                        <p>This is a preview of your invoice.</p>
                                        <p>Fill out the form to see changes reflected here.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
