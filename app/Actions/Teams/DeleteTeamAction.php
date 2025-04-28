<?php

namespace App\Actions\Teams;

use App\Models\Team;

class DeleteTeamAction
{
    public function execute(Team $team): bool
    {
        // Get all team members
        $teamMembers = $team->users;

        // First, remove the owner_id reference to avoid constraint issues
        $team->owner_id = null;
        $team->save();

        // Now remove all team members (including the former owner)
        foreach ($teamMembers as $member) {
            $member->team()->dissociate();
            $member->save();
        }

        // Delete the team
        return $team->delete();
    }
}
