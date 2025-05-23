<?php

namespace App\Jobs\Teams;

use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class TransferClientsToUserJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public Team $team,
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->user->clients()
            ->where('team_id', $this->team->id)
            ->update([
                'team_id' => null,
                'user_id' => $this->user->id,
            ]);
    }
}
