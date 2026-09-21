<?php

// --1. imports--
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\AlbumController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\SecretariatController;
use App\Models\Gallery;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --2. public routes--
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/news', function () {
    return Inertia::render('News');
})->name('news');

Route::get('/news/article', function () {
    return Inertia::render('NewsArticle');
})->name('news.article');

Route::get('/leagues', function () {
    return Inertia::render('Leagues');
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
    return Inertia::render('Matches');
})->name('matches');

Route::get('/matches/details', function () {
    return Inertia::render('MatchDetails');
})->name('matches.details');

Route::get('/matches/{id}', function ($id) {
    return Inertia::render('MatchDetails', [
        'id' => $id
    ]);
})->name('matches.show');

Route::get('/teams', function () {
    return Inertia::render('Teams');
})->name('teams');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/teams/details', function () {
    return Inertia::render('TeamDetails');
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
    return Inertia::render('TeamDetails', [
        'slug' => $slug
    ]);
})->name('teams.show');

Route::get('/dokumen', function () {
    return Inertia::render('Public/Dokumen', [ // screen
        'documents' => \App\Models\Document::where('is_active', true)->orderBy('category', 'asc')->orderBy('created_at', 'asc')->get() // state
    ]);
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

Route::get('/faq', function () {
    return Inertia::render('Public/FAQ', [ // screen
        'faqs' => \App\Models\Faq::where('is_active', true)->orderBy('sort_order', 'asc')->orderBy('created_at', 'asc')->get() // state
    ]);
})->name('faq');

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

// --3. auth routes--
Route::middleware('auth')->group(function () { // check
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --4. member portal / generic dashboard redirection--
Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
    $user = $request->user(); // state
    if ($user) { // check
        if ($user->role === 'super_admin' || $user->role === 'admin') { // check
            return redirect()->route('admin.dashboard'); // redirect
        }
        if ($user->role === 'editor') { // check
            return redirect()->route('editor.dashboard'); // redirect
        }
        if ($user->role === 'secretariat') { // check
            return redirect()->route('secretariat.dashboard'); // redirect
        }
    }
    return redirect('/'); // redirect
})->name('dashboard');

// --5. admin portal--
Route::middleware(['auth', 'verified', 'role:admin,super_admin,editor,secretariat'])->prefix('admin')->name('admin.')->group(function () { // check
    Route::get('/', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if ($user && $user->role === 'editor') return redirect()->route('editor.dashboard');
        if ($user && $user->role === 'secretariat') return redirect()->route('secretariat.dashboard');
        return redirect()->route('admin.dashboard'); // redirect
    });

    Route::middleware('role:admin,super_admin')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard'); // screen
        })->name('dashboard');
    });

    // Content management (Admin, Super Admin, Editor)
    Route::middleware('role:admin,super_admin,editor')->group(function () {
        Route::get('/news', function () {
            return Inertia::render('Admin/News'); // screen
        })->name('news');

        Route::get('/leagues', function () {
            return Inertia::render('Admin/Leagues'); // screen
        })->name('leagues');

        Route::get('/matches', function () {
            return Inertia::render('Admin/Matches'); // screen
        })->name('matches');

        Route::get('/teams', function () {
            return Inertia::render('Admin/Teams'); // screen
        })->name('teams');

        Route::get('/gallery', function () {
            return Inertia::render('Admin/Gallery'); // screen
        })->name('gallery');
    });

    // Admin & Super Admin only routes
    Route::middleware('role:admin,super_admin')->group(function () { // check
        Route::get('/documents', function () {
            return Inertia::render('Admin/Documents'); // screen
        })->name('documents');

        Route::get('/faq', function () {
            return Inertia::render('Admin/FAQ'); // screen
        })->name('faq');
    });

    // Inquiries management (Secretariat, Admin, Super Admin)
    Route::middleware('role:secretariat,admin,super_admin')->group(function () { // check
        Route::get('/inquiries', function () {
            return Inertia::render('Admin/Inquiries'); // screen
        })->name('inquiries');
    });

    // Super Admin only routes
    Route::middleware('role:super_admin')->group(function () { // check
        Route::get('/settings', [SettingController::class, 'index'])->name('settings'); // screen
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update'); // save
        Route::post('/sliders', [SliderController::class, 'store'])->name('sliders.store'); // save
        Route::put('/sliders/{slider}', [SliderController::class, 'update'])->name('sliders.update'); // save
        Route::patch('/sliders/{slider}/status', [SliderController::class, 'updateStatus'])->name('sliders.status'); // save
        Route::delete('/sliders/{slider}', [SliderController::class, 'destroy'])->name('sliders.destroy'); // save
    });
});

// --6. editor portal--
Route::middleware(['auth', 'verified', 'role:editor,super_admin'])->prefix('editor')->name('editor.')->group(function () { // check
    Route::get('/', function () {
        return redirect()->route('editor.dashboard'); // redirect
    });

    Route::get('/dashboard', [EditorController::class, 'index'])->name('dashboard'); // screen
});

// --7. secretariat portal--
Route::middleware(['auth', 'verified', 'role:secretariat,super_admin'])->prefix('secretariat')->name('secretariat.')->group(function () { // check
    Route::get('/', function () {
        return redirect()->route('secretariat.dashboard'); // redirect
    });

    Route::get('/dashboard', [SecretariatController::class, 'index'])->name('dashboard'); // screen
});

require __DIR__.'/auth.php';
