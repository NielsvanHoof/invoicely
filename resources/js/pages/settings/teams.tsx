import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { PlusIcon, UserMinusIcon, UserPlusIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Team {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    team_id: string | null;
}

interface TeamsProps {
    team: Team | null;
    teamMembers: User[];
    isTeamOwner: boolean;
    hasTeam: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team settings',
        href: route('teams.index'),
    },
];

export default function Teams({ team, teamMembers, isTeamOwner, hasTeam }: TeamsProps) {
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    // Team update form
    const {
        data: teamData,
        setData: setTeamData,
        put: updateTeam,
        processing: updatingTeam,
        errors: teamErrors,
        reset: resetTeamForm,
    } = useForm({
        name: team?.name || '',
    });

    // Team create form
    const {
        data: createTeamData,
        setData: setCreateTeamData,
        post: createTeam,
        processing: creatingTeam,
        errors: createTeamErrors,
        reset: resetCreateTeamForm,
    } = useForm({
        name: '',
    });

    // Invite form
    const {
        data: inviteData,
        setData: setInviteData,
        post: sendInvite,
        processing: inviting,
        errors: inviteErrors,
        reset: resetInviteForm,
    } = useForm({
        name: '',
        email: '',
    });

    // Leave team form
    const { post: leaveTeam, processing: leaving } = useForm();

    // Remove user form
    const { delete: removeUser, processing: removing } = useForm();

    const submitTeamUpdate: FormEventHandler = (e) => {
        e.preventDefault();

        updateTeam(route('teams.update'), {
            onSuccess: () => {
                setShowEditDialog(false);
                resetTeamForm();
            },
        });
    };

    const submitCreateTeam: FormEventHandler = (e) => {
        e.preventDefault();

        createTeam(route('teams.store'), {
            onSuccess: () => {
                setShowCreateDialog(false);
                resetCreateTeamForm();
            },
        });
    };

    const submitInvite: FormEventHandler = (e) => {
        e.preventDefault();

        sendInvite(route('teams.invite'), {
            onSuccess: () => {
                setShowInviteDialog(false);
                resetInviteForm();
            },
        });
    };

    const handleLeaveTeam = () => {
        if (confirm('Are you sure you want to leave this team?')) {
            leaveTeam(route('teams.leave'));
        }
    };

    const handleRemoveUser = (userId: string) => {
        if (confirm('Are you sure you want to remove this user from the team?')) {
            removeUser(route('teams.remove-user', userId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    {!hasTeam ? (
                        // No Team View
                        <Card>
                            <CardHeader>
                                <CardTitle>Create a Team</CardTitle>
                                <CardDescription>You don't have a team yet. Create one to collaborate with others.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <div className="text-center">
                                    <p className="text-muted-foreground mb-4">
                                        Teams allow you to collaborate with others on invoices and share client information.
                                    </p>
                                    <Button onClick={() => setShowCreateDialog(true)}>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Create Team
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Team Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Team Information</CardTitle>
                                    <CardDescription>Manage your team settings and invite new members.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium">Team Name</h3>
                                                <p className="text-muted-foreground text-sm">{team?.name}</p>
                                            </div>
                                            {isTeamOwner && (
                                                <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                                                    Edit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Team Members */}
                            <Card>
                                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>Team Members</CardTitle>
                                        <CardDescription>Manage your team members and their access.</CardDescription>
                                    </div>
                                    <Button onClick={() => setShowInviteDialog(true)} className="w-full sm:w-auto">
                                        <UserPlusIcon className="mr-2 h-4 w-4" />
                                        Invite User
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {/* Desktop view - Table */}
                                    <div className="hidden md:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    {isTeamOwner && <TableHead className="text-right">Actions</TableHead>}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {teamMembers.map((member) => (
                                                    <TableRow key={member.id}>
                                                        <TableCell className="font-medium">{member.name}</TableCell>
                                                        <TableCell>{member.email}</TableCell>
                                                        <TableCell>{member.id === teamMembers[0].id ? 'Owner' : 'Member'}</TableCell>
                                                        {isTeamOwner && (
                                                            <TableCell className="text-right">
                                                                {member.id !== teamMembers[0].id && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveUser(member.id)}
                                                                        disabled={removing}
                                                                    >
                                                                        <UserMinusIcon className="h-4 w-4" />
                                                                        <span className="sr-only">Remove</span>
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Mobile view - Cards */}
                                    <div className="space-y-4 md:hidden">
                                        {teamMembers.map((member) => (
                                            <div key={member.id} className="flex flex-col gap-2 rounded-lg border p-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">{member.name}</h3>
                                                    <span className="bg-muted rounded-full px-2 py-1 text-xs">
                                                        {member.id === teamMembers[0].id ? 'Owner' : 'Member'}
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground text-sm">{member.email}</p>

                                                {isTeamOwner && member.id !== teamMembers[0].id && (
                                                    <div className="mt-2 flex justify-end">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRemoveUser(member.id)}
                                                            disabled={removing}
                                                        >
                                                            <UserMinusIcon className="mr-2 h-4 w-4" />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                {!isTeamOwner && (
                                    <CardFooter>
                                        <Button variant="destructive" onClick={handleLeaveTeam} disabled={leaving} className="w-full sm:w-auto">
                                            Leave Team
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </>
                    )}

                    {/* Create Team Dialog */}
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Team</DialogTitle>
                                <DialogDescription>Create a new team to collaborate with others.</DialogDescription>
                            </DialogHeader>

                            <form onSubmit={submitCreateTeam}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-team-name">Team Name</Label>
                                        <Input
                                            id="create-team-name"
                                            value={createTeamData.name}
                                            onChange={(e) => setCreateTeamData('name', e.target.value)}
                                            placeholder="Enter team name"
                                        />
                                        {createTeamErrors.name && <p className="text-destructive text-sm">{createTeamErrors.name}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={creatingTeam} className="w-full sm:w-auto">
                                        Create Team
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Team Dialog */}
                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Team</DialogTitle>
                                <DialogDescription>Update your team information.</DialogDescription>
                            </DialogHeader>

                            <form onSubmit={submitTeamUpdate}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="team-name">Team Name</Label>
                                        <Input
                                            id="team-name"
                                            value={teamData.name}
                                            onChange={(e) => setTeamData('name', e.target.value)}
                                            placeholder="Enter team name"
                                        />
                                        {teamErrors.name && <p className="text-destructive text-sm">{teamErrors.name}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                    <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)} className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={updatingTeam} className="w-full sm:w-auto">
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Invite User Dialog */}
                    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Invite Team Member</DialogTitle>
                                <DialogDescription>Invite a new user to join your team.</DialogDescription>
                            </DialogHeader>

                            <form onSubmit={submitInvite}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={inviteData.name}
                                            onChange={(e) => setInviteData('name', e.target.value)}
                                            placeholder="Enter user's name"
                                        />
                                        {inviteErrors.name && <p className="text-destructive text-sm">{inviteErrors.name}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={inviteData.email}
                                            onChange={(e) => setInviteData('email', e.target.value)}
                                            placeholder="Enter user's email"
                                        />
                                        {inviteErrors.email && <p className="text-destructive text-sm">{inviteErrors.email}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                    <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)} className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={inviting} className="w-full sm:w-auto">
                                        Send Invitation
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
