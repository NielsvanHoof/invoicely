<?php

namespace App\Data\Clients;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UpdateClientData extends Data
{
    public function __construct(
        public Optional|string $name,
        public Optional|string $email,
        public Optional|string $phone,
        public Optional|string $address,
    ) {}
}
