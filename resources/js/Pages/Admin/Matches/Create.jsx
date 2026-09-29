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
    Layers,
    ShieldAlert
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
    const [showSuccess, setShowSuccess] = useState(false); // state

    const { data, setData, post, processing, errors } = useForm({ // state
        tournament_name: '',
        game_title: '',
        round: 'Regular Season / Group Stage',
        format: 'BO3',
        team_a_name: '',
        team_a_tag: '',
        team_a_score: '',
        team_b_name: '',
        team_b_tag: '',
        team_b_score: '',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: '20:00',
        venue: 'Online Arena',
        stream_url: '',
        status: 'UPCOMING'
    });

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        post(route('admin.matches.store'), { // save
            onSuccess: () => { // trigger
                setShowSuccess(true); // state
                setTimeout(() => { // clock
                    router.visit(route('admin.matches')); // redirect
                }, 800);
            },
        });
    };

    // --5. UI--
    return (
        <AdminLayout
            title="Schedule Match - MESF Admin"
            contentClassName="p-6 sm:p-8"
        >
            <Head title="Schedule Match - Admin" />

            <div className="w-full max-w-6xl pb-16 space-y-6">
                {/* header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <BackButton href={route('admin.matches')} label="Back to Matches" />
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-400/10 border border-amber-400/20 text-amber-400">
                            New Fixture
                        </span>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Schedule Match Fixture
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Configure tournament stage, competing teams, match schedule, and live broadcast information.
                        </p>
                    </div>
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">Match fixture scheduled successfully! Redirecting to matches dashboard...</span>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: tournament & competitors (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Card 1: Tournament & Discipline */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-white tracking-wide">
                                            Tournament & Discipline
                                        </h2>
                                        <p className="text-[11px] text-slate-400">
                                            Specify league name, game title, format, and bracket stage
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* tournament name */}
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament / League Name <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. MESF National Championship 2026"
                                            value={data.tournament_name} // state
                                            onChange={(e) => setData('tournament_name', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm outline-none transition-all font-sans"
                                        />
                                        {errors.tournament_name && (
                                            <p className="text-xs text-rose-400 font-medium">{errors.tournament_name}</p>
                                        )}
                                    </div>

                                    {/* game discipline */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Game Discipline <span className="text-amber-400">*</span>
                                        </label>
                                        <select
                                            value={data.game_title} // state
                                            onChange={(e) => setData('game_title', e.target.value)} // trigger
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs sm:text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Select Game Discipline</option>
                                            {GAME_DISCIPLINES.map((game) => (
                                                <option key={game} value={game}>
                                                    {game}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.game_title && (
                                            <p className="text-xs text-rose-400 font-medium">{errors.game_title}</p>
                                        )}
                                    </div>

                                    {/* match format */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Series Format
                                        </label>
                                        <select
                                            value={data.format} // state
                                            onChange={(e) => setData('format', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs sm:text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            {MATCH_FORMATS.map((f) => (
                                                <option key={f.value} value={f.value}>
                                                    {f.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* bracket stage */}
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament Bracket / Stage
                                        </label>
                                        <select
                                            value={data.round} // state
                                            onChange={(e) => setData('round', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs sm:text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            {MATCH_ROUNDS.map((r) => (
                                                <option key={r} value={r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Competitors & Head-to-Head Matchup */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                        <Swords className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-white tracking-wide">
                                            Head-to-Head Competitors
                                        </h2>
                                        <p className="text-[11px] text-slate-400">
                                            Enter team names, tags, and score tallies
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Team A */}
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-sky-500/20 space-y-3.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase bg-sky-500/10 px-2.5 py-1 rounded-md">
                                                Team A (Blue Side)
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-500">HOME</span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-[11px] font-semibold text-slate-300">
                                                Team Full Name <span className="text-amber-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Todak Esports"
                                                value={data.team_a_name} // state
                                                onChange={(e) => setData('team_a_name', e.target.value)} // trigger
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-400/60 text-white text-xs font-semibold outline-none transition-all font-sans"
                                            />
                                            {errors.team_a_name && (
                                                <p className="text-xs text-rose-400">{errors.team_a_name}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                    Tag / Acronym
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="TOD"
                                                    value={data.team_a_tag} // state
                                                    onChange={(e) => setData('team_a_tag', e.target.value.toUpperCase())} // trigger
                                                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-sky-400/60 text-white text-xs font-mono font-bold uppercase outline-none transition-all font-sans"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                    Score
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={data.team_a_score} // state
                                                    onChange={(e) => setData('team_a_score', e.target.value)} // trigger
                                                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-sky-400/60 text-amber-400 text-xs font-mono font-bold outline-none transition-all font-sans"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team B */}
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-rose-500/20 space-y-3.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-2.5 py-1 rounded-md">
                                                Team B (Red Side)
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-500">AWAY</span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-[11px] font-semibold text-slate-300">
                                                Team Full Name <span className="text-amber-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Team SMG"
                                                value={data.team_b_name} // state
                                                onChange={(e) => setData('team_b_name', e.target.value)} // trigger
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-400/60 text-white text-xs font-semibold outline-none transition-all font-sans"
                                            />
                                            {errors.team_b_name && (
                                                <p className="text-xs text-rose-400">{errors.team_b_name}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                    Tag / Acronym
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="SMG"
                                                    value={data.team_b_tag} // state
                                                    onChange={(e) => setData('team_b_tag', e.target.value.toUpperCase())} // trigger
                                                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-rose-400/60 text-white text-xs font-mono font-bold uppercase outline-none transition-all font-sans"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                    Score
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={data.team_b_score} // state
                                                    onChange={(e) => setData('team_b_score', e.target.value)} // trigger
                                                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-rose-400/60 text-amber-400 text-xs font-mono font-bold outline-none transition-all font-sans"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right column: schedule, broadcast & actions (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Card 3: Schedule & Logistics */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                    <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                            Schedule & Venue
                                        </h3>
                                        <p className="text-[10px] text-slate-400">Date, time & match location</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-semibold text-slate-300">
                                            Match Date <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={data.scheduled_date} // state
                                            onChange={(e) => setData('scheduled_date', e.target.value)} // trigger
                                            className="w-full px-3.5 py-2 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-semibold text-slate-300">
                                            Start Time (MYT)
                                        </label>
                                        <input
                                            type="time"
                                            value={data.scheduled_time} // state
                                            onChange={(e) => setData('scheduled_time', e.target.value)} // trigger
                                            className="w-full px-3.5 py-2 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-semibold text-slate-300">
                                            Venue / Arena
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Online Arena"
                                            value={data.venue} // state
                                            onChange={(e) => setData('venue', e.target.value)} // trigger
                                            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Broadcast & Status */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                    <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                        <Tv className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                            Broadcast & Status
                                        </h3>
                                        <p className="text-[10px] text-slate-400">Stream URL and fixture status</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-semibold text-slate-300">
                                            Livestream Link
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://youtube.com/... or twitch.tv"
                                            value={data.stream_url} // state
                                            onChange={(e) => setData('stream_url', e.target.value)} // trigger
                                            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-semibold text-slate-300">
                                            Match Status
                                        </label>
                                        <select
                                            value={data.status} // state
                                            onChange={(e) => setData('status', e.target.value)} // trigger
                                            className="w-full px-3.5 py-2 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="UPCOMING">Upcoming Fixture</option>
                                            <option value="LIVE">Live In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* submit actions */}
                                <div className="pt-3 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={processing} // check
                                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {processing ? 'Scheduling...' : 'Schedule Fixture'}
                                    </button>

                                    <Link
                                        href={route('admin.matches')} // redirect
                                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white font-semibold text-xs tracking-wider transition-all text-center block"
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
