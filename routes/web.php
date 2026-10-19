<?php

// --1. imports--
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\SecretaryController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\Admin\InquiryManagementController;
use App\Http\Controllers\Admin\MemberManagementController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\LeagueController as AdminLeagueController;
use App\Http\Controllers\Admin\TeamController as AdminTeamController;
use App\Http\Controllers\Admin\MatchController as AdminMatchController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\TeamRegistrationController;
use App\Http\Controllers\PublicNewsController;
use App\Models\League;
use App\Models\Team;
use App\Models\EsportMatch;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --2. public routes--
Route::get('/', function () {
    $categories = [ // state
        'TOURNAMENTS',
        'ACHIEVEMENTS',
        'ANNOUNCEMENTS',
        'PARTNERSHIPS',
    ];

    $latestByCategory = []; // state
    $filledUpdates = []; // state
    $usedCategories = []; // state

    foreach ($categories as $cat) { // loop
        $article = \App\Models\News::published() // check
            ->where('category', $cat)
            ->orderBy('created_at', 'desc') // clock
            ->first();

        $data = $article ? [ // state
            'id' => $article->id,
            'title' => $article->title,
            'slug' => $article->slug,
            'category' => $article->category,
            'tag' => $article->tag ?: "[ {$article->category} ]",
            'excerpt' => $article->excerpt,
            'image' => $article->image_path ? \Illuminate\Support\Facades\Storage::url($article->image_path) : null,
            'video_url' => $article->video_url,
            'date' => $article->published_at ? $article->published_at->format('d M Y') : $article->created_at->format('d M Y'),
            'timestamp' => $article->created_at ? $article->created_at->timestamp : ($article->published_at ? $article->published_at->timestamp : 0),
            'location' => $article->location ?: 'OFFICIAL',
            'is_empty' => false, // check
        ] : null;

        $latestByCategory[$cat] = $data; // save

        if ($data) { // check
            $filledUpdates[] = $data; // save
            $usedCategories[] = $cat; // save
        }
    }

    // sort filled articles by latest upload date descending
    usort($filledUpdates, function ($a, $b) { // trigger
        return $b['timestamp'] <=> $a['timestamp'];
    });

    // fill remaining spots with empty categories
    $remainingCategories = array_values(array_diff($categories, $usedCategories)); // convert
    $emptyUpdates = array_map(function ($cat) { // convert
        return [
            'category' => $cat,
            'is_empty' => true,
        ];
    }, $remainingCategories);

    $latestUpdates = array_merge($filledUpdates, $emptyUpdates); // convert

    $allNews = \App\Models\News::published() // check
        ->orderBy('created_at', 'desc') // clock
        ->limit(16)
        ->get()
        ->map(function ($article) { // convert
            return [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'category' => $article->category,
                'tag' => $article->tag ?: "[ {$article->category} ]",
                'excerpt' => $article->excerpt,
                'image' => $article->image_path ? \Illuminate\Support\Facades\Storage::url($article->image_path) : null,
                'video_url' => $article->video_url,
                'date' => $article->published_at ? $article->published_at->format('d M Y') : $article->created_at->format('d M Y'),
                'timestamp' => $article->created_at ? $article->created_at->timestamp : ($article->published_at ? $article->published_at->timestamp : 0),
                'location' => $article->location ?: 'OFFICIAL',
                'is_featured' => (bool)$article->is_featured,
                'is_empty' => false, // check
            ];
        });

    $featuredArticle = \App\Models\News::published() // check
        ->where('is_featured', true)
        ->orderBy('created_at', 'desc') // clock
        ->first();
    if (!$featuredArticle) { // check
        $featuredArticle = \App\Models\News::published() // check
            ->orderBy('created_at', 'desc') // clock
            ->first();
    }

    $featuredData = $featuredArticle ? [ // state
        'id' => $featuredArticle->id,
        'title' => $featuredArticle->title,
        'slug' => $featuredArticle->slug,
        'category' => $featuredArticle->category,
        'tag' => $featuredArticle->tag ?: "[ {$featuredArticle->category} ]",
        'excerpt' => $featuredArticle->excerpt,
        'image' => $featuredArticle->image_path ? \Illuminate\Support\Facades\Storage::url($featuredArticle->image_path) : null,
        'video_url' => $featuredArticle->video_url,
        'date' => $featuredArticle->published_at ? $featuredArticle->published_at->format('d M Y') : $featuredArticle->created_at->format('d M Y'),
        'location' => $featuredArticle->location ?: 'OFFICIAL',
    ] : null;

    $leagues = League::where('is_active', true) // state
        ->orderBy('created_at', 'desc')
        ->limit(6)
        ->get()
        ->map(function ($l) {
            return [ // convert
                'id' => $l->id,
                'name' => $l->name,
                'slug' => $l->slug,
                'season' => $l->season,
                'game_title' => $l->game_title,
                'tier' => $l->tier,
                'format' => $l->format,
                'prize_pool' => $l->prize_pool,
                'start_date' => $l->start_date ? $l->start_date->format('d M Y') : 'TBA',
                'end_date' => $l->end_date ? $l->end_date->format('d M Y') : null,
                'date_range' => $l->start_date ? $l->start_date->format('d M Y') . ($l->end_date ? ' - ' . $l->end_date->format('d M Y') : '') : 'TBA',
                'registration_deadline' => $l->registration_deadline ? $l->registration_deadline->format('d M Y') : null,
                'slots' => $l->slots,
                'entry_fee' => $l->entry_fee,
                'display_options' => $l->display_options,
                'registration_status' => $l->registration_status ?: 'REGISTRATION OPEN',
                'banner_url' => $l->banner_path ? \Illuminate\Support\Facades\Storage::url($l->banner_path) : null,
                'description' => $l->description,
                'location' => $l->location ?: 'Malaysia',
            ];
        });

    $teams = Team::where('is_active', true) // state
        ->orderByRaw("CASE WHEN type = 'national' THEN 0 ELSE 1 END")
        ->orderBy('name', 'asc')
        ->get()
        ->map(function ($t) {
            return [ // convert
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'tag' => $t->tag ?: strtoupper(substr($t->name, 0, 3)),
                'type' => $t->type,
                'region' => $t->region ?: 'National',
                'game' => $t->game_title,
                'status' => $t->status ?: 'ACTIVE',
                'logo' => $t->logo_path ? \Illuminate\Support\Facades\Storage::url($t->logo_path) : null,
                'team_pic' => $t->team_pic_path ? \Illuminate\Support\Facades\Storage::url($t->team_pic_path) : null,
                'manager' => $t->manager_name,
                'motto' => $t->motto,
                'roster_size' => $t->roster_size ?: 5,
                'since' => $t->created_at ? $t->created_at->format('Y') : '2024',
            ];
        });

    return Inertia::render('Welcome', [ // screen
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'latestByCategory' => $latestByCategory,
        'latestUpdates' => $latestUpdates,
        'allNews' => $allNews,
        'featuredArticle' => $featuredData,
        'leagues' => $leagues,
        'teams' => $teams,
    ]);
})->name('home');

