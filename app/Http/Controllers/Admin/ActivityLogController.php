<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    // --1. index--
    public function index(Request $request)
    {
        $query = ActivityLog::with('user:id,name,email,role')
            ->orderBy('created_at', 'desc');

        // category / action filter
        $actionFilter = $request->input('action_type', 'all');
        if ($actionFilter && $actionFilter !== 'all') {
            if ($actionFilter === 'sign_in') {
                $query->whereIn('action', ['Sign In', 'Log Masuk', 'login']);
            } elseif ($actionFilter === 'create') {
                $query->whereIn('action', ['Create', 'Tambah', 'create']);
            } elseif ($actionFilter === 'update') {
                $query->whereIn('action', ['Update', 'Kemaskini', 'update', 'toggle_status', 'toggle_featured']);
            } elseif ($actionFilter === 'delete') {
                $query->whereIn('action', ['Delete', 'Hapus', 'delete']);
            } elseif ($actionFilter === 'impersonation') {
                $query->where(function ($q) {
                    $q->where('action', 'like', '%impersonation%');
                });
            }
        }

        // search keyword filter
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('model_type', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $logs = $query->paginate(25)->withQueryString(); // state

        // compute summary metrics
        $metrics = [
            'total' => ActivityLog::count(),
            'sign_ins' => ActivityLog::whereIn('action', ['Sign In', 'Log Masuk', 'login'])->count(),
            'creates' => ActivityLog::whereIn('action', ['Create', 'Tambah', 'create'])->count(),
            'updates' => ActivityLog::whereIn('action', ['Update', 'Kemaskini', 'update', 'toggle_status', 'toggle_featured'])->count(),
            'deletes' => ActivityLog::whereIn('action', ['Delete', 'Hapus', 'delete'])->count(),
        ];

        return Inertia::render('Admin/ActivityLogs/Index', [ // screen
            'logs' => $logs,
            'metrics' => $metrics,
            'filters' => [
                'search' => $request->input('search', ''),
                'action_type' => $actionFilter,
            ],
        ]);
    }
}
