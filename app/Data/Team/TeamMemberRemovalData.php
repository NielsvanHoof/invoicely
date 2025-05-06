<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TeamMemberRemovalData extends Data
{
    public function __construct(
        #[Exists('users', 'id')]
        public int $user_id,
    ) {}
}
