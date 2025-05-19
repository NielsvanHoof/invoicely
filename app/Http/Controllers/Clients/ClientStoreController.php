<?php

namespace App\Http\Controllers\Clients;

use App\Actions\Clients\StoreClientAction;
use App\Data\Clients\StoreClientData;
use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ClientStoreController extends Controller
{
    public function __invoke(StoreClientData $data, StoreClientAction $action): RedirectResponse
    {
        $this->authorize('create', Client::class);

        $user = Auth::user();

        $action->execute($user, $data);

        return redirect()->route('clients.index')->with('success', 'Client created successfully');
    }
}
