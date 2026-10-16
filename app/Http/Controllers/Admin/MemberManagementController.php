<?php

// --1. imports--
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// --2. main controller--
class MemberManagementController extends Controller
{
    /**
     * Display a listing of registered community members.
     */
    public function index(Request $request): Response
    {
        $query = User::where('role', 'member'); // state

        // search query
        if ($request->filled('search')) { // check
            $search = trim($request->search);
            // check for MESF-ID format
            $cleanId = preg_replace('/[^0-9]/', '', $search);
            $query->where(function ($q) use ($search, $cleanId) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('gamer_tag', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
                if ($cleanId !== '') {
                    $q->orWhere('id', (int) $cleanId);
                }
            });
        }

        // state filter
        if ($request->filled('state') && $request->state !== 'ALL') { // check
            $query->where('state_region', $request->state);
        }

        // primary game filter
        if ($request->filled('game') && $request->game !== 'ALL') { // check
            $query->where('primary_game', $request->game);
        }

        // status filter
        if ($request->filled('status') && $request->status !== 'ALL') { // check
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        $rawMembers = $query->orderBy('created_at', 'desc')->get(); // state
        $emails = $rawMembers->pluck('email')->filter(); // properties
        $teamsMap = Team::whereIn('contact_email', $emails)->get()->groupBy('contact_email'); // properties

        $members = $rawMembers->map(function ($member) use ($teamsMap) { // convert
            $team = $teamsMap->has($member->email) ? $teamsMap[$member->email]->first() : null; // check

            return [
                'id' => $member->id,
                'member_id' => 'MESF-' . str_pad($member->id, 5, '0', STR_PAD_LEFT),
                'name' => $member->name,
                'email' => $member->email,
                'gamer_tag' => $member->gamer_tag ?: $member->name,
                'primary_game' => $member->primary_game ?: 'Mobile Legends: Bang Bang (MLBB)',
                'state_region' => $member->state_region ?: 'Selangor',
                'phone_number' => $member->phone_number ?: '—',
                'game_ids' => $member->game_ids ?: ['mlbb' => '', 'pubg' => '', 'valorant' => ''],
                'is_active' => (bool) $member->is_active,
                'team_name' => $team ? $team->name : null,
                'team_tag' => $team ? $team->tag : null,
                'created_at' => $member->created_at ? $member->created_at->format('d M Y') : '—',
            ];
        });

        // calculate stats
        $totalMembers = User::where('role', 'member')->count(); // count
        $activeMembers = User::where('role', 'member')->where('is_active', true)->count(); // count

        $topGame = User::where('role', 'member')
            ->whereNotNull('primary_game')
            ->selectRaw('primary_game, count(*) as count')
            ->groupBy('primary_game')
            ->orderByDesc('count')
            ->first(); // check

        $topState = User::where('role', 'member')
            ->whereNotNull('state_region')
            ->selectRaw('state_region, count(*) as count')
            ->groupBy('state_region')
            ->orderByDesc('count')
            ->first(); // check

        return Inertia::render('Admin/Members/Index', [ // screen
            'members' => $members,
            'filters' => [
                'search' => $request->input('search', ''),
                'state' => $request->input('state', 'ALL'),
                'game' => $request->input('game', 'ALL'),
                'status' => $request->input('status', 'ALL'),
            ],
            'stats' => [
                'total' => $totalMembers,
                'active' => $activeMembers,
                'inactive' => $totalMembers - $activeMembers,
                'top_game' => $topGame ? $topGame->primary_game : 'MLBB',
                'top_state' => $topState ? $topState->state_region : 'Selangor',
            ]
        ]);
    }

    /**
     * Store a newly created member by admin.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([ // validate
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'gamer_tag' => 'nullable|string|max:100',
            'primary_game' => 'nullable|string|max:100',
            'state_region' => 'nullable|string|max:100',
            'phone_number' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:6',
            'is_active' => 'nullable|boolean',
            'game_ids' => 'nullable|array',
        ]);

        $member = User::create([ // save
            'name' => $validated['name'],
            'email' => $validated['email'],
            'gamer_tag' => !empty($validated['gamer_tag']) ? $validated['gamer_tag'] : $validated['name'],
            'primary_game' => !empty($validated['primary_game']) ? $validated['primary_game'] : 'Mobile Legends: Bang Bang (MLBB)',
            'state_region' => !empty($validated['state_region']) ? $validated['state_region'] : 'Selangor',
            'phone_number' => $validated['phone_number'] ?? null,
            'password' => bcrypt($validated['password'] ?? 'password123'),
            'role' => 'member',
            'is_active' => $request->boolean('is_active', true),
            'game_ids' => $validated['game_ids'] ?? ['mlbb' => '', 'pubg' => '', 'valorant' => ''],
        ]);

        ActivityLog::create([ // log
            'user_id' => Auth::id(),
            'action' => 'created',
            'description' => "Manually registered member: {$member->name} ({$member->gamer_tag})",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Member registered successfully.'); // redirect
    }

    /**
     * Update the specified member details.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        if ($user->role !== 'member') { // check
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([ // validate
            'name' => 'required|string|max:255',
            'gamer_tag' => 'nullable|string|max:100',
            'primary_game' => 'nullable|string|max:100',
            'state_region' => 'nullable|string|max:100',
            'phone_number' => 'nullable|string|max:50',
            'is_active' => 'required|boolean',
            'game_ids' => 'nullable|array',
        ]);

        $user->update($validated); // save

        ActivityLog::create([ // log
            'user_id' => Auth::id(),
            'action' => 'updated',
            'description' => "Updated member profile for: {$user->name} (" . ($user->gamer_tag ?: 'Member') . ")",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('saved', 'Member profile updated successfully.'); // redirect
    }

    /**
     * Toggle member active status.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->role !== 'member') { // check
            abort(403, 'Unauthorized.');
        }

        $user->is_active = !$user->is_active; // toggle
        $user->save(); // save

        $statusLabel = $user->is_active ? 'activated' : 'suspended';

        ActivityLog::create([ // log
            'user_id' => Auth::id(),
            'action' => 'status_changed',
            'description' => "Member {$user->name} was {$statusLabel}.",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('saved', "Member account successfully {$statusLabel}."); // redirect
    }

    /**
     * Delete the specified member.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->role !== 'member') { // check
            abort(403, 'Unauthorized.');
        }

        $name = $user->name;
        $user->delete(); // delete

        ActivityLog::create([ // log
            'user_id' => Auth::id(),
            'action' => 'deleted',
            'description' => "Deleted member account: {$name}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Member account deleted successfully.'); // redirect
    }
}
