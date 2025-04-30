<?php

use App\Http\Controllers\Teams\TeamDestroyController;
use App\Http\Controllers\Teams\TeamIndexController;
use App\Http\Controllers\Teams\TeamInviteController;
use App\Http\Controllers\Teams\TeamLeaveController;
use App\Http\Controllers\Teams\TeamRemoveUserController;
use App\Http\Controllers\Teams\TeamStoreController;
use App\Http\Controllers\Teams\TeamUpdateController;

Route::group([
    'prefix' => 'teams',
    'as' => 'teams.',
], function () {
    // GET /teams - List all teams
    Route::get('/', TeamIndexController::class)->name('index');

    // POST /teams - Create a new team
    Route::post('/', TeamStoreController::class)->name('store');

    // PUT /teams/{team} - Update a specific team
    Route::put('/{team}', TeamUpdateController::class)->name('update');

    // DELETE /teams/{team} - Delete a specific team
    Route::delete('/{team}', TeamDestroyController::class)->name('destroy');

    // Team Member Management Routes
    Route::group([
        'prefix' => '{team}/members',
        'as' => 'members.',
    ], function () {
        // POST /teams/{team}/members/invite - Invite a user to the team
        Route::post('/invite', TeamInviteController::class)->name('invite');

        // DELETE /teams/{team}/members/{user} - Remove a user from the team
        Route::delete('/{user}', TeamRemoveUserController::class)->name('remove');

        // POST /teams/{team}/members/leave - Leave the team
        Route::post('/leave', TeamLeaveController::class)->name('leave');
    });
});
