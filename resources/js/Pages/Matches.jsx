// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const MATCH_GROUPS = [
    {
        date: 'Date',
        matches: [
            {
                id: 1,
                tournament: 'Title',
                stage: 'Stage',
                game: 'Tag',
                format: 'Format',
                time: 'Time',
                status: 'Status',
                teamA: { name: 'Team A', logo: null, score: null },
                teamB: { name: 'Team B', logo: null, score: null }
            },
            {
                id: 2,
                tournament: 'Title',
                stage: 'Stage',
                game: 'Tag',
                format: 'Format',
                time: 'Time',
                status: 'Status',
                teamA: { name: 'Team A', logo: null, score: null },
                teamB: { name: 'Team B', logo: null, score: null }
            }
        ]
    },
    {
        date: 'Date',
        matches: [
            {
                id: 3,
                tournament: 'Title',
                stage: 'Stage',
                game: 'Tag',
                format: 'Format',
                time: 'Time',
                status: 'Status',
                teamA: { name: 'Team A', logo: null, score: null },
                teamB: { name: 'Team B', logo: null, score: null }
            },
            {
                id: 4,
                tournament: 'Title',
                stage: 'Stage',
                game: 'Tag',
                format: 'Format',
                time: 'Time',
                status: 'Status',
                teamA: { name: 'Team A', logo: null, score: null },
                teamB: { name: 'Team B', logo: null, score: null }
            }
        ]
    }
];

const STATUS_FILTERS = ['All Matches', 'Status'];
const GAME_FILTERS = ['All Games', 'Tag'];

