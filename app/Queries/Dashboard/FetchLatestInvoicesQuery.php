<?php

namespace App\Queries\Dashboard;

use App\Models\Invoice;
use App\Models\User;
use App\Queries\BaseQuery;
use Illuminate\Database\Eloquent\Collection;

class FetchLatestInvoicesQuery extends BaseQuery
{
    /**
     * Get latest invoices for a user.
     *
     * @return Collection<int, Invoice>
     */
    public function execute(User $user, int $limit = 5): Collection
    {
        return $this->getCachedData($user, 'latest-invoices', function () use ($limit) {
            return Invoice::query()
                ->latest()
                ->take($limit)
                ->get();
        });
    }
}
