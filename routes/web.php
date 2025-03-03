<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('health', HealthCheckResultsController::class);

    Route::get('invoices/{invoice}/download', [InvoiceController::class, 'downloadFile'])->name('invoices.download');
    Route::resource('invoices', InvoiceController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
