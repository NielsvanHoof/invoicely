<?php

use App\Http\Controllers\Invoices\InvoiceBulkActionController;
use App\Http\Controllers\Invoices\InvoiceCreateController;
use App\Http\Controllers\Invoices\InvoiceDestroyController;
use App\Http\Controllers\Invoices\InvoiceDownloadFileController;
use App\Http\Controllers\Invoices\InvoiceEditController;
use App\Http\Controllers\Invoices\InvoiceIndexController;
use App\Http\Controllers\Invoices\InvoiceStoreController;
use App\Http\Controllers\Invoices\InvoiceUpdateController;

Route::group([
    'prefix' => 'invoices',
    'as' => 'invoices.',
], function () {
    // GET /invoices - List all invoices
    Route::get('/', InvoiceIndexController::class)->name('index');

    // GET /invoices/create - Show invoice creation form
    Route::get('/create', InvoiceCreateController::class)->name('create');

    // POST /invoices - Store a new invoice
    Route::post('/', InvoiceStoreController::class)->name('store');

    // GET /invoices/{invoice}/edit - Show invoice edit form
    Route::get('/{invoice}/edit', InvoiceEditController::class)->name('edit');

    // PUT /invoices/{invoice} - Update a specific invoice
    Route::put('/{invoice}', InvoiceUpdateController::class)->name('update');

    // DELETE /invoices/{invoice} - Delete a specific invoice
    Route::delete('/{invoice}', InvoiceDestroyController::class)->name('destroy');

    // POST /invoices/bulk-action - Handle bulk actions on invoices
    Route::post('/bulk-action', InvoiceBulkActionController::class)->name('bulk-action');

    // GET /invoices/{invoice}/download - Download invoice file
    Route::get('/{invoice}/download', InvoiceDownloadFileController::class)->name('download');
});
