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
                'team_pic_url' => $team->team_pic_path ? Storage::url($team->team_pic_path) : null,
                'image_display_mode' => $team->image_display_mode ?: 'both',
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
            'game_title' => 'nullable|string|max:500',
            'games' => 'nullable|array',
            'manager_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'website_url' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',
            'motto' => 'nullable|string|max:255',
            'roster_size' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
            'logo' => 'nullable|image|max:10240', // 10MB
            'team_pic' => 'nullable|image|max:10240', // 10MB
            'library_logo_path' => 'nullable|string',
            'library_team_pic_path' => 'nullable|string',
            'image_display_mode' => 'nullable|string|in:logo,pic,team_pic,both',
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
        } elseif ($request->filled('library_logo_path')) { // check
            $logoPath = $request->input('library_logo_path'); // state
        }

        $teamPicPath = null; // state
        if ($request->hasFile('team_pic')) { // check
            $teamPicPath = $request->file('team_pic')->store('teams/photos', 'public'); // save
        } elseif ($request->filled('library_team_pic_path')) { // check
            $teamPicPath = $request->input('library_team_pic_path'); // state
        }

        $gameTitle = $request->game_title; // state
        if ($request->has('games') && is_array($request->games)) { // check
            $gameTitle = implode(', ', array_filter($request->games)); // convert
        }

        Team::create([ // save
            'name' => $request->name,
            'slug' => $slug,
            'tag' => $request->tag,
            'type' => $request->type,
            'region' => $request->region,
            'game_title' => $gameTitle,
            'manager_name' => $request->manager_name,
            'contact_email' => $request->contact_email,
            'website_url' => $request->website_url,
            'social_links' => $request->social_links,
            'motto' => $request->motto,
            'roster_size' => $request->roster_size ?: 5,
            'status' => $request->status ?: 'ACTIVE',
            'logo_path' => $logoPath,
            'team_pic_path' => $teamPicPath,
            'image_display_mode' => $request->image_display_mode ?: 'both',
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
                'website_url' => $team->website_url,
                'social_links' => $team->social_links ?: [],
                'motto' => $team->motto,
                'roster_size' => $team->roster_size,
                'status' => $team->status ?: 'ACTIVE',
                'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                'team_pic_url' => $team->team_pic_path ? Storage::url($team->team_pic_path) : null,
                'image_display_mode' => $team->image_display_mode ?: 'both',
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
            'game_title' => 'nullable|string|max:500',
            'games' => 'nullable|array',
            'manager_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'website_url' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',
            'motto' => 'nullable|string|max:255',
            'roster_size' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
            'logo' => 'nullable|image|max:10240', // 10MB
            'team_pic' => 'nullable|image|max:10240', // 10MB
            'library_logo_path' => 'nullable|string',
            'library_team_pic_path' => 'nullable|string',
            'image_display_mode' => 'nullable|string|in:logo,pic,team_pic,both',
        ]);

        $logoPath = $team->logo_path; // state
        if ($request->boolean('remove_logo') || $request->input('remove_logo') === 'true' || $request->input('remove_logo') === '1') { // check
            if ($logoPath && !Str::startsWith($logoPath, 'media/') && Storage::disk('public')->exists($logoPath)) { // check
                Storage::disk('public')->delete($logoPath); // save
            }
            $logoPath = null; // state
        }

        if ($request->hasFile('logo')) { // check
            if ($logoPath && !Str::startsWith($logoPath, 'media/') && Storage::disk('public')->exists($logoPath)) { // check
                Storage::disk('public')->delete($logoPath); // save
            }
            $logoPath = $request->file('logo')->store('teams', 'public'); // save
        } elseif ($request->filled('library_logo_path')) { // check
            $logoPath = $request->input('library_logo_path'); // state
        }

        $teamPicPath = $team->team_pic_path; // state
        if ($request->boolean('remove_team_pic') || $request->input('remove_team_pic') === 'true' || $request->input('remove_team_pic') === '1') { // check
            if ($teamPicPath && !Str::startsWith($teamPicPath, 'media/') && Storage::disk('public')->exists($teamPicPath)) { // check
                Storage::disk('public')->delete($teamPicPath); // save
            }
            $teamPicPath = null; // state
        }

        if ($request->hasFile('team_pic')) { // check
            if ($teamPicPath && !Str::startsWith($teamPicPath, 'media/') && Storage::disk('public')->exists($teamPicPath)) { // check
                Storage::disk('public')->delete($teamPicPath); // save
            }
            $teamPicPath = $request->file('team_pic')->store('teams/photos', 'public'); // save
        } elseif ($request->filled('library_team_pic_path')) { // check
            $teamPicPath = $request->input('library_team_pic_path'); // state
        }

        $gameTitle = $request->game_title; // state
        if ($request->has('games') && is_array($request->games)) { // check
            $gameTitle = implode(', ', array_filter($request->games)); // convert
        }

        $team->update([ // save
            'name' => $request->name,
            'tag' => $request->tag,
            'type' => $request->type,
            'region' => $request->region,
            'game_title' => $gameTitle,
            'manager_name' => $request->manager_name,
            'contact_email' => $request->contact_email,
            'website_url' => $request->website_url,
            'social_links' => $request->social_links,
            'motto' => $request->motto,
            'roster_size' => $request->roster_size ?: 5,
            'status' => $request->status ?: 'ACTIVE',
            'logo_path' => $logoPath,
            'team_pic_path' => $teamPicPath,
            'image_display_mode' => $request->image_display_mode ?: 'both',
        ]);

        return redirect()->route('admin.teams')->with('success', 'Team updated successfully.'); // redirect
    }

    public function destroy(Team $team)
    {
        if ($team->logo_path && Storage::disk('public')->exists($team->logo_path)) { // check
            Storage::disk('public')->delete($team->logo_path); // save
        }
        if ($team->team_pic_path && Storage::disk('public')->exists($team->team_pic_path)) { // check
            Storage::disk('public')->delete($team->team_pic_path); // save
        }

        $team->delete(); // save

        return back()->with('success', 'Team deleted successfully.'); // redirect
    }

    /**
     * Approve and activate a pending team registration.
     */
    public function approve(Team $team)
    {
        $team->update([
            'status' => 'ACTIVE', // state
            'is_active' => true, // state
        ]); // save

        return back()->with('success', "Team '{$team->name}' has been approved and activated."); // redirect
    }

    /**
     * Reject a team registration.
     */
    public function reject(Team $team)
    {
        $team->update([
            'status' => 'REJECTED', // state
            'is_active' => false, // state
        ]); // save

        return back()->with('success', "Team '{$team->name}' registration has been rejected."); // redirect
    }
}
