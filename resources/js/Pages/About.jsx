// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import { Mail, Users, Search, X, ShieldCheck, Award, Phone, MapPin, Globe, ArrowRight, MessageSquare, Check } from 'lucide-react';

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

// Helper to get initials for badge avatars
const getMemberInitials = (name) => {
    if (!name || typeof name !== 'string') return 'ME';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper to parse map embed string or iframe
const getEmbedMapSrc = (input) => {
    if (!input || typeof input !== 'string') return '';
    const trimmed = input.trim();
    if (trimmed.includes('<iframe')) {
        const match = trimmed.match(/src=["']([^"']+)["']/i);
        return match ? match[1] : '';
    }
    return trimmed;
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
    const rosNumber = settings?.rosNumber || ''; // properties
    const phone = settings?.phone || ''; // properties
    const officialEmail = settings?.replyEmail || settings?.supportEmail || ''; // properties
    const streetAddress = settings?.streetAddress || ''; // properties
    const city = settings?.city || ''; // properties
    const state = settings?.state || ''; // properties
    const postalCode = settings?.postalCode || ''; // properties
    const country = settings?.country || 'Malaysia'; // properties
    const googleMapEmbed = settings?.googleMapEmbed || settings?.contact_map_url || ''; // properties
    const aboutHeroSubtitle = settings?.aboutHeroSubtitle || ''; // properties
    const aboutStoryHtml = settings?.aboutStoryHtml || (settings?.aboutStoryP1 ? `<p>${settings.aboutStoryP1}</p><p>${settings.aboutStoryP2 || ''}</p><p>${settings.aboutStoryP3 || ''}</p>` : ''); // properties

    const fullAddress = useMemo(() => {
        return streetAddress ? `${streetAddress}, ${postalCode ? `${postalCode} ` : ''}${city ? `${city}, ` : ''}${state ? `${state}, ` : ''}${country}` : 'Kuala Lumpur, Malaysia';
    }, [streetAddress, postalCode, city, state, country]);

    const mapSrc = useMemo(() => {
        const parsed = getEmbedMapSrc(googleMapEmbed);
        if (parsed) return parsed;
        if (streetAddress || city) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        return 'https://maps.google.com/maps?q=Kuala+Lumpur,+Malaysia&t=&z=14&ie=UTF8&iwloc=&output=embed';
    }, [googleMapEmbed, streetAddress, city, fullAddress]);

    const executiveSections = useMemo(() => {
        const raw = parseJsonSetting(settings?.executiveSections, []);
        if (!Array.isArray(raw)) return [];
        return raw.map((section) => ({
            ...section,
            members: Array.isArray(section?.members) ? section.members : []
        })).filter((section) => section.members && section.members.length > 0);
    }, [settings?.executiveSections]);

    const generalCommittee = useMemo(() => {
        const raw = parseJsonSetting(settings?.generalCommittee, []);
        return Array.isArray(raw) ? raw : [];
    }, [settings?.generalCommittee]);

    const socialChannels = useMemo(() => {
        const channels = [];
        if (settings?.instagram) channels.push({ name: 'Instagram', handle: settings?.instagramHandle || settings.instagram, href: settings.instagram });
        if (settings?.tiktok) channels.push({ name: 'TikTok', handle: settings?.tiktokHandle || settings.tiktok, href: settings.tiktok });
        if (settings?.youtube) channels.push({ name: 'YouTube', handle: settings?.youtubeHandle || settings.youtube, href: settings.youtube });
        if (settings?.xUrl || settings?.twitter) channels.push({ name: 'X / Twitter', handle: settings?.xHandle || settings?.twitterHandle || (settings.xUrl || settings.twitter), href: settings.xUrl || settings.twitter });
        if (settings?.facebook) channels.push({ name: 'Facebook', handle: settings?.facebookHandle || settings.facebook, href: settings.facebook });
        if (settings?.iesfUrl) channels.push({ name: 'IeSF Member', handle: settings?.iesfHandle || settings.iesfUrl, href: settings.iesfUrl });
        return channels;
    }, [settings]);

    // --4. actions--
    const [memberSearch, setMemberSearch] = useState(''); // state
    const [activeCategory, setActiveCategory] = useState('all'); // state
    const [copiedKey, setCopiedKey] = useState(null); // state

    const copyToClipboard = (text, key) => { // trigger
        if (!text) return;
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(text);
        }
        setCopiedKey(key);
        setTimeout(() => {
            setCopiedKey((curr) => (curr === key ? null : curr));
        }, 2000);
    };

    // Filter executive sections and members based on search
    const filteredExecutiveSections = useMemo(() => {
        if (!memberSearch.trim()) return executiveSections;
        const q = memberSearch.toLowerCase();
        return executiveSections.map((section) => ({
            ...section,
            members: (section.members || []).filter((m) =>
                (m?.name || '').toLowerCase().includes(q) ||
                (m?.title || '').toLowerCase().includes(q) ||
                (m?.contact || '').toLowerCase().includes(q) ||
                (m?.phone || '').toLowerCase().includes(q)
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
            (m?.contact || '').toLowerCase().includes(q) ||
            (m?.phone || '').toLowerCase().includes(q)
        );
    }, [memberSearch, generalCommittee]);

    // Section-specific member groups
    const leadershipMembers = useMemo(() => {
        const leadershipSec = filteredExecutiveSections.find((s) => s.id === 'leadership');
        return leadershipSec?.members || [];
    }, [filteredExecutiveSections]);

    const vpMembers = useMemo(() => {
        const vpSec = filteredExecutiveSections.find((s) => s.id === 'vice_presidents');
        return vpSec?.members || [];
    }, [filteredExecutiveSections]);

    const secretariatMembers = useMemo(() => {
        const secSec = filteredExecutiveSections.find((s) => s.id === 'secretariat');
        return secSec?.members || [];
    }, [filteredExecutiveSections]);

    // Counts for filter pills
    const totalMembersCount = useMemo(() => {
        const execCount = executiveSections.reduce((acc, sec) => acc + (sec.members?.length || 0), 0);
        return execCount + generalCommittee.length;
    }, [executiveSections, generalCommittee]);

    const totalFilteredCount = useMemo(() => {
        const execCount = filteredExecutiveSections.reduce((acc, sec) => acc + (sec.members?.length || 0), 0);
        return execCount + filteredGeneralCommittee.length;
    }, [filteredExecutiveSections, filteredGeneralCommittee]);

    const filterCategories = [
        { id: 'all', label: 'All Members', count: totalMembersCount },
        { id: 'leadership', label: 'Leadership', count: executiveSections.find(s => s.id === 'leadership')?.members?.length || 0 },
        { id: 'vice_presidents', label: 'Vice Presidents', count: executiveSections.find(s => s.id === 'vice_presidents')?.members?.length || 0 },
        { id: 'secretariat', label: 'Secretariat', count: executiveSections.find(s => s.id === 'secretariat')?.members?.length || 0 },
        { id: 'general', label: 'General Committee', count: generalCommittee.length }
    ];

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
                        National Esports Federation{rosNumber ? ` • Reg: ${rosNumber}` : ''}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                        About{' '}
                        <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                            {orgAcronym}
                        </span>
                    </h1>

                    {aboutHeroSubtitle && (
                        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                            {aboutHeroSubtitle}
                        </p>
                    )}
                </section>

                {/* Section 2: About Us (Official Info from mesf.my) */}
                <section className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-white/[0.025] border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                                About Us
                            </div>

                            <div
                                className="about-story-rich-text text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4"
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
                                {rosNumber && (
                                    <p className="text-xs text-neutral-400 mt-1">
                                        Reg. No: {rosNumber}
                                    </p>
                                )}
                            </div>
                            <div className="pt-3 border-t border-white/10 w-full flex items-center justify-center gap-6 text-xs text-neutral-400 font-medium">
                                <span>IeSF Member</span>
                                <span>•</span>
                                <span>AESF Member</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Institutional Partners & Affiliations */}
                <section className="py-8 sm:py-14 space-y-8 sm:space-y-10">
                    <div className="text-center max-w-xl mx-auto space-y-2.5">
                        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                            Affiliations
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Institutional & International Affiliates
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
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
                    {/* Header & Controls */}
                    <div className="relative pb-6 border-b border-white/10 space-y-5">
                        {/* Ambient Backlight */}
                        <div className="pointer-events-none absolute -top-10 -left-10 h-44 w-72 rounded-full bg-amber-400/[0.08] blur-[80px]" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                            <div>
                                <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-white leading-tight">
                                    Committee Members{' '}
                                    <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                                        2024–2027
                                    </span>
                                </h2>
                            </div>

                            {/* Search Input */}
                            <div className="relative shrink-0 w-full md:w-72">
                                <input
                                    type="text"
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    placeholder="Search members..."
                                    className="w-full px-4 py-2 pl-9 pr-9 rounded-xl text-xs font-medium bg-[#0B111D] border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                                {memberSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setMemberSearch('')}
                                        className="absolute right-2.5 top-2 text-neutral-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-all"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {filterCategories.map((cat) => {
                                const isActive = activeCategory === cat.id && !memberSearch;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            if (memberSearch) setMemberSearch('');
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive
                                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                                            : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
                                            }`}
                                    >
                                        <span>{cat.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-neutral-400'
                                            }`}>
                                            {cat.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 1. EXECUTIVE LEADERSHIP (President & Deputy President) */}
                    {(activeCategory === 'all' || activeCategory === 'leadership') && leadershipMembers.length > 0 && (
                        <div className="space-y-3">
                            <div className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                                Executive Leadership
                            </div>

                            {/* Grand Leadership Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                                {leadershipMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group relative rounded-2xl p-5 bg-gradient-to-b from-[#0F172A]/90 to-[#0B101D]/95 border border-amber-400/30 hover:border-amber-400/70 shadow-lg transition-all duration-300 flex items-start justify-between gap-4"
                                    >
                                        <div className="flex items-start gap-4 min-w-0 flex-1">
                                            {/* Gold Monogram Badge (Top-Aligned) */}
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                                                {getMemberInitials(member.name)}
                                            </div>

                                            {/* Details Stack */}
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-amber-300 uppercase bg-amber-400/10 border border-amber-400/30">
                                                    {member.title}
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug truncate" title={member.name}>
                                                    {member.name}
                                                </h3>
                                                {(member.contact || member.phone) && (
                                                    <div className="flex flex-col gap-1 text-xs text-neutral-400 font-mono pt-1">
                                                        {member.phone && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                                title="Click to copy phone number"
                                                                className="truncate flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-phone` ? (
                                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Phone className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-phone` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-phone` ? 'Copied Phone!' : member.phone}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {member.contact && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                                title="Click to copy email"
                                                                className="truncate flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-email` ? (
                                                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Mail className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-email` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-email` ? 'Copied Email!' : member.contact}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Direct Email & Phone Copy Action Buttons (Vertical Stack) */}
                                        <div className="flex flex-col gap-1.5 shrink-0 items-center justify-start pt-0.5">
                                            {member.phone && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                    aria-label={`Copy ${member.name}'s phone number`}
                                                    title={copiedKey === `${member.id}-phone` ? 'Copied phone number!' : `Copy phone: ${member.phone}`}
                                                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-phone`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.05] border-white/10 hover:border-amber-400/60 hover:bg-amber-400/15 text-neutral-300 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-phone` ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                    ) : (
                                                        <Phone className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            )}
                                            {member.contact && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                    aria-label={`Copy ${member.name}'s email`}
                                                    title={copiedKey === `${member.id}-email` ? 'Copied email address!' : `Copy email: ${member.contact}`}
                                                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-email`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.05] border-white/10 hover:border-amber-400/60 hover:bg-amber-400/15 text-neutral-300 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-email` ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                    ) : (
                                                        <Mail className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. VICE PRESIDENTS */}
                    {(activeCategory === 'all' || activeCategory === 'vice_presidents') && vpMembers.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="text-xs font-bold tracking-widest text-neutral-300 uppercase">
                                Vice Presidents
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                {vpMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group relative rounded-2xl p-4 bg-[#0B101D]/80 border border-white/10 hover:border-amber-400/50 hover:bg-[#0E1528] shadow-md transition-all duration-300 flex items-start justify-between gap-3"
                                    >
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                            {/* Slate Monogram Badge (Top-Aligned) */}
                                            <div className="w-11 h-11 rounded-xl bg-[#141C2E] border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-amber-400/40 group-hover:text-amber-300 transition-all">
                                                {getMemberInitials(member.name)}
                                            </div>

                                            {/* Details Stack */}
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wide truncate" title={member.title}>
                                                    {member.title}
                                                </div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight truncate" title={member.name}>
                                                    {member.name}
                                                </h4>
                                                {(member.contact || member.phone) && (
                                                    <div className="flex flex-col text-[10px] text-neutral-400 font-mono pt-1 space-y-0.5">
                                                        {member.phone && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                                title="Click to copy phone number"
                                                                className="truncate hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-phone` ? (
                                                                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Phone className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-phone` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-phone` ? 'Copied Phone!' : member.phone}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {member.contact && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                                title="Click to copy email"
                                                                className="truncate hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-email` ? (
                                                                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Mail className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-email` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-email` ? 'Copied Email!' : member.contact}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Direct Copy Action Buttons (Vertical Stack) */}
                                        <div className="flex flex-col gap-1 shrink-0 items-center justify-start pt-0.5">
                                            {member.phone && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                    aria-label={`Copy ${member.name}'s phone number`}
                                                    title={copiedKey === `${member.id}-phone` ? 'Copied phone number!' : `Copy phone: ${member.phone}`}
                                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-phone`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.03] border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 text-neutral-400 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-phone` ? (
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                    ) : (
                                                        <Phone className="w-3 h-3" />
                                                    )}
                                                </button>
                                            )}
                                            {member.contact && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                    aria-label={`Copy ${member.name}'s email`}
                                                    title={copiedKey === `${member.id}-email` ? 'Copied email address!' : `Copy email: ${member.contact}`}
                                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-email`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.03] border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 text-neutral-400 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-email` ? (
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                    ) : (
                                                        <Mail className="w-3 h-3" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. SECRETARIAT & ADMINISTRATION */}
                    {(activeCategory === 'all' || activeCategory === 'secretariat') && secretariatMembers.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="text-xs font-bold tracking-widest text-neutral-300 uppercase">
                                Secretariat & Administration
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                {secretariatMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group relative rounded-2xl p-4 bg-[#0B101D]/80 border border-white/10 hover:border-amber-400/50 hover:bg-[#0E1528] shadow-md transition-all duration-300 flex items-start justify-between gap-3"
                                    >
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                            {/* Slate Monogram Badge (Top-Aligned) */}
                                            <div className="w-11 h-11 rounded-xl bg-[#141C2E] border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-amber-400/40 group-hover:text-amber-300 transition-all">
                                                {getMemberInitials(member.name)}
                                            </div>

                                            {/* Details Stack */}
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wide truncate" title={member.title}>
                                                    {member.title}
                                                </div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight truncate" title={member.name}>
                                                    {member.name}
                                                </h4>
                                                {(member.contact || member.phone) && (
                                                    <div className="flex flex-col text-[10px] text-neutral-400 font-mono pt-1 space-y-0.5">
                                                        {member.phone && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                                title="Click to copy phone number"
                                                                className="truncate hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-phone` ? (
                                                                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Phone className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-phone` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-phone` ? 'Copied Phone!' : member.phone}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {member.contact && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                                title="Click to copy email"
                                                                className="truncate hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-email` ? (
                                                                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Mail className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-email` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-email` ? 'Copied Email!' : member.contact}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Direct Copy Action Buttons (Vertical Stack) */}
                                        <div className="flex flex-col gap-1 shrink-0 items-center justify-start pt-0.5">
                                            {member.phone && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                    aria-label={`Copy ${member.name}'s phone number`}
                                                    title={copiedKey === `${member.id}-phone` ? 'Copied phone number!' : `Copy phone: ${member.phone}`}
                                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-phone`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.03] border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 text-neutral-400 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-phone` ? (
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                    ) : (
                                                        <Phone className="w-3 h-3" />
                                                    )}
                                                </button>
                                            )}
                                            {member.contact && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                    aria-label={`Copy ${member.name}'s email`}
                                                    title={copiedKey === `${member.id}-email` ? 'Copied email address!' : `Copy email: ${member.contact}`}
                                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-email`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.03] border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 text-neutral-400 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-email` ? (
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                    ) : (
                                                        <Mail className="w-3 h-3" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. GENERAL COMMITTEE */}
                    {(activeCategory === 'all' || activeCategory === 'general') && filteredGeneralCommittee.length > 0 && (
                        <div className="rounded-3xl p-5 sm:p-7 bg-[#090E1A]/80 border border-white/10 shadow-xl backdrop-blur-xl space-y-5">
                            {/* Inner Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-white">
                                        General Committee
                                    </h3>
                                </div>

                                <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
                                    {filteredGeneralCommittee.length}
                                </div>
                            </div>

                            {/* 4-column Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {filteredGeneralCommittee.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group relative rounded-xl p-3.5 bg-[#0D1424]/90 border border-white/10 hover:border-amber-400/40 hover:bg-[#10182E] shadow-sm transition-all duration-300 flex items-start justify-between gap-2.5"
                                    >
                                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                            {/* Monogram Box (Top-Aligned) */}
                                            <div className="w-9 h-9 rounded-lg bg-[#172138] border border-white/10 text-neutral-300 font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-amber-400/40 group-hover:text-amber-300 transition-all">
                                                {getMemberInitials(member.name)}
                                            </div>

                                            {/* Details Stack */}
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight truncate" title={member.name}>
                                                    {member.name}
                                                </h4>
                                                <div className="text-[10px] font-semibold text-amber-400/90 uppercase tracking-wide truncate" title={member.title || 'Committee'}>
                                                    {member.title || 'Committee'}
                                                </div>
                                                {(member.contact || member.phone) && (
                                                    <div className="flex flex-col text-[10px] text-neutral-400 font-mono pt-1 space-y-0.5">
                                                        {member.phone && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                                title="Click to copy phone number"
                                                                className="truncate hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-phone` ? (
                                                                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Phone className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-phone` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-phone` ? 'Copied Phone!' : member.phone}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {member.contact && (
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                                title="Click to copy email"
                                                                className="truncate hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-left"
                                                            >
                                                                {copiedKey === `${member.id}-email` ? (
                                                                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <Mail className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                                                                )}
                                                                <span className={copiedKey === `${member.id}-email` ? 'text-emerald-400 font-sans font-semibold' : ''}>
                                                                    {copiedKey === `${member.id}-email` ? 'Copied Email!' : member.contact}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Direct Action Buttons (Vertical Stack) */}
                                        <div className="flex flex-col gap-1 shrink-0 items-center justify-start pt-0.5">
                                            {member.phone && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.phone, `${member.id}-phone`)}
                                                    aria-label={`Copy ${member.name}'s phone number`}
                                                    title={copiedKey === `${member.id}-phone` ? 'Copied phone number!' : `Copy phone: ${member.phone}`}
                                                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-phone`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.03] border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-neutral-400 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-phone` ? (
                                                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                                                    ) : (
                                                        <Phone className="w-2.5 h-2.5" />
                                                    )}
                                                </button>
                                            )}
                                            {member.contact && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(member.contact, `${member.id}-email`)}
                                                    aria-label={`Copy ${member.name}'s email`}
                                                    title={copiedKey === `${member.id}-email` ? 'Copied email address!' : `Copy email: ${member.contact}`}
                                                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                                        copiedKey === `${member.id}-email`
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105'
                                                            : 'bg-white/[0.03] border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-neutral-400 hover:text-amber-300'
                                                    }`}
                                                >
                                                    {copiedKey === `${member.id}-email` ? (
                                                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                                                    ) : (
                                                        <Mail className="w-2.5 h-2.5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty Search / Filter State */}
                    {totalFilteredCount === 0 && (
                        <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                                <Search className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">No members found</h3>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    No results for &ldquo;{memberSearch}&rdquo;.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMemberSearch('')}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-md shadow-amber-400/20"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </section>

                {/* Section 5: Official Secretary & Contact Channels */}
                <section className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-[#0C1222]/90 to-[#080D18]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                        {/* Left Column: Contact Methods */}
                        <div className="lg:col-span-4 space-y-5 flex flex-col justify-start">
                            <div className="space-y-1.5">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                    Contact & Inquiries
                                </h2>
                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                    Official communication channels for inquiries, sanctioning, and partnerships.
                                </p>
                            </div>

                            {/* Contact Badges List */}
                            <div className="space-y-3">
                                {/* Official Email */}
                                {officialEmail && (
                                    <a
                                        href={`mailto:${officialEmail}`}
                                        className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 transition-all flex items-center gap-3.5 shadow-sm cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-400 flex items-center justify-center shrink-0 transition-all">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Official Email</span>
                                            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors block truncate">{officialEmail}</span>
                                        </div>
                                    </a>
                                )}

                                {/* Phone / Hotline from Admin Settings */}
                                {phone ? (
                                    <a
                                        href={`tel:${phone.replace(/\s+/g, '')}`}
                                        className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 transition-all flex items-center gap-3.5 shadow-sm cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-400 flex items-center justify-center shrink-0 transition-all">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Hotline / Phone</span>
                                            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors block truncate">{phone}</span>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-neutral-500 flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">Hotline / Phone</span>
                                            <span className="text-xs text-neutral-400 block">Available via Official Email</span>
                                        </div>
                                    </div>
                                )}

                                {/* Federation Address / Location Box with Interactive Map Embed */}
                                <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden shadow-sm flex flex-col">
                                    <div className="p-4 sm:p-5 flex items-start gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Location</span>
                                            <span className="text-xs sm:text-sm font-medium text-neutral-200 block leading-relaxed break-words">
                                                {fullAddress}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Embedded Map */}
                                    {mapSrc && (
                                        <div className="w-full h-44 sm:h-52 border-t border-white/10 bg-[#070B14] relative overflow-hidden group">
                                            <iframe
                                                title="MESF Secretariat Location"
                                                src={mapSrc}
                                                className="w-full h-full border-0 filter grayscale contrast-125 opacity-75 hover:filter-none hover:opacity-100 transition-all duration-500"
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                            {/* Ambient gradient overlay */}
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080D18]/80 via-transparent to-transparent opacity-60" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Registration & Official Channels */}
                        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 shadow-xl flex flex-col justify-between gap-6">
                            <div className="space-y-5">
                                <div className="pb-4 border-b border-white/10">
                                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                        Registration Details
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                                        Sports Development Act 1997{rosNumber ? <> &bull; Reg. No: <span className="text-amber-400 font-semibold">{rosNumber}</span></> : ''}
                                    </p>
                                </div>

                                {socialChannels.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                                                Official Channels
                                            </span>
                                            <span className="text-[11px] text-neutral-500 font-medium">
                                                Verified Links
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {socialChannels.map((channel) => (
                                                <a
                                                    key={channel.name}
                                                    href={channel.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] hover:bg-amber-400/10 border border-white/5 hover:border-amber-400/30 transition-all text-left group flex flex-col justify-center gap-1 shadow-sm min-h-[64px]"
                                                >
                                                    <span className="text-[10px] sm:text-[11px] text-neutral-400 group-hover:text-amber-300 block font-medium uppercase tracking-wider">
                                                        {channel.name}
                                                    </span>
                                                    <span className="text-xs sm:text-sm font-semibold text-white break-words leading-snug block">
                                                        {channel.handle}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Interactive Navigation Link Card */}
                            <div className="pt-4 border-t border-white/10">
                                <Link
                                    href="/get-involved"
                                    className="group relative w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-white/[0.02] border border-amber-400/30 hover:border-amber-400/70 hover:bg-amber-400/15 transition-all duration-300 flex items-center justify-between gap-4 shadow-lg shadow-amber-400/5 hover:shadow-amber-400/20 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md shadow-amber-400/30 group-hover:scale-105 group-hover:from-amber-300 group-hover:to-amber-400 transition-all">
                                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0 text-left">
                                            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                                                Inquiry & Support Desk
                                            </div>
                                            <div className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                                Have a Question or Proposal?
                                            </div>
                                            <p className="text-xs text-neutral-400 hidden sm:block truncate">
                                                Reach out to our secretariat for sanctioning, affiliations & partnerships
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-amber-400/50 group-hover:bg-amber-400/20 text-neutral-400 group-hover:text-amber-300 flex items-center justify-center shrink-0 transition-all">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Premium Footer */}
            <Footer />
        </div>
    );
}