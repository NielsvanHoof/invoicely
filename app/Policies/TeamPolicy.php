<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('invoicer');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Team $team): bool
    {
        return $user->hasRole('admin') || $user->team_id === $team->id && $user->hasRole('invoicer');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('invoicer');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Team $team): bool
    {
        return $user->hasRole('admin') || $user->hasRole('invoicer') || $user->id === $team->owner_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        return $user->hasRole('admin') || $user->hasRole('invoicer') || $user->id === $team->owner_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Team $team): bool
    {
        return $user->hasRole('admin') || $user->hasRole('invoicer');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Team $team): bool
    {
        return $user->hasRole('admin') || $user->hasRole('invoicer') || $user->id === $team->owner_id;
    }

    /**
     * Determine whether the user can leave the team.
     */
    public function leave(User $user, Team $team): bool
    {
        // Only team members (not owners) can leave the team
        return $user->team_id === $team->id && $user->id !== $team->owner_id;
    }

    /**
     * Determine whether the user can remove a user from the team.
     */
    public function removeUser(User $user, Team $team): bool
    {
        // Only team owners can remove users
        return $user->hasRole('admin') || $user->hasRole('invoicer') || $user->id === $team->owner_id;
    }

    /**
     * Determine whether the user can invite new members to the team.
     */
    public function invite(User $user, Team $team): bool
    {
        // Only team owners can invite new members
        return $user->hasRole('admin') || $user->hasRole('invoicer') || $user->id === $team->owner_id;
    }
}
