<?php

namespace App\Actions\Teams;

use App\Data\Team\TeamData;
use App\Models\Team;

class UpdateTeamAction
{
    public function execute(Team $team, TeamData $data): Team
    {
        $team->update([
            'name' => $data->name,
        ]);

        return $team;
    }
}
