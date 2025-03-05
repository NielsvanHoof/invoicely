import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SharedData, type Invoice } from '@/types';
import { Link } from '@inertiajs/react';
import { BellIcon, EyeIcon, FileEditIcon, PaperclipIcon, TrashIcon } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface InvoiceCardProps {
    invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth?.user?.currency || 'USD';
    
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline">
                                {invoice.invoice_number}
                            </Link>
                            <div className="flex items-center gap-1">
                                {invoice.file_path && <PaperclipIcon className="h-3.5 w-3.5 text-neutral-400" />}
                                {invoice.reminders_count !== undefined && (
                                    <div
                                        className="flex items-center"
                                        title={
                                            invoice.reminders_count > 0
                                                ? `${invoice.reminders_count} reminder${invoice.reminders_count !== 1 ? 's' : ''}`
                                                : 'No reminders'
                                        }
                                    >
                                        <BellIcon className={`h-3.5 w-3.5 ${invoice.reminders_count > 0 ? 'text-amber-500' : 'text-neutral-300'}`} />
                                        {invoice.reminders_count > 0 && (
                                            <span className="ml-0.5 text-xs font-medium text-amber-600">{invoice.reminders_count}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <InvoiceStatusBadge status={invoice.status} />
                    </div>

                    <div className="text-muted-foreground text-sm">{invoice.client_name}</div>

                    <div className="mt-1 flex items-center justify-between">
                        <div className="font-medium">{formatCurrency(invoice.amount, userCurrency)}</div>
                        <div className="text-muted-foreground text-xs">Due: {formatDate(invoice.due_date)}</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-end border-t p-2">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('invoices.show', invoice.id)}>
                            <EyeIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('invoices.edit', invoice.id)}>
                            <FileEditIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('reminders.index', invoice.id)}>
                            <BellIcon className={`h-4 w-4 ${invoice.reminders_count && invoice.reminders_count > 0 ? 'text-amber-500' : ''}`} />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('invoices.destroy', invoice.id)} method="delete" className="text-destructive">
                            <TrashIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
