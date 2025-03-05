<?php

namespace App\Enums;

enum ReminderType: string
{
    case UPCOMING = 'upcoming';
    case OVERDUE = 'overdue';
    case THANK_YOU = 'thank_you';

    /**
     * Get the display name for the reminder type.
     */
    public function label(): string
    {
        return match ($this) {
            self::UPCOMING => 'Upcoming Payment',
            self::OVERDUE => 'Overdue Payment',
            self::THANK_YOU => 'Thank You',
        };
    }

    /**
     * Get the default message template for this reminder type.
     */
    public function defaultMessage(): string
    {
        return match ($this) {
            self::UPCOMING => 'This is a friendly reminder that invoice #{{invoice_number}} for {{amount}} is due on {{due_date}}. Please make your payment before the due date.',
            self::OVERDUE => 'Your invoice #{{invoice_number}} for {{amount}} was due on {{due_date}} and is now overdue. Please make your payment as soon as possible.',
            self::THANK_YOU => 'Thank you for your payment of {{amount}} for invoice #{{invoice_number}}. We appreciate your business!',
        };
    }
}
