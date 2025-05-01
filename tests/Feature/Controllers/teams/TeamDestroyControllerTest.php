<?php

namespace Tests\Feature\Controllers\Teams;

use App\Actions\Teams\DeleteTeamAction;
use App\Models\Team;
use App\Models\User;
use App\Policies\TeamPolicy;
use Mockery\MockInterface;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

test('it can delete team', function () {
    $this->partialMock(TeamPolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('delete')->andReturn(true);
    });

    // Arrange
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    // Act
    $response = actingAs($user)
        ->delete(route('teams.destroy', $team));

    // Assert
    $response->assertRedirect(route('teams.index'));
    $response->assertSessionHas('success', 'Team deleted successfully.');

    $this->assertDatabaseMissing('teams', ['id' => $team->id]);
});

test('it handles errors gracefully', function () {
    $this->partialMock(TeamPolicy::class, function (MockInterface $mock) {
        $mock->shouldReceive('delete')->andReturn(true);
    });

    // Arrange
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    // Mock the DeleteTeamAction to throw an exception
    $this->mock(DeleteTeamAction::class)
        ->shouldReceive('execute')
        ->andThrow(new \Exception('Test error'));

    // Act
    $response = actingAs($user)
        ->delete(route('teams.destroy', $team));

    // Assert
    $response->assertRedirect();
    $response->assertSessionHas('error', 'Failed to delete team: Test error');

    assertDatabaseHas('teams', ['id' => $team->id]);
});

test('it prevents unauthorized deletion', function () {
    // Arrange
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $member->team()->associate($team);
    $member->save();

    // Act
    $response = actingAs($member)
        ->delete(route('teams.destroy', $team));

    // Assert
    $response->assertForbidden();

    assertDatabaseHas('teams', ['id' => $team->id]);
});
