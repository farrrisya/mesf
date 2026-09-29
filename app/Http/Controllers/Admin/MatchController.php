<?php

// --1. imports--
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EsportMatch;
use Illuminate\Http\Request;
use Inertia\Inertia;

// --2. main controller--
class MatchController extends Controller
{
    public function index()
    {
        $matches = EsportMatch::orderBy('scheduled_date', 'desc')
            ->orderBy('scheduled_time', 'asc')
            ->get()
            ->map(function ($match) { // state
                return [ // convert
                    'id' => $match->id,
                    'tournament_name' => $match->tournament_name,
                    'game_title' => $match->game_title,
                    'round' => $match->round,
                    'format' => $match->format,
                    'team_a_name' => $match->team_a_name,
                    'team_a_tag' => $match->team_a_tag,
                    'team_a_score' => $match->team_a_score,
                    'team_b_name' => $match->team_b_name,
                    'team_b_tag' => $match->team_b_tag,
                    'team_b_score' => $match->team_b_score,
                    'scheduled_date' => $match->scheduled_date ? $match->scheduled_date->format('Y-m-d') : null,
                    'formatted_date' => $match->scheduled_date ? $match->scheduled_date->format('d M Y') : 'TBA',
                    'scheduled_time' => $match->scheduled_time ?: 'TBA',
                    'venue' => $match->venue ?: 'Online Arena',
                    'stream_url' => $match->stream_url,
                    'status' => $match->status ?: 'UPCOMING',
                    'is_active' => (bool)$match->is_active,
                    'created_at' => $match->created_at ? $match->created_at->format('d M Y') : null,
                ];
            });

        return Inertia::render('Admin/Matches', [ // screen
            'matches' => $matches
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Matches/Create'); // screen
    }

    public function store(Request $request)
    {
        $request->validate([ // validate
            'tournament_name' => 'required|string|max:255',
            'game_title' => 'required|string|max:255',
            'round' => 'nullable|string|max:255',
            'format' => 'nullable|string|max:50',
            'team_a_name' => 'required|string|max:255',
            'team_a_tag' => 'nullable|string|max:20',
            'team_b_name' => 'required|string|max:255',
            'team_b_tag' => 'nullable|string|max:20',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'nullable|string|max:50',
            'venue' => 'nullable|string|max:255',
            'stream_url' => 'nullable|string|max:2000',
            'status' => 'nullable|string|max:50',
        ]);

        EsportMatch::create([ // save
            'tournament_name' => $request->tournament_name,
            'game_title' => $request->game_title,
            'round' => $request->round,
            'format' => $request->format,
            'team_a_name' => $request->team_a_name,
            'team_a_tag' => $request->team_a_tag,
            'team_b_name' => $request->team_b_name,
            'team_b_tag' => $request->team_b_tag,
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
            'venue' => $request->venue ?: 'Online Arena',
            'stream_url' => $request->stream_url,
            'status' => $request->status ?: 'UPCOMING',
            'is_active' => true,
        ]);

        return redirect()->route('admin.matches')->with('success', 'Match scheduled successfully.'); // redirect
    }

    public function edit(EsportMatch $match)
    {
        return Inertia::render('Admin/Matches/Edit', [ // screen
            'match' => [ // state
                'id' => $match->id,
                'tournament_name' => $match->tournament_name,
                'game_title' => $match->game_title,
                'round' => $match->round ?: '',
                'format' => $match->format ?: 'BO3',
                'team_a_name' => $match->team_a_name,
                'team_a_tag' => $match->team_a_tag ?: '',
                'team_a_score' => $match->team_a_score,
                'team_b_name' => $match->team_b_name,
                'team_b_tag' => $match->team_b_tag ?: '',
                'team_b_score' => $match->team_b_score,
                'scheduled_date' => $match->scheduled_date ? $match->scheduled_date->format('Y-m-d') : '',
                'scheduled_time' => $match->scheduled_time ?: '',
                'venue' => $match->venue ?: 'Online Arena',
                'stream_url' => $match->stream_url ?: '',
                'status' => $match->status ?: 'UPCOMING',
                'is_active' => (bool)$match->is_active,
            ]
        ]);
    }

    public function update(Request $request, EsportMatch $match)
    {
        $request->validate([ // validate
            'tournament_name' => 'required|string|max:255',
            'game_title' => 'required|string|max:255',
            'round' => 'nullable|string|max:255',
            'format' => 'nullable|string|max:50',
            'team_a_name' => 'required|string|max:255',
            'team_a_tag' => 'nullable|string|max:20',
            'team_a_score' => 'nullable|integer|min:0',
            'team_b_name' => 'required|string|max:255',
            'team_b_tag' => 'nullable|string|max:20',
            'team_b_score' => 'nullable|integer|min:0',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'nullable|string|max:50',
            'venue' => 'nullable|string|max:255',
            'stream_url' => 'nullable|string|max:2000',
            'status' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        $match->update([ // save
            'tournament_name' => $request->tournament_name,
            'game_title' => $request->game_title,
            'round' => $request->round,
            'format' => $request->format,
            'team_a_name' => $request->team_a_name,
            'team_a_tag' => $request->team_a_tag,
            'team_a_score' => $request->team_a_score,
            'team_b_name' => $request->team_b_name,
            'team_b_tag' => $request->team_b_tag,
            'team_b_score' => $request->team_b_score,
            'scheduled_date' => $request->scheduled_date,
            'scheduled_time' => $request->scheduled_time,
            'venue' => $request->venue ?: 'Online Arena',
            'stream_url' => $request->stream_url,
            'status' => $request->status ?: 'UPCOMING',
            'is_active' => $request->has('is_active') ? (bool)$request->is_active : true,
        ]);

        return redirect()->route('admin.matches')->with('success', 'Match fixture updated successfully.'); // redirect
    }

    public function destroy(EsportMatch $match)
    {
        $match->delete(); // save
        return back()->with('success', 'Match fixture deleted successfully.'); // redirect
    }
}
