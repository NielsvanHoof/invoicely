<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\StoreTeamAction;
use App\Data\Team\TeamData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Team\CreateTeamRequest;
use Auth;

class TeamStoreController extends Controller
{
    public function __invoke(CreateTeamRequest $request, StoreTeamAction $action)
    {
        $user = Auth::user()->load('team');
        $teamData = TeamData::from($request);
        $createdTeam = $action->execute($user, $teamData);

        if ($createdTeam) {
            return back()->with('success', 'Team created successfully.');
        }

        return back()->with('error', 'Failed to create team.');
    }
}
