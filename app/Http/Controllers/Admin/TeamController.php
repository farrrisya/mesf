<?php

// --1. imports--
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

// --2. main controller--
class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::orderBy('created_at', 'desc')->get()->map(function ($team) { // state
            return [ // convert
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
                'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                'is_active' => (bool)$team->is_active,
                'created_at' => $team->created_at ? $team->created_at->format('d M Y') : null,
            ];
        });

        return Inertia::render('Admin/Teams', [ // screen
            'teams' => $teams
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Teams/Create'); // screen
    }

    public function store(Request $request)
    {
        $request->validate([ // validate
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:national,state,pro',
            'tag' => 'nullable|string|max:20',
            'region' => 'nullable|string|max:255',
            'game_title' => 'nullable|string|max:255',
            'manager_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'motto' => 'nullable|string|max:255',
            'roster_size' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
            'logo' => 'nullable|image|max:10240', // 10MB
        ]);

        $baseSlug = Str::slug($request->name); // convert
        $slug = $baseSlug; // state
        $count = 1; // state
        while (Team::where('slug', $slug)->exists()) { // check
            $slug = "{$baseSlug}-{$count}"; // state
            $count++; // state
        }

        $logoPath = null; // state
        if ($request->hasFile('logo')) { // check
            $logoPath = $request->file('logo')->store('teams', 'public'); // save
        }

        Team::create([ // save
            'name' => $request->name,
            'slug' => $slug,
            'tag' => $request->tag,
            'type' => $request->type,
            'region' => $request->region,
            'game_title' => $request->game_title,
            'manager_name' => $request->manager_name,
            'contact_email' => $request->contact_email,
            'motto' => $request->motto,
            'roster_size' => $request->roster_size ?: 5,
            'status' => $request->status ?: 'ACTIVE',
            'logo_path' => $logoPath,
            'is_active' => true,
        ]);

        return redirect()->route('admin.teams')->with('success', 'Team registered successfully.'); // redirect
    }

    public function edit(Team $team)
    {
        return Inertia::render('Admin/Teams/Edit', [ // screen
            'team' => [ // convert
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
                'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                'is_active' => (bool)$team->is_active,
            ]
        ]);
    }

    public function update(Request $request, Team $team)
    {
        $request->validate([ // validate
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:national,state,pro',
            'tag' => 'nullable|string|max:20',
            'region' => 'nullable|string|max:255',
            'game_title' => 'nullable|string|max:255',
            'manager_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'motto' => 'nullable|string|max:255',
            'roster_size' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
            'logo' => 'nullable|image|max:10240', // 10MB
        ]);

        $logoPath = $team->logo_path; // state
        if ($request->boolean('remove_logo') || $request->input('remove_logo') === 'true' || $request->input('remove_logo') === '1') { // check
            if ($logoPath && Storage::disk('public')->exists($logoPath)) { // check
                Storage::disk('public')->delete($logoPath); // save
            }
            $logoPath = null; // state
        }

        if ($request->hasFile('logo')) { // check
            if ($logoPath && Storage::disk('public')->exists($logoPath)) { // check
                Storage::disk('public')->delete($logoPath); // save
            }
            $logoPath = $request->file('logo')->store('teams', 'public'); // save
        }

        $team->update([ // save
            'name' => $request->name,
            'tag' => $request->tag,
            'type' => $request->type,
            'region' => $request->region,
            'game_title' => $request->game_title,
            'manager_name' => $request->manager_name,
            'contact_email' => $request->contact_email,
            'motto' => $request->motto,
            'roster_size' => $request->roster_size ?: 5,
            'status' => $request->status ?: 'ACTIVE',
            'logo_path' => $logoPath,
        ]);

        return redirect()->route('admin.teams')->with('success', 'Team updated successfully.'); // redirect
    }

    public function destroy(Team $team)
    {
        if ($team->logo_path && Storage::disk('public')->exists($team->logo_path)) { // check
            Storage::disk('public')->delete($team->logo_path); // save
        }

        $team->delete(); // save

        return back()->with('success', 'Team deleted successfully.'); // redirect
    }
}
