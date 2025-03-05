<?php

namespace App\Models;

use App\Builders\Reminder\ReminderBuilder;
use App\Enums\ReminderType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'invoice_id',
        'type',
        'scheduled_date',
        'sent_at',
        'message',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_date' => 'datetime',
        'sent_at' => 'datetime',
        'type' => ReminderType::class,
    ];

    public function newEloquentBuilder($query): ReminderBuilder
    {
        return new ReminderBuilder($query);
    }

    /**
     * Get the invoice that owns the reminder.
     *
     * @return BelongsTo<Invoice, Reminder>
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
