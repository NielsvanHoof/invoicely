<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\DeleteTeamAction;
use App\Http\Controllers\Controller;
use App\Models\Team;
use Auth;
use Illuminate\Http\RedirectResponse;
use Log;

class TeamDestroyController extends Controller
{
    public function __invoke(Team $team, DeleteTeamAction $action): RedirectResponse
    {
        $this->authorize('delete', $team);

        try {
            $action->execute($team);

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
