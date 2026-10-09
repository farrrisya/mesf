// --1. imports--
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import {
    Mail,
    Search,
    X,
    Phone,
    MapPin,
    ArrowRight,
    MessageSquare,
    Check,
    ExternalLink
} from 'lucide-react';

// --2. properties--
const AFFILIATED_PARTNERS = [
    {
        name: 'KBS Malaysia',
        role: 'Governing Ministry',
        desc: 'Ministry of Youth & Sports Malaysia',
        logo: '/images/partners/kbs.svg'
    },
    {
        name: 'Majlis Sukan Negara',
        role: 'National Sports Council',
        desc: 'Elite Athlete Development & Facilities',
        logo: '/images/partners/msn.svg'
    },
    {
        name: 'Olympic Council Malaysia',
        role: 'National Olympic Committee',
        desc: 'SEA, Asian & Olympic Games Endorsement',
        logo: '/images/partners/ocm.svg'
    },
    {
        name: 'IeSF',
        role: 'International Esports Federation',
        desc: 'World Esports Championship Sanction',
        logo: '/images/partners/iesf.svg'
    },
    {
        name: 'AESF',
        role: 'Asian Electronic Sports Federation',
        desc: 'Asian Continental Governing Body',
        logo: '/images/partners/aesf.svg'
    },
    {
        name: 'Esports Integrated',
        role: 'Strategic Ecosystem Partner',
        desc: 'National Grassroots Growth Initiative',
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
    const rosNumber = settings?.rosNumber || 'PPM-007-14-19092014'; // properties
    const phone = settings?.phone || '+60 3-8994 4800'; // properties
    const officialEmail = settings?.replyEmail || settings?.supportEmail || 'secretariat@mesf.my'; // properties
    const streetAddress = settings?.streetAddress || 'National Sports Council Complex, Bukit Jalil'; // properties
    const city = settings?.city || 'Kuala Lumpur'; // properties
    const state = settings?.state || 'Wilayah Persekutuan'; // properties
    const postalCode = settings?.postalCode || '57000'; // properties
    const country = settings?.country || 'Malaysia'; // properties
    const googleMapEmbed = settings?.googleMapEmbed || settings?.contact_map_url || ''; // properties
    const aboutHeroSubtitle = settings?.aboutHeroSubtitle || 'The apex national governing body mandated under the Sports Development Act 1997 to govern, regulate, and advance competitive electronic sports across Malaysia.'; // properties
    const aboutStoryHtml = settings?.aboutStoryHtml || (settings?.aboutStoryP1 ? `<p>${settings.aboutStoryP1}</p><p>${settings.aboutStoryP2 || ''}</p><p>${settings.aboutStoryP3 || ''}</p>` : ''); // properties

    const fullAddress = useMemo(() => {
        return streetAddress ? `${streetAddress}, ${postalCode ? `${postalCode} ` : ''}${city ? `${city}, ` : ''}${state ? `${state}, ` : ''}${country}` : 'Bukit Jalil, Kuala Lumpur, Malaysia';
    }, [streetAddress, postalCode, city, state, country]);

    const mapSrc = useMemo(() => {
        const parsed = getEmbedMapSrc(googleMapEmbed);
        if (parsed) return parsed;
        if (streetAddress || city) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        return 'https://maps.google.com/maps?q=National+Stadium+Bukit+Jalil,+Kuala+Lumpur&t=&z=15&ie=UTF8&iwloc=&output=embed';
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
        if (settings?.instagram) channels.push({ name: 'Instagram', href: settings.instagram });
        if (settings?.tiktok) channels.push({ name: 'TikTok', href: settings.tiktok });
        if (settings?.youtube) channels.push({ name: 'YouTube', href: settings.youtube });
        if (settings?.xUrl || settings?.twitter) channels.push({ name: 'X / Twitter', href: settings.xUrl || settings.twitter });
        if (settings?.facebook) channels.push({ name: 'Facebook', href: settings.facebook });
        if (settings?.iesfUrl) channels.push({ name: 'IeSF', href: settings.iesfUrl });
        return channels;
    }, [settings]);

    // --4. actions--
    const [memberSearch, setMemberSearch] = useState(''); // state
    const [activeCategory, setActiveCategory] = useState('leadership'); // state
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

    // Group-specific arrays
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

    const filterCategories = [
        { id: 'leadership', label: 'Executive Leadership' },
        { id: 'vice_presidents', label: 'Vice Presidents' },
        { id: 'secretariat', label: 'Secretariat' },
        { id: 'general', label: 'General Committee' }
    ];

    // Active members based on active tab or global search
    const activeMembers = useMemo(() => {
        if (memberSearch.trim()) {
            const q = memberSearch.toLowerCase();
            const allExec = executiveSections.flatMap(s => s.members || []);
            const combined = [...allExec, ...generalCommittee];
            return combined.filter(m =>
                (m?.name || '').toLowerCase().includes(q) ||
                (m?.title || '').toLowerCase().includes(q)
            );
        }

        if (activeCategory === 'leadership') return leadershipMembers;
        if (activeCategory === 'vice_presidents') return vpMembers;
        if (activeCategory === 'secretariat') return secretariatMembers;
        if (activeCategory === 'general') return filteredGeneralCommittee;
        return leadershipMembers;
    }, [memberSearch, activeCategory, leadershipMembers, vpMembers, secretariatMembers, filteredGeneralCommittee, executiveSections, generalCommittee]);

    const scrollToSection = (id) => { // trigger
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden antialiased">
            <Head title="About - Malaysia Esports Federation (MESF)" />

            {/* Subtle background ambient light */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />
            <div className="pointer-events-none absolute top-[40%] right-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[160px]" />

            {/* Floating Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="about" />
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 pt-28 md:pt-36 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">

                {/* 1. ASYMMETRIC SPLIT EXECUTIVE HERO */}
                <section className="relative pt-4 sm:pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

                        {/* Left Column: Clean Editorial Overview */}
                        <div className="lg:col-span-7 space-y-6 text-left">
                            <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                                National Sports Governing Body &bull; Sports Development Act 1997
                            </p>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                                Governing Body for Esports in Malaysia
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                                {aboutHeroSubtitle}
                            </p>

                            {/* Minimalist In-page Jump Links */}
                            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('mandate')}
                                    className="hover:text-white transition-colors cursor-pointer"
                                >
                                    Mandate &amp; Vision &rarr;
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('affiliates')}
                                    className="hover:text-white transition-colors cursor-pointer"
                                >
                                    Affiliates &rarr;
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('committee')}
                                    className="hover:text-white transition-colors cursor-pointer"
                                >
                                    Executive Council &rarr;
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('headquarters')}
                                    className="hover:text-white transition-colors cursor-pointer"
                                >
                                    Headquarters &rarr;
                                </button>
                            </div>

                            {/* Clean Action Buttons */}
                            <div className="pt-2 flex flex-wrap items-center gap-3.5">
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('committee')}
                                    className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-xs tracking-wide hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"
                                >
                                    Meet The Council
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('headquarters')}
                                    className="px-5 py-2.5 rounded-xl bg-[#131E33] border border-[#2C3F63] text-white font-semibold text-xs tracking-wide hover:border-slate-400 transition-colors cursor-pointer"
                                >
                                    Contact Secretariat
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Clean Institutional Profile Card */}
                        <div className="lg:col-span-5">
                            <div className="rounded-3xl p-7 bg-[#131E33] border border-[#2C3F63] shadow-xl space-y-6">
                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b border-[#202E4A] pb-4 text-xs text-slate-400 font-medium">
                                    <span>Official Registry</span>
                                    <span>{rosNumber}</span>
                                </div>

                                {/* Logo & Name */}
                                <div className="flex flex-col items-center text-center space-y-3 pt-1">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0B1424] border border-[#202E4A] flex items-center justify-center p-3">
                                        <img
                                            src={logoUrl}
                                            alt={orgName}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/images/mesf_logo.png';
                                            }}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide uppercase">
                                            {orgName}
                                        </h2>
                                        <p className="text-xs text-slate-400">
                                            Persekutuan Sukan Elektronik Malaysia
                                        </p>
                                    </div>
                                </div>

                                {/* Clean 4-Metric Grid */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="p-3.5 rounded-xl bg-[#0B1424] border border-[#202E4A] space-y-1">
                                        <div className="text-base sm:text-lg font-bold text-white">
                                            2014
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Established
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-[#0B1424] border border-[#202E4A] space-y-1">
                                        <div className="text-base sm:text-lg font-bold text-white">
                                            15
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            State Affiliates
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-[#0B1424] border border-[#202E4A] space-y-1">
                                        <div className="text-base sm:text-lg font-bold text-white">
                                            IeSF &bull; AESF
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Global Accreditation
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-[#0B1424] border border-[#202E4A] space-y-1">
                                        <div className="text-base sm:text-lg font-bold text-white">
                                            Act 576
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Statutory Authority
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="pt-3 border-t border-[#202E4A] text-center text-xs text-slate-400">
                                    Statutory sanction recognized under KBS, MSN &amp; OCM
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 2. MANDATE & STRATEGIC VISION SECTION */}
                <section id="mandate" className="space-y-6 scroll-mt-28">
                    <div className="space-y-1 text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Mandate &amp; Strategic Vision
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Our legal authority, long-term outlook, and structural development framework.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                        {/* Card A: Statutory Authority (7 cols) */}
                        <div className="md:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#131E33] border border-[#2C3F63] flex flex-col justify-between space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                    National Statutory Authority
                                </h3>

                                {aboutStoryHtml ? (
                                    <div
                                        className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3 about-story-rich-text"
                                        dangerouslySetInnerHTML={{ __html: aboutStoryHtml }}
                                    />
                                ) : (
                                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                        The Malaysia Esports Federation ({orgAcronym}) is the official national governing body registered with the Sports Commissioner of Malaysia under the Sports Development Act 1997. MESF oversees national esports guidelines, athlete development, referee and coach licensing, and state championship circuits.
                                    </p>
                                )}
                            </div>

                            {/* Clean List */}
                            <ul className="space-y-2 pt-4 border-t border-[#202E4A] text-xs text-slate-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <span>Sole statutory authority to sanction domestic and international esports tournaments in Malaysia</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <span>Official selection and management of national esports athletes for SEA Games, Asian Games &amp; World Championships</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    <span>National certification and regulatory licensing for esports referees, marshals, and coaches</span>
                                </li>
                            </ul>
                        </div>

                        {/* Card B: Strategic Vision (5 cols) */}
                        <div className="md:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#131E33] border border-[#2C3F63] flex flex-col justify-between space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                    Our Vision
                                </h3>

                                <p className="text-slate-300 text-sm leading-relaxed">
                                    To establish Malaysia as Southeast Asia’s foremost esports powerhouse through sustainable grassroots development, athlete welfare, world-class competitive standards, and industry innovation.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-[#0B1424] border border-[#202E4A] space-y-3">
                                <div className="text-xs font-semibold text-slate-300">
                                    Key Focus Areas
                                </div>
                                <div className="space-y-2 text-xs text-slate-400">
                                    <div className="flex items-center justify-between">
                                        <span>Grassroots Athletes</span>
                                        <span className="font-medium text-white">50,000+ Active</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Annual Sanctioned Events</span>
                                        <span className="font-medium text-white">120+ Tournaments</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>International Representation</span>
                                        <span className="font-medium text-white">SEA, Asian &amp; IeSF Games</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card C: Three Pillars (12 cols) */}
                        <div className="md:col-span-12 rounded-3xl p-6 sm:p-8 bg-[#131E33] border border-[#2C3F63] space-y-5">
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                Pillars of Development
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-white">
                                        Grassroots &amp; State Leagues
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Empowering 15 state affiliates to run certified amateur leagues, school programs, and district qualifiers nationwide.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-white">
                                        National Athlete Pathways
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        High-performance training, bootcamp facilities, and sports psychology for national teams competing on international stages.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-white">
                                        Integrity &amp; Governance
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Anti-doping protocols, standard athlete contracts, certified refereeing, and dispute resolution for fair competition.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 3. INSTITUTIONAL & INTERNATIONAL AFFILIATES */}
                <section id="affiliates" className="space-y-6 scroll-mt-28">
                    <div className="space-y-1 text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Institutional &amp; International Affiliates
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Partner ministries, sports councils, and international federations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {AFFILIATED_PARTNERS.map((partner) => (
                            <div
                                key={partner.name}
                                className="p-5 rounded-2xl bg-[#131E33] border border-[#2C3F63] flex items-center gap-4 shadow-sm"
                            >
                                <div className="w-14 h-14 rounded-xl bg-[#0B1424] border border-[#202E4A] p-2 flex items-center justify-center shrink-0">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-8 max-w-full object-contain"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <h3 className="text-sm font-bold text-white truncate" title={partner.name}>
                                        {partner.name}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-300">
                                        {partner.role}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate" title={partner.desc}>
                                        {partner.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>                {/* 4. EXECUTIVE COUNCIL */}
                <section id="committee" className="space-y-6 scroll-mt-28">
                    <div className="space-y-5 pb-5 border-b border-[#202E4A]">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-1">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    Executive Council
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    Elected leadership and committee members for the 2024–2027 term.
                                </p>
                            </div>

                            {/* Minimalist Search Input */}
                            <div className="relative shrink-0 w-full md:w-64">
                                <input
                                    type="text"
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    placeholder="Search council..."
                                    className="w-full px-3.5 py-2 pl-9 pr-8 rounded-xl text-xs bg-[#0B1424] border border-[#202E4A] text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors"
                                />
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                                {memberSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setMemberSearch('')}
                                        className="absolute right-2.5 top-2 text-slate-400 hover:text-white p-0.5"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Minimalist Tab Navigation */}
                        {!memberSearch && (
                            <div className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-hide text-xs">
                                {filterCategories.map((cat) => {
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`pb-2 whitespace-nowrap transition-colors cursor-pointer border-b-2 font-medium ${
                                                isActive
                                                    ? 'border-white text-white font-semibold'
                                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Search Status Header (if searching) */}
                    {memberSearch && (
                        <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                            <span>
                                Found {activeMembers.length} result{activeMembers.length !== 1 ? 's' : ''} for &ldquo;{memberSearch}&rdquo;
                            </span>
                            <button
                                type="button"
                                onClick={() => setMemberSearch('')}
                                className="hover:text-white underline cursor-pointer"
                            >
                                Clear search
                            </button>
                        </div>
                    )}

                    {/* Compact Minimalist Tiles Grid */}
                    {activeMembers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {activeMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="rounded-xl p-4 bg-[#131E33] border border-[#2C3F63] flex items-center justify-between gap-3 shadow-sm min-h-[72px]"
                                >
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <p className="text-xs text-slate-400 font-medium truncate" title={member.title || 'Council Member'}>
                                            {member.title || 'Council Member'}
                                        </p>
                                        <h4 className="text-sm sm:text-base font-bold text-white truncate" title={member.name}>
                                            {member.name}
                                        </h4>
                                    </div>

                                    {member.contact && (
                                        <a
                                            href={`mailto:${member.contact}`}
                                            title={`Email ${member.name} (${member.contact})`}
                                            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 rounded-2xl bg-[#131E33] border border-[#2C3F63] space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0B1424] border border-[#202E4A] text-slate-400 flex items-center justify-center mx-auto">
                                <Search className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-white">No members found</h3>
                            <p className="text-xs text-slate-400">
                                No officials matched &ldquo;{memberSearch}&rdquo;.
                            </p>
                            <button
                                type="button"
                                onClick={() => setMemberSearch('')}
                                className="px-4 py-1.5 rounded-xl bg-white text-slate-950 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </section>

                {/* 5. NATIONAL HEADQUARTERS & SECRETARIAT */}
                <section id="headquarters" className="space-y-6 scroll-mt-28">
                    <div className="space-y-1 text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            National Headquarters &amp; Secretariat
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Physical offices, operating hours, and official channels.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Left Card: Communication Channels (7 cols) */}
                        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#131E33] border border-[#2C3F63] flex flex-col justify-between space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                        Secretariat Office
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        Operating Hours: Monday – Friday, 9:00 AM – 5:30 PM (MYT). Closed on national public holidays.
                                    </p>
                                </div>

                                {/* Contact Methods Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {/* Email */}
                                    <div className="p-4 rounded-2xl bg-[#0B1424] border border-[#202E4A] flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <span className="text-xs text-slate-400 block">
                                                Official Email
                                            </span>
                                            <a
                                                href={`mailto:${officialEmail}`}
                                                className="text-xs sm:text-sm font-semibold text-white hover:text-slate-200 transition-colors block truncate"
                                            >
                                                {officialEmail}
                                            </a>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(officialEmail, 'hq-email')}
                                            className="w-8 h-8 rounded-lg bg-[#131E33] border border-[#2C3F63] hover:border-slate-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                            title="Copy email"
                                        >
                                            {copiedKey === 'hq-email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>

                                    {/* Phone / Hotline */}
                                    <div className="p-4 rounded-2xl bg-[#0B1424] border border-[#202E4A] flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <span className="text-xs text-slate-400 block">
                                                Secretariat Hotline
                                            </span>
                                            <a
                                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                                className="text-xs sm:text-sm font-semibold text-white hover:text-slate-200 transition-colors block truncate"
                                            >
                                                {phone}
                                            </a>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(phone, 'hq-phone')}
                                            className="w-8 h-8 rounded-lg bg-[#131E33] border border-[#2C3F63] hover:border-slate-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                            title="Copy phone"
                                        >
                                            {copiedKey === 'hq-phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Social Channels Row */}
                                {socialChannels.length > 0 && (
                                    <div className="space-y-2 pt-1">
                                        <span className="text-xs text-slate-400 block">
                                            Official Social Media
                                        </span>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {socialChannels.map((channel) => (
                                                <a
                                                    key={channel.name}
                                                    href={channel.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 rounded-lg bg-[#0B1424] border border-[#202E4A] hover:border-slate-400 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                                                >
                                                    <span>{channel.name}</span>
                                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Direct Inquiry Link */}
                            <div className="pt-4 border-t border-[#202E4A]">
                                <Link
                                    href="/get-involved"
                                    className="p-4 sm:p-5 rounded-2xl bg-[#0B1424] border border-[#202E4A] hover:border-slate-400 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center shrink-0">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="text-sm sm:text-base font-bold text-white truncate">
                                                Submit Sanctioning or Partnership Proposal
                                            </div>
                                            <div className="text-xs text-slate-400 truncate">
                                                Contact the secretariat desk directly
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Card: Location & Map (5 cols) */}
                        <div className="lg:col-span-5 rounded-3xl bg-[#131E33] border border-[#2C3F63] overflow-hidden flex flex-col justify-between">
                            <div className="p-6 sm:p-7 space-y-2">
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <div className="flex items-center gap-1.5 text-white font-medium">
                                        <MapPin className="w-4 h-4 text-slate-300" />
                                        <span>Bukit Jalil, Kuala Lumpur</span>
                                    </div>
                                    <span>3.0560° N, 101.6917° E</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    {fullAddress}
                                </p>
                            </div>

                            {/* Embedded Map */}
                            {mapSrc && (
                                <div className="w-full h-56 sm:h-64 border-t border-[#202E4A] bg-[#070B14] relative overflow-hidden">
                                    <iframe
                                        title="MESF Secretariat Location"
                                        src={mapSrc}
                                        className="w-full h-full border-0 filter grayscale contrast-125 opacity-75 hover:filter-none hover:opacity-100 transition-all duration-500"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            )}

                            {/* Directions Button Footer */}
                            <div className="p-4 bg-[#0B1424] border-t border-[#202E4A] flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                    Kompleks Sukan Negara
                                </span>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-lg bg-[#131E33] border border-[#2C3F63] text-xs font-semibold text-white hover:border-slate-400 transition-colors flex items-center gap-1.5"
                                >
                                    <span>Open In Maps</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}