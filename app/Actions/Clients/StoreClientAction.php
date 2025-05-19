<?php

namespace App\Actions\Clients;

use App\Data\Clients\StoreClientData;
use App\Models\Client;
use App\Models\User;
use Hash;
use Str;

class StoreClientAction
{
    public function execute(User $user, StoreClientData $storeClientData): Client
    {
        $password = Str::random(10);

        // TODO: Send email to client with password

        // Determine whether to use team_id or user_id
        // If user has a team, use team_id, otherwise use user_id
        $teamId = $user->team_id;
        $userId = $user->id;

        // Create client with either team_id or user_id, but not both
        $client = Client::create([
            ...$storeClientData->toArray(),
            'team_id' => $teamId,
            'user_id' => $teamId ? null : $userId, // Only set user_id if there's no team_id
            'password' => Hash::make($password),
        ]);

        $client->assignRole('client');

        return $client;
    }
}
