// --1. imports--
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Search, ArrowRight, Tv, Shield, Trophy, Sparkles } from 'lucide-react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const DEFAULT_STATUS_FILTERS = ['All Matches', 'Live', 'Upcoming', 'Results'];

// helper to get team initials if logo is absent
function getTeamInitials(name = '', tag = '') { // convert
    if (tag && tag.length <= 4) return tag;
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (name.slice(0, 3) || 'T').toUpperCase();
}

// --3. main component--
export default function Matches({ matchGroups = [] }) {
    // --4. actions--
    const baseGroups = matchGroups || []; // state

    const [statusFilter, setStatusFilter] = useState('All Matches'); // state
    const [gameFilter, setGameFilter] = useState('All Games'); // state
    const [searchQuery, setSearchQuery] = useState(''); // state

    // extract unique game categories
    const availableGames = useMemo(() => { // check
        const games = new Set();
        baseGroups.forEach((g) => {
            g.matches.forEach((m) => {
                if (m.game) games.add(m.game);
            });
        });
        return ['All Games', ...Array.from(games)];
    }, [baseGroups]);

    // total match count stats
    const stats = useMemo(() => { // check
        let total = 0;
        let live = 0;
        let upcoming = 0;
        let results = 0;

        baseGroups.forEach((g) => {
            g.matches.forEach((m) => {
                total++;
                const s = (m.status || '').toUpperCase();
                if (s.includes('LIVE')) live++;
                else if (s.includes('COMPLETED') || s.includes('RESULT') || m.teamA?.score !== null) results++;
                else upcoming++;
            });
        });

        return { total, live, upcoming, results };
    }, [baseGroups]);

    // filter match groups and their nested matches
    const filteredGroups = useMemo(() => { // filter
        const query = searchQuery.trim().toLowerCase();

        return baseGroups
            .map((group) => {
                const matches = group.matches.filter((m) => {
                    // status filter
                    const s = (m.status || '').toUpperCase();
                    const isMatchLive = s.includes('LIVE');
                    const isMatchCompleted = s.includes('COMPLETED') || s.includes('RESULT') || (m.teamA?.score !== null && m.teamB?.score !== null && !isMatchLive);
                    const isMatchUpcoming = !isMatchLive && !isMatchCompleted;

                    if (statusFilter === 'Live' && !isMatchLive) return false; // check
                    if (statusFilter === 'Upcoming' && !isMatchUpcoming) return false; // check
                    if (statusFilter === 'Results' && !isMatchCompleted) return false; // check

                    // game filter
                    if (gameFilter !== 'All Games' && m.game !== gameFilter) return false; // check

                    // text search query
                    if (query) {
                        const tournamentMatch = (m.tournament || '').toLowerCase().includes(query);
                        const gameMatch = (m.game || '').toLowerCase().includes(query);
                        const teamAMatch = (m.teamA?.name || '').toLowerCase().includes(query) || (m.teamA?.tag || '').toLowerCase().includes(query);
                        const teamBMatch = (m.teamB?.name || '').toLowerCase().includes(query) || (m.teamB?.tag || '').toLowerCase().includes(query);
                        const venueMatch = (m.venue || '').toLowerCase().includes(query);
                        if (!tournamentMatch && !gameMatch && !teamAMatch && !teamBMatch && !venueMatch) {
                            return false; // check
                        }
                    }

                    return true;
                });

                return { ...group, matches };
            })
            .filter((group) => group.matches.length > 0);
    }, [baseGroups, statusFilter, gameFilter, searchQuery]);

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title="Match Schedule - MESF" />

            {/* custom animation for moving footer beam */}
            <style>{`
                @keyframes beamScan {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(400%);
                    }
                }
                .footer-beam {
                    animation: beamScan 12s linear infinite;
                }
            `}</style>

            {/* ambient background glows to add atmospheric depth */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-indigo-600/10 blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[160px]" />
            </div>

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="matches" />
            </div>

            {/* 2. hero & filter bar */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-8 text-left">
                <div className="flex flex-col gap-6 pb-6 border-b border-white/10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-white">
                                Matches
                            </h1>
                        </div>

                        {/* search bar */}
                        <div className="w-full lg:w-80 shrink-0">
                            <div className="relative">
                                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)} // input
                                    placeholder="Search team, game, or event..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/15 focus:border-white/40 focus:outline-none text-xs text-white placeholder-neutral-500 transition-colors shadow-inner"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')} // trigger
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* dual filter bar: status pills & game category pills */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-white/5">
                        {/* status pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {DEFAULT_STATUS_FILTERS.map((filter) => {
                                const isActive = statusFilter === filter;
                                const isLiveTab = filter === 'Live';
                                return (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setStatusFilter(filter)} // filter
                                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-2 ${
                                            isActive
                                                ? 'bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.2)] border border-white'
                                                : 'border border-white/15 bg-[#0e1628]/90 text-neutral-300 hover:text-white hover:border-white/30 hover:bg-[#131d33]'
                                        }`}
                                    >
                                        {isLiveTab && stats.live > 0 && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                            </span>
                                        )}
                                        <span>{filter}</span>
                                        {filter === 'Live' && stats.live > 0 && (
                                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${isActive ? 'bg-black text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                {stats.live}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* game category pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1 hidden sm:inline-block">
                                Game:
                            </span>
                            {availableGames.map((game) => {
                                const isActive = gameFilter === game;
                                return (
                                    <button
                                        key={game}
                                        type="button"
                                        onClick={() => setGameFilter(game)} // filter
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer select-none ${
                                            isActive
                                                ? 'bg-[#1e293b] border border-white/40 text-white font-bold shadow-sm'
                                                : 'border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/25'
                                        }`}
                                    >
                                        {game}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. horizontal match schedule section */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pb-24 text-left">
                {filteredGroups.length === 0 ? (
                    <div className="py-20 text-center rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl shadow-xl">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <p className="text-white font-bold text-base">
                            {baseGroups.length === 0
                                ? 'No Match Fixtures Scheduled'
                                : 'No matches found'}
                        </p>
                        <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
                            {baseGroups.length === 0
                                ? 'There are currently no active match fixtures published by administration. Check back soon for upcoming tournaments and schedules.'
                                : 'No fixtures currently match your selected filters. Try choosing a different status or resetting filters.'}
                        </p>
                        {baseGroups.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter('All Matches'); // state
                                    setGameFilter('All Games'); // state
                                    setSearchQuery(''); // state
                                }}
                                className="mt-5 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-xs font-bold text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredGroups.map((group, groupIdx) => (
                            <section key={groupIdx} className="space-y-4">
                                {/* date section header */}
                                <div className="flex items-center gap-3">
                                    <div className="px-3.5 py-1.5 rounded-xl bg-[#0e1628] border border-white/15 text-xs font-extrabold uppercase tracking-widest text-neutral-200 shadow-sm flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>{group.date}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                                        • {group.matches.length} {group.matches.length === 1 ? 'Fixture' : 'Fixtures'}
                                    </span>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
                                </div>

                                {/* match cards list */}
                                <div className="space-y-4">
                                    {group.matches.map((match) => {
                                        const isLive = (match.status || '').toUpperCase().includes('LIVE');
                                        const hasScores = match.teamA?.score !== null && match.teamB?.score !== null;
                                        const isCompleted = !isLive && (hasScores || (match.status || '').toUpperCase().includes('COMPLETED') || (match.status || '').toUpperCase().includes('RESULT'));

                                        const scoreA = Number(match.teamA?.score ?? 0);
                                        const scoreB = Number(match.teamB?.score ?? 0);
                                        const isTeamAWinner = hasScores && scoreA > scoreB;
                                        const isTeamBWinner = hasScores && scoreB > scoreA;

                                        return (
                                            <div
                                                key={match.id}
                                                className={`group relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7 rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${
                                                    isLive
                                                        ? 'border-emerald-500/50 bg-gradient-to-br from-[#0b221d] via-[#0d1628] to-[#090e1a] shadow-[0_16px_40px_rgba(16,185,129,0.14)] ring-1 ring-emerald-500/30'
                                                        : 'border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] hover:border-white/30 hover:bg-[#121b30] shadow-[0_16px_40px_rgba(0,0,0,0.65)]'
                                                }`}
                                            >
                                                {/* top edge highlight beam */}
                                                <div
                                                    className={`absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r ${
                                                        isLive
                                                            ? 'from-transparent via-emerald-400 to-transparent opacity-80'
                                                            : 'from-transparent via-white/20 to-transparent group-hover:via-white/40 opacity-70'
                                                    }`}
                                                />

                                                {/* left: tournament meta info */}
                                                <div className="flex flex-col items-start justify-center gap-2 lg:w-64 shrink-0">
                                                    {/* game & format tag row */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/15">
                                                            {match.game || 'Esports'}
                                                        </span>
                                                        <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-[#070b14] text-neutral-300 border border-white/10 uppercase">
                                                            {match.format || 'BO3'}
                                                        </span>
                                                    </div>

                                                    {/* tournament title */}
                                                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight line-clamp-1 group-hover:text-neutral-100 transition-colors">
                                                        {match.tournament}
                                                    </h3>

                                                    {/* stage & venue */}
                                                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                                        <span>{match.stage}</span>
                                                        {match.venue && (
                                                            <>
                                                                <span className="text-neutral-600">•</span>
                                                                <span className="inline-flex items-center gap-1 text-neutral-400 line-clamp-1">
                                                                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                                                    {match.venue}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* match time / live status pill */}
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {isLive ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                                                                <span className="relative flex h-2 w-2">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                                                </span>
                                                                LIVE NOW
                                                            </span>
                                                        ) : isCompleted ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/5 text-neutral-400 border border-white/10">
                                                                Concluded
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#090d18] text-neutral-200 border border-white/15 shadow-inner">
                                                                <Clock className="w-3 h-3 text-neutral-400" />
                                                                {match.time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* center: teams showdown arena */}
                                                <div className="flex-1 flex items-center justify-between sm:justify-center gap-3 sm:gap-6 md:gap-8 py-4 lg:py-0 border-y lg:border-y-0 lg:border-x border-white/10 lg:px-6">
                                                    {/* team A side (right-aligned) */}
                                                    <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
                                                        <div className="text-right">
                                                            <div className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-snug">
                                                                {match.teamA.name}
                                                            </div>
                                                            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                                                                [{match.teamA.tag || getTeamInitials(match.teamA.name, match.teamA.tag)}]
                                                            </span>
                                                        </div>

                                                        {/* team A logo container */}
                                                        <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-2xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden shadow-lg ring-1 ring-white/10 p-2">
                                                            {match.teamA.logo ? (
                                                                <img
                                                                    src={match.teamA.logo}
                                                                    alt={match.teamA.name}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.nextSibling) {
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }
                                                                    }}
                                                                    className="h-full w-full object-contain filter drop-shadow"
                                                                />
                                                            ) : null}
                                                            <div
                                                                className="h-full w-full rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 items-center justify-center"
                                                                style={{ display: match.teamA.logo ? 'none' : 'flex' }}
                                                            >
                                                                <span className="text-xs sm:text-sm font-black text-white tracking-wider font-mono">
                                                                    {getTeamInitials(match.teamA.name, match.teamA.tag)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* center: VS badge or Scoreboard box */}
                                                    <div className="shrink-0 flex flex-col items-center justify-center px-1 sm:px-2">
                                                        {hasScores ? (
                                                            <div className="flex flex-col items-center gap-1">
                                                                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-black/80 border border-white/20 shadow-inner">
                                                                    <span className={`text-xl sm:text-2xl font-black ${isTeamAWinner ? 'text-emerald-400' : 'text-white'}`}>
                                                                        {scoreA}
                                                                    </span>
                                                                    <span className="text-neutral-500 font-bold text-xs">:</span>
                                                                    <span className={`text-xl sm:text-2xl font-black ${isTeamBWinner ? 'text-emerald-400' : 'text-white'}`}>
                                                                        {scoreB}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                                                                    {isLive ? 'LIVE' : 'FINAL'}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1">
                                                                <div className="px-3 py-1 rounded-xl bg-black/80 border border-white/20 text-neutral-200 text-xs font-black tracking-widest shadow-inner">
                                                                    VS
                                                                </div>
                                                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 font-mono">
                                                                    {match.format || 'BO3'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* team B side (left-aligned) */}
                                                    <div className="flex-1 flex items-center justify-start gap-3 sm:gap-4">
                                                        {/* team B logo container */}
                                                        <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-2xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden shadow-lg ring-1 ring-white/10 p-2">
                                                            {match.teamB.logo ? (
                                                                <img
                                                                    src={match.teamB.logo}
                                                                    alt={match.teamB.name}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.nextSibling) {
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }
                                                                    }}
                                                                    className="h-full w-full object-contain filter drop-shadow"
                                                                />
                                                            ) : null}
                                                            <div
                                                                className="h-full w-full rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 items-center justify-center"
                                                                style={{ display: match.teamB.logo ? 'none' : 'flex' }}
                                                            >
                                                                <span className="text-xs sm:text-sm font-black text-white tracking-wider font-mono">
                                                                    {getTeamInitials(match.teamB.name, match.teamB.tag)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="text-left">
                                                            <div className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-snug">
                                                                {match.teamB.name}
                                                            </div>
                                                            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                                                                [{match.teamB.tag || getTeamInitials(match.teamB.name, match.teamB.tag)}]
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* right: match action */}
                                                <div className="flex items-center justify-end lg:w-44 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            router.visit(match.id ? `/matches/${match.id}` : '/matches/details'); // redirect
                                                        }}
                                                        className={`w-full lg:w-auto px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                                                            isLive
                                                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                                                : 'bg-white hover:bg-neutral-200 text-black border border-white shadow-md font-extrabold'
                                                        }`}
                                                    >
                                                        {isLive ? (
                                                            <>
                                                                <Tv className="w-3.5 h-3.5" />
                                                                <span>Watch Live</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Match Details</span>
                                                                <ArrowRight className="w-3.5 h-3.5" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}

