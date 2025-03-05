<x-mail::message>
    # Invoice Received

    Thank you for submitting your invoice. We have successfully received invoice **#{{ $invoice->invoice_number }}** for
    **{{ $formatted_amount }}**.

    <x-mail::table>
        | Invoice Details | |
        | ------------- | ------------- |
        | Invoice Number | {{ $invoice->invoice_number }} |
        | Date | {{ $invoice->date->format('F j, Y') }} |
        | Amount | {{ $formatted_amount }} |
        | Due Date | {{ $invoice->due_date->format('F j, Y') }} |
    </x-mail::table>

    <x-mail::button :url="route('invoices.show', $invoice->id)">
        View Invoice
    </x-mail::button>

    Your invoice is currently being processed. You will receive another notification once it has been approved.

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>