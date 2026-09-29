// --1. imports--
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, Shield, Trophy, MapPin, Building2, ArrowRight, CheckCircle2, Users, Sparkles } from 'lucide-react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const STATE_AFFILIATES = [
    { id: 'johor', code: 'JHR', name: 'Johor', title: 'Persatuan Sukan Elektronik Negeri Johor', region: 'Peninsular', image: '/images/states/johor_transparent.png' },
    { id: 'kedah', code: 'KDH', name: 'Kedah', title: 'Persatuan Sukan Elektronik Negeri Kedah', region: 'Peninsular', image: '/images/states/kedah_transparent.png' },
    { id: 'kelantan', code: 'KTN', name: 'Kelantan', title: 'Persatuan Sukan Elektronik Negeri Kelantan', region: 'Peninsular', image: '/images/states/kelantan_transparent.png' },
    { id: 'melaka', code: 'MLK', name: 'Melaka', title: 'Persatuan Sukan Elektronik Negeri Melaka', region: 'Peninsular', image: '/images/states/melaka_transparent.png' },
    { id: 'negeri_sembilan', code: 'NSN', name: 'Negeri Sembilan', title: 'Persatuan Sukan Elektronik Negeri Sembilan', region: 'Peninsular', image: '/images/states/negeri_sembilan_transparent.png' },
    { id: 'pahang', code: 'PHG', name: 'Pahang', title: 'Persatuan Sukan Elektronik Negeri Pahang', region: 'Peninsular', image: '/images/states/pahang_transparent.png' },
    { id: 'penang', code: 'PNG', name: 'Pulau Pinang', title: 'Persatuan Sukan Elektronik Pulau Pinang', region: 'Peninsular', image: '/images/states/penang_transparent.png' },
    { id: 'perak', code: 'PRK', name: 'Perak', title: 'Persatuan Sukan Elektronik Perak', region: 'Peninsular', image: '/images/states/perak_transparent.png' },
    { id: 'perlis', code: 'PLS', name: 'Perlis', title: 'Persatuan Sukan Elektronik Negeri Perlis', region: 'Peninsular', image: '/images/states/perlis_transparent.png' },
    { id: 'selangor', code: 'SGR', name: 'Selangor', title: 'Persatuan Sukan Elektronik Negeri Selangor', region: 'Peninsular', image: '/images/states/selangor_transparent.png' },
    { id: 'terengganu', code: 'TRG', name: 'Terengganu', title: 'Persatuan Sukan Elektronik Negeri Terengganu', region: 'Peninsular', image: '/images/states/terengganu_transparent.png' },
    { id: 'sabah', code: 'SBH', name: 'Sabah', title: 'Persatuan Sukan Elektronik Negeri Sabah', region: 'East Malaysia', image: '/images/states/sabah_transparent.png' },
    { id: 'sarawak', code: 'SWK', name: 'Sarawak', title: 'Persatuan Sukan Elektronik Sarawak', region: 'East Malaysia', image: '/images/states/sarawak_transparent.png' },
    { id: 'labuan', code: 'LBN', name: 'WP Labuan', title: 'Persatuan Sukan Elektronik WP Labuan', region: 'East Malaysia', image: '/images/states/labuan_transparent.png' }
];

// helper to get team initials if logo is absent
function getTeamInitials(name = '', tag = '') { // convert
    if (tag && tag.length <= 4) return tag;
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (name.slice(0, 3) || 'T').toUpperCase();
}

