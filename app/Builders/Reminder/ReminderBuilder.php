<?php

namespace App\Builders\Reminder;

use App\Models\Invoice;
use App\Models\Reminder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @extends Builder<Reminder>
 */
class ReminderBuilder extends Builder
{
    public function scopeDue(): self
    {
        return $this->whereNull('sent_at')
            ->where('scheduled_date', '<=', now());
    }

    public function getRemindersForInvoice(Invoice $invoice): HasMany
    {
        return $invoice->reminders()
            ->orderBy('scheduled_date', 'desc');
    }

    public function findReminderForInvoice(Invoice $invoice, int $reminderId): ?Reminder
    {
        return $invoice->reminders()->find($reminderId);
    }
}
