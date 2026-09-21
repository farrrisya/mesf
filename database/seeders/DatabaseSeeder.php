<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notice;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        User::updateOrCreate(
            ['email' => 'super_admin@mesf.my'],
            [
                'name' => 'MESF Super Admin',
                'password' => Hash::make('mesfmy'),
                'role' => 'super_admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@mesf.my'],
            [
                'name' => 'MESF Administrator',
                'password' => Hash::make('mesfmy'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'editor@mesf.my'],
            [
                'name' => 'MESF Editor',
                'password' => Hash::make('mesfmy'),
                'role' => 'editor',
            ]
        );

        User::updateOrCreate(
            ['email' => 'secretariat@mesf.my'],
            [
                'name' => 'MESF Secretariat',
                'password' => Hash::make('mesfmy'),
                'role' => 'secretariat',
            ]
        );

        // 2. Seed Notices (MESF placeholder structure)
        $notices = [
            // Future MESF notices can be added here
        ];

        foreach ($notices as $notice) {
            Notice::updateOrCreate(
                ['title' => $notice['title']],
                $notice
            );
        }
    }
}

