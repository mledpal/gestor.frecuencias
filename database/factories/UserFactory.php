<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // La columna admite 20 caracteres: userName() a veces los supera.
            'username' => substr(fake()->unique()->userName(), 0, 14).fake()->unique()->numberBetween(100000, 999999),
            'nombre' => fake()->firstName(),
            'apellidos' => fake()->lastName(),
            'indicativo' => strtoupper(fake()->unique()->bothify('E??##??')),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => 'password', // el cast 'hashed' del modelo lo hashea automáticamente
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
