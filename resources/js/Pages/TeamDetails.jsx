// --1. imports--
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';
import { Shield, Users, Gamepad2, MapPin, Mail, ArrowUpRight, CheckCircle2, UserCheck, Send, Trophy, Globe } from 'lucide-react';

// --2. helpers--
function getInitials(name = '', tag = '') { // convert
    if (tag && tag.length <= 4) return tag; // check
    const words = (name || '').trim().split(/\s+/); // convert
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase(); // check
    return ((name || '').slice(0, 3) || 'MY').toUpperCase(); // convert
}

function getClassificationLabel(type = '') { // convert
    if (type === 'national') return 'National Team'; // check
    if (type === 'state') return 'State Affiliate'; // check
    if (type === 'pro') return 'Club / Pro Team'; // check
    return ''; // check
}

// --3. main component--
export default function TeamDetails({ team = null, otherTeams = [] }) {
    // --4. actions--
    const isActive = (team?.status || '').toUpperCase() === 'ACTIVE'; // check
    const isPending = (team?.status || '').toUpperCase() === 'PENDING'; // check
    const rosterSize = team?.roster_size ? parseInt(team.roster_size, 10) : 5; // convert

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title={team?.name ? `${team.name} - Team Profile - MESF` : 'Team Profile - MESF'} />

            {/* ambient background glows */}
            <div className="pointer-events-none fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[160px]" />
            <div className="pointer-events-none fixed top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-amber-400/[0.04] blur-[160px]" />

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* main body container with generous top breathing room below floating navbar */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-20 sm:pb-24 text-left flex-1 space-y-8 sm:space-y-10">
                
                {/* top navigation bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <BackButton href="/teams" label="Back" />
                        <span className="text-xs text-neutral-500 font-mono hidden sm:inline">/</span>
                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">
                            {team?.name || 'Profile'}
                        </span>
                    </div>

                    {team && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    isActive ? 'bg-emerald-400 animate-pulse' : isPending ? 'bg-amber-400' : 'bg-neutral-500'
                                }`}
                            />
                            <span className={isActive ? 'text-emerald-400' : isPending ? 'text-amber-300' : 'text-neutral-400'}>
                                {team.status || 'Active Roster'}
                            </span>
                        </div>
                    )}
                </div>

                {!team ? (
                    <div className="p-12 sm:p-16 rounded-3xl border border-white/10 bg-[#0B101D] text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div className="space-y-2 max-w-md mx-auto">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                                No Team Profile Found
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                Please choose a team from the directory to review its profile and credentials.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/teams" // redirect
                                className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-md"
                            >
                                <span>Browse Directory</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* clean, focused hero profile header */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0E1629]/95 via-[#0A1020]/90 to-[#070C18]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-6">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7 min-w-0">
                                    {/* team emblem badge */}
                                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-[#060913] border border-white/15 p-3 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
                                        {team.logo ? (
                                            <img
                                                src={team.logo} // state
                                                alt={team.name || ''}
                                                className="h-full w-full object-contain filter drop-shadow-md"
                                            />
                                        ) : (
                                            <span className="text-3xl font-black tracking-widest text-amber-400 uppercase font-mono">
                                                {team.tag || getInitials(team.name, team.tag)}
                                            </span>
                                        )}
                                    </div>

                                    {/* team identity details */}
                                    <div className="space-y-2 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {team.tag && (
                                                <span className="px-2.5 py-0.5 rounded-md bg-[#060913] border border-white/10 font-mono text-xs font-bold text-amber-300">
                                                    [{team.tag}]
                                                </span>
                                            )}
                                            {team.game_title && (
                                                <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                                                    <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>{team.game_title}</span>
                                                </span>
                                            )}
                                            <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300 text-xs font-medium">
                                                {getClassificationLabel(team.type)}
                                            </span>
                                        </div>

                                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase truncate">
                                            {team.name}
                                        </h1>

                                        {team.motto && (
                                            <p className="text-xs sm:text-sm text-neutral-400 font-medium italic max-w-2xl leading-relaxed">
                                                &ldquo;{team.motto}&rdquo;
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick action button: Contact Management */}
                                {team.contact_email && (
                                    <div className="shrink-0 flex items-center">
                                        <a
                                            href={`mailto:${team.contact_email}`} // redirect
                                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(251,191,36,0.25)] transition-all cursor-pointer whitespace-nowrap"
                                        >
                                            <Mail className="w-4 h-4 text-black" />
                                            <span>Contact Team</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* bottom metrics row (single, clean summary strip) */}
                            <div className="relative z-10 pt-5 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-0.5">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <Gamepad2 className="w-3 h-3 text-amber-400 shrink-0" />
                                        <span>Discipline</span>
                                    </span>
                                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                                        {team.game_title || 'Multi-Title'}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-0.5">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <Users className="w-3 h-3 text-sky-400 shrink-0" />
                                        <span>Squad Size</span>
                                    </span>
                                    <div className="text-xs sm:text-sm font-bold text-white">
                                        {rosterSize} Athletes
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-0.5">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                                        <span>Home Base</span>
                                    </span>
                                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                                        {team.region || 'Malaysia'}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-0.5">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                                        <span>MESF Standing</span>
                                    </span>
                                    <div className="text-xs sm:text-sm font-bold text-emerald-400 truncate">
                                        {team.status || 'Active Roster'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2-Column Clean Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                            {/* Left Column (8 cols): Roster & Federation Compliance */}
                            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                                
                                {/* Card 1: Sanctioned Athlete Roster */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#090E1A]/80 shadow-xl space-y-5">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <div>
                                            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                                Official Lineup
                                            </span>
                                            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                                                Sanctioned Athlete Roster
                                            </h2>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300">
                                            {rosterSize} Active Athletes
                                        </span>
                                    </div>

                                    {/* athlete slots grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {Array.from({ length: rosterSize }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-2.5"
                                            >
                                                <div className="flex items-center justify-between text-[10px] font-mono">
                                                    <span className="px-2 py-0.5 rounded bg-white/[0.06] text-neutral-300 font-bold">
                                                        SLOT #{idx + 1}
                                                    </span>
                                                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        Active
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
                                                        {team.tag ? `${team.tag.slice(0, 2)}${idx + 1}` : `A${idx + 1}`}
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0 flex-1">
                                                        <div className="text-xs font-bold text-white truncate">
                                                            Athlete Slot #{idx + 1}
                                                        </div>
                                                        <div className="text-[10px] text-neutral-400 font-mono truncate">
                                                            {team.game_title || 'Competitive Player'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Card 2: Federation Accreditation & Compliance */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#090E1A]/80 shadow-xl space-y-4">
                                    <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                                Governance
                                            </span>
                                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
                                                Federation Sanction & Standards
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span>Accredited</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>Verified Entity</span>
                                            </div>
                                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                                                Accredited under Malaysian national esports standards.
                                            </p>
                                        </div>

                                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>Athlete Welfare</span>
                                            </div>
                                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                                                Protected by official MESF player protection guidelines.
                                            </p>
                                        </div>

                                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>Fair Play Code</span>
                                            </div>
                                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                                                Compliant with national anti-doping & competitive integrity.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column (4 cols): Management & Directory */}
                            <aside className="lg:col-span-4 space-y-6">
                                
                                {/* Card 1: Official Management Info */}
                                <div className="p-6 rounded-2xl border border-white/10 bg-[#090E1A]/80 shadow-xl space-y-4">
                                    <div className="border-b border-white/10 pb-3">
                                        <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                            Management
                                        </span>
                                        <h3 className="text-base font-black text-white uppercase tracking-tight">
                                            Official Administration
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                                                Team Manager
                                            </span>
                                            <div className="text-sm font-bold text-white">
                                                {team.manager_name || 'Assigned Official'}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                                                Operational Headquarters
                                            </span>
                                            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                                <span>{team.region || 'Malaysia'}</span>
                                            </div>
                                        </div>

                                        {team.contact_email && (
                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                                                    Contact Email
                                                </span>
                                                <a
                                                    href={`mailto:${team.contact_email}`} // redirect
                                                    className="text-xs font-mono text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1.5 break-all transition-colors"
                                                >
                                                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                    <span>{team.contact_email}</span>
                                                </a>
                                            </div>
                                        )}

                                        {team.contact_email && (
                                            <div className="pt-1">
                                                <a
                                                    href={`mailto:${team.contact_email}`} // redirect
                                                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                    <span>Send Message</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 2: Other Sanctioned Clubs Directory */}
                                {otherTeams && otherTeams.length > 0 && (
                                    <div className="p-6 rounded-2xl border border-white/10 bg-[#090E1A]/80 shadow-xl space-y-4">
                                        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                                            <div>
                                                <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                                    Directory
                                                </span>
                                                <h3 className="text-base font-black text-white uppercase tracking-tight">
                                                    Other Teams
                                                </h3>
                                            </div>
                                            <Link
                                                href="/teams" // redirect
                                                className="text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
                                            >
                                                View All &rarr;
                                            </Link>
                                        </div>

                                        <div className="space-y-2">
                                            {otherTeams.map((t) => (
                                                <Link
                                                    key={t.id}
                                                    href={`/teams/${t.slug || t.id}`} // redirect
                                                    className="w-full p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-amber-400/30 flex items-center justify-between text-xs transition-colors group cursor-pointer block"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-300 shrink-0 overflow-hidden group-hover:border-amber-400/40">
                                                            {t.logo ? (
                                                                <img
                                                                    src={t.logo} // state
                                                                    alt={t.name || ''}
                                                                    className="h-full w-full object-contain"
                                                                />
                                                            ) : (
                                                                <span>{t.tag || getInitials(t.name, t.tag)}</span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-bold text-white group-hover:text-amber-400 truncate transition-colors">
                                                                {t.name}
                                                            </div>
                                                            <div className="text-[10px] text-neutral-400 truncate font-mono">
                                                                {t.game_title || t.region || 'National'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 shrink-0 transition-colors" />
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
