<?php

namespace App\Jobs\Teams;

use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class TransferInvoicesToUserJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private User $user,
        private Team $team,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->user->invoices()
            ->where('team_id', $this->team->id)
            ->update([
                'team_id' => null,
                'user_id' => $this->user->id,
            ]);
    }
}
