<?php

namespace App\Models\Scopes;

use App\Models\Invoice;
use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class InvoiceByTeamOrUserScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  Builder<Invoice>  $builder
     * @param  Invoice  $model
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (! Auth::check()) {
            return;
        }

        $user = Auth::user();

        $builder->when($user->team_id, function (Builder $query) use ($user) {
            $query->where('team_id', $user->team_id);
        })
            ->when(! $user->team_id, function (Builder $query) use ($user) {
                $query->where('user_id', $user->id);
            });
    }
}