Route::get('/news', [PublicNewsController::class, 'index'])->name('news'); // screen
Route::get('/news/article', function () {
    $first = \App\Models\News::published()->latest('created_at')->first(); // state
    return $first ? redirect()->route('news.show', $first->slug) : redirect()->route('news'); // redirect
})->name('news.article');
Route::get('/news/{slug}', [PublicNewsController::class, 'show'])->name('news.show'); // screen

Route::get('/leagues', function () {
    $leagues = League::where('is_active', true) // state
        ->orderBy('created_at', 'desc') // clock
        ->get()
        ->map(function ($l) {
            return [ // convert
                'id' => $l->id,
                'title' => $l->name,
                'slug' => $l->slug,
                'game' => $l->game_title,
                'status' => $l->registration_status ?: 'UPCOMING',
                'date' => $l->start_date ? $l->start_date->format('d M Y') . ($l->end_date ? ' - ' . $l->end_date->format('d M Y') : '') : 'TBA',
                'location' => $l->location,
                'description' => $l->description,
                'banner' => $l->banner_path ? \Illuminate\Support\Facades\Storage::url($l->banner_path) : null,
                'tier' => $l->tier,
                'prize_pool' => $l->prize_pool,
            ];
        });

    return Inertia::render('Leagues', [ // screen
        'leagues' => $leagues
    ]);
})->name('leagues');

Route::get('/leagues/details', function (\Illuminate\Http\Request $request) {
    $slug = $request->query('slug'); // state
    $league = null; // state
    if ($slug) { // check
        $league = League::where('slug', $slug)->first();
    }
    if (!$league) { // check
        $league = League::where('is_active', true)->orderBy('start_date', 'desc')->first();
    }

    $formattedDates = null; // state
    if ($league && $league->start_date && $league->end_date) {
        $formattedDates = $league->start_date->format('d M Y') . ' - ' . $league->end_date->format('d M Y');
    } elseif ($league && $league->start_date) {
        $formattedDates = 'Starts ' . $league->start_date->format('d M Y');
    }

    $formattedDeadline = $league && $league->registration_deadline ? $league->registration_deadline->format('d M Y') : null; // state

    $otherLeagues = $league ? League::where('is_active', true) // state
        ->where('id', '!=', $league->id)
        ->orderBy('start_date', 'desc')
        ->limit(4)
        ->get()
        ->map(function ($ol) {
            return [ // convert
                'id' => $ol->id,
                'name' => $ol->name,
                'slug' => $ol->slug,
                'game_title' => $ol->game_title,
                'season' => $ol->season,
                'tier' => $ol->tier,
                'prize_pool' => $ol->prize_pool,
                'registration_status' => $ol->registration_status,
                'banner_url' => $ol->banner_path ? \Illuminate\Support\Facades\Storage::url($ol->banner_path) : null,
            ];
        }) : [];

    $leagueData = $league ? [ // convert
        'id' => $league->id,
        'name' => $league->name,
        'slug' => $league->slug,
        'season' => $league->season,
        'game_title' => $league->game_title,
        'tier' => $league->tier,
        'format' => $league->format,
        'prize_pool' => $league->prize_pool,
        'start_date' => $league->start_date ? $league->start_date->format('Y-m-d') : null,
        'end_date' => $league->end_date ? $league->end_date->format('Y-m-d') : null,
        'formatted_dates' => $formattedDates,
        'registration_deadline' => $league->registration_deadline ? $league->registration_deadline->format('Y-m-d') : null,
        'formatted_deadline' => $formattedDeadline,
        'slots' => $league->slots,
        'entry_fee' => $league->entry_fee,
        'location' => $league->location,
        'registration_status' => $league->registration_status ?: 'REGISTRATION OPEN',
        'banner_url' => $league->banner_path ? \Illuminate\Support\Facades\Storage::url($league->banner_path) : null,
        'description' => $league->description,
        'display_options' => $league->display_options ?: ['prize_pool', 'dates', 'closing_date', 'slots', 'fee', 'format', 'location'],
    ] : null;

    return Inertia::render('LeagueDetails', [ // screen
        'league' => $leagueData,
        'otherLeagues' => $otherLeagues,
    ]);
})->name('leagues.details');

