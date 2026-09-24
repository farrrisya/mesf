// --1. imports--
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    LayoutDashboard,
    Newspaper,
    Trophy,
    Users,
    Calendar,
    Image,
    FileText,
    Settings as SettingsIcon,
    UserCheck,
    MessageSquare,
    Activity,
    LogOut,
    Menu,
    X,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

// --2. properties--
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // clock
const WARNING_DURATION_MS = 60 * 1000; // clock
const WARNING_THRESHOLD_MS = IDLE_TIMEOUT_MS - WARNING_DURATION_MS; // clock

const NAV_CATEGORIES = [
    {
        category: 'Content',
        items: [
            { label: 'News', href: '/admin/news', icon: Newspaper, roles: ['admin', 'editor'] },
            { label: 'Leagues', href: '/admin/leagues', icon: Trophy, roles: ['admin', 'editor'] },
            { label: 'Teams', href: '/admin/teams', icon: Users, roles: ['admin', 'editor'] },
            { label: 'Matches', href: '/admin/matches', icon: Calendar, roles: ['admin', 'editor'] },
            { label: 'Library', href: '/admin/library', icon: Image, roles: ['admin', 'editor'] },
            { label: 'Documents', href: '/admin/documents', icon: FileText, roles: ['admin'] },
        ],
    },
    {
        category: 'Operations',
        items: [
            { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, roles: ['admin', 'secretariat'] },
        ],
    },
    {
        category: 'System',
        items: [
            { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity, roles: ['admin'] },
            { label: 'Manage Roles', href: '/admin/users', icon: UserCheck, roles: ['admin'] },
            { label: 'Settings', href: '/admin/settings', icon: SettingsIcon, roles: ['admin'] },
        ],
    },
];

