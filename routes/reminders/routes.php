<?php

use App\Http\Controllers\Reminders\ReminderDestroyController;
use App\Http\Controllers\Reminders\ReminderIndexController;
use App\Http\Controllers\Reminders\ReminderScheduleDefaultsController;
use App\Http\Controllers\Reminders\ReminderStoreController;
use App\Http\Controllers\Reminders\ReminderUpdateController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'reminders',
    'as' => 'reminders.',
], function () {
    Route::get('/{invoice}', ReminderIndexController::class)->name('index');
    Route::post('/', ReminderStoreController::class)->name('store');
    Route::put('/{reminder}', ReminderUpdateController::class)->name('update');
    Route::delete('/{reminder}', ReminderDestroyController::class)->name('destroy');
    Route::post('invoices/{invoice}/reminders/schedule-defaults', ReminderScheduleDefaultsController::class)->name('schedule-defaults');
});
