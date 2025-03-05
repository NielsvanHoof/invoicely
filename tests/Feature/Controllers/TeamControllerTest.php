<?php

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

uses(RefreshDatabase::class);

test('team owner sees team page with owner permissions', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    actingAs($user)->get(route('teams.index'))->assertInertia(
        fn ($page) => $page
            ->component('settings/teams')
            ->where('team.id', $team->id)
            ->has('teamMembers')
            ->where('isTeamOwner', true)
            ->where('hasTeam', true)
            ->where('can.leave', false)
            ->where('can.removeUser', true)
            ->where('can.delete', true)
            ->where('can.invite', true)
            ->where('can.update', true)
    );
});

test('team member sees team page with limited permissions', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);

    $user = User::factory()->create(['team_id' => $team->id]);

    actingAs($user)->get(route('teams.index'))->assertInertia(
        fn ($page) => $page
            ->component('settings/teams')
            ->where('team.id', $team->id)
            ->has('teamMembers')
            ->where('isTeamOwner', false)
            ->where('hasTeam', true)
            ->where('can.leave', true)
            ->where('can.removeUser', false)
            ->where('can.delete', false)
            ->where('can.invite', false)
            ->where('can.update', false)
    );
});

test('user can create a team', function () {
    $user = User::factory()->create(['team_id' => null]);
    $teamName = fake()->company();

    actingAs($user)->post(route('teams.store'), [
        'name' => $teamName,
    ])->assertRedirect()
        ->assertSessionHas('success');

    assertDatabaseHas('teams', [
        'name' => $teamName,
        'owner_id' => $user->id,
    ]);

    $user->refresh();
    expect($user->team_id)->not->toBeNull();
});

test('user with team cannot create another team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    actingAs($owner)->post(route('teams.store'), [
        'name' => fake()->company(),
    ])->assertForbidden();

    assertDatabaseCount('teams', 1);
});

// Team Update Tests

test('team owner can update team name', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    $newName = fake()->company();

    actingAs($user)->put(route('teams.update', $team), [
        'name' => $newName,
    ])->assertRedirect()
        ->assertSessionHas('success');

    assertDatabaseHas('teams', [
        'id' => $team->id,
        'name' => $newName,
    ]);
});

test('non-owner cannot update team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);

    $user = User::factory()->create(['team_id' => $team->id]);

    actingAs($user)->put(route('teams.update', $team), [
        'name' => fake()->company(),
    ])->assertForbidden();
});

// Team Member Management Tests

test('owner can remove user from team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $user = User::factory()->create(['team_id' => $team->id]);

    actingAs($owner)->delete(route('teams.remove-user'), [
        'user_id' => $user->id,
    ])->assertRedirect()
        ->assertSessionHas('success');

    $user->refresh();
    expect($user->team_id)->toBeNull();
});

test('owner cannot remove self from team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    actingAs($owner)->delete(route('teams.remove-user'), [
        'user_id' => $owner->id,
    ])->assertRedirect()
        ->assertSessionHasErrors(['user_id']);

    expect($owner->team_id)->not->toBeNull();
});

test('non-owner cannot remove users from team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    $user1 = User::factory()->create(['team_id' => $team->id]);
    $user2 = User::factory()->create(['team_id' => $team->id]);

    actingAs($user1)->delete(route('teams.remove-user'), [
        'user_id' => $user2->id,
    ])->assertRedirect()
        ->assertSessionHas('error');

    $user2->refresh();
    expect($user2->team_id)->not->toBeNull();
});

test('member can leave team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $user = User::factory()->create(['team_id' => $team->id]);

    actingAs($user)->post(route('teams.leave'))->assertRedirect(route('teams.index'))
        ->assertSessionHas('success');

    $user->refresh();
    expect($user->team_id)->toBeNull();
});

test('owner cannot leave team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    actingAs($owner)->post(route('teams.leave'))->assertRedirect(route('teams.index'))
        ->assertSessionHas('error');

    $owner->refresh();
    expect($owner->team_id)->not->toBeNull();
});

test('owner can delete team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $user = User::factory()->create(['team_id' => $team->id]);

    actingAs($owner)->delete(route('teams.destroy', $team))->assertRedirect(route('teams.index'))
        ->assertSessionHas('success');

    assertDatabaseMissing('teams', ['id' => $team->id]);

    $owner->refresh();
    $user->refresh();

    expect($owner->team_id)->toBeNull();
    expect($user->team_id)->toBeNull();
});

test('non-owner cannot delete team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $user = User::factory()->create(['team_id' => $team->id]);

    actingAs($user)->delete(route('teams.destroy', $team))->assertForbidden();

    assertDatabaseHas('teams', ['id' => $team->id]);
});

test('owner can invite user to team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    $user = User::factory()->create();

    actingAs($owner)->post(route('teams.invite'), [
        'email' => $user->email,
        'name' => $user->name,
    ])->assertRedirect()
        ->assertSessionHas('success');
});

test('non-owner cannot invite users to team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    $user1 = User::factory()->create(['team_id' => $team->id]);
    $user2 = User::factory()->create();

    actingAs($user1)->post(route('teams.invite'), [
        'email' => $user2->email,
        'name' => $user2->name,
    ])->assertRedirect()
        ->assertSessionHas('error');
});
