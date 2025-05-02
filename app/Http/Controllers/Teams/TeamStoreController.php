<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\StoreTeamAction;
use App\Data\Team\CreateTeamData;
use App\Http\Controllers\Controller;
use App\Models\Team;
use Auth;
use Illuminate\Http\RedirectResponse;

class TeamStoreController extends Controller
{
    public function __invoke(CreateTeamData $data, StoreTeamAction $action): RedirectResponse
    {
        $this->authorize('create', Team::class);

        $user = Auth::user()->load('team');
        $createdTeam = $action->execute($user, $data);

        if ($createdTeam) {
            return back()->with('success', 'Team created successfully.');
        }

        return back()->with('error', 'Failed to create team.');
    }
}
