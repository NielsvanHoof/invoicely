<?php

namespace App\Listeners;

use App\Events\TransferInvoicesToTeamEvent;

class TransferInvoicesToTeamListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TransferInvoicesToTeamEvent $event): void
    {
        $user = $event->user->load('invoices');
        $team = $event->team;

        $user->invoices()->update([
            'team_id' => $team->id,
        ]);
    }
}
