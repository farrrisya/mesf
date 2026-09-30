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

            {/* main body container */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24 text-left flex-1 space-y-8">
                
                {/* top navigation bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <BackButton href="/teams" label="Back to Directory" />
                        <span className="text-xs text-neutral-500 font-mono hidden sm:inline">/</span>
                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">
                            {team?.name || ''}
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
                                {team.status || ''}
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
                        {/* organized hero profile banner */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0E1629]/90 to-[#080D1A]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-8">
                            {/* subtle ambient background glow */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/[0.03] rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />

                            {/* top block: emblem + identity info */}
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 sm:gap-8">
                                
                                {/* team emblem badge */}
                                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-[#070B14]/90 border border-white/15 p-3 flex items-center justify-center shrink-0 shadow-xl overflow-hidden backdrop-blur-md">
                                    {team.logo ? (
                                        <img
                                            src={team.logo} // state
                                            alt={team.name || ''}
                                            className="h-full w-full object-contain filter drop-shadow"
                                        />
                                    ) : (
                                        <span className="text-2xl sm:text-3xl font-black tracking-widest text-amber-400 uppercase font-mono">
                                            {team.tag || getInitials(team.name, team.tag)}
                                        </span>
                                    )}
                                </div>

                                {/* team identity details */}
                                <div className="space-y-2.5 min-w-0 flex-1">
                                    {/* metadata pills row */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {team.tag && (
                                            <span className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 font-mono text-xs font-bold text-neutral-300">
                                                [{team.tag}]
                                            </span>
                                        )}
                                        {team.game_title && (
                                            <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
                                                {team.game_title}
                                            </span>
                                        )}
                                        {team.type && (
                                            <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300 text-xs font-medium">
                                                {getClassificationLabel(team.type)}
                                            </span>
                                        )}
                                    </div>

                                    {/* team name */}
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-tight">
                                        {team.name || ''}
                                    </h1>

                                    {/* motto / tagline */}
                                    {team.motto && (
                                        <p className="text-sm sm:text-base italic text-neutral-300 font-normal">
                                            &ldquo;{team.motto}&rdquo;
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* bottom block: structured metrics row */}
                            <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <Gamepad2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span>Primary Discipline</span>
                                    </span>
                                    <div className="text-sm font-bold text-white truncate min-h-[20px]">
                                        {team.game_title || ''}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>Registered Squad</span>
                                    </span>
                                    <div className="text-sm font-bold text-white min-h-[20px]">
                                        {team.roster_size ? `${team.roster_size} Athletes` : ''}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                        <span>Home Base</span>
                                    </span>
                                    <div className="text-sm font-bold text-white truncate min-h-[20px]">
                                        {team.region || ''}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>MESF Standing</span>
                                    </span>
                                    <div className="text-sm font-bold text-emerald-400 min-h-[20px]">
                                        {team.status || ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2-column balanced split: team specifications (left 8 cols) & general contact info (right 4 cols) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* left column (8 cols): specifications, roster capacity & compliance */}
                            <div className="lg:col-span-8 space-y-8">
                                
                                {/* 1. Club Identity & Specifications */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0B101D] shadow-xl space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <div>
                                            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                                Registry Intel
                                            </span>
                                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                                                Team Specifications
                                            </h2>
                                        </div>
                                        <span className="text-xs font-mono text-neutral-400">
                                            {team.id ? `MESF-ID #${team.id}` : ''}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                                                Team Full Name
                                            </span>
                                            <div className="text-sm font-semibold text-white min-h-[22px]">
                                                {team.name || ''}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                                                Tag / Acronym
                                            </span>
                                            <div className="text-sm font-bold text-white font-mono min-h-[22px]">
                                                {team.tag ? `[${team.tag}]` : ''}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                                                Classification
                                            </span>
                                            <div className="text-sm font-semibold text-white min-h-[22px]">
                                                {getClassificationLabel(team.type)}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                                                Primary Discipline
                                            </span>
                                            <div className="text-sm font-semibold text-white min-h-[22px] flex items-center gap-1.5">
                                                {team.game_title && <Gamepad2 className="w-4 h-4 text-amber-400 shrink-0" />}
                                                <span>{team.game_title || ''}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                                                State / Territory
                                            </span>
                                            <div className="text-sm font-semibold text-white min-h-[22px] flex items-center gap-1.5">
                                                {team.region && <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />}
                                                <span>{team.region || ''}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                                                Team Motto / Tagline
                                            </span>
                                            <div className="text-sm font-semibold text-white min-h-[22px]">
                                                {team.motto || ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Sanctioned Athlete Roster Capacity */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0B101D] shadow-xl space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <div>
                                            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                                Active Squad
                                            </span>
                                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                                                Sanctioned Roster
                                            </h2>
                                        </div>
                                        <span className="text-xs font-mono text-neutral-400 uppercase">
                                            {rosterSize} Registered Slots
                                        </span>
                                    </div>

                                    {/* clean grid of roster slots ready for team administration */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {Array.from({ length: rosterSize }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono text-[10px] font-bold text-neutral-300">
                                                        SLOT #{idx + 1}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                                        <UserCheck className="w-3 h-3 text-emerald-400" />
                                                        <span>Active</span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-neutral-300">
                                                        {team.tag ? `${team.tag[0]}${idx + 1}` : `A${idx + 1}`}
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0 flex-1">
                                                        <div className="text-xs font-bold text-white truncate">
                                                            Athlete Slot #{idx + 1}
                                                        </div>
                                                        <div className="text-[10px] text-neutral-400 font-mono truncate">
                                                            {team.game_title || 'Competitive'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Federation Sanction & Standards */}
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0B101D] shadow-xl space-y-4">
                                    <div className="border-b border-white/10 pb-3">
                                        <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                            Accreditation
                                        </span>
                                        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                                            Federation Sanction & Compliance
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Verified Entity</span>
                                            </div>
                                            <p className="text-[11px] text-neutral-400">
                                                Accredited under Malaysian national esports standards.
                                            </p>
                                        </div>

                                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Athlete Welfare</span>
                                            </div>
                                            <p className="text-[11px] text-neutral-400">
                                                Committed to MESF player protection guidelines.
                                            </p>
                                        </div>

                                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Fair Play Code</span>
                                            </div>
                                            <p className="text-[11px] text-neutral-400">
                                                Fully compliant with anti-doping & integrity protocols.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* right column (4 cols): general contact info & other teams directory */}
                            <aside className="lg:col-span-4 space-y-6">
                                
                                {/* Card 1: General Contact Info (aligned with Admin Management & Contacts) */}
                                <div className="p-6 rounded-2xl border border-white/10 bg-[#0B101D] shadow-xl space-y-5">
                                    <div className="border-b border-white/10 pb-3">
                                        <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                            Liaison
                                        </span>
                                        <h3 className="text-base font-black text-white uppercase tracking-tight">
                                            General Contact Info
                                        </h3>
                                        <p className="text-[11px] text-neutral-400 mt-0.5">
                                            Official management and communication channels
                                        </p>
                                    </div>

                                    <div className="space-y-3.5">
                                        {/* Team Manager / Captain */}
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <span className="text-neutral-400 block text-[10px] font-mono uppercase tracking-wider">
                                                Team Manager / Captain
                                            </span>
                                            <div className="text-white font-bold text-sm min-h-[22px]">
                                                {team.manager_name || ''}
                                            </div>
                                        </div>

                                        {/* Official Contact Email */}
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <span className="text-neutral-400 block text-[10px] font-mono uppercase tracking-wider">
                                                Official Contact Email
                                            </span>
                                            <div className="text-sm font-mono text-white min-h-[22px]">
                                                {team.contact_email ? (
                                                    <a
                                                        href={`mailto:${team.contact_email}`} // redirect
                                                        className="text-white hover:text-amber-400 flex items-center gap-1.5 transition-colors break-all"
                                                    >
                                                        <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                        <span>{team.contact_email}</span>
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Registered Base */}
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <span className="text-neutral-400 block text-[10px] font-mono uppercase tracking-wider">
                                                Operational Base
                                            </span>
                                            <div className="text-white font-semibold text-xs min-h-[20px] flex items-center gap-1.5">
                                                {team.region && <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                                                <span>{team.region || ''}</span>
                                            </div>
                                        </div>

                                        {/* Affiliation Standing */}
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <span className="text-neutral-400 block text-[10px] font-mono uppercase tracking-wider">
                                                Federation Standing
                                            </span>
                                            <div className="text-emerald-400 font-bold text-xs min-h-[20px] flex items-center gap-1.5">
                                                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>{team.status || ''}</span>
                                            </div>
                                        </div>

                                        {/* Direct Email Action Button */}
                                        {team.contact_email && (
                                            <div className="pt-1">
                                                <a
                                                    href={`mailto:${team.contact_email}`} // redirect
                                                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                    <span>Contact Management</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 2: Other Sanctioned Clubs Directory */}
                                {otherTeams && otherTeams.length > 0 && (
                                    <div className="p-6 rounded-2xl border border-white/10 bg-[#0B101D] shadow-xl space-y-4">
                                        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                                            <div>
                                                <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                                                    Directory
                                                </span>
                                                <h3 className="text-base font-black text-white uppercase tracking-tight">
                                                    Other Sanctioned Clubs
                                                </h3>
                                            </div>
                                            <Link
                                                href="/teams" // redirect
                                                className="text-[11px] font-mono text-neutral-400 hover:text-amber-400 transition-colors"
                                            >
                                                View All
                                            </Link>
                                        </div>

                                        <div className="space-y-2">
                                            {otherTeams.map((t) => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => router.visit(t.slug ? `/teams/${t.slug}` : `/teams/details?slug=${t.id}`)} // redirect
                                                    className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 flex items-center justify-between text-xs transition-colors group cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-300 shrink-0 overflow-hidden">
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
                                                            <div className="font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                                                {t.name || ''}
                                                            </div>
                                                            <div className="text-[10px] font-mono text-neutral-500 truncate">
                                                                {t.game_title || t.region || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0 transition-colors ml-2" />
                                                </button>
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
