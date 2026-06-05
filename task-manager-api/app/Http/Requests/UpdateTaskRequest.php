<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],

            'start_date' => ['sometimes', 'required', 'date'],
            'start_time' => ['sometimes', 'required', 'date_format:H:i'],

            'end_date' => ['sometimes', 'required', 'date'],
            'end_time' => ['sometimes', 'required', 'date_format:H:i'],
        ];
    }
}
