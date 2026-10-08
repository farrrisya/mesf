// --1. imports--
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Search, ArrowRight, Tv, Shield, X } from 'lucide-react';
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

    // reset all active filters
    const handleResetFilters = () => { // trigger
        setStatusFilter('All Matches'); // state
        setGameFilter('All Games'); // state
        setSearchQuery(''); // state
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title="Match Schedule - MESF" />

            {/* ambient background glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-slate-600/10 blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[160px]" />
            </div>

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="matches" />
            </div>

            {/* 1. hero header with tournament background (exact match with Leagues page) */}
            <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] max-h-[460px] min-h-[260px] overflow-hidden">
                {/* HD tournament esports athlete image with bottom focus */}
                <img
                    src="/images/matches_hero_banner_hd.jpg?v=2"
                    alt="MESF Esports Match Fixtures"
                    className="absolute inset-0 w-full h-full object-cover object-bottom filter brightness-[0.94] contrast-[1.05] saturate-[1.08]"
                />

                {/* cinematic gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/90 via-[#070B14]/65 to-transparent/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/70 via-transparent to-transparent pointer-events-none" />

                {/* left-aligned header container */}
                <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-16 sm:pt-20">
                    <div className="text-left space-y-3 sm:space-y-4">
                        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-neutral-300 uppercase block">
                            Malaysia Esports Federation
                        </span>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-white drop-shadow-2xl">
                            Matches
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed whitespace-normal md:whitespace-nowrap">
                            Official schedule of upcoming matches and tournament results.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. minimalist filter toolbar & search */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 text-left">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* minimalist status filter tabs */}
                        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                            {DEFAULT_STATUS_FILTERS.map((filter) => {
                                const isActive = statusFilter === filter; // check
                                const isLiveTab = filter === 'Live';
                                return (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setStatusFilter(filter)} // filter
                                        className={`text-xs uppercase tracking-wider font-semibold pb-3.5 transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                                            isActive
                                                ? 'text-white border-b-2 border-white'
                                                : 'text-neutral-400 hover:text-neutral-200 border-b-2 border-transparent'
                                        }`}
                                    >
                                        {isLiveTab && stats.live > 0 && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        )}
                                        <span>{filter}</span>
                                        {isLiveTab && stats.live > 0 && (
                                            <span className="text-[10px] font-mono text-emerald-400">({stats.live})</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* minimalist search box */}
                        <div className="w-full sm:w-56 md:w-64 pb-3.5 sm:pb-3">
                            <div className="relative flex items-center">
                                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery} // state
                                    onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                    placeholder="Search match or team..."
                                    className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-white/30 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')} // trigger
                                        className="absolute right-2 text-neutral-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* game filter chips */}
                    {availableGames.length > 2 && (
                        <div className="flex flex-wrap items-center gap-1.5 pb-4">
                            {availableGames.map((game) => {
                                const isActive = gameFilter === game; // check
                                return (
                                    <button
                                        key={game}
                                        type="button"
                                        onClick={() => setGameFilter(game)} // filter
                                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                            isActive
                                                ? 'bg-white text-black font-semibold'
                                                : 'bg-white/[0.03] hover:bg-white/10 text-neutral-400 hover:text-white border border-white/[0.06]'
                                        }`}
                                    >
                                        {game}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. clean organized match schedule list */}
            <div className="flex-1">
                <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-left">
                    {filteredGroups.length === 0 ? (
                        <div className="py-20 text-center rounded-2xl border border-white/10 bg-[#090E1A]/80 backdrop-blur-xl p-8 space-y-4 max-w-xl mx-auto">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-bold text-base">
                                    {baseGroups.length === 0
                                        ? 'No Matches Scheduled'
                                        : 'No matching fixtures found'}
                                </p>
                                <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed">
                                    {baseGroups.length === 0
                                        ? 'There are currently no active matches published by administration. Check back soon for upcoming tournaments and schedules.'
                                        : 'No matches currently match your selected filters. Try choosing a different status or resetting filters.'}
                                </p>
                            </div>
                            {baseGroups.length > 0 && (
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleResetFilters} // trigger
                                        className="px-5 py-2 rounded-xl bg-white text-black text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer hover:bg-neutral-200"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {filteredGroups.map((group, groupIdx) => (
                                <section key={groupIdx} className="space-y-3.5">
                                    {/* clean date section header */}
                                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                                            <h2 className="text-xs sm:text-sm font-bold font-mono text-neutral-200 tracking-wider uppercase">
                                                {group.date}
                                            </h2>
                                        </div>
                                        <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                                            {group.matches.length} {group.matches.length === 1 ? 'Match' : 'Matches'}
                                        </div>
                                    </div>

                                    {/* match cards list */}
                                    <div className="space-y-3">
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
                                                    className={`group relative flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-4 sm:p-5 rounded-xl border backdrop-blur-xl transition-colors duration-200 overflow-hidden ${
                                                        isLive
                                                            ? 'border-emerald-500/40 bg-[#08151D]/90 hover:bg-[#0A1A24]'
                                                            : 'border-white/[0.08] hover:border-white/20 bg-[#090E1A]/90 hover:bg-[#0D1527]'
                                                    }`}
                                                >
                                                    {/* left: tournament meta info */}
                                                    <div className="flex flex-col items-start justify-center gap-1.5 lg:w-60 shrink-0 text-left">
                                                        {/* game & format tag row */}
                                                        <div className="flex items-center gap-2 text-[10px] font-mono">
                                                            <span className="text-neutral-300 font-semibold uppercase tracking-wider">
                                                                {match.game || 'Esports'}
                                                            </span>
                                                            <span className="text-neutral-600">•</span>
                                                            <span className="text-neutral-500 uppercase">
                                                                {match.format || 'BO3'}
                                                            </span>
                                                        </div>

                                                        {/* tournament title */}
                                                        <h3 className="text-sm font-bold text-neutral-100 group-hover:text-white transition-colors tracking-tight line-clamp-1">
                                                            {match.tournament}
                                                        </h3>

                                                        {/* stage & venue */}
                                                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
                                                            <span>{match.stage}</span>
                                                            {match.venue && (
                                                                <>
                                                                    <span className="text-neutral-600">•</span>
                                                                    <span className="inline-flex items-center gap-1 text-neutral-400 line-clamp-1 truncate">
                                                                        <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                                                                        <span className="truncate">{match.venue}</span>
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* status / time */}
                                                        <div className="pt-0.5">
                                                            {isLive ? (
                                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                                    Live Now
                                                                </span>
                                                            ) : isCompleted ? (
                                                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                                                                    Concluded
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-300">
                                                                    <Clock className="w-3 h-3 text-neutral-500" />
                                                                    <span>{match.time}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* center: teams showdown arena */}
                                                    <div className="flex-1 flex items-center justify-between sm:justify-center gap-4 sm:gap-6 py-3 lg:py-0 border-y lg:border-y-0 lg:border-x border-white/[0.06] lg:px-6">
                                                        {/* team A side (right-aligned) */}
                                                        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
                                                            <div className="text-right min-w-0">
                                                                <div className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                                                                    {match.teamA.name}
                                                                </div>
                                                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                                                                    [{match.teamA.tag || getTeamInitials(match.teamA.name, match.teamA.tag)}]
                                                                </span>
                                                            </div>

                                                            {/* team A logo container */}
                                                            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-[#050810] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
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
                                                                        className="h-full w-full object-contain"
                                                                    />
                                                                ) : null}
                                                                <div
                                                                    className="h-full w-full rounded bg-white/5 items-center justify-center"
                                                                    style={{ display: match.teamA.logo ? 'none' : 'flex' }}
                                                                >
                                                                    <span className="text-[10px] font-bold text-white font-mono">
                                                                        {getTeamInitials(match.teamA.name, match.teamA.tag)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* center: Scoreboard or VS */}
                                                        <div className="shrink-0 flex flex-col items-center justify-center px-1">
                                                            {hasScores ? (
                                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/10 font-mono">
                                                                    <span className={`text-sm sm:text-base font-bold ${isTeamAWinner ? 'text-emerald-400' : 'text-white'}`}>
                                                                        {scoreA}
                                                                    </span>
                                                                    <span className="text-neutral-600 text-xs">:</span>
                                                                    <span className={`text-sm sm:text-base font-bold ${isTeamBWinner ? 'text-emerald-400' : 'text-white'}`}>
                                                                        {scoreB}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="px-2.5 py-0.5 rounded bg-white/[0.04] border border-white/10 text-neutral-400 text-[10px] font-mono font-bold">
                                                                    VS
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* team B side (left-aligned) */}
                                                        <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
                                                            {/* team B logo container */}
                                                            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-[#050810] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
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
                                                                        className="h-full w-full object-contain"
                                                                    />
                                                                ) : null}
                                                                <div
                                                                    className="h-full w-full rounded bg-white/5 items-center justify-center"
                                                                    style={{ display: match.teamB.logo ? 'none' : 'flex' }}
                                                                >
                                                                    <span className="text-[10px] font-bold text-white font-mono">
                                                                        {getTeamInitials(match.teamB.name, match.teamB.tag)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="text-left min-w-0">
                                                                <div className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                                                                    {match.teamB.name}
                                                                </div>
                                                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                                                                    [{match.teamB.tag || getTeamInitials(match.teamB.name, match.teamB.tag)}]
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* right: match action */}
                                                    <div className="flex items-center justify-end lg:w-36 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                router.visit(match.id ? `/matches/${match.id}` : '/matches/details'); // redirect
                                                            }}
                                                            className={`w-full lg:w-auto px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                                                isLive
                                                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
                                                                    : 'bg-white/[0.05] hover:bg-white text-neutral-300 hover:text-black border border-white/10'
                                                            }`}
                                                        >
                                                            {isLive ? (
                                                                <>
                                                                    <Tv className="w-3.5 h-3.5" />
                                                                    <span>Watch</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span>Details</span>
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
            </div>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}
