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
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:1024|dimensions:ratio=1/1',
            'qsl' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:1024|dimensions:ratio=16/9'
        ];
    }

    public function messages()
    {
        return [
            'image' => 'Debe subir una imagen. Se admite jpeg, png, jpg y webp',
            'max' => 'El tamaño máximo del fichero no debe ser más de 1024Kb',
            'mimes' => 'Debe subir una imagen. Se admite jpeg, png, jpg y webp',
            'photo.dimensions' => 'El ratio de aspecto debe ser 1:1',
            'qsl.dimensions' => 'El ratio de aspecto debe ser 16:9',
        ];
    }

}
