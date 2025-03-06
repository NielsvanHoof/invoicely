<?php

namespace App\Services\Invoices;

use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Mail\Invoices\InvoiceReceivedMail;
use App\Models\Invoice;
use App\Services\Reminders\ReminderService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;

class InvoiceService
{
    public function __construct(
        protected InvoiceFileService $fileService,
        protected ReminderService $reminderService
    ) {}

    /**
     * Create a new invoice with file handling and reminders
     *
     * @param  array  $data  Invoice data
     * @param  UploadedFile|null  $file  Optional attached file
     * @param  int  $userId  User ID
     * @param  string|null  $teamId  Team ID
     */
    public function createInvoice(array $data, ?UploadedFile $file, int $userId, ?string $teamId): Invoice
    {
        $filePath = null;

        if ($file) {
            $filePath = $this->fileService->storeFile($file, $userId);
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

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);
        InvalidateAnalyticsCacheEvent::dispatch($invoice->user);

        return $invoice;
    }

    /**
     * Update an existing invoice with file handling and reminders
     *
     * @param  Invoice  $invoice  Invoice to update
     * @param  array  $data  Updated data
     * @param  UploadedFile|null  $file  Optional new file
     * @param  bool  $removeFile  Whether to remove existing file
     * @param  int  $userId  User ID
     */
    public function updateInvoice(Invoice $invoice, array $data, ?UploadedFile $file, bool $removeFile, int $userId): Invoice
    {
        $filePath = $this->fileService->handleFileUpdate(
            $invoice->file_path,
            $file,
            $removeFile,
            $userId
        );

        $invoice->update([
            ...$data,
            'file_path' => $filePath,
        ]);

        // Schedule reminders for the updated invoice
        $this->reminderService->scheduleReminders($invoice);

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);
        InvalidateAnalyticsCacheEvent::dispatch($invoice->user);

        return $invoice;
    }

    /**
     * Delete an invoice and its associated file
     *
     * @param  Invoice  $invoice  Invoice to delete
     */
    public function deleteInvoice(Invoice $invoice): bool
    {
        if ($invoice->file_path) {
            $this->fileService->deleteFile($invoice->file_path);
        }

        $deleted = $invoice->delete();

        InvalidateDashBoardCacheEvent::dispatch($invoice->user);
        InvalidateAnalyticsCacheEvent::dispatch($invoice->user);

        return $deleted;
    }
}
