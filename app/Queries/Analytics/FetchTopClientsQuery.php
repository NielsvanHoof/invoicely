<?php

namespace App\Queries\Analytics;

use App\Data\Analytics\FetchTopClientsData;
use App\Enums\InvoiceStatus;
use App\Models\User;
use App\Queries\BaseQuery;
use Illuminate\Support\Facades\DB;
use stdClass;

class FetchTopClientsQuery extends BaseQuery
{
    /**
     * Get the top clients by revenue.
     *
     * @return array<int, FetchTopClientsData>
     */
    public function execute(User $user, int $limit = 5): array
    {
        return $this->getCachedData($user, 'top-clients', function () use ($limit) {
            return DB::table('invoices')
                ->where('status', InvoiceStatus::PAID->value)
                ->select('client_name', DB::raw('SUM(amount) as revenue'))
                ->groupBy('client_name')
                ->orderByDesc('revenue')
                ->limit($limit)
                ->get()
                ->map(fn (stdClass $item) => FetchTopClientsData::from([
                    'client' => $item->client_name,
                    'revenue' => (float) $item->revenue,
                ]))
                ->toArray();
        });
    }
}
