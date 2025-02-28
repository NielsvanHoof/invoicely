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
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function __construct(
        protected TeamService $teamService,
        protected TeamInvitationService $invitationService
    ) {
        $this->authorizeResource(Team::class, 'team');
    }

    /**
     * Display the team management page.
     */
    public function index(): Response
    {
        $user = Auth::user()->load('team');
        $team = $user->team;

        // Get all team members if user has a team
        $teamMembers = [];
        $isTeamOwner = false;

        if ($team) {
            // Eager load team with owner for better performance
            $team->load('owner');
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
    public function store(CreateTeamRequest $request): RedirectResponse
    {
        try {
            $user = Auth::user()->load('team');
            $teamData = TeamData::from($request);
            $this->teamService->createTeam($user, $teamData);

            return back()->with('success', 'Team created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create team', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the team name.
     */
    public function update(UpdateTeamRequest $request, Team $team): RedirectResponse
    {
        try {
            $teamData = TeamData::from($request);
            $this->teamService->updateTeam($team, $teamData);

            return back()->with('success', 'Team updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update team', [
                'team_id' => $team->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to update team: '.$e->getMessage());
        }
    }

    /**
     * Invite a user to the team.
     */
    public function invite(InviteTeamMemberRequest $request): RedirectResponse
    {
        try {
            $user = Auth::user()->load('team');
            $team = $user->team;

            // Use the policy to check if user can invite
            $this->authorize('invite', $team);

            $invitationData = TeamInvitationData::from($request);

            $this->invitationService->inviteUser($user, $team, $invitationData);

            return back()->with('success', 'User invited successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to invite user to team', [
                'team_id' => Auth::user()->team_id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to invite user: '.$e->getMessage());
        }
    }

    /**
     * Remove a user from the team.
     */
    public function removeUser(RemoveTeamMemberRequest $request): RedirectResponse
    {
        try {
            $user = Auth::user()->load('team');
            $team = $user->team;

            $this->authorize('removeUser', $team);

            $removalData = TeamMemberRemovalData::from($request);

            $userToRemove = User::findOrFail($removalData->user_id);

            // Owner cannot remove themselves
            if ($userToRemove->id === $team->owner_id) {
                return back()->with('error', 'Team owners cannot be removed from their own team.');
            }

            // Check if user is actually in this team
            if ($userToRemove->team_id !== $team->id) {
                return back()->with('error', 'This user is not a member of your team.');
            }

            $this->teamService->removeUserFromTeam($userToRemove);

            return back()->with('success', 'User removed from team.');
        } catch (\Exception $e) {
            Log::error('Failed to remove user from team', [
                'team_id' => Auth::user()->team_id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to remove user: '.$e->getMessage());
        }
    }

    /**
     * Leave the current team.
     */
    public function leave(): RedirectResponse
    {
        try {
            $user = Auth::user()->load('team');
            $team = $user->team;

            if (! $team) {
                return redirect()->route('teams.index')->with('error', 'You are not a member of any team.');
            }

            $this->authorize('leave', $team);

            // Team owners cannot leave their own team
            if ($user->isTeamOwner()) {
                return back()->with('error', 'Team owners cannot leave their own team. Transfer ownership first or delete the team.');
            }

            $this->teamService->removeUserFromTeam($user);

            return redirect()->route('teams.index')->with('success', 'You have left the team.');
        } catch (\Exception $e) {
            Log::error('Failed to leave team', [
                'team_id' => Auth::user()->team_id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to leave team: '.$e->getMessage());
        }
    }

    /**
     * Delete the team.
     */
    public function destroy(Team $team): RedirectResponse
    {
        try {
            $user = Auth::user()->load('team');

            // Only team owner can delete the team
            if ($user->id !== $team->owner_id) {
                return back()->with('error', 'Only team owners can delete teams.');
            }

            // Use the service to delete the team
            $this->teamService->deleteTeam($team);

            return redirect()->route('teams.index')->with('success', 'Team deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete team', [
                'team_id' => $team->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to delete team: '.$e->getMessage());
        }
    }
}
