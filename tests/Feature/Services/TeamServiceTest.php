<?php

use App\Data\Team\TeamData;
use App\Models\Team;
use App\Models\User;
use App\Services\Team\TeamService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->teamService = app(TeamService::class);

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
    $this->member = User::factory()->create();
    $this->member->team()->associate($this->team);
    $this->member->save();

    // Create a user without a team
    $this->userWithoutTeam = User::factory()->create();
});

test('createTeam creates a new team and associates it with the user', function () {
    $teamData = new TeamData(name: 'New Team');

    $team = $this->teamService->createTeam($this->userWithoutTeam, $teamData);

    expect($team)->toBeInstanceOf(Team::class)
        ->and($team->name)->toBe('New Team')
        ->and($this->userWithoutTeam->refresh()->team_id)->toBe($team->id);
});

test('updateTeam updates the team name', function () {
    $teamData = new TeamData(name: 'Updated Team Name');

    $updatedTeam = $this->teamService->updateTeam($this->team, $teamData);

    expect($updatedTeam->name)->toBe('Updated Team Name')
        ->and($this->team->refresh()->name)->toBe('Updated Team Name');
});

test('getTeamMembers returns all team members', function () {
    $members = $this->teamService->getTeamMembers($this->team);

    expect($members)->toHaveCount(2)
        ->and($members->pluck('id')->toArray())->toContain($this->owner->id, $this->member->id);
});

test('removeUserFromTeam removes a user from the team', function () {
    $this->teamService->removeUserFromTeam($this->member);

    expect($this->member->refresh()->team_id)->toBeNull();
});
