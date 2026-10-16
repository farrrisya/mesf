// --1. imports--
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Swords,
    Plus,
    Search,
    Trash2,
    Calendar,
    Clock,
    Tv,
    MapPin,
    ExternalLink,
    Edit2,
    Trophy,
    CheckCircle2
} from 'lucide-react';

// --2. main component--
export default function Matches({ matches = [] }) {
    // --3. actions--
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [statusFilter, setStatusFilter] = useState('ALL'); // state
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, item: null }); // state

    // stats calculation
    const totalCount = matches.length; // state
    const liveCount = matches.filter((m) => (m.status || '').toUpperCase() === 'LIVE').length; // state
    const upcomingCount = matches.filter((m) => (m.status || '').toUpperCase() === 'UPCOMING').length; // state
    const completedCount = matches.filter((m) => (m.status || '').toUpperCase() === 'COMPLETED').length; // state

    const filteredMatches = matches.filter((match) => { // check
        const matchStatus = (match.status || 'UPCOMING').toUpperCase(); // state
        const matchesStatus = statusFilter === 'ALL' || matchStatus === statusFilter; // check

        const query = searchQuery.toLowerCase().trim(); // check
        if (!query) return matchesStatus; // check

        const matchesQuery = (match.tournament_name || '').toLowerCase().includes(query) ||
            (match.game_title || '').toLowerCase().includes(query) ||
            (match.round || '').toLowerCase().includes(query) ||
            (match.team_a_name || '').toLowerCase().includes(query) ||
            (match.team_a_tag || '').toLowerCase().includes(query) ||
            (match.team_b_name || '').toLowerCase().includes(query) ||
            (match.team_b_tag || '').toLowerCase().includes(query) ||
            (match.venue || '').toLowerCase().includes(query);

        return matchesStatus && matchesQuery; // check
    });

    const confirmDelete = () => { // trigger
        if (!deleteModalState.item) return; // check
        router.delete(route('admin.matches.destroy', deleteModalState.item.id), { // save
            preserveScroll: true,
            onSuccess: () => setDeleteModalState({ isOpen: false, item: null }) // state
        });
    };

    // --4. UI--
    return (
        <AdminLayout title="Manage Matches - MESF Admin">
            <Head title="Manage Matches - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* Header section with clean title & action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Manage Matches
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Schedule, monitor live fixtures, update scores, and organize tournament broadcasts.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.matches.create')} // redirect
                            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Schedule Match</span>
                        </Link>
                    </div>
                </div>

                {/* Quick stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                            <span>Total Matches</span>
                            <Swords className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-black text-white">{totalCount}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                            <span>Live Now</span>
                            <Tv className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="text-2xl font-black text-rose-400">{liveCount}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                            <span>Upcoming</span>
                            <Clock className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-black text-amber-400">{upcomingCount}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-lg space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                            <span>Completed</span>
                            <Trophy className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-black text-emerald-400">{completedCount}</div>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Search input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder="Search matches, tournaments, teams, game disciplines..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                            />
                        </div>

                        {/* Status filter tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                            {[
                                { id: 'ALL', label: 'All', count: totalCount },
                                { id: 'LIVE', label: 'Live', count: liveCount },
                                { id: 'UPCOMING', label: 'Upcoming', count: upcomingCount },
                                { id: 'COMPLETED', label: 'Completed', count: completedCount }
                            ].map((tab) => {
                                const active = statusFilter === tab.id; // check
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setStatusFilter(tab.id)} // trigger
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                            active
                                                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                            active ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {matches.length === 0 ? (
                    <div className="space-y-6">
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                <Swords className="w-8 h-8" />
                            </div>

                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    No Matches Scheduled
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                    No matches scheduled yet. Schedule your first fixture to appear on the public match schedule.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={route('admin.matches.create')} // redirect
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-[0_4px_16px_rgba(251,191,36,0.25)] cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                                    <span>Schedule First Match</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : filteredMatches.length === 0 ? (
                    <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center text-slate-400 space-y-2">
                        <p className="text-sm">No matches found matching your current filter.</p>
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }} // trigger
                            className="text-xs text-amber-400 hover:underline cursor-pointer"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    /* Organized Match cards */
                    <div className="space-y-4">
                        {filteredMatches.map((match) => {
                            const status = (match.status || 'UPCOMING').toUpperCase(); // state
                            const isLive = status === 'LIVE'; // check
                            const isCompleted = status === 'COMPLETED'; // check

                            return (
                                <div
                                    key={match.id}
                                    className="bg-[#090D18]/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden transition-all"
                                >
                                    {/* 1. Card Top Bar: Status, Game, Format, and Schedule */}
                                    <div className="px-5 sm:px-6 py-3.5 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5 ${
                                                isLive
                                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                                    : isCompleted
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : status === 'CANCELLED'
                                                            ? 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                                                            : 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                                            }`}>
                                                {isLive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                                                )}
                                                <span>{status}</span>
                                            </span>

                                            {match.format && (
                                                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                                                    {match.format}
                                                </span>
                                            )}

                                            <span className="text-xs font-semibold text-amber-400/90 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">
                                                {match.game_title}
                                            </span>

                                            {match.round && (
                                                <span className="text-xs font-medium text-slate-400">
                                                    • {match.round}
                                                </span>
                                            )}
                                        </div>

                                        {/* Scheduled Date & Time */}
                                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300 font-medium">
                                            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{match.formatted_date}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 font-mono text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{match.scheduled_time || 'TBA'}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. Main Match Arena Body */}
                                    <div className="p-5 sm:p-6 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide" title={match.tournament_name}>
                                                {match.tournament_name}
                                            </h3>
                                            {match.venue && (
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate">{match.venue}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Versus Matchup Arena */}
                                        <div className="py-4 px-5 sm:px-8 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner flex items-center justify-between gap-4">
                                            {/* Team A */}
                                            <div className="text-right flex items-center justify-end gap-3 min-w-0 flex-1">
                                                <span className="text-sm sm:text-base font-extrabold text-white truncate">
                                                    {match.team_a_name}
                                                </span>
                                                {match.team_a_tag && (
                                                    <span className="text-xs font-mono font-bold text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                                                        [{match.team_a_tag}]
                                                    </span>
                                                )}
                                            </div>

                                            {/* Score / VS Display */}
                                            <div className="px-4 py-2 rounded-xl bg-black/85 border border-white/15 text-sm sm:text-base font-mono font-black text-amber-400 shrink-0 shadow-lg text-center min-w-[80px]">
                                                {match.team_a_score !== null && match.team_b_score !== null
                                                    ? `${match.team_a_score} - ${match.team_b_score}`
                                                    : 'VS'}
                                            </div>

                                            {/* Team B */}
                                            <div className="text-left flex items-center justify-start gap-3 min-w-0 flex-1">
                                                {match.team_b_tag && (
                                                    <span className="text-xs font-mono font-bold text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                                                        [{match.team_b_tag}]
                                                    </span>
                                                )}
                                                <span className="text-sm sm:text-base font-extrabold text-white truncate">
                                                    {match.team_b_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Anchored Action Toolbar (Firmly Anchored, Cleanly Integrated) */}
                                    <div className="px-5 sm:px-6 py-3.5 bg-white/[0.02] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                                        {/* Left: Stream link if present */}
                                        <div className="flex items-center gap-2">
                                            {match.stream_url ? (
                                                <a
                                                    href={match.stream_url} // redirect
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/25 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                                                    title="Watch Live Stream"
                                                >
                                                    <Tv className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Watch Stream</span>
                                                    <ExternalLink className="w-3 h-3 opacity-60" />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-500 italic">
                                                    No stream link
                                                </span>
                                            )}
                                        </div>

                                        {/* Right: Solid Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route('admin.matches.edit', match.id)} // redirect
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/30 text-white hover:text-amber-300 text-xs font-bold transition-all cursor-pointer"
                                                title="Edit Match"
                                            >
                                                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                                                <span>Edit Match</span>
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => setDeleteModalState({ isOpen: true, item: match })} // trigger
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all cursor-pointer"
                                                title="Delete Match"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* unified delete confirmation modal */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-md bg-[#0B0F1C] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Delete Match Fixture?</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Are you sure you want to delete match <span className="text-white font-semibold">"{deleteModalState.item?.tournament_name}: {deleteModalState.item?.team_a_name} vs {deleteModalState.item?.team_b_name}"</span>?
                                <span className="block text-slate-400 text-xs mt-1.5">This action cannot be undone.</span>
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModalState({ isOpen: false, item: null })} // trigger
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete} // trigger
                                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}