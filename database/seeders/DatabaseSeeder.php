<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\FinancingScheme;
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


        // 2. Seed Financing Schemes
        $schemes = [
            [
                'name' => 'Skim Pembiayaan Peribadi - Tawarruq',
                'interest_rate' => 4.50,
                'max_amount' => 50000.00,
            ],
            [
                'name' => 'Skim Pembiayaan Pendidikan - Tawarruq',
                'interest_rate' => 4.00,
                'max_amount' => 30000.00,
            ],
            [
                'name' => 'Skim Pembiayaan Kecemasan - Tawarruq',
                'interest_rate' => 3.50,
                'max_amount' => 5000.00,
            ],
        ];

        foreach ($schemes as $scheme) {
            FinancingScheme::updateOrCreate(
                ['name' => $scheme['name']],
                $scheme
            );
        }

        // 3. Seed Notices
        $notices = [
            [
                'title' => 'NOTIS SKIM PEMBIAYAAN PERAYAAN DEEPAVALI 2025',
                'content' => 'Sukacita dimaklumkan bahawa permohonan Skim Pembiayaan Perayaan Deepavali 2025 kini dibuka kepada semua anggota yang layak.',
                'published_at' => '2025-10-08 06:46:37',
            ],
            [
                'title' => 'NOTIS DIVIDEN ANGGOTA KOPMEDIA BAGI TAHUN 2024',
                'content' => 'Mesyuarat Agung Tahunan telah meluluskan pengagihan dividen sebanyak 6.5% bagi tahun kewangan berakhir 31 Disember 2024.',
                'published_at' => '2025-10-08 06:39:45',
            ],
            [
                'title' => 'Perutusan Pengerusi Sempena Tahun Baru 2025',
                'content' => 'Ketahuilah visi dan perutusan pengerusi Kopmedia sempena menyambut tahun baru 2025 untuk semua warga anggota.',
                'published_at' => '2025-01-09 15:57:44',
            ],
            [
                'title' => 'Notis Pertukaran Nama',
                'content' => 'Hebahan mengenai penjenamaan semula koperasi daripada Koperasi New Straits Times Press kepada Koperasi Media Prima Berhad.',
                'published_at' => '2025-01-09 15:56:06',
            ],
            [
                'title' => 'Notis Nombor Baru Direktori Kakitangan',
                'content' => 'Sila rujuk direktori kakitangan pejabat Kopmedia yang baharu berikutan pemindahan talian komunikasi.',
                'published_at' => '2024-08-22 01:38:42',
            ],
            [
                'title' => 'Notis Yuran Proses Skim Pembiayaan dan Pengeluaran Modal Yuran',
                'content' => 'Kemas kini caj yuran pentadbiran bagi pemprosesan borang dan pengeluaran simpanan modal yuran.',
                'published_at' => '2024-08-22 01:38:13',
            ],
        ];

        foreach ($notices as $notice) {
            Notice::updateOrCreate(
                ['title' => $notice['title']],
                $notice
            );
        }
    }
}