Route::get('/leagues/{slug}', function ($slug) {
    $league = League::where('slug', $slug)->first(); // state
    if (!$league && is_numeric($slug)) { // check
        $league = League::find($slug);
    }
    if (!$league) { // check
        $league = League::where('is_active', true)->orderBy('start_date', 'desc')->first();
    }

    $formattedDates = null; // state
    if ($league && $league->start_date && $league->end_date) {
        $formattedDates = $league->start_date->format('d M Y') . ' - ' . $league->end_date->format('d M Y');
    } elseif ($league && $league->start_date) {
        $formattedDates = 'Starts ' . $league->start_date->format('d M Y');
    }

    $formattedDeadline = $league && $league->registration_deadline ? $league->registration_deadline->format('d M Y') : null; // state

    $otherLeagues = $league ? League::where('is_active', true) // state
        ->where('id', '!=', $league->id)
        ->orderBy('start_date', 'desc')
        ->limit(4)
        ->get()
        ->map(function ($ol) {
            return [ // convert
                'id' => $ol->id,
                'name' => $ol->name,
                'slug' => $ol->slug,
                'game_title' => $ol->game_title,
                'season' => $ol->season,
                'tier' => $ol->tier,
                'prize_pool' => $ol->prize_pool,
                'registration_status' => $ol->registration_status,
                'banner_url' => $ol->banner_path ? \Illuminate\Support\Facades\Storage::url($ol->banner_path) : null,
            ];
        }) : [];

    $leagueData = $league ? [ // convert
        'id' => $league->id,
        'name' => $league->name,
        'slug' => $league->slug,
        'season' => $league->season,
        'game_title' => $league->game_title,
        'tier' => $league->tier,
        'format' => $league->format,
        'prize_pool' => $league->prize_pool,
        'start_date' => $league->start_date ? $league->start_date->format('Y-m-d') : null,
        'end_date' => $league->end_date ? $league->end_date->format('Y-m-d') : null,
        'formatted_dates' => $formattedDates,
        'registration_deadline' => $league->registration_deadline ? $league->registration_deadline->format('Y-m-d') : null,
        'formatted_deadline' => $formattedDeadline,
        'slots' => $league->slots,
        'entry_fee' => $league->entry_fee,
        'location' => $league->location,
        'registration_status' => $league->registration_status ?: 'REGISTRATION OPEN',
        'banner_url' => $league->banner_path ? \Illuminate\Support\Facades\Storage::url($league->banner_path) : null,
        'description' => $league->description,
        'display_options' => $league->display_options ?: ['prize_pool', 'dates', 'closing_date', 'slots', 'fee', 'format', 'location'],
    ] : null;

    return Inertia::render('LeagueDetails', [ // screen
        'league' => $leagueData,
        'otherLeagues' => $otherLeagues,
    ]);
})->name('leagues.show');

Route::get('/matches', function () {
    $rawMatches = EsportMatch::where('is_active', true) // state
        ->orderByRaw('CASE WHEN scheduled_date IS NULL THEN 1 ELSE 0 END, scheduled_date ASC, scheduled_time ASC')
        ->get();

    $allTeams = Team::all()->keyBy(function ($t) { return strtolower(trim($t->name)); }); // state
    $allTeamsByTag = Team::whereNotNull('tag')->get()->keyBy(function ($t) { return strtolower(trim($t->tag)); }); // state

    $groups = $rawMatches->groupBy(function ($m) { // loop
        return $m->scheduled_date ? $m->scheduled_date->format('d M Y') : 'TBA';
    })->map(function ($items, $date) use ($allTeams, $allTeamsByTag) {
        return [ // convert
            'date' => $date,
            'matches' => $items->map(function ($m) use ($allTeams, $allTeamsByTag) {
                $nameA = strtolower(trim($m->team_a_name ?? ''));
                $tagA = strtolower(trim($m->team_a_tag ?? ''));
                $tA = $allTeams->get($nameA) ?: $allTeamsByTag->get($tagA);

                $nameB = strtolower(trim($m->team_b_name ?? ''));
                $tagB = strtolower(trim($m->team_b_tag ?? ''));
                $tB = $allTeams->get($nameB) ?: $allTeamsByTag->get($tagB);

                return [
                    'id' => $m->id,
                    'tournament' => $m->tournament_name,
                    'stage' => $m->round ?: 'Match',
                    'game' => $m->game_title,
                    'format' => $m->format ?: 'BO3',
                    'time' => $m->scheduled_time ?: 'TBA',
                    'status' => $m->status ?: 'UPCOMING',
                    'venue' => $m->venue,
                    'stream_url' => $m->stream_url,
                    'teamA' => [
                        'name' => $m->team_a_name,
                        'tag' => $m->team_a_tag ?: strtoupper(substr($m->team_a_name, 0, 3)),
                        'score' => $m->team_a_score,
                        'logo' => $tA && $tA->logo_path ? \Illuminate\Support\Facades\Storage::url($tA->logo_path) : null,
                    ],
                    'teamB' => [
                        'name' => $m->team_b_name,
                        'tag' => $m->team_b_tag ?: strtoupper(substr($m->team_b_name, 0, 3)),
                        'score' => $m->team_b_score,
                        'logo' => $tB && $tB->logo_path ? \Illuminate\Support\Facades\Storage::url($tB->logo_path) : null,
                    ],
                ];
            })->values(),
        ];
    })->values();

    return Inertia::render('Matches', [ // screen
        'matchGroups' => $groups
    ]);
})->name('matches');

