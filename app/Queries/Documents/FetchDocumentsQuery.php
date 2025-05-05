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
     *
     * @return HasMany<Document>
     */
    public function execute(Invoice $invoice, ?string $search = null, ?string $category = null): HasMany
    {
        return $invoice->documents()
            ->when($search, function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($category && $category !== 'all', function (Builder $query) use ($category) {
                $query->where('category', $category);
            });
    }
}
