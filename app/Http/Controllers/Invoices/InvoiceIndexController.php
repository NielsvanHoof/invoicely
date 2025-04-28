<?php

namespace App\Http\Controllers\Invoices;

use App\Http\Controllers\Controller;
use App\Queries\Teams\FetchInvoicesQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceIndexController extends Controller
{
    public function __invoke(Request $request, FetchInvoicesQuery $fetchInvoicesQuery)
    {
        $search = $request->input('search', '');
        $user = Auth::user();

        $filters = [
            'status' => $request->input('status', ''),
            'date_from' => $request->input('date_from', ''),
            'date_to' => $request->input('date_to', ''),
            'amount_from' => $request->input('amount_from', ''),
            'amount_to' => $request->input('amount_to', ''),
        ];

        $invoices = $fetchInvoicesQuery->execute($user, $search, $filters)->paginate(10);

        return Inertia::render('invoices/index', [
            'invoices' => Inertia::merge($invoices),
            'search' => $search,
            'filters' => $filters,
        ]);
    }
}
