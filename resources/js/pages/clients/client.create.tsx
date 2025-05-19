import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { StoreClientData } from '@/types/generated';
import { Head, Link, useForm } from '@inertiajs/react';
import clsx from 'clsx';
import { ArrowLeft, Building2, Mail, MapPin, Phone, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: route('clients.index'),
    },
    {
        title: 'Create Client',
        href: route('clients.create'),
    },
];

export default function ClientCreate() {
    const form = useForm<StoreClientData>({
        name: '',
        email: '',
        company_name: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('clients.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6" role="main">
                <header className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8" aria-label="Go back to clients">
                        <Link href={route('clients.index')}>
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create Client</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Add a new client to your system</p>
                    </div>
                </header>

                <Card className="shadow-sm">
                    <CardHeader className="border-b pb-6">
                        <CardTitle className="text-xl">Client Information</CardTitle>
                        <CardDescription>Enter the details of your new client. Fields marked with * are required.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit} noValidate>
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
                                        aria-required="true"
                                        aria-invalid={!!form.errors.name}
                                        aria-describedby={form.errors.name ? 'name-error' : undefined}
                                        className={clsx('transition-all duration-200 focus:ring-2', form.errors.name && 'border-red-500')}
                                    />
                                    {form.errors.name && (
                                        <p id="name-error" className="text-destructive text-sm" role="alert">
                                            {form.errors.name}
                                        </p>
                                    )}
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
                                        aria-required="true"
                                        aria-invalid={!!form.errors.email}
                                        aria-describedby={form.errors.email ? 'email-error' : undefined}
                                        className={clsx('transition-all duration-200 focus:ring-2', form.errors.email && 'border-red-500')}
                                    />
                                    {form.errors.email && (
                                        <p id="email-error" className="text-destructive text-sm" role="alert">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_name" className="flex items-center gap-2">
                                        <Building2 className="text-muted-foreground h-4 w-4" />
                                        Company Name *
                                    </Label>
                                    <Input
                                        id="company_name"
                                        value={form.data.company_name}
                                        onChange={(e) => form.setData('company_name', e.target.value)}
                                        placeholder="Acme Inc."
                                        required
                                        aria-required="true"
                                        aria-invalid={!!form.errors.company_name}
                                        aria-describedby={form.errors.company_name ? 'company_name-error' : undefined}
                                        className={clsx('transition-all duration-200 focus:ring-2', form.errors.company_name && 'border-red-500')}
                                    />
                                    {form.errors.company_name && (
                                        <p id="company_name-error" className="text-destructive text-sm" role="alert">
                                            {form.errors.company_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="text-muted-foreground h-4 w-4" />
                                        Phone *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        required
                                        maxLength={255}
                                        aria-required="true"
                                        aria-invalid={!!form.errors.phone}
                                        aria-describedby={form.errors.phone ? 'phone-error' : undefined}
                                        className={clsx('transition-all duration-200 focus:ring-2', form.errors.phone && 'border-red-500')}
                                    />
                                    {form.errors.phone && (
                                        <p id="phone-error" className="text-destructive text-sm" role="alert">
                                            {form.errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="text-muted-foreground h-4 w-4" />
                                    Address *
                                </Label>
                                <Textarea
                                    id="address"
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    placeholder="123 Business St, City, State, ZIP"
                                    required
                                    maxLength={255}
                                    aria-required="true"
                                    aria-invalid={!!form.errors.address}
                                    aria-describedby={form.errors.address ? 'address-error' : undefined}
                                    className={clsx(
                                        'min-h-[100px] transition-all duration-200 focus:ring-2',
                                        form.errors.address && 'border-red-500',
                                    )}
                                />
                                {form.errors.address && (
                                    <p id="address-error" className="text-destructive text-sm" role="alert">
                                        {form.errors.address}
                                    </p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-4 border-t pt-6">
                            <Button type="button" variant="outline" asChild className="hover:bg-muted transition-all duration-200">
                                <Link href={route('clients.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="transition-all duration-200 hover:shadow-md">
                                {form.processing ? 'Creating...' : 'Create Client'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
