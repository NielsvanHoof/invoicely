<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\RemoveUserFromTeamAction;
use App\Http\Controllers\Controller;
use Auth;
use Log;

class TeamLeaveController extends Controller
{
    public function __invoke(RemoveUserFromTeamAction $removeUserFromTeamAction)
    {
        try {
            $user = Auth::user()->load('team');
            $team = $user->team;

            if (! $team) {
                return redirect()->route('teams.index')->with('error', 'You are not a member of any team.');
            }

            $this->authorize('leave', $team);

            $removeUserFromTeamAction->execute($team, $user);

            return redirect()->route('teams.index')->with('success', 'You have left the team.');
        } catch (\Exception $e) {
            Log::error('Failed to leave team', [
                'team_id' => Auth::user()->team_id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('teams.index')->with('error', 'Failed to leave team: '.$e->getMessage());
        }
    }
}
