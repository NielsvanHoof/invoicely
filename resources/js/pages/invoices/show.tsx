import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type Invoice } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeftIcon, BellIcon, DownloadIcon, FileEditIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface ShowInvoiceProps {
    invoice: Invoice;
}

export default function ShowInvoice({ invoice }: ShowInvoiceProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!invoice.file_path || isDownloading) return;

        setIsDownloading(true);
        try {
            const response = await axios.get(route('invoices.download', invoice.id));

            if (response.data.url) {
                // Open the temporary URL in a new tab
                window.open(response.data.url, '_blank');
            } else {
                throw new Error('No download URL returned');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to generate download link. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Invoices',
            href: route('invoices.index'),
        },
        {
            title: invoice.invoice_number,
            href: route('invoices.show', invoice.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link href={route('invoices.index')}>
                            <ArrowLeftIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Invoice {invoice.invoice_number}</h1>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
                    <Link
                        as="button"
                        href={route('invoices.edit', invoice.id)}
                        className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        <FileEditIcon className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                    <Link
                        href={route('invoices.destroy', invoice.id)}
                        method="delete"
                        as="button"
                        className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                    >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                    </Link>
                </div>

                <div className="mt-4 flex gap-2">
                    <Link href={route('invoices.index')}>
                        <Button variant="outline">
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            Back to Invoices
                        </Button>
                    </Link>

                    <Link href={route('reminders.index', invoice.id)}>
                        <Button variant="outline">
                            <BellIcon className="mr-2 h-4 w-4" />
                            Manage Reminders
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Status</h3>
                                    <div className="mt-1">
                                        <InvoiceStatusBadge status={invoice.status} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Amount</h3>
                                    <p className="mt-1 text-lg font-semibold">{formatCurrency(invoice.amount)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Issue Date</h3>
                                    <p className="mt-1">{formatDate(invoice.issue_date)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Due Date</h3>
                                    <p className="mt-1">{formatDate(invoice.due_date)}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Client Information</h3>
                                <div className="mt-1 space-y-1">
                                    <p className="font-medium">{invoice.client_name}</p>
                                    {invoice.client_email && <p className="break-words">{invoice.client_email}</p>}
                                    {invoice.client_address && <p className="text-sm whitespace-pre-line">{invoice.client_address}</p>}
                                </div>
                            </div>

                            {invoice.notes && (
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Notes</h3>
                                    <p className="mt-1 whitespace-pre-line">{invoice.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Attachment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {invoice.file_path ? (
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex h-32 w-full items-center justify-center rounded-lg border bg-neutral-50 dark:bg-neutral-900">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg
                                                className="h-12 w-12 text-neutral-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <p className="mt-2 text-sm text-neutral-500">Document available for download</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center text-neutral-500">
                                    <p>No attachment</p>
                                </div>
                            )}
                        </CardContent>
                        {invoice.file_path && (
                            <CardFooter>
                                <Button onClick={handleDownload} className="flex w-full items-center justify-center" disabled={isDownloading}>
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    {isDownloading ? 'Generating link...' : 'Download'}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>

                <div className="mt-2 flex flex-col gap-2 md:hidden">
                    {invoice.file_path && (
                        <Button onClick={handleDownload} className="flex w-full items-center justify-center" disabled={isDownloading}>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            {isDownloading ? 'Generating link...' : 'Download Attachment'}
                        </Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
