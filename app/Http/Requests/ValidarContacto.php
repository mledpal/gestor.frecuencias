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
            'fecha' => 'required|date_format:d/m/Y',
            'hora' => 'nullable|date_format:H:i',
            'tipo_id' => 'required|integer',
            'banda_id' => 'required|integer',
            'modo_id' => 'required|integer',
            'calidad' => 'nullable|integer',
            'offset' => 'nullable|string',
            'direccion' => 'nullable|string|max:1',
            'codificacion_id' => 'nullable|integer',
            'dcs_id' => 'nullable|integer',
            'ctcss_id' => 'nullable|integer',
        ];
    }
}
