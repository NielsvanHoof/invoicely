<?php

namespace App\Services\Invoices;

use App\Enums\InvoiceStatus;
use App\Enums\ReminderType;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Mail\Invoices\InvoiceReceivedMail;
use App\Models\Invoice;
use App\Models\Reminder;
use App\Models\User;
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

    /**
     * Update the status for multiple invoices.
     *
     * @param  array<int>  $invoiceIds
     * @param  int|null  $userId  (Optional: for context like cache invalidation)
     * @return int Number of invoices updated.
     */
    public function bulkUpdateStatus(array $invoiceIds, InvoiceStatus $status, ?int $userId = null): int
    {
        $updateData = ['status' => $status];

        $updateData['paid_at'] = ($status === InvoiceStatus::PAID) ? now() : null;

        $count = Invoice::whereIn('id', $invoiceIds)
            ->whereNot('status', InvoiceStatus::PAID)
            ->update($updateData);

        if ($userId) {
            InvalidateDashBoardCacheEvent::dispatch(User::find($userId));
            InvalidateAnalyticsCacheEvent::dispatch(User::find($userId));
        }

        return $count;
    }

    /**
     * Create reminders for multiple invoices.
     *
     * @param  array<int>  $invoiceIds
     * @param  int|null  $userId  (Optional: for context like cache invalidation)
     * @return int Number of reminders created.
     */
    public function bulkCreateReminders(array $invoiceIds, ReminderType $type, ?int $userId = null): int
    {
        $invoices = Invoice::whereIn('id', $invoiceIds)->get();
        $reminderCount = 0;
        $remindersToInsert = [];
        $now = now();

        foreach ($invoices as $invoice) {
            $shouldCreate = match ($type) {
                ReminderType::THANK_YOU => $invoice->status === InvoiceStatus::PAID,
                ReminderType::UPCOMING => $invoice->due_date > now(),
                ReminderType::OVERDUE => $invoice->due_date < now(),
                default => false,
            };

            if ($shouldCreate) {
                $reminderCount++;

                $remindersToInsert[] = ['invoice_id' => $invoice->id, 'type' => $type->value, 'scheduled_date' => $now->addDay(), 'message' => $type->defaultMessage()];
            }
        }

        if (! empty($remindersToInsert)) {
            Reminder::query()->insert($remindersToInsert);
        }

        if ($reminderCount > 0 && $userId) {
            InvalidateDashBoardCacheEvent::dispatch(User::find($userId));
        }

        return $reminderCount;
    }

    /**
     * Delete multiple invoices.
     *
     * @param  array<int>  $invoiceIds
     * @param  int|null  $userId  (Optional: for context like cache invalidation)
     * @return array<string, int> ['deletedCount' => int, 'failedCount' => int]
     */
    public function bulkDeleteInvoices(array $invoiceIds, ?int $userId = null): array
    {
        $invoices = Invoice::whereIn('id', $invoiceIds)->get();
        $deletedCount = 0;
        $failedCount = 0;

        $deletableInvoices = $invoices->filter(fn (Invoice $invoice) => $invoice->status !== InvoiceStatus::PAID);

        $failedCount = count($invoiceIds) - $deletableInvoices->count();

        if ($deletableInvoices->isEmpty()) {
            return ['deletedCount' => 0, 'failedCount' => $failedCount];
        }

        foreach ($deletableInvoices as $invoice) {
            if ($invoice->file_path) {
                $this->fileService->deleteFile($invoice->file_path);
            }
        }

        $deletedCount = Invoice::whereIn('id', $deletableInvoices->pluck('id')->toArray())->delete();

        if ($deletedCount > 0 && $userId) {
            InvalidateDashBoardCacheEvent::dispatch(User::find($userId));
            InvalidateAnalyticsCacheEvent::dispatch(User::find($userId));
        }

        return ['deletedCount' => $deletedCount, 'failedCount' => $failedCount];
    }
}
