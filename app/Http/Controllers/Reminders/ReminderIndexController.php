<?php

namespace App\Http\Controllers\Reminders;

use App\Enums\ReminderType;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class ReminderIndexController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load('reminders');

        return Inertia::render('reminders/index', [
            'invoice' => $invoice,
            'types' => ReminderType::getReminderTypes(),
        ]);
    }
}
