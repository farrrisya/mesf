// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Search,
    MapPin,
    ArrowRight,
    X,
    Shield,
    CheckCircle2,
    Info,
    Trophy,
    Users,
    Calendar
} from 'lucide-react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const STATE_AFFILIATES = [
    // 📍 Federal Territories
    {
        id: 'kuala-lumpur',
        slug: 'kuala-lumpur',
        code: 'KUL',
        tag: 'ESKL',
        name: 'Kuala Lumpur',
        title: 'Esports Kuala Lumpur Association (ESKL)',
        zone: 'Federal Territories',
        zoneLabel: 'Federal Territory',
        zoneKey: 'ft'
    },
    {
        id: 'putrajaya',
        slug: 'putrajaya',
        code: 'PJY',
        tag: 'PJY',
        name: 'Putrajaya',
        title: 'Esports Putrajaya Association (ES Putrajaya)',
        zone: 'Federal Territories',
        zoneLabel: 'Federal Territory',
        zoneKey: 'ft'
    },
    {
        id: 'labuan',
        slug: 'labuan',
        code: 'LBN',
        tag: 'LBN',
        name: 'Labuan',
        title: 'Persatuan Esports Labuan (Labuan Esports Association)',
        zone: 'Federal Territories',
        zoneLabel: 'Federal Territory',
        zoneKey: 'ft'
    },

    // ⛰️ Peninsular Malaysia (West Malaysia)
    {
        id: 'selangor',
        slug: 'selangor',
        code: 'SGR',
        tag: 'ESSA',
        name: 'Selangor',
        title: 'Esports Selangor Association (ESSA)',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'johor',
        slug: 'johor',
        code: 'JHR',
        tag: 'JDTEA',
        name: 'Johor',
        title: "Johor Darul Ta'zim Esports Association (JDTEA)",
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'penang',
        slug: 'penang',
        code: 'PNG',
        tag: 'PNG',
        name: 'Penang',
        title: 'Penang Esports Association (Esport Pulau Pinang)',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'perak',
        slug: 'perak',
        code: 'PRK',
        tag: 'PRK',
        name: 'Perak',
        title: 'Esports Perak Association',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'melaka',
        slug: 'melaka',
        code: 'MLK',
        tag: 'MLK',
        name: 'Melaka',
        title: 'Melaka Esports Association',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'kedah',
        slug: 'kedah',
        code: 'KDH',
        tag: 'ESKED',
        name: 'Kedah',
        title: 'Esports Kedah Association (ESKED)',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'terengganu',
        slug: 'terengganu',
        code: 'TRG',
        tag: 'TRG',
        name: 'Terengganu',
        title: 'Esports Terengganu Association',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'kelantan',
        slug: 'kelantan',
        code: 'KTN',
        tag: 'KTN',
        name: 'Kelantan',
        title: 'Kelantan Esports Association (Persatuan Esports Negeri Kelantan)',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'negeri-sembilan',
        slug: 'negeri-sembilan',
        code: 'NSN',
        tag: 'NSN',
        name: 'Negeri Sembilan',
        title: 'Persatuan Esports Negeri Sembilan',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'pahang',
        slug: 'pahang',
        code: 'PHG',
        tag: 'PHG',
        name: 'Pahang',
        title: 'Pahang Esports Association',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },
    {
        id: 'perlis',
        slug: 'perlis',
        code: 'PLS',
        tag: 'PLS',
        name: 'Perlis',
        title: 'Persatuan E-Sports Perlis',
        zone: 'Peninsular Malaysia',
        zoneLabel: 'Peninsular',
        zoneKey: 'peninsular'
    },

    // 🌊 East Malaysia
    {
        id: 'sarawak',
        slug: 'sarawak',
        code: 'SWK',
        tag: 'SESA',
        name: 'Sarawak',
        title: 'Sarawak Esports Association (SESA)',
        zone: 'East Malaysia',
        zoneLabel: 'East Malaysia',
        zoneKey: 'east'
    },
    {
        id: 'sabah',
        slug: 'sabah',
        code: 'SBH',
        tag: 'PESES',
        name: 'Sabah',
        title: 'Sabah Esports Association (PESES)',
        zone: 'East Malaysia',
        zoneLabel: 'East Malaysia',
        zoneKey: 'east'
    }
];

