<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\NotIn;
use Spatie\LaravelData\Data;

class RemoveTeamMemberData extends Data
{
    public function __construct(
        #[Exists('users', 'id'), NotIn(FromAuthenticatedUserProperty('id'))]
        public int $user_id,
    ) {}
}
