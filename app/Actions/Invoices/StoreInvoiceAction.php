<?php

namespace App\Actions\Invoices;

use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Mail\Invoices\InvoiceReceivedMail;
use App\Models\Invoice;
use App\Models\User;
use App\Services\FileService;
use App\Services\Reminders\ReminderService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\App;
use Mail;

class StoreInvoiceAction
{
    public function __construct(
        protected FileService $fileService,
        protected ReminderService $reminderService
    ) {}

    public function execute(array $data, ?UploadedFile $file, int $userId, ?string $teamId): Invoice
    {
        $filePath = null;

        if ($file) {
            $filePath = $this->fileService->storeFile($file, $userId, 'invoices');
        }

        $invoice = Invoice::create([
            ...$data,
            'user_id' => $userId,
            'team_id' => $teamId,
            'file_path' => $filePath,
        ]);

        // Schedule reminders for the new invoice
        $this->reminderService->scheduleReminders($invoice);

        // Send email notification if client email is provided and in local environment
        if (isset($data['client_email']) && $data['client_email'] && App::isLocal()) {
            Mail::to($data['client_email'])->send(new InvoiceReceivedMail($invoice));
        }

        $user = User::find($userId);
        InvalidateDashBoardCacheEvent::dispatch($user);
        InvalidateAnalyticsCacheEvent::dispatch($user);

        return $invoice;
    }
}
