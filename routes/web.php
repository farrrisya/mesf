<?php

// --1. imports--
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\AlbumController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\SecretaryController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\Admin\InquiryManagementController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\DocumentController as AdminDocumentController;
use App\Http\Controllers\Admin\LeagueController as AdminLeagueController;
use App\Http\Controllers\Admin\TeamController as AdminTeamController;
use App\Http\Controllers\Admin\MatchController as AdminMatchController;
use App\Http\Controllers\PublicNewsController;
use App\Models\Gallery;
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
            ->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
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
            'timestamp' => $article->published_at ? $article->published_at->timestamp : $article->created_at->timestamp,
            'location' => $article->location ?: 'OFFICIAL',
            'is_empty' => false, // check
        ] : null;

        $latestByCategory[$cat] = $data; // save

        if ($data) { // check
            $filledUpdates[] = $data; // save
            $usedCategories[] = $cat; // save
        }
    }

    // sort filled articles by latest published/created date descending
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
        ->orderBy('published_at', 'desc')
        ->orderBy('created_at', 'desc')
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
                'timestamp' => $article->published_at ? $article->published_at->timestamp : $article->created_at->timestamp,
                'location' => $article->location ?: 'OFFICIAL',
                'is_featured' => (bool)$article->is_featured,
                'is_empty' => false, // check
            ];
        });

    $featuredArticle = \App\Models\News::published() // check
        ->where('is_featured', true)
        ->orderBy('published_at', 'desc')
        ->first();

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
        ->orderBy('name', 'asc')
        ->limit(16)
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
    $first = \App\Models\News::published()->latest('published_at')->first(); // state
    return $first ? redirect()->route('news.show', $first->slug) : redirect()->route('news'); // redirect
})->name('news.article');
Route::get('/news/{slug}', [PublicNewsController::class, 'show'])->name('news.show'); // screen

Route::get('/leagues', function () {
    $leagues = League::where('is_active', true) // state
        ->orderBy('start_date', 'desc')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($l) {
            return [ // convert
                'id' => $l->id,
                'title' => $l->name,
                'slug' => $l->slug,
                'game' => $l->game_title,
                'status' => $l->registration_status ?: 'UPCOMING',
                'date' => $l->start_date ? $l->start_date->format('d M Y') . ($l->end_date ? ' - ' . $l->end_date->format('d M Y') : '') : 'TBA',
                'location' => $l->location ?: 'Malaysia',
                'description' => $l->description ?: 'Official sanctioned esports tournament circuit organized by Malaysian Electronic Sports Federation.',
                'banner' => $l->banner_path ? \Illuminate\Support\Facades\Storage::url($l->banner_path) : null,
                'tier' => $l->tier,
                'prize_pool' => $l->prize_pool,
            ];
        });

    return Inertia::render('Leagues', [ // screen
        'leagues' => $leagues
    ]);
})->name('leagues');

Route::get('/leagues/details', function () {
    return Inertia::render('LeagueDetails');
})->name('leagues.details');

Route::get('/leagues/{slug}', function ($slug) {
    return Inertia::render('LeagueDetails', [
        'slug' => $slug
    ]);
})->name('leagues.show');

