<?php

namespace App\Queries\Teams;

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
    public function execute(User $user, FetchInvoicesData $data): ScoutBuilder
    {
        return Invoice::search($data->search)
            ->query(function (Builder $query) use ($user, $data) {
                return $query
                    ->withCount('reminders')
                    ->when(! empty($user->team_id ?? null), function ($query) use ($user) {
                        $query->where('team_id', $user->team_id);
                    })
                    ->when(empty($user->team_id ?? null), function ($query) use ($user) {
                        $query->where('user_id', $user->id);
                    })
                    ->when($data->status ?? null, function ($query) use ($data) {
                        $query->where('status', $data->status);
                    })
                    ->when($data->dateFrom ?? null, function ($query) use ($data) {
                        $query->whereDate('created_at', '>=', $data->dateFrom);
                    })
                    ->when($data->dateTo ?? null, function ($query) use ($data) {
                        $query->whereDate('created_at', '<=', $data->dateTo);
                    })
                    ->when($data->amountFrom ?? null, function ($query) use ($data) {
                        $query->where('amount', '>=', $data->amountFrom);
                    })
                    ->when($data->amountTo ?? null, function ($query) use ($data) {
                        $query->where('amount', '<=', $data->amountTo);
                    });
            });
    }
}
