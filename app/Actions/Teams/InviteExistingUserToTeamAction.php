<?php

namespace App\Actions\Teams;

use App\Mail\Teams\TeamInviteMail;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class InviteExistingUserToTeamAction
{
    /**
     * Add an existing user to a team and send them an invitation email.
     */
    public function execute(User $inviter, User $invitedUser, Team $team): User
    {
        // Add user to the team
        $invitedUser->team()->associate($team);
        $invitedUser->save();

        // Send email without password
        Mail::to($invitedUser->email)->send(new TeamInviteMail($inviter, $invitedUser, $team, null));

        return $invitedUser;
    }
}
