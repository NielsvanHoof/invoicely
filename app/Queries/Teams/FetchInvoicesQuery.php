<?php

namespace App\Queries\Teams;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Scout\Builder as ScoutBuilder;

class FetchInvoicesQuery
{
    /**
     * @param array{
     *     status?: string,
     *     date_from?: string,
     *     date_to?: string,
     *     amount_from?: string,
     *     amount_to?: string,
     * } $filters
     */
    public function execute(User $user, string $search = '', array $filters = []): ScoutBuilder
    {
        return Invoice::search($search)
            ->query(function (Builder $query) use ($user, $filters) {
                return $query
                    ->withCount('reminders')
                    ->when($user->team_id, function ($query) use ($user) {
                        $query->where('team_id', $user->team_id);
                    })
                    ->when(! $user->team_id, function ($query) use ($user) {
                        $query->where('user_id', $user->id);
                    })
                    ->when($filters['status'] ?? null, function ($query) use ($filters) {
                        $query->where('status', $filters['status']);
                    })
                    ->when($filters['date_from'] ?? null, function ($query) use ($filters) {
                        $query->whereDate('created_at', '>=', $filters['date_from']);
                    })
                    ->when($filters['date_to'] ?? null, function ($query) use ($filters) {
                        $query->whereDate('created_at', '<=', $filters['date_to']);
                    })
                    ->when($filters['amount_from'] ?? null, function ($query) use ($filters) {
                        $query->where('amount', '>=', $filters['amount_from']);
                    })
                    ->when($filters['amount_to'] ?? null, function ($query) use ($filters) {
                        $query->where('amount', '<=', $filters['amount_to']);
                    });
            });
    }
}
