<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'size',
        'url',
        'type',
        'mime_type',
        'category',
        'invoice_id',
    ];

    /**
     * The invoice that the document belongs to.
     *
     * @return BelongsTo<Invoice, Document>
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
