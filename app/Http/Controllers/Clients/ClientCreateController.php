<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Inertia\Inertia;
use Inertia\Response;

class ClientCreateController extends Controller
{
    public function __invoke(): Response
    {
        $this->authorize('create', Client::class);

        return Inertia::render('clients/client.create');
    }
}
