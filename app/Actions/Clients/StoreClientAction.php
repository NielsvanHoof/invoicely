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
        return Client::create([
            ...$storeClientData->toArray(),
            'password' => Hash::make(Str::random(10)),
        ]);
    }
}