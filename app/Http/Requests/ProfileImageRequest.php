<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileImageRequest extends FormRequest
{
    /**
     * Reglas para validar las imágenes que se suben al servidor en los perfiles de usuario
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp',
            'qsl' => 'nullable|image|mimes:jpeg,png,jpg,webp'
        ];
    }
}