const ROLE_STYLES = {
    admin: {
        label: 'Admin',
        badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
        avatarBg: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    },
    editor: {
        label: 'Editor',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        avatarBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    secretariat: {
        label: 'Secretary',
        badge: 'bg-sky-400/20 text-sky-300 border-sky-400/30',
        avatarBg: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
    },
};

// --3. main component--
export default function AdminLayout({
    title = 'Admin - MESF',
    role = null,
    portalTitle = null,
    contentClassName = '',
    backHref = null,
    backLabel = 'Back',
    children
}) {
    const { url, props } = usePage(); // properties
    const [sidebarOpen, setSidebarOpen] = useState(false); // state
    const [showIdleModal, setShowIdleModal] = useState(false); // state
    const [countdownSeconds, setCountdownSeconds] = useState(60); // state

    const currentUser = props?.auth?.user; // state
    const userRole = role || currentUser?.role || 'admin'; // state
    const isImpersonating = Boolean(props?.auth?.is_impersonating); // state

    const logoUrl = props?.settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const bannerUrl = props?.settings?.bannerUrl || '/images/mesf_bg_v2.jpg'; // properties
    const orgAcronym = props?.settings?.orgAcronym || 'MESF'; // properties

    const defaultPortalLabel = userRole === 'editor'
        ? `${orgAcronym} EDITOR`
        : userRole === 'secretariat'
            ? `${orgAcronym} SECRETARY`
            : `${orgAcronym} ADMIN`;

    const displayPortalTitle = portalTitle || defaultPortalLabel;

    const dashboardHref = userRole === 'editor'
        ? '/editor/dashboard'
        : userRole === 'secretariat'
            ? '/secretary/dashboard'
            : '/admin/dashboard';

    // filter categories and items based on role
    const visibleCategories = NAV_CATEGORIES.map((cat) => ({
        category: cat.category,
        items: cat.items.filter((item) => item.roles.includes(userRole)),
    })).filter((cat) => cat.items.length > 0);

    const roleStyle = ROLE_STYLES[userRole] || ROLE_STYLES.admin;
    const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

    const warningTimerRef = useRef(null); // properties
    const logoutTimerRef = useRef(null); // properties
    const intervalRef = useRef(null); // properties
    const isLoggingOutRef = useRef(false); // properties
    const lastActivityRef = useRef(Date.now()); // properties

    // --4. actions--
    const performLogout = useCallback(() => { // trigger
        if (isLoggingOutRef.current) return; // check
        isLoggingOutRef.current = true; // save
        setShowIdleModal(false); // toggle
        router.post(route('logout')); // redirect
    }, []);

    const resetIdleTimer = useCallback(() => { // trigger
        if (isLoggingOutRef.current) return; // check
        lastActivityRef.current = Date.now(); // clock
        setShowIdleModal(false); // toggle
        setCountdownSeconds(60); // clock

        if (warningTimerRef.current) clearTimeout(warningTimerRef.current); // trigger
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current); // trigger
        if (intervalRef.current) clearInterval(intervalRef.current); // trigger

        warningTimerRef.current = setTimeout(() => { // clock
            setShowIdleModal(true); // toggle
            setCountdownSeconds(60); // clock

            let remaining = 60; // clock
            intervalRef.current = setInterval(() => { // clock
                remaining -= 1; // clock
                if (remaining <= 0) { // check
                    clearInterval(intervalRef.current); // trigger
                    performLogout(); // redirect
                } else {
                    setCountdownSeconds(remaining); // clock
                }
            }, 1000);
        }, WARNING_THRESHOLD_MS);

        logoutTimerRef.current = setTimeout(() => { // clock
            performLogout(); // redirect
        }, IDLE_TIMEOUT_MS);
    }, [performLogout]);

    useEffect(() => { // trigger
        resetIdleTimer(); // trigger

        const handleActivity = () => { // trigger
            if (!showIdleModal && Date.now() - lastActivityRef.current > 2000) { // check
                resetIdleTimer(); // trigger
            }
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true })); // trigger

        return () => { // trigger
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current); // trigger
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current); // trigger
            if (intervalRef.current) clearInterval(intervalRef.current); // trigger
            events.forEach((event) => window.removeEventListener(event, handleActivity)); // trigger
        };
    }, [resetIdleTimer, showIdleModal]);

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white overflow-x-hidden flex flex-col">
            <Head title={title} />

            {/* Impersonation Banner */}
            {isImpersonating && (
                <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black px-4 sm:px-8 py-2.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black text-amber-300 text-xs font-black shrink-0">
                            !
                        </span>
                        <span>
                            Viewing as <strong className="font-black underline">{currentUser?.name}</strong> ({roleStyle.label}) — You are currently in staff impersonation mode.
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.post(route('admin.users.switch-back'))} // redirect
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-900 text-amber-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shrink-0"
                    >
                        <span>Return to your account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* texture effect */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* background wallpaper and gradients */}
            <div
                className="fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none transform-gpu"
                style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            >
                <img
                    src={bannerUrl}
                    alt="Background"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/mesf_bg_v2.jpg';
                    }}
                    className="h-full w-full object-cover object-center filter brightness-[0.7] contrast-[1.15] transform-gpu"
                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                />
                <div className="absolute inset-0 bg-[#070B14]/65" />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(7, 11, 20, 0.25) 0%, rgba(7, 11, 20, 0.8) 55%, rgba(7, 11, 20, 0.98) 85%, #070B14 100%)'
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(7, 11, 20, 0.95) 0%, transparent 35%, transparent 65%, #070B14 100%)'
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to right, rgba(7, 11, 20, 0.95) 0%, transparent 35%, transparent 65%, rgba(7, 11, 20, 0.95) 100%)'
                    }}
                />
            </div>

            {/* mobile top navbar */}
            <div className="md:hidden relative z-20 flex items-center justify-between px-4 py-3.5 bg-[#090D18]/85 backdrop-blur-2xl border-b border-white/10">
                <div className="flex items-center gap-3">
                    <img
                        src={logoUrl}
                        alt="Logo"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/mesf_logo.png';
                        }}
                        className="w-9 h-9 object-contain flex-shrink-0"
                    />
                    <span className="text-base font-extrabold tracking-wide text-white">{displayPortalTitle}</span>
                </div>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)} // toggle
                    className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:text-amber-400 hover:border-amber-400/30 transition-colors cursor-pointer"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* mobile sidebar backdrop overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
                    onClick={() => setSidebarOpen(false)} // toggle
                />
            )}

            {/* sidebar */}
            <aside
                className={`fixed top-4 left-4 bottom-4 w-64 z-40 flex flex-col rounded-3xl bg-[#090D18]/85 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 shadow-[0_22px_65px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.05)] transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] md:translate-x-0'
                    }`}
            >
                {/* inner grain texture */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay rounded-3xl overflow-hidden"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />

                {/* logo banner */}
                <div className="relative z-10 h-20 flex items-center justify-center gap-3.5 px-4 border-b border-white/10 shrink-0">
                    <img
                        src={logoUrl}
                        alt="Logo"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/mesf_logo.png';
                        }}
                        className="w-10 h-10 object-contain flex-shrink-0"
                    />
                    <span className="text-base font-extrabold tracking-wide text-white">
                        {displayPortalTitle}
                    </span>
                </div>

                {/* nav menu scrollable container */}
                <nav className="relative z-10 flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
                    {/* Top Standalone Dashboard Item */}
                    {(() => {
                        const isDashboardActive = url === dashboardHref || url === '/admin' || url === '/editor' || url === '/secretary' || url === '/secretariat';

                        return (
                            <Link
                                href={dashboardHref} // redirect
                                onClick={() => setSidebarOpen(false)} // toggle
                                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 ${
                                    isDashboardActive
                                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold shadow-[0_4px_16px_rgba(251,191,36,0.35)]'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <LayoutDashboard
                                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                                        isDashboardActive
                                            ? 'text-black'
                                            : 'text-slate-400 group-hover:text-amber-300 group-hover:scale-105'
                                    }`}
                                />
                                <span>Dashboard</span>
                            </Link>
                        );
                    })()}

                    {/* Categorized Nav Groups */}
                    {visibleCategories.map((cat) => (
                        <div key={cat.category} className="space-y-1">
                            {/* Category Label Header */}
                            <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase select-none">
                                {cat.category}
                            </div>

                            {/* Group Items */}
                            <div className="space-y-1">
                                {cat.items.map((item) => {
                                    const isActive = url === item.href || url.startsWith(`${item.href}/`);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href} // redirect
                                            onClick={() => setSidebarOpen(false)} // toggle
                                            className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold shadow-[0_4px_16px_rgba(251,191,36,0.35)]'
                                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <item.icon
                                                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                                                    isActive
                                                        ? 'text-black'
                                                        : 'text-slate-400 group-hover:text-amber-300 group-hover:scale-105'
                                                }`}
                                            />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* content wrapper */}
            <main className="flex-1 flex flex-col md:pl-72 min-w-0">
                {/* top header bar aligned with sidebar logo banner */}
                <header className={`relative md:fixed ${isImpersonating ? 'md:top-10 sm:md:top-11' : 'md:top-0'} md:left-72 md:right-0 h-16 md:h-24 z-30 flex items-center justify-between px-6 sm:px-10 border-b border-white/10 bg-[#070B14]/85 backdrop-blur-2xl transition-all shadow-sm`}>
                    <div className="flex items-center gap-3">
                        {backHref ? (
                            <Link
                                href={backHref} // redirect
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm group"
                            >
                                <ArrowLeft className="w-4 h-4 text-amber-400 transition-transform group-hover:-translate-x-1" />
                                <span>{backLabel}</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400 uppercase">
                                <span className="text-slate-500">{orgAcronym}</span>
                                <span className="text-slate-600">/</span>
                                <span className="text-white font-bold">{title.replace(' - MESF Admin', '').replace(' - Admin', '').replace(' - MESF', '')}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Profile Info (clean, unboxed) */}
                        <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs flex-shrink-0 ${roleStyle.avatarBg}`}>
                                {userInitial}
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white leading-tight">
                                        {currentUser?.name || 'Staff User'}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${roleStyle.badge}`}>
                                        {roleStyle.label}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">
                                    {currentUser?.email || ''}
                                </span>
                            </div>
                        </div>

                        {/* subtle vertical divider */}
                        <div className="hidden sm:block h-6 w-px bg-white/10" />

                        {/* Logout Button (clean, unboxed) */}
                        <Link
                            href={route('logout')} // redirect
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                            onClick={(e) => { // trigger
                                if (!window.confirm("Adakah anda pasti mahu log keluar daripada akaun?")) { // check
                                    e.preventDefault();
                                }
                            }}
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Log Out</span>
                        </Link>
                    </div>
                </header>

                {/* spacer on desktop for fixed header */}
                <div className="hidden md:block h-24 shrink-0" />

                <div className={`flex-1 flex flex-col min-w-0 ${contentClassName || 'p-6 sm:p-10'}`}>
                    {children}
                </div>
            </main>

            {/* inactivity warning modal */}
            {showIdleModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-md bg-[#0d1424] border border-amber-400/30 rounded-3xl p-6 shadow-2xl shadow-amber-950/40 text-center">
                        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-400/10">
                            <svg className="w-7 h-7 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-black text-white uppercase font-heading tracking-wide mb-2">
                            Amaran Sesi Tidak Aktif
                        </h3>

                        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                            Tiada aktiviti dikesan. Demi keselamatan akaun pentadbir, anda akan dilog keluar secara automatik dalam masa:
                        </p>

                        <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center gap-2">
                            <span className="text-3xl font-black font-mono text-amber-400 tabular-nums">
                                {countdownSeconds}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                                saat
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={resetIdleTimer} // trigger
                                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black shadow-lg shadow-amber-400/30 transition-all focus:outline-none cursor-pointer"
                            >
                                Kekal Log Masuk
                            </button>
                            <button
                                type="button"
                                onClick={performLogout} // trigger
                                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all focus:outline-none cursor-pointer"
                            >
                                Log Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