Route::get('/matches/details', function () {
    $match = EsportMatch::where('is_active', true)->orderByRaw('CASE WHEN scheduled_date IS NULL THEN 1 ELSE 0 END, scheduled_date ASC, scheduled_time ASC')->first(); // state

    $teamA = $match ? Team::where('name', $match->team_a_name)->orWhere('tag', $match->team_a_tag)->first() : null; // check
    $teamB = $match ? Team::where('name', $match->team_b_name)->orWhere('tag', $match->team_b_tag)->first() : null; // check

    $matchData = $match ? [ // convert
        'id' => $match->id,
        'tournament_name' => $match->tournament_name,
        'game_title' => $match->game_title,
        'round' => $match->round ?: 'Match',
        'format' => $match->format ?: 'BO3',
        'scheduled_date' => $match->scheduled_date ? $match->scheduled_date->format('Y-m-d') : null,
        'formatted_date' => $match->scheduled_date ? $match->scheduled_date->format('l, d F Y') : 'TBA',
        'scheduled_time' => $match->scheduled_time ?: 'TBA',
        'venue' => $match->venue,
        'stream_url' => $match->stream_url,
        'status' => $match->status ?: 'UPCOMING',
        'team_a' => [
            'name' => $match->team_a_name,
            'tag' => $match->team_a_tag ?: strtoupper(substr($match->team_a_name, 0, 3)),
            'score' => $match->team_a_score,
            'logo' => $teamA && $teamA->logo_path ? \Illuminate\Support\Facades\Storage::url($teamA->logo_path) : null,
            'region' => $teamA ? $teamA->region : null,
            'motto' => $teamA ? $teamA->motto : null,
            'manager' => $teamA ? $teamA->manager_name : null,
            'status' => $teamA ? $teamA->status : null,
            'slug' => $teamA ? $teamA->slug : null,
        ],
        'team_b' => [
            'name' => $match->team_b_name,
            'tag' => $match->team_b_tag ?: strtoupper(substr($match->team_b_name, 0, 3)),
            'score' => $match->team_b_score,
            'logo' => $teamB && $teamB->logo_path ? \Illuminate\Support\Facades\Storage::url($teamB->logo_path) : null,
            'region' => $teamB ? $teamB->region : null,
            'motto' => $teamB ? $teamB->motto : null,
            'manager' => $teamB ? $teamB->manager_name : null,
            'status' => $teamB ? $teamB->status : null,
            'slug' => $teamB ? $teamB->slug : null,
        ],
    ] : null;

    $otherMatches = EsportMatch::where('is_active', true) // state
        ->when($match, function ($query) use ($match) {
            return $query->where('id', '!=', $match->id);
        })
        ->orderByRaw('CASE WHEN scheduled_date IS NULL THEN 1 ELSE 0 END, scheduled_date ASC, scheduled_time ASC')
        ->limit(4)
        ->get()
        ->map(function ($om) {
            return [ // convert
                'id' => $om->id,
                'tournament_name' => $om->tournament_name,
                'game_title' => $om->game_title,
                'round' => $om->round ?: 'Match',
                'format' => $om->format ?: 'BO3',
                'team_a_name' => $om->team_a_name,
                'team_a_tag' => $om->team_a_tag ?: strtoupper(substr($om->team_a_name, 0, 3)),
                'team_b_name' => $om->team_b_name,
                'team_b_tag' => $om->team_b_tag ?: strtoupper(substr($om->team_b_name, 0, 3)),
                'formatted_date' => $om->scheduled_date ? $om->scheduled_date->format('d M Y') : 'TBA',
                'scheduled_time' => $om->scheduled_time ?: 'TBA',
                'status' => $om->status ?: 'UPCOMING',
            ];
        });

    return Inertia::render('MatchDetails', [ // screen
        'match' => $matchData,
        'otherMatches' => $otherMatches
    ]);
})->name('matches.details');

Route::get('/matches/{id}', function ($id) {
    $match = EsportMatch::find($id); // state
    if (!$match) { // check
        $match = EsportMatch::where('is_active', true)->orderByRaw('CASE WHEN scheduled_date IS NULL THEN 1 ELSE 0 END, scheduled_date ASC, scheduled_time ASC')->first(); // state
    }

    $teamA = $match ? Team::where('name', $match->team_a_name)->orWhere('tag', $match->team_a_tag)->first() : null; // check
    $teamB = $match ? Team::where('name', $match->team_b_name)->orWhere('tag', $match->team_b_tag)->first() : null; // check

    $matchData = $match ? [ // convert
        'id' => $match->id,
        'tournament_name' => $match->tournament_name,
        'game_title' => $match->game_title,
        'round' => $match->round ?: 'Match',
        'format' => $match->format ?: 'BO3',
        'scheduled_date' => $match->scheduled_date ? $match->scheduled_date->format('Y-m-d') : null,
        'formatted_date' => $match->scheduled_date ? $match->scheduled_date->format('l, d F Y') : 'TBA',
        'scheduled_time' => $match->scheduled_time ?: 'TBA',
        'venue' => $match->venue,
        'stream_url' => $match->stream_url,
        'status' => $match->status ?: 'UPCOMING',
        'team_a' => [
            'name' => $match->team_a_name,
            'tag' => $match->team_a_tag ?: strtoupper(substr($match->team_a_name, 0, 3)),
            'score' => $match->team_a_score,
            'logo' => $teamA && $teamA->logo_path ? \Illuminate\Support\Facades\Storage::url($teamA->logo_path) : null,
            'region' => $teamA ? $teamA->region : null,
            'motto' => $teamA ? $teamA->motto : null,
            'manager' => $teamA ? $teamA->manager_name : null,
            'status' => $teamA ? $teamA->status : null,
            'slug' => $teamA ? $teamA->slug : null,
        ],
        'team_b' => [
            'name' => $match->team_b_name,
            'tag' => $match->team_b_tag ?: strtoupper(substr($match->team_b_name, 0, 3)),
            'score' => $match->team_b_score,
            'logo' => $teamB && $teamB->logo_path ? \Illuminate\Support\Facades\Storage::url($teamB->logo_path) : null,
            'region' => $teamB ? $teamB->region : null,
            'motto' => $teamB ? $teamB->motto : null,
            'manager' => $teamB ? $teamB->manager_name : null,
            'status' => $teamB ? $teamB->status : null,
            'slug' => $teamB ? $teamB->slug : null,
        ],
    ] : null;

    $otherMatches = EsportMatch::where('is_active', true) // state
        ->when($match, function ($query) use ($match) {
            return $query->where('id', '!=', $match->id);
        })
        ->orderByRaw('CASE WHEN scheduled_date IS NULL THEN 1 ELSE 0 END, scheduled_date ASC, scheduled_time ASC')
        ->limit(4)
        ->get()
        ->map(function ($om) {
            return [ // convert
                'id' => $om->id,
                'tournament_name' => $om->tournament_name,
                'game_title' => $om->game_title,
                'round' => $om->round ?: 'Match',
                'format' => $om->format ?: 'BO3',
                'team_a_name' => $om->team_a_name,
                'team_a_tag' => $om->team_a_tag ?: strtoupper(substr($om->team_a_name, 0, 3)),
                'team_b_name' => $om->team_b_name,
                'team_b_tag' => $om->team_b_tag ?: strtoupper(substr($om->team_b_name, 0, 3)),
                'formatted_date' => $om->scheduled_date ? $om->scheduled_date->format('d M Y') : 'TBA',
                'scheduled_time' => $om->scheduled_time ?: 'TBA',
                'status' => $om->status ?: 'UPCOMING',
            ];
        });

    return Inertia::render('MatchDetails', [ // screen
        'match' => $matchData,
        'otherMatches' => $otherMatches
    ]);
})->name('matches.show');

