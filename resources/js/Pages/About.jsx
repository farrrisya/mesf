// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useMemo, useEffect } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

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

// Exact committee structure from mesf.my with natural lighter-to-darker hierarchy
const EXECUTIVE_SECTIONS = [
    {
        id: 'leadership',
        sectionTitle: 'Executive Leadership',
        gridCols: 'grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto',
        cardBg: 'bg-[#222A3A]',
        borderColor: 'border-slate-600/50',
        badgeClass: 'bg-amber-400/20 border-amber-400/40 text-amber-300 font-bold',
        members: [
            {
                id: 'naim',
                name: 'Muhammad Naim Al-Amin',
                title: 'President',
                contact: 'naim@mesf.my'
            },
            {
                id: 'afiq',
                name: 'Afiq Fadhli',
                title: 'Deputy President',
                contact: 'afiq@mesf.my'
            }
        ]
    },
    {
        id: 'vice_presidents',
        sectionTitle: 'Vice Presidents',
        gridCols: 'grid-cols-1 md:grid-cols-2 gap-5',
        cardBg: 'bg-[#1C2332]',
        borderColor: 'border-slate-700/50',
        badgeClass: 'bg-amber-400/10 border-amber-400/25 text-amber-300 font-semibold',
        members: [
            {
                id: 'khir',
                name: 'Mohamad Khir',
                title: 'Vice President 1',
                contact: 'khir@mesf.my'
            },
            {
                id: 'faries',
                name: 'Faries Faizal',
                title: 'Vice President 2',
                contact: 'faries@mesf.my'
            },
            {
                id: 'zatul',
                name: 'Dr. Zatul Iffah',
                title: 'Vice President Women',
                contact: 'drzatul@mesf.my'
            },
            {
                id: 'muzakkir',
                name: 'Muzakkir',
                title: 'Vice President Youth',
                contact: 'muzakkir@mesf.my'
            }
        ]
    },
    {
        id: 'secretariat',
        sectionTitle: 'Secretariat & Administration',
        gridCols: 'grid-cols-1 md:grid-cols-2 gap-5',
        cardBg: 'bg-[#161D2A]',
        borderColor: 'border-slate-700/40',
        badgeClass: 'bg-slate-700/50 border-slate-600/50 text-slate-200 font-medium',
        members: [
            {
                id: 'syed',
                name: 'Syed Fakrurrozi',
                title: 'Secretary General',
                contact: 'syed@mesf.my'
            },
            {
                id: 'hakimi',
                name: 'Alif Hakimi',
                title: 'Asst. Secretary General',
                contact: 'hakimi@mesf.my'
            },
            {
                id: 'shahrul',
                name: 'Shahrul Nizam',
                title: 'Treasurer',
                contact: 'shahrul@mesf.my'
            },
            {
                id: 'azrai',
                name: 'Azrai Abdul Aziz',
                title: 'Chief Communication',
                contact: 'azrai@mesf.my'
            }
        ]
    }
];

const GENERAL_COMMITTEE_MEMBERS = [
    { id: 'adib', name: 'Adib', title: 'Committee', contact: 'adib@mesf.my' },
    { id: 'akbar', name: 'Akbar', title: 'Committee', contact: 'akbar@mesf.my' },
    { id: 'akif', name: 'Akif', title: 'Committee', contact: 'contact@mesf.my' },
    { id: 'alex', name: 'Alex', title: 'Committee', contact: 'alex@mesf.my' },
    { id: 'azza', name: 'Azza', title: 'Committee', contact: 'azzarizal@mesf.my' },
    { id: 'chucky', name: 'Chucky', title: 'Committee', contact: 'cheoh@mesf.my' },
    { id: 'dr-yew', name: 'Dr. Yew', title: 'Committee', contact: 'dryew@mesf.my' },
    { id: 'eugene', name: 'Eugene', title: 'Committee', contact: 'eugene@mesf.my' },
    { id: 'husyin', name: 'Husyin', title: 'Committee', contact: 'husyin@mesf.my' },
    { id: 'joker', name: 'Joker', title: 'Committee', contact: 'jokerlai@mesf.my' },
    { id: 'kymie', name: 'Kymie', title: 'Committee', contact: 'kymie@mesf.my' },
    { id: 'luqman', name: 'Luqman', title: 'Committee', contact: 'luqman@mesf.my' },
    { id: 'razak', name: 'Razak', title: 'Committee', contact: 'razak@mesf.my' },
    { id: 'shahril', name: 'Shahril', title: 'Committee', contact: 'shahril@mesf.my' },
    { id: 'syahrul', name: 'Syahrul', title: 'Committee', contact: 'syahrul@mesf.my' },
    { id: 'thariq', name: 'Thariq', title: 'Committee', contact: 'thariq@mesf.my' }
];

