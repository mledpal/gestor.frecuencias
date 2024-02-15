<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidarTiposCodificacion extends FormRequest
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
            'nombre' => 'required|string|max:30',
        ];
    }

    public function messages()
    {
        return [
            'required' => 'El dato es requerido',
            'string' => 'El valor debe ser una cadena de texto',
            'max' => 'Máximo 30 caracteres'

        ];
    }
}