Route::get('/teams', function () {
    $teams = Team::where('is_active', true) // state
        ->orderBy('name', 'asc')
        ->get()
        ->map(function ($t) {
            return [ // convert
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'tag' => $t->tag ?: strtoupper(substr($t->name, 0, 3)),
                'type' => $t->type,
                'region' => $t->region ?: 'National',
                'game' => $t->game_title,
                'status' => $t->status ?: 'ACTIVE',
                'logo' => $t->logo_path ? \Illuminate\Support\Facades\Storage::url($t->logo_path) : null,
                'manager' => $t->manager_name,
                'motto' => $t->motto,
                'roster_size' => $t->roster_size ?: 5,
                'since' => $t->created_at ? $t->created_at->format('Y') : '2024',
                'rosters' => [$t->game_title ?: 'National Squad'],
            ];
        });

    return Inertia::render('Teams', [ // screen
        'uploadedTeams' => $teams
    ]);
})->name('teams');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/teams/details', function () {
    $slug = request()->query('slug');
    $team = null;
    if ($slug) {
        $team = Team::where('slug', $slug)->first() ?: Team::where('id', $slug)->first();
    }
    if (!$team) {
        $team = Team::where('is_active', true)->whereIn('type', ['national', 'pro'])->first();
    }

    if ($team && $team->type === 'state') {
        return redirect()->route('teams.state-show', $team->slug ?: $team->id);
    }

    $teamData = $team ? [
        'id' => $team->id,
        'name' => $team->name,
        'slug' => $team->slug,
        'tag' => $team->tag,
        'type' => $team->type,
        'region' => $team->region,
        'game_title' => $team->game_title,
        'manager_name' => $team->manager_name,
        'contact_email' => $team->contact_email,
        'motto' => $team->motto,
        'roster_size' => $team->roster_size,
        'status' => $team->status ?: 'ACTIVE',
        'logo' => $team->logo_path ? \Illuminate\Support\Facades\Storage::url($team->logo_path) : null,
    ] : null;

    $otherTeams = Team::where('is_active', true)
        ->whereIn('type', ['national', 'pro'])
        ->when($team, function ($q) use ($team) {
            return $q->where('id', '!=', $team->id);
        })
        ->orderBy('name', 'asc')
        ->limit(6)
        ->get()
        ->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'tag' => $t->tag,
                'region' => $t->region,
                'game_title' => $t->game_title,
                'logo' => $t->logo_path ? \Illuminate\Support\Facades\Storage::url($t->logo_path) : null,
            ];
        });

    return Inertia::render('TeamDetails', [
        'team' => $teamData,
        'otherTeams' => $otherTeams,
        'slug' => $slug,
    ]);
})->name('teams.details');

