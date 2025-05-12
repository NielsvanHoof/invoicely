import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Client } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon, Users } from 'lucide-react';

interface ClientIndexProps {
    clients: Client[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: route('clients.index'),
    },
];

export default function ClientIndex({ clients }: ClientIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4" role="main">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Clients</h1>
                    <Button asChild>
                        <Link href={route('clients.create')}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Client
                        </Link>
                    </Button>
                </div>

                {clients.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No clients yet"
                        description="Get started by adding your first client. You can add their contact information, company details, and more."
                        primaryAction={{
                            label: 'Add Client',
                            href: route('clients.index'),
                            variant: 'primary',
                            ariaLabel: 'Add your first client',
                        }}
                    />
                ) : (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">
                                            {/* <Link href={route('clients.show', client.id)} className="hover:underline">
                                                {client.name}
                                            </Link> */}
                                        </TableCell>
                                        <TableCell>{client.company_name || '-'}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.phone || '-'}</TableCell>
                                        <TableCell>{client.address || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" asChild>
                                                {/* <Link href={route('clients.edit', client.id)}>Edit</Link> */}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
