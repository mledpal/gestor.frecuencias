<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidarContacto extends FormRequest
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
            'frecuencia' => 'required|string',
            'observaciones' => 'nullable|string|max:65535',
            'comprobado' => 'nullable|integer',
            'fecha' => 'required|date',
            'hora' => 'nullable|date_format:H:i',
            'tipo_id' => 'required|integer',
            'banda_id' => 'nullable|integer|min:0',
            'modo_id' => 'required|integer|min:0',
            'calidad' => 'nullable|integer',
            'offset' => 'nullable|string',
            'direccion' => 'nullable|string|max:1',
            'codificacion_id' => 'nullable|integer',
            'dcs_id' => 'nullable|integer',
            'ctcss_id' => 'nullable|integer',
            'gps' => ['nullable', 'regex:/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/', 'max:100'],
        ];
    }

    public function messages()
    {
        return [
            'unique' => [
                'username' => 'El nombre de usuario ya está siendo usado',
                'email' => 'El correo ya está siendo usado',
            ],
            'required' => 'El dato es requerido',
            'email' => 'Debe introducir un correo válido',
            'string' => 'El valor debe ser una cadena de texto',
            'regex' => 'Ingrese unas coordenadas gps válidas (Google Maps)'
        ];
    }
}
