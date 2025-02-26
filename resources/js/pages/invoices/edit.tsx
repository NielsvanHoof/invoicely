import { InvoiceForm, type InvoiceFormData } from '@/components/invoices';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Invoice } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface EditInvoiceProps {
    invoice: Invoice;
}

export default function EditInvoice({ invoice }: EditInvoiceProps) {
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
        {
            title: 'Edit',
            href: route('invoices.edit', invoice.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        invoice_number: invoice.invoice_number,
        client_name: invoice.client_name,
        client_email: invoice.client_email || '',
        client_address: invoice.client_address || '',
        amount: invoice.amount.toString(),
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        status: invoice.status,
        notes: invoice.notes || '',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('invoices.update', invoice.id));
    };

    const handleDataChange = (key: keyof InvoiceFormData, value: string | File | null) => {
        setData(key, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice ${invoice.invoice_number}`} />
            <InvoiceForm
                data={data as InvoiceFormData}
                errors={errors}
                processing={processing}
                isEditing={true}
                onDataChange={handleDataChange}
                onSubmit={handleSubmit}
            />
        </AppLayout>
    );
}
