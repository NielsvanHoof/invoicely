<?php

namespace App\Actions\Teams;

use App\Data\Team\TeamData;
use App\Models\Team;
use App\Models\User;
use Exception;

class StoreTeamAction
{
    public function execute(User $user, TeamData $data): Team
    {
        if ($user->team) {
            throw new Exception('User already has a team.');
        }

        $team = Team::create([
            'name' => $data->name,
            'owner_id' => $user->id,
        ]);

        $user->team()->associate($team);
        $user->save();

        return $team;
    }
}
