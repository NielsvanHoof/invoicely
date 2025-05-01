<?php

namespace Tests\Feature\Controllers\Teams;

use App\Models\Team;
use App\Models\User;

use function Pest\Laravel\actingAs;

test('it can invite user to team', function () {
    // Arrange
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);

    $nonMember = User::factory()->create();
    $user->team()->associate($team);
    $user->save();

    $inviteData = [
        'email' => $nonMember->email,
        'name' => $nonMember->name,
    ];

    // Act
    $response = actingAs($user)
        ->post(route('teams.members.invite', $team), $inviteData);

    // Assert
    $response->assertRedirect();
    $response->assertSessionHas('success', 'User invited successfully.');
});

test('it validates required fields', function () {
    // Arrange
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    // Act
    $response = actingAs($user)
        ->post(route('teams.members.invite', $team), []);

    // Assert
    $response->assertSessionHasErrors(['email', 'name']);
});

test('it prevents unauthorized invites', function () {
    // Arrange
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $nonMember = User::factory()->create();
    $member->team()->associate($team);
    $member->save();

    $inviteData = [
        'email' => $nonMember->email,
        'name' => $nonMember->name,
    ];

    // Act
    $response = actingAs($member)
        ->post(route('teams.members.invite', $team), $inviteData);

    // Assert
    $response->assertForbidden();
});
