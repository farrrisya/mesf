// --1. imports--
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    Shield,
    Trophy,
    MessageSquare,
    ArrowRight,
    CheckCircle2,
    Clock,
    Plus,
    Activity,
    MapPin,
    IdCard,
    ExternalLink,
    AlertCircle
} from 'lucide-react';

// --2. main component--
export default function Dashboard({
    metrics = {
        members: { total: 0, active: 0 },
        teams: { total: 0, pending: 0 },
        leagues: { total: 0, news: 0 },
        inquiries: { pending: 0 }
    },
    pendingTeams = [],
    recentMembers = [],
    recentLogs = []
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AdminLayout title="Dashboard - MESF">
            <Head title="Management Dashboard - MESF" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* Clean Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                                Management Operations
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                            Welcome, {user?.name || 'Administrator'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            Here is an overview of athlete members, competitive teams, and portal activity.
                        </p>
                    </div>

                    {/* Quick Action Shortcuts */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/admin/members"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
                        >
                            <Users className="w-3.5 h-3.5 text-amber-400" />
                            <span>Members</span>
                        </Link>
                        <Link
                            href="/admin/teams"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
                        >
                            <Shield className="w-3.5 h-3.5 text-sky-400" />
                            <span>Teams</span>
                        </Link>
                        <Link
                            href="/admin/leagues"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
                        >
                            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Leagues</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Clean Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Members */}
                    <Link
                        href="/admin/members"
                        className="group p-5 rounded-2xl bg-[#090D18]/85 border border-white/10 hover:border-amber-400/40 transition-all shadow-md block"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono text-slate-400 uppercase">Community Members</span>
                            <div className="h-8 w-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                            {metrics.members?.total || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="text-emerald-400 font-semibold">{metrics.members?.active || 0} active</span>
                            <span>•</span>
                            <span>View directory</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>

                    {/* Teams */}
                    <Link
                        href="/admin/teams"
                        className="group p-5 rounded-2xl bg-[#090D18]/85 border border-white/10 hover:border-sky-400/40 transition-all shadow-md block"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono text-slate-400 uppercase">Registered Teams</span>
                            <div className="h-8 w-8 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                                <Shield className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                            {metrics.teams?.total || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            {metrics.teams?.pending > 0 ? (
                                <span className="text-amber-400 font-semibold">{metrics.teams.pending} pending review</span>
                            ) : (
                                <span className="text-slate-400">All reviewed</span>
                            )}
                            <span>•</span>
                            <span>Manage teams</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>

                    {/* Competitions */}
                    <Link
                        href="/admin/leagues"
                        className="group p-5 rounded-2xl bg-[#090D18]/85 border border-white/10 hover:border-emerald-400/40 transition-all shadow-md block"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono text-slate-400 uppercase">Active Leagues</span>
                            <div className="h-8 w-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                                <Trophy className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                            {metrics.leagues?.total || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <span>{metrics.leagues?.news || 0} news posts</span>
                            <span>•</span>
                            <span>View tournaments</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>

                    {/* Inquiries */}
                    <Link
                        href="/admin/inquiries"
                        className="group p-5 rounded-2xl bg-[#090D18]/85 border border-white/10 hover:border-violet-400/40 transition-all shadow-md block"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono text-slate-400 uppercase">Inquiries & Support</span>
                            <div className="h-8 w-8 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                            {metrics.inquiries?.pending || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <span>Pending inquiries</span>
                            <span>•</span>
                            <span>Review inbox</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Team Registrations */}
                    <div className="rounded-2xl bg-[#090D18]/85 border border-white/10 p-5 shadow-lg flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-amber-400" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                                    Team Approval Queue
                                </h3>
                            </div>
                            <Link
                                href="/admin/teams"
                                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                            >
                                <span>View all</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {pendingTeams.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 my-auto space-y-1">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400/80 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-slate-300">No pending team approvals</p>
                                <p className="text-[11px] text-slate-500">All competitive team submissions have been processed.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 my-auto">
                                {pendingTeams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 flex items-center justify-between gap-3 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-xs truncate">{team.name}</span>
                                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                                    [{team.tag || 'TEAM'}]
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                                {team.game_title || 'Multi-title'} • Manager: {team.manager_name || 'N/A'}
                                            </div>
                                        </div>
                                        <Link
                                            href="/admin/teams"
                                            className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold shrink-0 transition-colors"
                                        >
                                            Review
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Community Members */}
                    <div className="rounded-2xl bg-[#090D18]/85 border border-white/10 p-5 shadow-lg flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                                    Recent Community Athletes
                                </h3>
                            </div>
                            <Link
                                href="/admin/members"
                                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                            >
                                <span>Directory</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {recentMembers.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 my-auto space-y-1">
                                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-slate-300">No members registered yet</p>
                                <p className="text-[11px] text-slate-500">Community athletes will appear here once registered.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 my-auto">
                                {recentMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 flex items-center justify-between gap-3 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold font-mono text-amber-400 text-xs shrink-0">
                                                {member.gamer_tag?.charAt(0)?.toUpperCase() || 'M'}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-xs truncate">{member.gamer_tag}</span>
                                                    <span className="text-[10px] font-mono text-slate-500">{member.member_id}</span>
                                                </div>
                                                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                                                    <span>{member.name}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-0.5">
                                                        <MapPin className="w-3 h-3 text-slate-500" />
                                                        {member.state_region}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 border ${
                                            member.is_active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'
                                        }`}>
                                            {member.is_active ? 'Active' : 'Suspended'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent System Activity Log */}
                <div className="rounded-2xl bg-[#090D18]/85 border border-white/10 p-5 shadow-lg">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-amber-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                                Recent System & Audit Activity
                            </h3>
                        </div>
                        <Link
                            href="/admin/activity-logs"
                            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                            <span>Full Audit Log</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentLogs.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-500">
                            No recent system activities recorded.
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5 text-xs">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 shrink-0">
                                            {log.user_name}
                                        </span>
                                        <span className="text-slate-300 truncate">{log.description}</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap shrink-0">
                                        {log.created_at}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
