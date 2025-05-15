<?php

namespace App\Actions\Clients;

use App\Data\Clients\StoreClientData;
use App\Models\Client;
use Hash;
use Str;

class StoreClientAction
{
    public function execute(StoreClientData $storeClientData): Client
    {
        $password = Str::random(10);

        // TODO: Send email to client with password

        $client = Client::create([
            ...$storeClientData->toArray(),
            'password' => Hash::make($password),
        ]);

        $client->assignRole('client');

        return $client;
    }
}
