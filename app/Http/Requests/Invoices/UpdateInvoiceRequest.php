<?php

namespace App\Http\Requests\Invoices;

use App\Enums\InvoiceStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInvoiceRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invoice_number' => 'required|string|unique:invoices,invoice_number,'.$this->invoice->id,
            'client_name' => 'required|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_address' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => ['required', Rule::enum(InvoiceStatus::class)],
            'notes' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'remove_file' => 'nullable|boolean',
        ];
    }
}