// --3. main component--
export default function Teams({ uploadedTeams = [] }) {
    // --4. actions--
    const [directoryTab, setDirectoryTab] = useState('All'); // state
    const [stateRegionFilter, setStateRegionFilter] = useState('All'); // state
    const [searchQuery, setSearchQuery] = useState(''); // state

    // national and pro organizations
    const nationalTeams = useMemo(() => { // check
        return uploadedTeams.filter(t => t.type === 'national' || t.type === 'pro');
    }, [uploadedTeams]);

    // all 14 official state associations
    const allStateAffiliates = useMemo(() => { // check
        const uploadedStates = uploadedTeams.filter(t => t.type === 'state').map(t => ({
            id: t.slug || t.id,
            code: (t.tag || t.name.slice(0, 3)).toUpperCase(),
            name: t.name,
            title: t.motto || `Persatuan Sukan Elektronik ${t.name}`,
            region: (t.region && t.region.toLowerCase().includes('east')) || ['sabah', 'sarawak', 'labuan'].some(s => (t.name || '').toLowerCase().includes(s)) ? 'East Malaysia' : 'Peninsular',
            image: t.logo || `/images/states/${t.slug ? t.slug.replace('-', '_') : 'johor'}_transparent.png`,
        }));
        return uploadedStates.length > 0 ? uploadedStates : STATE_AFFILIATES;
    }, [uploadedTeams]);

    // filtered pro teams based on search query
    const filteredNationalTeams = useMemo(() => { // filter
        const query = searchQuery.trim().toLowerCase();
        if (!query) return nationalTeams;
        return nationalTeams.filter(t => {
            const nameMatch = (t.name || '').toLowerCase().includes(query);
            const tagMatch = (t.tag || '').toLowerCase().includes(query);
            const regionMatch = (t.region || '').toLowerCase().includes(query);
            const rostersMatch = (t.rosters || []).some(r => r.toLowerCase().includes(query));
            return nameMatch || tagMatch || regionMatch || rostersMatch;
        });
    }, [nationalTeams, searchQuery]);

    // filtered state affiliates by search query and region
    const filteredStates = useMemo(() => { // filter
        const query = searchQuery.trim().toLowerCase();
        return allStateAffiliates.filter((s) => {
            const regionMatches = stateRegionFilter === 'All' || s.region === stateRegionFilter;
            if (!regionMatches) return false;
            if (!query) return true;
            const nameMatch = (s.name || '').toLowerCase().includes(query);
            const titleMatch = (s.title || '').toLowerCase().includes(query);
            const codeMatch = (s.code || '').toLowerCase().includes(query);
            return nameMatch || titleMatch || codeMatch;
        });
    }, [allStateAffiliates, stateRegionFilter, searchQuery]);

    const showProSection = directoryTab === 'All' || directoryTab === 'Pro';
    const showStateSection = directoryTab === 'All' || directoryTab === 'States';

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title="Teams & Associations - MESF" />

            {/* custom animation for moving footer beam */}
            <style>{`
                @keyframes beamScan {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(400%);
                    }
                }
                .footer-beam {
                    animation: beamScan 12s linear infinite;
                }
            `}</style>

            {/* ambient background glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-indigo-600/10 blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[160px]" />
            </div>

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* 2. hero header & filters */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-8 text-left">
                <div className="flex flex-col gap-6 pb-6 border-b border-white/10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-white">
                                Teams
                            </h1>
                        </div>

                        {/* search bar */}
                        <div className="w-full lg:w-80 shrink-0">
                            <div className="relative">
                                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)} // input
                                    placeholder="Search team, association, or state..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/15 focus:border-white/40 focus:outline-none text-xs text-white placeholder-neutral-500 transition-colors shadow-inner"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')} // trigger
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* dual filter bar: main directory tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-wrap items-center gap-2">
                            {[
                                { id: 'All', label: 'All Organizations' },
                                { id: 'Pro', label: `National & Pro (${nationalTeams.length})` },
                                { id: 'States', label: `State Affiliates (${allStateAffiliates.length})` }
                            ].map((tab) => {
                                const isActive = directoryTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setDirectoryTab(tab.id)} // filter
                                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none ${
                                            isActive
                                                ? 'bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.2)] border border-white font-extrabold'
                                                : 'border border-white/15 bg-[#0e1628]/90 text-neutral-300 hover:text-white hover:border-white/30 hover:bg-[#131d33]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* quick directory count stats */}
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                            <span className="inline-flex items-center gap-1.5 font-medium">
                                <Users className="w-3.5 h-3.5 text-neutral-400" />
                                {nationalTeams.length} Pro & National
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1.5 font-medium">
                                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                                {allStateAffiliates.length} State Affiliates
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. directory main content */}
            <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pb-28 text-left space-y-20">
                {/* SECTION 1: PRO TEAMS & NATIONAL ORGANIZATIONS */}
                {showProSection && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                                    National & Pro Teams
                                </h2>
                            </div>
                            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider hidden sm:block">
                                [{filteredNationalTeams.length} {filteredNationalTeams.length === 1 ? 'Club' : 'Clubs'}]
                            </span>
                        </div>

                        {filteredNationalTeams.length === 0 ? (
                            <div className="py-12 text-center rounded-2xl border border-white/10 bg-[#0e1628]/50">
                                <p className="text-neutral-400 text-xs">
                                    {searchQuery
                                        ? `No pro organizations match "${searchQuery}".`
                                        : 'No national squads or pro organizations have been uploaded by administration yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredNationalTeams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="group relative p-6 sm:p-7 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] hover:border-white/30 hover:bg-[#121b30] shadow-[0_16px_40px_rgba(0,0,0,0.65)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden"
                                    >
                                        {/* top edge luminous highlight beam */}
                                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 opacity-70" />

                                        <div className="flex items-start sm:items-center gap-5">
                                            {/* team logo / monogram container */}
                                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 shadow-lg ring-1 ring-white/10 p-2.5 overflow-hidden">
                                                {team.logo ? (
                                                    <img
                                                        src={team.logo}
                                                        alt={team.name}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextSibling) {
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }
                                                        }}
                                                        className="h-full w-full object-contain filter drop-shadow"
                                                    />
                                                ) : null}
                                                <div
                                                    className="h-full w-full rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 items-center justify-center"
                                                    style={{ display: team.logo ? 'none' : 'flex' }}
                                                >
                                                    <span className="text-sm sm:text-base font-black text-white tracking-wider font-mono">
                                                        {team.tag || getTeamInitials(team.name, team.tag)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* team text details */}
                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                                                        {team.status || 'Active'}
                                                    </span>
                                                    {team.region && (
                                                        <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                                            {team.region}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug group-hover:text-neutral-100 transition-colors">
                                                    {team.name}
                                                </h3>

                                                {team.accolade && (
                                                    <p className="text-xs text-neutral-400 font-medium line-clamp-1">
                                                        {team.accolade}
                                                    </p>
                                                )}

                                                {/* disciplines / rosters */}
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {(team.rosters || []).map((roster, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-0.5 rounded-md bg-[#070b14] border border-white/10 text-[10px] font-mono font-semibold text-neutral-300"
                                                        >
                                                            {roster}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* right: action button */}
                                        <div className="shrink-0 self-end sm:self-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    router.visit(team.slug ? `/teams/${team.slug}` : '/teams/details'); // redirect
                                                }}
                                                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                            >
                                                <span>Profile</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* SECTION 2: STATE AFFILIATES (14 State Associations with Region Filtering) */}
                {showStateSection && (
                    <section id="affiliates" className="space-y-6 scroll-mt-32">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                                    State Affiliates
                                </h2>
                            </div>

                            {/* Region Filter: All (14), Peninsular Malaysia (11), East Malaysia (3) */}
                            <div className="flex items-center p-1 rounded-xl bg-[#0e1628] border border-white/15">
                                {[
                                    { id: 'All', label: 'All (14)' },
                                    { id: 'Peninsular', label: 'Peninsular (11)' },
                                    { id: 'East Malaysia', label: 'East Malaysia (3)' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setStateRegionFilter(tab.id)} // filter
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            stateRegionFilter === tab.id
                                                ? 'bg-white text-black shadow-sm font-extrabold'
                                                : 'text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredStates.length === 0 ? (
                            <div className="py-12 text-center rounded-2xl border border-white/10 bg-[#0e1628]/50">
                                <p className="text-neutral-400 text-xs">No state associations match "{searchQuery}".</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredStates.map((state) => (
                                    <div
                                        key={state.id}
                                        className="group relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] border border-white/15 hover:border-white/35 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.65)] hover:bg-[#121b30] text-left"
                                    >
                                        {/* top edge luminous highlight beam */}
                                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 opacity-70" />

                                        {/* region tag pill & verified indicator */}
                                        <div className="relative z-10 w-full flex items-center justify-between">
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 font-bold">
                                                {state.region === 'Peninsular' ? 'Peninsular' : 'Borneo / FT'}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                                </span>
                                                Active
                                            </span>
                                        </div>

                                        {/* state crest & title (left-aligned) */}
                                        <div className="relative z-10 flex items-start gap-4 my-1">
                                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-black/70 border border-white/20 p-2.5 flex items-center justify-center shadow-inner group-hover:border-white/40 transition-colors shrink-0">
                                                <img
                                                    src={state.image}
                                                    alt={state.name}
                                                    className="h-full w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'; // fallback
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-1 min-w-0 flex-1">
                                                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-neutral-100 transition-colors tracking-wide truncate">
                                                    {state.name}
                                                </h3>
                                                <p className="text-xs text-neutral-400 leading-snug line-clamp-2">
                                                    {state.title}
                                                </p>
                                            </div>
                                        </div>

                                        {/* verified affiliate footer & details link */}
                                        <div className="relative z-10 w-full pt-3.5 border-t border-white/10 flex items-center justify-between gap-1.5 text-xs text-neutral-300 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span className="text-[11px] text-neutral-300 font-bold">Official Affiliate</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    router.visit(`/teams/state/${state.id}`); // redirect
                                                }}
                                                className="text-white hover:text-neutral-200 transition-colors inline-flex items-center gap-1 cursor-pointer font-bold text-xs"
                                            >
                                                <span>Details</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}

