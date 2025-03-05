<?php

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('team owner can see team page with permissions', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    $response = $this->actingAs($user)->get(route('teams.index'));

    $response->assertStatus(200);
    $response->assertSee($team->name);
});

test('team member can see team page with limited permissions', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create(['team_id' => $team->id]);

    $response = $this->actingAs($user)->get(route('teams.index'));

    $response->assertStatus(200);
    $response->assertSee($team->name);
});

test('user can create a team', function () {
    $user = User::factory()->create(['team_id' => null]);
    $teamName = fake()->company();

    $response = $this->actingAs($user)->post(route('teams.store'), [
        'name' => $teamName,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('teams', [
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

    $response = $this->actingAs($owner)->post(route('teams.store'), [
        'name' => fake()->company(),
    ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('teams', 1);
});

test('team owner can update team name', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $user->id]);
    $user->team()->associate($team);
    $user->save();

    $newName = fake()->company();

    $response = $this->actingAs($user)->put(route('teams.update', $team), [
        'name' => $newName,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('teams', [
        'id' => $team->id,
        'name' => $newName,
    ]);
});

test('non-owner cannot update team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create(['team_id' => $team->id]);

    $response = $this->actingAs($user)->put(route('teams.update', $team), [
        'name' => fake()->company(),
    ]);

    $response->assertForbidden();
});

test('owner can remove user from team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $user = User::factory()->create(['team_id' => $team->id]);

    $response = $this->actingAs($owner)->delete(route('teams.remove-user'), [
        'user_id' => $user->id,
    ]);

    $response->assertRedirect();
    $user->refresh();
    expect($user->team_id)->toBeNull();
});

test('owner cannot remove self from team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    $response = $this->actingAs($owner)->delete(route('teams.remove-user'), [
        'user_id' => $owner->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['user_id']);
    expect($owner->team_id)->not->toBeNull();
});

test('non-owner cannot remove users from team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    $user1 = User::factory()->create(['team_id' => $team->id]);
    $user2 = User::factory()->create(['team_id' => $team->id]);

    $response = $this->actingAs($user1)->delete(route('teams.remove-user'), [
        'user_id' => $user2->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
    $user2->refresh();
    expect($user2->team_id)->not->toBeNull();
});

test('member can leave team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $user = User::factory()->create(['team_id' => $team->id]);

    $response = $this->actingAs($user)->post(route('teams.leave'));

    $response->assertRedirect(route('teams.index'));
    $response->assertSessionHas('success');
    $user->refresh();
    expect($user->team_id)->toBeNull();
});

test('owner cannot leave team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $response = $this->actingAs($owner)->post(route('teams.leave'));

    $response->assertRedirect(route('teams.index'));
    $response->assertSessionHas('error');
    $owner->refresh();
    expect($owner->team_id)->not->toBeNull();
});

test('owner can delete team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->team()->associate($team);
    $owner->save();

    $user = User::factory()->create(['team_id' => $team->id]);

    $response = $this->actingAs($owner)->delete(route('teams.destroy', $team));

    $response->assertRedirect(route('teams.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('teams', ['id' => $team->id]);

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

    $response = $this->actingAs($user)->delete(route('teams.destroy', $team));

    $response->assertForbidden();
    $this->assertDatabaseHas('teams', ['id' => $team->id]);
});

test('owner can invite user to team', function () {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['owner_id' => $owner->id]);
    $owner->update(['team_id' => $team->id]);

    $user = User::factory()->create();

    $response = $this->actingAs($owner)->post(route('teams.invite'), [
        'email' => $user->email,
        'name' => $user->name,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
});
