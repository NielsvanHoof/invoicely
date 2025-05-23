<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserIndexController extends Controller
{
    public function __invoke(): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()->get();

        return Inertia::render('Users/user.index', [
            'users' => $users,
        ]);
    }
}
