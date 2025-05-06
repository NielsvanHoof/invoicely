<?php

use App\Models\Team;
use App\Models\User;
use App\Policies\TeamPolicy;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;

use function Pest\Laravel\actingAs;

test('it shows team page for user with team', function () {
    $this->partialMock(TeamPolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('viewAny')->andReturn(true);
    });

    // Arrange
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    // Act
    $response = actingAs($user)
        ->get(route('teams.index'));

    // Assert
    $response->assertInertia(fn (Assert $assert) => $assert
        ->component('settings/teams')
        ->has('team')
        ->has('teamMembers')
        ->where('isTeamOwner', true)
        ->has('can', 5)
    );
});

test('it shows team page for team member', function () {
    $this->partialMock(TeamPolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('viewAny')->andReturn(true);
    });

    // Arrange
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $member->team()->associate($team);
    $member->save();

    // Act
    $response = actingAs($member)
        ->get(route('teams.index'));

    // Assert
    $response->assertInertia(fn (Assert $assert) => $assert
        ->component('settings/teams')
        ->has('team')
        ->has('teamMembers')
        ->where('isTeamOwner', false)
        ->has('can', 5)
    );
});
