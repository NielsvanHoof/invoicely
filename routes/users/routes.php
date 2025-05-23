<?php

use App\Http\Controllers\Users\UserCreateController;
use App\Http\Controllers\Users\UserIndexController;
use App\Http\Controllers\Users\UserStoreController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'users',
    'as' => 'users.',
], function () {
    // GET /users - List all users
    Route::get('/', UserIndexController::class)->name('index');

    // GET /users/create - Show the create user form
    Route::get('/create', UserCreateController::class)->name('create');

    // POST /users - Store a new user
    Route::post('/', UserStoreController::class)->name('store');
});