Route::get('/matches', function () {
    $rawMatches = EsportMatch::where('is_active', true) // state
        ->orderBy('scheduled_date', 'asc')
        ->orderBy('scheduled_time', 'asc')
        ->get();

    $groups = $rawMatches->groupBy(function ($m) { // loop
        return $m->scheduled_date ? $m->scheduled_date->format('d M Y') : 'TBA';
    })->map(function ($items, $date) {
        return [ // convert
            'date' => $date,
            'matches' => $items->map(function ($m) {
                return [
                    'id' => $m->id,
                    'tournament' => $m->tournament_name,
                    'stage' => $m->round ?: 'Match Fixture',
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
                    ],
                    'teamB' => [
                        'name' => $m->team_b_name,
                        'tag' => $m->team_b_tag ?: strtoupper(substr($m->team_b_name, 0, 3)),
                        'score' => $m->team_b_score,
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
    $match = EsportMatch::where('is_active', true)->orderBy('scheduled_date', 'asc')->first(); // state

    $teamA = $match ? Team::where('name', $match->team_a_name)->orWhere('tag', $match->team_a_tag)->first() : null; // check
    $teamB = $match ? Team::where('name', $match->team_b_name)->orWhere('tag', $match->team_b_tag)->first() : null; // check

    $matchData = $match ? [ // convert
        'id' => $match->id,
        'tournament_name' => $match->tournament_name,
        'game_title' => $match->game_title,
        'round' => $match->round ?: 'Match Fixture',
        'format' => $match->format ?: 'BO3',
        'scheduled_date' => $match->scheduled_date ? $match->scheduled_date->format('Y-m-d') : null,
        'formatted_date' => $match->scheduled_date ? $match->scheduled_date->format('l, d F Y') : 'TBA',
        'scheduled_time' => $match->scheduled_time ?: 'TBA',
        'venue' => $match->venue ?: 'Online Arena',
        'stream_url' => $match->stream_url,
        'status' => $match->status ?: 'UPCOMING',
        'team_a' => [
            'name' => $match->team_a_name,
            'tag' => $match->team_a_tag ?: strtoupper(substr($match->team_a_name, 0, 3)),
            'score' => $match->team_a_score,
            'logo' => $teamA && $teamA->logo_path ? \Illuminate\Support\Facades\Storage::url($teamA->logo_path) : null,
            'region' => $teamA ? $teamA->region : 'National / All Malaysia',
            'motto' => $teamA ? $teamA->motto : null,
            'manager' => $teamA ? $teamA->manager_name : null,
            'slug' => $teamA ? $teamA->slug : null,
        ],
        'team_b' => [
            'name' => $match->team_b_name,
            'tag' => $match->team_b_tag ?: strtoupper(substr($match->team_b_name, 0, 3)),
            'score' => $match->team_b_score,
            'logo' => $teamB && $teamB->logo_path ? \Illuminate\Support\Facades\Storage::url($teamB->logo_path) : null,
            'region' => $teamB ? $teamB->region : 'Malaysia',
            'motto' => $teamB ? $teamB->motto : null,
            'manager' => $teamB ? $teamB->manager_name : null,
            'slug' => $teamB ? $teamB->slug : null,
        ],
    ] : null;

    $otherMatches = EsportMatch::where('is_active', true) // state
        ->when($match, function ($query) use ($match) {
            return $query->where('id', '!=', $match->id);
        })
        ->orderBy('scheduled_date', 'asc')
        ->limit(4)
        ->get()
        ->map(function ($om) {
            return [ // convert
                'id' => $om->id,
                'tournament_name' => $om->tournament_name,
                'game_title' => $om->game_title,
                'round' => $om->round ?: 'Match Fixture',
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
        $match = EsportMatch::where('is_active', true)->orderBy('scheduled_date', 'asc')->first(); // state
    }

    $teamA = $match ? Team::where('name', $match->team_a_name)->orWhere('tag', $match->team_a_tag)->first() : null; // check
    $teamB = $match ? Team::where('name', $match->team_b_name)->orWhere('tag', $match->team_b_tag)->first() : null; // check

    $matchData = $match ? [ // convert
        'id' => $match->id,
        'tournament_name' => $match->tournament_name,
        'game_title' => $match->game_title,
        'round' => $match->round ?: 'Match Fixture',
        'format' => $match->format ?: 'BO3',
        'scheduled_date' => $match->scheduled_date ? $match->scheduled_date->format('Y-m-d') : null,
        'formatted_date' => $match->scheduled_date ? $match->scheduled_date->format('l, d F Y') : 'TBA',
        'scheduled_time' => $match->scheduled_time ?: 'TBA',
        'venue' => $match->venue ?: 'Online Arena',
        'stream_url' => $match->stream_url,
        'status' => $match->status ?: 'UPCOMING',
        'team_a' => [
            'name' => $match->team_a_name,
            'tag' => $match->team_a_tag ?: strtoupper(substr($match->team_a_name, 0, 3)),
            'score' => $match->team_a_score,
            'logo' => $teamA && $teamA->logo_path ? \Illuminate\Support\Facades\Storage::url($teamA->logo_path) : null,
            'region' => $teamA ? $teamA->region : 'National / All Malaysia',
            'motto' => $teamA ? $teamA->motto : null,
            'manager' => $teamA ? $teamA->manager_name : null,
            'slug' => $teamA ? $teamA->slug : null,
        ],
        'team_b' => [
            'name' => $match->team_b_name,
            'tag' => $match->team_b_tag ?: strtoupper(substr($match->team_b_name, 0, 3)),
            'score' => $match->team_b_score,
            'logo' => $teamB && $teamB->logo_path ? \Illuminate\Support\Facades\Storage::url($teamB->logo_path) : null,
            'region' => $teamB ? $teamB->region : 'Malaysia',
            'motto' => $teamB ? $teamB->motto : null,
            'manager' => $teamB ? $teamB->manager_name : null,
            'slug' => $teamB ? $teamB->slug : null,
        ],
    ] : null;

    $otherMatches = EsportMatch::where('is_active', true) // state
        ->when($match, function ($query) use ($match) {
            return $query->where('id', '!=', $match->id);
        })
        ->orderBy('scheduled_date', 'asc')
        ->limit(4)
        ->get()
        ->map(function ($om) {
            return [ // convert
                'id' => $om->id,
                'tournament_name' => $om->tournament_name,
                'game_title' => $om->game_title,
                'round' => $om->round ?: 'Match Fixture',
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

    $teamData = $team ? [
        'id' => $team->id,
        'name' => $team->name,
        'slug' => $team->slug,
        'tag' => $team->tag ?: strtoupper(substr($team->name, 0, 3)),
        'type' => $team->type,
        'region' => $team->region ?: 'National / All Malaysia',
        'country' => 'Malaysia',
        'flag' => '🇲🇾',
        'status' => $team->status ?: 'Active Squad',
        'created' => $team->created_at ? $team->created_at->format('Y') : null,
        'founder' => 'Official Management',
        'manager' => $team->manager_name,
        'contact_email' => $team->contact_email,
        'motto' => $team->motto,
        'primaryGame' => $team->game_title ?: 'Competitive Esports',
        'logo' => $team->logo_path ? \Illuminate\Support\Facades\Storage::url($team->logo_path) : null,
        'roster_size' => $team->roster_size ?: 5,
        'stats' => [
            'circuit' => $team->game_title ? "Official {$team->game_title} Circuit" : 'Sanctioned Circuit',
            'placement' => 'Sanctioned',
            'tier' => strtoupper($team->type) . ' TIER',
        ],
    ] : null;

    $otherTeams = Team::where('is_active', true)
        ->when($team, function ($q) use ($team) {
            return $q->where('id', '!=', $team->id);
        })
        ->limit(4)
        ->get()
        ->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'tag' => $t->tag ?: strtoupper(substr($t->name, 0, 3)),
            ];
        });

    return Inertia::render('TeamDetails', [
        'team' => $teamData,
        'otherTeams' => $otherTeams,
        'slug' => $slug,
    ]);
})->name('teams.details');

Route::get('/teams/state-details', function () {
    return Inertia::render('StateDetails');
})->name('teams.state-details');

Route::get('/teams/state/{slug}', function ($slug) {
    return Inertia::render('StateDetails', [
        'stateSlug' => $slug
    ]);
})->name('teams.state-show');

Route::get('/teams/{slug}', function ($slug) {
    $team = Team::where('slug', $slug)->first() ?: Team::where('id', $slug)->first();

    $teamData = $team ? [
        'id' => $team->id,
        'name' => $team->name,
        'slug' => $team->slug,
        'tag' => $team->tag ?: strtoupper(substr($team->name, 0, 3)),
        'type' => $team->type,
        'region' => $team->region ?: 'National / All Malaysia',
        'country' => 'Malaysia',
        'flag' => '🇲🇾',
        'status' => $team->status ?: 'Active Squad',
        'created' => $team->created_at ? $team->created_at->format('Y') : null,
        'founder' => 'Official Management',
        'manager' => $team->manager_name,
        'contact_email' => $team->contact_email,
        'motto' => $team->motto,
        'primaryGame' => $team->game_title ?: 'Competitive Esports',
        'logo' => $team->logo_path ? \Illuminate\Support\Facades\Storage::url($team->logo_path) : null,
        'roster_size' => $team->roster_size ?: 5,
        'stats' => [
            'circuit' => $team->game_title ? "Official {$team->game_title} Circuit" : 'Sanctioned Circuit',
            'placement' => 'Sanctioned',
            'tier' => strtoupper($team->type) . ' TIER',
        ],
    ] : null;

    $otherTeams = Team::where('is_active', true)
        ->when($team, function ($q) use ($team) {
            return $q->where('id', '!=', $team->id);
        })
        ->limit(4)
        ->get()
        ->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'tag' => $t->tag ?: strtoupper(substr($t->name, 0, 3)),
            ];
        });

    return Inertia::render('TeamDetails', [
        'team' => $teamData,
        'otherTeams' => $otherTeams,
        'slug' => $slug,
    ]);
})->name('teams.show');

Route::get('/dokumen', function () {
    return redirect()->route('home'); // redirect
})->name('dokumen');

Route::get('/profil', function () {
    return Inertia::render('Public/Profil');
})->name('profil');

Route::get('/galeri', function () {
    return Inertia::render('Public/Galeri', [ // screen
        'galleries' => \App\Models\Gallery::whereNull('album_id')->orderBy('created_at', 'desc')->get(), // state
        'albums' => \App\Models\Album::with(['latestGallery', 'galleries'])->withCount('galleries')->orderBy('created_at', 'desc')->get(), // state
        'activeType' => request('type', 'gambar'), // state
    ]);
})->name('galeri');

Route::get('/galeri/album/{album}', function (\App\Models\Album $album) {
    $album->load(['galleries' => function($query) {
        $query->orderBy('created_at', 'desc');
    }]);

    $otherAlbums = \App\Models\Album::where('id', '!=', $album->id)
        ->with('latestGallery')
        ->orderBy('created_at', 'desc')
        ->limit(3)
        ->get();

    return Inertia::render('Public/AlbumShow', [ // screen
        'album' => $album,
        'otherAlbums' => $otherAlbums
    ]);
})->name('galeri.album');

Route::get('/galeri/{gallery}', function (\App\Models\Gallery $gallery) {
    $otherGalleries = \App\Models\Gallery::where('id', '!=', $gallery->id)
        ->whereNull('album_id')
        ->orderBy('created_at', 'desc')
        ->limit(3)
        ->get();

    return Inertia::render('Public/GalleryShow', [
        'galleryItem' => $gallery,
        'otherGalleries' => $otherGalleries
    ]);
})->name('galeri.show');

Route::get('/hubungi-kami', function () {
    return Inertia::render('Public/HubungiKami', [ // screen
        'settings' => \App\Models\Setting::all()->pluck('value', 'key') // state
    ]);
})->name('hubungi-kami');

Route::get('/keanggotaan', function () {
    return Inertia::render('Public/Keanggotaan');
})->name('keanggotaan');

Route::get('/penerbitan', function () {
    return Inertia::render('Public/Penerbitan', [ // screen
        'buletinKontemporari' => \App\Models\Penerbitan::where('is_active', true)->where('category', 'buletin')->where('sub_category', 'kontemporari')->orderBy('created_at', 'desc')->get(), // state
        'laporanTahunan' => \App\Models\Penerbitan::where('is_active', true)->where('category', 'laporan')->orderBy('created_at', 'desc')->get() // state
    ]);
})->name('public.penerbitan');

Route::get('/hebahan', [NoticeController::class, 'publicIndex'])->name('public.notices'); // redirect
Route::get('/notices/{notice}', [NoticeController::class, 'show'])->name('notices.show'); // redirect
Route::get('/penerbitan/{penerbitan}', function (\App\Models\Penerbitan $penerbitan) {
    return Inertia::render('Public/PenerbitanShow', [
        'penerbitan' => $penerbitan
    ]);
})->name('penerbitan.show');

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

Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store'); // save

// --3. auth routes--
Route::middleware('auth')->group(function () { // check
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/switch-back', [UserManagementController::class, 'switchBack'])->name('admin.users.switch-back'); // redirect
});

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
        Route::delete('/matches/{match}', [AdminMatchController::class, 'destroy'])->name('matches.destroy'); // save

        Route::get('/teams', [AdminTeamController::class, 'index'])->name('teams'); // screen
        Route::get('/teams/create', [AdminTeamController::class, 'create'])->name('teams.create'); // screen
        Route::post('/teams', [AdminTeamController::class, 'store'])->name('teams.store'); // save
        Route::get('/teams/{team}/edit', [AdminTeamController::class, 'edit'])->name('teams.edit'); // screen
        Route::put('/teams/{team}', [AdminTeamController::class, 'update'])->name('teams.update'); // save
        Route::post('/teams/{team}', [AdminTeamController::class, 'update'])->name('teams.update-post'); // save
        Route::delete('/teams/{team}', [AdminTeamController::class, 'destroy'])->name('teams.destroy'); // save

        Route::get('/library', function () {
            return Inertia::render('Admin/Library'); // screen
        })->name('library');
    });

    // Documents management (Admin only)
    Route::middleware('role:admin')->group(function () { // check
        Route::get('/documents', [AdminDocumentController::class, 'index'])->name('documents'); // screen
        Route::get('/documents/create', [AdminDocumentController::class, 'create'])->name('documents.create'); // screen
        Route::post('/documents', [AdminDocumentController::class, 'store'])->name('documents.store'); // save
        Route::delete('/documents/{document}', [AdminDocumentController::class, 'destroy'])->name('documents.destroy'); // save
    });

    // Inquiries management (Secretariat, Admin)
    Route::middleware('role:secretariat,admin')->group(function () { // check
        Route::get('/inquiries', [InquiryManagementController::class, 'index'])->name('inquiries'); // screen
        Route::put('/inquiries/{inquiry}', [InquiryManagementController::class, 'update'])->name('inquiries.update'); // save
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

