<?php

namespace App\Actions\Teams;

use App\Data\Team\TeamInvitationData;
use App\Mail\Teams\TeamInviteMail;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CreateAndInviteNewUserToTeamAction
{
    /**
     * Create a new user, add them to a team, and send them an invitation email.
     */
    public function execute(User $inviter, Team $team, TeamInvitationData $data): User
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
