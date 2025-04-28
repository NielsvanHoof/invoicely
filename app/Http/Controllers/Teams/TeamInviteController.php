<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\InviteUserToTeamAction;
use App\Data\Team\TeamInvitationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Team\InviteTeamMemberRequest;
use Auth;
use Log;

class TeamInviteController extends Controller
{
    public function __invoke(InviteTeamMemberRequest $request, InviteUserToTeamAction $inviteUserToTeamAction)
    {
        try {
            $user = Auth::user()->load('team');
            $team = $user->team;

            $this->authorize('invite', $team);

            $invitationData = TeamInvitationData::from($request);

            $inviteUserToTeamAction->execute($user, $team, $invitationData);

            return back()->with('success', 'User invited successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to invite user to team', [
                'team_id' => Auth::user()->team_id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to invite user: '.$e->getMessage());
        }
    }
}
