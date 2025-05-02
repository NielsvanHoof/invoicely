<?php

namespace App\Data\Invoices;

use App\Enums\InvoiceStatus;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class StoreInvoiceData extends Data
{
    public function __construct(
        #[Unique(table: 'invoices', column: 'invoice_number')]
        public string $invoice_number,

        #[Max(255)]
        public string $client_name,

        #[Email, Max(255)]
        public string $client_email,

        #[Max(255)]
        public ?string $client_address,

        #[Min(0)]
        public float $amount,

        #[Date]
        public string $issue_date,

        #[Date, AfterOrEqual('issue_date')]
        public string $due_date,

        #[Enum(InvoiceStatus::class)]
        public InvoiceStatus $status,

        #[Max(255)]
        public ?string $notes = null,

        #[File, Mimes(mimes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']), Max(10240)]
        public ?UploadedFile $file = null,
    ) {}
}
