<?php

namespace App\Models;

use App\Enums\ReminderType;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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

    public function formatMessage(ReminderType $type, Invoice $invoice): string
    {
        $template = $type->defaultMessage($type);

        $replacements = [
            '{{invoice_number}}' => $invoice->invoice_number,
            '{{amount}}' => '$'.number_format($invoice->amount, 2),
            '{{due_date}}' => $invoice->due_date->format('F j, Y'),
            '{{client_name}}' => $invoice->client_name,
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    #[Scope]
    public function scopeDue(Builder $query): Builder
    {
        return $query->whereNull('sent_at')
            ->where('scheduled_date', '<=', now());
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
