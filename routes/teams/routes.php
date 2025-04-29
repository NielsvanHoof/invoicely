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
    Route::get('/', TeamIndexController::class)->name('index');
    Route::post('/', TeamStoreController::class)->name('store');
    Route::put('/{team}', TeamUpdateController::class)->name('update');
    Route::post('/invite', TeamInviteController::class)->name('invite');
    Route::delete('/users', TeamRemoveUserController::class)->name('remove-user');
    Route::post('/leave', TeamLeaveController::class)->name('leave');
    Route::delete('/{team}', TeamDestroyController::class)->name('destroy');
});
