import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type Invoice } from '@/types';
import { Link } from '@inertiajs/react';
import { EyeIcon, FileEditIcon, PaperclipIcon, TrashIcon } from 'lucide-react';

interface InvoiceCardProps {
    invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline">
                            {invoice.invoice_number}
                            {invoice.file_path && <PaperclipIcon className="ml-1 inline-block h-3 w-3 text-neutral-400" />}
                        </Link>
                        <InvoiceStatusBadge status={invoice.status} />
                    </div>

                    <div className="text-muted-foreground text-sm">{invoice.client_name}</div>

                    <div className="mt-1 flex items-center justify-between">
                        <div className="font-medium">{formatCurrency(invoice.amount)}</div>
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
                        <Link href={route('invoices.destroy', invoice.id)} method="delete" className="text-destructive">
                            <TrashIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
