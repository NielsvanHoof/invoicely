<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Auth;
use Inertia\Inertia;

class TeamIndexController extends Controller
{
    public function __invoke()
    {
        $this->authorize('viewAny', Team::class);

        $user = Auth::user()->load('team');
        $teamMembers = [];
        $isTeamOwner = false;
        $permissions = [
            'leave' => false,
            'removeUser' => false,
            'delete' => false,
            'invite' => false,
            'update' => false,
        ];

        if ($user->team) {
            $user->team->load('owner');
            $teamMembers = $user->team->users;
            $isTeamOwner = $user->id === $user->team->owner_id;

            // Only check permissions if the user has a team
            $permissions = [
                'leave' => $user->can('leave', $user->team),
                'removeUser' => $user->can('removeUser', $user->team),
                'delete' => $user->can('delete', $user->team),
                'invite' => $user->can('invite', $user->team),
                'update' => $user->can('update', $user->team),
            ];
        }

        return Inertia::render('settings/teams', [
            'team' => $user->team,
            'teamMembers' => $teamMembers,
            'isTeamOwner' => $isTeamOwner,
            'can' => $permissions,
        ]);
    }
}
