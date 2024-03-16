<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidarTipoContacto extends FormRequest
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
            'nombre' => 'required|string',
            'color' => ['required', 'string', 'regex:/(red|green|blue|yellow|pink|rose|violet|purple|fuchsia|orange|gray|emerald|sky|indigo)-(100|200|300|400|500|600|700|800|900)/']
        ];
    }


    public function messages()
    {
        return [
            'required' => 'El dato es requerido',
            'string' => 'El valor debe ser una cadena de texto',
            'regex' => 'Debe ser un color de clase TailwindCSS válido'
        ];
    }
}
