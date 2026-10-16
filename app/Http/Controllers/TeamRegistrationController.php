<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

// --2. main controller--
class TeamRegistrationController extends Controller
{
    // --3. actions--
    /**
     * Show the public team registration form.
     */
    public function create(Request $request): Response
    {
        $user = $request->user(); // properties

        return Inertia::render('Public/RegisterTeam', [ // screen
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone_number ?: '',
                    'state' => $user->state_region ?: '',
                ] : null,
            ],
        ]);
    }

    /**
     * Handle public team registration submission and align directly with Admin Teams registry.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'], // validate
            'tag' => ['nullable', 'string', 'max:20'], // validate
            'type' => ['nullable', 'string', 'in:pro,state,national'], // validate
            'region' => ['nullable', 'string', 'max:255'], // validate
            'regions' => ['nullable', 'array'], // validate
            'game_title' => ['nullable', 'string', 'max:500'], // validate
            'games' => ['nullable', 'array'], // validate
            'manager_name' => ['required', 'string', 'max:255'], // validate
            'contact_email' => ['required', 'email', 'max:255'], // validate
            'motto' => ['nullable', 'string', 'max:255'], // validate
            'players' => ['nullable', 'integer', 'min:1', 'max:50'], // validate
            'roster_size' => ['nullable', 'integer', 'min:1', 'max:50'], // validate
            'logo' => ['nullable', 'image', 'max:5120'], // validate (5MB)
            'website_url' => ['nullable', 'string', 'max:255'], // validate
            'social_links' => ['nullable', 'array'], // validate
        ]);

        // Multi-territory handling
        $region = $validated['region'] ?? ''; // state
        if ($request->has('regions') && is_array($request->regions) && count($request->regions) > 0) { // check
            $region = implode(', ', array_filter($request->regions)); // convert
        }
        if (empty($region)) { // check
            $region = 'National / All Malaysia'; // state
        }

        // Multi-discipline handling like Admin Manage Teams
        $gameTitle = $validated['game_title'] ?? ''; // state
        if ($request->has('games') && is_array($request->games) && count($request->games) > 0) { // check
            $gameTitle = implode(', ', array_filter($request->games)); // convert
        }
        if (empty($gameTitle)) { // check
            $gameTitle = 'Esports'; // state
        }

        // Generate unique slug
        $baseSlug = Str::slug($validated['name']); // convert
        $slug = $baseSlug; // state
        $count = 1; // state
        while (Team::where('slug', $slug)->exists()) { // check
            $slug = "{$baseSlug}-{$count}"; // state
            $count++; // state
        }

        // Auto-generate tag if omitted
        $cleanTag = !empty($validated['tag'])
            ? strtoupper(trim($validated['tag']))
            : strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $validated['name']), 0, 4)); // convert

        // Handle team logo upload
        $logoPath = null; // state
        if ($request->hasFile('logo')) { // check
            $logoPath = $request->file('logo')->store('teams', 'public'); // save
        }

        $playerCount = (int) ($validated['players'] ?? $validated['roster_size'] ?? 5); // state

        // Store directly in teams table with PENDING status for Admin review
        Team::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'tag' => $cleanTag ?: 'TEAM',
            'type' => $validated['type'] ?? 'pro',
            'region' => $region,
            'game_title' => $gameTitle,
            'manager_name' => $validated['manager_name'],
            'contact_email' => $validated['contact_email'],
            'website_url' => $validated['website_url'] ?? null,
            'social_links' => $validated['social_links'] ?? null,
            'motto' => $validated['motto'] ?? null,
            'roster_size' => $playerCount,
            'status' => 'PENDING',
            'logo_path' => $logoPath,
            'team_pic_path' => null,
            'image_display_mode' => 'both',
            'is_active' => false,
        ]); // save

        return redirect()->back()->with('success', 'Your team registration has been submitted and is pending review by MESF Secretariat.'); // redirect
    }
}