Route::get('/teams/state-details', function () {
    $slug = request()->query('slug');
    $state = null;
    if ($slug) {
        $normalizedSlug = str_replace('_', '-', \Illuminate\Support\Str::slug($slug));
        $state = Team::where('type', 'state')
            ->where(function ($q) use ($slug, $normalizedSlug) {
                $q->where('slug', $slug)
                  ->orWhere('slug', $normalizedSlug)
                  ->orWhere('id', $slug)
                  ->orWhere('tag', strtoupper($slug))
                  ->orWhereRaw('LOWER(name) = ?', [strtolower(str_replace(['_', '-'], ' ', $slug))]);
            })
            ->first();
    }
    if (!$state) {
        $state = Team::where('type', 'state')->where('is_active', true)->first();
    }

    $stateLogo = null;
    if ($state) {
        if ($state->logo_path) {
            $stateLogo = \Illuminate\Support\Facades\Storage::url($state->logo_path);
        } else {
            $slugCrest = $state->slug ? public_path("images/states/{$state->slug}_transparent.png") : null;
            $slugUnderscoreCrest = $state->slug ? public_path("images/states/" . str_replace('-', '_', $state->slug) . "_transparent.png") : null;
            if ($slugCrest && file_exists($slugCrest)) {
                $stateLogo = "/images/states/{$state->slug}_transparent.png";
            } elseif ($slugUnderscoreCrest && file_exists($slugUnderscoreCrest)) {
                $stateLogo = "/images/states/" . str_replace('-', '_', $state->slug) . "_transparent.png";
            }
        }
    }

    $stateData = $state ? [
        'id' => $state->id,
        'name' => $state->name,
        'slug' => $state->slug,
        'tag' => $state->tag,
        'type' => $state->type,
        'region' => $state->region,
        'game_title' => $state->game_title,
        'manager_name' => $state->manager_name,
        'contact_email' => $state->contact_email,
        'motto' => $state->motto,
        'roster_size' => $state->roster_size,
        'status' => $state->status ?: 'ACTIVE',
        'logo' => $stateLogo,
    ] : null;

    $otherStates = Team::where('type', 'state')
        ->where('is_active', true)
        ->when($state, function ($q) use ($state) {
            return $q->where('id', '!=', $state->id);
        })
        ->orderBy('name', 'asc')
        ->get()
        ->map(function ($s) {
            $crest = null;
            if ($s->logo_path) {
                $crest = \Illuminate\Support\Facades\Storage::url($s->logo_path);
            } else {
                $p1 = public_path("images/states/{$s->slug}_transparent.png");
                $p2 = public_path("images/states/" . str_replace('-', '_', $s->slug) . "_transparent.png");
                if (file_exists($p1)) {
                    $crest = "/images/states/{$s->slug}_transparent.png";
                } elseif (file_exists($p2)) {
                    $crest = "/images/states/" . str_replace('-', '_', $s->slug) . "_transparent.png";
                }
            }
            return [
                'id' => $s->id,
                'name' => $s->name,
                'slug' => $s->slug,
                'tag' => $s->tag,
                'region' => $s->region,
                'logo' => $crest,
            ];
        });

    return Inertia::render('StateDetails', [
        'state' => $stateData,
        'otherStates' => $otherStates,
        'stateSlug' => $slug,
    ]);
})->name('teams.state-details');

Route::get('/teams/state/{slug}', function ($slug) {
    $normalizedSlug = str_replace('_', '-', \Illuminate\Support\Str::slug($slug));
    $state = Team::where('type', 'state')
        ->where(function ($q) use ($slug, $normalizedSlug) {
            $q->where('slug', $slug)
              ->orWhere('slug', $normalizedSlug)
              ->orWhere('id', $slug)
              ->orWhere('tag', strtoupper($slug))
              ->orWhereRaw('LOWER(name) = ?', [strtolower(str_replace(['_', '-'], ' ', $slug))]);
        })
        ->first();

    if (!$state) {
        $state = Team::where('type', 'state')->where('is_active', true)->first();
    }

    $stateLogo = null;
    if ($state) {
        if ($state->logo_path) {
            $stateLogo = \Illuminate\Support\Facades\Storage::url($state->logo_path);
        } else {
            $slugCrest = $state->slug ? public_path("images/states/{$state->slug}_transparent.png") : null;
            $slugUnderscoreCrest = $state->slug ? public_path("images/states/" . str_replace('-', '_', $state->slug) . "_transparent.png") : null;
            if ($slugCrest && file_exists($slugCrest)) {
                $stateLogo = "/images/states/{$state->slug}_transparent.png";
            } elseif ($slugUnderscoreCrest && file_exists($slugUnderscoreCrest)) {
                $stateLogo = "/images/states/" . str_replace('-', '_', $state->slug) . "_transparent.png";
            }
        }
    }

    $stateData = $state ? [
        'id' => $state->id,
        'name' => $state->name,
        'slug' => $state->slug,
        'tag' => $state->tag,
        'type' => $state->type,
        'region' => $state->region,
        'game_title' => $state->game_title,
        'manager_name' => $state->manager_name,
        'contact_email' => $state->contact_email,
        'motto' => $state->motto,
        'roster_size' => $state->roster_size,
        'status' => $state->status ?: 'ACTIVE',
        'logo' => $stateLogo,
    ] : null;

    $otherStates = Team::where('type', 'state')
        ->where('is_active', true)
        ->when($state, function ($q) use ($state) {
            return $q->where('id', '!=', $state->id);
        })
        ->orderBy('name', 'asc')
        ->get()
        ->map(function ($s) {
            $crest = null;
            if ($s->logo_path) {
                $crest = \Illuminate\Support\Facades\Storage::url($s->logo_path);
            } else {
                $p1 = public_path("images/states/{$s->slug}_transparent.png");
                $p2 = public_path("images/states/" . str_replace('-', '_', $s->slug) . "_transparent.png");
                if (file_exists($p1)) {
                    $crest = "/images/states/{$s->slug}_transparent.png";
                } elseif (file_exists($p2)) {
                    $crest = "/images/states/" . str_replace('-', '_', $s->slug) . "_transparent.png";
                }
            }
            return [
                'id' => $s->id,
                'name' => $s->name,
                'slug' => $s->slug,
                'tag' => $s->tag,
                'region' => $s->region,
                'logo' => $crest,
            ];
        });

    return Inertia::render('StateDetails', [
        'state' => $stateData,
        'otherStates' => $otherStates,
        'stateSlug' => $slug,
    ]);
})->name('teams.state-show');