const DEFAULT_ABOUT_STORY = `<p>Malaysia Esports Federation or MESF is a national-level sports association registered with the Malaysian Sports Commissioner under the Sports Development Act 1997 with registration number 7402/2014 and is an affiliate of the International Esports Federation (IeSF) &amp; the Asian Electronic Sports Federation (AESF).</p><p>MESF had its registration confirmed on 4th December 2014 to respond to the government’s call through the Ministry of Youth and Sports (KBS) to make sports a catalyst for the development of human capital and industry that can generate the nation’s economic growth.</p><p>MESF acts as the custodian of all esports related activities in Malaysia with the aim of developing, encouraging and promoting esports to all levels as well as planning the development of athletes, officials, coaches and unearthing new talents to represent Malaysia in any esports competition at the international level.</p>`;

// Helper to get initials for badge avatars
const getMemberInitials = (name) => {
    if (!name || typeof name !== 'string') return 'ME';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper to parse JSON settings
const parseJsonSetting = (raw, fallback) => {
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
    const aboutHeroSubtitle = settings?.aboutHeroSubtitle || 'Official national governing body registered under the Sports Development Act 1997, overseeing electronic sports across Malaysia.'; // properties
    const aboutStoryHtml = settings?.aboutStoryHtml || (settings?.aboutStoryP1 ? `<p>${settings.aboutStoryP1}</p><p>${settings.aboutStoryP2 || ''}</p><p>${settings.aboutStoryP3 || ''}</p>` : DEFAULT_ABOUT_STORY); // properties

    const executiveSections = useMemo(() => {
        const raw = parseJsonSetting(settings?.executiveSections, EXECUTIVE_SECTIONS);
        if (!Array.isArray(raw)) return EXECUTIVE_SECTIONS;
        return raw.map((section, idx) => ({
            ...(EXECUTIVE_SECTIONS[idx] || {}),
            ...(section || {}),
            members: Array.isArray(section?.members)
                ? section.members
                : (EXECUTIVE_SECTIONS[idx]?.members || [])
        }));
    }, [settings?.executiveSections]);

    const generalCommittee = useMemo(() => {
        const raw = parseJsonSetting(settings?.generalCommittee, GENERAL_COMMITTEE_MEMBERS);
        return Array.isArray(raw) ? raw : GENERAL_COMMITTEE_MEMBERS;
    }, [settings?.generalCommittee]);

    // --4. actions--
    const [memberSearch, setMemberSearch] = useState(''); // state
    const [scrollProgress, setScrollProgress] = useState(0); // progress
    const [canScrollLeft, setCanScrollLeft] = useState(false); // state
    const [canScrollRight, setCanScrollRight] = useState(true); // state
    const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false); // state
    const [isDragging, setIsDragging] = useState(false); // state
    const [dragStartX, setDragStartX] = useState(0); // state
    const [dragScrollLeft, setDragScrollLeft] = useState(0); // state
    const carouselRef = useRef(null); // ref

    const updateCarouselScrollStatus = () => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        setCanScrollLeft(scrollLeft > 10); // check
        setCanScrollRight(scrollLeft < maxScroll - 10); // check
        if (maxScroll > 0) {
            setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll))); // progress
        }
    };

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        const scrollAmount = direction === 'left' ? -300 : 300;
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' }); // scroll
    };

    // Auto scroll functionality with gentle, continuous advancement
    useEffect(() => {
        if (isAutoScrollPaused || memberSearch.trim() !== '') return;

        const autoScrollInterval = setInterval(() => {
            if (!carouselRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            const maxScroll = scrollWidth - clientWidth;
            if (scrollLeft >= maxScroll - 10) {
                carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' }); // scroll
            } else {
                carouselRef.current.scrollBy({ left: 280, behavior: 'smooth' }); // scroll
            }
        }, 3600);

        return () => clearInterval(autoScrollInterval);
    }, [isAutoScrollPaused, memberSearch]);

    // Mouse drag scrolling handlers
    const handleMouseDown = (e) => {
        if (!carouselRef.current) return;
        setIsDragging(true); // state
        setIsAutoScrollPaused(true); // state
        setDragStartX(e.pageX - carouselRef.current.offsetLeft); // state
        setDragScrollLeft(carouselRef.current.scrollLeft); // state
    };

    const handleMouseUp = () => {
        setIsDragging(false); // state
        updateCarouselScrollStatus(); // trigger
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - dragStartX) * 1.2;
        carouselRef.current.scrollLeft = dragScrollLeft - walk; // scroll
        updateCarouselScrollStatus(); // trigger
    };

    // Attach global mouseup to safely release drag outside container
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false); // state
                updateCarouselScrollStatus(); // trigger
            }
        };

        const handleGlobalMouseMove = (e) => {
            if (isDragging && carouselRef.current) {
                e.preventDefault();
                const x = e.pageX - carouselRef.current.offsetLeft;
                const walk = (x - dragStartX) * 1.2;
                carouselRef.current.scrollLeft = dragScrollLeft - walk; // scroll
                updateCarouselScrollStatus(); // trigger
            }
        };

        if (isDragging) {
            window.addEventListener('mouseup', handleGlobalMouseUp);
            window.addEventListener('mousemove', handleGlobalMouseMove);
        }

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [isDragging, dragStartX, dragScrollLeft]);

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
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .active-drag {
                    cursor: grabbing !important;
                    user-select: none;
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

                {/* Section 4: Committee Members 2024 - 2027 (Approach 4: Executives + Swipeable Carousel for Committee) */}
                <section id="committee" className="space-y-10 scroll-mt-32">
                    {/* Section 4: Header & Search (High Contrast & Ambient Glow) */}
                    <div className="relative pb-6 border-b border-white/10">
                        {/* Soft Ambient Radial Backlight */}
                        <div className="pointer-events-none absolute -top-10 -left-10 h-44 w-72 rounded-full bg-amber-400/[0.08] blur-[80px]" />

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <div className="space-y-2">
                                {/* Section Eyebrow Label */}
                                <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                                    Council Session &bull; 2024 – 2027
                                </div>

                                {/* Main Title with Dual-Tone Gradient */}
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

                            {/* Crisp Search Input */}
                            <div className="relative shrink-0">
                                <input
                                    type="text"
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    placeholder="Search member, title or email..."
                                    className="w-full sm:w-72 px-4 py-2.5 pl-10 rounded-full text-xs font-medium bg-[#0B111D] border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 shadow-inner transition-all"
                                />
                                <svg
                                    className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Executive Council Rows */}
                    <div className="space-y-10">
                        {filteredExecSections.map((section) => (
                            <div key={section.id} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300">
                                        {section.sectionTitle}
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                </div>

                                <div className={`grid ${section.gridCols}`}>
                                    {section.members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="group relative rounded-2xl p-5 sm:p-6 border border-slate-700/60 bg-[#0E1524] hover:border-amber-400/50 hover:bg-[#131D31] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-200 flex items-center justify-between gap-5"
                                        >
                                            <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                                                {/* High-Contrast Monogram Box */}
                                                <div className={`rounded-xl flex items-center justify-center shrink-0 shadow-inner transition-colors bg-[#080D18] border border-amber-400/40 text-amber-300 group-hover:border-amber-400 ${
                                                    section.id === 'leadership'
                                                        ? 'h-16 w-16 sm:h-20 sm:w-20 text-xl sm:text-2xl font-black'
                                                        : 'h-14 w-14 sm:h-16 sm:w-16 text-base sm:text-lg font-bold'
                                                }`}>
                                                    {getMemberInitials(member.name)}
                                                </div>

                                                {/* Member Details */}
                                                <div className="space-y-1.5 min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                                                            {member.title}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                                                        {member.name}
                                                    </h4>

                                                    <div className="pt-0.5">
                                                        {member.contact ? (
                                                            <a
                                                                href={`mailto:${member.contact}`}
                                                                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                                                                aria-label={`Email ${member.name}`}
                                                                title={member.contact}
                                                            >
                                                                <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                                <span>{member.contact}</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-neutral-500 font-mono">mesf.my</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Status Capsule */}
                                            <div className="hidden sm:flex flex-col items-end justify-center shrink-0 pl-2">
                                                <span className="text-[10px] font-mono text-neutral-400 font-medium px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10">
                                                    2024–2027
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Approach 4: Animated Horizontal Scrollable Showcase for Committee Members */}
                        {filteredGeneralCommittee.length > 0 && (
                            <div
                                className="space-y-4 pt-2"
                                onMouseEnter={() => setIsAutoScrollPaused(true)}
                                onMouseLeave={() => {
                                    setIsAutoScrollPaused(false);
                                    handleMouseLeaveOrUp();
                                }}
                            >
                                {/* Carousel Header with Navigation Controls */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300">
                                            Committee Members ({filteredGeneralCommittee.length})
                                        </h3>
                                        <div className="h-[1px] flex-1 bg-white/5" />
                                    </div>

                                    {/* Arrow buttons & quick controls */}
                                    <div className="flex items-center gap-2">
                                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono mr-2">
                                            <span>Swipe</span>
                                            <svg
                                                className="w-4 h-4 text-amber-400"
                                                style={{ animation: 'swipeHorizontal 1.4s ease-in-out infinite' }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleCarouselScroll('left')}
                                            disabled={!canScrollLeft}
                                            className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                                canScrollLeft
                                                    ? 'bg-slate-800/80 hover:bg-amber-400/20 border-slate-700/60 hover:border-amber-400/50 text-white hover:text-amber-300 shadow-sm'
                                                    : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-40'
                                            }`}
                                            aria-label="Previous members"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleCarouselScroll('right')}
                                            disabled={!canScrollRight}
                                            className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                                canScrollRight
                                                    ? 'bg-slate-800/80 hover:bg-amber-400/20 border-slate-700/60 hover:border-amber-400/50 text-white hover:text-amber-300 shadow-sm'
                                                    : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-40'
                                            }`}
                                            aria-label="Next members"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Carousel Wrapper with Dynamic Edge Fading Masks */}
                                <div className="relative group">
                                    {/* Left subtle fade gradient indicator */}
                                    <div
                                        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-[#070B14] to-transparent transition-opacity duration-300 ${
                                            canScrollLeft ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />

                                    {/* Right subtle fade gradient indicator */}
                                    <div
                                        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-l from-[#070B14] to-transparent transition-opacity duration-300 ${
                                            canScrollRight ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />

                                    {/* Smooth Horizontal Scrolling Container */}
                                    <div
                                        ref={carouselRef}
                                        onScroll={updateCarouselScrollStatus}
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseLeaveOrUp}
                                        onMouseMove={handleMouseMove}
                                        className={`flex gap-4 overflow-x-auto pb-3 pt-2 touch-pan-x overscroll-x-contain select-none will-change-scroll ${
                                            isDragging ? 'cursor-grabbing scroll-auto' : 'cursor-grab scroll-smooth snap-x snap-mandatory'
                                        }`}
                                        style={{
                                            WebkitOverflowScrolling: 'touch',
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none'
                                        }}
                                    >
                                        {filteredGeneralCommittee.map((member) => (
                                            <div
                                                key={member.id}
                                                className="min-w-[280px] sm:min-w-[300px] max-w-[340px] snap-start shrink-0 rounded-2xl p-4 sm:p-5 border border-slate-700/60 bg-[#0E1524] hover:border-amber-400/50 hover:bg-[#131D31] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-200 flex items-center gap-4 group"
                                            >
                                                {/* Monogram Box */}
                                                <div className="h-14 w-14 rounded-xl bg-[#080D18] border border-amber-400/40 text-amber-300 group-hover:border-amber-400 font-bold text-sm flex items-center justify-center shrink-0 shadow-inner transition-colors">
                                                    {getMemberInitials(member.name)}
                                                </div>

                                                {/* Details Stack */}
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                                                        {member.title}
                                                    </span>

                                                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                                        {member.name}
                                                    </h4>

                                                    <div className="pt-0.5">
                                                        {member.contact ? (
                                                            <a
                                                                href={`mailto:${member.contact}`}
                                                                onClick={(e) => {
                                                                    if (isDragging) e.preventDefault();
                                                                }}
                                                                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors truncate max-w-full"
                                                                aria-label={`Email ${member.name}`}
                                                                title={member.contact}
                                                            >
                                                                <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                                <span className="truncate">{member.contact}</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-neutral-500 font-mono">mesf.my</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Clean, Minimalist Thin Amber Progress Track */}
                                <div className="flex items-center justify-between gap-4 pt-1 px-1">
                                    <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full transition-all duration-150"
                                            style={{
                                                width: `${Math.max(8, Math.round(scrollProgress * 100))}%`
                                            }}
                                        />
                                    </div>
                                    <div className="text-[11px] font-mono text-neutral-400 shrink-0">
                                        <span>{filteredGeneralCommittee.length} Members</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {filteredExecSections.length === 0 && filteredGeneralCommittee.length === 0 && (
                            <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/10 text-neutral-400 text-sm">
                                No committee members match &ldquo;{memberSearch}&rdquo;.
                            </div>
                        )}
                    </div>
                </section>

                {/* Section 5: Official Secretariat & Contact Channels */}
                <section className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-white/[0.025] border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-400">
                                Secretariat
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Contact & Inquiries
                            </h2>
                            <p className="text-sm text-neutral-300 leading-relaxed">
                                For inquiries, sanctioning, state affiliations, official partnerships, and media requests:
                            </p>

                            {/* Contact Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <a
                                    href="mailto:contact@mesf.my"
                                    className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.08] transition-all flex items-center gap-3.5 group cursor-pointer"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Official Email</span>
                                        <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">contact@mesf.my</span>
                                    </div>
                                </a>

                                <a
                                    href="tel:+60380525278"
                                    className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.08] transition-all flex items-center gap-3.5 group cursor-pointer"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Hotline / Phone</span>
                                        <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">+603-8052 5278</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Social & Registration Info Card */}
                        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#080C16] border border-white/10 space-y-5">
                            <div>
                                <h3 className="text-base font-bold text-white">Registration Details</h3>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Sports Development Act 1997 • Reg No. 7402/2014
                                </p>
                            </div>

                            <div className="space-y-3 pt-2 border-t border-white/10">
                                <span className="text-xs font-semibold text-neutral-300 block uppercase tracking-wider">
                                    Official Channels
                                </span>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        { name: 'Instagram', handle: '@mesfmy', href: 'https://www.instagram.com/mesfmy' },
                                        { name: 'TikTok', handle: '@mesfmy', href: 'https://www.tiktok.com/@mesfmy' },
                                        { name: 'YouTube', handle: '@mesfmy', href: 'https://www.youtube.com/@mesfmy' },
                                        { name: 'X / Twitter', handle: '@mesfmy', href: 'https://twitter.com/mesfmy' }
                                    ].map((channel) => (
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
                                            <span className="text-xs font-bold text-white">
                                                {channel.handle}
                                            </span>
                                        </a>
                                    ))}
                                </div>
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
