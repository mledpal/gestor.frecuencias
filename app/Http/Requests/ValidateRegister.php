<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|alpha_dash|max:20|unique:'.User::class,
            'nombre' => 'required|string|max:50',
            'apellidos' => 'required|string|max:150',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    public function messages()
    {
        return [
            'username.unique' => 'El nombre de usuario ya está siendo usado',
            'email.unique' => 'El correo ya está siendo usado',
            'required' => 'El dato es requerido',
            'email' => 'Debe introducir un correo válido',
            'string' => 'El valor debe ser una cadena de texto',
            'min' => 'La contraseña debe ser más larga',
        ];
    }
}
