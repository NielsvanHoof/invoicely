import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { UpdateClientData } from '@/types/generated';
import { Client } from '@/types/models';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail, MapPin, Phone, User } from 'lucide-react';

// Define the props interface for the component
interface ClientEditProps {
    client: Client;
}

export default function ClientEdit({ client }: ClientEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clients',
            href: route('clients.index'),
        },
        {
            title: 'Edit Client',
            href: route('clients.edit', client.id),
        },
    ];

    const form = useForm<UpdateClientData>({
        name: client.name ?? '',
        email: client.email ?? '',
        phone: client.phone ?? '',
        address: client.address ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(route('clients.update', client.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Client" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6" role="main">
                <header className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8" aria-label="Go back to clients">
                        <Link href={route('clients.index')}>
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Client</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Update client information</p>
                    </div>
                </header>

                <Card className="shadow-sm">
                    <CardHeader className="border-b pb-6">
                        <CardTitle className="text-xl">Client Information</CardTitle>
                        <CardDescription>Update the details of your client. Fields marked with * are required.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="text-muted-foreground h-4 w-4" />
                                        Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="transition-all duration-200 focus:ring-2"
                                    />
                                    {form.errors.name && <p className="text-destructive text-sm">{form.errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="text-muted-foreground h-4 w-4" />
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        placeholder="john@example.com"
                                        required
                                        className="transition-all duration-200 focus:ring-2"
                                    />
                                    {form.errors.email && <p className="text-destructive text-sm">{form.errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="text-muted-foreground h-4 w-4" />
                                        Phone *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={form.data.phone ?? ''}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="transition-all duration-200 focus:ring-2"
                                    />
                                    {form.errors.phone && <p className="text-destructive text-sm">{form.errors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="text-muted-foreground h-4 w-4" />
                                    Address *
                                </Label>
                                <Textarea
                                    id="address"
                                    value={form.data.address ?? ''}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    placeholder="123 Business St, City, State, ZIP"
                                    className="min-h-[100px] transition-all duration-200 focus:ring-2"
                                />
                                {form.errors.address && <p className="text-destructive text-sm">{form.errors.address}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-4 border-t pt-6">
                            <Button type="button" variant="outline" asChild className="hover:bg-muted transition-all duration-200">
                                <Link href={route('clients.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="transition-all duration-200 hover:shadow-md">
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
