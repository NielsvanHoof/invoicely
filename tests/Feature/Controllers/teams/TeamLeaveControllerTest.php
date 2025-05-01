<?php

namespace Tests\Feature\Controllers\Teams;

use App\Models\Team;
use App\Models\User;

use function Pest\Laravel\actingAs;

test('it can leave team', function () {
    // Arrange
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);

    $member = User::factory()->create();

    $member->team()->associate($team);
    $member->save();

    $owner->team()->associate($team);
    $owner->save();

    // Act
    $response = actingAs($member)
        ->post(route('teams.members.leave', $team));

    // Assert
    $response->assertRedirect(route('teams.index'));
    $response->assertSessionHas('success', 'You have left the team.');

    expect($member->team)->toBeNull();
});

test('it prevents team owner from leaving', function () {
    // Arrange
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    // Act
    $response = actingAs($user)
        ->post(route('teams.members.leave', $team));

    // Assert
    $response->assertForbidden();
});
