<?php

use App\Http\Controllers\Analytics\AnalyticsIndexController;
use Illuminate\Support\Facades\Route;

Route::get('/analytics', AnalyticsIndexController::class)->name('analytics.index');
