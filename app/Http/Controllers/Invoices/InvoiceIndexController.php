<?php

namespace App\Http\Controllers\Invoices;

use App\Data\Invoices\FetchInvoicesData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Queries\Invoices\FetchInvoicesQuery;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceIndexController extends Controller
{
    public function __invoke(FetchInvoicesData $data, FetchInvoicesQuery $fetchInvoicesQuery): Response
    {
        $this->authorize('viewAny', Invoice::class);

        $invoices = $fetchInvoicesQuery->execute($data)->paginate(10);

        return Inertia::render('invoices/invoice.index', [
            'invoices' => Inertia::merge($invoices),
            'search' => $data->search,
            'filters' => $data->except('search', 'sort_field', 'sort_direction')->toArray(),
            'sort_field' => $data->sort_field,
            'sort_direction' => $data->sort_direction,
        ]);
    }
}
