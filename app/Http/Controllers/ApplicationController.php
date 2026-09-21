<?php

// --1. imports--
namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\FinancingScheme;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// --2. main component--
class ApplicationController extends Controller
{
    /**
     * Store a newly created financing application.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([ // validate
            'scheme_id' => ['required', 'exists:financing_schemes,id'],
            'amount_requested' => ['required', 'numeric', 'min:1'],
        ]);

        $scheme = FinancingScheme::findOrFail($validated['scheme_id']); // properties

        if ($validated['amount_requested'] > $scheme->max_amount) { // check
            return back()->withErrors([ // redirect
                'amount_requested' => "Jumlah dipohon melebihi had maksimum yang dibenarkan iaitu RM" . number_format($scheme->max_amount, 2) . "."
            ]);
        }

        $request->user()->applications()->create([ // save
            'scheme_id' => $validated['scheme_id'],
            'amount_requested' => $validated['amount_requested'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Permohonan pembiayaan anda telah berjaya dihantar dan sedang diproses.'); // redirect
    }

    /**
     * Update the status of a financing application (Admin only).
     */
    public function updateStatus(Request $request, Application $application)
    {
        $validated = $request->validate([ // validate
            'status' => ['required', Rule::in(['approved', 'rejected'])],
        ]);

        $application->update([ // save
            'status' => $validated['status'],
        ]);

        $statusLabel = $validated['status'] === 'approved' ? 'diluluskan' : 'ditolak'; // properties

        return back()->with('success', "Status permohonan #{$application->id} telah berjaya dikemas kini kepada {$statusLabel}."); // redirect
    }
}
