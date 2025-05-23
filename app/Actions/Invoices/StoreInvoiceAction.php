<?php

namespace App\Actions\Invoices;

use App\Actions\Files\StoreFileAction;
use App\Actions\Reminders\ScheduleRemindersAction;
use App\Data\Invoices\StoreInvoiceData;
use App\Events\InvalidateAnalyticsCacheEvent;
use App\Events\InvalidateDashBoardCacheEvent;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class StoreInvoiceAction
{
    public function __construct(
        protected StoreFileAction $storeFileAction,
        protected ScheduleRemindersAction $scheduleRemindersAction,
    ) {}

    public function execute(StoreInvoiceData $data, ?UploadedFile $file, int $userId, ?int $teamId): Invoice
    {
        $filePath = null;

        if ($file) {
            $filePath = $this->storeFileAction->execute($file, $userId, 'invoices');
        }

        $invoice = Invoice::create([
            ...$data->except('file')->toArray(),
            'user_id' => $userId,
            'team_id' => $teamId,
            'file_path' => $filePath,
        ]);

        $this->scheduleRemindersAction->execute($invoice);

        $user = User::find($userId);

        InvalidateDashBoardCacheEvent::dispatch($user);
        InvalidateAnalyticsCacheEvent::dispatch($user);

        return $invoice;
    }
}
