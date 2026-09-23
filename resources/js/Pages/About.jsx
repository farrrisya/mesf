// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import { Mail, Users, Search } from 'lucide-react';

// --2. properties--
const AFFILIATED_PARTNERS = [
    {
        name: 'KBS Malaysia',
        role: 'Governing Ministry',
        logo: '/images/partners/kbs.svg'
    },
    {
        name: 'Majlis Sukan Negara',
        role: 'National Sports Council',
        logo: '/images/partners/msn.svg'
    },
    {
        name: 'Olympic Council Malaysia',
        role: 'National Olympic Committee',
        logo: '/images/partners/ocm.svg'
    },
    {
        name: 'IeSF',
        role: 'International Esports Federation',
        logo: '/images/partners/iesf.svg'
    },
    {
        name: 'AESF',
        role: 'Asian Electronic Sports Federation',
        logo: '/images/partners/aesf.svg'
    },
    {
        name: 'Esports Integrated',
        role: 'Strategic Ecosystem Partner',
        logo: '/images/partners/esi.svg'
    }
];

// Default Committee Roster matching exact official structure
const DEFAULT_EXECUTIVE_SECTIONS = [
    {
        id: 'leadership',
        sectionTitle: 'Executive Leadership',
        members: [
            { id: 'naim', name: 'Muhammad Naim Al-Amin', title: 'President', contact: 'naim@mesf.my' },
            { id: 'afiq', name: 'Afiq Fadhli', title: 'Deputy President', contact: 'afiq@mesf.my' }
        ]
    },
    {
        id: 'vice_presidents',
        sectionTitle: 'Vice Presidents',
        members: [
            { id: 'khir', name: 'Mohamad Khir', title: 'Vice President 1', contact: 'khir@mesf.my' },
            { id: 'faries', name: 'Faries Faizal', title: 'Vice President 2', contact: 'faries@mesf.my' },
            { id: 'zatul', name: 'Dr. Zatul Iffah', title: 'Vice President Women', contact: 'drzatul@mesf.my' },
            { id: 'muzakkir', name: 'Muzakkir', title: 'Vice President Youth', contact: 'muzakkir@mesf.my' }
        ]
    },
    {
        id: 'secretariat',
        sectionTitle: 'Secretary & Administration',
        members: [
            { id: 'syed', name: 'Syed Fakrurrozi', title: 'Secretary General', contact: 'syed@mesf.my' },
            { id: 'hakimi', name: 'Alif Hakimi', title: 'Assistant Secretary General', contact: 'hakimi@mesf.my' },
            { id: 'shahrul', name: 'Shahrul Nizam', title: 'Treasurer', contact: 'shahrul@mesf.my' },
            { id: 'azrai', name: 'Azrai Abdul Aziz', title: 'Chief Communication', contact: 'azrai@mesf.my' }
        ]
    }
];

const DEFAULT_GENERAL_COMMITTEE = [
    { id: 'adib', name: 'Adib', title: 'Committee Member', contact: 'adib@mesf.my' },
    { id: 'akbar', name: 'Akbar', title: 'Committee Member', contact: 'akbar@mesf.my' },
    { id: 'akif', name: 'Akif', title: 'Committee Member', contact: 'contact@mesf.my' },
    { id: 'alex', name: 'Alex', title: 'Committee Member', contact: 'alex@mesf.my' },
    { id: 'azza', name: 'Azza', title: 'Committee Member', contact: 'azzarizal@mesf.my' },
    { id: 'chucky', name: 'Chucky', title: 'Committee Member', contact: 'cheoh@mesf.my' },
    { id: 'dr-yew', name: 'Dr. Yew', title: 'Committee Member', contact: 'dryew@mesf.my' },
    { id: 'eugene', name: 'Eugene', title: 'Committee Member', contact: 'eugene@mesf.my' },
    { id: 'husyin', name: 'Husyin', title: 'Committee Member', contact: 'husyin@mesf.my' },
    { id: 'joker', name: 'Joker', title: 'Committee Member', contact: 'jokerlai@mesf.my' },
    { id: 'kymie', name: 'Kymie', title: 'Committee Member', contact: 'kymie@mesf.my' },
    { id: 'luqman', name: 'Luqman', title: 'Committee Member', contact: 'luqman@mesf.my' },
    { id: 'razak', name: 'Razak', title: 'Committee Member', contact: 'razak@mesf.my' },
    { id: 'shahril', name: 'Shahril', title: 'Committee Member', contact: 'shahril@mesf.my' },
    { id: 'syahrul', name: 'Syahrul', title: 'Committee Member', contact: 'syahrul@mesf.my' },
    { id: 'thariq', name: 'Thariq', title: 'Committee Member', contact: 'thariq@mesf.my' }
];

