<?php

use App\Http\Controllers\Documents\DocumentDestroyController;
use App\Http\Controllers\Documents\DocumentDownloadController;
use App\Http\Controllers\Documents\DocumentIndexController;
use App\Http\Controllers\Documents\DocumentStoreController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'invoices/{invoice}/documents',
    'as' => 'documents.',
], function () {
    // GET /invoices/{invoice}/documents - List all documents for an invoice
    Route::get('/', DocumentIndexController::class)->name('index');

    // POST /invoices/{invoice}/documents - Store a new document for an invoice
    Route::post('/', DocumentStoreController::class)->name('store');

    // DELETE /invoices/{invoice}/documents/{document} - Delete a specific document
    Route::delete('/{document}', DocumentDestroyController::class)->name('destroy');

    // GET /invoices/{invoice}/documents/{document}/download - Download a specific document
    Route::get('/{document}/download', DocumentDownloadController::class)->name('download');
});
