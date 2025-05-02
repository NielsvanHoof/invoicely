<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class CreateTeamData extends Data
{
    public function __construct(
        #[Max(255), Unique('teams', 'name')]
        public string $name,
    ) {}
}
