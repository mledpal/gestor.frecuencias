<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidarLocalizacion extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'localizacion' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:255',
            'pais' => 'nullable|string|max:255',
            'gps' => 'nullable|string|max:100'
        ];
    }
}
