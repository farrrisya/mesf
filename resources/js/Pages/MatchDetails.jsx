// --1. imports--
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';
import {
    Swords,
    Calendar,
    Clock,
    MapPin,
    Tv,
    Trophy,
    Share2,
    Check,
    ChevronRight,
    Shield,
    Users,
    Flame,
    ExternalLink,
    Radio
} from 'lucide-react';

// --3. main component--
export default function MatchDetails({ match = null, otherMatches = [] }) {
    // --4. actions--
    const currentMatch = match; // state
    const [copied, setCopied] = useState(false); // state
    const [activeTab, setActiveTab] = useState('overview'); // state

    const isLive = Boolean(currentMatch && (currentMatch.status || '').toUpperCase().includes('LIVE')); // check
    const isCompleted = Boolean(currentMatch && ((currentMatch.status || '').toUpperCase().includes('COMPLETED') ||
        (currentMatch.status || '').toUpperCase().includes('RESULT'))); // check
    const isUpcoming = Boolean(currentMatch && !isLive && !isCompleted); // check

    // format games count from BO format
    const totalGames = (() => { // convert
        if (!currentMatch) return 3;
        const fmt = (currentMatch.format || '').toUpperCase();
        if (fmt.includes('BO1')) return 1;
        if (fmt.includes('BO3')) return 3;
        if (fmt.includes('BO5')) return 5;
        if (fmt.includes('BO7')) return 7;
        return 3;
    })();

    const handleShare = () => { // trigger
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href); // save
            setCopied(true); // state
            setTimeout(() => setCopied(false), 2000); // clock
        }
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title={currentMatch ? `${currentMatch.team_a?.name} vs ${currentMatch.team_b?.name} - ${currentMatch.tournament_name} - MESF` : 'Match Details - MESF'} />

            {/* ambient background glows */}
            <div className="pointer-events-none fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[150px] z-0" />
            <div className="pointer-events-none fixed top-1/3 -right-20 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[160px] z-0" />
            <div className="pointer-events-none fixed bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[160px] z-0" />



            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="matches" />
            </div>

            {/* main body container */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-20 sm:pt-22 pb-16 flex-1">
                {/* top bar: back button + share */}
                <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-4">
                    <BackButton href="/matches" label="Back" />

                    {currentMatch && (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleShare} // trigger
                                className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400 font-bold">Link Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>Share Match</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {!currentMatch ? (
                    <div className="p-12 sm:p-16 rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-neutral-300 shadow-inner">
                            <Swords className="w-8 h-8" />
                        </div>
                        <div className="space-y-2 max-w-md mx-auto">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                                No Match Available
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                This match has not been published or scheduled by the administration yet. Check back soon for upcoming tournaments and schedules.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/matches"
                                className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-md"
                            >
                                <span>Browse All Matches</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>

                {/* match marquee hero banner */}
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-2xl p-5 sm:p-7 md:p-8 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                    {/* top edge luminous highlight beam */}
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" />

                    {/* tournament meta eyebrow & status pill */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5 sm:mb-6">
                        <div className="space-y-1.5">
                            <span className="text-xs font-black tracking-widest text-neutral-400 uppercase block">
                                {currentMatch.tournament_name}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-medium">
                                <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white font-extrabold text-[11px] uppercase tracking-wider border border-white/15">
                                    {currentMatch.game_title}
                                </span>
                                <span>•</span>
                                <span className="text-neutral-200 font-bold">{currentMatch.round}</span>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded-md bg-[#070b14] border border-white/10 text-white font-mono text-[11px] font-bold">
                                    {currentMatch.format}
                                </span>
                            </div>
                        </div>

                        {/* match status pill */}
                        <div>
                            {isLive ? (
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-pulse">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    Live Now
                                </span>
                            ) : isCompleted ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 border border-white/15 text-neutral-300">
                                    Concluded
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#090d18] border border-white/15 text-neutral-200 shadow-inner">
                                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                    Upcoming Match
                                </span>
                            )}
                        </div>
                    </div>

                    {/* teams showdown arena grid */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-11 gap-4 sm:gap-6 items-center py-1 sm:py-2">
                        {/* team A side (left) */}
                        <div className="md:col-span-4 flex flex-col md:flex-row items-center md:justify-end gap-5 text-center md:text-right">
                            <div className="space-y-1.5 order-2 md:order-1">
                                <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase block font-mono">
                                    [{currentMatch.team_a?.tag || 'TMA'}]
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                                    {currentMatch.team_a?.name}
                                </h2>
                                <p className="text-xs text-neutral-400">
                                    {currentMatch.team_a?.region || 'Malaysia'}
                                </p>
                            </div>

                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 p-3 shadow-inner ring-1 ring-white/10 relative order-1 md:order-2">
                                {currentMatch.team_a?.logo ? (
                                    <img
                                        src={currentMatch.team_a.logo}
                                        alt={currentMatch.team_a.name}
                                        className="h-16 w-16 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                                    />
                                ) : (
                                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center">
                                        <span className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase font-mono">
                                            {currentMatch.team_a?.tag || 'A'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* center score / VS block */}
                        <div className="md:col-span-3 flex flex-col items-center justify-center text-center px-2 py-4">
                            {isCompleted || isLive ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-3 sm:gap-4 px-5 py-3 rounded-2xl bg-black/80 border border-white/20 shadow-inner">
                                        <span className="text-4xl sm:text-5xl font-black text-white">
                                            {currentMatch.team_a?.score ?? 0}
                                        </span>
                                        <span className="text-xl sm:text-2xl text-neutral-600 font-light">:</span>
                                        <span className="text-4xl sm:text-5xl font-black text-white">
                                            {currentMatch.team_b?.score ?? 0}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400 block font-mono">
                                        {isLive ? 'CURRENT SCORE' : 'FINAL RESULT'}
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-black/80 border border-white/20 text-neutral-200 text-lg font-black tracking-widest shadow-inner">
                                        VS
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-base sm:text-lg font-black text-white tracking-wider">
                                            {currentMatch.scheduled_time}
                                        </div>
                                        <div className="text-xs text-neutral-400 font-medium">
                                            {currentMatch.formatted_date}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* team B side (right) */}
                        <div className="md:col-span-4 flex flex-col md:flex-row items-center md:justify-start gap-5 text-center md:text-left">
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 p-3 shadow-inner ring-1 ring-white/10 relative">
                                {currentMatch.team_b?.logo ? (
                                    <img
                                        src={currentMatch.team_b.logo}
                                        alt={currentMatch.team_b.name}
                                        className="h-16 w-16 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                                    />
                                ) : (
                                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center">
                                        <span className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase font-mono">
                                            {currentMatch.team_b?.tag || 'B'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase block font-mono">
                                    [{currentMatch.team_b?.tag || 'TMB'}]
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                                    {currentMatch.team_b?.name}
                                </h2>
                                <p className="text-xs text-neutral-400">
                                    {currentMatch.team_b?.region || 'Malaysia'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* bottom action / venue stripe */}
                    <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                            <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span>
                                Venue: <strong className="text-white font-semibold">{currentMatch.venue}</strong>
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {currentMatch.stream_url && (
                                <a
                                    href={currentMatch.stream_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
                                >
                                    <Tv className="w-3.5 h-3.5" />
                                    <span>Watch Live Stream</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}

                            <Link
                                href="/matches"
                                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-all"
                            >
                                <span>All Matches</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* tab navigation */}
                <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('overview')} // trigger
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === 'overview'
                                ? 'bg-white text-black shadow-md border border-white font-extrabold'
                                : 'bg-[#0e1628] border border-white/15 text-neutral-300 hover:text-white hover:bg-[#131d33]'
                        }`}
                    >
                        Match Overview
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('teams')} // trigger
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === 'teams'
                                ? 'bg-white text-black shadow-md border border-white font-extrabold'
                                : 'bg-[#0e1628] border border-white/15 text-neutral-300 hover:text-white hover:bg-[#131d33]'
                        }`}
                    >
                        Head-to-Head Teams
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('format')} // trigger
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === 'format'
                                ? 'bg-white text-black shadow-md border border-white font-extrabold'
                                : 'bg-[#0e1628] border border-white/15 text-neutral-300 hover:text-white hover:bg-[#131d33]'
                        }`}
                    >
                        Series Breakdown
                    </button>
                </div>

                {/* tab content 1: match overview */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* left column (8 cols): match intel & stream */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* broadcast stream feature box */}
                            {currentMatch.stream_url && (
                                <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <Radio className="w-5 h-5 animate-pulse" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white tracking-tight">
                                                    Official Tournament Broadcast
                                                </h3>
                                                <p className="text-xs text-neutral-400">
                                                    Sanctioned stream feed provided by MESF Production
                                                </p>
                                            </div>
                                        </div>

                                        <a
                                            href={currentMatch.stream_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                                        >
                                            <Tv className="w-3.5 h-3.5" />
                                            <span>Watch Feed</span>
                                        </a>
                                    </div>

                                    <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-300">
                                        <span className="font-mono text-neutral-400 break-all">
                                            {currentMatch.stream_url}
                                        </span>
                                        <span className="shrink-0 text-emerald-400 font-bold">
                                            HD 1080p 60fps Broadcast
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* key match specs */}
                            <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-6">
                                <h3 className="text-lg font-black text-white tracking-tight uppercase">
                                    Match Information & Rules
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner">
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                            Competition
                                        </span>
                                        <span className="text-sm font-semibold text-white">
                                            {currentMatch.tournament_name}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner">
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                            Game Discipline
                                        </span>
                                        <span className="text-sm font-bold text-white">
                                            {currentMatch.game_title}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner">
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                            Bracket Stage
                                        </span>
                                        <span className="text-sm font-semibold text-white">
                                            {currentMatch.round}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner">
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                            Match Series Format
                                        </span>
                                        <span className="text-sm font-semibold text-white">
                                            {currentMatch.format} (Best of {totalGames})
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner">
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                            Scheduled Date
                                        </span>
                                        <span className="text-sm font-semibold text-white">
                                            {currentMatch.formatted_date}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/10 bg-[#070b14]/80 shadow-inner">
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                            Scheduled Time
                                        </span>
                                        <span className="text-sm font-semibold text-white">
                                            {currentMatch.scheduled_time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right column (4 cols): arena & sanctioning */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* venue & location card */}
                            <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Venue Information</h4>
                                        <p className="text-xs text-neutral-400">Official match arena</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-[#070b14]/80 border border-white/10 space-y-2 shadow-inner">
                                    <span className="text-xs text-neutral-400 block font-medium">Location</span>
                                    <p className="text-sm font-bold text-white leading-snug">
                                        {currentMatch.venue}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* tab content 2: head-to-head teams */}
                {activeTab === 'teams' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* team A card */}
                        <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-6">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 rounded-xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 p-2 shadow-inner">
                                    {currentMatch.team_a?.logo ? (
                                        <img src={currentMatch.team_a.logo} alt={currentMatch.team_a.name} className="h-12 w-12 object-contain" />
                                    ) : (
                                        <span className="text-xl font-black text-white font-mono">
                                            {currentMatch.team_a?.tag || 'A'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                                        [{currentMatch.team_a?.tag || 'TMA'}]
                                    </span>
                                    <h3 className="text-xl font-black text-white">
                                        {currentMatch.team_a?.name}
                                    </h3>
                                    <p className="text-xs text-neutral-400">
                                        {currentMatch.team_a?.region || 'Malaysia'}
                                    </p>
                                </div>
                            </div>

                            {currentMatch.team_a?.motto && (
                                <p className="text-xs italic text-neutral-300 bg-[#070b14]/70 p-3 rounded-xl border border-white/10">
                                    &ldquo;{currentMatch.team_a.motto}&rdquo;
                                </p>
                            )}

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-neutral-400">Team Lead / Manager</span>
                                    <span className="text-white font-semibold">{currentMatch.team_a?.manager || 'Official Management'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-neutral-400">Active Discipline</span>
                                    <span className="text-white font-semibold">{currentMatch.game_title}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-neutral-400">Competitive Status</span>
                                    <span className="text-neutral-200 font-semibold">Active</span>
                                </div>
                            </div>

                            <Link
                                href="/teams"
                                className="w-full py-2.5 rounded-xl border border-white/15 hover:border-white/30 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                            >
                                <span>View Team Directory</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* team B card */}
                        <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-6">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 rounded-xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 p-2 shadow-inner">
                                    {currentMatch.team_b?.logo ? (
                                        <img src={currentMatch.team_b.logo} alt={currentMatch.team_b.name} className="h-12 w-12 object-contain" />
                                    ) : (
                                        <span className="text-xl font-black text-white font-mono">
                                            {currentMatch.team_b?.tag || 'B'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                                        [{currentMatch.team_b?.tag || 'TMB'}]
                                    </span>
                                    <h3 className="text-xl font-black text-white">
                                        {currentMatch.team_b?.name}
                                    </h3>
                                    <p className="text-xs text-neutral-400">
                                        {currentMatch.team_b?.region || 'Malaysia'}
                                    </p>
                                </div>
                            </div>

                            {currentMatch.team_b?.motto && (
                                <p className="text-xs italic text-neutral-300 bg-[#070b14]/70 p-3 rounded-xl border border-white/10">
                                    &ldquo;{currentMatch.team_b.motto}&rdquo;
                                </p>
                            )}

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-neutral-400">Team Lead / Manager</span>
                                    <span className="text-white font-semibold">{currentMatch.team_b?.manager || 'Official Management'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-neutral-400">Active Discipline</span>
                                    <span className="text-white font-semibold">{currentMatch.game_title}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-neutral-400">Competitive Status</span>
                                    <span className="text-neutral-200 font-semibold">Active</span>
                                </div>
                            </div>

                            <Link
                                href="/teams"
                                className="w-full py-2.5 rounded-xl border border-white/15 hover:border-white/30 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                            >
                                <span>View Team Directory</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* tab content 3: series breakdown */}
                {activeTab === 'format' && (
                    <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white tracking-tight uppercase">
                                {currentMatch.format} Match Progression Schedule
                            </h3>
                            <p className="text-xs text-neutral-400">
                                Match timeline breakdown across all scheduled games in this series
                            </p>
                        </div>

                        <div className="space-y-3">
                            {Array.from({ length: totalGames }).map((_, idx) => {
                                const gameNum = idx + 1;
                                const isGameCompleted = isCompleted || (currentMatch.team_a?.score + currentMatch.team_b?.score >= gameNum);
                                return (
                                    <div
                                        key={gameNum}
                                        className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#070b14]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 text-white font-mono font-bold text-xs flex items-center justify-center">
                                                G{gameNum}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">
                                                    Game {gameNum}
                                                </h4>
                                                <p className="text-xs text-neutral-400">
                                                    {currentMatch.game_title} • Standard Tournament Pick/Ban
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                isGameCompleted
                                                    ? 'bg-white/10 text-neutral-300 border border-white/10'
                                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                            }`}>
                                                {isGameCompleted ? 'Completed' : 'Scheduled'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* up next / other matches carousel */}
                {otherMatches && otherMatches.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">
                                    Other Scheduled Matches
                                </h3>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Upcoming matches in current MESF circuits
                                </p>
                            </div>
                            <Link
                                href="/matches"
                                className="text-xs font-bold text-white hover:text-neutral-300 inline-flex items-center gap-1 uppercase tracking-wider"
                            >
                                <span>View Full Schedule</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {otherMatches.map((om) => (
                                <Link
                                    key={om.id}
                                    href={`/matches/${om.id}`}
                                    className="p-5 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] hover:border-white/30 hover:bg-[#121b30] shadow-lg transition-all duration-200 block space-y-3 group"
                                >
                                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                                        <span className="text-white font-bold">{om.game_title}</span>
                                        <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300">{om.format}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 py-2">
                                        <span className="text-sm font-bold text-white truncate max-w-[42%] group-hover:text-neutral-200 transition-colors">
                                            {om.team_a_name}
                                        </span>
                                        <span className="text-[10px] font-black uppercase text-neutral-400 px-2 py-0.5 rounded bg-black/60 border border-white/10 shrink-0">
                                            VS
                                        </span>
                                        <span className="text-sm font-bold text-white truncate max-w-[42%] text-right group-hover:text-neutral-200 transition-colors">
                                            {om.team_b_name}
                                        </span>
                                    </div>

                                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                                        <span>{om.formatted_date}</span>
                                        <span className="text-white font-semibold">{om.scheduled_time}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                    </>
                )}
            </main>

            {/* footer */}
            <Footer />
        </div>
    );
}
