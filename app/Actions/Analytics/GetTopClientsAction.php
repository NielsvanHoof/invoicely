<?php

namespace App\Actions\Analytics;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GetTopClientsAction extends BaseAnalyticsAction
{
    /**
     * Get top clients by revenue.
     *
     * @return array<int, array{client: string, revenue: float}>
     */
    public function execute(User $user, int $limit = 5): array
    {
        return $this->getCachedData($user, 'top-clients', function () use ($limit) {
            return Invoice::query()
                ->where('status', InvoiceStatus::PAID->value)
                ->select('client_name', DB::raw('SUM(amount) as revenue'))
                ->groupBy('client_name')
                ->orderByDesc('revenue')
                ->limit($limit)
                ->get()
                ->map(function ($item) {
                    return [
                        'client' => $item->client_name,
                        'revenue' => (float) $item->revenue,
                    ];
                })
                ->toArray();
        });
    }
}
