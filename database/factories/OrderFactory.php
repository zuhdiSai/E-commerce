<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'address_id' => Address::factory(),
            'order_number' => 'ORD-'.strtoupper(fake()->unique()->bothify('########')),
            'status' => fake()->randomElement(['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan']),
            'total_amount' => 0, // will be calculated from items in seeder
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Set the order status.
     */
    public function withStatus(string $status): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => $status,
        ]);
    }
}
