import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Client } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { Building2, Mail, MapPin, Phone, PlusIcon, Users } from 'lucide-react';

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

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6" role="main">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Clients</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your client relationships and information</p>
                    </div>
                    <Button asChild className="shadow-sm transition-all duration-200 hover:shadow-md">
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
                            href: route('clients.create'),
                            variant: 'primary',
                            ariaLabel: 'Add your first client',
                        }}
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {clients.map((client) => (
                            <Card key={client.id} className="p-4 transition-all duration-200 hover:shadow-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">{client.name}</h3>
                                        {client.company_name && (
                                            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                                                <Building2 className="h-4 w-4" />
                                                <span>{client.company_name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                        Active
                                    </Badge>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {client.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="text-muted-foreground h-4 w-4" />
                                            <span>{client.email}</span>
                                        </div>
                                    )}
                                    {client.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="text-muted-foreground h-4 w-4" />
                                            <span>{client.phone}</span>
                                        </div>
                                    )}
                                    {client.address && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="text-muted-foreground h-4 w-4" />
                                            <span>{client.address}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        View
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('clients.edit', client.id)}>Edit</Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
