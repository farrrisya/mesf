<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Inquiry;
use App\Models\Team;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

// --2. main component--
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $user = $request->user(); // properties

        // Profile is exclusively for public users (members). Management team users go to their own admin portals.
        if ($user && $user->role !== 'member') { // check
            if ($user->role === 'editor') { // check
                return redirect()->route('editor.dashboard'); // redirect
            }
            if ($user->role === 'secretariat') { // check
                return redirect()->route('secretary.dashboard'); // redirect
            }
            return redirect()->route('admin.dashboard'); // redirect
        }

        $userInquiries = Inquiry::where('email', $user->email) // state
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'type' => $inquiry->type, // state
                    'status' => $inquiry->status, // state
                    'team_name' => $inquiry->details['team_name'] ?? null,
                    'game_title' => $inquiry->details['game_title'] ?? null,
                    'state' => $inquiry->details['state'] ?? null,
                    'player_count' => $inquiry->details['player_count'] ?? null,
                    'organization' => $inquiry->organization,
                    'proposal_summary' => $inquiry->details['proposal_summary'] ?? null,
                    'proposed_event_name' => $inquiry->details['proposed_event_name'] ?? null,
                    'created_at' => $inquiry->created_at ? $inquiry->created_at->format('d M Y') : '',
                    'admin_notes' => $inquiry->admin_notes,
                ];
            });

        $userTeams = Team::where('contact_email', $user->email) // state
            ->orWhere('manager_name', $user->name)
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'tag' => $team->tag,
                    'type' => $team->type,
                    'region' => $team->region,
                    'game_title' => $team->game_title,
                    'manager_name' => $team->manager_name,
                    'status' => $team->status,
                    'roster_size' => $team->roster_size,
                    'logo_path' => $team->logo_path ? \Illuminate\Support\Facades\Storage::url($team->logo_path) : null,
                    'is_active' => $team->is_active,
                ];
            });

        return Inertia::render('Profile/Edit', [ // screen
            'mustVerifyEmail' => $user instanceof MustVerifyEmail, // properties
            'status' => session('status'), // state
            'userInquiries' => $userInquiries, // properties
            'userTeams' => $userTeams, // properties
            'memberProfile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'gamer_tag' => $user->gamer_tag ?: '',
                'primary_game' => $user->primary_game ?: '',
                'state_region' => $user->state_region ?: 'Selangor',
                'phone_number' => $user->phone_number ?: '',
                'ic_number' => $user->ic_number ?: '',
                'avatar_url' => $user->avatar_path ? \Illuminate\Support\Facades\Storage::url($user->avatar_path) : null,
                'game_ids' => is_array($user->game_ids) ? array_merge([
                    'mlbb' => '',
                    'pubg' => '',
                    'valorant' => ''
                ], $user->game_ids) : [
                    'mlbb' => '',
                    'pubg' => '',
                    'valorant' => ''
                ],
                'member_id' => 'MESF-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'joined_at' => $user->created_at ? $user->created_at->format('M Y') : '2026',
                'role' => $user->role,
            ]
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user(); // properties
        $validated = $request->validated(); // validate

        if ($request->hasFile('avatar')) { // check
            if ($user->avatar_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->avatar_path)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar_path); // trigger
            }
            $validated['avatar_path'] = $request->file('avatar')->store('avatars', 'public'); // save
        }

        $user->fill($validated); // save

        if ($user->isDirty('email')) { // check
            $user->email_verified_at = null; // properties
        }

        $user->save(); // save

        return Redirect::back(); // redirect
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([ // validate
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user(); // properties

        Auth::logout(); // trigger

        $user->delete(); // trigger

        $request->session()->invalidate(); // trigger
        $request->session()->regenerateToken(); // trigger

        return Redirect::to('/'); // redirect
    }
}
