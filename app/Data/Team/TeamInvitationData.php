<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\NotIn;
use Spatie\LaravelData\Data;

class TeamInvitationData extends Data
{
    public function __construct(
        #[Email, Max(255), Exists('users', 'email'), NotIn(FromAuthenticatedUserProperty('email'))]
        public string $email,

        #[Max(255)]
        public string $name,
    ) {}
}
