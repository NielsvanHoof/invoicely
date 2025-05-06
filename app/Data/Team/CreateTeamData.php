<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CreateTeamData extends Data
{
    public function __construct(
        #[Max(255), Unique('teams', 'name')]
        public string $name,
    ) {}
}
