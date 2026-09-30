// --1. imports--
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trophy, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const STATUS_FILTERS = ['All Events', 'Live', 'Upcoming', 'Completed'];

// --3. main component--
export default function Leagues({ leagues = [] }) {
    // --4. actions--
    const [activeFilter, setActiveFilter] = useState('All Events'); // state

    const items = leagues || []; // state

    const filteredTournaments = items.filter((item) => { // check
        if (activeFilter === 'All Events') return true; // check
        const s = (item.status || '').toUpperCase();
        if (activeFilter === 'Live') return s.includes('LIVE'); // check
        if (activeFilter === 'Upcoming') return s.includes('UPCOMING') || s.includes('REGISTRATION') || s === 'STATUS'; // check
        if (activeFilter === 'Completed') return s.includes('COMPLETED') || s.includes('OFF-SEASON'); // check
        return true; // filter
    });

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title="Leagues & Circuits - MESF" />

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

            {/* ambient background glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-amber-600/10 blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[160px]" />
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
                <PublicNavbar activeTab="leagues" />
            </div>

            {/* 1. hero header with leagues championship background (natural wide aspect ratio, zero zoom-in) */}
            <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] max-h-[460px] min-h-[260px] overflow-hidden">
                {/* HD leagues banner image */}
                <img
                    src="/images/leagues_hero_banner_hd.jpg"
                    alt="MESF Leagues & Tournaments"
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.94] contrast-[1.05] saturate-[1.08]"
                />

                {/* cinematic gradient overlays: dark on left for clean left-aligned text, smooth fade at bottom */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/90 via-[#070B14]/65 to-transparent/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/70 via-transparent to-transparent pointer-events-none" />

                {/* left-aligned header container (matches Teams and Matches page) */}
                <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-16 sm:pt-20">
                    <div className="text-left space-y-3 sm:space-y-4">
                        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-amber-400 uppercase block">
                            Malaysia Esports Federation
                        </span>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-white drop-shadow-2xl">
                            Leagues
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed whitespace-normal md:whitespace-nowrap">
                            Official national leagues, sanctioned tournaments, and competitive circuits.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. filter toolbar */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    {/* status filter pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {STATUS_FILTERS.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)} // filter
                                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none ${
                                        isActive
                                            ? 'bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.2)] border border-white'
                                            : 'border border-white/15 bg-[#0e1628]/90 text-neutral-300 hover:text-white hover:border-white/30 hover:bg-[#131d33]'
                                    }`}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 3. 2-column tournament grid */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-left">
                {filteredTournaments.length === 0 ? (
                    <div className="py-20 text-center rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl shadow-xl">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <p className="text-white font-bold text-base">
                            {items.length === 0
                                ? 'No Leagues or Circuits Scheduled'
                                : 'No leagues found'}
                        </p>
                        <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
                            {items.length === 0
                                ? 'There are currently no active leagues published by administration. Check back soon for upcoming tournaments and circuits.'
                                : 'No leagues currently match your selected filters. Try choosing a different status or resetting filters.'}
                        </p>
                        {items.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveFilter('All Events')} // state
                                className="mt-5 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-xs font-bold text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredTournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="group flex flex-col rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl overflow-hidden hover:border-white/30 transition-all duration-300 shadow-xl"
                            >
                                {/* visual banner area */}
                                <div className="aspect-[21/9] w-full overflow-hidden relative bg-[#0A0F1D] flex items-center justify-center border-b border-white/10">
                                    {/* banner image or fallback */}
                                    {tournament.banner ? (
                                        <img
                                            src={tournament.banner}
                                            alt={tournament.title}
                                            className="w-full h-full object-cover z-10"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-2 text-neutral-600 z-10">
                                            <Trophy className="w-8 h-8 opacity-40 text-neutral-400" />
                                            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">MESF Sanctioned League</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent pointer-events-none" />

                                    {/* top badges */}
                                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                                        <span className="px-3 py-1 rounded-md text-[11px] font-black tracking-widest uppercase bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-md">
                                            {tournament.game}
                                        </span>

                                        <span className="px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md bg-white/10 text-neutral-200 border-white/20 shadow-md">
                                            {tournament.status}
                                        </span>
                                    </div>
                                </div>

                                {/* content area with generous padding */}
                                <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between text-left">
                                    <div>
                                        {/* meta row */}
                                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                                            <span className="text-amber-400 font-bold">{tournament.game}</span>
                                            <span>•</span>
                                            <span>{tournament.date}</span>
                                        </div>

                                        {/* tournament name */}
                                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white transition-colors duration-200 my-4 sm:my-5 leading-snug">
                                            {tournament.title}
                                        </h2>

                                        {/* venue / location label */}
                                        {tournament.location && (
                                            <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium mb-3">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                <span className="truncate">{tournament.location}</span>
                                            </div>
                                        )}

                                        {/* description */}
                                        {tournament.description && (
                                            <p className="pt-1 text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                                                {tournament.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* footer action row inside card */}
                                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
                                            Circuit Info
                                        </span>

                                        <Link
                                            href={tournament.slug ? `/leagues/${tournament.slug}` : '/leagues/details'} // redirect
                                            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                        >
                                            <span>View Details</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}
