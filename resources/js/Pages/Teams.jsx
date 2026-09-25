// --1. imports--
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const PRO_TEAMS = [
    { id: 1, name: 'Team Name', tag: 'TAG', logo: null, region: 'Location', rosters: ['Tag'], status: 'Status' },
    { id: 2, name: 'Team Name', tag: 'TAG', logo: null, region: 'Location', rosters: ['Tag'], status: 'Status' },
    { id: 3, name: 'Team Name', tag: 'TAG', logo: null, region: 'Location', rosters: ['Tag'], status: 'Status' },
    { id: 4, name: 'Team Name', tag: 'TAG', logo: null, region: 'Location', rosters: ['Tag'], status: 'Status' }
];
const NATIONAL_TEAMS = PRO_TEAMS;

const STATE_AFFILIATES = [
    { id: 'johor', name: 'Johor', title: 'Persatuan Sukan Elektronik Negeri Johor', region: 'Peninsular', image: '/images/states/johor_transparent.png' },
    { id: 'kedah', name: 'Kedah', title: 'Persatuan Sukan Elektronik Negeri Kedah', region: 'Peninsular', image: '/images/states/kedah_transparent.png' },
    { id: 'kelantan', name: 'Kelantan', title: 'Persatuan Sukan Elektronik Negeri Kelantan', region: 'Peninsular', image: '/images/states/kelantan_transparent.png' },
    { id: 'melaka', name: 'Melaka', title: 'Persatuan Sukan Elektronik Negeri Melaka', region: 'Peninsular', image: '/images/states/melaka_transparent.png' },
    { id: 'negeri_sembilan', name: 'Negeri Sembilan', title: 'Persatuan Sukan Elektronik Negeri Sembilan', region: 'Peninsular', image: '/images/states/negeri_sembilan_transparent.png' },
    { id: 'pahang', name: 'Pahang', title: 'Persatuan Sukan Elektronik Negeri Pahang', region: 'Peninsular', image: '/images/states/pahang_transparent.png' },
    { id: 'penang', name: 'Pulau Pinang', title: 'Persatuan Sukan Elektronik Pulau Pinang', region: 'Peninsular', image: '/images/states/penang_transparent.png' },
    { id: 'perak', name: 'Perak', title: 'Persatuan Sukan Elektronik Perak', region: 'Peninsular', image: '/images/states/perak_transparent.png' },
    { id: 'perlis', name: 'Perlis', title: 'Persatuan Sukan Elektronik Negeri Perlis', region: 'Peninsular', image: '/images/states/perlis_transparent.png' },
    { id: 'selangor', name: 'Selangor', title: 'Persatuan Sukan Elektronik Negeri Selangor', region: 'Peninsular', image: '/images/states/selangor_transparent.png' },
    { id: 'terengganu', name: 'Terengganu', title: 'Persatuan Sukan Elektronik Negeri Terengganu', region: 'Peninsular', image: '/images/states/terengganu_transparent.png' },
    { id: 'sabah', name: 'Sabah', title: 'Persatuan Sukan Elektronik Negeri Sabah', region: 'East Malaysia', image: '/images/states/sabah_transparent.png' },
    { id: 'sarawak', name: 'Sarawak', title: 'Persatuan Sukan Elektronik Sarawak', region: 'East Malaysia', image: '/images/states/sarawak_transparent.png' },
    { id: 'labuan', name: 'WP Labuan', title: 'Persatuan Sukan Elektronik WP Labuan', region: 'East Malaysia', image: '/images/states/labuan_transparent.png' }
];

