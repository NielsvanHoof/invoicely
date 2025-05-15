<?php

namespace App\Http\Controllers\Clients;

use App\Actions\Clients\UpdateClientAction;
use App\Data\Clients\UpdateClientData;
use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;

class ClientUpdateController extends Controller
{
    public function __invoke(Client $client, UpdateClientAction $action, UpdateClientData $data): RedirectResponse
    {
        $result = $action->execute($client, $data);

        if ($result) {
            return redirect()->route('clients.index')->with('success', 'Client updated successfully');
        }

        return redirect()->route('clients.index')->with('error', 'Failed to update client');
    }
}
