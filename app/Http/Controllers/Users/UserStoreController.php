<?php

namespace App\Http\Controllers\Users;

use App\Data\Users\StoreUserData;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UserStoreController extends Controller
{
    public function __invoke(StoreUserData $request): RedirectResponse
    {
        $user = User::create($request->toArray());

        $user->assignRole('invoicer');

        return redirect()->route('users.index')->with('success', 'User created successfully');
    }
}
