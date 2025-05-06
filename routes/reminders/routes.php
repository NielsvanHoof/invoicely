<?php

use App\Http\Controllers\Reminders\ReminderDestroyController;
use App\Http\Controllers\Reminders\ReminderIndexController;
use App\Http\Controllers\Reminders\ReminderScheduleDefaultsController;
use App\Http\Controllers\Reminders\ReminderStoreController;
use App\Http\Controllers\Reminders\ReminderUpdateController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'invoices/{invoice}/reminders',
    'as' => 'reminders.',
], function () {
    // GET /invoices/{invoice}/reminders - List all reminders for an invoice
    Route::get('/', ReminderIndexController::class)->name('index');

    // POST /invoices/{invoice}/reminders - Create a new reminder for an invoice
    Route::post('/', ReminderStoreController::class)->name('store');

    // PUT /invoices/{invoice}/reminders/{reminder} - Update a specific reminder
    Route::put('/{reminder}', ReminderUpdateController::class)->name('update');

    // DELETE /invoices/{invoice}/reminders/{reminder} - Delete a specific reminder
    Route::delete('/{reminder}', ReminderDestroyController::class)->name('destroy');

    // POST /invoices/{invoice}/reminders/schedule-defaults - Schedule default reminders
    Route::post('/schedule-defaults', ReminderScheduleDefaultsController::class)->name('schedule-defaults');
});
