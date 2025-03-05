<?php

namespace App\Builders\Invoice;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * @extends Builder<Invoice>
 */
class InvoiceBuilder extends Builder
{
    public function ByTeam(?string $teamId): self
    {
        if ($teamId) {
            return $this->where('team_id', $teamId);
        }

        return $this;
    }

    public function ByUser(int $userId): self
    {
        return $this->where('user_id', $userId);
    }

    public function ForUser(User $user): self
    {
        if ($user->team_id) {
            return $this->byTeam($user->team_id);
        }

        return $this->byUser($user->id);
    }

    public function getPaginatedInvoices(User $user, string $search = '', array $filters = [], int $perPage = 10): \Laravel\Scout\Builder
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
