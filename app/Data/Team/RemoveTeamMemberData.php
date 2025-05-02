<?php

namespace App\Data\Team;

use Illuminate\Validation\Rules\NotIn;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Data;

class RemoveTeamMemberData extends Data
{
    public function __construct(
        #[Exists('users', 'id'), NotIn(new FromAuthenticatedUserProperty('id'))]
        public int $user_id,
    ) {}
}
