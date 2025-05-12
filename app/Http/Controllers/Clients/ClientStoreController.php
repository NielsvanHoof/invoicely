<?php

namespace App\Http\Controllers\Clients;

use App\Data\Clients\StoreClientData;
use App\Http\Controllers\Controller;
use App\Actions\Clients\StoreClientAction;
use Illuminate\Http\RedirectResponse;

class ClientStoreController extends Controller
{
    public function __invoke(StoreClientData $data, StoreClientAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()->route('clients.index')->with('success', 'Client created successfully');
    }
}