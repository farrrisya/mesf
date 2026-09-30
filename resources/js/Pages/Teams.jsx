// --1. imports--
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, MapPin, ArrowUpRight, CheckCircle2, Gamepad2, X } from 'lucide-react';
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
    const [selectedGame, setSelectedGame] = useState('All'); // state
    const [stateRegionFilter, setStateRegionFilter] = useState('All'); // state
    const [searchQuery, setSearchQuery] = useState(''); // state

    const nationalTeams = useMemo(() => { // filter
        return uploadedTeams.filter(t => t.type === 'national' || t.type === 'pro');
    }, [uploadedTeams]);

    const allStateAffiliates = useMemo(() => { // filter
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

    const availableGames = useMemo(() => { // filter
        const games = new Set();
        nationalTeams.forEach(t => {
            if (t.game) games.add(t.game);
            if (Array.isArray(t.rosters)) {
                t.rosters.forEach(r => {
                    if (r && r !== 'National Squad') games.add(r);
                });
            }
        });
        return ['All', ...Array.from(games)];
    }, [nationalTeams]);

    const filteredNationalTeams = useMemo(() => { // filter
        const query = searchQuery.trim().toLowerCase();
        return nationalTeams.filter(t => {
            const matchesGame = selectedGame === 'All' || 
                t.game === selectedGame || 
                (t.rosters || []).includes(selectedGame);
            if (!matchesGame) return false;

            if (!query) return true;
            const nameMatch = (t.name || '').toLowerCase().includes(query);
            const tagMatch = (t.tag || '').toLowerCase().includes(query);
            const regionMatch = (t.region || '').toLowerCase().includes(query);
            return nameMatch || tagMatch || regionMatch;
        });
    }, [nationalTeams, searchQuery, selectedGame]);

    const filteredStates = useMemo(() => { // filter
        const query = searchQuery.trim().toLowerCase();
        return allStateAffiliates.filter(s => {
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
            <Head title="Teams - MESF" />

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* 1. hero header with championship background (natural wide aspect ratio, zero zoom-in) */}
            <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] max-h-[460px] min-h-[260px] overflow-hidden">
                {/* pristine zero-grain HD center-focused MSC championship image */}
                <img
                    src="/images/teams_msc_center_hd.jpg?v=ultra_clean"
                    alt="MSC Esports World Cup Champions"
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.94] contrast-[1.05] saturate-[1.08]"
                />

                {/* cinematic gradient overlays: dark on left for clean left-aligned text, smooth fade at bottom */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/90 via-[#070B14]/65 to-transparent/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/70 via-transparent to-transparent pointer-events-none" />

                {/* left-aligned header container (matches mesa.mn and our other pages) */}
                <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-16 sm:pt-20">
                    <div className="text-left space-y-3 sm:space-y-4">
                        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-amber-400 uppercase block">
                            Malaysia Esports Federation
                        </span>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-white drop-shadow-2xl">
                            Teams
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed whitespace-normal md:whitespace-nowrap">
                            Official directory of sanctioned esports clubs and accredited state associations.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. stats pill row (custom premium geometric svgs) */}
            <section className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#0B101D]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                    
                    {/* stat 1: esports clubs */}
                    <div className="flex flex-col items-center text-center p-2.5 space-y-2">
                        <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                <path d="M4 4h16v6a7 7 0 0 1-14 0V4Z" />
                                <path d="M12 15v4" />
                                <path d="M8 21h8" />
                                <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            {nationalTeams.length}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-400">
                            Esports Clubs
                        </div>
                    </div>

                    {/* stat 2: state affiliates (updated landmark svg) */}
                    <div className="flex flex-col items-center text-center p-2.5 space-y-2">
                        <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21h18" />
                                <path d="M5 21V10" />
                                <path d="M9 21V10" />
                                <path d="M15 21V10" />
                                <path d="M19 21V10" />
                                <path d="M12 3L2 8h20L12 3Z" />
                                <circle cx="12" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            {allStateAffiliates.length}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-400">
                            State Affiliates
                        </div>
                    </div>

                    {/* stat 3: roster athletes */}
                    <div className="flex flex-col items-center text-center p-2.5 space-y-2">
                        <div className="w-11 h-11 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="7" r="3.5" />
                                <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                                <circle cx="17" cy="8" r="2.5" />
                                <path d="M17 13.5c2.2 0 4 1.8 4 4.5" />
                            </svg>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            150+
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-400">
                            Athletes
                        </div>
                    </div>

                    {/* stat 4: nationwide federation */}
                    <div className="flex flex-col items-center text-center p-2.5 space-y-2">
                        <div className="w-11 h-11 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400 shadow-inner">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9.5" />
                                <path d="M2.5 12h19" />
                                <path d="M12 2.5a15 15 0 0 1 0 19" />
                                <path d="M12 2.5a15 15 0 0 0 0 19" />
                            </svg>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            14
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-400">
                            States & FT
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. DIRECTORY SECTION */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-8">

                {/* clean filter controls */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* tabs */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start">
                            {[
                                { id: 'All', label: 'All Teams' },
                                { id: 'Pro', label: `Clubs (${nationalTeams.length})` },
                                { id: 'States', label: `State Affiliates (${allStateAffiliates.length})` }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setDirectoryTab(tab.id)} // trigger
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                                        directoryTab === tab.id
                                            ? 'bg-white text-black font-extrabold shadow-sm'
                                            : 'text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* search */}
                        <div className="relative w-full md:w-72">
                            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // input
                                placeholder="Search club, tag, or state..."
                                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-white/30 focus:outline-none text-xs text-white placeholder-neutral-500 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')} // trigger
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* secondary pills */}
                    {directoryTab === 'Pro' && availableGames.length > 2 && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-[11px] font-mono text-neutral-500 uppercase mr-1 flex items-center gap-1">
                                <Gamepad2 className="w-3 h-3" /> Game:
                            </span>
                            {availableGames.map(game => (
                                <button
                                    key={game}
                                    type="button"
                                    onClick={() => setSelectedGame(game)} // filter
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                                        selectedGame === game
                                            ? 'bg-amber-400 text-black font-bold'
                                            : 'bg-white/[0.04] text-neutral-300 hover:text-white border border-white/10'
                                    }`}
                                >
                                    {game}
                                </button>
                            ))}
                        </div>
                    )}

                    {directoryTab === 'States' && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-[11px] font-mono text-neutral-500 uppercase mr-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Region:
                            </span>
                            {[
                                { id: 'All', label: 'All Regions (14)' },
                                { id: 'Peninsular', label: 'Peninsular (11)' },
                                { id: 'East Malaysia', label: 'East Malaysia (3)' }
                            ].map(reg => (
                                <button
                                    key={reg.id}
                                    type="button"
                                    onClick={() => setStateRegionFilter(reg.id)} // filter
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                                        stateRegionFilter === reg.id
                                            ? 'bg-amber-400 text-black font-bold'
                                            : 'bg-white/[0.04] text-neutral-300 hover:text-white border border-white/10'
                                    }`}
                                >
                                    {reg.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* directory sections */}
                <div className="space-y-12">

                    {/* SECTION 1: ESPORTS CLUBS */}
                    {showProSection && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                                    Esports Clubs
                                </h2>
                                <span className="text-xs font-mono text-neutral-400">
                                    {filteredNationalTeams.length} {filteredNationalTeams.length === 1 ? 'CLUB' : 'CLUBS'}
                                </span>
                            </div>

                            {filteredNationalTeams.length === 0 ? (
                                <div className="py-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <p className="text-neutral-400 text-xs font-medium">
                                        {searchQuery ? `No teams match "${searchQuery}".` : 'No clubs found in this category.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredNationalTeams.map(team => (
                                        <div
                                            key={team.id}
                                            className="group relative p-5 rounded-2xl border border-white/10 bg-[#0A0F1D] hover:border-white/25 hover:bg-[#0D1426] transition-colors duration-200 flex flex-col justify-between space-y-4"
                                        >
                                            {/* tag and active status */}
                                            <div className="flex items-center justify-between">
                                                <span className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 font-mono text-xs font-bold text-neutral-300">
                                                    [{team.tag || getTeamInitials(team.name, team.tag)}]
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                    {team.status || 'Active'}
                                                </span>
                                            </div>

                                            {/* logo and title */}
                                            <div className="flex items-center gap-3.5 py-1">
                                                <div className="h-14 w-14 rounded-xl bg-black/60 border border-white/15 p-2 flex items-center justify-center shrink-0">
                                                    {team.logo ? (
                                                        <img
                                                            src={team.logo}
                                                            alt={team.name}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    ) : null}
                                                    <div
                                                        className="h-full w-full items-center justify-center font-mono font-black text-white text-sm"
                                                        style={{ display: team.logo ? 'none' : 'flex' }}
                                                    >
                                                        {team.tag || getTeamInitials(team.name, team.tag)}
                                                    </div>
                                                </div>

                                                <div className="space-y-0.5 min-w-0 flex-1">
                                                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                                        {team.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                                        <MapPin className="w-3 h-3 shrink-0" />
                                                        <span className="truncate">{team.region || 'Malaysia'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* game roster tags */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {(team.rosters || [team.game || 'Esports Squad']).map((r, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/10 text-[10px] font-mono text-neutral-400"
                                                    >
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* card footer */}
                                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-[11px] text-neutral-500 font-mono">
                                                    Official Club
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        router.visit(team.slug ? `/teams/${team.slug}` : '/teams/details'); // redirect
                                                    }}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                                                >
                                                    <span>Profile</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* SECTION 2: STATE ASSOCIATIONS */}
                    {showStateSection && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                                    State Affiliates
                                </h2>
                                <span className="text-xs font-mono text-neutral-400">
                                    {filteredStates.length} STATES
                                </span>
                            </div>

                            {filteredStates.length === 0 ? (
                                <div className="py-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <p className="text-neutral-400 text-xs font-medium">
                                        No state associations match "{searchQuery}".
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredStates.map(state => (
                                        <div
                                            key={state.id}
                                            className="group relative p-5 rounded-2xl border border-white/10 bg-[#0A0F1D] hover:border-white/25 hover:bg-[#0D1426] transition-colors duration-200 flex flex-col justify-between space-y-4"
                                        >
                                            {/* top badge */}
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono text-[10px] font-bold text-neutral-300">
                                                    {state.code}
                                                </span>
                                                <span className="text-[10px] font-mono text-neutral-400">
                                                    {state.region === 'Peninsular' ? 'Peninsular' : 'Borneo / FT'}
                                                </span>
                                            </div>

                                            {/* state crest & details */}
                                            <div className="flex items-center gap-3.5 py-1">
                                                <div className="h-14 w-14 rounded-xl bg-black/60 border border-white/15 p-2 flex items-center justify-center shrink-0">
                                                    <img
                                                        src={state.image}
                                                        alt={state.name}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>

                                                <div className="space-y-0.5 min-w-0 flex-1">
                                                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                                        {state.name}
                                                    </h3>
                                                    <p className="text-[11px] text-neutral-400 line-clamp-1">
                                                        {state.title}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* affiliate verification badge */}
                                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span>Affiliate</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        router.visit(`/teams/state/${state.id}`); // redirect
                                                    }}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                                                >
                                                    <span>Details</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                </div>
            </div>

            <Footer />
        </div>
    );
}
