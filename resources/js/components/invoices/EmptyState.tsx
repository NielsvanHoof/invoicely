import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, ClipboardCheckIcon, FileTextIcon, PlusIcon, SearchXIcon, UsersIcon } from 'lucide-react';

interface EmptyStateProps {
    isSearchResult?: boolean;
    searchTerm?: string;
}

export function EmptyState({ isSearchResult = false, searchTerm = '' }: EmptyStateProps) {
    if (isSearchResult) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center py-12">
                <div className="bg-muted rounded-full p-6">
                    <SearchXIcon className="text-muted-foreground h-12 w-12" />
                </div>
                <h2 className="mt-6 text-center text-xl font-semibold">No results found</h2>
                <p className="text-muted-foreground mt-2 max-w-md text-center">
                    {searchTerm
                        ? `We couldn't find any invoices matching "${searchTerm}"`
                        : "We couldn't find any invoices matching your search criteria"}
                </p>
                <div className="mt-6">
                    <Button asChild variant="outline">
                        <Link href={route('invoices.index')}>Clear search</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="bg-primary/5 rounded-full p-6">
                <FileTextIcon className="text-primary h-12 w-12" />
            </div>
            <h2 className="mt-6 text-center text-2xl font-semibold">No invoices yet</h2>
            <p className="text-muted-foreground mt-2 max-w-md text-center">
                Create your first invoice to start tracking your business finances and get paid faster.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <PlusIcon className="text-primary mr-2 h-5 w-5" />
                            Create Invoice
                        </CardTitle>
                        <CardDescription>Generate a professional invoice for your clients</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href={route('invoices.create')}>
                                Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <ClipboardCheckIcon className="text-primary mr-2 h-5 w-5" />
                            Track Payments
                        </CardTitle>
                        <CardDescription>Monitor payment status and send reminders</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                            <Link href={route('invoices.create')}>Create First Invoice</Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <UsersIcon className="text-primary mr-2 h-5 w-5" />
                            Team Collaboration
                        </CardTitle>
                        <CardDescription>Invite team members to manage invoices together</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                            <Link href={route('teams.index')}>Manage Team</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
