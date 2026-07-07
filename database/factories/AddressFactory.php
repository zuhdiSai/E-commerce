<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    /**
     * The Indonesian provinces.
     *
     * @var list<string>
     */
    protected static array $provinces = [
        'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
        'Banten', 'DI Yogyakarta', 'Bali', 'Sumatera Utara',
        'Sumatera Barat', 'Sulawesi Selatan',
    ];

    /**
     * The Indonesian cities per province.
     *
     * @var array<string, list<string>>
     */
    protected static array $cities = [
        'DKI Jakarta' => ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'],
        'Jawa Barat' => ['Bandung', 'Bogor', 'Depok', 'Bekasi', 'Cimahi'],
        'Jawa Tengah' => ['Semarang', 'Solo', 'Magelang', 'Pekalongan'],
        'Jawa Timur' => ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik'],
        'Banten' => ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon'],
        'DI Yogyakarta' => ['Yogyakarta', 'Sleman', 'Bantul'],
        'Bali' => ['Denpasar', 'Badung', 'Gianyar', 'Tabanan'],
        'Sumatera Utara' => ['Medan', 'Binjai', 'Pematang Siantar'],
        'Sumatera Barat' => ['Padang', 'Bukittinggi', 'Payakumbuh'],
        'Sulawesi Selatan' => ['Makassar', 'Parepare', 'Palopo'],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $province = fake()->randomElement(static::$provinces);
        $city = fake()->randomElement(static::$cities[$province]);

        return [
            'user_id' => User::factory(),
            'label' => fake()->randomElement(['Rumah', 'Kantor', 'Kos']),
            'recipient_name' => fake()->name(),
            'phone' => fake()->numerify('08##########'),
            'address_line' => 'Jl. '.fake()->streetName().' No. '.fake()->buildingNumber().', RT '.fake()->numerify('##').'/RW '.fake()->numerify('##'),
            'city' => $city,
            'province' => $province,
            'postal_code' => fake()->numerify('#####'),
            'is_default' => false,
        ];
    }

    /**
     * Mark the address as the default.
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