Route::get('/teams/{slug}', function ($slug) {
    $team = Team::where('slug', $slug)->first() ?: Team::where('id', $slug)->first();

    if ($team && $team->type === 'state') {
        return redirect()->route('teams.state-show', $team->slug ?: $team->id);
    }

    $teamData = $team ? [
        'id' => $team->id,
        'name' => $team->name,
        'slug' => $team->slug,
        'tag' => $team->tag,
        'type' => $team->type,
        'region' => $team->region,
        'game_title' => $team->game_title,
        'manager_name' => $team->manager_name,
        'contact_email' => $team->contact_email,
        'motto' => $team->motto,
        'roster_size' => $team->roster_size,
        'status' => $team->status ?: 'ACTIVE',
        'logo' => $team->logo_path ? \Illuminate\Support\Facades\Storage::url($team->logo_path) : null,
        'team_pic' => $team->team_pic_path ? \Illuminate\Support\Facades\Storage::url($team->team_pic_path) : null,
    ] : null;

    $otherTeams = Team::where('is_active', true)
        ->whereIn('type', ['national', 'pro'])
        ->when($team, function ($q) use ($team) {
            return $q->where('id', '!=', $team->id);
        })
        ->orderBy('name', 'asc')
        ->limit(6)
        ->get()
        ->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'tag' => $t->tag,
                'region' => $t->region,
                'game_title' => $t->game_title,
                'logo' => $t->logo_path ? \Illuminate\Support\Facades\Storage::url($t->logo_path) : null,
            ];
        });

    return Inertia::render('TeamDetails', [
        'team' => $teamData,
        'otherTeams' => $otherTeams,
        'slug' => $slug,
    ]);
})->name('teams.show');



Route::get('/get-involved', function () {
    return Inertia::render('Public/GetInvolved'); // screen
})->name('get-involved');

Route::get('/sertai-kami', function () {
    return redirect()->route('get-involved'); // redirect
})->name('sertai-kami');

Route::get('/join-tournament', function () {
    return Inertia::render('Public/JoinTournament'); // screen
})->name('join-tournament');

Route::get('/partnership', function () {
    return Inertia::render('Public/Partnership'); // screen
})->name('partnership');

Route::get('/host-tournament', function () {
    return Inertia::render('Public/HostTournament'); // screen
})->name('host-tournament');

Route::get('/register-team', [TeamRegistrationController::class, 'create'])->name('register-team'); // screen
Route::post('/register-team', [TeamRegistrationController::class, 'store'])->name('register-team.store'); // save
Route::get('/teams/register', fn() => redirect()->route('register-team')); // redirect

Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store'); // save

// --3. auth routes--
Route::middleware('auth')->group(function () { // check
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/switch-back', [UserManagementController::class, 'switchBack'])->name('admin.users.switch-back'); // redirect
    Route::get('/my-teams/{team}/manage', [\App\Http\Controllers\UserTeamController::class, 'edit'])->name('user.teams.manage'); // screen
    Route::post('/my-teams/{team}/manage', [\App\Http\Controllers\UserTeamController::class, 'update'])->name('user.teams.update'); // save
    Route::post('/my-teams/{team}/request-delete', [\App\Http\Controllers\UserTeamController::class, 'requestDelete'])->name('user.teams.request-delete'); // save
    Route::post('/my-teams/{team}/cancel-delete', [\App\Http\Controllers\UserTeamController::class, 'cancelDelete'])->name('user.teams.cancel-delete'); // save
});

Route::get('/member', fn() => redirect()->route('profile.edit'));
Route::get('/members', fn() => redirect()->route('profile.edit'));
Route::get('/passport', fn() => redirect()->route('profile.edit'));

// --4. member portal / generic dashboard redirection--
Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
    $user = $request->user(); // state
    if ($user) { // check
        if ($user->role === 'admin') { // check
            return redirect()->route('admin.dashboard'); // redirect
        }
        if ($user->role === 'editor') { // check
            return redirect()->route('editor.dashboard'); // redirect
        }
        if ($user->role === 'secretariat') { // check
            return redirect()->route('secretary.dashboard'); // redirect
        }
        if ($user->role === 'member') { // check
            return redirect()->route('profile.edit'); // redirect
        }
    }
    return redirect('/'); // redirect
})->name('dashboard');

