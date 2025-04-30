import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Team, User, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, Loader2, PlusIcon, TrashIcon, UserMinusIcon, UserPlusIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface TeamsProps {
    team: Team | null;
    teamMembers: User[];
    isTeamOwner: boolean;
    can: {
        leave: boolean;
        removeUser: boolean;
        delete: boolean;
        invite: boolean;
        update: boolean;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team settings',
        href: route('teams.index'),
    },
];

export default function Teams({ team, teamMembers, isTeamOwner, can }: TeamsProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [userToRemove, setUserToRemove] = useState<number | null>(null);
    const [userToRemoveName, setUserToRemoveName] = useState<string>('');

    const {
        data: teamData,
        setData: setTeamData,
        put: updateTeam,
        processing: updatingTeam,
        errors: teamErrors,
        reset: resetTeamForm,
        clearErrors: clearTeamErrors,
    } = useForm({
        name: team?.name || '',
    });

    const {
        data: createTeamData,
        setData: setCreateTeamData,
        post: createTeam,
        processing: creatingTeam,
        errors: createTeamErrors,
        reset: resetCreateTeamForm,
        clearErrors: clearCreateTeamErrors,
    } = useForm({
        name: '',
    });

    const {
        data: inviteData,
        setData: setInviteData,
        post: sendInvite,
        processing: inviting,
        errors: inviteErrors,
        reset: resetInviteForm,
        clearErrors: clearInviteErrors,
    } = useForm({
        name: '',
        email: '',
    });

    const submitTeamUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        clearTeamErrors();

        if (!team) return;
        if (!teamData.name.trim()) {
            setTeamData('name', '');
            return;
        }

        setIsSubmitting(true);
        updateTeam(route('teams.update', { team: team.id }), {
            onSuccess: () => {
                setShowEditDialog(false);
                resetTeamForm();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const submitCreateTeam: FormEventHandler = (e) => {
        e.preventDefault();
        clearCreateTeamErrors();

        if (!createTeamData.name.trim()) {
            setCreateTeamData('name', '');
            return;
        }

        setIsSubmitting(true);
        createTeam(route('teams.store'), {
            onSuccess: () => {
                setShowCreateDialog(false);
                resetCreateTeamForm();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const submitInvite: FormEventHandler = (e) => {
        e.preventDefault();
        clearInviteErrors();

        if (!inviteData.email.trim() || !inviteData.name.trim()) {
            if (!inviteData.email.trim()) setInviteData('email', '');
            if (!inviteData.name.trim()) setInviteData('name', '');
            return;
        }

        setIsSubmitting(true);
        sendInvite(route('teams.members.invite', { team: team?.id }), {
            onSuccess: () => {
                setShowInviteDialog(false);
                resetInviteForm();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleLeaveTeam = () => {
        if (isTeamOwner) return;
        setShowLeaveDialog(true);
    };

    const confirmLeaveTeam = () => {
        if (!team) return;
        
        setIsSubmitting(true);
        router.post(route('teams.members.leave', { team: team.id }), {}, {
            onSuccess: () => {
                setShowLeaveDialog(false);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
                setShowLeaveDialog(false);
            },
        });
    };

    const handleRemoveUser = (userId: number, userName: string) => {
        if (!can.removeUser) return;

        setUserToRemove(userId);
        setUserToRemoveName(userName);
        setShowRemoveUserDialog(true);
    };

    const confirmRemoveUser = () => {
        if (!userToRemove || !team) return;

        setIsSubmitting(true);
        router.delete(route('teams.members.remove', { team: team.id, user: userToRemove }), {
            onSuccess: () => {
                setShowRemoveUserDialog(false);
                setUserToRemove(null);
                setUserToRemoveName('');
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleDeleteTeam = () => {
        if (!team || !isTeamOwner) return;
        setShowDeleteDialog(true);
    };

    const confirmDeleteTeam = () => {
        if (!team || !can.delete) return;

        setIsSubmitting(true);
        router.delete(route('teams.destroy', { team: team.id }), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    {team === null ? (
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
                                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>Team Information</CardTitle>
                                        <CardDescription>Manage your team settings and invite new members.</CardDescription>
                                    </div>
                                    {can.delete && (
                                        <Button variant="destructive" onClick={handleDeleteTeam} className="w-full sm:w-auto">
                                            <TrashIcon className="mr-2 h-4 w-4" />
                                            Delete Team
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium">Team Name</h3>
                                                <p className="text-muted-foreground text-sm">{team?.name}</p>
                                            </div>
                                            {can.update && (
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
                                    {can.invite && (
                                        <Button onClick={() => setShowInviteDialog(true)} className="w-full sm:w-auto">
                                            <UserPlusIcon className="mr-2 h-4 w-4" />
                                            Invite User
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {teamMembers.length === 0 ? (
                                        <Alert className="bg-muted/50">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>No team members</AlertTitle>
                                            <AlertDescription>
                                                Your team doesn't have any members yet. Invite someone to get started.
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <>
                                            {/* Desktop view - Table */}
                                            <div className="hidden md:block">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Name</TableHead>
                                                            <TableHead>Email</TableHead>
                                                            <TableHead>Role</TableHead>
                                                            {can.removeUser && <TableHead className="text-right">Actions</TableHead>}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {teamMembers.map((member) => (
                                                            <TableRow key={member.id}>
                                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                                <TableCell>{member.email}</TableCell>
                                                                <TableCell>
                                                                    <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                                                                        {member.id === team?.owner_id ? 'Owner' : 'Member'}
                                                                    </span>
                                                                </TableCell>
                                                                {can.removeUser && (
                                                                    <TableCell className="text-right">
                                                                        {member.id !== team?.owner_id && (
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={() => handleRemoveUser(member.id, member.name)}
                                                                                            className="hover:text-destructive"
                                                                                        >
                                                                                            <UserMinusIcon className="h-4 w-4" />
                                                                                            <span className="sr-only">Remove</span>
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>
                                                                                        <p>Remove from team</p>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>
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
                                                            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                                                                {member.id === team?.owner_id ? 'Owner' : 'Member'}
                                                            </span>
                                                        </div>
                                                        <p className="text-muted-foreground text-sm">{member.email}</p>

                                                        {can.removeUser && member.id !== team?.owner_id && (
                                                            <div className="mt-2 flex justify-end">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveUser(member.id, member.name)}
                                                                    className="hover:text-destructive hover:border-destructive"
                                                                >
                                                                    <UserMinusIcon className="mr-2 h-4 w-4" />
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                                {can.leave && (
                                    <CardFooter>
                                        <Button variant="destructive" onClick={handleLeaveTeam} className="w-full sm:w-auto">
                                            Leave Team
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </>
                    )}

                    {/* Create Team Dialog */}
                    <Dialog
                        open={showCreateDialog}
                        onOpenChange={(open) => {
                            setShowCreateDialog(open);
                            if (!open) {
                                resetCreateTeamForm();
                                clearCreateTeamErrors();
                            }
                        }}
                    >
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
                                            disabled={creatingTeam || isSubmitting}
                                            className={createTeamErrors.name ? 'border-destructive' : ''}
                                        />
                                        {createTeamErrors.name && <p className="text-destructive text-sm">{createTeamErrors.name}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateDialog(false)}
                                        className="w-full sm:w-auto"
                                        disabled={creatingTeam || isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={creatingTeam || isSubmitting} className="w-full sm:w-auto">
                                        {(creatingTeam || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Team
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Team Dialog */}
                    <Dialog
                        open={showEditDialog}
                        onOpenChange={(open) => {
                            setShowEditDialog(open);
                            if (!open) {
                                resetTeamForm();
                                clearTeamErrors();
                            } else {
                                setTeamData('name', team?.name || '');
                            }
                        }}
                    >
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
                                            disabled={updatingTeam || isSubmitting}
                                            className={teamErrors.name ? 'border-destructive' : ''}
                                        />
                                        {teamErrors.name && <p className="text-destructive text-sm">{teamErrors.name}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowEditDialog(false)}
                                        className="w-full sm:w-auto"
                                        disabled={updatingTeam || isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={updatingTeam || isSubmitting} className="w-full sm:w-auto">
                                        {(updatingTeam || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Invite User Dialog */}
                    <Dialog
                        open={showInviteDialog}
                        onOpenChange={(open) => {
                            setShowInviteDialog(open);
                            if (!open) {
                                resetInviteForm();
                                clearInviteErrors();
                            }
                        }}
                    >
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
                                            disabled={inviting || isSubmitting}
                                            className={inviteErrors.name ? 'border-destructive' : ''}
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
                                            disabled={inviting || isSubmitting}
                                            className={inviteErrors.email ? 'border-destructive' : ''}
                                        />
                                        {inviteErrors.email && <p className="text-destructive text-sm">{inviteErrors.email}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowInviteDialog(false)}
                                        className="w-full sm:w-auto"
                                        disabled={inviting || isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={inviting || isSubmitting} className="w-full sm:w-auto">
                                        {(inviting || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Invitation
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Remove User Dialog */}
                    <Dialog
                        open={showRemoveUserDialog}
                        onOpenChange={(open) => {
                            setShowRemoveUserDialog(open);
                            if (!open) {
                                setUserToRemove(null);
                                setUserToRemoveName('');
                            }
                        }}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Remove Team Member</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to remove <span className="font-medium">{userToRemoveName}</span> from your team?
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
                                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Warning</AlertTitle>
                                    <AlertDescription>
                                        This action will remove the user from your team. They will no longer have access to your team's data.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowRemoveUserDialog(false);
                                        setUserToRemove(null);
                                        setUserToRemoveName('');
                                    }}
                                    className="w-full sm:w-auto"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={confirmRemoveUser} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Remove User
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Leave Team Dialog */}
                    <Dialog
                        open={showLeaveDialog}
                        onOpenChange={(open) => {
                            setShowLeaveDialog(open);
                        }}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Leave Team</DialogTitle>
                                <DialogDescription>Are you sure you want to leave this team?</DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
                                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Warning</AlertTitle>
                                    <AlertDescription>
                                        You will lose access to all team resources and will need to be invited back to rejoin.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowLeaveDialog(false)}
                                    className="w-full sm:w-auto"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={confirmLeaveTeam} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Leave Team
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Team Dialog */}
                    <Dialog
                        open={showDeleteDialog}
                        onOpenChange={(open) => {
                            setShowDeleteDialog(open);
                        }}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Delete Team</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this team? This action cannot be undone and will remove all team members.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Warning: This action is permanent!</AlertTitle>
                                    <AlertDescription>Deleting your team will remove all team members and any associated data.</AlertDescription>
                                </Alert>
                            </div>

                            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowDeleteDialog(false)}
                                    className="w-full sm:w-auto"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={confirmDeleteTeam} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete Team
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
