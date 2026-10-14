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
    Edit2
} from 'lucide-react';

// --2. main component--
export default function Matches({ matches = [] }) {
    // --3. actions--
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, item: null }); // state

    const filteredMatches = matches.filter((match) => { // check
        return (match.tournament_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (match.game_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (match.team_a_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (match.team_b_name || '').toLowerCase().includes(searchQuery.toLowerCase());
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
        <AdminLayout title="Matches Management - MESF Admin">
            <Head title="Matches Management - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* search & action bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* search input */}
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

                        {/* action controls */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.matches.create')} // redirect
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Schedule Match</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {matches.length === 0 ? (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                <Swords className="w-8 h-8" />
                            </div>

                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    Matches Section
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
                    <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center text-slate-400">
                        No matches found matching "{searchQuery}".
                    </div>
                ) : (
                    /* Match cards display */
                    <div className="space-y-4 animate-fadeIn">
                        {filteredMatches.map((match) => (
                            <div
                                key={match.id}
                                className="bg-[#090D18]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                {/* Left: Tournament, Game info & Schedule */}
                                <div className="space-y-2.5 lg:w-72 shrink-0">
                                    <div className="flex items-center gap-2.5">
                                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg font-mono ${
                                            match.status === 'LIVE'
                                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                                                : match.status === 'COMPLETED'
                                                    ? 'bg-white/10 text-slate-300 border border-white/10'
                                                    : 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                                        }`}>
                                            {match.status}
                                        </span>
                                        {match.format && (
                                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                                                {match.format}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug truncate" title={match.tournament_name}>
                                            {match.tournament_name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1 truncate">
                                            <span className="text-amber-400 font-semibold">{match.game_title}</span>
                                            <span>•</span>
                                            <span className="truncate">{match.round || 'Stage'}</span>
                                        </div>
                                    </div>

                                    {/* Date & Time with white icons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                                            <Calendar className="w-3.5 h-3.5 text-white" />
                                            <span>{match.formatted_date}</span>
                                        </span>
                                        <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                                            <Clock className="w-3.5 h-3.5 text-white" />
                                            <span>{match.scheduled_time || 'TBA'}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Center: Versus Matchup with ample space */}
                                <div className="flex-1 flex items-center justify-between gap-4 py-4 px-5 sm:px-7 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner">
                                    {/* Team A */}
                                    <div className="text-right flex items-center justify-end gap-2.5 min-w-0 flex-1">
                                        <span className="text-sm sm:text-base font-extrabold text-white truncate">
                                            {match.team_a_name}
                                        </span>
                                        {match.team_a_tag && (
                                            <span className="text-[11px] font-mono font-bold text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                                                [{match.team_a_tag}]
                                            </span>
                                        )}
                                    </div>

                                    {/* Score / VS */}
                                    <div className="px-4 py-2 rounded-xl bg-black/85 border border-white/15 text-sm sm:text-base font-mono font-black text-amber-400 shrink-0 shadow-lg text-center min-w-[70px]">
                                        {match.team_a_score !== null && match.team_b_score !== null
                                            ? `${match.team_a_score} - ${match.team_b_score}`
                                            : 'VS'}
                                    </div>

                                    {/* Team B */}
                                    <div className="text-left flex items-center justify-start gap-2.5 min-w-0 flex-1">
                                        {match.team_b_tag && (
                                            <span className="text-[11px] font-mono font-bold text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                                                [{match.team_b_tag}]
                                            </span>
                                        )}
                                        <span className="text-sm sm:text-base font-extrabold text-white truncate">
                                            {match.team_b_name}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Live Stream & Actions */}
                                <div className="flex items-center justify-end gap-2.5 shrink-0 border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0">
                                    {match.stream_url ? (
                                        <a
                                            href={match.stream_url} // redirect
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/35 text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors"
                                            title="Watch Stream"
                                        >
                                            <Tv className="w-4 h-4 text-amber-400" />
                                            <span>Stream</span>
                                        </a>
                                    ) : null}

                                    <Link
                                        href={route('admin.matches.edit', match.id)} // redirect
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/30 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                                        title="Edit Match"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setDeleteModalState({ isOpen: true, item: match })} // trigger
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                        title="Delete Match"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
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
                                onClick={() => setDeleteModalState({ isOpen: false, item: null })}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
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