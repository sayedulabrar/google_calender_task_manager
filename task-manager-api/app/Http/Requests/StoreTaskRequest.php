<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow every user to make request.
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required','string','max:255'],
            'description' => ['nullable','string'],

            'start_date' => ['required','date'],
            'start_time' => ['required','date_format:H:i'],

            'end_date' => ['required','date'],
            'end_time' => ['required','date_format:H:i'],
        ];
    }
}
