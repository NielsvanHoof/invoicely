<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ReminderController;
use Illuminate\Support\Facades\Route;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('health', HealthCheckResultsController::class);

    Route::get('invoices/{invoice}/download', [InvoiceController::class, 'downloadFile'])->name('invoices.download');
    Route::resource('invoices', InvoiceController::class);

    Route::get('invoices/{invoice}/reminders', [ReminderController::class, 'index'])->name('reminders.index');
    Route::post('invoices/{invoice}/reminders', [ReminderController::class, 'store'])->name('reminders.store');
    Route::put('invoices/{invoice}/reminders/{reminder}', [ReminderController::class, 'update'])->name('reminders.update');
    Route::delete('invoices/{invoice}/reminders/{reminder}', [ReminderController::class, 'destroy'])->name('reminders.destroy');
    Route::post('invoices/{invoice}/reminders/schedule-defaults', [ReminderController::class, 'scheduleDefaults'])->name('reminders.schedule-defaults');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
