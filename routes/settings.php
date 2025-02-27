<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TeamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('/settings/teams', [TeamController::class, 'index'])->name('teams.index');
    Route::post('/settings/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::put('/settings/teams/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::post('/settings/teams/invite', [TeamController::class, 'invite'])->name('teams.invite');
    Route::delete('/settings/teams/users/{user}', [TeamController::class, 'removeUser'])->name('teams.remove-user');
    Route::post('/settings/teams/leave', [TeamController::class, 'leave'])->name('teams.leave');
    Route::delete('/settings/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
