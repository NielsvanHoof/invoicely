<?php

namespace App\Services\Team;

use App\Data\Team\TeamInvitationData;
use App\Mail\Teams\TeamInviteMail;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class TeamInvitationService
{
    /**
     * Invite a user to join a team.
     */
    public function inviteUser(User $inviter, Team $team, TeamInvitationData $data): User
    {
        // Check if user already exists
        $invitedUser = User::where('email', $data->email)->first();

        if ($invitedUser) {
            return $this->addExistingUserToTeam($inviter, $invitedUser, $team);
        } else {
            return $this->createAndAddNewUserToTeam($inviter, $team, $data);
        }
    }

    /**
     * Add an existing user to a team.
     */
    protected function addExistingUserToTeam(User $inviter, User $invitedUser, Team $team): User
    {
        // Add user to the team
        $invitedUser->team()->associate($team);
        $invitedUser->save();

        // Send email without password
        Mail::to($invitedUser->email)->send(new TeamInviteMail($inviter, $invitedUser, $team, null));

        return $invitedUser;
    }

    /**
     * Create a new user and add them to a team.
     */
    protected function createAndAddNewUserToTeam(User $inviter, Team $team, TeamInvitationData $data): User
    {
        // Create a new user with a random password
        $password = Str::random(12);

        $createdUser = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($password),
        ]);

        $createdUser->team()->associate($team);
        $createdUser->save();

        // Send email with password
        Mail::to($data->email)->send(new TeamInviteMail($inviter, $createdUser, $team, $password));

        return $createdUser;
    }
}
