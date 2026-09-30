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
    className = '',
    style = {}
}) {
    // --4. actions--
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const [hoveredTab, setHoveredTab] = useState(null); // state
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 6, top: 6, width: 44, height: 44, opacity: 0 }); // state
    const [isNavInitialized, setIsNavInitialized] = useState(false); // state
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // state
    const navContainerRef = useRef(null); // ref
    const navRefs = useRef({}); // ref

    const currentTab = hoveredTab || (isNotificationsOpen ? 'notifications' : activeTab); // state

    const updateIndicator = () => { // trigger
        const targetTab = hoveredTab || (isNotificationsOpen ? 'notifications' : activeTab); // check
        if (!targetTab) { // check
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 })); // state
            return;
        }

        const el = navRefs.current[targetTab]; // state
        const navEl = navContainerRef.current; // state

        if (el && navEl) { // check
            const elRect = el.getBoundingClientRect(); // state
            const navRect = navEl.getBoundingClientRect(); // state

            setIndicatorStyle({
                left: elRect.left - navRect.left,
                top: elRect.top - navRect.top,
                width: elRect.width,
                height: elRect.height,
                opacity: 1
            }); // state

            if (!isNavInitialized) { // check
                requestAnimationFrame(() => {
                    setTimeout(() => setIsNavInitialized(true), 40); // clock
                });
            }
        }
    };

    useEffect(() => {
        const frameId = requestAnimationFrame(updateIndicator); // trigger
        window.addEventListener('resize', updateIndicator); // trigger
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', updateIndicator);
        };
    }, [activeTab, hoveredTab, isNotificationsOpen, isNavInitialized]);

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
            ref={navContainerRef}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center justify-between w-[94vw] max-w-5xl px-3 md:px-5 py-2 rounded-full backdrop-blur-2xl bg-[#090D18]/85 border border-white/10 shadow-[0_22px_65px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.05)] ${className}`}
            style={style}
        >
            {/* inner grain texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay rounded-full overflow-hidden"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* sliding apple-style yellow glass indicator */}
            <div
                className="absolute pointer-events-none rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_2.5px_20px_rgba(251,191,36,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.5)] z-0"
                style={{
                    left: `${indicatorStyle.left}px`,
                    top: `${indicatorStyle.top}px`,
                    width: `${indicatorStyle.width}px`,
                    height: `${indicatorStyle.height}px`,
                    opacity: indicatorStyle.opacity,
                    transition: isNavInitialized
                        ? 'left 280ms cubic-bezier(0.2, 0.8, 0.2, 1), top 280ms cubic-bezier(0.2, 0.8, 0.2, 1), width 280ms cubic-bezier(0.2, 0.8, 0.2, 1), height 280ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease-out'
                        : 'none'
                }}
            />

            {/* far left: mesf logo section */}
            <div className="flex items-center">
                <button
                    ref={(el) => (navRefs.current['home'] = el)}
                    type="button"
                    onMouseEnter={() => setHoveredTab('home')}
                    onClick={(e) => handleItemClick(e, 'home')}
                    className="relative z-10 flex items-center justify-center h-10 w-10 md:h-11 md:w-11 px-1 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
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

            {/* center: nav buttons pill container */}
            <div className="flex items-center space-x-1 md:space-x-2 flex-1 justify-center">
                {NAV_ITEMS.map((item) => {
                    const isSelected = currentTab === item.id;
                    return (
                        <button
                            key={item.id}
                            ref={(el) => (navRefs.current[item.id] = el)}
                            type="button"
                            onMouseEnter={() => setHoveredTab(item.id)}
                            onClick={(e) => handleItemClick(e, item.id)}
                            className={`relative z-10 h-10 md:h-11 px-3.5 md:px-5 rounded-full flex items-center justify-center text-xs md:text-sm font-bold tracking-wider uppercase transition-colors duration-250 ease-out select-none cursor-pointer ${
                                isSelected
                                    ? 'text-[#070B14]'
                                    : 'text-neutral-300 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* center-right vertical glass divider */}
            <div className="h-5 w-[1px] bg-white/10 mx-1.5 md:mx-4" />

            {/* far right: interactive action buttons */}
            <div className="flex items-center space-x-1 md:space-x-1.5">
                {/* notification bell button */}
                <div className="relative">
                    <button
                        ref={(el) => (navRefs.current['notifications'] = el)}
                        type="button"
                        onMouseEnter={() => setHoveredTab('notifications')}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsNotificationsOpen((prev) => !prev);
                            setHoveredTab(null);
                        }}
                        className={`relative z-10 flex items-center justify-center h-10 w-10 md:h-11 md:w-11 rounded-full transition-colors duration-250 ease-out cursor-pointer ${
                            isNotificationsOpen || currentTab === 'notifications'
                                ? 'text-[#070B14]'
                                : 'text-neutral-300 hover:text-white'
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
                        anchorRef={{ current: navRefs.current['notifications'] }}
                    />
                </div>

                {/* user profile / login button */}
                <button
                    ref={(el) => (navRefs.current['profile'] = el)}
                    type="button"
                    onMouseEnter={() => setHoveredTab('profile')}
                    onClick={(e) => handleItemClick(e, 'profile')}
                    className={`relative z-10 flex items-center justify-center h-10 w-10 md:h-11 md:w-11 rounded-full transition-colors duration-250 ease-out cursor-pointer ${
                        currentTab === 'profile'
                            ? 'text-[#070B14]'
                            : 'text-neutral-300 hover:text-white'
                    }`}
                    aria-label="Sign In"
                    title="Sign In"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
