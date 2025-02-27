<?php

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a team owner
    $this->owner = User::factory()->create();

    // Create a team
    $this->team = Team::factory()->create([
        'name' => 'Test Team',
    ]);

    // Associate owner with team
    $this->owner->team()->associate($this->team);
    $this->owner->save();

    // Create team members
    $this->member1 = User::factory()->create();
    $this->member1->team()->associate($this->team);
    $this->member1->save();

    $this->member2 = User::factory()->create();
    $this->member2->team()->associate($this->team);
    $this->member2->save();

    // Create a user without a team
    $this->userWithoutTeam = User::factory()->create();
});

test('team owner can view team settings page', function () {
    actingAs($this->owner)
        ->get(route('teams.index'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('settings/teams')
                ->has('team')
                ->has('teamMembers', 3) // Owner + 2 members
                ->where('isTeamOwner', true)
                ->where('hasTeam', true)
        );
});

test('team member can view team settings page', function () {
    actingAs($this->member1)
        ->get(route('teams.index'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('settings/teams')
                ->has('team')
                ->has('teamMembers', 3)
                ->where('isTeamOwner', false)
                ->where('hasTeam', true)
        );
});

test('user without team can view team settings page', function () {
    actingAs($this->userWithoutTeam)
        ->get(route('teams.index'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('settings/teams')
                ->where('team', null)
                ->where('teamMembers', [])
                ->where('isTeamOwner', false)
                ->where('hasTeam', false)
        );
});

test('user without team can create a team', function () {
    actingAs($this->userWithoutTeam)
        ->post(route('teams.store'), [
            'name' => 'New Team',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->userWithoutTeam->refresh();

    expect($this->userWithoutTeam->team)->not->toBeNull()
        ->and($this->userWithoutTeam->team->name)->toBe('New Team');
});

test('user with team cannot create another team', function () {
    actingAs($this->owner)
        ->post(route('teams.store'), [
            'name' => 'Another Team',
        ])
        ->assertRedirect()
        ->assertSessionHas('error');

    $this->owner->refresh();

    expect($this->owner->team->id)->toBe($this->team->id)
        ->and(Team::where('name', 'Another Team')->exists())->toBeFalse();
});

test('team owner can update team name', function () {
    actingAs($this->owner)
        ->put(route('teams.update', $this->team), [
            'name' => 'Updated Team Name',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->team->refresh();

    expect($this->team->name)->toBe('Updated Team Name');
});

test('team member cannot update team name', function () {
    actingAs($this->member1)
        ->put(route('teams.update', $this->team), [
            'name' => 'Updated Team Name',
        ])
        ->assertForbidden();

    $this->team->refresh();

    expect($this->team->name)->toBe('Test Team');
});

test('team owner can invite a new user', function () {
    actingAs($this->owner)
        ->post(route('teams.invite'), [
            'name' => 'New Member',
            'email' => 'newmember@example.com',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(User::where('email', 'newmember@example.com')->exists())->toBeTrue()
        ->and(User::where('email', 'newmember@example.com')->first()->team_id)->toBe($this->team->id);
});


test('user cannot invite themselves to the team', function () {
    actingAs($this->owner)
        ->post(route('teams.invite'), [
            'name' => $this->owner->name,
            'email' => $this->owner->email,
        ])
        ->assertRedirect()
        ->assertSessionHasErrors('email');
});

test('team owner can remove a team member', function () {
    actingAs($this->owner)
        ->delete(route('teams.remove-user', ['user' => $this->member1]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->member1->refresh();

    expect($this->member1->team_id)->toBeNull();
});

test('team member cannot remove another team member', function () {
    actingAs($this->member1)
        ->delete(route('teams.remove-user', ['user' => $this->member2]))
        ->assertForbidden();

    $this->member2->refresh();

    expect($this->member2->team_id)->toBe($this->team->id);
});

test('team owner cannot remove themselves', function () {
    actingAs($this->owner)
        ->delete(route('teams.remove-user', ['user' => $this->owner]))
        ->assertRedirect()
        ->assertSessionHasErrors('user_id');

    $this->owner->refresh();

    expect($this->owner->team_id)->toBe($this->team->id);
});

test('team member can leave the team', function () {
    actingAs($this->member1)
        ->post(route('teams.leave'))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->member1->refresh();

    expect($this->member1->team_id)->toBeNull();
});

test('team owner cannot leave the team', function () {
    actingAs($this->owner)
        ->post(route('teams.leave'))
        ->assertForbidden();

    $this->owner->refresh();

    expect($this->owner->team_id)->toBe($this->team->id);
});
