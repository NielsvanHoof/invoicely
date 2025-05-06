<?php

namespace App\Data\Team;

use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Attributes\MergeValidationRules;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[MergeValidationRules]
#[TypeScript]
class TeamInvitationData extends Data
{
    public function __construct(
        #[Email, Max(255), Exists('users', 'email')]
        public string $email,

        #[Max(255)]
        public string $name,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'email' => [
                'not_in:'.(string) Auth::user()?->email,
            ],
        ];
    }
}
