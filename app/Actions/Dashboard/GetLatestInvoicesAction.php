<?php

namespace App\Actions\Dashboard;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GetLatestInvoicesAction extends BaseDashboardAction
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
