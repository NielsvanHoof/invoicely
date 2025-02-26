import { InvoiceForm, type InvoiceFormData } from '@/components/invoices';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

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
        title: 'Create',
        href: route('invoices.create'),
    },
];

export default function CreateInvoice() {
    const { data, setData, post, processing, errors } = useForm({
        invoice_number: '',
        client_name: '',
        client_email: '',
        client_address: '',
        amount: '',
        issue_date: new Date().toISOString().split('T')[0], // Today's date
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: 'draft',
        notes: '',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/invoices');
    };

    const handleDataChange = (key: keyof InvoiceFormData, value: string | File | null) => {
        setData(key, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invoice" />
            <InvoiceForm
                data={data as InvoiceFormData}
                errors={errors}
                processing={processing}
                onDataChange={handleDataChange}
                onSubmit={handleSubmit}
            />
        </AppLayout>
    );
}
