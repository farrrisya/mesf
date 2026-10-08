// --1. imports--
import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

// --2. properties--
const SAMPLE_NOTIFICATIONS = [
    {
        id: 'noti-match-live',
        category: 'MATCH LIVE',
        categoryColor: 'text-red-400 bg-red-500/10 border-red-500/25',
        title: 'Team Secret MYS vs Todak is LIVE',
        description: 'National Championship S3 · Upper Bracket Semifinal (MLBB BO3). Current score: 1 - 0.',
        time: 'Live now',
        isUnread: true,
        link: '/matches',
        linkText: 'Watch Live Match',
        icon: (
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
        )
    },
    {
        id: 'noti-match-upcoming',
        category: 'MATCH TODAY',
        categoryColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
        title: 'HomeBois vs Red Esports · 20:30 Tonight',
        description: 'MESF Masters Invitational Group Stage (Valorant BO3) starts in 45 minutes.',
        time: '45m ago',
        isUnread: true,
        link: '/matches',
        linkText: 'View Match Center',
        icon: (
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: 'noti-tournament',
        category: 'TOURNAMENT',
        categoryColor: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
        title: 'MLBB National Qualifiers: Registrations Open',
        description: 'Official registration for Season 3 state qualifiers is live. Register your 5-player squad before 30 Sept.',
        time: '2 hours ago',
        isUnread: false,
        link: '/leagues',
        linkText: 'Register Squad',
        icon: (
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004-6.072l.983-4.914a1.125 1.125 0 00-1.103-1.344H8.745a1.125 1.125 0 00-1.103 1.344l.983 4.914m6.879 0A3.75 3.75 0 0112 10.5a3.75 3.75 0 01-3.5-2.072" />
            </svg>
        )
    }
];

// --3. main component--
export default function Notification({ isOpen, onClose, anchorRef }) {
    // --4. actions--
    const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS); // state
    const [filter, setFilter] = useState('ALL'); // state
    const popoverRef = useRef(null); // ref

    const unreadCount = notifications.filter((n) => n.isUnread).length; // check

    // Close on click outside or Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target) &&
                anchorRef?.current &&
                !anchorRef.current.contains(e.target)
            ) {
                onClose(); // trigger
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose(); // trigger
            }
        };

        document.addEventListener('mousedown', handleClickOutside); // trigger
        document.addEventListener('keydown', handleKeyDown); // trigger

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, anchorRef]);

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((item) => ({ ...item, isUnread: false }))); // save
    };

    const markItemAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
        ); // save
    };

    if (!isOpen) return null;

    // --5. UI--
    return (
        <div
            ref={popoverRef}
            className="absolute right-0 top-[calc(100%+14px)] w-[92vw] sm:w-[390px] max-w-[400px] rounded-2xl backdrop-blur-2xl bg-[#090D18]/95 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.08)] text-white z-50 overflow-hidden select-none transition-all duration-200 animate-in fade-in zoom-in-95 origin-top-right"
        >
            {/* Top ambient backlight */}
            <div className="pointer-events-none absolute -top-10 right-10 h-28 w-28 rounded-full bg-amber-400/15 blur-[35px]" />

            {/* Header */}
            <div className="relative z-10 px-4 sm:px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-wide uppercase text-white">
                        Notifications
                    </span>
                    {unreadCount > 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-sm">
                            {unreadCount} NEW
                        </span>
                    ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-400">
                            Up to date
                        </span>
                    )}
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllAsRead} // trigger
                        className="text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notifications Feed */}
            <div className="relative z-10 max-h-[380px] overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
                {notifications.length > 0 ? (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => markItemAsRead(item.id)} // trigger
                            className={`group relative p-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
                                item.isUnread
                                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10'
                                    : 'hover:bg-white/[0.03] border border-transparent'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Icon Badge */}
                                <div className="h-8 w-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                    {item.icon}
                                </div>

                                {/* Text Body */}
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.categoryColor}`}>
                                            {item.category}
                                        </span>
                                        <span className="text-[10px] text-neutral-400">
                                            {item.time}
                                        </span>
                                    </div>

                                    <h4 className="text-xs font-bold text-white group-hover:text-white transition-colors leading-snug">
                                        {item.title}
                                    </h4>

                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        {item.description}
                                    </p>

                                    {/* Action link */}
                                    {item.link && (
                                        <div className="pt-2">
                                            <Link
                                                href={item.link}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onClose(); // trigger
                                                }}
                                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80 hover:text-white group-hover:underline transition-all"
                                            >
                                                <span>{item.linkText || 'View Details'}</span>
                                                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Unread dot */}
                                {item.isUnread && (
                                    <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center space-y-2">
                        <svg className="w-8 h-8 text-neutral-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        <p className="text-xs text-neutral-400">No new notifications</p>
                    </div>
                )}
            </div>

            {/* Sub-footer Link */}
            <div className="relative z-10 p-2.5 bg-white/[0.02] border-t border-white/5 text-center">
                <Link
                    href="/news"
                    onClick={onClose} // trigger
                    className="text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                    <span>View All Announcements</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
