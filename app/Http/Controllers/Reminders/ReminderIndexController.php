<?php

namespace App\Http\Controllers\Reminders;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Reminder;
use Inertia\Inertia;
use Inertia\Response;

class ReminderIndexController extends Controller
{
    public function __invoke(Invoice $invoice): Response
    {
        $this->authorize('viewAny', Reminder::class);

        $invoice->load('reminders');

        return Inertia::render('invoices/reminders/index', [
            'invoice' => $invoice,
        ]);
    }
}
