<?php

namespace App\Actions\Teams;

use App\Data\Team\UpdateTeamData;
use App\Models\Team;

class UpdateTeamAction
{
    public function execute(Team $team, UpdateTeamData $data): Team
    {
        $team->update([
            'name' => $data->name,
        ]);

        return $team;
    }
}
