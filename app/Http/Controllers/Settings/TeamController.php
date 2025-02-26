<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Mail\TeamInviteMail;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display the team management page.
     */
    public function index()
    {
        $user = Auth::user();
        $team = $user->team;

        // Get all team members if user has a team
        $teamMembers = [];
        $isTeamOwner = false;

        if ($team) {
            $teamMembers = User::where('team_id', $team->id)->get();
            $isTeamOwner = $user->id === $teamMembers->first()->id;
        }

        return Inertia::render('settings/teams', [
            'team' => $team,
            'teamMembers' => $teamMembers,
            'isTeamOwner' => $isTeamOwner,
            'hasTeam' => ! is_null($team),
        ]);
    }

    /**
     * Create a new team.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if user already has a team
        if ($user->team) {
            return back()->with('error', 'You already have a team.');
        }

        // Validate request
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        // Create new team
        $team = Team::create([
            'name' => $validated['name'],
        ]);

        // Associate user with team
        $user->team()->associate($team);
        $user->save();

        return back()->with('success', 'Team created successfully.');
    }

    /**
     * Update the team name.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $team = $user->team;

        // Check if user has a team
        if (! $team) {
            return back()->with('error', 'You do not have a team.');
        }

        // Validate request
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        // Update team name
        $team->update([
            'name' => $validated['name'],
        ]);

        return back()->with('success', 'Team updated successfully.');
    }

    /**
     * Invite a user to the team.
     */
    public function invite(Request $request)
    {
        $user = Auth::user();
        $team = $user->team;

        // Check if user has a team
        if (! $team) {
            return back()->with('error', 'You do not have a team.');
        }

        // Validate request
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        // Check if user already exists
        $invitedUser = User::where('email', $validated['email'])->first();

        if ($invitedUser) {
            // If user exists, add them to the team
            $invitedUser->team()->associate($team);
            $invitedUser->save();

            // Send email without password
            Mail::to($validated['email'])->send(new TeamInviteMail($user, $invitedUser, $team, null));
        } else {
            // Create a new user with a random password
            $password = Str::random(12);

            $createdUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
            ]);

            $createdUser->team()->associate($team);
            $createdUser->save();

            // Send email with password
            Mail::to($validated['email'])->send(new TeamInviteMail($user, $createdUser, $team, $password));
        }

        return back()->with('success', 'User invited successfully.');
    }

    /**
     * Remove a user from the team.
     */
    public function removeUser(Request $request)
    {
        $user = Auth::user();
        $team = $user->team;

        // Check if user has a team
        if (! $team) {
            return back()->with('error', 'You do not have a team.');
        }

        // Validate request
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        // Prevent removing yourself
        if ($validated['user_id'] === $user->id) {
            return back()->with('error', 'You cannot remove yourself from the team.');
        }

        // Remove user from team
        $userToRemove = User::find($validated['user_id']);
        $userToRemove->team()->dissociate();
        $userToRemove->save();

        return back()->with('success', 'User removed from team.');
    }

    /**
     * Leave the current team.
     */
    public function leave()
    {
        $user = Auth::user();

        // Check if user has a team
        if (! $user->team) {
            return back()->with('error', 'You are not a member of any team.');
        }

        // Remove user from team
        $user->team()->dissociate();
        $user->save();

        return redirect()->route('dashboard')->with('success', 'You have left the team.');
    }
}
