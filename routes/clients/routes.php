<?php

use App\Http\Controllers\Clients\ClientCreateController;
use App\Http\Controllers\Clients\ClientEditController;
use App\Http\Controllers\Clients\ClientIndexController;
use App\Http\Controllers\Clients\ClientStoreController;
use App\Http\Controllers\Clients\ClientUpdateController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'clients',
    'as' => 'clients.',
], function () {
    Route::get('/', ClientIndexController::class)->name('index');

    Route::get('/create', ClientCreateController::class)->name('create');

    Route::post('/', ClientStoreController::class)->name('store');

    Route::get('/{client}', ClientEditController::class)->name('edit');

    Route::put('/{client}', ClientUpdateController::class)->name('update');
});
