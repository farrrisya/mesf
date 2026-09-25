<?php

// --1. imports--
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

// --2. main controller--
class LeagueController extends Controller
{
    public function index()
    {
        $leagues = League::orderBy('created_at', 'desc')->get()->map(function ($league) { // state
            return [ // convert
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
                'date_range' => $league->start_date ? $league->start_date->format('d M Y') . ($league->end_date ? ' - ' . $league->end_date->format('d M Y') : '') : 'TBA',
                'registration_deadline' => $league->registration_deadline ? $league->registration_deadline->format('Y-m-d') : null,
                'entry_fee' => $league->entry_fee,
                'display_options' => $league->display_options,
                'slots' => $league->slots,
                'registration_status' => $league->registration_status ?: 'REGISTRATION OPEN',
                'banner_url' => $league->banner_path ? Storage::url($league->banner_path) : null,
                'description' => $league->description,
                'location' => $league->location ?: 'Malaysia',
                'is_active' => (bool)$league->is_active,
                'created_at' => $league->created_at ? $league->created_at->format('d M Y') : null,
            ];
        });

        return Inertia::render('Admin/Leagues', [ // screen
            'leagues' => $leagues
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Leagues/Create'); // screen
    }

    public function store(Request $request)
    {
        $request->validate([ // validate
            'name' => 'required|string|max:255',
            'game_title' => 'required|string|max:255',
            'season' => 'nullable|string|max:255',
            'tier' => 'nullable|string|max:255',
            'format' => 'nullable|string|max:255',
            'prize_pool' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'registration_deadline' => 'nullable|date',
            'entry_fee' => 'nullable|string|max:255',
            'display_options' => 'nullable|array',
            'display_options.*' => 'string',
            'slots' => 'nullable|string|max:255',
            'registration_status' => 'nullable|string|max:255',
            'banner' => 'nullable|image|max:10240', // 10MB
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
        ]);

        $baseSlug = Str::slug($request->name); // convert
        $slug = $baseSlug; // state
        $count = 1; // state
        while (League::where('slug', $slug)->exists()) { // check
            $slug = "{$baseSlug}-{$count}"; // state
            $count++; // state
        }

        $bannerPath = null; // state
        if ($request->hasFile('banner')) { // check
            $bannerPath = $request->file('banner')->store('leagues', 'public'); // save
        }

        League::create([ // save
            'name' => $request->name,
            'slug' => $slug,
            'season' => $request->season,
            'game_title' => $request->game_title,
            'tier' => $request->tier,
            'format' => $request->format,
            'prize_pool' => $request->prize_pool,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'registration_deadline' => $request->registration_deadline,
            'entry_fee' => $request->entry_fee,
            'display_options' => $request->display_options,
            'slots' => $request->slots,
            'registration_status' => $request->registration_status ?: 'REGISTRATION OPEN',
            'banner_path' => $bannerPath,
            'description' => $request->description,
            'location' => $request->location ?: 'Malaysia',
            'is_active' => true,
        ]);

        return redirect()->route('admin.leagues')->with('success', 'League created successfully.'); // redirect
    }

    public function destroy(League $league)
    {
        if ($league->banner_path && Storage::disk('public')->exists($league->banner_path)) { // check
            Storage::disk('public')->delete($league->banner_path); // save
        }

        $league->delete(); // save

        return back()->with('success', 'League deleted successfully.'); // redirect
    }
}
