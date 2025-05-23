<?php

namespace App\Data\Users;

use App\Enums\CurrencyType;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StoreUserData extends Data
{
    public function __construct(
        public string $name,

        #[Email]
        public string $email,

        #[Enum(CurrencyType::class)]
        public CurrencyType $currency,

        #[Exists('teams', 'id')]
        public ?int $team_id = null,
    ) {}
}
