<?php

namespace App\Data\Reminders;

use App\Enums\ReminderType;
use Spatie\LaravelData\Attributes\Validation\After;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class StoreReminderData extends Data
{
    public function __construct(
        #[Enum(ReminderType::class)]
        public string $type,
        #[After('today')]
        public string $scheduled_date,
        public null|Optional|string $message = null,
    ) {
    }
}