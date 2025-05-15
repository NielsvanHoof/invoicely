<?php

namespace App\Data\Team;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TeamInvitationData extends Data
{
    public function __construct(
        public string $email,

        public string $name,
    ) {}

    /**
     * Get the validation rules for the data.
     *
     * @return array<string, array<int, mixed>>
     */
    public static function rules(ValidationContext $context): array
    {
        return [
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::exists('users', 'email'),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::exists('users', 'name'),
            ],
        ];
    }

    /**
     * Get the validation messages for the data.
     *
     * @return array<string, string>
     */
    public static function messages(): array
    {
        return [
            'email.exists' => 'The email address does not exist.',
            'name.exists' => 'The name does not exist.',
        ];
    }
}
