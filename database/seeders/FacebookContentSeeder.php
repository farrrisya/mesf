<?php

// --1. imports--
namespace Database\Seeders;

use App\Models\League;
use App\Models\News;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

// --2. main seeder--
class FacebookContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first(); // state
        $adminId = $admin ? $admin->id : 1; // state

        // --3. seed news from MESF Facebook page--
        $facebookNews = [
            [
                'title' => 'Pencarian Atlet E-Sukan Negara: Seleksi Kebangsaan Sukan Asia 2026 Dibuka',
                'slug' => 'pencarian-atlet-e-sukan-negara-seleksi-kebangsaan-sukan-asia-2026',
                'category' => 'TOURNAMENTS',
                'tag' => '[ TOURNAMENTS ]',
                'author_id' => $adminId,
                'excerpt' => 'Pendaftaran kini dibuka untuk Seleksi Kebangsaan bagi mewakili Malaysia ke Sukan Asia Aichi-Nagoya 2026 dalam disiplin Mobile Legends: Bang Bang dan eFootball.',
                'content' => "<p>Persekutuan Sukan Elektronik Malaysia (MESF) secara rasmi membuka pendaftaran bagi pusingan Seleksi Kebangsaan atlet e-sukan negara. Pusingan kelayakan ini bertujuan memilih atlet dan pasukan terbaik yang bakal mengibarkan jalur gemilang di temasya Sukan Asia ke-20 Aichi-Nagoya 2026.</p><p>Disiplin yang dipertandingkan merangkumi Mobile Legends: Bang Bang (MLBB) dan eFootball. Pasukan negeri dan kelab berdaftar dipelawa menghantar penyertaan sebelum tarikh tutup pendaftaran.</p>",
                'image_path' => 'sliders/NVYeAKxuQxNO1zAQu27BZLiBCk7jxjd2mAjjTsOs.jpg',
                'location' => 'KUALA LUMPUR',
                'status' => 'published',
                'is_featured' => true,
                'published_at' => Carbon::now()->subDays(1),
                'views_count' => 342,
            ],
            [
                'title' => 'Inisiatif Insentif RM20,000 Diumumkan untuk Pemenang Pingat Emas Sukan Asia 2026',
                'slug' => 'inisiatif-insentif-rm20000-diumumkan-untuk-pemenang-pingat-emas-sukan-asia-2026',
                'category' => 'ACHIEVEMENTS',
                'tag' => '[ ACHIEVEMENTS ]',
                'author_id' => $adminId,
                'excerpt' => 'Presiden MESF mengumumkan skim insentif prestasi khas bernilai RM20,000 bagi membakar semangat atlet negara berentap memburu emas di pentas Sukan Asia.',
                'content' => "<p>Bagi menghargai dedikasi dan komitmen atlet e-sukan tanah air, pihak pengurusan tertinggi MESF telah mengumumkan ganjaran insentif kemenangan bernilai RM20,000 kepada mana-mana skuad kebangsaan yang berjaya membawa pulang pingat emas pada temasya Sukan Asia 2026.</p><p>Skim insentif ini membuktikan sokongan padu berterusan pihak persekutuan dalam memacu kecemerlangan sukan elektronik di peringkat antarabangsa.</p>",
                'image_path' => 'sliders/oZafSgOp9v5hm9FmiFfaT2GhLnbHztOnUVKcN6DC.jpg',
                'location' => 'PUTRAJAYA',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(2),
                'views_count' => 512,
            ],
            [
                'title' => 'Kenyataan Rasmi: Penjadualan Semula Kejohanan Esports Nations Cup (ENC)',
                'slug' => 'kenyataan-rasmi-penjadualan-semula-kejohanan-esports-nations-cup-enc',
                'category' => 'ANNOUNCEMENTS',
                'tag' => '[ ANNOUNCEMENTS ]',
                'author_id' => $adminId,
                'excerpt' => 'MESF memaklumkan penstrukturan semula kalendar penganjuran sulung Esports Nations Cup ke November 2027 bagi memastikan persediaan infrastruktur dan penyertaan antarabangsa optimum.',
                'content' => "<p>Merujuk kepada pengumuman rasmi badan pentadbir antarabangsa, temasya sulung Esports Nations Cup (ENC) yang sebelum ini dirancang dijadualkan semula bagi memberi ruang kepada penyelarasan kalendar kejohanan dunia dan persiapan venue bertaraf antarabangsa.</p><p>MESF terus komited memastikan atlet negara bersedia menghadapi kejohanan-kejohanan utama lain sepanjang kalendar 2026.</p>",
                'image_path' => 'media/qQuBDU0WsVdg8VLKP6A6nwN5ntnvMVn4arjYGJpN.jpg',
                'location' => 'OFFICIAL',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(4),
                'views_count' => 289,
            ],
            [
                'title' => 'MESF Meterai Memorandum Persefahaman (MoU) Bersama Russian Esports Federation (RESF)',
                'slug' => 'mesf-meterai-mou-bersama-russian-esports-federation-resf',
                'category' => 'PARTNERSHIPS',
                'tag' => '[ PARTNERSHIPS ]',
                'author_id' => $adminId,
                'excerpt' => 'Kerjasama dua hala bertujuan memperkukuh pembangunan atlet kebangsaan, pertukaran teknikal kepegawaian serta pendedahan pertandingan antarabangsa.',
                'content' => "<p>MESF telah menandatangani Memorandum Persefahaman (MoU) bersejarah bersama Russian Esports Federation (RESF). Majlis pemeteraian ini membuka lembaran baharu dalam pertukaran modul latihan sains sukan e-sukan, perlawanan persahabatan antarabangsa, dan pensijilan kepegawaian teknikal.</p><p>Inisiatif ini bakal memberi impak positif kepada ekosistem e-sukan kedua-dua buah negara.</p>",
                'image_path' => 'media/fuLEQb6V5e5zOjD1GQgzxvqKXETLocY0U9xe5Dut.jpg',
                'location' => 'MOSCOW / KL',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => Carbon::now()->subDays(6),
                'views_count' => 430,
            ],
        ];

        foreach ($facebookNews as $newsData) { // loop
            News::updateOrCreate( // save
                ['slug' => $newsData['slug']],
                $newsData
            );
        }

        // --4. seed leagues & tournaments from MESF Facebook page--
        $facebookLeagues = [
            [
                'name' => 'Malaysia Esports League (MEL) 2026',
                'slug' => 'malaysia-esports-league-mel-2026',
                'season' => 'Season 5',
                'game_title' => 'PUBG Mobile',
                'tier' => 'Tier 1 - National Championship',
                'format' => 'Group Stage + Grand Finals',
                'prize_pool' => 'RM 100,000',
                'start_date' => Carbon::now()->addDays(20)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(45)->format('Y-m-d'),
                'registration_deadline' => Carbon::now()->addDays(12)->format('Y-m-d'),
                'slots' => '32 Squads',
                'entry_fee' => 'Free Entry',
                'display_options' => ['prize_pool', 'dates', 'closing_date', 'slots', 'fee', 'format', 'location'],
                'registration_status' => 'REGISTRATION OPEN',
                'banner_path' => 'sliders/NVYeAKxuQxNO1zAQu27BZLiBCk7jxjd2mAjjTsOs.jpg',
                'description' => 'Kejohanan e-sukan kebangsaan premier anjuran bersama KBS, ESI dan MESF bagi mengasah bakat profesional seluruh negeri.',
                'location' => 'Kuala Lumpur (LAN Finals)',
                'is_active' => true,
            ],
            [
                'name' => 'Seleksi Kebangsaan Sukan Asia 2026',
                'slug' => 'seleksi-kebangsaan-sukan-asia-2026-league',
                'season' => 'Aichi-Nagoya Qualifier',
                'game_title' => 'Mobile Legends: Bang Bang (MLBB)',
                'tier' => 'Tier 1 - National Selection',
                'format' => 'Double Elimination Playoffs',
                'prize_pool' => 'RM 20,000 Incentive',
                'start_date' => Carbon::now()->addDays(15)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(28)->format('Y-m-d'),
                'registration_deadline' => Carbon::now()->addDays(8)->format('Y-m-d'),
                'slots' => '16 State Squads',
                'entry_fee' => 'Free Entry (National Pathway)',
                'display_options' => ['prize_pool', 'dates', 'closing_date', 'slots', 'fee', 'format', 'location'],
                'registration_status' => 'REGISTRATION OPEN',
                'banner_path' => 'sliders/oZafSgOp9v5hm9FmiFfaT2GhLnbHztOnUVKcN6DC.jpg',
                'description' => 'Pusingan pemilihan rasmi kontinjen negara untuk merebut tiket ke Temasya Sukan Asia ke-20 Aichi-Nagoya 2026.',
                'location' => 'ESI Hub, Spacerubix Puchong',
                'is_active' => true,
            ],
            [
                'name' => 'IESF World Esports Championship (WEC) Qualifier',
                'slug' => 'iesf-wec-qualifier-2026',
                'season' => 'WEC 2026',
                'game_title' => 'Valorant',
                'tier' => 'Tier 1 - International Qualifier',
                'format' => 'Single Elimination Bracket',
                'prize_pool' => 'Sponsored WEC Slot + RM 30,000',
                'start_date' => Carbon::now()->addDays(35)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(50)->format('Y-m-d'),
                'registration_deadline' => Carbon::now()->addDays(25)->format('Y-m-d'),
                'slots' => '64 Teams Max',
                'entry_fee' => 'Free Entry',
                'display_options' => ['prize_pool', 'dates', 'closing_date', 'slots', 'fee', 'format', 'location'],
                'registration_status' => 'UPCOMING',
                'banner_path' => 'media/wYxrUUtfby2ke97BHlublhex0HbTEfuFbonslTt7.jpg',
                'description' => 'Pusingan kelayakan rasmi peringkat kebangsaan bagi mewakili Malaysia ke Kejohanan Dunia IESF WEC.',
                'location' => 'Online Qualifier / KL Finals',
                'is_active' => true,
            ],
        ];

        foreach ($facebookLeagues as $leagueData) { // loop
            League::updateOrCreate( // save
                ['slug' => $leagueData['slug']],
                $leagueData
            );
        }
    }
}
