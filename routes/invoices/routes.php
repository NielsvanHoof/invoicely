<?php

use App\Http\Controllers\Invoices\InvoiceBulkActionController;
use App\Http\Controllers\Invoices\InvoiceCreateController;
use App\Http\Controllers\Invoices\InvoiceDestroyController;
use App\Http\Controllers\Invoices\InvoiceDownloadFileController;
use App\Http\Controllers\Invoices\InvoiceEditController;
use App\Http\Controllers\Invoices\InvoiceIndexController;
use App\Http\Controllers\Invoices\InvoiceShowController;
use App\Http\Controllers\Invoices\InvoiceStoreController;
use App\Http\Controllers\Invoices\InvoiceUpdateController;

Route::group([
    'prefix' => 'invoices',
    'as' => 'invoices.',
], function () {
    Route::get('/', InvoiceIndexController::class)->name('index');
    Route::get('/create', InvoiceCreateController::class)->name('create');
    Route::post('/', InvoiceStoreController::class)->name('store');
    Route::get('/{invoice}', InvoiceShowController::class)->name('show');
    Route::get('/{invoice}/edit', InvoiceEditController::class)->name('edit');
    Route::put('/{invoice}', InvoiceUpdateController::class)->name('update');
    Route::delete('/{invoice}', InvoiceDestroyController::class)->name('destroy');
    Route::post('/bulk-action', InvoiceBulkActionController::class)->name('bulk-action');
    Route::get('/{invoice}/download', InvoiceDownloadFileController::class)->name('download');
});
