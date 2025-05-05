<?php

namespace App\Http\Controllers\Reminders;

use App\Enums\ReminderType;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class ReminderIndexController extends Controller
{
    public function __invoke(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load('reminders');

        return Inertia::render('invoices/reminders/index', [
            'invoice' => $invoice,
            'types' => ReminderType::getReminderTypes(),
        ]);
    }
}
