// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import {
    Play,
    Trophy,
    Calendar,
    Clock,
    Users,
    Coins,
    MapPin,
    Layers,
    ArrowRight,
    ArrowUpRight,
    Sparkles,
    Shield,
    FileText,
    Award,
    CheckCircle2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';


// --2. main component--
export default function Welcome({ latestByCategory = {}, latestUpdates = [], allNews = [], featuredArticle = null, leagues = [], teams = [] }) {
    // --3. properties--
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const bannerUrl = settings?.bannerUrl || '/images/mesf_bg_v2.jpg'; // properties

    const isDashboardRoute = typeof window !== 'undefined' && (
        new URLSearchParams(window.location.search).get('view') === 'dashboard' ||
        window.location.hash === '#dashboard'
    ); // check
    const lastScrollYRef = useRef(isDashboardRoute ? 230 : 0); // ref
    const scrollRafRef = useRef(null); // ref
    const [scrollY, setScrollY] = useState(() => (isDashboardRoute ? 230 : 0)); // state
    const [activeTab, setActiveTab] = useState('home'); // state
    const [squadIndex, setSquadIndex] = useState(0); // state
    const touchStartX = useRef(null); // ref

    // --4. actions--
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual'; // config
            }
            const params = new URLSearchParams(window.location.search);
            const isDashboard = params.get('view') === 'dashboard' || window.location.hash === '#dashboard';
            
            if (isDashboard) {
                window.scrollTo(0, 230); // scroll
                setScrollY(230); // state
            } else if (!window.location.hash && window.scrollY === 0) {
                window.scrollTo(0, 0); // scroll
                setScrollY(0); // state
            }
        }

        const handleScroll = () => {
            if (scrollRafRef.current) return; // check
            scrollRafRef.current = requestAnimationFrame(() => { // trigger
                scrollRafRef.current = null; // state
                const currentY = window.scrollY; // state
                // hero transitions only occur within 0-240px, gate state updates to eliminate scroll lag
                if (currentY <= 240 || lastScrollYRef.current <= 240) { // check
                    setScrollY(currentY); // state
                }
                lastScrollYRef.current = currentY; // save
            });
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
            if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current); // trigger
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return; // check

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed'); // trigger
                        observer.unobserve(entry.target); // save
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        const elements = document.querySelectorAll('.reveal-on-scroll'); // state
        elements.forEach((el) => observer.observe(el)); // trigger

        return () => observer.disconnect();
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


    const sanctionedGameLogos = [
        {
            id: 'mlbb',
            title: 'Mobile Legends: Bang Bang',
            glowColor: 'rgba(245, 158, 11, 0.35)',
            glowBorder: 'hover:border-amber-400/50',
            glowShadow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]',
            svg: (
                <svg viewBox="0 0 250 50" className="h-9 sm:h-10 md:h-11 w-auto">
                    <path d="M22 8 L36 25 L22 42 L8 25 Z" fill="#F59E0B" />
                    <path d="M22 14 L31 25 L22 36 L13 25 Z" fill="#FBBF24" />
                    <circle cx="22" cy="25" r="4.5" fill="#FFFFFF" />
                    <text x="48" y="26" fill="#FFFFFF" fontSize="16.5" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">MOBILE LEGENDS</text>
                    <text x="48" y="41" fill="#F59E0B" fontSize="10.5" fontWeight="800" letterSpacing="4" fontFamily="sans-serif">BANG BANG</text>
                </svg>
            )
        },
        {
            id: 'pubgm',
            title: 'PUBG Mobile',
            glowColor: 'rgba(245, 158, 11, 0.35)',
            glowBorder: 'hover:border-amber-400/50',
            glowShadow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]',
            svg: (
                <svg viewBox="0 0 195 50" className="h-9 sm:h-10 md:h-11 w-auto">
                    <rect x="6" y="9" width="34" height="34" rx="6" fill="#F59E0B" />
                    <path d="M14 17 h18 v18 h-18 Z" fill="#070B14" />
                    <path d="M18 20 h10 v4 h-10 Z" fill="#F59E0B" />
                    <text x="48" y="27" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="1.5" fontFamily="sans-serif">PUBG</text>
                    <text x="48" y="42" fill="#F59E0B" fontSize="11" fontWeight="800" letterSpacing="3" fontFamily="sans-serif">MOBILE</text>
                </svg>
            )
        },
        {
            id: 'valorant',
            title: 'Valorant',
            glowColor: 'rgba(255, 70, 85, 0.38)',
            glowBorder: 'hover:border-rose-500/50',
            glowShadow: 'hover:shadow-[0_0_30px_rgba(255,70,85,0.38)]',
            svg: (
                <svg viewBox="0 0 205 50" className="h-9 sm:h-10 md:h-11 w-auto">
                    <path d="M8 12 L22 38 L28 38 L42 12 H33.5 L25 29 L16.5 12 Z" fill="#FF4655" />
                    <text x="48" y="32" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="4" fontFamily="sans-serif">VALORANT</text>
                </svg>
            )
        },
        {
            id: 'tekken8',
            title: 'Tekken 8',
            glowColor: 'rgba(239, 68, 68, 0.38)',
            glowBorder: 'hover:border-red-500/50',
            glowShadow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.38)]',
            svg: (
                <svg viewBox="0 0 185 50" className="h-9 sm:h-10 md:h-11 w-auto">
                    <path d="M10 10 L30 10 L22 23 L34 40 L15 40 L22 29 L10 29 Z" fill="#EF4444" />
                    <text x="42" y="31" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="2" fontStyle="italic" fontFamily="sans-serif">TEKKEN</text>
                    <text x="142" y="31" fill="#F59E0B" fontSize="23" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">8</text>
                </svg>
            )
        },
        {
            id: 'efootball',
            title: 'eFootball',
            glowColor: 'rgba(2, 132, 199, 0.38)',
            glowBorder: 'hover:border-sky-400/50',
            glowShadow: 'hover:shadow-[0_0_30px_rgba(2,132,199,0.38)]',
            svg: (
                <svg viewBox="0 0 190 50" className="h-9 sm:h-10 md:h-11 w-auto">
                    <circle cx="22" cy="25" r="15" fill="none" stroke="#0284C7" strokeWidth="4" />
                    <circle cx="22" cy="25" r="7.5" fill="#F59E0B" />
                    <path d="M12 25 h20" stroke="#0284C7" strokeWidth="2" />
                    <text x="48" y="32" fill="#FFFFFF" fontSize="19" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">eFootball</text>
                    <text x="156" y="20" fill="#F59E0B" fontSize="10" fontWeight="700">™</text>
                </svg>
            )
        },
        {
            id: 'dota2',
            title: 'Dota 2',
            glowColor: 'rgba(220, 38, 38, 0.38)',
            glowBorder: 'hover:border-red-600/50',
            glowShadow: 'hover:shadow-[0_0_30px_rgba(220,38,38,0.38)]',
            svg: (
                <svg viewBox="0 0 165 50" className="h-9 sm:h-10 md:h-11 w-auto">
                    <rect x="6" y="8" width="34" height="34" rx="6" fill="#DC2626" />
                    <path d="M10 36 L36 10" stroke="#070B14" strokeWidth="4.5" />
                    <circle cx="16" cy="20" r="3.5" fill="#070B14" />
                    <circle cx="30" cy="30" r="3.5" fill="#070B14" />
                    <text x="48" y="32" fill="#FFFFFF" fontSize="20" fontWeight="900" letterSpacing="3.5" fontFamily="sans-serif">DOTA 2</text>
                </svg>
            )
        },
        {
            id: 'hok',
            title: 'Honor of Kings',
            glowColor: 'rgba(251, 191, 36, 0.35)',
            glowBorder: 'hover:border-amber-400/50',
            glowShadow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.35)]',
            svg: (
                <svg viewBox="0 0 235 50" className="h-9 sm:h-10 md:h-11 w-auto">
                    <path d="M8 34 L14 15 L22 26 L30 15 L36 34 Z" fill="#F59E0B" />
                    <circle cx="22" cy="13" r="2.5" fill="#FBBF24" />
                    <circle cx="14" cy="13" r="2" fill="#FBBF24" />
                    <circle cx="30" cy="13" r="2" fill="#FBBF24" />
                    <text x="48" y="26" fill="#FFFFFF" fontSize="16.5" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">HONOR OF KINGS</text>
                    <text x="48" y="40" fill="#F59E0B" fontSize="10" fontWeight="800" letterSpacing="4" fontFamily="sans-serif">OFFICIAL TITLE</text>
                </svg>
            )
        }
    ];


    const teamRoster = [
        {
            id: 'mlbb-open',
            code: 'MAS-MLBB-M',
            monogram: 'MLBB',
            name: "Men's National Squad",
            game: 'Mobile Legends: Bang Bang',
            division: "Men's Open Division",
            format: '5v5 MOBA',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/mlbb-open.jpg',
            accolade: 'SEA Games Representatives',
            status: 'Active Roster',
            desc: 'Official national squad representing Malaysia in the SEA Games and global invitationals.'
        },
        {
            id: 'mlbb-women',
            code: 'MAS-MLBB-W',
            monogram: 'MLBB',
            name: "Women's National Squad",
            game: 'Mobile Legends: Bang Bang',
            division: "Women's Division",
            format: '5v5 MOBA',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/mlbb-women.jpg',
            accolade: 'IESF World Contenders',
            status: 'Active Roster',
            desc: "Premier women's national delegation contending in global IESF World Championships."
        },
        {
            id: 'pubgm',
            code: 'MAS-PUBGM',
            monogram: 'PUBGM',
            name: "National Battle Royale Squad",
            game: 'PUBG Mobile',
            division: 'Open National Squad',
            format: '4-Player Squad',
            athletes: '4 Starters • 1 Sub',
            image: '/images/squads/pubgm.jpg',
            accolade: 'Asian Games Medalists',
            status: 'Active Roster',
            desc: 'Decorated battle royale contingent representing Malaysia in Asian Games and global circuits.'
        },
        {
            id: 'cs2-open',
            code: 'MAS-CS2-M',
            monogram: 'CS2',
            name: "Men's Tactical FPS Squad",
            game: 'Counter-Strike 2',
            division: "Men's Open Division",
            format: '5v5 Tactical FPS',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/cs2-open.jpg',
            accolade: 'IESF World Contenders',
            status: 'Active Roster',
            desc: 'National tactical FPS squad competing across Asian continental qualifiers and world stages.'
        },
        {
            id: 'cs2-women',
            code: 'MAS-CS2-W',
            monogram: 'CS2',
            name: "Women's Tactical FPS Squad",
            game: 'Counter-Strike 2',
            division: "Women's Division",
            format: '5v5 Tactical FPS',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/cs2-women.jpg',
            accolade: 'IESF World Contenders',
            status: 'Active Roster',
            desc: "National women's CS2 delegation representing the flag at global federated tournaments."
        },
        {
            id: 'dota2',
            code: 'MAS-DOTA-M',
            monogram: 'DOTA2',
            name: "Commonwealth Gold Contingent",
            game: 'Dota 2',
            division: "Men's Open Division",
            format: '5v5 MOBA',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/dota2.jpg',
            accolade: 'Commonwealth Gold Medalists',
            status: 'Active Roster',
            desc: 'Historic gold medal powerhouse representing Malaysia in premier international multi-sport events.'
        },
        {
            id: 'dota2-women',
            code: 'MAS-DOTA-W',
            monogram: 'DOTA2',
            name: "Women's Dota 2 Squad",
            game: 'Dota 2',
            division: "Women's Division",
            format: '5v5 MOBA',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/dota2-women.jpg',
            accolade: 'National Squad',
            status: 'Active Roster',
            desc: "Dedicated national women's Dota 2 squad developing for international championships."
        },
        {
            id: 'valorant',
            code: 'MAS-VAL',
            monogram: 'VAL',
            name: "National Valorant Squad",
            game: 'VALORANT',
            division: 'Open National Squad',
            format: '5v5 Tactical FPS',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/valorant.jpg',
            accolade: 'National Squad',
            status: 'Active Roster',
            desc: 'Selected through MESF national qualifiers to represent the federation in regional competitions.'
        },
        {
            id: 'hok',
            code: 'MAS-HOK',
            monogram: 'HOK',
            name: "SEA Games National Delegation",
            game: 'Honor of Kings',
            division: 'Open National Squad',
            format: '5v5 MOBA',
            athletes: '5 Starters • 1 Sub',
            image: '/images/squads/hok.jpg',
            accolade: 'SEA Games Representatives',
            status: 'Active Roster',
            desc: 'National Honor of Kings delegation competing in regional championships and the SEA Games.'
        },
        {
            id: 'efootball',
            code: 'MAS-EFT',
            monogram: 'eFT',
            name: "National Virtual Football Duo",
            game: 'eFootball',
            division: 'Sports Simulation',
            format: 'Individual & Co-Op',
            athletes: '2 National Athletes',
            image: '/images/squads/efootball.jpg',
            accolade: 'National Champion',
            status: 'Active Roster',
            desc: "Malaysia's virtual football athletes competing in Asian & world federated tournaments."
        },
        {
            id: 'tekken',
            code: 'MAS-TK8',
            monogram: 'TK8',
            name: "National FGC Representative",
            game: 'Tekken 8',
            division: 'Fighting Games (FGC)',
            format: 'Individual 1v1',
            athletes: '1 Athlete • 1 Reserve',
            image: '/images/squads/tekken.jpg',
            accolade: 'National Champion',
            status: 'Active Roster',
            desc: "Malaysia's premier fighting game representative at global IESF and multi-sport championships."
        }
    ];

    const handlePrevSquad = () => { // action
        setSquadIndex((prev) => (prev - 1 + teamRoster.length) % teamRoster.length);
    };
    const handleNextSquad = () => { // action
        setSquadIndex((prev) => (prev + 1) % teamRoster.length);
    };
    const handleTouchStart = (e) => { // touch
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => { // touch
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 45) {
            handleNextSquad();
        } else if (diff < -45) {
            handlePrevSquad();
        }
        touchStartX.current = null;
    };

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

            {/* ambient vignette overlay */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#080d19]/40 via-transparent to-[#04070f]/60" />

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
                        className="group cursor-pointer mb-6 select-none"
                        style={{
                            transform: `rotateY(${heroRotateY}deg)`,
                            transformStyle: 'preserve-3d',
                            willChange: 'transform'
                        }}
                    >
                        <img
                            src={logoUrl}
                            alt="MESF Logo"
                            width={224}
                            height={224}
                            loading="eager"
                            fetchPriority="high"
                            decoding="sync"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/mesf_logo.png';
                            }}
                            className="h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 max-h-[26vh] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] group-hover:[transform:rotateY(720deg)] transition-transform duration-1000 ease-in-out [backface-visibility:hidden]"
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
                    className="group cursor-pointer flex flex-col items-center justify-center pb-6 transition-opacity hover:opacity-80"
                    aria-label="Scroll down"
                >
                    <svg
                        className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors"
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
                            <div className="inline-block text-xs sm:text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
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
                                    className="w-44 sm:w-48 py-2.5 sm:py-3 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_25px_rgba(251,191,36,0.4)] transition-all duration-200 cursor-pointer"
                                >
                                    Learn More
                                </Link>
                                <Link
                                    href="/leagues"
                                    className="relative overflow-hidden w-44 sm:w-48 py-2.5 sm:py-3 flex items-center justify-center rounded-full backdrop-blur-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase border border-white/20 hover:border-white/40 shadow-[0_4px_25px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer group"
                                >
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

                {/* 2. content sections (each part with distinctive thematic background color) */}
                <div className="relative z-20 w-full">
                    {/* part 1: latest news & announcements (obsidian slate theme) */}
                    <section
                        id="news"
                        className="relative w-full bg-[#060A14] border-t border-white/[0.08] shadow-[0_-25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                    >
                        {/* subtle ambient cool-blue backlight */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(37,99,235,0.07),transparent_75%)]" />

                        <div className="relative z-10 w-full pt-14 pb-12 sm:pt-16 sm:pb-14 md:pt-20 md:pb-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
                            {/* section header */}
                        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 reveal-on-scroll">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                            LATEST NEWS
                        </h2>
                        <Link
                            href="/news" // redirect
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 hover:border-amber-400/40 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold tracking-wider uppercase text-neutral-300 hover:text-white transition-all duration-200 shrink-0 cursor-pointer self-start sm:self-auto"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200" />
                        </Link>
                    </div>

                    {/* refined institutional news layout */}
                    {(() => {
                        const newsSource = (allNews && allNews.length > 0)
                            ? allNews
                            : (latestUpdates && latestUpdates.length > 0 ? latestUpdates : []); // state

                        const fallbackCategories = ['TOURNAMENTS', 'ACHIEVEMENTS', 'ANNOUNCEMENTS', 'PARTNERSHIPS', 'COMMUNITY']; // state

                        // lead article: prioritized featured or newest
                        const heroArticle = featuredArticle || newsSource.find(item => item.is_featured && !item.is_empty) || newsSource[0] || { category: 'TOURNAMENTS', is_empty: true }; // state

                        // complementary articles (up to 2)
                        const remainingNews = newsSource.filter(item => item && !item.is_empty && (heroArticle.id ? item.id !== heroArticle.id : true)); // check

                        const sideArticles = []; // state
                        for (let i = 0; i < 2; i++) { // loop
                            if (remainingNews[i] && !remainingNews[i].is_empty) { // check
                                sideArticles.push(remainingNews[i]); // save
                            } else {
                                const cat = fallbackCategories[(i + 1) % fallbackCategories.length]; // convert
                                sideArticles.push(latestByCategory?.[cat] || { category: cat, is_empty: true }); // save
                            }
                        }

                        const cleanCategoryTag = (item) => { // convert
                            const raw = item.tag || item.category || 'ANNOUNCEMENT'; // state
                            return raw.replace(/^\[\s*|\s*\]$/g, '').trim().toUpperCase(); // convert
                        };

                        return (
                            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch reveal-on-scroll reveal-delay-1">
                                {/* Lead Featured Story (7 cols) */}
                                <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
                                    {(() => {
                                        const hasHero = !heroArticle.is_empty && heroArticle.slug; // check
                                        const heroTag = cleanCategoryTag(heroArticle); // convert

                                        if (hasHero) { // check
                                            return (
                                                <Link
                                                    key={heroArticle.id || 'hero-article'}
                                                    href={`/news/${heroArticle.slug}`} // redirect
                                                    className="group flex flex-col justify-between h-full rounded-2xl bg-[#090d18] hover:bg-[#0c1222] border border-white/10 hover:border-white/25 transition-colors duration-200 overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.45)] cursor-pointer"
                                                >
                                                    {/* lead image container */}
                                                    <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden shrink-0">
                                                        {heroArticle.image ? (
                                                            <img
                                                                src={heroArticle.image}
                                                                alt={heroArticle.title}
                                                                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-200"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c1324] to-[#060911]">
                                                                <img
                                                                    src="/images/mesf_logo.png"
                                                                    alt="MESF"
                                                                    className="h-16 w-16 opacity-30 object-contain"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-transparent to-black/25 pointer-events-none" />
                                                        
                                                        {/* badges overlay */}
                                                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                                                            <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-amber-400 bg-black/85 border border-amber-400/30 uppercase shadow-sm">
                                                                {heroTag}
                                                            </span>
                                                            <div className="flex items-center gap-1.5">
                                                                {heroArticle.is_featured && (
                                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold uppercase bg-white/10 border border-white/20 text-neutral-200 flex items-center gap-1">
                                                                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                                                                        <span>Featured</span>
                                                                    </span>
                                                                )}
                                                                {heroArticle.video_url && (
                                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold uppercase bg-white/10 border border-white/20 text-neutral-200 flex items-center gap-1">
                                                                        <Play className="w-2.5 h-2.5 fill-current text-neutral-300" />
                                                                        <span>Video</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* lead text details */}
                                                    <div className="p-5 sm:p-6 md:p-7 flex-1 flex flex-col justify-between space-y-4 text-left">
                                                        <div className="space-y-2.5">
                                                            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                                                                {heroArticle.date && (
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                                        {heroArticle.date}
                                                                    </span>
                                                                )}
                                                                {heroArticle.location && heroArticle.location !== 'OFFICIAL' && (
                                                                    <span className="flex items-center gap-1.5">
                                                                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                                                        {heroArticle.location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white transition-colors leading-snug">
                                                                {heroArticle.title}
                                                            </h3>
                                                            {heroArticle.excerpt && (
                                                                <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 font-normal leading-relaxed">
                                                                    {heroArticle.excerpt}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
                                                            <span>Read Announcement</span>
                                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        }

                                        return (
                                            <div className="flex flex-col justify-between h-full rounded-2xl bg-[#090d18] border border-white/10 p-6 sm:p-8 text-left">
                                                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 w-fit uppercase">
                                                    {heroTag}
                                                </span>
                                                <div className="space-y-2 my-auto py-10">
                                                    <h3 className="text-xl sm:text-2xl font-bold text-white">Official Bulletin</h3>
                                                    <p className="text-sm text-neutral-400">Upcoming releases in this category will be published here.</p>
                                                </div>
                                                <div className="text-xs text-neutral-500">MESF Official Communications</div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Complementary Articles Stack (5 cols) */}
                                <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4 sm:gap-5">
                                    {sideArticles.map((article, idx) => {
                                        const hasArticle = !article.is_empty && article.slug; // check
                                        const tag = cleanCategoryTag(article); // convert

                                        if (hasArticle) { // check
                                            return (
                                                <Link
                                                    key={article.id || `side-${idx}`}
                                                    href={`/news/${article.slug}`} // redirect
                                                    className="group flex flex-col sm:flex-row items-stretch flex-1 rounded-2xl bg-[#090d18] hover:bg-[#0c1222] border border-white/10 hover:border-white/25 transition-colors duration-200 overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.4)] cursor-pointer"
                                                >
                                                    {/* thumbnail container */}
                                                    <div className="relative w-full sm:w-44 md:w-48 aspect-[16/10] sm:aspect-auto bg-neutral-900 shrink-0 overflow-hidden">
                                                        {article.image ? (
                                                            <img
                                                                src={article.image}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-200"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-gradient-to-br from-[#0c1324] to-[#060911]">
                                                                <img
                                                                    src="/images/mesf_logo.png"
                                                                    alt="MESF"
                                                                    className="h-10 w-10 opacity-30 object-contain"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-2.5 left-2.5 sm:hidden">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase text-amber-400 bg-black/85 border border-amber-400/30">
                                                                {tag}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* content container */}
                                                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
                                                        <div className="space-y-1.5">
                                                            <div className="hidden sm:flex items-center justify-between gap-2">
                                                                <span className="text-[10px] font-mono font-semibold tracking-wider text-amber-400 uppercase">
                                                                    {tag}
                                                                </span>
                                                                {article.date && (
                                                                    <span className="text-[11px] font-mono text-neutral-400">
                                                                        {article.date}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="sm:hidden flex items-center text-[11px] font-mono text-neutral-400">
                                                                {article.date}
                                                            </div>
                                                            <h4 className="text-sm sm:text-base font-bold text-white transition-colors leading-snug line-clamp-2">
                                                                {article.title}
                                                            </h4>
                                                            {article.excerpt && (
                                                                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed hidden md:block">
                                                                    {article.excerpt}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors pt-1">
                                                            <span>Read Story</span>
                                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        }

                                        return (
                                            <div
                                                key={article.id || `empty-${idx}`}
                                                className="flex flex-col justify-between flex-1 rounded-2xl bg-[#090d18] border border-white/10 p-5 text-left"
                                            >
                                                <span className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 uppercase">
                                                    {tag}
                                                </span>
                                                <div className="my-auto py-4">
                                                    <h4 className="text-sm sm:text-base font-semibold text-neutral-300">Official Bulletin</h4>
                                                    <p className="text-xs text-neutral-500 mt-1">Upcoming releases in this category will be published here.</p>
                                                </div>
                                                <div className="text-[11px] text-neutral-500">MESF Update</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                        </div>
                    </section>

                    {/* part 2: active leagues & tournaments (deep federation navy theme) */}
                    <section
                        id="leagues"
                        className="relative w-full bg-[#0A1224] border-t border-white/[0.08] overflow-hidden"
                    >
                        {/* subtle ambient warm/amber corner wash */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_20%,rgba(245,158,11,0.04),transparent_65%)]" />

                        <div className="relative z-10 w-full py-12 sm:py-14 md:py-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
                            {/* section header */}
                        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 reveal-on-scroll">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                            OFFICIAL LEAGUES
                        </h2>
                        <Link
                            href="/leagues" // redirect
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 hover:border-amber-400/40 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold tracking-wider uppercase text-neutral-300 hover:text-white transition-all duration-200 shrink-0 cursor-pointer self-start sm:self-auto"
                        >
                            <span>Explore All</span>
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200" />
                        </Link>
                    </div>

                    {/* 3-column clean grid - uploaded leagues or showcase glass cards with hover sneak peek */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 reveal-on-scroll reveal-delay-1">
                        {leagues && leagues.length > 0 ? (
                            leagues.slice(0, 3).map((league, index) => {
                                const shouldShow = (key, val) => {
                                    if (!val || val === 'TBA') return false;
                                    if (Array.isArray(league.display_options) && league.display_options.length > 0) {
                                        return league.display_options.includes(key);
                                    }
                                    return true;
                                };

                                const statusStr = (league.registration_status || 'UPCOMING').toUpperCase();
                                const isRegistrationOpen = statusStr.includes('OPEN');
                                const isLive = statusStr.includes('LIVE');
                                const statusClass = isRegistrationOpen
                                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                                    : isLive
                                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                                    : 'bg-amber-400/10 border-amber-400/25 text-amber-400';
                                const dotClass = isRegistrationOpen
                                    ? 'bg-emerald-400'
                                    : isLive
                                    ? 'bg-rose-500'
                                    : 'bg-amber-400';

                                return (
                                    <Link
                                        key={league.id}
                                        href={league.slug ? `/leagues/${league.slug}` : '/leagues'}
                                        className="rounded-2xl md:rounded-3xl border border-white/10 bg-[#0A0F1D]/80 backdrop-blur-xl overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col h-[540px] sm:h-[580px] cursor-pointer transition-colors duration-300 hover:border-amber-400/40 block relative"
                                    >
                                        {/* top card header: vibrant yellow theme bar */}
                                        <div className="py-3.5 px-4 sm:px-5 bg-amber-400 text-slate-950 shrink-0 z-10 flex items-center justify-center text-center shadow-sm">
                                            <h3 className="text-sm sm:text-base font-black tracking-wider uppercase truncate">
                                                {league.name || 'LEAGUE NAME'}
                                            </h3>
                                        </div>

                                        {/* poster showcase area: shows the whole poster fully without cropping */}
                                        <div className="flex-1 relative overflow-hidden bg-[#070B16] flex items-center justify-center p-3 sm:p-4">
                                            {/* normal poster uploaded by admin */}
                                            {league.banner_url ? (
                                                <img
                                                    src={league.banner_url}
                                                    alt={league.name || 'LEAGUE NAME'}
                                                    className="w-full h-full object-contain object-center"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 p-6 text-center">
                                                    <Trophy className="w-9 h-9 text-neutral-600 mb-2" />
                                                    <p className="text-[11px] font-mono tracking-wider uppercase text-neutral-500">
                                                        Tournament Poster
                                                    </p>
                                                </div>
                                            )}

                                            {/* frosted hover overlay: clean, spacious, visible hierarchy */}
                                            <div className="absolute inset-0 bg-[#060913]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 sm:p-8 flex flex-col justify-between z-20 text-left">
                                                <div className="space-y-5 sm:space-y-6">
                                                    {/* index & eyebrow */}
                                                    <div className="space-y-1.5">
                                                        <span className="text-xs sm:text-sm font-mono font-bold text-neutral-400 block tracking-wider">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </span>
                                                        <p className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                                                            {league.registration_status || 'REGISTRATION OPEN'} • {league.tier ? league.tier.split('-')[0].trim() : 'OFFICIAL CIRCUIT'}
                                                        </p>
                                                    </div>

                                                    {/* title & clean description */}
                                                    <div className="space-y-2.5">
                                                        <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-snug line-clamp-2">
                                                            {league.name || 'LEAGUE NAME'}
                                                        </h4>
                                                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3 sm:line-clamp-4">
                                                            {league.description || 'Official Malaysia Esports Federation sanctioned tournament circuit featuring premier national competition.'}
                                                        </p>
                                                    </div>

                                                    {/* circuit highlights chips */}
                                                    <div className="space-y-2.5 pt-1">
                                                        <p className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                                                            CIRCUIT HIGHLIGHTS
                                                        </p>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {shouldShow('prize_pool', league.prize_pool) && (
                                                                <span className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-mono font-bold text-amber-300">
                                                                    {league.prize_pool} Prize Pool
                                                                </span>
                                                            )}
                                                            {shouldShow('closing_date', league.registration_deadline) && (
                                                                <span className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-medium text-neutral-200">
                                                                    Closes {league.registration_deadline}
                                                                </span>
                                                            )}
                                                            {shouldShow('dates', league.date_range) && (
                                                                <span className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-medium text-neutral-200">
                                                                    {league.date_range}
                                                                </span>
                                                            )}
                                                            {shouldShow('slots', league.slots) && (
                                                                <span className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-medium text-neutral-200">
                                                                    {league.slots} Slots
                                                                </span>
                                                            )}
                                                            {shouldShow('fee', league.entry_fee) && (
                                                                <span className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-medium text-neutral-200">
                                                                    {league.entry_fee}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* bottom action button: clean white pill button */}
                                                <div className="pt-5 sm:pt-6 border-t border-white/10 flex items-center justify-start">
                                                    <span className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg group-hover:bg-amber-400 transition-colors">
                                                        <span>View League</span>
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-16 text-center rounded-2xl border border-white/10 bg-[#0A0F1D]/80 backdrop-blur-xl p-8 space-y-4 max-w-xl mx-auto">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-bold text-base">
                                        No Active Leagues Scheduled
                                    </p>
                                    <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed">
                                        There are currently no active leagues published by administration. Check back soon for upcoming tournaments.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <Link
                                        href="/leagues"
                                        className="px-5 py-2 rounded-xl bg-white text-black text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer hover:bg-neutral-200"
                                    >
                                        Explore Leagues
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                        </div>
                    </section>

                    {/* part 3: officially sanctioned games (pitch arena stage with glowing badges) */}
                    <section
                        id="games"
                        className="relative w-full bg-[#03060E] border-t border-white/[0.08] overflow-hidden"
                    >
                        {/* subtle ambient golden wash in center */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(245,158,11,0.06),transparent_80%)]" />

                        <div className="relative z-10 w-full py-12 sm:py-14 md:py-16">
                            {/* section header */}
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mb-6 sm:mb-8 reveal-on-scroll">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                                    SANCTIONED GAMES
                                </h2>
                            </div>

                            {/* full-width marquee container with gradient edge mask */}
                            <div
                                className="marquee-container w-full overflow-hidden py-4 select-none reveal-on-scroll reveal-delay-1"
                                style={{
                                    maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                                }}
                            >
                                <div className="marquee-track flex items-center">
                                    {/* set 1 */}
                                    <div className="flex items-center gap-6 sm:gap-8 md:gap-10 shrink-0 pr-6 sm:pr-8 md:pr-10">
                                        {sanctionedGameLogos.map((game) => (
                                            <div
                                                key={`set1-${game.id}`}
                                                title={game.title}
                                                className={`group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#080E1C]/90 hover:bg-[#0D162B] border border-white/10 ${game.glowBorder} ${game.glowShadow} transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden backdrop-blur-md`}
                                            >
                                                {/* ambient radial glow behind logo that pops */}
                                                <div
                                                    className="pointer-events-none absolute inset-0 opacity-45 group-hover:opacity-95 transition-opacity duration-300 blur-xl"
                                                    style={{
                                                        background: `radial-gradient(circle at center, ${game.glowColor} 0%, transparent 70%)`
                                                    }}
                                                />

                                                {/* top subtle glass reflection line */}
                                                <div className="pointer-events-none absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                                                {/* the logo SVG with full vibrant clarity */}
                                                <div className="relative z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                                                    {game.svg}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* set 2 (identical duplicate for seamless infinite loop) */}
                                    <div className="flex items-center gap-6 sm:gap-8 md:gap-10 shrink-0 pr-6 sm:pr-8 md:pr-10">
                                        {sanctionedGameLogos.map((game) => (
                                            <div
                                                key={`set2-${game.id}`}
                                                title={game.title}
                                                className={`group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#080E1C]/90 hover:bg-[#0D162B] border border-white/10 ${game.glowBorder} ${game.glowShadow} transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden backdrop-blur-md`}
                                            >
                                                {/* ambient radial glow behind logo that pops */}
                                                <div
                                                    className="pointer-events-none absolute inset-0 opacity-45 group-hover:opacity-95 transition-opacity duration-300 blur-xl"
                                                    style={{
                                                        background: `radial-gradient(circle at center, ${game.glowColor} 0%, transparent 70%)`
                                                    }}
                                                />

                                                {/* top subtle glass reflection line */}
                                                <div className="pointer-events-none absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                                                {/* the logo SVG with full vibrant clarity */}
                                                <div className="relative z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                                                    {game.svg}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* part 4: the national team (contingent indigo-slate theme) */}
                    <section
                        id="teams"
                        className="relative w-full bg-[#080E1C] border-t border-white/[0.08] overflow-hidden select-none"
                    >
                        {/* subtle athletic ambient wash */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_20%,rgba(37,99,235,0.06),transparent_70%)]" />

                        <div className="relative z-10 w-full py-12 sm:py-14 md:py-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
                            {/* section header */}
                        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 reveal-on-scroll">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                            TEAM MALAYSIA
                        </h2>
                        <Link
                            href="/teams" // redirect
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 hover:border-amber-400/40 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold tracking-wider uppercase text-neutral-300 hover:text-white transition-all duration-200 shrink-0 cursor-pointer self-start sm:self-auto"
                        >
                            <span>View Directory</span>
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200" />
                        </Link>
                    </div>

                    {/* cover flow carousel stage */}
                    <div className="relative w-full max-w-6xl mx-auto reveal-on-scroll reveal-delay-1">
                        {/* minimalist premium navigation arrow buttons */}
                        <button
                            type="button"
                            onClick={handlePrevSquad} // trigger
                            aria-label="Previous Squad"
                            className="group absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#050811]/60 hover:bg-[#0A1020]/90 border border-white/10 hover:border-white/25 active:border-white/40 text-neutral-400 hover:text-white flex items-center justify-center backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200" strokeWidth={1.75} />
                        </button>

                        <button
                            type="button"
                            onClick={handleNextSquad} // trigger
                            aria-label="Next Squad"
                            className="group absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#050811]/60 hover:bg-[#0A1020]/90 border border-white/10 hover:border-white/25 active:border-white/40 text-neutral-400 hover:text-white flex items-center justify-center backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200" strokeWidth={1.75} />
                        </button>

                        {/* cards track container */}
                        <div
                            className="relative h-[440px] sm:h-[510px] md:h-[560px] lg:h-[580px] w-full overflow-hidden flex items-center justify-center"
                            onTouchStart={handleTouchStart} // touch
                            onTouchEnd={handleTouchEnd} // touch
                        >
                            {teamRoster.map((squad, idx) => {
                                const totalSquads = teamRoster.length; // properties
                                let offset = idx - squadIndex; // check
                                if (offset > totalSquads / 2) offset -= totalSquads;
                                if (offset < -totalSquads / 2) offset += totalSquads;

                                const absOffset = Math.abs(offset); // check
                                const isCenter = absOffset === 0; // check
                                const isVisible = absOffset <= 2; // check

                                // Cover Flow scale, opacity, layering, and horizontal translation
                                const scale = isCenter ? 1 : absOffset === 1 ? 0.88 : 0.76;
                                const opacity = isCenter ? 1 : absOffset === 1 ? 0.65 : absOffset === 2 ? 0.28 : 0;
                                const zIndex = 30 - absOffset * 10;
                                const pointerEvents = isVisible ? 'auto' : 'none';

                                return (
                                    <div
                                        key={squad.id}
                                        onClick={() => { // state
                                            if (!isCenter) setSquadIndex(idx);
                                        }}
                                        style={{
                                            transform: `translate(calc(-50% + ${offset * 72}%), -50%) scale(${scale})`,
                                            opacity,
                                            zIndex,
                                            pointerEvents,
                                        }}
                                        className={`absolute top-1/2 left-1/2 w-[280px] sm:w-[340px] md:w-[380px] lg:w-[400px] aspect-[4/5] rounded-2xl sm:rounded-3xl border transition-all duration-500 ease-out overflow-hidden flex flex-col justify-between p-6 sm:p-8 ${
                                            isCenter
                                                ? 'border-white/20 bg-gradient-to-b from-[#0F172A] via-[#090E1A] to-[#050811] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(251,191,36,0.08)] cursor-default'
                                                : 'border-white/10 bg-[#080D18]/95 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.7)] cursor-pointer hover:border-white/25'
                                        }`}
                                    >
                                        {/* ambient background glow */}
                                        <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 bg-amber-400/5 rounded-full blur-2xl" />
                                        <div className="pointer-events-none absolute -bottom-16 -left-16 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl" />

                                        {/* faint athletic background grid pattern */}
                                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent" />

                                        {/* fallback / future squad photo if loaded */}
                                        {squad.image && (
                                            <img
                                                src={squad.image}
                                                alt={squad.game}
                                                onError={(e) => { // error
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                                className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                                            />
                                        )}

                                        {/* team profile avatar silhouette SVG placeholder */}
                                        <div className="relative my-auto flex flex-col items-center justify-center py-4 select-none">
                                            <div className="relative w-full flex flex-col items-center justify-center">
                                                {/* subtle ambient backlight */}
                                                <div className="absolute w-36 h-36 bg-amber-400/[0.06] rounded-full blur-2xl pointer-events-none" />

                                                {/* team lineup silhouette frame */}
                                                <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-36 sm:h-44 md:h-48 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md flex items-center justify-center p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                                    <svg
                                                        viewBox="0 0 160 100"
                                                        className="w-full h-full max-h-36 drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)]"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <defs>
                                                            <linearGradient id="centerPlayerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                                                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                                                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.16" />
                                                            </linearGradient>
                                                            <linearGradient id="midPlayerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                                                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.30" />
                                                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.09" />
                                                            </linearGradient>
                                                            <linearGradient id="wingPlayerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                                                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
                                                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                                                            </linearGradient>
                                                        </defs>

                                                        {/* far-left wing player */}
                                                        <circle cx="28" cy="46" r="9" fill="url(#wingPlayerGrad)" />
                                                        <path d="M13 88 C13 75 21 69 28 69 C35 69 43 75 43 88 Z" fill="url(#wingPlayerGrad)" />

                                                        {/* far-right wing player */}
                                                        <circle cx="132" cy="46" r="9" fill="url(#wingPlayerGrad)" />
                                                        <path d="M117 88 C117 75 125 69 132 69 C139 69 147 75 147 88 Z" fill="url(#wingPlayerGrad)" />

                                                        {/* mid-left player */}
                                                        <circle cx="52" cy="40" r="11" fill="url(#midPlayerGrad)" />
                                                        <path d="M33 86 C33 70 43 64 52 64 C61 64 71 70 71 86 Z" fill="url(#midPlayerGrad)" />

                                                        {/* mid-right player */}
                                                        <circle cx="108" cy="40" r="11" fill="url(#midPlayerGrad)" />
                                                        <path d="M89 86 C89 70 99 64 108 64 C117 64 127 70 127 86 Z" fill="url(#midPlayerGrad)" />

                                                        {/* center lead player (front & prominent) */}
                                                        <circle cx="80" cy="34" r="14" fill="url(#centerPlayerGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                                        <path d="M56 84 C56 65 68 57 80 57 C92 57 104 65 104 84 Z" fill="url(#centerPlayerGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* poster bottom: game discipline & name placeholder */}
                                        <div className="relative z-10 space-y-1 text-left">
                                            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-amber-400">
                                                GAME NAME
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                                                {squad.name || squad.game}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-neutral-400 font-medium tracking-wide">
                                                {squad.division}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* bottom navigation indicators & counter */}
                        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
                            {/* dot track */}
                            <div className="flex items-center gap-1.5">
                                {teamRoster.map((squad, dotIdx) => (
                                    <button
                                        key={squad.id}
                                        type="button"
                                        onClick={() => setSquadIndex(dotIdx)} // state
                                        aria-label={`Jump to ${squad.game}`}
                                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                            dotIdx === squadIndex
                                                ? 'w-6 sm:w-7 bg-amber-400'
                                                : 'w-2 bg-white/20 hover:bg-white/40'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* textual position counter */}
                            <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                                <span className="text-white font-bold">{String(squadIndex + 1).padStart(2, '0')}</span>
                                <span className="mx-1 text-neutral-600">/</span>
                                <span>{String(teamRoster.length).padStart(2, '0')}</span>
                                <span className="mx-2 text-neutral-600">•</span>
                                <span className="text-amber-400 font-semibold">{teamRoster[squadIndex]?.game}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



                    {/* 7. official modern interactive footer */}
                    <Footer />
                </div>
            </div>
        </div>
    );
}
