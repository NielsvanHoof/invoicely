<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Invoice extends Model
{
    use HasFactory, HasUlids, Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'invoice_number',
        'client_name',
        'client_email',
        'client_address',
        'amount',
        'issue_date',
        'due_date',
        'status',
        'notes',
        'file_path',
        'team_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the searchable array for the invoice.
     *
     * @return array<string, string>
     */
    public function toSearchableArray(): array
    {
        $array = $this->toArray();

        $array['client_name'] = $this->client_name;
        $array['invoice_number'] = $this->invoice_number;

        return $array;
    }

    /**
     * Get the user that owns the invoice.
     *
     * @return BelongsTo<User>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the team that owns the invoice.
     *
     * @return BelongsTo<Team>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Scope a query to filter invoices by team.
     *
     * @param  Builder<Invoice>  $query
     * @return Builder<Invoice>
     */
    public function scopeByTeam(Builder $query, ?string $teamId): Builder
    {
        if ($teamId) {
            return $query->where('team_id', $teamId);
        }

        return $query;
    }

    /**
     * Scope a query to filter invoices by user.
     *
     * @param  Builder<Invoice>  $query
     * @return Builder<Invoice>
     */
    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to filter invoices by user context (team or individual).
     *
     * @param  Builder<Invoice>  $query
     * @return Builder<Invoice>
     */
    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->team_id) {
            return $query->byTeam($user->team_id);
        }

        return $query->byUser($user->id);
    }
}
