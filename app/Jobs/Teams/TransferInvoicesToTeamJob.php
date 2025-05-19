<?php

namespace App\Jobs\Teams;

use App\Models\Team;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TransferInvoicesToTeamJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

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
            ->where('user_id', $this->user->id)
            ->update([
                'team_id' => $this->team->id,
                'user_id' => null,
            ]);
    }
}
