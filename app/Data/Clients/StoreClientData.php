<?php

namespace App\Data\Clients;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StoreClientData extends Data
{
    public function __construct(
        public string $name,

        #[Email, Unique(table: 'clients', column: 'email')]
        public string $email,

        #[Unique(table: 'clients', column: 'company_name')]
        public string $company_name,

        #[Max(255)]
        public string $phone,

        #[Max(255)]
        public string $address,
    ) {}
}
