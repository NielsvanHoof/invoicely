<?php

namespace App\Data\Documents;

use App\Enums\DocumentType;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StoreDocumentData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Enum(DocumentType::class), In(DocumentType::class)]
        public DocumentType $category,
        #[Max(2048)]
        public UploadedFile $file,
    ) {}
}
