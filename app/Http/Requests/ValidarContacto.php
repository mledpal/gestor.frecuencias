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
            'banda_id' => 'required|integer',
            'modo_id' => 'required|integer',
            'calidad' => 'nullable|integer',
            'offset' => 'nullable|string',
            'direccion' => 'nullable|string|max:1',
            'tipo_codificacion_id' => 'nullable|integer',
            'dcs_id' => 'nullable|integer',
            'ctcss_id' => 'nullable|integer',
            'gps' => 'nullable|string|max:100',
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
        ];
    }
}
