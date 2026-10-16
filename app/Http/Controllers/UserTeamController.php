<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

// --2. main controller--
class UserTeamController extends Controller
{
    // --3. actions--
    /**
     * Show the team management page for the team's owner/manager.
     */
    public function edit(Request $request, Team $team): Response|RedirectResponse
    {
        $user = $request->user(); // properties

        // Ensure user is authorized to manage this team
        $isOwner = strcasecmp(trim($team->contact_email), trim($user->email)) === 0
            || strcasecmp(trim($team->manager_name), trim($user->name)) === 0
            || $user->role === 'admin'; // check

        if (!$isOwner) { // check
            abort(403, 'You are not authorized to manage this team.');
        }

        return Inertia::render('Public/ManageTeam', [ // screen
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'slug' => $team->slug,
                'tag' => $team->tag,
                'type' => $team->type,
                'region' => $team->region,
                'regions' => array_values(array_filter(array_map('trim', explode(',', $team->region ?: '')))),
                'game_title' => $team->game_title,
                'games' => array_values(array_filter(array_map('trim', explode(',', $team->game_title ?: '')))),
                'manager_name' => $team->manager_name,
                'contact_email' => $team->contact_email,
                'website_url' => $team->website_url,
                'social_links' => $team->social_links ?: [],
                'motto' => $team->motto,
                'roster_size' => $team->roster_size ?: 5,
                'status' => $team->status ?: 'ACTIVE',
                'is_active' => (bool) $team->is_active,
                'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                'team_pic_url' => $team->team_pic_path ? Storage::url($team->team_pic_path) : null,
            ],
        ]);
    }

    /**
     * Update the team's details. Changes require admin approval.
     */
    public function update(Request $request, Team $team): RedirectResponse
    {
        $user = $request->user(); // properties

        // Ensure user is authorized to manage this team
        $isOwner = strcasecmp(trim($team->contact_email), trim($user->email)) === 0
            || strcasecmp(trim($team->manager_name), trim($user->name)) === 0
            || $user->role === 'admin'; // check

        if (!$isOwner) { // check
            abort(403, 'You are not authorized to manage this team.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'], // validate
            'motto' => ['nullable', 'string', 'max:255'], // validate
            'manager_name' => ['required', 'string', 'max:255'], // validate
            'contact_email' => ['required', 'email', 'max:255'], // validate
            'players' => ['nullable', 'integer', 'min:1', 'max:50'], // validate
            'website_url' => ['nullable', 'string', 'max:255'], // validate
            'social_links' => ['nullable', 'array'], // validate
            'games' => ['nullable', 'array'], // validate
            'regions' => ['nullable', 'array'], // validate
            'logo' => ['nullable', 'image', 'max:5120'], // validate
            'team_pic' => ['nullable', 'image', 'max:5120'], // validate
        ]);

        // Process games
        if ($request->has('games') && is_array($request->games) && count($request->games) > 0) { // check
            $team->game_title = implode(', ', array_filter($request->games)); // convert
        }

        // Process regions
        if ($request->has('regions') && is_array($request->regions) && count($request->regions) > 0) { // check
            $team->region = implode(', ', array_filter($request->regions)); // convert
        }

        // Update fields
        $team->name = $validated['name']; // state
        $team->motto = $validated['motto'] ?? null; // state
        $team->manager_name = $validated['manager_name']; // state
        $team->contact_email = $validated['contact_email']; // state
        $team->roster_size = (int) ($validated['players'] ?? $team->roster_size ?? 5); // state
        $team->website_url = $validated['website_url'] ?? null; // state
        $team->social_links = $validated['social_links'] ?? []; // state

        // Handle logo upload
        if ($request->hasFile('logo')) { // check
            $team->logo_path = $request->file('logo')->store('teams', 'public'); // save
        }

        // Handle team picture upload
        if ($request->hasFile('team_pic')) { // check
            $team->team_pic_path = $request->file('team_pic')->store('teams', 'public'); // save
        }

        // Any updates submitted by manager require admin approval
        $team->status = 'PENDING'; // state
        $team->save(); // save

        return redirect()->back()->with('success', 'Team updates submitted successfully! Changes are pending administrator review.'); // redirect
    }

    /**
     * Request removal / deletion of the team.
     */
    public function requestDelete(Request $request, Team $team): RedirectResponse
    {
        $user = $request->user(); // properties

        $isOwner = strcasecmp(trim($team->contact_email), trim($user->email)) === 0
            || strcasecmp(trim($team->manager_name), trim($user->name)) === 0
            || $user->role === 'admin'; // check

        if (!$isOwner) { // check
            abort(403, 'You are not authorized to manage this team.');
        }

        $team->status = 'DELETION_REQUESTED'; // state
        $team->save(); // save

        return redirect()->back()->with('success', 'Squad deletion request submitted. An administrator will review and process the removal.'); // redirect
    }

    /**
     * Cancel a previous deletion request.
     */
    public function cancelDelete(Request $request, Team $team): RedirectResponse
    {
        $user = $request->user(); // properties

        $isOwner = strcasecmp(trim($team->contact_email), trim($user->email)) === 0
            || strcasecmp(trim($team->manager_name), trim($user->name)) === 0
            || $user->role === 'admin'; // check

        if (!$isOwner) { // check
            abort(403, 'You are not authorized to manage this team.');
        }

        $team->status = 'ACTIVE'; // state
        $team->save(); // save

        return redirect()->back()->with('success', 'Squad deletion request cancelled. Your squad remains active.'); // redirect
    }
}
