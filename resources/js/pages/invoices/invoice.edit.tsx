import { InvoiceForm } from '@/components/invoices';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { UpdateInvoiceData } from '@/types/generated';
import { Client, Invoice } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';

interface EditInvoiceProps {
    invoice: Invoice;
    clients: Client[];
}

export default function EditInvoice({ invoice, clients }: EditInvoiceProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Invoices',
            href: route('invoices.index'),
        },
        {
            title: invoice.invoice_number,
            href: route('invoices.show', invoice.id),
        },
        {
            title: 'Edit',
            href: route('invoices.edit', invoice.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm<UpdateInvoiceData>({
        invoice_number: invoice.invoice_number,
        client_id: invoice.client_id,
        client_name: invoice.client_name,
        client_email: invoice.client_email || '',
        client_address: invoice.client_address || '',
        amount: invoice.amount.toString(),
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        status: invoice.status,
        notes: invoice.notes || '',
        file: null as File | null,
        remove_file: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('invoices.update', invoice.id));
    };

    const handleDataChange = (key: keyof UpdateInvoiceData, value: string | File | null) => {
        setData(key, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice ${invoice.invoice_number}`} />
            <InvoiceForm
                data={data}
                errors={errors}
                processing={processing}
                isEditing={true}
                onDataChange={handleDataChange}
                onSubmit={handleSubmit}
                clients={clients}
            />
        </AppLayout>
    );
}
