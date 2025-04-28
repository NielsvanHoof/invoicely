<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\StoreTeamAction;
use App\Data\Team\TeamData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Team\CreateTeamRequest;
use Auth;
use Log;

class TeamStoreController extends Controller
{
    public function __invoke(CreateTeamRequest $request, StoreTeamAction $action)
    {
        try {
            $user = Auth::user()->load('team');
            $teamData = TeamData::from($request);
            $action->execute($user, $teamData);

            return back()->with('success', 'Team created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create team', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', $e->getMessage());
        }
    }
}
