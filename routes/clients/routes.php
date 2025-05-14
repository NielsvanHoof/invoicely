<?php

use App\Http\Controllers\Clients\ClientCreateController;
use App\Http\Controllers\Clients\ClientIndexController;
use App\Http\Controllers\Clients\ClientStoreController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'clients',
    'as' => 'clients.',
], function () {
    Route::get('/', ClientIndexController::class)->name('index');

    Route::get('/create', ClientCreateController::class)->name('create');

    Route::post('/', ClientStoreController::class)->name('store');
});
