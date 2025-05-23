<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use Inertia\Inertia;

class UserCreateController extends Controller
{
    public function __invoke()
    {
        $this->authorize('create', User::class);

        $teams = Team::query()->get();

        return Inertia::render('Users/user.create', [
            'teams' => $teams,
        ]);
    }
}
