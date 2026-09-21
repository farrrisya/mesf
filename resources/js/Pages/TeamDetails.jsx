// --1. imports--
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const TEAMS_DATABASE = {
    'default': {
        name: 'Team Name',
        tag: 'TAG',
        slug: 'team-name',
        motto: 'Motto',
        region: 'Location',
        country: 'Country',
        flag: '🇲🇾',
        status: 'Status',
        created: 'Date',
        founder: 'Founder Name',
        headCoach: 'Coach Name',
        headCoachNat: '🇲🇾',
        assistantCoach: 'Coach Name',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'Game Title',
        stats: {
            circuit: 'Circuit Title',
            winRate: 'Win Rate',
            placement: 'Standing',
            tier: 'Status'
        },
        roster: [
            { id: 1, ign: 'Player 1', name: 'Full Name', role: 'Role', flag: '🇲🇾', status: 'Status' },
            { id: 2, ign: 'Player 2', name: 'Full Name', role: 'Role', flag: '🇲🇾', status: 'Status' },
            { id: 3, ign: 'Player 3', name: 'Full Name', role: 'Role', flag: '🇲🇾', status: 'Status' },
            { id: 4, ign: 'Player 4', name: 'Full Name', role: 'Role', flag: '🇲🇾', status: 'Status' },
            { id: 5, ign: 'Player 5', name: 'Full Name', role: 'Role', flag: '🇲🇾', status: 'Status' }
        ],
        recentMatches: [
            { opponent: 'Opponent Title', result: 'Result', score: 'Score', stage: 'Stage Title' },
            { opponent: 'Opponent Title', result: 'Result', score: 'Score', stage: 'Stage Title' }
        ]
    }
};

// --3. main component--
export default function TeamDetails({ teamSlug = 'default' }) {
    // --4. actions--
    const team = TEAMS_DATABASE[teamSlug] || TEAMS_DATABASE['default']; // state

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden antialiased">
            <Head title={`${team.name} - Team Profile - MESF`} />

            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
            <div className="pointer-events-none absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[140px]" />

            {/* Grain Overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Floating Glass Navbar */}
            <PublicNavbar activeTab="teams" />

            {/* Main Content Area */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-24 text-left">
                {/* Top Navigation Breadcrumb */}
                <div className="mb-8">
                    <Link
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider text-neutral-300 hover:text-white transition-all duration-200"
                        href="/teams"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span>Back to Directory</span>
                    </Link>
                </div>

                {/* Team Hero Profile Box */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl p-8 sm:p-12 mb-12 shadow-2xl">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        {/* Emblem & Name Block */}
                        <div className="flex items-center gap-6 sm:gap-8">
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-[#0B1120] border border-white/15 flex items-center justify-center shrink-0 p-3 shadow-inner">
                                <span className="text-2xl sm:text-3xl font-black tracking-widest text-amber-400 uppercase">
                                    {team.tag}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                                        [ {team.status} ]
                                    </span>
                                    <span className="text-neutral-600 text-xs">•</span>
                                    <span className="text-xs text-neutral-400 font-medium">
                                        {team.flag} {team.region}
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                                    {team.name}
                                </h1>
                                <p className="text-sm italic text-neutral-400 font-normal">
                                    &ldquo;{team.motto}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* High-Level Overview Badges */}
                        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                            <div className="px-5 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] min-w-[130px]">
                                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Circuit</span>
                                <span className="text-sm sm:text-base font-bold text-white">{team.stats.circuit}</span>
                            </div>
                            <div className="px-5 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] min-w-[110px]">
                                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Standing</span>
                                <span className="text-sm sm:text-base font-bold text-amber-400">{team.stats.placement}</span>
                            </div>
                            <div className="px-5 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] min-w-[110px]">
                                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Est.</span>
                                <span className="text-sm sm:text-base font-bold text-white">2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2-Column Split: Active Lineup (Left ~65%) & Org Metadata (Right ~35%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
                    {/* Left Column: Active Player Roster */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase block mb-1">
                                    Competitive Lineup
                                </span>
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {team.primaryGame}
                                </h2>
                            </div>
                            <span className="text-xs text-neutral-500 font-medium">{team.roster.length} Registered</span>
                        </div>

                        {/* Player Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            {team.roster.map((player) => (
                                <div
                                    key={player.id}
                                    className="group p-5 rounded-2xl border border-white/10 bg-white/[0.015] hover:bg-white/[0.04] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-200 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-amber-400/30 transition-colors">
                                            <span className="text-sm font-bold text-neutral-400 group-hover:text-amber-400 transition-colors">
                                                {player.ign.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                                    {player.ign}
                                                </h3>
                                                <span className="text-xs">{player.flag}</span>
                                            </div>
                                            <p className="text-xs text-neutral-400 truncate">
                                                {player.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="inline-block px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                                            {player.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Match Performance */}
                        <div className="pt-6">
                            <h3 className="text-sm font-bold tracking-widest text-neutral-400 uppercase mb-4">
                                Recent League Fixtures
                            </h3>
                            <div className="divide-y divide-white/5 border-y border-white/10">
                                {team.recentMatches.map((match, idx) => (
                                    <div key={idx} className="py-4 flex items-center justify-between text-sm">
                                        <div className="space-y-0.5">
                                            <span className="text-neutral-200 font-semibold">{match.opponent}</span>
                                            <span className="text-xs text-neutral-500 block">{match.stage}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-neutral-300">{match.score}</span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                                                    match.result === 'WIN'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                }`}
                                            >
                                                {match.result}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Coaching Staff & Franchise Metadata */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-5">
                            <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase pb-2 border-b border-white/10">
                                Organization Details
                            </h3>

                            <div className="space-y-4 text-xs sm:text-sm">
                                <div>
                                    <span className="text-neutral-500 block text-[11px] uppercase tracking-wider mb-0.5">Founder</span>
                                    <span className="text-neutral-200 font-semibold">{team.founder}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 block text-[11px] uppercase tracking-wider mb-0.5">Head Coach</span>
                                    <span className="text-neutral-200 font-semibold">{team.headCoach} {team.headCoachNat}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 block text-[11px] uppercase tracking-wider mb-0.5">Assistant Coach</span>
                                    <span className="text-neutral-200 font-semibold">{team.assistantCoach} {team.assistantCoachNat}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 block text-[11px] uppercase tracking-wider mb-0.5">Sanctioned Registry</span>
                                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> MESF Certified Tier 1
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Official Channels Widget (Anti-flicker stabilized) */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0F1D]/80 transform-gpu backface-hidden">
                            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-3">
                                Official Channels
                            </span>
                            <div className="flex items-center gap-2.5">
                                <a
                                    href="https://www.instagram.com/teamvamos.my/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5"
                                >
                                    <span>Instagram</span>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
