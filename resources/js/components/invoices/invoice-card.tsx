import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SharedData } from '@/types';
import { Invoice } from '@/types/models';
import { Link, usePage } from '@inertiajs/react';
import { BellIcon, EyeIcon, FileEditIcon, PaperclipIcon, TrashIcon } from 'lucide-react';

interface InvoiceCardProps {
    invoice: Invoice;
    isSelected?: boolean;
    onSelectInvoice?: (invoice: Invoice, isSelected: boolean) => void;
}

export function InvoiceCard({ invoice, isSelected = false, onSelectInvoice }: InvoiceCardProps) {
    const { auth } = usePage<SharedData>().props;
    const userCurrency = auth?.user?.currency || 'USD';
    const hasReminders = invoice.reminders_count !== undefined && invoice.reminders_count > 0;
    const hasAttachment = invoice.file_path !== undefined;

    const handleSelectInvoice = (checked: boolean) => {
        if (onSelectInvoice) {
            onSelectInvoice(invoice, checked);
        }
    };

    return (
        <Card className={`overflow-hidden transition-colors ${isSelected ? 'bg-muted/50' : ''}`} aria-selected={isSelected}>
            <CardContent className="p-0">
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {onSelectInvoice && (
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={handleSelectInvoice}
                                    aria-label={`Select invoice ${invoice.invoice_number}`}
                                    className="mr-1"
                                />
                            )}
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href={route('invoices.show', invoice.id)}
                                    className="focus:ring-primary rounded font-medium hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                >
                                    {invoice.invoice_number}
                                </Link>
                                <div className="flex items-center gap-1" aria-hidden="true">
                                    {hasAttachment && <PaperclipIcon className="h-3.5 w-3.5 text-neutral-400" aria-label="Has attachment" />}
                                    {invoice.reminders_count !== undefined && (
                                        <div
                                            className="flex items-center"
                                            title={
                                                hasReminders
                                                    ? `${invoice.reminders_count} reminder${invoice.reminders_count !== 1 ? 's' : ''}`
                                                    : 'No reminders'
                                            }
                                        >
                                            <BellIcon
                                                className={`h-3.5 w-3.5 ${hasReminders ? 'text-amber-500' : 'text-neutral-300'}`}
                                                aria-label={hasReminders ? `${invoice.reminders_count} reminders` : 'No reminders'}
                                            />
                                            {hasReminders && (
                                                <span className="ml-0.5 text-xs font-medium text-amber-600">{invoice.reminders_count}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
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
                    <Button variant="outline" size="sm" asChild aria-label={`View invoice ${invoice.invoice_number}`}>
                        <Link href={route('invoices.show', invoice.id)}>
                            <EyeIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild aria-label={`Edit invoice ${invoice.invoice_number}`}>
                        <Link href={route('invoices.edit', invoice.id)}>
                            <FileEditIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild aria-label={`Manage reminders for invoice ${invoice.invoice_number}`}>
                        <Link href={route('reminders.index', invoice.id)}>
                            <BellIcon className={`h-4 w-4 ${hasReminders ? 'text-amber-500' : ''}`} aria-hidden="true" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild aria-label={`Delete invoice ${invoice.invoice_number}`}>
                        <Link href={route('invoices.destroy', invoice.id)} method="delete" className="text-destructive">
                            <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
