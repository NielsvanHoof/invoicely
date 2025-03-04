<?php

namespace App\Http\Requests\Reminders;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReminderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'scheduled_date' => ['required', 'date', 'after:today'],
            'message' => ['nullable', 'string'],
        ];
    }
}