// --3. main component--
export default function Teams({ uploadedTeams = [] }) {
    // --4. actions--
    const [stateRegionFilter, setStateRegionFilter] = useState('All'); // state

    const nationalTeams = useMemo(() => { // check
        const uploaded = uploadedTeams.filter(t => t.type === 'national' || t.type === 'pro');
        return uploaded.length > 0 ? uploaded : PRO_TEAMS;
    }, [uploadedTeams]);

    const allStateAffiliates = useMemo(() => { // check
        const uploadedStates = uploadedTeams.filter(t => t.type === 'state').map(t => ({
            id: t.slug || t.id,
            name: t.name,
            title: t.motto || `Persatuan Sukan Elektronik ${t.name}`,
            region: t.region && t.region.toLowerCase().includes('east') || ['sabah', 'sarawak', 'labuan'].some(s => (t.name || '').toLowerCase().includes(s)) ? 'East Malaysia' : 'Peninsular',
            image: t.logo || '/images/states/johor_transparent.png',
        }));
        return uploadedStates.length > 0
            ? [...uploadedStates, ...STATE_AFFILIATES.filter(s => !uploadedStates.some(u => (u.name || '').toLowerCase() === s.name.toLowerCase()))]
            : STATE_AFFILIATES;
    }, [uploadedTeams]);

    // Filtered state affiliates by Peninsular / East Malaysia
    const filteredStates = useMemo(() => {
        return allStateAffiliates.filter((s) => {
            return stateRegionFilter === 'All' || s.region === stateRegionFilter;
        });
    }, [allStateAffiliates, stateRegionFilter]);

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

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* 2. hero header */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-10 text-left">
                <div className="pb-6 border-b border-white/10">
                    <div className="mb-2">
                        <span className="text-xs font-bold tracking-widest text-amber-400 uppercase drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                            [ FEDERATION DIRECTORY ]
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase text-white leading-tight">
                        Teams & Associations
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl font-normal leading-relaxed">
                        Official registry of sanctioned Malaysian esports organizations and state affiliate bodies under MESF.
                    </p>
                </div>
            </header>

            {/* 3. directory main content */}
            <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pb-28 text-left">
                {/* SECTION 1: PRO TEAMS (Wide Horizontal Cards) */}
                <section className="mb-24">
                    <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-8">
                        <div>
                            <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase block mb-1">
                                [ PRO CIRCUITS ]
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                National Esports Organizations
                            </h2>
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">Directory</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {nationalTeams.map((team) => (
                            <div
                                key={team.id}
                                className="group p-7 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-5 sm:gap-6">
                                    {/* high-contrast team logo placeholder */}
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex items-center justify-center shrink-0 group-hover:border-amber-400/30 group-hover:scale-105 transition-all overflow-hidden shadow-inner">
                                        {team.logo ? (
                                            <img
                                                src={team.logo}
                                                alt={team.name}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'block';
                                                    }
                                                }}
                                                className="h-10 w-10 object-contain"
                                            />
                                        ) : null}
                                        <span
                                            className="text-xs font-extrabold tracking-wider text-amber-400 uppercase font-mono"
                                            style={{ display: team.logo ? 'none' : 'block' }}
                                        >
                                            LOGO
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-semibold tracking-wider text-amber-400/90 uppercase">
                                                {team.status}
                                            </span>
                                            <span className="text-neutral-600 text-xs">•</span>
                                            <span className="text-xs text-neutral-400">{team.region}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                                            {team.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {team.rosters.map((roster, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-neutral-400 font-medium">
                                                    {roster}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.visit('/teams/details'); // redirect
                                        }}
                                        className="text-xs font-semibold text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Profile</span>
                                        <span>&rarr;</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 2: STATE AFFILIATES (State Crest Showcase with Region Filters: Peninsular / East Malaysia) */}
                <section id="affiliates" className="space-y-10 scroll-mt-32">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase block mb-1">
                                [ STATE AFFILIATES ]
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                State Esports Associations
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400">
                                Official state and federal territory esports associations across Malaysia.
                            </p>
                        </div>

                        {/* Region Filter: All (14), Peninsular Malaysia (11), East Malaysia (3) */}
                        <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10">
                            {[
                                { id: 'All', label: 'All (14)' },
                                { id: 'Peninsular', label: 'Peninsular Malaysia (11)' },
                                { id: 'East Malaysia', label: 'East Malaysia (3)' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setStateRegionFilter(tab.id)}
                                    className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                        stateRegionFilter === tab.id
                                            ? 'bg-amber-400 text-black font-bold shadow'
                                            : 'text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Distinct Crest Showcase Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredStates.map((state) => (
                            <div
                                key={state.id}
                                className="group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-b from-[#0D1324]/90 to-[#070B14] border border-white/10 hover:border-amber-400/60 transition-all duration-500 flex flex-col items-center text-center space-y-5 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(251,191,36,0.12)]"
                            >
                                {/* Top Ambient Crest Backlight */}
                                <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full bg-amber-400/10 blur-[40px] group-hover:bg-amber-400/25 transition-all duration-500" />

                                {/* Region Tag Pill */}
                                <div className="relative z-10 w-full flex items-center justify-between">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                                        {state.region === 'Peninsular' ? 'Peninsular' : 'Borneo / FT'}
                                    </span>
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                    </span>
                                </div>

                                {/* Central Floating Emblem Pedestal */}
                                <div className="relative z-10 my-1">
                                    <div className="relative h-28 w-28 rounded-2xl bg-black/60 border border-white/15 p-2.5 flex items-center justify-center shadow-inner group-hover:border-amber-400/60 group-hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-all duration-500">
                                        <img
                                            src={state.image}
                                            alt={state.name}
                                            className="h-full w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'; // fallback
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* State Name & Official Title */}
                                <div className="relative z-10 space-y-1.5 flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors tracking-wide">
                                        {state.name}
                                    </h3>
                                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 px-1">
                                        {state.title}
                                    </p>
                                </div>

                                {/* Verified Affiliate Footer Badge & Details Link */}
                                <div className="relative z-10 w-full pt-3.5 border-t border-white/5 flex items-center justify-between gap-1.5 text-[11px] text-neutral-300 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Official Affiliate</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.visit('/teams/state-details'); // redirect
                                        }}
                                        className="text-neutral-400 group-hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold text-[11px]"
                                    >
                                        <span>Details</span>
                                        <span>&rarr;</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}
