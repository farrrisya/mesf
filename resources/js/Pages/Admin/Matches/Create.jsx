// --1. imports--
import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    Swords,
    Calendar,
    Clock,
    Trophy,
    MapPin,
    Tv,
    Check,
    AlertCircle
} from 'lucide-react';

// --2. properties--
const GAME_DISCIPLINES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Dota 2',
    'EA Sports FC',
    'Honor of Kings',
    'Tekken 8',
    'Counter-Strike 2'
];

const MATCH_FORMATS = [
    { value: 'BO1', label: 'Best of 1 (BO1)' },
    { value: 'BO3', label: 'Best of 3 (BO3)' },
    { value: 'BO5', label: 'Best of 5 (BO5)' },
    { value: 'BO7', label: 'Best of 7 (BO7)' }
];

const MATCH_ROUNDS = [
    'Regular Season / Group Stage',
    'Round of 16',
    'Quarter-Finals',
    'Semi-Finals',
    'Third Place Playoff',
    'Grand Finals',
    'Exhibition / Showmatch'
];

// --3. main component--
export default function Create() {
    const [isSubmitting, setIsSubmitting] = useState(false); // state
    const [showSuccess, setShowSuccess] = useState(false); // state

    const { data, setData } = useForm({ // state
        tournament_name: '',
        game_title: '',
        round: '',
        format: '',
        team_a_name: '',
        team_a_tag: '',
        team_b_name: '',
        team_b_tag: '',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: '',
        venue: '',
        stream_url: '',
        status: ''
    });

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        setIsSubmitting(true); // state
        setTimeout(() => { // clock
            setIsSubmitting(false); // state
            setShowSuccess(true); // state
            setTimeout(() => { // clock
                router.visit(route('admin.matches')); // redirect
            }, 1200);
        }, 600);
    };

    // --5. UI--
    return (
        <AdminLayout
            title="Schedule Match - MESF Admin"
            contentClassName="p-6 sm:p-8"
        >
            <Head title="Schedule Match - Admin" />

            <div className="w-full max-w-6xl pb-16">
                {/* back button */}
                <div className="mb-6 sm:mb-8 flex items-center">
                    <BackButton href={route('admin.matches')} label="Back to Matches" />
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">Match fixture scheduled successfully! Redirecting to matches dashboard...</span>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: fixture matchup details (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                                {/* tournament title & discipline */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                             Tournament / League Name <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.tournament_name} // state
                                            onChange={(e) => setData('tournament_name', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Game Discipline <span className="text-amber-400">*</span>
                                        </label>
                                        <select
                                            value={data.game_title} // state
                                            onChange={(e) => setData('game_title', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Game Discipline</option>
                                            {GAME_DISCIPLINES.map((game) => (
                                                <option key={game} value={game}>
                                                    {game}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* teams matchup card */}
                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                                    <div className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                                        Head-to-Head Competitors
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Team A */}
                                        <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
                                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
                                                Blue / Team A
                                            </span>
                                            <input
                                                type="text"
                                                required
                                                value={data.team_a_name} // state
                                                onChange={(e) => setData('team_a_name', e.target.value)} // trigger
                                                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/60 text-white text-xs font-semibold outline-none transition-all font-sans"
                                            />
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={data.team_a_tag} // state
                                                onChange={(e) => setData('team_a_tag', e.target.value.toUpperCase())} // trigger
                                                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/60 text-white text-xs font-mono font-bold uppercase outline-none transition-all font-sans"
                                            />
                                        </div>

                                        {/* Team B */}
                                        <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
                                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
                                                Red / Team B
                                            </span>
                                            <input
                                                type="text"
                                                required
                                                value={data.team_b_name} // state
                                                onChange={(e) => setData('team_b_name', e.target.value)} // trigger
                                                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/60 text-white text-xs font-semibold outline-none transition-all font-sans"
                                            />
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={data.team_b_tag} // state
                                                onChange={(e) => setData('team_b_tag', e.target.value.toUpperCase())} // trigger
                                                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/60 text-white text-xs font-mono font-bold uppercase outline-none transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* stage & format */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament Bracket / Stage
                                        </label>
                                        <select
                                            value={data.round} // state
                                            onChange={(e) => setData('round', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Tournament Stage</option>
                                            {MATCH_ROUNDS.map((r) => (
                                                <option key={r} value={r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Series Match Format
                                        </label>
                                        <select
                                            value={data.format} // state
                                            onChange={(e) => setData('format', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Match Format</option>
                                            {MATCH_FORMATS.map((f) => (
                                                <option key={f.value} value={f.value}>
                                                    {f.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right column: scheduling & broadcasting (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Schedule & Logistics
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Official start time and streaming location.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Match Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={data.scheduled_date} // state
                                        onChange={(e) => setData('scheduled_date', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Start Time (MYT)
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={data.scheduled_time} // state
                                        onChange={(e) => setData('scheduled_time', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Venue / Arena
                                    </label>
                                    <input
                                        type="text"
                                        value={data.venue} // state
                                        onChange={(e) => setData('venue', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Livestream URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.stream_url} // state
                                        onChange={(e) => setData('stream_url', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Match Status
                                    </label>
                                    <select
                                        value={data.status} // state
                                        onChange={(e) => setData('status', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all cursor-pointer font-sans"
                                    >
                                        <option value="">Choose Status</option>
                                        <option value="upcoming">Upcoming Fixture</option>
                                        <option value="live">Live Broadcasting</option>
                                        <option value="completed">Completed Match</option>
                                    </select>
                                </div>

                                <div className="pt-2 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting} // check
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Scheduling...' : 'Schedule Fixture'}
                                    </button>

                                    <Link
                                        href={route('admin.matches')} // redirect
                                        className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white font-semibold text-xs tracking-wider transition-all text-center block"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
