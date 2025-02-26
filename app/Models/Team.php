<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
    ];

    /**
     * Get the users for the team.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the invoices for the team.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Get the imports for the team.
     */
    public function imports(): HasMany
    {
        return $this->hasMany(Import::class);
    }
}
