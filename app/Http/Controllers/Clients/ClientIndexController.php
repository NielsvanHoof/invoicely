<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Inertia\Inertia;
use Inertia\Response;

class ClientIndexController extends Controller
{
    public function __invoke(): Response
    {
        $clients = Client::query()->get();

        return Inertia::render('clients/client.index', [
            'clients' => $clients,
        ]);
    }
}