// Helper to get initials for badge avatars
const getMemberInitials = (name) => {
    if (!name || typeof name !== 'string') return 'ME';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper to parse JSON settings
const parseJsonSetting = (raw, fallback = []) => {
    if (!raw) return fallback;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') return Object.values(raw);
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
        if (parsed && typeof parsed === 'object') return Object.values(parsed);
        return fallback;
    } catch (e) {
        return fallback;
    }
};

// --3. main component--
export default function About() {
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const orgName = settings?.orgName || 'Malaysia Esports Federation'; // properties
    const orgAcronym = settings?.orgAcronym || 'MESF'; // properties
    const rosNumber = settings?.rosNumber || '7402/2014'; // properties
    const phone = settings?.phone || ''; // properties
    const officialEmail = settings?.replyEmail || settings?.supportEmail || 'contact@mesf.my'; // properties
    const aboutHeroSubtitle = settings?.aboutHeroSubtitle || 'Official national governing body registered under the Sports Development Act 1997, overseeing electronic sports across Malaysia.'; // properties
    const aboutStoryHtml = settings?.aboutStoryHtml || (settings?.aboutStoryP1 ? `<p>${settings.aboutStoryP1}</p><p>${settings.aboutStoryP2 || ''}</p><p>${settings.aboutStoryP3 || ''}</p>` : ''); // properties

    const executiveSections = useMemo(() => {
        const raw = parseJsonSetting(settings?.executiveSections, DEFAULT_EXECUTIVE_SECTIONS);
        if (!Array.isArray(raw)) return DEFAULT_EXECUTIVE_SECTIONS;
        return raw.map((section) => ({
            ...section,
            members: Array.isArray(section?.members) ? section.members : []
        })).filter((section) => section.members && section.members.length > 0);
    }, [settings?.executiveSections]);

    const generalCommittee = useMemo(() => {
        const raw = parseJsonSetting(settings?.generalCommittee, DEFAULT_GENERAL_COMMITTEE);
        return Array.isArray(raw) ? raw : DEFAULT_GENERAL_COMMITTEE;
    }, [settings?.generalCommittee]);

    const socialChannels = useMemo(() => {
        const channels = [];
        if (settings?.instagram) channels.push({ name: 'Instagram', handle: '@mesfmy', href: settings.instagram });
        if (settings?.tiktok) channels.push({ name: 'TikTok', handle: '@mesfmy', href: settings.tiktok });
        if (settings?.youtube) channels.push({ name: 'YouTube', handle: '@mesfmy', href: settings.youtube });
        if (settings?.xUrl || settings?.twitter) channels.push({ name: 'X / Twitter', handle: '@mesfmy', href: settings.xUrl || settings.twitter });
        if (settings?.facebook) channels.push({ name: 'Facebook', handle: 'MESF Facebook', href: settings.facebook });
        if (settings?.discord) channels.push({ name: 'Discord', handle: 'MESF Discord', href: settings.discord });
        return channels;
    }, [settings]);

    // --4. actions--
    const [memberSearch, setMemberSearch] = useState(''); // state

    // Filter executive sections and members based on search
    const filteredExecutiveSections = useMemo(() => {
        if (!memberSearch.trim()) return executiveSections;
        const q = memberSearch.toLowerCase();
        return executiveSections.map((section) => ({
            ...section,
            members: (section.members || []).filter((m) =>
                (m?.name || '').toLowerCase().includes(q) ||
                (m?.title || '').toLowerCase().includes(q) ||
                (m?.contact || '').toLowerCase().includes(q)
            )
        })).filter((section) => section.members.length > 0);
    }, [memberSearch, executiveSections]);

    // Filter general committee members based on search
    const filteredGeneralCommittee = useMemo(() => {
        if (!memberSearch.trim()) return generalCommittee;
        const q = memberSearch.toLowerCase();
        return generalCommittee.filter((m) =>
            (m?.name || '').toLowerCase().includes(q) ||
            (m?.title || '').toLowerCase().includes(q) ||
            (m?.contact || '').toLowerCase().includes(q)
        );
    }, [memberSearch, generalCommittee]);

    // Grouping for Executive Leadership vs Executive Council
    const leadershipMembers = useMemo(() => {
        const leadershipSec = filteredExecutiveSections.find((s) => s.id === 'leadership');
        return leadershipSec?.members || [];
    }, [filteredExecutiveSections]);

    const councilMembers = useMemo(() => {
        const councilSecs = filteredExecutiveSections.filter((s) => s.id !== 'leadership');
        return councilSecs.flatMap((s) => s.members || []);
    }, [filteredExecutiveSections]);
    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden antialiased">
            <Head title="About Us - Malaysia Esports Federation | MESF" />

            {/* Custom Animations & Glow Styles */}
            <style>{`
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.35; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.05); }
                }
                .pulse-glow {
                    animation: pulseGlow 7s ease-in-out infinite;
                }
            `}</style>

            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-amber-500/10 blur-[150px]" />
            <div className="pointer-events-none absolute top-[40%] right-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[160px]" />
            <div className="pointer-events-none absolute top-[75%] left-10 h-[450px] w-[450px] rounded-full bg-amber-400/5 blur-[150px]" />

            {/* Fixed Grain Overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Floating Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="about" />
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 pt-32 md:pt-40 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">

                {/* Section 1: Hero Header */}
                <section className="relative text-center max-w-3xl mx-auto space-y-5 pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        National Esports Federation • Reg: {rosNumber}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                        About{' '}
                        <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                            {orgAcronym}
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                        {aboutHeroSubtitle}
                    </p>
                </section>

                {/* Section 2: About Us (Verbatim Official Info from mesf.my) */}
                <section className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-white/[0.025] border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                                About Us
                            </div>

                            <div
                                className="about-story-rich-text text-neutral-300 text-sm sm:text-base leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: aboutStoryHtml }}
                            />
                        </div>

                        {/* Emblem card */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#090D1A] border border-white/10 text-center space-y-4">
                            <img
                                src={logoUrl}
                                alt={`${orgAcronym} Emblem`}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/images/mesf_logo.png';
                                }}
                                className="h-24 w-24 object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                            />
                            <div>
                                <h2 className="text-base font-bold text-white tracking-wide uppercase">
                                    {orgName}
                                </h2>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Reg. No: {rosNumber}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/10 w-full flex items-center justify-center gap-6 text-xs text-neutral-400">
                                <span>IeSF Member</span>
                                <span>•</span>
                                <span>AESF Member</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Institutional Partners & Affiliations */}
                <section className="space-y-6">
                    <div className="text-center max-w-xl mx-auto space-y-1">
                        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                            Affiliations
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Institutional & International Affiliates
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {AFFILIATED_PARTNERS.map((partner) => (
                            <div
                                key={partner.name}
                                className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center space-y-2.5"
                            >
                                <div className="h-12 w-full flex items-center justify-center">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-10 max-w-[85%] object-contain filter grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
                                    />
                                </div>
                                <span className="text-xs font-semibold text-white block">
                                    {partner.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 4: Committee Members 2024 - 2027 */}
                <section id="committee" className="space-y-8 scroll-mt-32">
                    {/* Header & Search */}
                    <div className="relative pb-6 border-b border-white/10">
                        {/* Soft Ambient Radial Backlight */}
                        <div className="pointer-events-none absolute -top-10 -left-10 h-44 w-72 rounded-full bg-amber-400/[0.08] blur-[80px]" />

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                                    Council Session &bull; 2024 – 2027
                                </div>

                                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                    Committee Members{' '}
                                    <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent font-mono">
                                        2024–2027
                                    </span>
                                </h2>

                                <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                                    Official executive leadership and general committee members sanctioned under MESF.
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative shrink-0">
                                <input
                                    type="text"
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    placeholder="Search member, title or email..."
                                    className="w-full sm:w-72 px-4 py-2.5 pl-10 rounded-full text-xs font-medium bg-[#0B111D] border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 shadow-inner transition-all"
                                />
                                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* 1. EXECUTIVE LEADERSHIP */}
                    {leadershipMembers.length > 0 && (
                        <div className="space-y-4">
                            {/* Section Divider with Centered Title */}
                            <div className="relative flex items-center justify-center pt-2 pb-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-amber-400/20" />
                                </div>
                                <div className="relative bg-[#070B14] px-5 text-xs font-mono font-bold tracking-[0.25em] text-amber-400 uppercase">
                                    EXECUTIVE LEADERSHIP
                                </div>
                            </div>

                            {/* 2 Prominent Side-by-Side Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                                {leadershipMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group relative rounded-2xl p-5 sm:p-6 bg-[#0B101D]/90 border border-white/10 hover:border-amber-400/50 shadow-xl transition-all duration-300 flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                                            {/* Gold Monogram Badge */}
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/10">
                                                {getMemberInitials(member.name)}
                                            </div>

                                            {/* Details Stack */}
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                                                    {member.name}
                                                </h4>
                                                <div className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
                                                    {member.title}
                                                </div>
                                                {member.contact && (
                                                    <div className="pt-0.5">
                                                        <a
                                                            href={`mailto:${member.contact}`}
                                                            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono transition-colors truncate max-w-full"
                                                            title={member.contact}
                                                        >
                                                            <Mail className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                                                            <span className="truncate">{member.contact}</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Mail Action Button */}
                                        {member.contact && (
                                            <a
                                                href={`mailto:${member.contact}`}
                                                aria-label={`Email ${member.name}`}
                                                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 text-slate-400 hover:text-amber-300 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. EXECUTIVE COUNCIL */}
                    {councilMembers.length > 0 && (
                        <div className="space-y-4 pt-4">
                            {/* Section Divider with Centered Title */}
                            <div className="relative flex items-center justify-center pt-4 pb-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative bg-[#070B14] px-5 text-xs font-mono font-bold tracking-[0.25em] text-slate-300 uppercase">
                                    EXECUTIVE COUNCIL
                                </div>
                            </div>

                            {/* 4-column Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {councilMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group relative rounded-2xl p-4 sm:p-5 bg-[#0B101D]/80 border border-white/10 hover:border-amber-400/40 shadow-lg transition-all duration-300 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                            {/* Slate Monogram Badge */}
                                            <div className="w-12 h-12 rounded-xl bg-[#141C2E] border border-white/10 text-slate-200 font-bold text-sm sm:text-base flex items-center justify-center shrink-0">
                                                {getMemberInitials(member.name)}
                                            </div>

                                            {/* Details Stack */}
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-tight truncate" title={member.name}>
                                                    {member.name}
                                                </h4>
                                                <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-amber-400/90 tracking-wider uppercase truncate" title={member.title}>
                                                    {member.title}
                                                </div>
                                                {member.contact && (
                                                    <div className="pt-0.5">
                                                        <a
                                                            href={`mailto:${member.contact}`}
                                                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white font-mono transition-colors truncate max-w-full"
                                                            title={member.contact}
                                                        >
                                                            <Mail className="w-3 h-3 text-amber-400/70 shrink-0" />
                                                            <span className="truncate">{member.contact}</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Mail Action Button */}
                                        {member.contact && (
                                            <a
                                                href={`mailto:${member.contact}`}
                                                aria-label={`Email ${member.name}`}
                                                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-400 hover:text-amber-300 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. GENERAL COMMITTEE */}
                    {filteredGeneralCommittee.length > 0 && (
                        <div className="rounded-3xl p-6 sm:p-8 bg-[#090E1A]/80 border border-white/10 shadow-2xl backdrop-blur-xl mt-12 space-y-6">
                            {/* Inner Header with User Group Icon and Member Count */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-white">
                                            General committee
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Supporting the federation across the country
                                        </p>
                                    </div>
                                </div>

                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 self-start sm:self-auto">
                                    {filteredGeneralCommittee.length} members
                                </div>
                            </div>

                            {/* 4-column Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {filteredGeneralCommittee.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group relative rounded-2xl p-4 bg-[#0D1424]/90 border border-white/10 hover:border-amber-400/40 shadow-md transition-all duration-300 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            {/* Monogram Box */}
                                            <div className="w-11 h-11 rounded-xl bg-[#172138] border border-white/10 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                                                {getMemberInitials(member.name)}
                                            </div>

                                            {/* Details Stack */}
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight truncate" title={member.name}>
                                                    {member.name}
                                                </h4>
                                                <div className="text-[10px] font-mono font-semibold text-amber-400/90 tracking-wider uppercase truncate" title={member.title || 'COMMITTEE'}>
                                                    {member.title || 'COMMITTEE'}
                                                </div>
                                                {member.contact && (
                                                    <div className="pt-0.5">
                                                        <a
                                                            href={`mailto:${member.contact}`}
                                                            className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white font-mono transition-colors truncate max-w-full"
                                                            title={member.contact}
                                                        >
                                                            <Mail className="w-3 h-3 text-amber-400/60 shrink-0" />
                                                            <span className="truncate">{member.contact}</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Mail Action Button */}
                                        {member.contact && (
                                            <a
                                                href={`mailto:${member.contact}`}
                                                aria-label={`Email ${member.name}`}
                                                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-amber-400/40 text-slate-400 hover:text-amber-300 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty search results message */}
                    {leadershipMembers.length === 0 && councilMembers.length === 0 && filteredGeneralCommittee.length === 0 && (
                        <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/10 text-neutral-400 text-sm">
                            No committee members match &ldquo;{memberSearch}&rdquo;.
                        </div>
                    )}
                </section>

                {/* Section 5: Official Secretary & Contact Channels */}
                <section className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-white/[0.025] border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                                Secretary
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Contact & Inquiries
                            </h2>
                            <p className="text-sm text-neutral-300 leading-relaxed">
                                For inquiries, sanctioning, state affiliations, official partnerships, and media requests:
                            </p>

                            {/* Contact Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {officialEmail && (
                                    <a
                                        href={`mailto:${officialEmail}`}
                                        className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.08] transition-all flex items-center gap-3.5 group cursor-pointer"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Official Email</span>
                                            <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors font-mono">{officialEmail}</span>
                                        </div>
                                    </a>
                                )}

                                {phone && (
                                    <a
                                        href={`tel:${phone.replace(/\s+/g, '')}`}
                                        className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.08] transition-all flex items-center gap-3.5 group cursor-pointer"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Hotline / Phone</span>
                                            <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors font-mono">{phone}</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Social & Registration Info Card */}
                        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#080C16] border border-white/10 space-y-5">
                            <div>
                                <h3 className="text-base font-bold text-white">Registration Details</h3>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Sports Development Act 1997 &bull; Reg No. {rosNumber || '7402/2014'}
                                </p>
                            </div>

                            {socialChannels.length > 0 && (
                                <div className="space-y-3 pt-2 border-t border-white/10">
                                    <span className="text-xs font-semibold text-neutral-300 block uppercase tracking-wider">
                                        Official Channels
                                    </span>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {socialChannels.map((channel) => (
                                            <a
                                                key={channel.name}
                                                href={channel.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-400/10 border border-white/5 hover:border-amber-400/30 transition-all text-left group"
                                            >
                                                <span className="text-[11px] text-neutral-400 group-hover:text-amber-300 block font-medium">
                                                    {channel.name}
                                                </span>
                                                <span className="text-xs font-bold text-white font-mono">
                                                    {channel.handle}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Premium Footer */}
            <Footer />
        </div>
    );
}