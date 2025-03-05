<?php

namespace App\Http\Requests\Reminders;

use App\Enums\ReminderType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReminderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::enum(ReminderType::class)],
            'scheduled_date' => ['required', 'date', 'after:today'],
            'message' => ['nullable', 'string'],
        ];
    }
}
