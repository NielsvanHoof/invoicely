<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('health', HealthCheckResultsController::class);

    require __DIR__.'/analytics/routes.php';
    require __DIR__.'/invoices/routes.php';
    require __DIR__.'/reminders/routes.php';
    require __DIR__.'/teams/routes.php';
    require __DIR__.'/documents/routes.php';
    require __DIR__.'/clients/routes.php';
    require __DIR__.'/users/routes.php';
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
