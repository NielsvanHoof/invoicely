<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\UpdateTeamAction;
use App\Data\Team\TeamData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Models\Team;
use Auth;
use Log;

class TeamUpdateController extends Controller
{
    public function __invoke(UpdateTeamRequest $request, Team $team, UpdateTeamAction $updateTeamAction)
    {
        $this->authorize('update', $team);

        try {
            $teamData = TeamData::from($request);
            $updateTeamAction->execute($team, $teamData);

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
}
