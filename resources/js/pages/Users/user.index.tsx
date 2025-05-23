import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { User } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { Mail, PlusIcon, UserIcon } from 'lucide-react';

interface UserIndexProps {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index'),
    },
];

export default function UserIndex({ users }: UserIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6" role="main">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Users</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage system users and their permissions</p>
                    </div>
                    <Button asChild className="shadow-sm transition-all duration-200 hover:shadow-md">
                        <Link href={route('users.create')}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                {users.length === 0 ? (
                    <EmptyState
                        icon={UserIcon}
                        title="No users yet"
                        description="Get started by adding your first user to the system. You can manage their roles and permissions."
                        primaryAction={{
                            label: 'Add User',
                            href: route('users.create'),
                            variant: 'primary',
                            ariaLabel: 'Add your first user',
                        }}
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {users.map((user) => (
                            <Card key={user.id} className="p-4 transition-all duration-200 hover:shadow-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">{user.name}</h3>
                                        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                                            <Mail className="h-4 w-4" />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {user.email_verified_at ? (
                                            <Badge variant="default" className="ml-2">
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="ml-2">
                                                Unverified
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="ml-2">
                                            {user.currency}
                                        </Badge>
                                    </div>
                                </div>

                                {/* <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('users.show', user.id)}>View</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('users.edit', user.id)}>Edit</Link>
                                    </Button>
                                </div> */}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
