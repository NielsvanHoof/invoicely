<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

class TeamData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
    ) {}
}
