<?php

namespace App\Data\Reminders;

use Spatie\LaravelData\Attributes\Validation\After;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UpdateReminderData extends Data
{
    public function __construct(
        #[After('today')]
        public string $scheduled_date,
        public null|Optional|string $message = null,
    ) {}
}
