<?php

namespace App\Data\Invoices;

use App\Enums\InvoiceStatus;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UpdateInvoiceData extends Data
{
    public function __construct(
        #[Unique(table: 'invoices', column: 'invoice_number', ignore: new RouteParameterReference('invoice'))]
        public string|Optional|null $invoice_number = null,

        #[Max(255)]
        public string|Optional|null $client_name = null,

        #[Email, Max(255)]
        public string|Optional|null $client_email = null,

        #[Max(255)]
        public string|Optional|null $client_address = null,

        #[Min(0)]
        public float|Optional|null $amount = null,

        #[Date]
        public string|Optional|null $issue_date = null,

        #[Date, AfterOrEqual('issue_date')]
        public string|Optional|null $due_date = null,

        #[Enum(InvoiceStatus::class), In(InvoiceStatus::class)]
        public InvoiceStatus|Optional|null $status = null,

        #[Max(255)]
        public string|Optional|null $notes = null,

        #[File, Mimes(mimes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']), Max(10240)]
        public UploadedFile|Optional|null $file = null,

        public bool|Optional|null $remove_file = null,
    ) {
    }
}
