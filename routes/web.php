<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ReminderController;
use Illuminate\Support\Facades\Route;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

    Route::get('health', HealthCheckResultsController::class);

    Route::get('invoices/{invoice}/download', [InvoiceController::class, 'downloadFile'])->name('invoices.download');
    Route::post('invoices/bulk-action', [InvoiceController::class, 'bulkAction'])->name('invoices.bulk-action');
    Route::resource('invoices', InvoiceController::class);

    Route::post('invoices/{invoice}/reminders/schedule-defaults', [ReminderController::class, 'scheduleDefaults'])->name('invoices.reminders.schedule-defaults');
    Route::resource('invoices.reminders', ReminderController::class);

    Route::resource('invoices.documents', DocumentController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
