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
    ExternalLink
} from 'lucide-react';

// --2. main component--
export default function Matches({ matches = [] }) {
    // --3. actions--
    const [searchQuery, setSearchQuery] = useState(''); // state

    const filteredMatches = matches.filter((match) => { // check
        return (match.tournament_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (match.game_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (match.team_a_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (match.team_b_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleDelete = (id, tournament) => { // trigger
        if (confirm(`Are you sure you want to delete fixture for "${tournament}"?`)) { // check
            router.delete(route('admin.matches.destroy', id), { // save
                preserveScroll: true
            });
        }
    };

    // --4. UI--
    return (
        <AdminLayout title="Matches Management - MESF Admin">
            <Head title="Matches Management - Admin" />

            <div className="space-y-6 max-w-7xl">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        {filteredMatches.map((match) => (
                            <div
                                key={match.id}
                                className="group bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 hover:border-amber-400/40 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* header row */}
                                    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md">
                                                {match.status}
                                            </span>
                                            <span className="text-xs text-white/70 font-semibold">
                                                {match.game_title}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(match.id, match.tournament_name)} // trigger
                                            className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            title="Delete Fixture"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* tournament & round */}
                                    <div>
                                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                                            {match.tournament_name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                            <span>{match.round || 'Tournament Stage'}</span>
                                            {match.format && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono text-amber-400/90">{match.format}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* versus box */}
                                    <div className="py-4 px-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="text-left flex-1">
                                            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                                                {match.team_a_tag ? `[${match.team_a_tag}]` : 'TEAM A'}
                                            </span>
                                            <p className="text-sm font-extrabold text-white">
                                                {match.team_a_name}
                                            </p>
                                        </div>

                                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-amber-400 shrink-0">
                                            {match.team_a_score !== null && match.team_b_score !== null
                                                ? `${match.team_a_score} - ${match.team_b_score}`
                                                : 'VS'}
                                        </div>

                                        <div className="text-right flex-1">
                                            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                                                {match.team_b_tag ? `[${match.team_b_tag}]` : 'TEAM B'}
                                            </span>
                                            <p className="text-sm font-extrabold text-white">
                                                {match.team_b_name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* fixture metadata */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                            <span>{match.formatted_date}</span>
                                        </div>
                                        {match.scheduled_time && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{match.scheduled_time}</span>
                                            </div>
                                        )}
                                        {match.venue && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="truncate max-w-[140px]">{match.venue}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                                    {match.stream_url ? (
                                        <a
                                            href={match.stream_url} // redirect
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
                                        >
                                            <Tv className="w-3.5 h-3.5" />
                                            <span>Live Stream</span>
                                        </a>
                                    ) : (
                                        <span className="text-slate-500 font-mono text-[11px]">Stream TBA</span>
                                    )}

                                    <a
                                        href="/matches" // redirect
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Public Schedule</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}