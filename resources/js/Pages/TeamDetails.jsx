// --1. imports--
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';
import { Shield, Trophy, Users, Globe, ExternalLink, Calendar, MapPin, Award, CheckCircle, Mail } from 'lucide-react';

// --2. properties--

// --3. main component--
export default function TeamDetails({ team = null, otherTeams = [] }) {
    // --4. actions--

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title={team ? `${team.name} - Team Profile - MESF` : 'Team Profile - MESF'} />

            {/* ambient background glows */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
            <div className="pointer-events-none absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[150px]" />

            {/* grain overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* main body container */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-24 text-left flex-1">
                {/* top navigation bar */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <BackButton href="/teams" label="Back to Team Directory" />

                    {team && (
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Official MESF Sanctioned Team</span>
                        </div>
                    )}
                </div>

                {!team ? (
                    <div className="p-12 sm:p-16 rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-neutral-300 shadow-inner">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div className="space-y-2 max-w-md mx-auto">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                                No Team Profile Found
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                This team profile has not been uploaded or registered by administration yet. Check back once team details are published.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/teams"
                                className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-md"
                            >
                                <span>Browse Team Directory</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* elevated team marquee hero box */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-2xl p-8 sm:p-12 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                            {/* top edge luminous highlight beam */}
                            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" />

                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                {/* emblem monogram & name block */}
                                <div className="flex items-center gap-6 sm:gap-8">
                                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-black/75 border border-white/20 flex items-center justify-center shrink-0 p-3 shadow-inner ring-1 ring-white/10 overflow-hidden">
                                        {team.logo ? (
                                            <img
                                                src={team.logo}
                                                alt={team.name}
                                                className="h-full w-full object-contain filter drop-shadow"
                                            />
                                        ) : (
                                            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase font-mono">
                                                {team.tag}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                                                {team.status || 'Active'}
                                            </span>
                                            <span className="text-neutral-500 text-xs">•</span>
                                            <span className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                                                <span>{team.flag || '🇲🇾'}</span>
                                                <span>{team.region || 'Malaysia'}</span>
                                            </span>
                                        </div>
                                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                                            {team.name}
                                        </h1>
                                        {team.motto && (
                                            <p className="text-sm italic text-neutral-300 font-normal">
                                                &ldquo;{team.motto}&rdquo;
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* high-level stats pills */}
                                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                                    <div className="px-5 py-3.5 rounded-2xl border border-white/10 bg-[#070b14]/80 min-w-[130px] shadow-inner">
                                        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Discipline</span>
                                        <span className="text-sm sm:text-base font-bold text-white">{team.primaryGame}</span>
                                    </div>
                                    <div className="px-5 py-3.5 rounded-2xl border border-white/10 bg-[#070b14]/80 min-w-[110px] shadow-inner">
                                        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Status</span>
                                        <span className="text-sm sm:text-base font-bold text-emerald-400">{team.status || 'Active'}</span>
                                    </div>
                                    {team.created && (
                                        <div className="px-5 py-3.5 rounded-2xl border border-white/10 bg-[#070b14]/80 min-w-[90px] shadow-inner">
                                            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Est.</span>
                                            <span className="text-sm sm:text-base font-bold text-white">{team.created}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2-column split: team info (left) & metadata (right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
                            {/* left column (8 cols): team intel & details */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-6">
                                    <div className="space-y-1">
                                        <span className="text-xs font-black tracking-widest text-neutral-400 uppercase block">
                                            Organization Intel
                                        </span>
                                        <h2 className="text-2xl font-black text-white tracking-tight">
                                            {team.name}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner space-y-1">
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                                Competitive Title
                                            </span>
                                            <span className="text-sm font-semibold text-white">
                                                {team.primaryGame}
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner space-y-1">
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                                Club Tag
                                            </span>
                                            <span className="text-sm font-bold text-white font-mono">
                                                [{team.tag}]
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner space-y-1">
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                                Registered Region
                                            </span>
                                            <span className="text-sm font-semibold text-white">
                                                {team.region}
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner space-y-1">
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                                Squad Capacity
                                            </span>
                                            <span className="text-sm font-semibold text-white">
                                                {team.roster_size} Registered Players
                                            </span>
                                        </div>
                                    </div>

                                    {team.motto && (
                                        <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 space-y-1 shadow-inner">
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                                Team Motto
                                            </span>
                                            <p className="text-sm italic text-neutral-200">
                                                &ldquo;{team.motto}&rdquo;
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* right column (4 cols): organization details & other teams */}
                            <aside className="lg:col-span-4 space-y-6">
                                <div className="p-6 sm:p-7 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-5">
                                    <h3 className="text-sm font-black tracking-widest text-white uppercase pb-3 border-b border-white/10">
                                        Management & Registry
                                    </h3>

                                    <div className="space-y-4 text-xs sm:text-sm">
                                        {team.manager && (
                                            <div className="p-3 rounded-xl bg-[#070b14]/70 border border-white/5">
                                                <span className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">Team Manager</span>
                                                <span className="text-white font-bold">{team.manager}</span>
                                            </div>
                                        )}

                                        {team.contact_email && (
                                            <div className="p-3 rounded-xl bg-[#070b14]/70 border border-white/5">
                                                <span className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">Contact Email</span>
                                                <a href={`mailto:${team.contact_email}`} className="text-white hover:text-neutral-300 font-mono text-xs break-all flex items-center gap-1.5 mt-0.5">
                                                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                                                    <span>{team.contact_email}</span>
                                                </a>
                                            </div>
                                        )}

                                        <div className="p-3 rounded-xl bg-[#070b14]/70 border border-white/5">
                                            <span className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">MESF Sanction Status</span>
                                            <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Sanctioned Official Team
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* explore other teams quick list from DB */}
                                {otherTeams && otherTeams.length > 0 && (
                                    <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-3">
                                        <span className="text-xs font-black tracking-widest text-neutral-300 uppercase block">
                                            Explore Other Teams
                                        </span>
                                        <div className="space-y-2">
                                            {otherTeams.map((t) => (
                                                <Link
                                                    key={t.id}
                                                    href={`/teams/details?slug=${t.slug || t.id}`}
                                                    className="p-2.5 rounded-xl bg-[#070b14]/70 hover:bg-white/10 border border-white/5 hover:border-white/20 flex items-center justify-between text-xs transition-all group block"
                                                >
                                                    <span className="font-bold text-white group-hover:text-neutral-200 truncate">
                                                        {t.name}
                                                    </span>
                                                    <span className="text-neutral-400 font-mono text-[11px] shrink-0">
                                                        [{t.tag}]
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </aside>
                        </div>
                    </>
                )}
            </main>

            {/* footer */}
            <Footer />
        </div>
    );
}
