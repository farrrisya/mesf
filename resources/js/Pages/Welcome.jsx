// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import { Play } from 'lucide-react';

// --2. main component--
export default function Welcome({ latestByCategory = {}, featuredArticle = null, leagues = [] }) {
    // --3. properties--
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const bannerUrl = settings?.bannerUrl || '/images/mesf_bg_v2.jpg'; // properties

    const isDashboardRoute = typeof window !== 'undefined' && (
        new URLSearchParams(window.location.search).get('view') === 'dashboard' ||
        window.location.hash === '#dashboard'
    ); // check
    const [scrollY, setScrollY] = useState(() => (isDashboardRoute ? 230 : 0)); // state
    const [activeTab, setActiveTab] = useState('home'); // state
    const [activeSquad, setActiveSquad] = useState('mlbb-open'); // state

    // --4. actions--
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const isDashboard = params.get('view') === 'dashboard' || window.location.hash === '#dashboard';
            
            if (isDashboard) {
                if ('scrollRestoration' in window.history) {
                    window.history.scrollRestoration = 'manual'; // config
                }
                window.scrollTo(0, 230); // scroll
                setScrollY(230); // state
            }
        }

        const handleScroll = () => {
            setScrollY(window.scrollY); // scroll
        };

        window.addEventListener('scroll', handleScroll, { passive: true }); // trigger

        // ensure position is firmly set on initial render without glitch
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                if (params.get('view') === 'dashboard' || window.location.hash === '#dashboard') {
                    window.scrollTo(0, 230); // scroll
                    setScrollY(230); // state
                }
            }
        }, 30);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    // calculate sequenced scroll transitions
    const heroProgress = Math.min(Math.max(scrollY / 120, 0), 1); // scroll
    const heroOpacity = Math.max(1 - heroProgress, 0); // scroll
    const heroRotateY = heroProgress * 720; // convert
    const navOpacity = Math.min(Math.max((scrollY - 40) / 100, 0), 1); // scroll
    const contentOpacity = Math.min(Math.max((scrollY - 120) / 90, 0), 1); // scroll

    const scrollToNavbar = () => {
        window.scrollTo({ top: 230, behavior: 'smooth' }); // scroll
    };

    const navItems = [
        { id: 'news', label: 'NEWS', href: '/news' },
        { id: 'leagues', label: 'LEAGUES' },
        { id: 'matches', label: 'MATCHES' },
        { id: 'teams', label: 'TEAMS' },
        { id: 'about', label: 'ABOUT' }
    ];

    const sanctionedGames = [
        {
            name: 'Mobile Legends: Bang Bang',
            shortName: 'MLBB',
            genre: 'MOBA'
        },
        {
            name: 'PUBG Mobile',
            shortName: 'PUBGM',
            genre: 'BATTLE ROYALE'
        },
        {
            name: 'Valorant',
            shortName: 'VALORANT',
            genre: 'TACTICAL FPS'
        },
        {
            name: 'Tekken 8',
            shortName: 'TEKKEN 8',
            genre: 'FIGHTING'
        },
        {
            name: 'eFootball',
            shortName: 'eFOOTBALL',
            genre: 'SPORTS'
        },
        {
            name: 'Dota 2',
            shortName: 'DOTA 2',
            genre: 'MOBA'
        },
        {
            name: 'Honor of Kings',
            shortName: 'HOK',
            genre: 'MOBA'
        }
    ];

    const stateAssociations = [
        { id: 'johor', code: 'JHR', name: 'Johor', title: 'Persatuan Sukan Elektronik Negeri Johor', image: '/images/states/johor_transparent.png', glowColor: '#3B82F6', glowRgba: 'rgba(59, 130, 246, 0.75)' },
        { id: 'kedah', code: 'KDH', name: 'Kedah', title: 'Persatuan Sukan Elektronik Negeri Kedah', image: '/images/states/kedah_transparent.png', glowColor: '#10B981', glowRgba: 'rgba(16, 185, 129, 0.75)' },
        { id: 'kelantan', code: 'KTN', name: 'Kelantan', title: 'Persatuan Sukan Elektronik Negeri Kelantan', image: '/images/states/kelantan_transparent.png', glowColor: '#EF4444', glowRgba: 'rgba(239, 68, 68, 0.75)' },
        { id: 'melaka', code: 'MLK', name: 'Melaka', title: 'Persatuan Sukan Elektronik Negeri Melaka', image: '/images/states/melaka_transparent.png', glowColor: '#2563EB', glowRgba: 'rgba(37, 99, 235, 0.75)' },
        { id: 'negeri_sembilan', code: 'NSN', name: 'Negeri Sembilan', title: 'Persatuan Sukan Elektronik Negeri Sembilan', image: '/images/states/negeri_sembilan_transparent.png', glowColor: '#F59E0B', glowRgba: 'rgba(245, 158, 11, 0.75)' },
        { id: 'pahang', code: 'PHG', name: 'Pahang', title: 'Persatuan Sukan Elektronik Negeri Pahang', image: '/images/states/pahang_transparent.png', glowColor: '#38BDF8', glowRgba: 'rgba(56, 189, 248, 0.75)' },
        { id: 'penang', code: 'PNG', name: 'Pulau Pinang', title: 'Persatuan Sukan Elektronik Pulau Pinang', image: '/images/states/penang_transparent.png', glowColor: '#0EA5E9', glowRgba: 'rgba(14, 165, 233, 0.75)' },
        { id: 'perak', code: 'PRK', name: 'Perak', title: 'Persatuan Sukan Elektronik Perak', image: '/images/states/perak_transparent.png', glowColor: '#FBBF24', glowRgba: 'rgba(251, 191, 36, 0.75)' },
        { id: 'perlis', code: 'PLS', name: 'Perlis', title: 'Persatuan Sukan Elektronik Negeri Perlis', image: '/images/states/perlis_transparent.png', glowColor: '#F59E0B', glowRgba: 'rgba(245, 158, 11, 0.75)' },
        { id: 'selangor', code: 'SGR', name: 'Selangor', title: 'Persatuan Sukan Elektronik Negeri Selangor', image: '/images/states/selangor_transparent.png', glowColor: '#DC2626', glowRgba: 'rgba(220, 38, 38, 0.75)' },
        { id: 'terengganu', code: 'TRG', name: 'Terengganu', title: 'Persatuan Sukan Elektronik Negeri Terengganu', image: '/images/states/terengganu_transparent.png', glowColor: '#F1F5F9', glowRgba: 'rgba(241, 245, 249, 0.85)' },
        { id: 'sabah', code: 'SBH', name: 'Sabah', title: 'Persatuan Sukan Elektronik Negeri Sabah', image: '/images/states/sabah_transparent.png', glowColor: '#06B6D4', glowRgba: 'rgba(6, 182, 212, 0.75)' },
        { id: 'sarawak', code: 'SWK', name: 'Sarawak', title: 'Persatuan Sukan Elektronik Sarawak', image: '/images/states/sarawak_transparent.png', glowColor: '#EF4444', glowRgba: 'rgba(239, 68, 68, 0.75)' },
        { id: 'labuan', code: 'LBN', name: 'WP Labuan', title: 'Persatuan Sukan Elektronik WP Labuan', image: '/images/states/labuan_transparent.png', glowColor: '#3B82F6', glowRgba: 'rgba(59, 130, 246, 0.75)' }
    ];

    const teamRoster = [
        { id: 'mlbb-open', label: 'MLBB (OPEN)', format: '5v5 Squad', image: '/images/squads/mlbb-open.jpg', accolade: 'SEA Games Representatives' },
        { id: 'mlbb-women', label: 'MLBB (WOMEN)', format: '5v5 Squad', image: '/images/squads/mlbb-women.jpg', accolade: 'IESF World Contenders' },
        { id: 'pubgm', label: 'PUBG MOBILE', format: '4-Player Squad', image: '/images/squads/pubgm.jpg', accolade: 'Asian Games Medalists' },
        { id: 'cs2-open', label: 'CS2 (OPEN)', format: '5v5 Squad', image: '/images/squads/cs2-open.jpg', accolade: 'IESF World Contenders' },
        { id: 'cs2-women', label: 'CS2 (WOMEN)', format: '5v5 Squad', image: '/images/squads/cs2-women.jpg', accolade: 'IESF World Contenders' },
        { id: 'dota2', label: 'DOTA 2 (OPEN)', format: '5v5 Squad', image: '/images/squads/dota2.jpg', accolade: 'National Squad' },
        { id: 'dota2-women', label: 'DOTA 2 (WOMEN)', format: '5v5 Squad', image: '/images/squads/dota2-women.jpg', accolade: 'National Squad' },
        { id: 'valorant', label: 'VALORANT', format: '5v5 Squad', image: '/images/squads/valorant.jpg', accolade: 'National Squad' },
        { id: 'hok', label: 'HONOR OF KINGS', format: '5v5 Squad', image: '/images/squads/hok.jpg', accolade: 'SEA Games Representatives' },
        { id: 'efootball', label: 'eFOOTBALL', format: 'Individual / Duo', image: '/images/squads/efootball.jpg', accolade: 'National Champion' },
        { id: 'tekken', label: 'TEKKEN 8', format: 'Individual', image: '/images/squads/tekken.jpg', accolade: 'National Champion' }
    ];

    const currentSquad = teamRoster.find((s) => s.id === activeSquad) || teamRoster[0];

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans">
            <Head title="MESF - Malaysia Esports Federation" />

            {/* custom animation, mesa marquee, and ultra-compact sleek scrollbar thumb styling */}
            <style>{`
                ::-webkit-scrollbar {
                    width: 5px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(251, 191, 36, 0.45);
                    border-radius: 9999px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(251, 191, 36, 0.9);
                }
                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marqueeScroll 30s linear infinite;
                }
                .marquee-container:hover .marquee-track {
                    animation-play-state: paused;
                }
                @keyframes gentleFloat {
                    0%, 100% {
                        transform: translateY(0px);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translateY(8px);
                        opacity: 1;
                    }
                }
            `}</style>

            {/* grain overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.06] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* fixed background layer with vignette */}
            <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none">
                <img
                    src={bannerUrl}
                    alt="Background"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/mesf_bg_v2.jpg';
                    }}
                    className="h-full w-full object-cover object-center"
                />

                {/* dark vignette overlays */}
                <div className="absolute inset-0 bg-[#070B14]/40" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,11,20,0.25)_0%,rgba(7,11,20,0.75)_65%,rgba(7,11,20,0.96)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-[#070B14]/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/70 via-transparent to-[#070B14]/70" />
            </div>

            {/* floating dynamic rounded pill nav bar - fades in on scroll */}
            <div
                className="fixed top-5 md:top-7 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-out pointer-events-none"
                style={{
                    opacity: navOpacity,
                    pointerEvents: navOpacity > 0.1 ? 'auto' : 'none',
                    transform: `translate(-50%, ${navOpacity > 0 ? '0' : '-16px'}) scale(${0.92 + navOpacity * 0.08})`
                }}
            >
                <PublicNavbar
                    activeTab={activeTab}
                    onNavClick={(tabId) => {
                        if (tabId === 'home') {
                            scrollToNavbar(); // scroll
                            return true;
                        }
                        return false;
                    }}
                />
            </div>

            {/* center hero screen - spins and fades out on scroll */}
            <section
                className="fixed inset-0 z-10 h-screen w-full flex flex-col items-center justify-between p-8 md:p-12 pointer-events-none"
                style={{
                    opacity: heroOpacity,
                    pointerEvents: heroOpacity > 0.05 ? 'auto' : 'none',
                    display: heroOpacity <= 0 ? 'none' : 'flex',
                    visibility: heroOpacity <= 0 ? 'hidden' : 'visible'
                }}
            >
                {/* top spacer */}
                <div className="h-6" />

                {/* centered logo and name */}
                <div className="flex flex-col items-center justify-center text-center [perspective:1200px]">
                    {/* logo with 3d horizontal spin on scroll and hover */}
                    <div
                        className="group cursor-pointer mb-6"
                        style={{
                            transform: `rotateY(${heroRotateY}deg)`
                        }}
                    >
                        <img
                            src={logoUrl}
                            alt="MESF Logo"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/mesf_logo.png';
                            }}
                            className="h-44 w-44 md:h-56 md:w-56 object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] group-hover:[transform:rotateY(720deg)] transition-transform duration-1000 ease-in-out"
                        />
                    </div>

                    {/* bold condensed federation typography */}
                    <h1 className="font-['Anton'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white uppercase leading-[0.95] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] max-w-4xl select-none">
                        <span className="bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                            MALAYSIA
                        </span>{' '}
                        <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                            ESPORTS
                        </span>{' '}
                        <span className="bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                            FEDERATION
                        </span>
                    </h1>
                </div>

                {/* minimalist scroll arrow with smooth slow bounce */}
                <button
                    onClick={scrollToNavbar}
                    className="group cursor-pointer flex flex-col items-center justify-center pb-6 transition-transform hover:scale-110"
                    aria-label="Scroll down"
                >
                    <svg
                        className="w-6 h-6 text-neutral-400 group-hover:text-amber-400 transition-colors"
                        style={{
                            animation: 'gentleFloat 2.6s ease-in-out infinite'
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </section>

            {/* dashboard continuous scroll content */}
            <div
                className="relative z-20 w-full"
                style={{
                    opacity: contentOpacity,
                    pointerEvents: contentOpacity > 0.1 ? 'auto' : 'none'
                }}
            >
                {/* 1. welcoming intro & partners (pinned sticky during hero transition, then naturally scrolls up) */}
                <div className="relative w-full h-[calc(100vh+230px)]">
                    <main
                        className="sticky top-0 h-screen w-full flex flex-col justify-between items-center pt-20 md:pt-24 pb-3 md:pb-5 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto text-center overflow-hidden"
                        style={{
                            transform: `translateY(${contentOpacity > 0 ? '0' : '16px'})`
                        }}
                    >
                        {/* top spacer */}
                        <div className="h-1" />

                        {/* main welcoming statement & mission info - well-proportioned & balanced */}
                        <div className="space-y-2.5 md:space-y-3.5 max-w-3xl my-auto">
                            {/* bold federation headline */}
                            <h2 className="font-['Anton'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wide leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                                MALAYSIA <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">ESPORTS FEDERATION</span>
                            </h2>

                            {/* official slogan */}
                            <div className="inline-block text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
                                &ldquo;Bersama Memacu Esports Malaysia&rdquo;
                            </div>

                            {/* comprehensive authoritative mission text with clean line break */}
                            <div className="space-y-1.5 text-xs sm:text-sm md:text-base text-neutral-300/90 leading-relaxed max-w-2xl mx-auto font-normal">
                                <p>
                                    The Malaysia Esports Federation (MESF) serves as the official national governing body for competitive electronic sports under the Ministry of Youth and Sports (KBS) and Majlis Sukan Negara (MSN).
                                </p>
                                <p className="text-neutral-400 text-xs sm:text-sm">
                                    As the sole custodian for national esports development, MESF regulates, sanctions, and elevates the ecosystem across all 14 states—from grassroots talent pipelines and state academies to managing Team MYS on the world stage.
                                </p>
                            </div>

                            {/* interactive cta buttons with matching balanced sizes */}
                            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
                                <Link
                                    href="/about"
                                    className="w-44 sm:w-48 py-2.5 sm:py-3 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#070B14] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(251,191,36,0.45)] hover:scale-105 transition-transform duration-200 cursor-pointer"
                                >
                                    Learn More
                                </Link>
                                <Link
                                    href="/leagues"
                                    className="relative overflow-hidden w-44 sm:w-48 py-2.5 sm:py-3 flex items-center justify-center rounded-full backdrop-blur-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase border border-white/20 hover:border-amber-400/50 shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:scale-105 transition-[transform,background-color,border-color] duration-200 cursor-pointer group"
                                >
                                    {/* inner grain texture */}
                                    <span
                                        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay rounded-full"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                                        }}
                                    />
                                    <span className="relative z-10">Explore Leagues</span>
                                </Link>
                            </div>
                        </div>

                        {/* free-floating partners & affiliates section (title left, logos right) */}
                        <div className="w-full pt-3 md:pt-4 border-t border-white/10 space-y-2.5 md:space-y-3">
                            {/* tier a: government & global affiliates */}
                            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-5">
                                <div className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase shrink-0 text-center md:text-left md:w-52 lg:w-56">
                                    Government &amp; Global Affiliates
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 sm:gap-7 md:gap-9 lg:gap-11 flex-1">
                                    <img
                                        src="/images/partners/kbs.svg"
                                        alt="Kementerian Belia & Sukan (KBS)"
                                        title="Kementerian Belia & Sukan (KBS)"
                                        className="h-7.5 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[105px] sm:max-w-[125px] md:max-w-[145px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                    <img
                                        src="/images/partners/msn.svg"
                                        alt="Majlis Sukan Negara (MSN)"
                                        title="Majlis Sukan Negara (MSN)"
                                        className="h-7.5 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[105px] sm:max-w-[125px] md:max-w-[145px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                    <img
                                        src="/images/partners/esi.svg"
                                        alt="Esports Integrated (ESI)"
                                        title="Esports Integrated (ESI)"
                                        className="h-6 sm:h-7.5 md:h-8.5 lg:h-9.5 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[175px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                    <img
                                        src="/images/partners/ocm.svg"
                                        alt="Olympic Council of Malaysia (OCM)"
                                        title="Olympic Council of Malaysia (OCM)"
                                        className="h-7.5 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[105px] sm:max-w-[125px] md:max-w-[145px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                    <img
                                        src="/images/partners/iesf.svg"
                                        alt="International Esports Federation (IESF)"
                                        title="International Esports Federation (IESF)"
                                        className="h-6 sm:h-7.5 md:h-8.5 lg:h-9.5 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[175px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                    <img
                                        src="/images/partners/aesf.svg"
                                        alt="Asian Esports Federation (AESF)"
                                        title="Asian Esports Federation (AESF)"
                                        className="h-7.5 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[105px] sm:max-w-[125px] md:max-w-[145px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                </div>
                            </div>

                            {/* tier b: official proud partners */}
                            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-5">
                                <div className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase shrink-0 text-center md:text-left md:w-52 lg:w-56">
                                    Official Proud Partners
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-9 md:gap-11 lg:gap-14 flex-1">
                                    <img
                                        src="/images/partners/aeon-bank.svg"
                                        alt="AEON Bank"
                                        title="AEON Bank"
                                        className="h-6 sm:h-7.5 md:h-8.5 lg:h-9.5 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[175px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                    <img
                                        src="/images/partners/moonton.svg"
                                        alt="MOONTON Games"
                                        title="MOONTON Games"
                                        className="h-6 sm:h-7.5 md:h-8.5 lg:h-9.5 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[175px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                    <img
                                        src="/images/partners/dynasty-esports.svg"
                                        alt="Dynasty Esports"
                                        title="Dynasty Esports"
                                        className="h-7.5 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[105px] sm:max-w-[125px] md:max-w-[145px] object-contain grayscale brightness-[1.1] contrast-[1.1] opacity-60 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* 2. latest news & announcements (the bento grid) */}
                <section
                    id="news"
                    className="w-full pt-20 md:pt-24 pb-16 md:pb-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto"
                >
                    {/* title flex-between header */}
                    <div className="w-full flex items-center justify-between gap-4 mb-8 md:mb-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white/95">
                            LATEST UPDATES
                        </h2>
                        <Link
                            href="/news"
                            className="group inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-amber-400/[0.08] border border-white/10 hover:border-amber-400/40 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/70 hover:text-amber-300 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_16px_rgba(251,191,36,0.15)] select-none cursor-pointer"
                        >
                            <span>VIEW ALL NEWS</span>
                            <svg
                                className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400/80 group-hover:text-amber-300 transform group-hover:translate-x-0.5 transition-all duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* the bento grid - up-to-date categories: TOURNAMENTS, ACHIEVEMENTS, ANNOUNCEMENTS, PARTNERSHIPS */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[220px] md:auto-rows-[250px]">
                        {/* 1. TOURNAMENTS (featured primary box: spans 2 cols, 2 rows) */}
                        {(() => {
                            const cat = 'TOURNAMENTS'; // state
                            const article = (featuredArticle && featuredArticle.category === cat ? featuredArticle : null) || latestByCategory?.[cat] || featuredArticle; // state

                            if (article) { // check
                                return (
                                    <Link
                                        key={cat}
                                        href={`/news/${article.slug}`} // redirect
                                        className="md:col-span-2 md:row-span-2 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between cursor-pointer"
                                    >
                                        {article.image && (
                                            <>
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-[#070B14]/25 to-transparent pointer-events-none" />
                                            </>
                                        )}
                                        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/25 transition-all duration-500" />
                                        <div className="relative z-10 flex items-center justify-between gap-2">
                                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow">
                                                {article.tag || `[ ${cat} ]`}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {article.video_url && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1 shadow-sm">
                                                        <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                        <span>Video</span>
                                                    </span>
                                                )}
                                                {article.date && (
                                                    <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 drop-shadow">
                                                        {article.date}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative z-10 space-y-1.5 mt-auto pt-6 text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug drop-shadow-md">
                                                {article.title}
                                            </h3>
                                            {article.excerpt && (
                                                <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 font-normal leading-relaxed drop-shadow">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <div key={cat} className="md:col-span-2 md:row-span-2 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                                    <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase">
                                        [ {cat} ]
                                    </span>
                                </div>
                            );
                        })()}

                        {/* 2. ACHIEVEMENTS (secondary box top-right: spans 2 cols on lg, 1 col on md, 1 row) */}
                        {(() => {
                            const cat = 'ACHIEVEMENTS'; // state
                            const article = latestByCategory?.[cat]; // state

                            if (article) { // check
                                return (
                                    <Link
                                        key={cat}
                                        href={`/news/${article.slug}`} // redirect
                                        className="md:col-span-1 lg:col-span-2 md:row-span-1 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between cursor-pointer"
                                    >
                                        {article.image && (
                                            <>
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-[#070B14]/25 to-transparent pointer-events-none" />
                                            </>
                                        )}
                                        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/25 transition-all duration-500" />
                                        <div className="relative z-10 flex items-center justify-between gap-2">
                                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow">
                                                {article.tag || `[ ${cat} ]`}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {article.video_url && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1 shadow-sm">
                                                        <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                        <span>Video</span>
                                                    </span>
                                                )}
                                                {article.date && (
                                                    <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 drop-shadow">
                                                        {article.date}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative z-10 space-y-1 mt-auto pt-4 text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug drop-shadow-md">
                                                {article.title}
                                            </h3>
                                            {article.excerpt && (
                                                <p className="text-xs text-neutral-200 line-clamp-1 font-normal leading-relaxed drop-shadow">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <div key={cat} className="md:col-span-1 lg:col-span-2 md:row-span-1 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                                    <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase">
                                        [ {cat} ]
                                    </span>
                                </div>
                            );
                        })()}

                        {/* 3. ANNOUNCEMENTS (medium box: 1 col, 1 row) */}
                        {(() => {
                            const cat = 'ANNOUNCEMENTS'; // state
                            const article = latestByCategory?.[cat]; // state

                            if (article) { // check
                                return (
                                    <Link
                                        key={cat}
                                        href={`/news/${article.slug}`} // redirect
                                        className="md:col-span-1 lg:col-span-1 md:row-span-1 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between cursor-pointer"
                                    >
                                        {article.image && (
                                            <>
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-[#070B14]/25 to-transparent pointer-events-none" />
                                            </>
                                        )}
                                        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/25 transition-all duration-500" />
                                        <div className="relative z-10 flex items-center justify-between gap-2">
                                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow">
                                                {article.tag || `[ ${cat} ]`}
                                            </span>
                                            {article.video_url && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1 shadow-sm">
                                                    <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                    <span>Video</span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative z-10 space-y-1 mt-auto pt-4 text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                                            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug drop-shadow-md">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <div key={cat} className="md:col-span-1 lg:col-span-1 md:row-span-1 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                                    <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase">
                                        [ {cat} ]
                                    </span>
                                </div>
                            );
                        })()}

                        {/* 4. PARTNERSHIPS (box: 1 col on lg, 3 cols on md banner, 1 row) */}
                        {(() => {
                            const cat = 'PARTNERSHIPS'; // state
                            const article = latestByCategory?.[cat]; // state

                            if (article) { // check
                                return (
                                    <Link
                                        key={cat}
                                        href={`/news/${article.slug}`} // redirect
                                        className="md:col-span-3 lg:col-span-1 md:row-span-1 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between cursor-pointer"
                                    >
                                        {article.image && (
                                            <>
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-[#070B14]/25 to-transparent pointer-events-none" />
                                            </>
                                        )}
                                        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/25 transition-all duration-500" />
                                        <div className="relative z-10 flex items-center justify-between gap-2">
                                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow">
                                                {article.tag || `[ ${cat} ]`}
                                            </span>
                                            {article.video_url && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1 shadow-sm">
                                                    <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                    <span>Video</span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative z-10 space-y-1 mt-auto pt-4 text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                                            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug drop-shadow-md">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <div key={cat} className="md:col-span-3 lg:col-span-1 md:row-span-1 rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                                    <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase">
                                        [ {cat} ]
                                    </span>
                                </div>
                            );
                        })()}
                    </div>
                </section>

                {/* 3. active leagues & tournaments (the circuit) */}
                <section
                    id="leagues"
                    className="w-full py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto"
                >
                    {/* title left aligned */}
                    <div className="w-full text-left mb-8 md:mb-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white/95">
                            LEAGUES
                        </h2>
                    </div>

                    {/* 3-column clean grid - uploaded leagues or clean empty glass cards with status badges */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {leagues && leagues.length > 0 ? (
                            leagues.slice(0, 3).map((league) => (
                                <Link
                                    key={league.id}
                                    href={league.slug ? `/leagues/${league.slug}` : '/leagues'}
                                    className="rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] min-h-[380px] md:min-h-[420px] flex flex-col justify-between block"
                                >
                                    <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-semibold tracking-wider uppercase">
                                                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                                {league.registration_status || 'UPCOMING'}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                                                {league.game_title}
                                            </span>
                                        </div>

                                        {league.banner_url && (
                                            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                                                <img
                                                    src={league.banner_url}
                                                    alt={league.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                                            {league.name}
                                        </h3>

                                        <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                                            {league.description || `${league.game_title} official sanctioned circuit organized under MESF.`}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                                        <span>{league.start_date}</span>
                                        <span className="text-amber-400 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            Details &rarr;
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <>
                                {/* circuit card 1 */}
                                <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] min-h-[380px] md:min-h-[420px]">
                                    <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        REGISTRATION OPEN
                                    </div>
                                </div>

                                {/* circuit card 2 */}
                                <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] min-h-[380px] md:min-h-[420px]">
                                    <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold tracking-wider uppercase">
                                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                        LIVE SEASON
                                    </div>
                                </div>

                                {/* circuit card 3 */}
                                <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300 p-6 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] min-h-[380px] md:min-h-[420px]">
                                    <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-400/10 border border-neutral-400/25 text-neutral-300 text-xs font-semibold tracking-wider uppercase">
                                        <span className="h-2 w-2 rounded-full bg-neutral-300" />
                                        OFF-SEASON
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* 4. officially sanctioned games (infinite marquee ticker) */}
                <section
                    id="games"
                    className="w-full py-16 md:py-20 overflow-hidden"
                >
                    {/* title left aligned inside container */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mb-8 md:mb-10 text-left">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white/95">
                            OFFICIALLY SANCTIONED GAMES
                        </h2>
                    </div>

                    {/* full-width marquee container with gradient edge mask */}
                    <div
                        className="marquee-container w-full overflow-hidden py-4 select-none"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                        }}
                    >
                        {/* single flex-row wrapper holding two identical sets of game logos side-by-side */}
                        <div className="marquee-track flex items-center gap-14 sm:gap-20 md:gap-24">
                            {/* set 1 */}
                            <div className="flex items-center gap-14 sm:gap-20 md:gap-24 shrink-0">
                                {/* MLBB */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" title="Mobile Legends: Bang Bang">
                                    <svg viewBox="0 0 250 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M22 8 L36 25 L22 42 L8 25 Z" fill="#F59E0B" />
                                        <path d="M22 14 L31 25 L22 36 L13 25 Z" fill="#FBBF24" />
                                        <circle cx="22" cy="25" r="4.5" fill="#FFFFFF" />
                                        <text x="48" y="26" fill="#FFFFFF" fontSize="16.5" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">MOBILE LEGENDS</text>
                                        <text x="48" y="41" fill="#F59E0B" fontSize="10.5" fontWeight="800" letterSpacing="4" fontFamily="sans-serif">BANG BANG</text>
                                    </svg>
                                </div>

                                {/* PUBG MOBILE */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" title="PUBG Mobile">
                                    <svg viewBox="0 0 195 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <rect x="6" y="9" width="34" height="34" rx="6" fill="#F59E0B" />
                                        <path d="M14 17 h18 v18 h-18 Z" fill="#070B14" />
                                        <path d="M18 20 h10 v4 h-10 Z" fill="#F59E0B" />
                                        <text x="48" y="27" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="1.5" fontFamily="sans-serif">PUBG</text>
                                        <text x="48" y="42" fill="#F59E0B" fontSize="11" fontWeight="800" letterSpacing="3" fontFamily="sans-serif">MOBILE</text>
                                    </svg>
                                </div>

                                {/* VALORANT */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(255,70,85,0.6)]" title="Valorant">
                                    <svg viewBox="0 0 205 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M8 12 L22 38 L28 38 L42 12 H33.5 L25 29 L16.5 12 Z" fill="#FF4655" />
                                        <text x="48" y="32" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="4" fontFamily="sans-serif">VALORANT</text>
                                    </svg>
                                </div>

                                {/* TEKKEN 8 */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" title="Tekken 8">
                                    <svg viewBox="0 0 185 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M10 10 L30 10 L22 23 L34 40 L15 40 L22 29 L10 29 Z" fill="#EF4444" />
                                        <text x="42" y="31" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="2" fontStyle="italic" fontFamily="sans-serif">TEKKEN</text>
                                        <text x="142" y="31" fill="#F59E0B" fontSize="23" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">8</text>
                                    </svg>
                                </div>

                                {/* eFootball */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(2,132,199,0.6)]" title="eFootball">
                                    <svg viewBox="0 0 190 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <circle cx="22" cy="25" r="15" fill="none" stroke="#0284C7" strokeWidth="4" />
                                        <circle cx="22" cy="25" r="7.5" fill="#F59E0B" />
                                        <path d="M12 25 h20" stroke="#0284C7" strokeWidth="2" />
                                        <text x="48" y="32" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">eFootball</text>
                                        <text x="156" y="20" fill="#F59E0B" fontSize="10" fontWeight="700">™</text>
                                    </svg>
                                </div>

                                {/* DOTA 2 */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" title="Dota 2">
                                    <svg viewBox="0 0 165 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <rect x="6" y="8" width="34" height="34" rx="6" fill="#DC2626" />
                                        <path d="M10 36 L36 10" stroke="#070B14" strokeWidth="4.5" />
                                        <circle cx="16" cy="20" r="3.5" fill="#070B14" />
                                        <circle cx="30" cy="30" r="3.5" fill="#070B14" />
                                        <text x="48" y="32" fill="#FFFFFF" fontSize="20" fontWeight="900" letterSpacing="3.5" fontFamily="sans-serif">DOTA 2</text>
                                    </svg>
                                </div>

                                {/* HONOR OF KINGS */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" title="Honor of Kings">
                                    <svg viewBox="0 0 235 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M8 34 L14 15 L22 26 L30 15 L36 34 Z" fill="#F59E0B" />
                                        <circle cx="22" cy="13" r="2.5" fill="#FBBF24" />
                                        <circle cx="14" cy="13" r="2" fill="#FBBF24" />
                                        <circle cx="30" cy="13" r="2" fill="#FBBF24" />
                                        <text x="48" y="26" fill="#FFFFFF" fontSize="16.5" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">HONOR OF KINGS</text>
                                        <text x="48" y="40" fill="#F59E0B" fontSize="10" fontWeight="800" letterSpacing="4" fontFamily="sans-serif">OFFICIAL TITLE</text>
                                    </svg>
                                </div>
                            </div>

                            {/* set 2 (identical duplicate for seamless 30s infinite loop) */}
                            <div className="flex items-center gap-14 sm:gap-20 md:gap-24 shrink-0">
                                {/* MLBB */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" title="Mobile Legends: Bang Bang">
                                    <svg viewBox="0 0 250 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M22 8 L36 25 L22 42 L8 25 Z" fill="#F59E0B" />
                                        <path d="M22 14 L31 25 L22 36 L13 25 Z" fill="#FBBF24" />
                                        <circle cx="22" cy="25" r="4.5" fill="#FFFFFF" />
                                        <text x="48" y="26" fill="#FFFFFF" fontSize="16.5" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">MOBILE LEGENDS</text>
                                        <text x="48" y="41" fill="#F59E0B" fontSize="10.5" fontWeight="800" letterSpacing="4" fontFamily="sans-serif">BANG BANG</text>
                                    </svg>
                                </div>

                                {/* PUBG MOBILE */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" title="PUBG Mobile">
                                    <svg viewBox="0 0 195 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <rect x="6" y="9" width="34" height="34" rx="6" fill="#F59E0B" />
                                        <path d="M14 17 h18 v18 h-18 Z" fill="#070B14" />
                                        <path d="M18 20 h10 v4 h-10 Z" fill="#F59E0B" />
                                        <text x="48" y="27" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="1.5" fontFamily="sans-serif">PUBG</text>
                                        <text x="48" y="42" fill="#F59E0B" fontSize="11" fontWeight="800" letterSpacing="3" fontFamily="sans-serif">MOBILE</text>
                                    </svg>
                                </div>

                                {/* VALORANT */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(255,70,85,0.6)]" title="Valorant">
                                    <svg viewBox="0 0 205 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M8 12 L22 38 L28 38 L42 12 H33.5 L25 29 L16.5 12 Z" fill="#FF4655" />
                                        <text x="48" y="32" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="4" fontFamily="sans-serif">VALORANT</text>
                                    </svg>
                                </div>

                                {/* TEKKEN 8 */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" title="Tekken 8">
                                    <svg viewBox="0 0 185 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M10 10 L30 10 L22 23 L34 40 L15 40 L22 29 L10 29 Z" fill="#EF4444" />
                                        <text x="42" y="31" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="2" fontStyle="italic" fontFamily="sans-serif">TEKKEN</text>
                                        <text x="142" y="31" fill="#F59E0B" fontSize="23" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">8</text>
                                    </svg>
                                </div>

                                {/* eFootball */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(2,132,199,0.6)]" title="eFootball">
                                    <svg viewBox="0 0 190 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <circle cx="22" cy="25" r="15" fill="none" stroke="#0284C7" strokeWidth="4" />
                                        <circle cx="22" cy="25" r="7.5" fill="#F59E0B" />
                                        <path d="M12 25 h20" stroke="#0284C7" strokeWidth="2" />
                                        <text x="48" y="32" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">eFootball</text>
                                        <text x="156" y="20" fill="#F59E0B" fontSize="10" fontWeight="700">™</text>
                                    </svg>
                                </div>

                                {/* DOTA 2 */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" title="Dota 2">
                                    <svg viewBox="0 0 165 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <rect x="6" y="8" width="34" height="34" rx="6" fill="#DC2626" />
                                        <path d="M10 36 L36 10" stroke="#070B14" strokeWidth="4.5" />
                                        <circle cx="16" cy="20" r="3.5" fill="#070B14" />
                                        <circle cx="30" cy="30" r="3.5" fill="#070B14" />
                                        <text x="48" y="32" fill="#FFFFFF" fontSize="20" fontWeight="900" letterSpacing="3.5" fontFamily="sans-serif">DOTA 2</text>
                                    </svg>
                                </div>

                                {/* HONOR OF KINGS */}
                                <div className="h-10 sm:h-11 md:h-12 flex items-center shrink-0 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" title="Honor of Kings">
                                    <svg viewBox="0 0 235 50" className="h-10 sm:h-11 md:h-12 w-auto">
                                        <path d="M8 34 L14 15 L22 26 L30 15 L36 34 Z" fill="#F59E0B" />
                                        <circle cx="22" cy="13" r="2.5" fill="#FBBF24" />
                                        <circle cx="14" cy="13" r="2" fill="#FBBF24" />
                                        <circle cx="30" cy="13" r="2" fill="#FBBF24" />
                                        <text x="48" y="26" fill="#FFFFFF" fontSize="16.5" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">HONOR OF KINGS</text>
                                        <text x="48" y="40" fill="#F59E0B" fontSize="10" fontWeight="800" letterSpacing="4" fontFamily="sans-serif">OFFICIAL TITLE</text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. the national team (team mys) interactive tabbed showcase */}
                <section
                    id="teams"
                    className="w-full py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto"
                >
                    {/* header */}
                    <div className="w-full text-center mb-8">
                        <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
                            NATIONAL SQUAD
                        </h3>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
                            MEET TEAM MYS
                        </h2>
                    </div>

                    {/* tabs navigation */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 max-w-5xl mx-auto">
                        {teamRoster.map((squad) => {
                            const isActive = activeSquad === squad.id;
                            return (
                                <button
                                    key={squad.id}
                                    type="button"
                                    onClick={() => setActiveSquad(squad.id)} // state
                                    className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold border-transparent shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105'
                                            : 'border border-white/10 backdrop-blur-md bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {squad.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* cinematic roster showcase card */}
                    <div className="relative h-[400px] md:h-[500px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group bg-[#0A0F1D]">
                        {/* active squad background image with smooth transition */}
                        <img
                            key={currentSquad.id}
                            src={currentSquad.image}
                            alt={currentSquad.label}
                            onError={(e) => {
                                e.target.style.opacity = '0';
                            }}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-105 opacity-90"
                        />

                        {/* fallback dark backdrop */}
                        <div className="absolute inset-0 bg-[#070B14]/40 -z-10" />

                        {/* heavy dark gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none" />

                        {/* subtle amber corner glow */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />

                        {/* content container */}
                        <div className="relative z-10 h-full w-full p-6 sm:p-8 md:p-12 flex flex-col justify-end">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                {/* bottom left: accolade and large label */}
                                <div className="space-y-1.5 sm:space-y-2 text-left">
                                    <span className="inline-block text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
                                        {currentSquad.accolade}
                                    </span>
                                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                        {currentSquad.label}
                                    </h3>
                                </div>

                                {/* bottom right: competitive format badge */}
                                <div className="flex items-center md:justify-end">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/[0.08] backdrop-blur-md text-white/95 text-xs sm:text-sm font-semibold tracking-wide shadow-lg select-none">
                                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                                        <span>{currentSquad.format}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. the 14 affiliated members (the 7x2 grid) */}
                <section
                    id="affiliates"
                    className="w-full py-24 md:py-28 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto"
                >
                    {/* header */}
                    <div className="w-full text-left mb-12 md:mb-16">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white/95 uppercase">
                            AFFILIATED MEMBERS
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                            Official state and federal territory esports associations across Malaysia.
                        </p>
                    </div>

                    {/* symmetrical 7x2 grid on desktop, 4 cols on tablet, 2 cols on mobile */}
                    <div className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-14 sm:gap-y-16 gap-x-6 sm:gap-x-8 items-center justify-items-center">
                        {stateAssociations.map((item) => (
                            <Link
                                key={item.id}
                                href="/teams#affiliates"
                                style={{
                                    '--state-glow': item.glowRgba,
                                    '--state-color': item.glowColor
                                }}
                                className="group relative flex flex-col items-center justify-center cursor-pointer select-none"
                            >
                                {/* raw floating logo/crest: zero background colors, zero borders, grayscale and opacity-60 by default */}
                                <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="max-h-full max-w-full object-contain filter transition-all duration-300 group-hover:[filter:drop-shadow(0_0_14px_var(--state-glow))_drop-shadow(0_0_28px_var(--state-glow))]"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'; // fallback
                                        }}
                                    />
                                </div>

                                {/* tiny glowing text label drops down just below on hover */}
                                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-30 whitespace-nowrap">
                                    <span
                                        className="text-[11px] sm:text-xs font-semibold tracking-wider transition-colors duration-200"
                                        style={{
                                            color: item.glowColor,
                                            textShadow: `0 0 10px ${item.glowRgba}`
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 7. official modern interactive footer */}
                <Footer />
            </div>
        </div>
    );
}
