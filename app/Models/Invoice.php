<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Models\Scopes\InvoiceByTeamOrUserScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

#[ScopedBy([InvoiceByTeamOrUserScope::class])]
class Invoice extends Model implements AuditableContract
{
    use Auditable, Searchable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
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
        'client_id',
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
        'payment_method' => PaymentMethod::class,
        'paid_at' => 'datetime',
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
     * @return BelongsTo<User, covariant Invoice>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the team that owns the invoice.
     *
     * @return BelongsTo<Team, covariant Invoice>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the reminders for the invoice.
     *
     * @return HasMany<Reminder, covariant Invoice>
     */
    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    /**
     * Get the client that owns the invoice.
     *
     * @return BelongsTo<Client, covariant Invoice>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the documents for the invoice.
     *
     * @return HasMany<Document, covariant Invoice>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
