<?php

namespace App\Http\Controllers\Settings;

use App\Data\Team\TeamData;
use App\Data\Team\TeamInvitationData;
use App\Data\Team\TeamMemberRemovalData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Team\CreateTeamRequest;
use App\Http\Requests\Team\InviteTeamMemberRequest;
use App\Http\Requests\Team\RemoveTeamMemberRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Models\Team;
use App\Models\User;
use App\Services\Team\TeamInvitationService;
use App\Services\Team\TeamService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function resourceAbilityMap(): array
    {
        return [
            ...parent::resourceAbilityMap(),
            'leave' => 'leave',
            'removeUser' => 'removeUser',
        ];
    }

    public function __construct(
        protected TeamService $teamService,
        protected TeamInvitationService $invitationService
    ) {
        $this->authorizeResource(Team::class, 'team');
    }

    /**
     * Display the team management page.
     */
    public function index()
    {
        $user = Auth::user();
        $team = $user->team;

        // Get all team members if user has a team
        $teamMembers = [];
        $isTeamOwner = false;

        if ($team) {
            $teamMembers = $this->teamService->getTeamMembers($team);
            $isTeamOwner = $user->isTeamOwner();
        }

        return Inertia::render('settings/teams', [
            'team' => $team,
            'teamMembers' => $teamMembers,
            'isTeamOwner' => $isTeamOwner,
            'hasTeam' => ! is_null($team),
            'can' => [
                'leave' => $user->can('leave', $team),
                'removeUser' => $user->can('removeUser', $team),
                'delete' => $user->can('delete', $team),
                'invite' => $user->can('invite', $team),
                'update' => $user->can('update', $team),
            ],
        ]);
    }

    /**
     * Create a new team.
     */
    public function store(CreateTeamRequest $request)
    {
        try {
            $teamData = TeamData::from($request);
            $this->teamService->createTeam(Auth::user(), $teamData);

            return back()->with('success', 'Team created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the team name.
     */
    public function update(UpdateTeamRequest $request, Team $team)
    {
        $teamData = TeamData::from($request);
        $this->teamService->updateTeam($team, $teamData);

        return back()->with('success', 'Team updated successfully.');
    }

    /**
     * Invite a user to the team.
     */
    public function invite(InviteTeamMemberRequest $request)
    {
        $user = Auth::user();
        $team = $user->team;

        // Use the policy to check if user can invite
        $this->authorize('invite', $team);

        $invitationData = TeamInvitationData::from($request);

        $this->invitationService->inviteUser($user, $team, $invitationData);

        return back()->with('success', 'User invited successfully.');
    }

    /**
     * Remove a user from the team.
     */
    public function removeUser(RemoveTeamMemberRequest $request)
    {
        $user = Auth::user();
        $team = $user->team;

        // Only team owners can remove users
        if (! $user->isTeamOwner()) {
            return back()->with('error', 'Only team owners can remove users from the team.');
        }

        $removalData = TeamMemberRemovalData::from($request);
        $userToRemove = User::findOrFail($removalData->user_id);

        // Owner cannot remove themselves
        if ($userToRemove->id === $team->owner_id) {
            return back()->with('error', 'Team owners cannot be removed from their own team.');
        }

        $this->teamService->removeUserFromTeam($userToRemove);

        return back()->with('success', 'User removed from team.');
    }

    /**
     * Leave the current team.
     */
    public function leave()
    {
        $user = Auth::user();

        // Team owners cannot leave their own team
        if ($user->isTeamOwner()) {
            return back()->with('error', 'Team owners cannot leave their own team. Transfer ownership first or delete the team.');
        }

        $this->teamService->removeUserFromTeam($user);

        return redirect()->route('teams.index')->with('success', 'You have left the team.');
    }

    /**
     * Delete the team.
     */
    public function destroy(Team $team)
    {
        $user = Auth::user();

        // Only team owner can delete the team
        if ($user->id !== $team->owner_id) {
            return back()->with('error', 'Only team owners can delete teams.');
        }

        // Use the service to delete the team
        $this->teamService->deleteTeam($team);

        return redirect()->route('teams.index')->with('success', 'Team deleted successfully.');
    }
}
