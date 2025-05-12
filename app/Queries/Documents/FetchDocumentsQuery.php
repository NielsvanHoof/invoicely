<?php

namespace App\Queries\Documents;

use App\Models\Document;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FetchDocumentsQuery
{
    /**
     * Fetch documents for an invoice with filtering.
     * @return HasMany<Document, covariant Invoice>
     */
    public function execute(Invoice $invoice, ?string $search = null, ?string $category = null): HasMany
    {
       return $invoice->documents();
    }
}
