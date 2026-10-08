// --1. imports--
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Notification from '@/Components/Notification';

// --2. properties--
const NAV_ITEMS = [
    { id: 'news', label: 'NEWS', href: '/news' },
    { id: 'leagues', label: 'LEAGUES', href: '/leagues' },
    { id: 'matches', label: 'MATCHES', href: '/matches' },
    { id: 'teams', label: 'TEAMS', href: '/teams' },
    { id: 'about', label: 'ABOUT', href: '/about' }
];

// --3. main component--
export default function PublicNavbar({
    activeTab = null,
    onNavClick = null,
    hasLiveMatches: propHasLiveMatches,
    className = '',
    style = {}
}) {
    // --4. actions--
    const { settings, hasLiveMatches: pageHasLiveMatches } = usePage().props; // properties
    const hasLiveMatches = propHasLiveMatches ?? pageHasLiveMatches ?? false; // check
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const [hoveredTab, setHoveredTab] = useState(null); // state
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 }); // state
    const [isNavInitialized, setIsNavInitialized] = useState(false); // state
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // state
    const centerNavRef = useRef(null); // ref
    const navRefs = useRef({}); // ref
    const bellRef = useRef(null); // ref

    const currentTab = hoveredTab || activeTab; // state

    const updateIndicator = () => { // trigger
        const targetId = hoveredTab || (NAV_ITEMS.some((n) => n.id === activeTab) ? activeTab : null); // check
        if (!targetId || !navRefs.current[targetId] || !centerNavRef.current) { // check
            setIndicatorStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 })); // state
            return;
        }

        const el = navRefs.current[targetId]; // state
        const left = el.offsetLeft; // state
        const width = el.offsetWidth; // state

        setIndicatorStyle((prev) => {
            if (prev.left === left && prev.width === width && prev.opacity === 1) return prev; // check
            return { left, width, opacity: 1 }; // save
        });

        if (!isNavInitialized) { // check
            setIsNavInitialized(true); // state
        }
    };

    useEffect(() => {
        updateIndicator(); // trigger
        window.addEventListener('resize', updateIndicator, { passive: true }); // trigger
        if (typeof document !== 'undefined' && document.fonts?.ready) { // check
            document.fonts.ready.then(updateIndicator); // trigger
        }
        return () => {
            window.removeEventListener('resize', updateIndicator);
        };
    }, [activeTab, hoveredTab, hasLiveMatches]);

    const handleItemClick = (e, tabId) => { // trigger
        e.preventDefault(); // trigger
        if (onNavClick) { // check
            const handled = onNavClick(tabId); // trigger
            if (handled !== false) return;
        }

        setHoveredTab(null); // state
        if (tabId === 'home') { // redirect
            router.visit('/?view=dashboard');
        } else if (tabId === 'news') {
            router.visit('/news');
        } else if (tabId === 'leagues') {
            router.visit('/leagues');
        } else if (tabId === 'matches') {
            router.visit('/matches');
        } else if (tabId === 'teams') {
            router.visit('/teams');
        } else if (tabId === 'about') {
            router.visit('/about');
        } else if (tabId === 'profile') {
            router.visit('/login');
        }
    };

    // --5. UI--
    return (
        <nav
            className={`relative flex items-center justify-between w-[94vw] max-w-5xl px-3 md:px-5 py-2 rounded-full backdrop-blur-2xl bg-[#090D18]/90 border border-white/10 shadow-[0_22px_65px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.05)] ${className}`}
            style={style}
        >
            {/* far left: mesf logo section */}
            <div className="flex items-center">
                <button
                    type="button"
                    onClick={(e) => handleItemClick(e, 'home')}
                    className="relative z-10 flex items-center justify-center h-10 w-10 md:h-11 md:w-11 px-1 rounded-full transition-opacity duration-200 hover:opacity-85 active:opacity-70 cursor-pointer"
                    aria-label="MESF Home"
                >
                    <img
                        src={logoUrl}
                        alt="MESF Logo"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/mesf_logo.png';
                        }}
                        className="h-8 w-8 md:h-9 md:w-9 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    />
                </button>
            </div>

            {/* left-center vertical glass divider */}
            <div className="h-5 w-[1px] bg-white/10 mx-1.5 md:mx-4" />

            {/* center: smooth gliding nav buttons pill container */}
            <div
                ref={centerNavRef}
                onMouseLeave={() => setHoveredTab(null)}
                className="relative flex items-center space-x-1 md:space-x-1.5 flex-1 justify-center py-0.5"
            >
                {/* sliding fluid pill indicator */}
                <div
                    className="absolute pointer-events-none rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.4)] z-0 top-0 bottom-0 left-0 my-auto h-9 md:h-10 will-change-transform"
                    style={{
                        transform: `translateX(${indicatorStyle.left}px)`,
                        width: `${indicatorStyle.width}px`,
                        opacity: indicatorStyle.opacity,
                        transition: isNavInitialized
                            ? 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), width 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease-out'
                            : 'opacity 180ms ease-out'
                    }}
                />

                {NAV_ITEMS.map((item) => {
                    const isSelected = currentTab === item.id;
                    const isLiveItem = item.id === 'matches' && hasLiveMatches;
                    return (
                        <button
                            key={item.id}
                            ref={(el) => (navRefs.current[item.id] = el)}
                            type="button"
                            onMouseEnter={() => setHoveredTab(item.id)}
                            onClick={(e) => handleItemClick(e, item.id)}
                            className={`relative z-10 h-9 md:h-10 px-3.5 md:px-5 rounded-full flex items-center justify-center text-xs md:text-sm font-bold tracking-wider uppercase transition-colors duration-200 select-none cursor-pointer ${
                                isSelected
                                    ? 'text-slate-950 font-black'
                                    : 'text-neutral-300 hover:text-white'
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <span>{item.label}</span>
                                {isLiveItem && (
                                    <span
                                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase transition-colors select-none ${
                                            isSelected
                                                ? 'bg-slate-950 text-red-400'
                                                : 'bg-red-500/15 border border-red-500/35 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                                        }`}
                                    >
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                                        </span>
                                        <span className="font-mono leading-none">LIVE</span>
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* center-right vertical glass divider */}
            <div className="h-5 w-[1px] bg-white/10 mx-1.5 md:mx-4" />

            {/* far right: action buttons with clean, subtle circle hovers */}
            <div className="flex items-center space-x-1 md:space-x-1.5">
                {/* notification bell button */}
                <div className="relative">
                    <button
                        ref={bellRef}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsNotificationsOpen((prev) => !prev);
                        }}
                        className={`relative z-10 flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full transition-all duration-200 cursor-pointer ${
                            isNotificationsOpen
                                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                                : 'text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                        }`}
                        aria-label="Notifications"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        {/* notification alert dot */}
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-2 ring-[#090D18]" />
                        </span>
                    </button>

                    <Notification
                        isOpen={isNotificationsOpen}
                        onClose={() => setIsNotificationsOpen(false)}
                        anchorRef={bellRef}
                    />
                </div>

                {/* user profile / login button */}
                <button
                    type="button"
                    onClick={(e) => handleItemClick(e, 'profile')}
                    className="relative z-10 flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
                    aria-label="Log In"
                    title="Log In"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
