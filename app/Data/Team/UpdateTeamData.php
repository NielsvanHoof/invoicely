<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class UpdateTeamData extends Data
{
    public function __construct(
        #[Max(255), Unique('teams', 'name', ignore: new FromAuthenticatedUserProperty('team_id'))]
        public string $name,
    ) {}
}
