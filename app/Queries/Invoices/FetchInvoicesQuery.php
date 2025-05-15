<?php

namespace App\Queries\Invoices;

use App\Data\Invoices\FetchInvoicesData;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Scout\Builder as ScoutBuilder;

class FetchInvoicesQuery
{
    /**
     * Fetch invoices for a user.
     *
     * @return ScoutBuilder<Invoice>
     */
    public function execute(FetchInvoicesData $data): ScoutBuilder
    {
        return Invoice::search($data->search)
            ->query(function (Builder $query) use ($data) {
                return $query
                    ->withCount('reminders')
                    ->when($data->status ?? null, function ($query) use ($data) {
                        $query->where('status', $data->status);
                    })
                    ->when($data->date_from ?? null, function ($query) use ($data) {
                        $query->whereDate('created_at', '>=', $data->date_from);
                    })
                    ->when($data->date_to ?? null, function ($query) use ($data) {
                        $query->whereDate('created_at', '<=', $data->date_to);
                    })
                    ->when($data->amount_from ?? null, function ($query) use ($data) {
                        $query->where('amount', '>=', $data->amount_from);
                    })
                    ->when($data->amount_to ?? null, function ($query) use ($data) {
                        $query->where('amount', '<=', $data->amount_to);
                    })
                    ->when($data->sort_field ?? null, function ($query) use ($data) {
                        $query->orderBy($data->sort_field, $data->sort_direction);
                    });
            });
    }
}
