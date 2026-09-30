// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Trophy,
    Calendar,
    Clock,
    MapPin,
    Users,
    Layers,
    Share2,
    Check,
    ChevronRight,
    Shield,
    Gamepad2,
    Maximize2,
    X
} from 'lucide-react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';

// --2. properties--
function getStatusBadge(status = '') { // convert
    const s = (status || '').toUpperCase();
    if (s.includes('OPEN')) {
        return {
            bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
            dot: 'bg-emerald-400',
            pulse: true,
            label: status || 'Registration Open'
        };
    }
    if (s.includes('LIVE')) {
        return {
            bg: 'bg-red-500/20 text-red-300 border-red-500/40',
            dot: 'bg-red-400',
            pulse: true,
            label: status || 'Live In Progress'
        };
    }
    if (s.includes('COMPLETED') || s.includes('CONCLUDED') || s.includes('OFF-SEASON')) {
        return {
            bg: 'bg-white/10 text-neutral-300 border-white/15',
            dot: 'bg-neutral-400',
            pulse: false,
            label: status || 'Concluded'
        };
    }
    return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-400',
        pulse: false,
        label: status || 'Upcoming Circuit'
    };
}

// --3. main component--
export default function LeagueDetails({ league = null, otherLeagues = [] }) {
    // --4. actions--
    const [copied, setCopied] = useState(false); // state
    const [posterModalOpen, setPosterModalOpen] = useState(false); // state

    const currentLeague = league; // state
    const badge = currentLeague ? getStatusBadge(currentLeague.registration_status) : null; // check
    const posterUrl = currentLeague?.banner_url || '/images/leagues_hero_banner_hd.jpg'; // state

    // listen for escape key and manage body scroll for poster modal
    useEffect(() => {
        const handleKeyDown = (e) => { // trigger
            if (e.key === 'Escape') setPosterModalOpen(false); // toggle
        };
        if (posterModalOpen) { // check
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [posterModalOpen]);

    const handleShare = () => { // trigger
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href); // save
            setCopied(true); // state
            setTimeout(() => setCopied(false), 2000); // clock
        }
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden flex flex-col justify-between">
            <Head title={currentLeague ? `${currentLeague.name} - MESF League` : 'League Details - MESF'} />

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

            {/* 2. main content body */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24 flex-1">
                
                {/* navigation bar: back button + share */}
                <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4">
                    <BackButton href="/leagues" label="Back to Leagues" />

                    {currentLeague && (
                        <button
                            type="button"
                            onClick={handleShare} // trigger
                            className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">Link Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>Share League</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {!currentLeague ? (
                    <div className="p-12 sm:p-16 rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] text-center space-y-5 shadow-2xl backdrop-blur-2xl">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-neutral-300 shadow-inner">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="space-y-2 max-w-md mx-auto">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                                No League Details Available
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                This tournament circuit has not been published or scheduled yet by administration. Check back soon for official announcements.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/leagues" // redirect
                                className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-md"
                            >
                                <span>Browse All Leagues</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 1. tournament title & identity banner */}
                        <div className="mb-6 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-amber-400 uppercase block">
                                    Malaysia Esports Federation
                                </span>
                                {badge && (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${badge.bg}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                        <span>{badge.label}</span>
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-tight">
                                {currentLeague.name}
                            </h1>

                            {currentLeague.season && (
                                <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                                    {currentLeague.season}
                                </p>
                            )}
                        </div>

                        {/* 2. organized tournament specifications bar (clean, calm, not overwhelming) */}
                        <div className="mb-8 rounded-xl border border-white/10 bg-[#0B1120] py-3.5 px-4 sm:px-6 shadow-lg">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                                
                                {/* 1. prize pool */}
                                <div className="sm:pr-4">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                                        Prize Pool
                                    </span>
                                    <span className="text-base sm:text-lg font-bold font-mono text-amber-400 tracking-tight block truncate">
                                        {currentLeague.prize_pool || '—'}
                                    </span>
                                </div>

                                {/* 2. game discipline */}
                                <div className="pt-3 sm:pt-0 sm:px-4">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                                        Game Discipline
                                    </span>
                                    <span className="text-sm sm:text-base font-semibold text-white tracking-tight block truncate">
                                        {currentLeague.game_title || '—'}
                                    </span>
                                </div>

                                {/* 3. team limit */}
                                <div className="pt-3 sm:pt-0 sm:px-4">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                                        Team Limit
                                    </span>
                                    <span className="text-sm sm:text-base font-semibold text-white tracking-tight block truncate">
                                        {currentLeague.slots || '—'}
                                    </span>
                                </div>

                                {/* 4. competition tier */}
                                <div className="pt-3 sm:pt-0 sm:pl-4">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                                        Competition Tier
                                    </span>
                                    <span className="text-sm sm:text-base font-semibold text-white tracking-tight block truncate">
                                        {currentLeague.tier || '—'}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* 3. main tournament grid: clear official poster, details & registration */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* left column: poster, overview & competition specifications */}
                            <div className="lg:col-span-8 space-y-8">
                                
                                {/* official tournament poster card (shown clearly without dark overlays or cropping) */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl shadow-xl space-y-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                                        <div>
                                            <h3 className="text-lg font-black text-white tracking-tight uppercase">
                                                Official Event Poster
                                            </h3>
                                            <p className="text-xs text-neutral-400">
                                                Official tournament notice, schedule details, and partner sanctions.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPosterModalOpen(true)} // trigger
                                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                                            <span>View Full HD Poster</span>
                                        </button>
                                    </div>

                                    {/* clear, bright, uncropped poster display */}
                                    <div 
                                        onClick={() => setPosterModalOpen(true)} // trigger
                                        className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#060A14] flex items-center justify-center p-3 sm:p-4 cursor-pointer hover:border-white/25 transition-all shadow-inner"
                                        title="Click to view full-size poster"
                                    >
                                        <img
                                            src={posterUrl}
                                            alt={currentLeague.name}
                                            className="w-full h-auto max-h-[600px] object-contain rounded-lg mx-auto filter brightness-[1.02] contrast-[1.03] transition-opacity hover:opacity-95"
                                        />
                                    </div>
                                </div>

                                {/* overview & about */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl shadow-xl space-y-4">
                                    <h3 className="text-lg font-black text-white tracking-tight uppercase">
                                        About the League
                                    </h3>
                                    {currentLeague.description ? (
                                        <div className="text-sm sm:text-base text-neutral-300 leading-relaxed space-y-3 whitespace-pre-line font-normal">
                                            {currentLeague.description}
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-xs text-neutral-500">
                                            No detailed tournament description provided yet by administration.
                                        </div>
                                    )}
                                </div>

                                {/* competition specifications */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl shadow-xl space-y-6">
                                    <h3 className="text-lg font-black text-white tracking-tight uppercase">
                                        Competition Specifications
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        {/* format */}
                                        <div className="p-4 rounded-xl bg-[#090E1A] border border-white/10 space-y-1">
                                            <div className="text-neutral-400 flex items-center gap-1.5 font-medium">
                                                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>Format & Structure</span>
                                            </div>
                                            <div className="text-sm font-bold text-white">
                                                {currentLeague.format || '—'}
                                            </div>
                                        </div>

                                        {/* location / venue */}
                                        <div className="p-4 rounded-xl bg-[#090E1A] border border-white/10 space-y-1">
                                            <div className="text-neutral-400 flex items-center gap-1.5 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>Venue / Location</span>
                                            </div>
                                            <div className="text-sm font-bold text-white">
                                                {currentLeague.location || '—'}
                                            </div>
                                        </div>

                                        {/* tournament dates */}
                                        <div className="p-4 rounded-xl bg-[#090E1A] border border-white/10 space-y-1">
                                            <div className="text-neutral-400 flex items-center gap-1.5 font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>Tournament Dates</span>
                                            </div>
                                            <div className="text-sm font-bold text-white font-mono">
                                                {currentLeague.formatted_dates || '—'}
                                            </div>
                                        </div>

                                        {/* registration deadline */}
                                        <div className="p-4 rounded-xl bg-[#090E1A] border border-white/10 space-y-1">
                                            <div className="text-neutral-400 flex items-center gap-1.5 font-medium">
                                                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>Registration Deadline</span>
                                            </div>
                                            <div className="text-sm font-bold text-white font-mono">
                                                {currentLeague.formatted_deadline || '—'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* right column: registration action card & directory */}
                            <div className="lg:col-span-4 space-y-6">
                                
                                {/* registration card */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl shadow-xl space-y-6">
                                    <div className="space-y-2 pb-4 border-b border-white/10">
                                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                                            Entry & Participation
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                                            {currentLeague.entry_fee || 'Free Entry'}
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between py-1.5 border-b border-white/5">
                                            <span className="text-neutral-400">Registration Status</span>
                                            <span className="text-white font-bold">{currentLeague.registration_status}</span>
                                        </div>

                                        {currentLeague.formatted_deadline && (
                                            <div className="flex justify-between py-1.5 border-b border-white/5">
                                                <span className="text-neutral-400">Registration Closes</span>
                                                <span className="text-white font-semibold font-mono">{currentLeague.formatted_deadline}</span>
                                            </div>
                                        )}

                                        {currentLeague.slots && (
                                            <div className="flex justify-between py-1.5 border-b border-white/5">
                                                <span className="text-neutral-400">Slot Availability</span>
                                                <span className="text-white font-semibold">{currentLeague.slots}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        {badge && badge.pulse ? (
                                            <Link
                                                href="/join-tournament" // redirect
                                                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                                            >
                                                <span>Register for Tournament</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/contact" // redirect
                                                className="w-full py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                                            >
                                                <span>Inquire League Participation</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* other sanctioned leagues directory */}
                                {otherLeagues && otherLeagues.length > 0 && (
                                    <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl shadow-xl space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                                Other Sanctioned Leagues
                                            </h4>
                                            <Link href="/leagues" className="text-[11px] text-amber-400 hover:text-amber-300 font-bold">
                                                View All
                                            </Link>
                                        </div>

                                        <div className="space-y-3">
                                            {otherLeagues.map((ol) => (
                                                <Link
                                                    key={ol.id}
                                                    href={`/leagues/${ol.slug}`} // redirect
                                                    className="group block p-3 rounded-xl bg-[#090E1A] border border-white/5 hover:border-white/20 transition-all"
                                                >
                                                    <div className="text-xs font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                                                        {ol.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1 font-mono">
                                                        <span className="text-neutral-300">{ol.game_title}</span>
                                                        {ol.prize_pool && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-emerald-400 font-bold">{ol.prize_pool}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* 3. footer */}
            <Footer />

            {/* 4. full-screen poster preview modal */}
            {posterModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
                    onClick={() => setPosterModalOpen(false)} // trigger
                >
                    {/* top bar */}
                    <div className="w-full max-w-5xl flex items-center justify-between pb-3 text-white">
                        <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 truncate pr-4">
                            {currentLeague?.name} — Official Event Poster
                        </div>
                        <button
                            type="button"
                            onClick={() => setPosterModalOpen(false)} // trigger
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                            title="Close (Esc)"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* poster full view */}
                    <div 
                        className="relative max-w-5xl max-h-[85vh] flex items-center justify-center overflow-auto" 
                        onClick={(e) => e.stopPropagation()} // trigger
                    >
                        <img
                            src={posterUrl}
                            alt={currentLeague?.name || 'Tournament Poster'}
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
