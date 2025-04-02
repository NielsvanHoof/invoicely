<?php

namespace App\Models\Scopes;

use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class InvoiceByTeamOrUserScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  Builder<Model>  $builder
     * @param  Model<Model>  $model
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (!Auth::check()) {
            return;
        }


        $builder->when($model->team_id, function (Builder $query) use ($model) {
            $query->where('team_id', $model->team_id);
        })
            ->when(!$model->team_id, function (Builder $query) {
                $query->where('user_id', Auth::id());
            });
    }
}
