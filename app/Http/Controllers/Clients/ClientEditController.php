<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Inertia\Inertia;
use Inertia\Response;

class ClientEditController extends Controller
{
    public function __invoke(Client $client): Response
    {
        return Inertia::render('clients/client.edit', [
            'client' => $client,
        ]);
    }
}
