<?php

use App\Http\Controllers\Settings\CurrencyController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Teams\TeamDestroyController;
use App\Http\Controllers\Teams\TeamIndexController;
use App\Http\Controllers\Teams\TeamInviteController;
use App\Http\Controllers\Teams\TeamLeaveController;
use App\Http\Controllers\Teams\TeamRemoveUserController;
use App\Http\Controllers\Teams\TeamStoreController;
use App\Http\Controllers\Teams\TeamUpdateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('/settings/teams', TeamIndexController::class)->name('teams.index');
    Route::post('/settings/teams', TeamStoreController::class)->name('teams.store');
    Route::put('/settings/teams/{team}', TeamUpdateController::class)->name('teams.update');
    Route::post('/settings/teams/invite', TeamInviteController::class)->name('teams.invite');
    Route::delete('/settings/teams/users', TeamRemoveUserController::class)->name('teams.remove-user');
    Route::post('/settings/teams/leave', TeamLeaveController::class)->name('teams.leave');
    Route::delete('/settings/teams/{team}', TeamDestroyController::class)->name('teams.destroy');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('settings/currency', [CurrencyController::class, 'index'])->name('settings.currency');
    Route::post('settings/currency', [CurrencyController::class, 'update'])->name('settings.currency.update');
});