// --3. main component--
export default function Matches() {
    // --4. actions--
    const [statusFilter, setStatusFilter] = useState('All Matches'); // state
    const [gameFilter, setGameFilter] = useState('All Games'); // state

    // filter match groups and their nested matches
    const filteredGroups = MATCH_GROUPS.map((group) => {
        const matches = group.matches.filter((m) => {
            // filter by status
            if (statusFilter === 'Live' && m.status !== 'LIVE') return false; // check
            if (statusFilter === 'Upcoming' && m.status !== 'UPCOMING') return false; // check
            if (statusFilter === 'Results' && m.status !== 'RESULTS' && m.status !== 'COMPLETED') return false; // check

            // filter by game
            if (gameFilter !== 'All Games') {
                if (m.game && m.game !== gameFilter && m.game !== 'All Games') return false; // check
            }

            return true;
        });

        return { ...group, matches };
    }).filter((group) => group.matches.length > 0);

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

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-10"
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="mb-2">
                                <span className="text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                                    [ National Esports Fixtures ]
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white leading-tight">
                                Match Schedule
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl font-normal leading-relaxed">
                                Official fixtures, live tournament series, and verified results across Malaysian esports circuits.
                            </p>
                        </div>
                    </div>

                    {/* dual filter bar: status pills & game category pills */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                        {/* status pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1 hidden sm:inline-block">
                                Status:
                            </span>
                            {STATUS_FILTERS.map((filter) => {
                                const isActive = statusFilter === filter;
                                return (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setStatusFilter(filter)} // filter
                                        className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer select-none ${
                                            isActive
                                                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                                                : 'border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                );
                            })}
                        </div>

                        {/* game category pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1 hidden sm:inline-block">
                                Game:
                            </span>
                            {GAME_FILTERS.map((game) => {
                                const isActive = gameFilter === game;
                                return (
                                    <button
                                        key={game}
                                        type="button"
                                        onClick={() => setGameFilter(game)} // filter
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer select-none ${
                                            isActive
                                                ? 'border border-amber-400/80 bg-amber-400/15 text-amber-300 font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                                                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/20'
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
                    <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                        <p className="text-neutral-400 text-sm">No matches found for the selected filters.</p>
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('All Matches'); // state
                                setGameFilter('All Games'); // state
                            }}
                            className="mt-4 px-4 py-2 rounded-full border border-white/15 text-xs text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredGroups.map((group, groupIdx) => (
                            <section key={groupIdx} className="space-y-4">
                                {/* date section header */}
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                    <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-neutral-300">
                                        {group.date}
                                    </h2>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
                                </div>

                                {/* match rows list */}
                                <div className="space-y-4">
                                    {group.matches.map((match) => {
                                        const isLive = match.status === 'LIVE';
                                        return (
                                            <div
                                                key={match.id}
                                                className={`group relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7 md:p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                                                    isLive
                                                        ? 'border-emerald-500/30 bg-emerald-950/[0.08] hover:border-emerald-500/50 shadow-[0_10px_35px_rgba(16,185,129,0.06)]'
                                                        : 'border-white/10 bg-white/[0.02] hover:border-amber-400/40 hover:bg-white/[0.04] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                                                }`}
                                            >
                                                {/* left: tournament meta info */}
                                                <div className="flex flex-wrap lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-2 lg:w-64 shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                                            {match.tournament}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/10 text-neutral-300 uppercase">
                                                            {match.format}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-neutral-400 font-medium">
                                                        {match.stage}
                                                    </span>

                                                    {/* match time / live badge */}
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {isLive ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                                                                <span className="relative flex h-2 w-2">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                                                </span>
                                                                LIVE
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/5 text-neutral-300 border border-white/10">
                                                                <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {match.time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* center: teams match display */}
                                                <div className="flex-1 flex items-center justify-between sm:justify-center gap-4 sm:gap-8 md:gap-12 py-3 lg:py-0 border-y lg:border-y-0 border-white/5">
                                                    {/* team A */}
                                                    <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
                                                        <span className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight text-right group-hover:text-amber-200 transition-colors">
                                                            {match.teamA.name}
                                                        </span>
                                                        <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                                                            {match.teamA.logo ? (
                                                                <img
                                                                    src={match.teamA.logo}
                                                                    alt={match.teamA.name}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.nextSibling) {
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }
                                                                    }}
                                                                    className="h-8 w-8 object-contain"
                                                                />
                                                            ) : null}
                                                            <span
                                                                className="text-xs font-black text-amber-400 tracking-wider"
                                                                style={{ display: match.teamA.logo ? 'none' : 'block' }}
                                                            >
                                                                {match.teamA.name.substring(0, 2).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        {match.teamA.score !== null && (
                                                            <span className="text-2xl sm:text-3xl font-black text-white px-2">
                                                                {match.teamA.score}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* VS badge / divider */}
                                                    <div className="shrink-0 flex flex-col items-center justify-center px-2">
                                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-widest uppercase bg-black/60 border border-white/10 text-neutral-400">
                                                            VS
                                                        </span>
                                                    </div>

                                                    {/* team B */}
                                                    <div className="flex-1 flex items-center justify-start gap-3 sm:gap-4">
                                                        {match.teamB.score !== null && (
                                                            <span className="text-2xl sm:text-3xl font-black text-white px-2">
                                                                {match.teamB.score}
                                                            </span>
                                                        )}
                                                        <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                                                            {match.teamB.logo ? (
                                                                <img
                                                                    src={match.teamB.logo}
                                                                    alt={match.teamB.name}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.nextSibling) {
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }
                                                                    }}
                                                                    className="h-8 w-8 object-contain"
                                                                />
                                                            ) : null}
                                                            <span
                                                                className="text-xs font-black text-amber-400 tracking-wider"
                                                                style={{ display: match.teamB.logo ? 'none' : 'block' }}
                                                            >
                                                                {match.teamB.name.substring(0, 2).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight text-left group-hover:text-amber-200 transition-colors">
                                                            {match.teamB.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* right: match action */}
                                                <div className="flex items-center justify-end lg:w-44 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            router.visit(match.id ? `/matches/${match.id}` : '/matches/details'); // redirect
                                                        }}
                                                        className={`w-full lg:w-auto px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                                                            isLive
                                                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                                                                : 'bg-white/[0.04] hover:bg-amber-400 hover:text-black border border-white/10 hover:border-amber-400 text-white'
                                                        }`}
                                                    >
                                                        <span>{isLive ? 'Watch Stream' : 'Match Details'}</span>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                        </svg>
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
