<?php

namespace App\Actions\Teams;

use App\Models\Team;
use App\Models\User;
use Exception;

class RemoveUserFromTeamAction
{
    public function execute(Team $team, User $user): bool
    {
        // Don't allow removing a team owner from their own team
        if ($user->team && $user->isTeamOwner()) {
            throw new Exception('Team owners cannot be removed from their own team.');
        }

        $user->team()->dissociate();

        return $user->save();
    }
}
