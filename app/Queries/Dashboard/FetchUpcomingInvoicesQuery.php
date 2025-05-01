<?php

namespace App\Queries\Dashboard;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use App\Queries\BaseQuery;
use Illuminate\Database\Eloquent\Collection;

class FetchUpcomingInvoicesQuery extends BaseQuery
{
    /**
     * Get upcoming invoices for a user (due in the future and not paid).
     *
     * @return Collection<int, Invoice>
     */
    public function execute(User $user, int $limit = 5): Collection
    {
        return $this->getCachedData($user, 'upcoming-invoices', function () use ($limit) {
            return Invoice::query()
                ->whereDate('due_date', '>=', now())
                ->whereNotIn('status', [InvoiceStatus::PAID])
                ->orderBy('due_date')
                ->take($limit)
                ->get();
        });
    }
}
