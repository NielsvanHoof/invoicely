<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ClientCreateController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('clients/client.create');
    }
}
