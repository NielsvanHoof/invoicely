<?php

namespace App\Http\Controllers\Invoices;

use App\Data\Invoices\FetchInvoicesData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Queries\Teams\FetchInvoicesQuery;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceIndexController extends Controller
{
    public function __invoke(FetchInvoicesData $data, FetchInvoicesQuery $fetchInvoicesQuery)
    {
        $this->authorize('viewAny', Invoice::class);

        $user = Auth::user();

        $invoices = $fetchInvoicesQuery->execute($user, $data)->paginate(10);

        return Inertia::render('invoices/index', [
            'invoices' => Inertia::merge($invoices),
            'search' => $data->search,
            'filters' => $data->except('search')->toArray(),
        ]);
    }
}
