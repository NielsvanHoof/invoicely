<?php

namespace App\Data\Team;

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RemoveTeamMemberData extends Data
{
    public function __construct(
        public int $user_id,
    ) {}

    /**
     * Get the validation rules for the data.
     *
     * @return array<string, array<int, mixed>>
     */
    public static function rules(ValidationContext $context): array
    {
        return [
            'user_id' => ['required', 'integer', Rule::exists('users', 'id')->where('team_id', Auth::user()->team_id)],
        ];
    }
}
