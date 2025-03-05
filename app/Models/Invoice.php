<?php

namespace App\Models;

use App\Builders\Invoice\InvoiceBuilder;
use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'status' => InvoiceStatus::class,
    ];

    public function newEloquentBuilder($query): InvoiceBuilder
    {
        return new InvoiceBuilder($query);
    }

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
     * @return BelongsTo<User, Invoice>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the team that owns the invoice.
     *
     * @return BelongsTo<Team, Invoice>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the reminders for the invoice.
     *
     * @return HasMany<Reminder, Invoice>
     */
    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }
}
