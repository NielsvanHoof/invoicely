<?php

namespace App\Http\Controllers\Invoices;

use App\Actions\Invoices\StoreInvoiceAction;
use App\Data\Invoices\StoreInvoiceData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class InvoiceStoreController extends Controller
{
    public function __invoke(StoreInvoiceData $data, StoreInvoiceAction $action): RedirectResponse
    {
        $this->authorize('create', Invoice::class);

        $user = Auth::user();

        $invoice = $action->execute($data, $data->file, $user->id, $user->team_id);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice created successfully.');
    }
}
