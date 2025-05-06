<?php

namespace App\Queries\Analytics;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use App\Queries\BaseQuery;
use Illuminate\Support\Facades\DB;

class FetchStatusDistributionQuery extends BaseQuery
{
    /**
     * Get invoice status distribution.
     *
     * @return non-empty-list<array{name: non-falsy-string, value: int}>
     */
    public function execute(User $user): array
    {
        return $this->getCachedData($user, 'status-distribution', function () {
            $statusCounts = Invoice::query()
                ->select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            $result = [];

            foreach (InvoiceStatus::cases() as $status) {
                $result[] = [
                    'name' => ucfirst($status->value),
                    'value' => $statusCounts[$status->value] ?? 0,
                ];
            }

            return $result;
        });
    }
}
