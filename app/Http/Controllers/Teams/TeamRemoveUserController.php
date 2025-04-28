<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\RemoveUserFromTeamAction;
use App\Data\Team\TeamMemberRemovalData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Team\RemoveTeamMemberRequest;
use Auth;
use Log;
use User;

class TeamRemoveUserController extends Controller
{
    public function __invoke(RemoveTeamMemberRequest $request, RemoveUserFromTeamAction $removeUserFromTeamAction)
    {
        try {
            $user = Auth::user()->load('team');
            $team = $user->team;

            $this->authorize('removeUser', $team);

            $removalData = TeamMemberRemovalData::from($request);

            $userToRemove = User::findOrFail($removalData->user_id);

            $removeUserFromTeamAction->execute($team, $userToRemove);

            return back()->with('success', 'User removed from team.');
        } catch (\Exception $e) {
            Log::error('Failed to remove user from team', [
                'team_id' => Auth::user()->team_id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to remove user: '.$e->getMessage());
        }
    }
}
