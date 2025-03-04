@component('mail::message')
# Invoice Reminder

Dear {{ $invoice->client_name }},

{!! nl2br(e($message)) !!}

@component('mail::button', ['url' => config('app.url') . '/invoices/' . $invoice->id])
View Invoice
@endcomponent

@component('mail::table')
| Invoice Details |  |
| ------------- | ------------- |
| Invoice Number | {{ $invoice->invoice_number }} |
| Amount | ${{ number_format($invoice->amount, 2) }} |
| Issue Date | {{ $invoice->issue_date->format('F j, Y') }} |
| Due Date | {{ $invoice->due_date->format('F j, Y') }} |
@endcomponent

If you have any questions, please don't hesitate to contact us.

Thanks,<br>
{{ config('app.name') }}
@endcomponent 