<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;
use App\Models\Rol;
use App\Models\User;

class ValidateRegister extends FormRequest
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
            'username' => 'required|string|max:20|unique:'.User::class,
            'nombre' => 'required|string|max:50',
            'apellidos' => 'required|string|max:150',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    public function messages() {
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
