<?php

namespace App\Services\Team;

use App\Data\Team\TeamData;
use App\Models\Team;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class TeamService
{
    /**
     * Create a new team and associate it with the user.
     */
    public function createTeam(User $user, TeamData $data): Team
    {
        // Check if user already has a team
        if ($user->team) {
            throw new Exception('User already has a team.');
        }

        // Create new team with the user as owner
        $team = Team::create([
            'name' => $data->name,
            'owner_id' => $user->id,
        ]);

        // Associate user with team
        $user->team()->associate($team);
        $user->save();

        return $team;
    }

    /**
     * Update a team's details.
     */
    public function updateTeam(Team $team, TeamData $data): Team
    {
        $team->update([
            'name' => $data->name,
        ]);

        return $team;
    }

    /**
     * Get team members.
     *
     * @return Collection<int, User>
     */
    public function getTeamMembers(Team $team): Collection
    {
        return User::where('team_id', $team->id)->get();
    }

    /**
     * Remove a user from a team.
     */
    public function removeUserFromTeam(User $userToRemove): void
    {
        // Don't allow removing a team owner from their own team
        if ($userToRemove->team && $userToRemove->isTeamOwner()) {
            throw new Exception('Team owners cannot be removed from their own team.');
        }

        $userToRemove->team()->dissociate();
        $userToRemove->save();
    }

    /**
     * Delete a team and remove all its members.
     */
    public function deleteTeam(Team $team): void
    {
        // Get all team members
        $teamMembers = $this->getTeamMembers($team);

        // Store team name for emails
        $teamName = $team->name;

        // First, remove the owner_id reference to avoid constraint issues
        $team->owner_id = null;
        $team->save();

        // Now remove all team members (including the former owner)
        foreach ($teamMembers as $member) {
            $member->team()->dissociate();
            $member->save();
        }

        // Delete the team
        $team->delete();
    }
}
