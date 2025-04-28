<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use Auth;
use Inertia\Inertia;

class TeamIndexController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user()->load('team');
        $team = $user->team;
        $teamMembers = [];
        $isTeamOwner = false;
        $permissions = [
            'leave' => false,
            'removeUser' => false,
            'delete' => false,
            'invite' => false,
            'update' => false,
        ];

        if ($team) {
            $team->load('owner');
            $teamMembers = $team->users;
            $isTeamOwner = $user->id === $team->owner_id;

            // Only check permissions if the user has a team
            $permissions = [
                'leave' => $user->can('leave', $team),
                'removeUser' => $user->can('removeUser', $team),
                'delete' => $user->can('delete', $team),
                'invite' => $user->can('invite', $team),
                'update' => $user->can('update', $team),
            ];
        }

        return Inertia::render('settings/teams', [
            'team' => $team,
            'teamMembers' => $teamMembers,
            'isTeamOwner' => $isTeamOwner,
            'can' => $permissions,
        ]);
    }
}
