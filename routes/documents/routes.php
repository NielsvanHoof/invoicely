<?php

use App\Http\Controllers\Documents\DocumentDestroyController;
use App\Http\Controllers\Documents\DocumentDownloadController;
use App\Http\Controllers\Documents\DocumentIndexController;
use App\Http\Controllers\Documents\DocumentStoreController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'documents',
    'as' => 'documents.',
], function () {
    Route::get('/{invoice}', DocumentIndexController::class)->name('index');
    Route::post('/{invoice}', DocumentStoreController::class)->name('store');
    Route::delete('/{document}', DocumentDestroyController::class)->name('destroy');
    Route::get('/{document}/download', DocumentDownloadController::class)->name('download');
});
