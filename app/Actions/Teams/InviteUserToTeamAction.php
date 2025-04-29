<?php

namespace App\Actions\Teams;

use App\Data\Team\TeamInvitationData;
use App\Models\Team;
use App\Models\User;

class InviteUserToTeamAction
{
    public function __construct(
        private InviteExistingUserToTeamAction $inviteExistingUserAction,
        private CreateAndInviteNewUserToTeamAction $createAndInviteNewUserAction
    ) {}

    /**
     * Invite a user to join a team, handling both existing and new users.
     */
    public function execute(User $inviter, Team $team, TeamInvitationData $data): User
    {
        // Check if a user already exists
        $invitedUser = User::where('email', $data->email)->first();

        if ($invitedUser) {
            return $this->inviteExistingUserAction->execute($inviter, $invitedUser, $team);
        }

        return $this->createAndInviteNewUserAction->execute($inviter, $team, $data);
    }
}
