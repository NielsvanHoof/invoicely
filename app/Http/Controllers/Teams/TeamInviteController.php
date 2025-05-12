<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\InviteUserToTeamAction;
use App\Data\Team\TeamInvitationData;
use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Illuminate\Http\RedirectResponse;

class TeamInviteController extends Controller
{
    public function __invoke(TeamInvitationData $data, InviteUserToTeamAction $inviteUserToTeamAction): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user()->load('team');
        $team = $user->team;

        $this->authorize('invite', $team);

        $invitedUser = $inviteUserToTeamAction->execute($user, $team, $data);

        if ($invitedUser->exists()) {
            return back()->with('success', 'User invited successfully.');
        }

        return back()->with('error', 'Failed to invite user.');
    }
}
