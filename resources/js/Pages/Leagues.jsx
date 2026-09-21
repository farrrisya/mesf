// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const TOURNAMENTS = [
    {
        id: 1,
        slug: 'mpl-malaysia-s14',
        game: 'Tag',
        status: 'Status',
        date: 'Date',
        location: 'Location',
        title: 'Title',
        description: 'Description'
    },
    {
        id: 2,
        slug: 'mpl-malaysia-s14',
        game: 'Tag',
        status: 'Status',
        date: 'Date',
        location: 'Location',
        title: 'Title',
        description: 'Description'
    },
    {
        id: 3,
        slug: 'mpl-malaysia-s14',
        game: 'Tag',
        status: 'Status',
        date: 'Date',
        location: 'Location',
        title: 'Title',
        description: 'Description'
    },
    {
        id: 4,
        slug: 'mpl-malaysia-s14',
        game: 'Tag',
        status: 'Status',
        date: 'Date',
        location: 'Location',
        title: 'Title',
        description: 'Description'
    },
    {
        id: 5,
        slug: 'mpl-malaysia-s14',
        game: 'Tag',
        status: 'Status',
        date: 'Date',
        location: 'Location',
        title: 'Title',
        description: 'Description'
    },
    {
        id: 6,
        slug: 'mpl-malaysia-s14',
        game: 'Tag',
        status: 'Status',
        date: 'Date',
        location: 'Location',
        title: 'Title',
        description: 'Description'
    }
];

const STATUS_FILTERS = ['All Events', 'Live', 'Upcoming', 'Completed'];

// --3. main component--
export default function Leagues() {
    // --4. actions--
    const [activeFilter, setActiveFilter] = useState('All Events'); // state

    const filteredTournaments = TOURNAMENTS.filter((item) => {
        if (activeFilter === 'All Events') return true; // check
        if (activeFilter === 'Live') return item.status === 'LIVE'; // check
        if (activeFilter === 'Upcoming') return item.status === 'UPCOMING'; // check
        if (activeFilter === 'Completed') return item.status === 'COMPLETED'; // check
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

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="leagues" />
            </div>

            {/* 2. hero header */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-8 text-left">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
                    <div>
                        <div className="mb-2">
                            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                                [ Sanctioned Esports Circuits ]
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white leading-tight">
                            Leagues & Circuits
                        </h1>
                        <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl font-normal leading-relaxed">
                            Official championship leagues, state qualifying tournaments, and premier competitive stages across Malaysia.
                        </p>
                    </div>

                    {/* status filter pills */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
                        {STATUS_FILTERS.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)} // filter
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
                </div>
            </header>

            {/* 3. 2-column tournament grid */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pb-24 text-left">
                {filteredTournaments.length === 0 ? (
                    <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                        <p className="text-neutral-400 text-sm">No tournaments found for this filter category.</p>
                        <button
                            type="button"
                            onClick={() => setActiveFilter('All Events')} // state
                            className="mt-4 px-4 py-2 rounded-full border border-white/15 text-xs text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredTournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-300 shadow-lg hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
                            >
                                {/* visual banner area */}
                                <div className="aspect-[21/9] w-full overflow-hidden relative bg-[#0A0F1D] flex items-center justify-center border-b border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-blue-600/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Placeholder media center */}
                                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-600 group-hover:text-neutral-500 transition-colors z-10">
                                        <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-500">Image</span>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent pointer-events-none" />

                                    {/* top badges */}
                                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                                        <span className="px-3 py-1 rounded-md text-[11px] font-bold tracking-widest uppercase bg-black/75 backdrop-blur-md border border-white/15 text-white">
                                            {tournament.game}
                                        </span>

                                        <span className="px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md bg-white/10 text-neutral-400 border-white/15">
                                            {tournament.status}
                                        </span>
                                    </div>
                                </div>

                                {/* content area with generous padding */}
                                <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between text-left">
                                    <div>
                                        {/* meta row */}
                                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                                            <span className="text-amber-400">{tournament.game}</span>
                                            <span>•</span>
                                            <span>{tournament.date}</span>
                                        </div>

                                        {/* tournament name */}
                                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors duration-200 my-4 sm:my-5 leading-snug">
                                            {tournament.title}
                                        </h2>

                                        {/* stage & venue label */}
                                        <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium mb-3">
                                            <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            <span className="truncate">{tournament.location}</span>
                                        </div>

                                        {/* description */}
                                        <p className="pt-1 text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                                            {tournament.description}
                                        </p>
                                    </div>

                                    {/* footer action row inside card */}
                                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                            Detail
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                router.visit(tournament.slug ? `/leagues/${tournament.slug}` : '/leagues/details'); // redirect
                                            }}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-amber-400 group-hover:text-amber-300 hover:translate-x-1 transition-all cursor-pointer"
                                        >
                                            <span>View Details</span>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </button>
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
