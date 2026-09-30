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
    Shield,
    Sparkles
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
    'Counter-Strike 2',
    'Apex Legends',
    'Other / Custom Title'
];

const MATCH_FORMATS = [
    { value: 'BO1', label: 'Best of 1 (BO1)', short: 'BO1' },
    { value: 'BO3', label: 'Best of 3 (BO3)', short: 'BO3' },
    { value: 'BO5', label: 'Best of 5 (BO5)', short: 'BO5' },
    { value: 'BO7', label: 'Best of 7 (BO7)', short: 'BO7' }
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

const STATUS_OPTIONS = [
    { value: 'UPCOMING', label: 'Upcoming Fixture', desc: 'Match scheduled for future broadcast' },
    { value: 'LIVE', label: 'Live In Progress', desc: 'Game currently being played live' },
    { value: 'COMPLETED', label: 'Completed', desc: 'Match finished with final scores recorded' },
    { value: 'CANCELLED', label: 'Cancelled', desc: 'Fixture called off or postponed' }
];

// --3. main component--
export default function Edit({ match = {} }) {
    const [showSuccess, setShowSuccess] = useState(false); // state

    const { data, setData, put, processing, errors } = useForm({ // state
        tournament_name: match.tournament_name || '',
        game_title: match.game_title || '',
        round: match.round || 'Regular Season / Group Stage',
        format: match.format || 'BO3',
        team_a_name: match.team_a_name || '',
        team_a_tag: match.team_a_tag || '',
        team_a_score: match.team_a_score !== null && match.team_a_score !== undefined ? match.team_a_score : '',
        team_b_name: match.team_b_name || '',
        team_b_tag: match.team_b_tag || '',
        team_b_score: match.team_b_score !== null && match.team_b_score !== undefined ? match.team_b_score : '',
        scheduled_date: match.scheduled_date || new Date().toISOString().split('T')[0],
        scheduled_time: match.scheduled_time || '20:00',
        venue: match.venue || 'Online Arena',
        stream_url: match.stream_url || '',
        status: match.status ? match.status.toUpperCase() : 'UPCOMING',
        is_active: match.is_active !== undefined ? match.is_active : true,
    });

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        put(route('admin.matches.update', match.id), { // save
            onSuccess: () => { // trigger
                setShowSuccess(true); // state
                setTimeout(() => { // clock
                    router.visit(route('admin.matches')); // redirect
                }, 800);
            },
        });
    };

    const matchupHeadline = `${data.team_a_tag || data.team_a_name || 'Team A'} vs ${data.team_b_tag || data.team_b_name || 'Team B'}`;

    // --5. UI--
    return (
        <AdminLayout
            title={`Edit Match - MESF Admin`}
            contentClassName="px-4 pt-1.5 pb-8 sm:px-8 sm:pt-2 sm:pb-10"
        >
            <Head title={`Edit Match #${match.id} - Admin`} />

            <div className="w-full max-w-6xl pb-16 space-y-5">
                {/* header bar: tightly positioned with inline back button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BackButton href={route('admin.matches')} label="Back" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Edit Match: {matchupHeadline}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Update tournament stage, competitor scores, schedule timing, and live broadcast link.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('admin.matches')} // redirect
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold tracking-wider transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit} // trigger
                            disabled={processing} // check
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.3)] cursor-pointer disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">Match fixture updated successfully! Redirecting to matches dashboard...</span>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: match details cards (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Card 1: Tournament & Series Details */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Tournament & Series Details
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Tournament name, game discipline, bracket round, and format
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                        Section 1
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {/* tournament name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament / League Title <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. MESF National Championship 2026"
                                            value={data.tournament_name} // state
                                            onChange={(e) => setData('tournament_name', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                        />
                                        {errors.tournament_name && (
                                            <p className="text-xs text-rose-400 font-medium">{errors.tournament_name}</p>
                                        )}
                                    </div>

                                    {/* game title & bracket stage */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                        <div className="space-y-1.5">
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

                                    {/* match series format pills */}
                                    <div className="space-y-2 pt-1">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Match Series Format
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            {MATCH_FORMATS.map((f) => {
                                                const isSelected = data.format === f.value;
                                                return (
                                                    <button
                                                        key={f.value}
                                                        type="button"
                                                        onClick={() => setData('format', f.value)} // trigger
                                                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.15)] font-bold'
                                                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                                        }`}
                                                    >
                                                        <div className="text-xs font-bold">{f.short}</div>
                                                        <div className="text-[10px] text-slate-400 mt-0.5">{f.label}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Head-to-Head Competitors & Matchup */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                                            <Swords className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Head-to-Head Competitors & Scores
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Participating teams, acronym tags, and live series score tallies
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                        Section 2
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                                    {/* Team A (Blue Side / HOME) */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/[0.03] border border-sky-500/25 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                                                <span className="text-[11px] font-bold tracking-widest text-sky-400 uppercase">
                                                    Team A (Blue Side)
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-sky-400/80 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                                                HOME
                                            </span>
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
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/30 text-white text-xs font-semibold outline-none transition-all font-sans"
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
                                                    Game Score
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

                                    {/* Team B (Red Side / AWAY) */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/[0.03] border border-rose-500/25 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                                <span className="text-[11px] font-bold tracking-widest text-rose-400 uppercase">
                                                    Team B (Red Side)
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-rose-400/80 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                                                AWAY
                                            </span>
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
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-400/60 focus:ring-1 focus:ring-rose-400/30 text-white text-xs font-semibold outline-none transition-all font-sans"
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
                                                    Game Score
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

                            {/* Card 3: Broadcast & Coverage */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                            <Tv className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Livestream & Broadcast
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Official digital transmission URL for spectator coverage
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                        Section 3
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Livestream URL (YouTube / Twitch / Facebook Gaming)
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://youtube.com/watch?v=... or https://twitch.tv/..."
                                        value={data.stream_url} // state
                                        onChange={(e) => setData('stream_url', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-xs sm:text-sm outline-none transition-all font-sans"
                                    />
                                    {errors.stream_url && (
                                        <p className="text-xs text-rose-400">{errors.stream_url}</p>
                                    )}
                                    <p className="text-[11px] text-slate-400">
                                        Provide a valid stream link to enable the direct video player embed on the public match view.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* right column: schedule, venue & status (4 cols, sticky) */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                            {/* Card 4: Schedule & Venue */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                        Schedule & Venue
                                    </h3>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Timing and arena logistics
                                    </p>
                                </div>

                                <div className="space-y-3.5">
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
                                        {errors.scheduled_date && (
                                            <p className="text-xs text-rose-400">{errors.scheduled_date}</p>
                                        )}
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
                                        {errors.scheduled_time && (
                                            <p className="text-xs text-rose-400">{errors.scheduled_time}</p>
                                        )}
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
                                        {errors.venue && (
                                            <p className="text-xs text-rose-400">{errors.venue}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Match Status & Publishing */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                        Match Status & Visibility
                                    </h3>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Current competitive state of fixture
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {STATUS_OPTIONS.map((st) => {
                                        const isSelected = data.status === st.value;
                                        return (
                                            <button
                                                key={st.value}
                                                type="button"
                                                onClick={() => setData('status', st.value)} // trigger
                                                className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-amber-400/10 border-amber-400 text-white shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between text-xs font-bold">
                                                    <span>{st.label}</span>
                                                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {st.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(data.is_active)} // state
                                            onChange={(e) => setData('is_active', e.target.checked)} // trigger
                                            className="w-4 h-4 rounded border-white/20 bg-black/40 text-amber-400 focus:ring-amber-400/30"
                                        />
                                        <span className="text-xs font-semibold text-slate-300">
                                            Active Fixture Listing
                                        </span>
                                    </label>
                                </div>

                                <div className="pt-3 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={processing} // check
                                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {processing ? 'Saving Changes...' : 'Save Changes'}
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
