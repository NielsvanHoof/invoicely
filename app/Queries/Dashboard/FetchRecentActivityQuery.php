<?php

namespace App\Queries\Dashboard;

use App\Models\Invoice;
use App\Models\Reminder;
use App\Models\User;
use App\Queries\BaseQuery;

class FetchRecentActivityQuery extends BaseQuery
{
    /**
     * Get recent activity for a user.
     *
     * @return array<int, array<string, mixed>>
     */
    public function execute(User $user, int $limit = 10): array
    {
        return $this->getCachedData($user, 'recent-activity', function () use ($limit) {
            // Get recent invoices (created or updated)
            $recentInvoices = Invoice::query()
                ->latest('updated_at')
                ->take($limit)
                ->get()
                ->map(function (Invoice $invoice) {
                    $isNew = $invoice->created_at->diffInHours($invoice->updated_at) < 1;
                    $date = $isNew ? $invoice->created_at : $invoice->updated_at;

                    return [
                        'id' => $invoice->id,
                        'type' => $isNew ? 'created' : 'updated',
                        'invoice_number' => $invoice->invoice_number,
                        'client_name' => $invoice->client_name,
                        'amount' => $invoice->amount,
                        'status' => $invoice->status,
                        'date' => $date->toIso8601String(),
                        'timestamp' => $date->timestamp,
                    ];
                })
                ->toArray();

            // Get recent reminders
            $recentReminders = Reminder::query()
                ->with('invoice')
                ->latest('created_at')
                ->take($limit)
                ->get()
                ->map(function (Reminder $reminder) {
                    return [
                        'id' => $reminder->invoice->id,
                        'reminder_id' => $reminder->id,
                        'type' => 'reminder',
                        'reminder_type' => $reminder->type,
                        'invoice_number' => $reminder->invoice->invoice_number,
                        'client_name' => $reminder->invoice->client_name,
                        'amount' => $reminder->invoice->amount,
                        'status' => $reminder->invoice->status,
                        'sent_at' => $reminder->sent_at ? $reminder->sent_at->toIso8601String() : null,
                        'scheduled_date' => $reminder->scheduled_date->toIso8601String(),
                        'date' => $reminder->created_at->toIso8601String(),
                        'timestamp' => $reminder->created_at->timestamp,
                    ];
                })
                ->toArray();

            $allActivity = array_merge($recentInvoices, $recentReminders);
            usort($allActivity, function ($a, $b) {
                return $b['timestamp'] - $a['timestamp'];
            });

            return array_slice($allActivity, 0, $limit);
        });
    }
}
