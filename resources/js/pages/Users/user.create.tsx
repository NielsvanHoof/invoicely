import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CurrencyType, StoreUserData } from '@/types/generated';
import { Team } from '@/types/models';
import { Head, Link, router, useForm } from '@inertiajs/react';
import clsx from 'clsx';
import { ArrowLeft, CurrencyIcon, Mail, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index'),
    },
    {
        title: 'Create User',
        href: route('users.create'),
    },
];

interface UserCreateProps {
    teams: Team[];
}

export default function UserCreate({ teams }: UserCreateProps) {
    const form = useForm<StoreUserData>({
        name: '',
        email: '',
        currency: CurrencyType.USD,
        team_id: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('users.store'), {
            onSuccess: () => {
                router.visit(route('users.index'));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6" role="main">
                <header className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8" aria-label="Go back to users">
                        <Link href={route('users.index')}>
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create User</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Add a new user to your system</p>
                    </div>
                </header>

                <Card className="shadow-sm">
                    <CardHeader className="border-b pb-6">
                        <CardTitle className="text-xl">User Information</CardTitle>
                        <CardDescription>Enter the details of your new user. Fields marked with * are required.</CardDescription>
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
                                    <Label htmlFor="currency" className="flex items-center gap-2">
                                        <CurrencyIcon className="text-muted-foreground h-4 w-4" />
                                        Currency *
                                    </Label>
                                    <Select value={form.data.currency} onValueChange={(value: CurrencyType) => form.setData('currency', value)}>
                                        <SelectTrigger
                                            id="currency"
                                            className={clsx('transition-all duration-200 focus:ring-2', form.errors.currency && 'border-red-500')}
                                        >
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(CurrencyType).map((currency) => (
                                                <SelectItem key={currency} value={currency}>
                                                    {currency}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.errors.currency && (
                                        <p id="currency-error" className="text-destructive text-sm" role="alert">
                                            {form.errors.currency}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="team_id" className="flex items-center gap-2">
                                        <User className="text-muted-foreground h-4 w-4" />
                                        Team
                                    </Label>
                                    <Select
                                        value={form.data.team_id?.toString() || ''}
                                        onValueChange={(value) => form.setData('team_id', value ? parseInt(value) : null)}
                                    >
                                        <SelectTrigger
                                            id="team_id"
                                            className={clsx('transition-all duration-200 focus:ring-2', form.errors.team_id && 'border-red-500')}
                                        >
                                            <SelectValue placeholder="Select a team (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teams.map((team) => (
                                                <SelectItem key={team.id} value={team.id.toString()}>
                                                    {team.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.errors.team_id && (
                                        <p id="team_id-error" className="text-destructive text-sm" role="alert">
                                            {form.errors.team_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-4 border-t pt-6">
                            <Button type="button" variant="outline" asChild className="hover:bg-muted transition-all duration-200">
                                <Link href={route('users.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing} className="transition-all duration-200 hover:shadow-md">
                                {form.processing ? 'Creating...' : 'Create User'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
