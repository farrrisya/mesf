<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

// --2. main controller--
class InquiryController extends Controller
{
    // --3. actions--
    /**
     * Store a newly submitted public inquiry.
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. base validation
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:join_tournament,partnership,host_tournament'], // validate
            'name' => ['required', 'string', 'max:255'], // validate
            'email' => ['required', 'email', 'max:255'], // validate
            'phone' => ['required', 'string', 'max:50'], // validate
            'organization' => ['nullable', 'string', 'max:255'], // validate
            'message' => ['nullable', 'string'], // validate
        ]);

        $details = []; // state

        // 2. type-specific validations and detail bundling
        if ($validated['type'] === 'join_tournament') {
            $typeData = $request->validate([
                'team_name' => ['required', 'string', 'max:255'], // validate
                'game_title' => ['required', 'string', 'max:255'], // validate
                'player_count' => ['required', 'integer', 'min:1', 'max:50'], // validate
                'state' => ['required', 'string', 'max:100'], // validate
            ]);

            $details = [
                'team_name' => $typeData['team_name'],
                'game_title' => $typeData['game_title'],
                'player_count' => (int) $typeData['player_count'],
                'state' => $typeData['state'],
            ];
        } elseif ($validated['type'] === 'partnership') {
            $typeData = $request->validate([
                'organization' => ['required', 'string', 'max:255'], // validate
                'partnership_type' => ['required', 'string', 'max:255'], // validate
                'proposal_summary' => ['required', 'string'], // validate
            ]);

            $validated['organization'] = $typeData['organization']; // state
            $details = [
                'partnership_type' => $typeData['partnership_type'],
                'proposal_summary' => $typeData['proposal_summary'],
            ];
        } elseif ($validated['type'] === 'host_tournament') {
            $typeData = $request->validate([
                'organization' => ['required', 'string', 'max:255'], // validate
                'proposed_event_name' => ['required', 'string', 'max:255'], // validate
                'proposed_dates' => ['required', 'string', 'max:255'], // validate
                'venue' => ['required', 'string', 'max:255'], // validate
                'expected_teams' => ['required', 'string', 'max:255'], // validate
            ]);

            $validated['organization'] = $typeData['organization']; // state
            $details = [
                'proposed_event_name' => $typeData['proposed_event_name'],
                'proposed_dates' => $typeData['proposed_dates'],
                'venue' => $typeData['venue'],
                'expected_teams' => $typeData['expected_teams'],
            ];
        }

        // 3. create record
        Inquiry::create([
            'type' => $validated['type'], // state
            'name' => $validated['name'], // state
            'email' => $validated['email'], // state
            'phone' => $validated['phone'], // state
            'organization' => $validated['organization'] ?? null, // state
            'message' => $validated['message'] ?? null, // state
            'details' => $details, // convert
            'status' => 'pending', // state
            'admin_notes' => null, // state
            'handled_by' => null, // state
        ]); // save

        return back()->with('success', 'Thank you, your inquiry has been received.'); // redirect
    }
}
