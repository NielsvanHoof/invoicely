<?php

namespace App\Builders\Invoice;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Builder;

/**
 * @extends Builder<Invoice>
 */
class InvoiceBuilder extends Builder
{
    public function getPaginatedInvoices(?string $search = '', ?array $filters = []): \Laravel\Scout\Builder
    {
        return Invoice::search($search)
            ->query(fn (Builder $query) => $query
                ->withCount('reminders')
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
                }));
    }
}
