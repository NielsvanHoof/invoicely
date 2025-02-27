<?php

namespace App\Data\Team;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class TeamInvitationData extends Data
{
    public function __construct(
        #[Required, Email, Max(255)]
        public string $email,

        #[Required, StringType, Max(255)]
        public string $name,
    ) {}
}
