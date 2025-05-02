<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\RemoveUserFromTeamAction;
use App\Data\Team\RemoveTeamMemberData;
use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Illuminate\Http\RedirectResponse;

class TeamRemoveUserController extends Controller
{
    public function __invoke(RemoveTeamMemberData $data, RemoveUserFromTeamAction $removeUserFromTeamAction): RedirectResponse
    {
        $user = Auth::user()->load('team');

        if (! $user->team) {
            return redirect()->route('teams.index')->with('error', 'User is not a member of any team.');
        }

        $this->authorize('removeUser', $user->team);

        $userToRemove = User::findOrFail($data->user_id);

        $result = $removeUserFromTeamAction->execute($user->team, $userToRemove);

        if ($result) {
            return redirect()->route('teams.index')->with('success', 'User removed from team.');
        }

        return redirect()->route('teams.index')->with('error', 'Failed to remove user.');
    }
}
