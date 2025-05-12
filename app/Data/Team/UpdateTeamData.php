<?php

namespace App\Data\Team;

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\FromAuthenticatedUserProperty;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\LaravelData\Support\Validation\ValidationContext;

#[TypeScript]
class UpdateTeamData extends Data
{
    public function __construct(
        public string $name,
    ) {
    }

    /**
     * Get the validation rules for the data.
     *
     * @param  ValidationContext  $context
     * @return array<string, array<int, mixed>>
     */
    public static function rules(ValidationContext $context): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('teams', 'name')->ignore(Auth::user()->team_id)],
        ];
    }
}
