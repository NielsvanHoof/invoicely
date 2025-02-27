<?php

use App\Data\Team\TeamInvitationData;
use App\Mail\Teams\TeamInviteMail;
use App\Models\Team;
use App\Models\User;
use App\Services\Team\TeamInvitationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    Mail::fake();

    $this->invitationService = app(TeamInvitationService::class);

    // Create a team owner
    $this->owner = User::factory()->create();

    // Create a team
    $this->team = Team::factory()->create([
        'name' => 'Test Team',
    ]);

    // Associate owner with team
    $this->owner->team()->associate($this->team);
    $this->owner->save();
});

test('inviteUser creates a new user and adds them to the team', function () {
    $invitationData = new TeamInvitationData(
        email: 'newuser@example.com',
        name: 'New User'
    );

    $invitedUser = $this->invitationService->inviteUser($this->owner, $this->team, $invitationData);

    expect($invitedUser)->toBeInstanceOf(User::class)
        ->and($invitedUser->name)->toBe('New User')
        ->and($invitedUser->email)->toBe('newuser@example.com')
        ->and($invitedUser->team_id)->toBe($this->team->id);

    Mail::assertSent(TeamInviteMail::class, function ($mail) use ($invitedUser) {
        return $mail->hasTo($invitedUser->email);
    });
});

test('inviteUser adds an existing user to the team', function () {
    // Create an existing user without a team
    $existingUser = User::factory()->create([
        'email' => 'existing@example.com',
        'name' => 'Existing User',
    ]);

    $invitationData = new TeamInvitationData(
        email: 'existing@example.com',
        name: 'Different Name' // This should be ignored since user exists
    );

    $invitedUser = $this->invitationService->inviteUser($this->owner, $this->team, $invitationData);

    expect($invitedUser->id)->toBe($existingUser->id)
        ->and($invitedUser->name)->toBe('Existing User') // Name should not change
        ->and($invitedUser->team_id)->toBe($this->team->id);

    Mail::assertSent(TeamInviteMail::class, function ($mail) use ($existingUser) {
        return $mail->hasTo($existingUser->email);
    });
});

test('inviteUser sends email with password for new users', function () {
    $invitationData = new TeamInvitationData(
        email: 'newuser@example.com',
        name: 'New User'
    );

    $this->invitationService->inviteUser($this->owner, $this->team, $invitationData);

    Mail::assertSent(TeamInviteMail::class, function ($mail) {
        return $mail->hasTo('newuser@example.com') && $mail->password !== null;
    });
});

test('inviteUser sends email without password for existing users', function () {
    // Create an existing user without a team
    User::factory()->create([
        'email' => 'existing@example.com',
    ]);

    $invitationData = new TeamInvitationData(
        email: 'existing@example.com',
        name: 'Ignored Name'
    );

    $this->invitationService->inviteUser($this->owner, $this->team, $invitationData);

    Mail::assertSent(TeamInviteMail::class, function ($mail) {
        return $mail->hasTo('existing@example.com') && $mail->password === null;
    });
});
