<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\UpdateTeamAction;
use App\Data\Team\UpdateTeamData;
use App\Http\Controllers\Controller;
use App\Models\Team;
use Auth;
use Illuminate\Http\RedirectResponse;
use Log;

class TeamUpdateController extends Controller
{
    public function __invoke(UpdateTeamData $data, Team $team, UpdateTeamAction $updateTeamAction): RedirectResponse
    {
        $this->authorize('update', $team);

        try {
            $updateTeamAction->execute($team, $data);

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
