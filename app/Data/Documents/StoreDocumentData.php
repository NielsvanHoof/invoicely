<?php

namespace App\Data\Documents;

use App\Enums\DocumentType;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

class StoreDocumentData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Enum(DocumentType::class)]
        public string $category,
        #[Max(2048)]
        public UploadedFile $file,
    ) {}
}
