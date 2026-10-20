<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Inquiry;
use App\Models\League;
use App\Models\News;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the main admin management dashboard.
     */
    public function index(Request $request): Response
    {
        // 1. High-level counts
        $totalMembers = User::where('role', 'member')->count();
        $activeMembers = User::where('role', 'member')->where('is_active', true)->count();

        $totalTeams = Team::count();
        $pendingTeamsCount = Team::whereIn('status', ['PENDING', 'pending', 'DELETION_REQUESTED', 'deletion_requested'])->count();

        $activeLeagues = League::where('is_active', true)->count();
        $newsCount = News::count();
        $pendingInquiries = Inquiry::whereIn('status', ['unread', 'pending', 'open'])->count();

        // 2. Pending team requests requiring admin review
        $pendingTeams = Team::whereIn('status', ['PENDING', 'pending', 'DELETION_REQUESTED', 'deletion_requested'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'name', 'tag', 'game_title', 'manager_name', 'status', 'created_at']);

        // 3. Recent community members
        $recentMembers = User::where('role', 'member')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'name', 'gamer_tag', 'email', 'state_region', 'is_active', 'created_at'])
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'member_id' => 'MESF-' . str_pad($m->id, 5, '0', STR_PAD_LEFT),
                    'name' => $m->name,
                    'gamer_tag' => $m->gamer_tag ?: $m->name,
                    'email' => $m->email,
                    'state_region' => $m->state_region ?: 'Selangor',
                    'is_active' => (bool) $m->is_active,
                    'created_at' => $m->created_at ? $m->created_at->format('d M Y') : '—',
                ];
            });

        // 4. Recent audit activity logs
        $recentLogs = ActivityLog::with('user:id,name,role')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => $log->user ? $log->user->name : 'System',
                    'user_role' => $log->user ? $log->user->role : 'system',
                    'action' => $log->action,
                    'description' => $log->description,
                    'created_at' => $log->created_at ? $log->created_at->diffForHumans() : 'Just now',
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'members' => [
                    'total' => $totalMembers,
                    'active' => $activeMembers,
                ],
                'teams' => [
                    'total' => $totalTeams,
                    'pending' => $pendingTeamsCount,
                ],
                'leagues' => [
                    'total' => $activeLeagues,
                    'news' => $newsCount,
                ],
                'inquiries' => [
                    'pending' => $pendingInquiries,
                ],
            ],
            'pendingTeams' => $pendingTeams,
            'recentMembers' => $recentMembers,
            'recentLogs' => $recentLogs,
        ]);
    }
}
