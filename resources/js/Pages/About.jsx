// --1. imports--
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Search,
    X,
    Check,
    ExternalLink,
    Copy,
    Clock,
    Globe,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

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

// Brand Icons for Official Digital Channels
const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const TikTokIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.89c.35 0 .69.06 1 .17V9.45a6.34 6.34 0 0 0-1-.08 6.34 6.34 0 1 0 6.34 6.34V9.06a8.21 8.21 0 0 0 4.76 1.5V7.1a4.83 4.83 0 0 1-1-.41z"/>
    </svg>
);

const YouTubeIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

const XIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const renderChannelIcon = (type) => {
    switch (type) {
        case 'instagram':
            return <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />;
        case 'tiktok':
            return <TikTokIcon className="w-3.5 h-3.5 text-cyan-300" />;
        case 'youtube':
            return <YouTubeIcon className="w-3.5 h-3.5 text-red-400" />;
        case 'x':
            return <XIcon className="w-3.5 h-3.5 text-white" />;
        case 'facebook':
            return <FacebookIcon className="w-3.5 h-3.5 text-blue-400" />;
        case 'iesf':
        default:
            return <Globe className="w-3.5 h-3.5 text-sky-400" />;
    }
};

// --3. main component--
export default function About() {
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const orgName = settings?.orgName || 'Malaysia Esports Federation'; // properties
    const orgAcronym = settings?.orgAcronym || 'MESF'; // properties
    const rosNumber = settings?.rosNumber || '7402/2014'; // properties
    const phone = settings?.phone || '+60 3-8994 4800'; // properties
    const officialEmail = settings?.replyEmail || settings?.supportEmail || 'secretariat@mesf.my'; // properties
    const streetAddress = settings?.streetAddress || 'National Sports Council Complex, Bukit Jalil'; // properties
    const city = settings?.city || 'Kuala Lumpur'; // properties
    const state = settings?.state || 'Wilayah Persekutuan'; // properties
    const postalCode = settings?.postalCode || '57000'; // properties
    const country = settings?.country || 'Malaysia'; // properties
    const googleMapEmbed = settings?.googleMapEmbed || settings?.contact_map_url || ''; // properties
    const aboutHeroSubtitle = settings?.aboutHeroSubtitle || 'Official national governing body registered under the Sports Development Act 1997, overseeing electronic sports across Malaysia.'; // properties
    const aboutStoryHtml = settings?.aboutStoryHtml || (settings?.aboutStoryP1 ? `<p>${settings.aboutStoryP1}</p><p>${settings.aboutStoryP2 || ''}</p><p>${settings.aboutStoryP3 || ''}</p>` : ''); // properties

    const fullAddress = useMemo(() => {
        return streetAddress ? `${streetAddress}, ${postalCode ? `${postalCode} ` : ''}${city ? `${city}, ` : ''}${state ? `${state}, ` : ''}${country}` : 'National Sports Council Complex, Bukit Jalil, 57000 Kuala Lumpur, Malaysia';
    }, [streetAddress, postalCode, city, state, country]);

    const mapSrc = useMemo(() => {
        const parsed = getEmbedMapSrc(googleMapEmbed);
        if (parsed) return parsed;
        if (streetAddress || city) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        return 'https://maps.google.com/maps?q=National+Stadium+Bukit+Jalil,+Kuala+Lumpur&t=&z=15&ie=UTF8&iwloc=&output=embed';
    }, [googleMapEmbed, streetAddress, city, fullAddress]);

    const googleMapsUrl = useMemo(() => {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    }, [fullAddress]);

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
        const ig = settings?.instagram || 'https://instagram.com/esportsmalaysia';
        const tt = settings?.tiktok || 'https://tiktok.com/@mesf.my';
        const yt = settings?.youtube || 'https://youtube.com/@esportsmalaysia';
        const x = settings?.xUrl || settings?.twitter || 'https://x.com/mesf_my';
        const fb = settings?.facebook || 'https://facebook.com/esportsmalaysia';
        const iesf = settings?.iesfUrl || 'https://iesf.org';

        if (ig) channels.push({ name: 'Instagram', handle: settings?.instagramHandle || '@esportsmalaysia', href: ig, type: 'instagram' });
        if (tt) channels.push({ name: 'TikTok', handle: settings?.tiktokHandle || '@mesf.my', href: tt, type: 'tiktok' });
        if (yt) channels.push({ name: 'YouTube', handle: settings?.youtubeHandle || '@esportsmalaysia', href: yt, type: 'youtube' });
        if (x) channels.push({ name: 'X / Twitter', handle: settings?.xHandle || '@mesf_my', href: x, type: 'x' });
        if (fb) channels.push({ name: 'Facebook', handle: settings?.facebookHandle || 'MESF Official', href: fb, type: 'facebook' });
        if (iesf) channels.push({ name: 'IeSF Global', handle: 'Accredited Member', href: iesf, type: 'iesf' });
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
    const filteredExecutiveSections = useMemo(() => { // filter
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
    const filteredGeneralCommittee = useMemo(() => { // filter
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
    const leadershipMembers = useMemo(() => { // filter
        const leadershipSec = filteredExecutiveSections.find((s) => s.id === 'leadership');
        return leadershipSec?.members || [];
    }, [filteredExecutiveSections]);

    const vpMembers = useMemo(() => { // filter
        const vpSec = filteredExecutiveSections.find((s) => s.id === 'vice_presidents');
        return vpSec?.members || [];
    }, [filteredExecutiveSections]);

    const secretariatMembers = useMemo(() => { // filter
        const secSec = filteredExecutiveSections.find((s) => s.id === 'secretariat');
        return secSec?.members || [];
    }, [filteredExecutiveSections]);

    // Counts for directory filter tabs
    const totalMembersCount = useMemo(() => {
        const execCount = executiveSections.reduce((acc, sec) => acc + (sec.members?.length || 0), 0);
        return execCount + generalCommittee.length;
    }, [executiveSections, generalCommittee]);

    const filterCategories = [
        { id: 'all', label: 'All Members', count: totalMembersCount },
        { id: 'leadership', label: 'Executive Leadership', count: executiveSections.find(s => s.id === 'leadership')?.members?.length || 0 },
        { id: 'vice_presidents', label: 'Vice Presidents', count: executiveSections.find(s => s.id === 'vice_presidents')?.members?.length || 0 },
        { id: 'secretariat', label: 'Secretariat', count: executiveSections.find(s => s.id === 'secretariat')?.members?.length || 0 },
        { id: 'general', label: 'General Committee', count: generalCommittee.length }
    ];

    // All members across executive sections and general committee
    const allMembers = useMemo(() => { // convert
        const exec = executiveSections.flatMap((s) => s.members || []);
        return [...exec, ...generalCommittee];
    }, [executiveSections, generalCommittee]);

    // Active filtered member roster
    const activeMemberList = useMemo(() => { // filter
        let list = [];
        if (activeCategory === 'all') {
            const exec = filteredExecutiveSections.flatMap((s) => s.members || []);
            list = [...exec, ...filteredGeneralCommittee];
        } else if (activeCategory === 'leadership') {
            list = leadershipMembers;
        } else if (activeCategory === 'vice_presidents') {
            list = vpMembers;
        } else if (activeCategory === 'secretariat') {
            list = secretariatMembers;
        } else if (activeCategory === 'general') {
            list = filteredGeneralCommittee;
        }
        return list;
    }, [activeCategory, filteredExecutiveSections, filteredGeneralCommittee, leadershipMembers, vpMembers, secretariatMembers]);

    // Member directory selection state & actions
    const [selectedIndex, setSelectedIndex] = useState(0); // state
    const cardRefs = useRef([]); // ref

    useEffect(() => {
        setSelectedIndex(0); // state
    }, [activeCategory, memberSearch]);

    const activeIndex = activeMemberList.length > 0
        ? Math.min(Math.max(selectedIndex, 0), activeMemberList.length - 1)
        : 0; // check
    const currentMember = activeMemberList[activeIndex] || null; // properties

    const handlePrevMember = () => { // action
        if (activeMemberList.length === 0) return;
        setSelectedIndex((prev) => (prev - 1 + activeMemberList.length) % activeMemberList.length);
    };

    const handleNextMember = () => { // action
        if (activeMemberList.length === 0) return;
        setSelectedIndex((prev) => (prev + 1) % activeMemberList.length);
    };

    useEffect(() => {
        if (cardRefs.current[activeIndex]) {
            cardRefs.current[activeIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }, [activeIndex]);

    // Custom bean scrollbar state & handlers
    const scrollContainerRef = useRef(null); // ref
    const [scrollMetrics, setScrollMetrics] = useState({ thumbHeight: 48, thumbTop: 0, canScroll: false }); // state
    const isDraggingRef = useRef(false); // ref
    const startYRef = useRef(0); // ref
    const startScrollTopRef = useRef(0); // ref

    const updateScrollMetrics = useCallback(() => { // trigger
        const el = scrollContainerRef.current;
        if (!el) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollHeight <= clientHeight + 4) {
            setScrollMetrics({ thumbHeight: clientHeight, thumbTop: 0, canScroll: false });
            return;
        }
        const visibleRatio = clientHeight / scrollHeight;
        const thumbH = Math.max(clientHeight * visibleRatio, 36);
        const maxScroll = scrollHeight - clientHeight;
        const maxThumb = clientHeight - thumbH;
        const topRatio = maxScroll > 0 ? scrollTop / maxScroll : 0;
        const thumbT = Math.min(Math.max(topRatio * maxThumb, 0), maxThumb);

        setScrollMetrics({
            thumbHeight: thumbH,
            thumbTop: thumbT,
            canScroll: true
        });
    }, []);

    const handleContainerScroll = () => { // trigger
        updateScrollMetrics();
    };

    const handleTrackClick = (e) => { // action
        const el = scrollContainerRef.current;
        if (!el) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const ratio = Math.max(0, Math.min(1, clickY / rect.height));
        const targetScroll = ratio * (el.scrollHeight - el.clientHeight);
        el.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    const handleThumbPointerDown = (e) => { // trigger
        e.preventDefault();
        e.stopPropagation();
        isDraggingRef.current = true;
        startYRef.current = e.clientY;
        startScrollTopRef.current = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handlePointerMove = (e) => { // action
        if (!isDraggingRef.current || !scrollContainerRef.current) return;
        const el = scrollContainerRef.current;
        const deltaY = e.clientY - startYRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const maxThumb = el.clientHeight - scrollMetrics.thumbHeight;
        if (maxThumb > 0) {
            const scrollDelta = (deltaY / maxThumb) * maxScroll;
            el.scrollTop = startScrollTopRef.current + scrollDelta;
        }
    };

    const handlePointerUp = () => { // action
        isDraggingRef.current = false;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
    };

    useEffect(() => { // trigger
        updateScrollMetrics();
        const el = scrollContainerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(() => updateScrollMetrics());
        observer.observe(el);
        return () => {
            observer.disconnect();
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [activeMemberList, updateScrollMetrics]);

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#060A14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden antialiased">
            <Head title="About Us - Malaysia Esports Federation | MESF" />

            {/* Ambient Background Glows matching Homepage theme */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-blue-600/10 blur-[150px]" />
            <div className="pointer-events-none absolute top-[35%] right-10 h-[500px] w-[500px] rounded-full bg-slate-600/10 blur-[160px]" />
            <div className="pointer-events-none absolute top-[70%] left-10 h-[450px] w-[450px] rounded-full bg-amber-500/5 blur-[150px]" />

            {/* Fixed Subtle Grain Overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Floating Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="about" />
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 pt-32 md:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 sm:space-y-28 lg:space-y-32">

                {/* Section 1: Hero Header */}
                <section className="relative text-center max-w-3xl mx-auto space-y-4 pt-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 text-xs font-semibold tracking-wider uppercase">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        National Esports Federation{rosNumber ? ` • Reg: ${rosNumber}` : ''}
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
                        About {orgAcronym}
                    </h1>

                    {aboutHeroSubtitle && (
                        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                            {aboutHeroSubtitle}
                        </p>
                    )}
                </section>

                {/* Section 2: About Us (Official Governance Overview) */}
                <section className="relative rounded-3xl p-7 sm:p-10 lg:p-14 bg-[#090d18] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden">
                    <div className="pointer-events-none absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-8 space-y-5">
                            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-neutral-400 block">
                                Federation Governance
                            </span>

                            <div
                                className="about-story-rich-text text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal"
                                dangerouslySetInnerHTML={{ __html: aboutStoryHtml }}
                            />
                        </div>

                        {/* Emblem showcase card */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center p-7 sm:p-8 rounded-2xl bg-[#060913] border border-white/10 text-center space-y-4 shadow-xl">
                            <img
                                src={logoUrl}
                                alt={`${orgAcronym} Emblem`}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/images/mesf_logo.png';
                                }}
                                className="h-24 w-24 object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.25)]"
                            />
                            <div className="space-y-1">
                                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase">
                                    {orgName}
                                </h2>
                                {rosNumber && (
                                    <p className="text-xs text-neutral-400 font-mono">
                                        Reg. No: {rosNumber}
                                    </p>
                                )}
                            </div>
                            <div className="pt-3 border-t border-white/10 w-full flex items-center justify-center gap-5 text-xs text-neutral-400 font-mono font-medium">
                                <span>IeSF Member</span>
                                <span>•</span>
                                <span>AESF Member</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Institutional Partners & Affiliations */}
                <section className="py-2 sm:py-4 space-y-6">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wider">
                            Government &amp; International Affiliates
                        </h2>
                    </div>

                    {/* Single-line prominent floating monochrome logo rail */}
                    <div className="w-full overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] py-2">
                        <div className="grid grid-cols-6 items-center gap-8 sm:gap-12 min-w-[700px] max-w-5xl mx-auto px-4">
                            {AFFILIATED_PARTNERS.map((partner) => (
                                <div
                                    key={partner.name}
                                    className="group h-14 sm:h-16 flex items-center justify-center p-1 cursor-pointer"
                                    title={partner.name}
                                >
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="h-9 sm:h-11 max-h-12 max-w-full object-contain filter grayscale contrast-125 brightness-125 opacity-60 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:opacity-100 hover:grayscale-0 hover:contrast-100 hover:brightness-100 hover:opacity-100 transition-all duration-300 select-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 4: Committee Members (Clean, Organized Executive Desk) */}
                <section id="committee" className="space-y-5 scroll-mt-36">
                    {/* Header: Title + Normal Term Text (Left) & Search (Right) */}
                    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-baseline gap-2.5">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                                Committee Members
                            </h2>
                            <span className="text-sm sm:text-base font-normal text-neutral-400">
                                (2024–2027)
                            </span>
                        </div>

                        {/* Minimalist Search Input */}
                        <div className="relative shrink-0 w-full md:w-72">
                            <input
                                type="text"
                                value={memberSearch}
                                onChange={(e) => setMemberSearch(e.target.value)}
                                placeholder="Search by name, role or title..."
                                className="w-full px-3.5 py-2 pl-9 pr-9 rounded-xl text-xs font-medium bg-[#090d18] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 shadow-sm"
                            />
                            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                            {memberSearch && (
                                <button
                                    type="button"
                                    onClick={() => setMemberSearch('')}
                                    className="absolute right-2.5 top-2 text-neutral-400 p-0.5 rounded-full cursor-pointer"
                                    aria-label="Clear search"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                        {filterCategories.map((tab) => {
                            const isActive = activeCategory === tab.id && !memberSearch;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(tab.id);
                                        if (memberSearch) setMemberSearch('');
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                                        isActive
                                            ? 'bg-white text-slate-950 border-white shadow-md'
                                            : 'bg-[#090d18] text-neutral-400 border-white/10'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                        isActive ? 'bg-black/10 text-slate-900' : 'bg-white/5 text-neutral-400'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Clean Organized Executive Board (Sized for 4 lines of boxes with bean scrollbar) */}
                    {activeMemberList.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
                            {/* Left Column: Spotlight Executive Profile Card (5 cols) */}
                            {currentMember && (
                                <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl p-4 sm:p-5 bg-[#090d18] border border-white/10 shadow-lg relative overflow-hidden h-[296px]">
                                    {/* Top Navigation Strip with Counter & Controls Placed Together */}
                                    <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                                        <div className="text-xs font-mono text-neutral-400">
                                            <span className="text-white font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
                                            <span className="mx-1 text-neutral-600">/</span>
                                            <span>{String(activeMemberList.length).padStart(2, '0')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={handlePrevMember}
                                                aria-label="Previous Committee Member"
                                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
                                                title="Previous Member"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextMember}
                                                aria-label="Next Committee Member"
                                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-neutral-300 flex items-center justify-center cursor-pointer"
                                                title="Next Member"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Center Member Identity (Clean Title & Typography, No Tag Styles) */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                                            {currentMember.avatar || currentMember.image ? (
                                                <img
                                                    src={currentMember.avatar || currentMember.image}
                                                    alt={currentMember.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-neutral-400" />
                                            )}
                                        </div>
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block font-semibold truncate">
                                                {currentMember.title}
                                            </span>
                                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                                                {currentMember.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Direct Contact Details (Clean, Legible Links) */}
                                    <div className="pt-2.5 border-t border-white/10 space-y-1.5">
                                        {currentMember.contact && (
                                            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                    <a href={`mailto:${currentMember.contact}`} className="text-neutral-200 truncate">
                                                        {currentMember.contact}
                                                    </a>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(currentMember.contact, `${currentMember.id}-email`)}
                                                    className="text-neutral-400 p-1 cursor-pointer shrink-0"
                                                    title="Copy email"
                                                >
                                                    {copiedKey === `${currentMember.id}-email` ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                        {currentMember.phone && (
                                            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                    <a href={`tel:${currentMember.phone.replace(/\s+/g, '')}`} className="text-neutral-200 truncate">
                                                        {currentMember.phone}
                                                    </a>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(currentMember.phone, `${currentMember.id}-phone`)}
                                                    className="text-neutral-400 p-1 cursor-pointer shrink-0"
                                                    title="Copy phone"
                                                >
                                                    {copiedKey === `${currentMember.id}-phone` ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Right Column: Member Directory Roster Grid (7 cols, sized for 4 lines of boxes with bean scrollbar) */}
                            <div className="lg:col-span-7 flex h-[296px] items-stretch gap-3">
                                {/* Scrollable Directory Cards Container */}
                                <div
                                    ref={scrollContainerRef}
                                    onScroll={handleContainerScroll}
                                    className="flex-1 min-w-0 h-full overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 content-start">
                                        {activeMemberList.map((member, idx) => {
                                            const isSelected = idx === activeIndex;

                                            return (
                                                <div
                                                    key={member.id}
                                                    ref={(el) => (cardRefs.current[idx] = el)}
                                                    onClick={() => setSelectedIndex(idx)}
                                                    className={`h-[66px] p-2.5 rounded-xl border cursor-pointer text-left flex items-center gap-2.5 shrink-0 ${
                                                        isSelected
                                                            ? 'bg-white/[0.08] border-white/30 ring-1 ring-white/20'
                                                            : 'bg-[#090d18] border-white/10'
                                                    }`}
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {member.avatar || member.image ? (
                                                            <img
                                                                src={member.avatar || member.image}
                                                                alt={member.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-4 h-4 text-neutral-400" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block truncate">
                                                            {member.title}
                                                        </span>
                                                        <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5" title={member.name}>
                                                            {member.name}
                                                        </h4>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Dedicated Minimalist Bean Scrollbar (Stays permanently visible on screen, positioned on the right) */}
                                {scrollMetrics.canScroll && (
                                    <div className="w-1.5 flex flex-col py-1 shrink-0 select-none">
                                        <div
                                            onClick={handleTrackClick}
                                            className="w-1.5 h-full bg-white/[0.06] rounded-full relative cursor-pointer"
                                            title="Directory scrollbar"
                                        >
                                            <div
                                                onPointerDown={handleThumbPointerDown}
                                                className="w-full bg-white/35 rounded-full absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                                                style={{
                                                    height: `${scrollMetrics.thumbHeight}px`,
                                                    transform: `translateY(${scrollMetrics.thumbTop}px)`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Empty search state */
                        <div className="py-12 text-center rounded-2xl bg-[#090d18] border border-white/10 space-y-3 max-w-lg mx-auto p-6 shadow-xl">
                            <Search className="w-7 h-7 text-neutral-500 mx-auto" />
                            <h3 className="text-sm font-bold text-white uppercase">No committee members found</h3>
                            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                                No records matched your search query "{memberSearch}".
                            </p>
                            <button
                                type="button"
                                onClick={() => setMemberSearch('')}
                                className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white cursor-pointer"
                            >
                                Clear search filter
                            </button>
                        </div>
                    )}
                </section>

                {/* Section 5: Headquarters & Contact Us (Clean, organized, executive desk) */}
                <section id="contact" className="space-y-4 scroll-mt-36">
                    {/* Clean Header */}
                    <div className="flex items-center justify-between pb-1">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                            Headquarters &amp; Contact
                        </h2>
                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                            Bukit Jalil, KL
                        </span>
                    </div>

                    {/* Main Split Grid: Executive Secretariat Desk (Left) & Framed Interactive Map (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
                        {/* Left Column: Executive Secretariat Desk (6 cols) */}
                        <div className="lg:col-span-6 rounded-2xl p-5 sm:p-6 bg-[#090d18] border border-white/10 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden">
                            {/* Subtle ambient lighting accent at the top-left */}
                            <div className="pointer-events-none absolute -top-16 -left-16 w-44 h-44 rounded-full bg-blue-500/10 blur-3xl" />

                            {/* 1. Header: Organization Identity with Official MESF Emblem */}
                            <div className="relative flex items-start gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 p-2 flex items-center justify-center shrink-0 shadow-inner">
                                    <img
                                        src={logoUrl}
                                        alt={orgAcronym}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="space-y-1 min-w-0 flex-1">
                                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                                        {orgName}
                                    </h3>
                                    <p className="text-xs text-neutral-300 leading-relaxed">
                                        {fullAddress}
                                    </p>
                                </div>
                            </div>

                            {/* 2. Direct Communications Desk (Email & Hotline Cards) */}
                            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Email Desk */}
                                {officialEmail && (
                                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-neutral-200 flex items-center justify-center shrink-0">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(officialEmail, 'hq-email')}
                                                className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 flex items-center gap-1 cursor-pointer"
                                                title="Copy email"
                                            >
                                                {copiedKey === 'hq-email' ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                        <span className="text-emerald-400 font-semibold">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                                                Official Secretariat Email
                                            </span>
                                            <a
                                                href={`mailto:${officialEmail}`}
                                                className="text-xs sm:text-sm font-bold text-white block truncate mt-0.5"
                                                title={officialEmail}
                                            >
                                                {officialEmail}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Hotline Desk */}
                                {phone && (
                                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-neutral-200 flex items-center justify-center shrink-0">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(phone, 'hq-phone')}
                                                className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 flex items-center gap-1 cursor-pointer"
                                                title="Copy phone"
                                            >
                                                {copiedKey === 'hq-phone' ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                        <span className="text-emerald-400 font-semibold">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 text-neutral-400" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                                                Secretariat Hotline
                                            </span>
                                            <a
                                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                                className="text-xs sm:text-sm font-bold text-white block truncate mt-0.5"
                                                title={phone}
                                            >
                                                {phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 3. Operating Hours Strip */}
                            <div className="relative p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block">
                                            Operating Schedule
                                        </span>
                                        <span className="text-xs font-medium text-white truncate block">
                                            Monday – Friday, 09:00 – 18:00 (MYT)
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>Open Weekdays</span>
                                </div>
                            </div>

                            {/* 4. Official Digital Channels Interactive Media Grid */}
                            {socialChannels.length > 0 && (
                                <div className="relative pt-3.5 border-t border-white/10 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                                            Official Digital Channels
                                        </span>
                                        <span className="text-[10px] font-mono text-neutral-500">
                                            {socialChannels.length} Official Feeds
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {socialChannels.map((channel) => (
                                            <a
                                                key={channel.name}
                                                href={channel.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                        {renderChannelIcon(channel.type)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-xs font-bold text-white block truncate">
                                                            {channel.name}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-neutral-400 block truncate">
                                                            {channel.handle}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Framed Interactive Secretariat Map (6 cols) */}
                        <div className="lg:col-span-6 rounded-2xl bg-[#090d18] border border-white/10 shadow-lg flex flex-col justify-between overflow-hidden">
                            {/* Map Header Strip */}
                            <div className="p-4 sm:p-5 pb-3 border-b border-white/10 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                    Bukit Jalil, Kuala Lumpur
                                </h4>
                            </div>

                            {/* Interactive Map Iframe */}
                            <div className="relative flex-1 min-h-[280px] w-full bg-[#060913]">
                                {mapSrc ? (
                                    <iframe
                                        title="MESF Secretariat Location"
                                        src={mapSrc}
                                        className="w-full h-full min-h-[280px] border-0 filter grayscale contrast-125 opacity-85"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <div className="w-full h-full min-h-[280px] flex items-center justify-center text-xs text-neutral-500 font-mono">
                                        Map preview unavailable
                                    </div>
                                )}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090d18] via-transparent to-transparent opacity-40" />
                            </div>

                            {/* Map Footer Bar with Sleek Premium Yellow Directions Action */}
                            <div className="p-4 sm:p-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3 bg-[#090d18]">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                                    <MapPin className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                                    <span>Bukit Jalil, Kuala Lumpur</span>
                                </div>
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(251,191,36,0.3)] flex items-center gap-1.5 cursor-pointer border border-amber-300/40"
                                >
                                    <span>Get Directions</span>
                                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Official Modern Footer */}
            <Footer />
        </div>
    );
}
