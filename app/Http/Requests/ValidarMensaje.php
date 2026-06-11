<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ValidarMensaje extends FormRequest
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
            'destinatario_id' => 'required|integer|exists:users,id',
            'mensaje' => 'required|string|max:2000',
        ];
    }

    public function messages()
    {
        return [
            'required' => 'El mensaje es requerido',
            'string' => 'Mensaje inválido',
            'destinatario_id.exists' => 'El destinatario no existe',
            'mensaje.max' => 'El mensaje es demasiado largo (máximo 2000 caracteres)',
        ];
    }
}
