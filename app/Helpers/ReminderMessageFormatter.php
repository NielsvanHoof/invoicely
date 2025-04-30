<?php

namespace App\Helpers;

use App\Enums\ReminderType;
use App\Models\Invoice;

class ReminderMessageFormatter
{
    /**
     * Format a reminder message by replacing placeholders with actual values.
     *
     * @param  ReminderType  $type  The type of reminder
     * @param  Invoice  $invoice  The invoice to format the message for
     * @return string The formatted message
     */
    public function format(ReminderType $type, Invoice $invoice): string
    {
        $template = $type->defaultMessage($type);

        $replacements = [
            '{{invoice_number}}' => $invoice->invoice_number,
            '{{amount}}' => '$'.number_format($invoice->amount, 2),
            '{{due_date}}' => $invoice->due_date->format('F j, Y'),
            '{{client_name}}' => $invoice->client_name,
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }
}
