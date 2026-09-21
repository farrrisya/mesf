// --1. imports--
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. properties--
const STATE_TEMPLATE_DATA = {
    stateName: 'State Name',
    bodyName: 'State Esports Association Name',
    code: 'CODE',
    status: 'Status',
    headquarters: 'Location',
    parentBody: 'Organization Name',
    programs: [
        {
            id: 'ID 1',
            title: 'Program Title',
            discipline: 'Discipline',
            cadence: 'Schedule',
            status: 'Status'
        },
        {
            id: 'ID 2',
            title: 'Program Title',
            discipline: 'Discipline',
            cadence: 'Schedule',
            status: 'Status'
        }
    ],
    districts: [
        'District 1',
        'District 2',
        'District 3',
        'District 4'
    ],
    contactInfo: {
        address: 'Address',
        email: 'Email',
        phone: 'Phone',
        website: 'Website'
    },
    executiveCommittee: [
        { role: 'Role', name: 'Full Name' },
        { role: 'Role', name: 'Full Name' },
        { role: 'Role', name: 'Full Name' }
    ]
};

// --3. main component--
export default function StateDetails() {
    const data = STATE_TEMPLATE_DATA;

    // --4. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden antialiased">
            <Head title={`${data.bodyName} - State Association | MESF`} />

            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
            <div className="pointer-events-none absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[140px]" />

            {/* Fixed Grain Overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <PublicNavbar activeTab="teams" />

            {/* Main Content */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-28 md:pt-36 pb-28 text-left">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href="/teams"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer group"
                    >
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span>Back to Directory</span>
                    </Link>
                </div>

                {/* State Profile Header */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-2xl p-6 sm:p-10 md:p-12 mb-12 shadow-2xl">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex items-start sm:items-center gap-5 sm:gap-8">
                            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#0B1120] border border-amber-400/30 flex items-center justify-center shrink-0 p-3 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                                <span className="text-sm sm:text-base font-black tracking-widest text-amber-400 uppercase font-mono">
                                    LOGO
                                </span>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                        {data.status}
                                    </span>
                                    <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        {data.headquarters}
                                    </span>
                                </div>
                                <h1 className="font-['Anton'] text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wide leading-none">
                                    {data.bodyName}
                                </h1>
                                <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                                    Affiliated with {data.parentBody}
                                </p>
                            </div>
                        </div>

                        {/* High-Level Overview Capsules */}
                        <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                            <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center min-w-[110px]">
                                <span className="block text-xl font-bold text-white font-mono">{data.districts.length}</span>
                                <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase">Districts</span>
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center min-w-[110px]">
                                <span className="block text-xl font-bold text-amber-400 font-mono">{data.programs.length}</span>
                                <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase">Programs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2-Column Scaffolding */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Sanctioned Programs & District Reach */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Programs & Competitions */}
                        <section className="space-y-4">
                            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                <h2 className="font-['Anton'] text-2xl text-white uppercase tracking-wider">
                                    Sanctioned Programs &amp; Qualifiers
                                </h2>
                                <span className="text-xs text-neutral-500 font-mono">[ REGISTRY ]</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {data.programs.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-5 rounded-2xl border border-white/10 bg-[#0A0F1D]/80 hover:border-amber-400/30 transition-colors flex items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-amber-400">{item.id}</span>
                                                <span className="text-neutral-600">&bull;</span>
                                                <span className="text-xs text-neutral-400">{item.discipline}</span>
                                            </div>
                                            <h3 className="text-base font-bold text-white tracking-wide">
                                                {item.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs text-neutral-400 hidden sm:inline">{item.cadence}</span>
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-neutral-300">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Administrative Districts Cloud */}
                        <section className="space-y-4">
                            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                <h2 className="font-['Anton'] text-2xl text-white uppercase tracking-wider">
                                    Registered Districts
                                </h2>
                                <span className="text-xs text-neutral-500 font-mono">{data.districts.length} Districts</span>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {data.districts.map((district) => (
                                    <span
                                        key={district}
                                        className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-medium text-neutral-300 flex items-center gap-2"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                                        {district}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Secretariat & Contact Sheet */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Secretariat Contact Box */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0F1D]/80 space-y-4">
                            <h3 className="text-xs font-bold tracking-widest text-amber-400 uppercase pb-2 border-b border-white/10">
                                Official Secretariat
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Address</span>
                                    <span className="text-neutral-200 font-medium">{data.contactInfo.address}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Email</span>
                                    <span className="text-neutral-200 font-mono">{data.contactInfo.email}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Contact</span>
                                    <span className="text-neutral-200 font-mono">{data.contactInfo.phone}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Official Portal</span>
                                    <span className="text-neutral-200 font-mono">{data.contactInfo.website}</span>
                                </div>
                            </div>
                        </div>

                        {/* Executive Committee */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0F1D]/80 space-y-3">
                            <h3 className="text-xs font-bold tracking-widest text-neutral-400 uppercase pb-2 border-b border-white/10">
                                Executive Board
                            </h3>

                            <div className="space-y-2 text-xs">
                                {data.executiveCommittee.map((official) => (
                                    <div key={official.role} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                                        <span className="text-neutral-400">{official.role}</span>
                                        <span className="text-white font-semibold">{official.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
