<?php

namespace App\Actions\Analytics;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GetStatusDistributionAction extends BaseAnalyticsAction
{
    /**
     * Get invoice status distribution.
     *
     * @return array<int, array{name: string, value: int}>
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