// --5. admin portal--
Route::middleware(['auth', 'verified', 'role:admin,editor,secretariat'])->prefix('admin')->name('admin.')->group(function () { // check
    Route::get('/', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if ($user && $user->role === 'editor') return redirect()->route('editor.dashboard');
        if ($user && $user->role === 'secretariat') return redirect()->route('secretary.dashboard');
        return redirect()->route('admin.dashboard'); // redirect
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard'); // screen
        })->name('dashboard');
    });

    // Content management (Admin, Editor)
    Route::middleware('role:admin,editor')->group(function () {
        Route::get('/news', [AdminNewsController::class, 'index'])->name('news'); // screen
        Route::get('/news/create', [AdminNewsController::class, 'create'])->name('news.create'); // screen
        Route::post('/news', [AdminNewsController::class, 'store'])->name('news.store'); // save
        Route::get('/news/{news}/edit', [AdminNewsController::class, 'edit'])->name('news.edit'); // screen
        Route::put('/news/{news}', [AdminNewsController::class, 'update'])->name('news.update'); // save
        Route::post('/news/{news}', [AdminNewsController::class, 'update'])->name('news.update-post'); // save
        Route::delete('/news/{news}', [AdminNewsController::class, 'destroy'])->name('news.destroy'); // save
        Route::patch('/news/{news}/toggle-status', [AdminNewsController::class, 'toggleStatus'])->name('news.toggle-status'); // toggle
        Route::patch('/news/{news}/toggle-featured', [AdminNewsController::class, 'toggleFeatured'])->name('news.toggle-featured'); // toggle

        Route::get('/leagues', [AdminLeagueController::class, 'index'])->name('leagues'); // screen
        Route::get('/leagues/create', [AdminLeagueController::class, 'create'])->name('leagues.create'); // screen
        Route::post('/leagues', [AdminLeagueController::class, 'store'])->name('leagues.store'); // save
        Route::get('/leagues/{league}/edit', [AdminLeagueController::class, 'edit'])->name('leagues.edit'); // screen
        Route::put('/leagues/{league}', [AdminLeagueController::class, 'update'])->name('leagues.update'); // save
        Route::post('/leagues/{league}', [AdminLeagueController::class, 'update'])->name('leagues.update-post'); // save
        Route::delete('/leagues/{league}', [AdminLeagueController::class, 'destroy'])->name('leagues.destroy'); // save

        Route::get('/matches', [AdminMatchController::class, 'index'])->name('matches'); // screen
        Route::get('/matches/create', [AdminMatchController::class, 'create'])->name('matches.create'); // screen
        Route::post('/matches', [AdminMatchController::class, 'store'])->name('matches.store'); // save
        Route::get('/matches/{match}/edit', [AdminMatchController::class, 'edit'])->name('matches.edit'); // screen
        Route::put('/matches/{match}', [AdminMatchController::class, 'update'])->name('matches.update'); // save
        Route::delete('/matches/{match}', [AdminMatchController::class, 'destroy'])->name('matches.destroy'); // save

        Route::get('/teams', [AdminTeamController::class, 'index'])->name('teams'); // screen
        Route::get('/teams/create', [AdminTeamController::class, 'create'])->name('teams.create'); // screen
        Route::post('/teams', [AdminTeamController::class, 'store'])->name('teams.store'); // save
        Route::get('/teams/{team}/edit', [AdminTeamController::class, 'edit'])->name('teams.edit'); // screen
        Route::put('/teams/{team}', [AdminTeamController::class, 'update'])->name('teams.update'); // save
        Route::post('/teams/{team}', [AdminTeamController::class, 'update'])->name('teams.update-post'); // save
        Route::delete('/teams/{team}', [AdminTeamController::class, 'destroy'])->name('teams.destroy'); // save
        Route::post('/teams/{team}/approve', [AdminTeamController::class, 'approve'])->name('teams.approve'); // save
        Route::post('/teams/{team}/reject', [AdminTeamController::class, 'reject'])->name('teams.reject'); // save

        Route::get('/library', [AdminMediaController::class, 'index'])->name('library'); // screen
        Route::get('/library/upload', [AdminMediaController::class, 'create'])->name('library.create'); // screen
        Route::post('/library', [AdminMediaController::class, 'store'])->name('library.store'); // save
        Route::delete('/library/{medium}', [AdminMediaController::class, 'destroy'])->name('library.destroy'); // save
        Route::post('/library/bulk-delete', [AdminMediaController::class, 'bulkDestroy'])->name('library.bulk-destroy'); // save
        Route::get('/library/items', [AdminMediaController::class, 'getItems'])->name('library.items'); // screen
    });



    // Inquiries management (Secretariat, Admin)
    Route::middleware('role:secretariat,admin')->group(function () { // check
        Route::get('/inquiries', [InquiryManagementController::class, 'index'])->name('inquiries'); // screen
        Route::put('/inquiries/{inquiry}', [InquiryManagementController::class, 'update'])->name('inquiries.update'); // save
    });

    // Members management (Admin, Secretariat)
    Route::middleware('role:admin,secretariat')->group(function () { // check
        Route::get('/members', [MemberManagementController::class, 'index'])->name('members.index'); // screen
        Route::post('/members', [MemberManagementController::class, 'store'])->name('members.store'); // save
        Route::put('/members/{user}', [MemberManagementController::class, 'update'])->name('members.update'); // save
        Route::patch('/members/{user}', [MemberManagementController::class, 'update'])->name('members.patch'); // save
        Route::post('/members/{user}/toggle-status', [MemberManagementController::class, 'toggleStatus'])->name('members.toggle-status'); // toggle
        Route::delete('/members/{user}', [MemberManagementController::class, 'destroy'])->name('members.destroy'); // save
    });

    // Admin top-level routes
    Route::middleware('role:admin')->group(function () { // check
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index'); // screen

        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index'); // screen
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create'); // screen
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store'); // save
        Route::get('/users/{user}/edit', [UserManagementController::class, 'edit'])->name('users.edit'); // screen
        Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('users.update'); // save
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy'); // save
        Route::post('/users/{user}/switch-to', [UserManagementController::class, 'switchTo'])->name('users.switch-to'); // redirect

        Route::get('/settings', [SettingController::class, 'index'])->name('settings'); // screen
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update'); // save
        Route::post('/sliders', [SliderController::class, 'store'])->name('sliders.store'); // save
        Route::put('/sliders/{slider}', [SliderController::class, 'update'])->name('sliders.update'); // save
        Route::patch('/sliders/{slider}/status', [SliderController::class, 'updateStatus'])->name('sliders.status'); // save
        Route::delete('/sliders/{slider}', [SliderController::class, 'destroy'])->name('sliders.destroy'); // save
    });
});

// --6. editor portal--
Route::middleware(['auth', 'verified', 'role:editor,admin'])->prefix('editor')->name('editor.')->group(function () { // check
    Route::get('/', function () {
        return redirect()->route('editor.dashboard'); // redirect
    });

    Route::get('/dashboard', [EditorController::class, 'index'])->name('dashboard'); // screen
});

// --7. secretary portal--
Route::middleware(['auth', 'verified', 'role:secretariat,admin'])->prefix('secretary')->name('secretary.')->group(function () { // check
    Route::get('/', function () {
        return redirect()->route('secretary.dashboard'); // redirect
    });

    Route::get('/dashboard', [SecretaryController::class, 'index'])->name('dashboard'); // screen
});

// fallback for legacy secretariat urls
Route::middleware(['auth', 'verified', 'role:secretariat,admin'])->prefix('secretariat')->group(function () { // check
    Route::get('/{any?}', function () {
        return redirect()->route('secretary.dashboard'); // redirect
    })->where('any', '.*');
});

require __DIR__.'/auth.php';

