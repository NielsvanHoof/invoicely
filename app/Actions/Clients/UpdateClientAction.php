<?php

namespace App\Actions\Clients;

use App\Data\Clients\UpdateClientData;
use App\Models\Client;

class UpdateClientAction
{
    public function execute(Client $client, UpdateClientData $data): int
    {
        return $client->update($data->toArray());
    }
}
