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
    // GET /clients - List all clients
    Route::get('/', ClientIndexController::class)->name('index');

    // GET /clients/create - Show the create client form
    Route::get('/create', ClientCreateController::class)->name('create');

    // POST /clients - Store a new client
    Route::post('/', ClientStoreController::class)->name('store');

    // GET /clients/{client} - Show a specific client
    Route::get('/{client}', ClientEditController::class)->name('edit');

    // PUT /clients/{client} - Update a specific client
    Route::put('/{client}', ClientUpdateController::class)->name('update');
});
