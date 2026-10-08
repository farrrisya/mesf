// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Trophy, Calendar, MapPin, ArrowRight, Search, X } from 'lucide-react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const STATUS_FILTERS = ['All Events', 'Live', 'Upcoming', 'Completed'];

// --3. main component--
export default function Leagues({ leagues = [] }) {
    // --4. actions--
    const [activeFilter, setActiveFilter] = useState('All Events'); // state
    const [searchQuery, setSearchQuery] = useState(''); // state

    const items = leagues || []; // state

    // filter leagues by status tab and search keyword
    const filteredTournaments = useMemo(() => { // filter
        return items.filter((item) => {
            // status check
            if (activeFilter !== 'All Events') { // check
                const s = (item.status || '').toUpperCase();
                if (activeFilter === 'Live' && !s.includes('LIVE')) return false; // check
                if (activeFilter === 'Upcoming' && !(s.includes('UPCOMING') || s.includes('REGISTRATION') || s === 'STATUS')) return false; // check
                if (activeFilter === 'Completed' && !(s.includes('COMPLETED') || s.includes('OFF-SEASON'))) return false; // check
            }

            // search check
            if (searchQuery.trim()) { // check
                const q = searchQuery.toLowerCase();
                const inTitle = (item.title || '').toLowerCase().includes(q);
                const inGame = (item.game || '').toLowerCase().includes(q);
                const inLocation = (item.location || '').toLowerCase().includes(q);
                const inTier = (item.tier || '').toLowerCase().includes(q);
                return inTitle || inGame || inLocation || inTier;
            }

            return true;
        });
    }, [items, activeFilter, searchQuery]);

    // reset all active filters
    const handleResetFilters = () => { // trigger
        setActiveFilter('All Events'); // state
        setSearchQuery(''); // state
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title="Leagues & Circuits - MESF" />

            {/* ambient background glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-slate-600/10 blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[160px]" />
            </div>

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="leagues" />
            </div>

            {/* 1. hero header with leagues championship background */}
            <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] max-h-[460px] min-h-[260px] overflow-hidden">
                {/* HD leagues banner image */}
                <img
                    src="/images/leagues_hero_banner_hd.jpg"
                    alt="MESF Leagues & Tournaments"
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
                />

                {/* gradient overlays for text contrast and edge fade */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/90 via-[#070B14]/65 to-transparent/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/70 via-transparent to-transparent pointer-events-none" />

                {/* left-aligned header container */}
                <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-16 sm:pt-20">
                    <div className="text-left space-y-3 sm:space-y-4">
                        <span className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.25em] text-neutral-300 uppercase block">
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

            {/* 2. minimalist filter toolbar & search */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-0">
                    {/* minimalist status filter tabs */}
                    <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                        {STATUS_FILTERS.map((filter) => {
                            const isActive = activeFilter === filter; // check
                            return (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)} // filter
                                    className={`text-xs uppercase tracking-wider font-semibold pb-3.5 transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                                        isActive
                                            ? 'text-white border-b-2 border-white'
                                            : 'text-neutral-400 hover:text-neutral-200 border-b-2 border-transparent'
                                    }`}
                                >
                                    {filter}
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
                                placeholder="Search leagues..."
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
            </div>

            {/* 3. 2-column tournament cards grid */}
            <div className="flex-1">
                <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-left">
                    {filteredTournaments.length === 0 ? (
                        <div className="py-20 text-center rounded-2xl border border-white/10 bg-[#090E1A]/80 backdrop-blur-xl p-8 space-y-4 max-w-xl mx-auto">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-bold text-base">
                                    {items.length === 0
                                        ? 'No Leagues or Circuits Scheduled'
                                        : 'No matching leagues found'}
                                </p>
                                <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed">
                                    {items.length === 0
                                        ? 'There are currently no active leagues published by administration. Check back soon for upcoming tournaments.'
                                        : 'No leagues match your selected filters. Try choosing a different status or resetting filters.'}
                                </p>
                            </div>
                            {items.length > 0 && (
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8">
                            {filteredTournaments.map((tournament) => (
                                <Link
                                    key={tournament.id}
                                    href={tournament.slug ? `/leagues/${tournament.slug}` : '/leagues/details'} // redirect
                                    className="group flex flex-col justify-between rounded-xl bg-[#090E1A]/90 hover:bg-[#0D1527] border border-white/[0.08] hover:border-white/20 backdrop-blur-xl overflow-hidden transition-colors duration-200 cursor-pointer"
                                >
                                    <div>
                                        {/* visual banner area */}
                                        <div className="aspect-[16/9] w-full overflow-hidden relative bg-[#050810] flex items-center justify-center border-b border-white/[0.06] shrink-0">
                                            {tournament.banner ? (
                                                <img
                                                    src={tournament.banner}
                                                    alt={tournament.title}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-2 text-neutral-600">
                                                    <Trophy className="w-8 h-8 opacity-30 text-neutral-500" />
                                                    <span className="text-[10px] font-mono uppercase text-neutral-500">MESF Sanctioned League</span>
                                                </div>
                                            )}

                                            {/* game title badge */}
                                            {tournament.game && (
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 text-neutral-200">
                                                        {tournament.game}
                                                    </span>
                                                </div>
                                            )}

                                            {/* registration status badge */}
                                            {tournament.status && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 text-neutral-300">
                                                        {tournament.status}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* card content area */}
                                        <div className="p-6 sm:p-7 space-y-3.5 text-left">
                                            {/* meta details row */}
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-neutral-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                                                    <span>{tournament.date}</span>
                                                </div>
                                                {tournament.location && (
                                                    <>
                                                        <span className="text-neutral-600">•</span>
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                                            <span className="truncate">{tournament.location}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* league title */}
                                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100 group-hover:text-white transition-colors duration-200 leading-snug">
                                                {tournament.title}
                                            </h2>

                                            {/* description */}
                                            {tournament.description && (
                                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal line-clamp-2">
                                                    {tournament.description}
                                                </p>
                                            )}

                                            {/* prize bounty and circuit tier metrics */}
                                            {(tournament.prize_pool || tournament.tier) && (
                                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06] text-xs">
                                                    <div>
                                                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Prize Bounty</span>
                                                        <span className="font-semibold text-neutral-200 font-mono text-xs">{tournament.prize_pool || 'Official Title'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Circuit Tier</span>
                                                        <span className="font-semibold text-neutral-300 font-mono text-xs truncate block">{tournament.tier || 'National'}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* card action footer */}
                                    <div className="px-6 sm:px-7 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                                        <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                                            {tournament.game || 'Circuit Info'}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                                            <span>View Details</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* footer */}
            <Footer />
        </div>
    );
}