const ZONE_METADATA = [
    { key: 'ft', name: 'Federal Territories', emoji: '📍', label: 'Federal Territories' },
    { key: 'peninsular', name: 'Peninsular Malaysia', emoji: '⛰️', label: 'Peninsular Malaysia (West Malaysia)' },
    { key: 'east', name: 'East Malaysia', emoji: '🌊', label: 'East Malaysia' }
];

// --3. main component--
export default function Teams({ uploadedTeams = [] }) {
    // --4. actions--
    const [selectedZone, setSelectedZone] = useState('All'); // state
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [nationalSearchQuery, setNationalSearchQuery] = useState(''); // state
    const [previewAffiliate, setPreviewAffiliate] = useState(null); // state

    const nationalTeams = useMemo(() => { // filter
        return uploadedTeams.filter((t) => t.type === 'national' || t.type === 'pro');
    }, [uploadedTeams]);

    const filteredNationalTeams = useMemo(() => { // filter
        if (!nationalSearchQuery.trim()) return nationalTeams;
        const q = nationalSearchQuery.toLowerCase();
        return nationalTeams.filter(
            (t) =>
                (t.name && t.name.toLowerCase().includes(q)) ||
                (t.game && t.game.toLowerCase().includes(q)) ||
                (t.tag && t.tag.toLowerCase().includes(q))
        );
    }, [nationalTeams, nationalSearchQuery]);

    // Merge static authoritative affiliates with database uploaded state teams
    const allStateAffiliates = useMemo(() => { // filter
        return STATE_AFFILIATES.map((fallback) => {
            const match = uploadedTeams.find(
                (t) =>
                    t.type === 'state' &&
                    (t.slug === fallback.slug ||
                        t.id === fallback.slug ||
                        (t.name && t.name.toLowerCase() === fallback.name.toLowerCase()))
            );
            return {
                ...fallback,
                dbId: match?.id,
                name: fallback.name,
                title: fallback.title,
                tag: fallback.tag,
                status: match?.status || 'ACTIVE',
                logo: match?.logo_path
                    ? (match.logo_path.startsWith('http') || match.logo_path.startsWith('/')
                        ? match.logo_path
                        : `/storage/${match.logo_path}`)
                    : (match?.logo || null),
                managerName: match?.manager_name || null,
                contactEmail: match?.contact_email || null
            };
        });
    }, [uploadedTeams]);

    const filteredStates = useMemo(() => { // filter
        const query = searchQuery.trim().toLowerCase();
        return allStateAffiliates.filter((s) => {
            const matchesZone = selectedZone === 'All' || s.zoneKey === selectedZone;
            if (!matchesZone) return false; // check
            if (!query) return true; // check
            return (
                (s.name || '').toLowerCase().includes(query) ||
                (s.title || '').toLowerCase().includes(query) ||
                (s.tag || '').toLowerCase().includes(query) ||
                (s.code || '').toLowerCase().includes(query) ||
                (s.zone || '').toLowerCase().includes(query)
            );
        });
    }, [allStateAffiliates, selectedZone, searchQuery]);

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title="Teams - MESF" />

            {/* ambient background glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-slate-600/10 blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[160px]" />
            </div>

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* 1. hero header (exact matching size and style as Matches page) */}
            <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] max-h-[460px] min-h-[260px] overflow-hidden">
                <img
                    src="/images/teams_header_hero.jpg?v=4k_3803x1007"
                    alt="MESF Teams"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* cinematic gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/90 via-[#070B14]/65 to-transparent/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/70 via-transparent to-transparent pointer-events-none" />

                {/* left-aligned header container */}
                <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-16 sm:pt-20">
                    <div className="text-left space-y-3 sm:space-y-4">
                        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-neutral-300 uppercase block">
                            Malaysia Esports Federation
                        </span>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-white drop-shadow-2xl">
                            Teams
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed whitespace-normal md:whitespace-nowrap">
                            Official directory of national teams and accredited state associations.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. clean, unified counter & action grid with matching styles and sizes */}
            <section className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1220]/95 border border-amber-400/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                        {/* card 1: national teams */}
                        <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-amber-400/[0.08] border border-amber-400/30 text-left">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight leading-none">
                                    {nationalTeams.length}
                                </div>
                                <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-200 font-bold mt-1.5 truncate">
                                    National Teams
                                </div>
                            </div>
                        </div>

                        {/* card 2: state affiliates */}
                        <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none">
                                    {allStateAffiliates.length}
                                </div>
                                <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mt-1.5 truncate">
                                    State Affiliates
                                </div>
                            </div>
                        </div>

                        {/* card 3: register team (exact same size & style as the total number boxes) */}
                        <Link
                            href="/register-team" // redirect
                            className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-amber-400/[0.08] hover:bg-amber-400/[0.16] border border-amber-400/30 hover:border-amber-400/60 text-left transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                        >
                            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white group-hover:text-amber-300 leading-snug truncate">
                                        Register Team
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mt-1 truncate flex items-center gap-1">
                                        <span>Join Directory</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all shrink-0">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. main content area with generous, breathing vertical spacing */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-32 space-y-24 sm:space-y-32">

                {/* ---------------------------------------------------- */}
                {/* SECTION 1: NATIONAL TEAMS (SHOWS FIRST - MAIN POINT) */}
                {/* ---------------------------------------------------- */}
                <section id="national-teams" className="space-y-8">
                    {/* section header (clean, no description paragraph, matching right search bar) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 text-left">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                                National Teams
                            </h2>
                            <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300 shrink-0">
                                {filteredNationalTeams.length} Teams
                            </span>
                        </div>

                        {/* search bar matching exact style from Matches & Leagues */}
                        <div className="w-full sm:w-56 md:w-64">
                            <div className="relative flex items-center">
                                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 pointer-events-none" />
                                <input
                                    type="text"
                                    value={nationalSearchQuery} // state
                                    onChange={(e) => setNationalSearchQuery(e.target.value)} // trigger
                                    placeholder="Search national team..."
                                    className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-white/30 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                                />
                                {nationalSearchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setNationalSearchQuery('')} // trigger
                                        className="absolute right-2 text-neutral-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content: Clean Empty State if 0, or Modern National Team Cards */}
                    {nationalTeams.length === 0 ? (
                        <div className="rounded-2xl p-10 sm:p-14 bg-[#090E1A]/60 border border-white/10 text-center space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                    No National Teams Registered Yet
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                                    Official Malaysian national squad rosters will be displayed here once sanctioned and registered by the administration.
                                </p>
                            </div>
                        </div>
                    ) : filteredNationalTeams.length === 0 ? (
                        <div className="py-14 text-center rounded-2xl border border-white/10 bg-[#090E1A]/60 space-y-3">
                            <p className="text-neutral-400 text-sm font-medium">
                                No national teams match "{nationalSearchQuery}".
                            </p>
                            <button
                                type="button"
                                onClick={() => setNationalSearchQuery('')} // trigger
                                className="px-4 py-2 rounded-lg bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                            >
                                Reset Search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNationalTeams.map((team) => (
                                <NationalTeamCard key={team.id} team={team} />
                            ))}
                        </div>
                    )}
                </section>


                {/* ---------------------------------------------------- */}
                {/* SECTION 2: STATE AFFILIATES (BELOW NATIONAL TEAMS)  */}
                {/* ---------------------------------------------------- */}
                <section id="state-affiliates" className="space-y-8">
                    {/* section header (clean, no description paragraph, matching right badge) */}
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 text-left">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                            State Affiliates
                        </h2>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300 shrink-0">
                            {filteredStates.length} Teams
                        </span>
                    </div>

                    {/* sleek single-line zone filter & standalone search bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        {/* zone filter box (left) */}
                        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#090E1A]/80 border border-white/10 backdrop-blur-md overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                            {[
                                { id: 'All', label: `All (${allStateAffiliates.length})` },
                                { id: 'ft', label: '📍 Federal Territories (3)' },
                                { id: 'peninsular', label: '⛰️ Peninsular (11)' },
                                { id: 'east', label: '🌊 East Malaysia (2)' }
                            ].map((zone) => (
                                <button
                                    key={zone.id}
                                    type="button"
                                    onClick={() => setSelectedZone(zone.id)} // filter
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                                        selectedZone === zone.id
                                            ? 'bg-white text-slate-950 font-bold shadow-sm'
                                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                                    }`}
                                >
                                    {zone.label}
                                </button>
                            ))}
                        </div>

                        {/* search bar matching exact style from Matches & Leagues (right) */}
                        <div className="w-full sm:w-56 md:w-64">
                            <div className="relative flex items-center">
                                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery} // state
                                    onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                    placeholder="Search state, acronym..."
                                    className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-white/30 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')} // trigger
                                        className="absolute right-2 text-neutral-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* state teams display: modern horizontal cards with spacious breathing room */}
                    {filteredStates.length === 0 ? (
                        <div className="py-20 text-center rounded-2xl border border-white/10 bg-[#090E1A]/60 space-y-3">
                            <p className="text-neutral-400 text-sm font-medium">
                                No state associations match "{searchQuery}".
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery(''); // trigger
                                    setSelectedZone('All'); // filter
                                }}
                                className="px-4 py-2 rounded-lg bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                            >
                                Reset Search &amp; Filters
                            </button>
                        </div>
                    ) : selectedZone === 'All' && !searchQuery ? (
                        /* grouped by zone view */
                        <div className="space-y-16">
                            {ZONE_METADATA.map((zoneMeta) => {
                                const zoneAffiliates = filteredStates.filter((s) => s.zoneKey === zoneMeta.key);
                                if (zoneAffiliates.length === 0) return null; // check
                                return (
                                    <div key={zoneMeta.key} className="space-y-5 text-left">
                                        <div className="flex items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3">
                                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase flex items-center gap-2">
                                                <span>{zoneMeta.emoji}</span>
                                                <span>{zoneMeta.label}</span>
                                            </h3>
                                            <span className="text-xs font-mono text-neutral-400">
                                                {zoneAffiliates.length} Teams
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                            {zoneAffiliates.map((state) => (
                                                <StateAffiliateCard
                                                    key={state.id}
                                                    state={state}
                                                    onQuickPreview={(aff) => setPreviewAffiliate(aff)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* continuous grid view */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {filteredStates.map((state) => (
                                <StateAffiliateCard
                                    key={state.id}
                                    state={state}
                                    onQuickPreview={(aff) => setPreviewAffiliate(aff)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* 4. interactive quick preview modal: clean esports accreditation ID card with 3D spin popup */}
            {previewAffiliate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                    onClick={() => setPreviewAffiliate(null)} // trigger
                >
                    <style>{`
                        @keyframes idCardSpinPop {
                            0% {
                                opacity: 0;
                                transform: perspective(1200px) rotateY(-180deg) scale(0.8);
                            }
                            70% {
                                transform: perspective(1200px) rotateY(6deg) scale(1.01);
                            }
                            100% {
                                opacity: 1;
                                transform: perspective(1200px) rotateY(0deg) scale(1);
                            }
                        }
                        .animate-card-spin-pop {
                            animation: idCardSpinPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                            transform-style: preserve-3d;
                        }
                    `}</style>

                    <div
                        className="animate-card-spin-pop relative w-full max-w-[400px] rounded-3xl bg-gradient-to-b from-[#10192B] via-[#090E1A] to-[#060913] border border-white/15 p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center space-y-6 sm:space-y-7"
                        onClick={(e) => e.stopPropagation()} // trigger
                    >
                        {/* lanyard hole punch cutout */}
                        <div className="w-14 h-2.5 rounded-full bg-slate-950 border border-white/20 mx-auto shadow-inner" />

                        {/* MESF State Affiliate status pill */}
                        <div className="flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                MESF State Affiliate
                            </span>
                        </div>

                        {/* official crest / logo */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#060913] border-2 border-white/15 p-3 flex items-center justify-center mx-auto shadow-2xl">
                            {previewAffiliate.logo ? (
                                <img
                                    src={previewAffiliate.logo}
                                    alt={previewAffiliate.name}
                                    className="h-full w-full object-contain filter drop-shadow"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <Shield className="w-8 h-8 text-neutral-400 mb-1" />
                                    <span className="font-mono font-black text-xs text-white tracking-wider">
                                        {previewAffiliate.tag || previewAffiliate.code}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* basic state & association info with larger association name */}
                        <div className="space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                                {previewAffiliate.name}
                            </h3>
                            <p className="text-sm sm:text-base text-neutral-200 font-semibold leading-relaxed max-w-sm mx-auto">
                                {previewAffiliate.title}
                            </p>
                            <span className="text-xs font-mono text-neutral-400 block pt-1 uppercase tracking-wider">
                                {previewAffiliate.zone}
                            </span>
                        </div>

                        {/* footer actions */}
                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setPreviewAffiliate(null)} // trigger
                                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                            <Link
                                href={`/teams/state/${previewAffiliate.slug}`} // redirect
                                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                            >
                                <span>Open Full Page</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. footer */}
            <Footer />
        </div>
    );
}

// Subcomponent: State Affiliate Card (Matches National Team Card hover aesthetics)
function StateAffiliateCard({ state, onQuickPreview }) {
    return (
        <div className="group rounded-2xl bg-[#090E1A]/80 border border-white/10 hover:border-amber-400/40 hover:bg-[#0c1222] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-lg transition-all">
            {/* left block: crest + identity */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                {/* crest placeholder or uploaded logo */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#060913] border border-white/10 p-2 flex items-center justify-center shrink-0 shadow-inner">
                    {state.logo ? (
                        <img
                            src={state.logo}
                            alt={state.name}
                            className="h-full w-full object-contain filter drop-shadow"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'; // error
                                if (e.currentTarget.nextSibling) {
                                    e.currentTarget.nextSibling.style.display = 'flex'; // toggle
                                }
                            }}
                        />
                    ) : null}
                    <div
                        className="h-full w-full flex flex-col items-center justify-center text-center select-none"
                        style={{ display: state.logo ? 'none' : 'flex' }}
                    >
                        <Shield className="w-5 h-5 text-neutral-400 mb-0.5" />
                        <span className="font-mono font-black text-xs text-white tracking-wider">
                            {state.tag || state.code}
                        </span>
                    </div>
                </div>

                {/* state details */}
                <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base sm:text-lg text-white tracking-tight truncate">
                            {state.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-[#060913] border border-white/10 font-mono text-[10px] font-bold text-sky-300 tracking-wider shrink-0">
                            [{state.tag}]
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed truncate">
                        {state.title}
                    </p>
                </div>
            </div>

            {/* right block: accreditation status & actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] shrink-0">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-medium sm:hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Accredited
                </span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onQuickPreview(state)} // trigger
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Quick Preview"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                    <Link
                        href={`/teams/state/${state.slug}`} // redirect
                        className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Subcomponent: National Team Card (Entire box is interactive link to details)
function NationalTeamCard({ team }) {
    const teamSlug = team.slug || team.id;
    return (
        <Link
            href={`/teams/${teamSlug}`} // redirect
            className="group rounded-2xl bg-[#090E1A]/80 border border-white/10 hover:border-amber-400/40 p-5 sm:p-6 flex flex-col justify-between shadow-lg text-left space-y-5 transition-all cursor-pointer block hover:bg-[#0c1222]"
        >
            {/* top row: tag & status */}
            <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-[#060913] border border-white/10 font-mono text-[10px] font-bold text-amber-300 tracking-wider">
                    [{team.tag || 'MAS'}]
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {team.status || 'Active'}
                </span>
            </div>

            {/* center: crest & name */}
            <div className="flex flex-col items-center text-center space-y-3 pt-1">
                <div className="w-16 h-16 rounded-2xl bg-[#060913] border border-white/10 p-2.5 flex items-center justify-center shrink-0 shadow-inner group-hover:border-amber-400/40 transition-colors">
                    {team.logo ? (
                        <img
                            src={team.logo}
                            alt={team.name}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'; // error
                                if (e.currentTarget.nextSibling) {
                                    e.currentTarget.nextSibling.style.display = 'flex'; // toggle
                                }
                            }}
                            className="h-full w-full object-contain filter drop-shadow-sm"
                        />
                    ) : null}
                    <div
                        className="h-full w-full flex flex-col items-center justify-center text-center select-none"
                        style={{ display: team.logo ? 'none' : 'flex' }}
                    >
                        <Trophy className="w-5 h-5 text-amber-400 mb-1" />
                        <span className="font-mono font-black text-xs text-white tracking-wider">
                            {team.tag || 'MAS'}
                        </span>
                    </div>
                </div>

                <div className="space-y-0.5 w-full">
                    <h3 className="font-bold text-base text-white tracking-tight truncate w-full group-hover:text-amber-400 transition-colors">
                        {team.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-medium truncate">
                        {team.game || team.region || 'National Representation'}
                    </p>
                </div>
            </div>

            {/* bottom: member and since boxes */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/[0.08] text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-left space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        <Users className="w-3 h-3 text-neutral-400" />
                        <span>Members</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white block">
                        {team.roster_size ? `${team.roster_size} Athletes` : '5 Athletes'}
                    </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-left space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>Since</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white block">
                        {team.since || '2024'}
                    </span>
                </div>
            </div>

            {/* action: direct link button visually indicating clickable box */}
            <div className="pt-1">
                <div className="w-full py-2 px-3 rounded-xl bg-white/5 group-hover:bg-amber-400/10 border border-white/10 group-hover:border-amber-400/30 text-xs font-semibold text-neutral-200 group-hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-300 transition-colors" />
                </div>
            </div>
        </Link>
    );
}
