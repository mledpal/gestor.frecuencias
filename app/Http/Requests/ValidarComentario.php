<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidarComentario extends FormRequest
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
            'comentario' => 'required|string',
            'localizacion_id' => 'nullable|integer',
            'frecuencia_id' => 'required|integer'
        ];
    }

    public function messages()
    {
        return [
            'required' => 'El dato es requerido',
            'frecuencia_id' => 'No se ha asignado el comentario a una frecuencia',
        ];
    }
}
