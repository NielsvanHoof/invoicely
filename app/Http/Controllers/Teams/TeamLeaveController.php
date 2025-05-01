<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\RemoveUserFromTeamAction;
use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\RedirectResponse;

class TeamLeaveController extends Controller
{
    public function __invoke(RemoveUserFromTeamAction $removeUserFromTeamAction): RedirectResponse
    {
        $user = Auth::user()->loadExists('team');

        if (! $user->team) {
            return redirect()->route('teams.index')->with('error', 'You are not a member of any team.');
        }

        $team = $user->team;

        $this->authorize('leave', $team);

        $result = $removeUserFromTeamAction->execute($team, $user);

        if ($result) {
            return redirect()->route('teams.index')->with('success', 'You have left the team.');
        }

        return redirect()->route('teams.index')->with('error', 'Failed to leave team.');
    }
}
