<?php

namespace App\Builders\Invoice;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Scout\Builder as ScoutBuilder;

/**
 * @extends Builder<Invoice>
 */
class InvoiceBuilder extends Builder
{
    public function getInvoices(?string $search = '', ?array $filters = [], ?array $sort = []): Builder
    {
        $query = $search
            ? Invoice::search($search)->query(fn($query) => $query)
            : $this;

        $query = $this->filterInvoices($query, $filters);
        $query = $this->sortInvoices($query, $sort);

        return $query;
    }

    private function filterInvoices(Builder $query, ?array $filters = []): Builder
    {
        return $query
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
    }

    private function sortInvoices(Builder $query, ?array $sort = []): Builder
    {
        return $query->when($sort['field'] !== 'created_at', function ($query) use ($sort) {
            $query->orderBy($sort['field'], $sort['direction']);
        })
            ->when($sort['field'] === 'created_at', function ($query) use ($sort) {
                $query->latest();
            });
    }
}
