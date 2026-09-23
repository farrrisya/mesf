<?php

// --1. imports--
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// --2. main controller--
class InquiryManagementController extends Controller
{
    // --3. actions--
    /**
     * Display a listing of inquiries for Admin & Secretariat.
     */
    public function index(Request $request): Response
    {
        $query = Inquiry::with('handler:id,name,role')->latest(); // query

        // Filter by type
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type); // filter
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status); // filter
        }

        // Filter by search query
        if ($request->filled('search')) {
            $term = '%' . $request->search . '%'; // convert
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhere('email', 'like', $term)
                  ->orWhere('phone', 'like', $term)
                  ->orWhere('organization', 'like', $term)
                  ->orWhere('message', 'like', $term);
            });
        }

        $inquiries = $query->paginate(15)->withQueryString(); // paginate

        // Real aggregate counts
        $totalCount = Inquiry::count(); // count
        $pendingCount = Inquiry::where('status', 'pending')->count(); // count
        $reviewedCount = Inquiry::where('status', 'reviewed')->count(); // count
        $approvedCount = Inquiry::where('status', 'approved')->count(); // count
        $rejectedCount = Inquiry::where('status', 'rejected')->count(); // count
        $resolvedCount = Inquiry::whereIn('status', ['approved', 'rejected'])->count(); // count

        return Inertia::render('Admin/Inquiries', [ // screen
            'inquiries' => $inquiries,
            'filters' => [
                'type' => $request->type ?? 'all',
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
            'stats' => [
                'total' => $totalCount,
                'pending' => $pendingCount,
                'reviewed' => $reviewedCount,
                'approved' => $approvedCount,
                'rejected' => $rejectedCount,
                'resolved' => $resolvedCount,
            ],
        ]);
    }

    /**
     * Update the status and internal notes for an inquiry.
     */
    public function update(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,reviewed,approved,rejected'], // validate
            'admin_notes' => ['nullable', 'string'], // validate
        ]);

        $user = $request->user(); // state

        // Enforce approval rule: Secretariat cannot approve partnership or host_tournament
        if ($validated['status'] === 'approved' && in_array($inquiry->type, ['partnership', 'host_tournament'])) {
            if ($user->role !== 'admin') {
                abort(403, 'Only Admin can approve this inquiry type.'); // check
            }
        }

        $inquiry->update([
            'status' => $validated['status'], // state
            'admin_notes' => $validated['admin_notes'] ?? null, // state
            'handled_by' => $user->id, // state
        ]); // save

        return back()->with('success', 'Inquiry updated successfully.'); // redirect
    }
}
