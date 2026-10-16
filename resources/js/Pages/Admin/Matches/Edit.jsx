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
    CheckCircle2,
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
    { value: 'BO1', label: 'Best of 1', short: 'BO1' },
    { value: 'BO3', label: 'Best of 3', short: 'BO3' },
    { value: 'BO5', label: 'Best of 5', short: 'BO5' },
    { value: 'BO7', label: 'Best of 7', short: 'BO7' }
];

const MATCH_ROUNDS = [
    'Group Stage',
    'Round of 16',
    'Quarter-Finals',
    'Semi-Finals',
    'Third Place Playoff',
    'Grand Finals',
    'Showmatch'
];

const STATUS_OPTIONS = [
    { value: 'UPCOMING', label: 'Upcoming', desc: 'Not started yet' },
    { value: 'LIVE', label: 'Live Now', desc: 'Playing right now' },
    { value: 'COMPLETED', label: 'Finished', desc: 'Match has ended' },
    { value: 'CANCELLED', label: 'Cancelled', desc: 'Called off or postponed' }
];

// --3. main component--
export default function Edit({ match = {} }) {
    const [showSuccess, setShowSuccess] = useState(false); // state
    const [isSaved, setIsSaved] = useState(false); // state

    const { data, setData, put, processing, errors } = useForm({ // state
        tournament_name: match.tournament_name || '',
        game_title: match.game_title || '',
        round: match.round || 'Group Stage',
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

    // check if any field has changed
    const isChanged =
        data.tournament_name !== (match.tournament_name || '') ||
        data.game_title !== (match.game_title || '') ||
        data.round !== (match.round || 'Group Stage') ||
        data.format !== (match.format || 'BO3') ||
        data.team_a_name !== (match.team_a_name || '') ||
        data.team_a_tag !== (match.team_a_tag || '') ||
        String(data.team_a_score ?? '') !== String(match.team_a_score ?? '') ||
        data.team_b_name !== (match.team_b_name || '') ||
        data.team_b_tag !== (match.team_b_tag || '') ||
        String(data.team_b_score ?? '') !== String(match.team_b_score ?? '') ||
        data.scheduled_date !== (match.scheduled_date || '') ||
        data.scheduled_time !== (match.scheduled_time || '') ||
        data.venue !== (match.venue || 'Online Arena') ||
        data.stream_url !== (match.stream_url || '') ||
        data.status !== (match.status ? match.status.toUpperCase() : 'UPCOMING') ||
        Boolean(data.is_active) !== Boolean(match.is_active !== undefined ? match.is_active : true);

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        put(route('admin.matches.update', match.id), { // save
            onSuccess: () => { // trigger
                setIsSaved(true); // save
                setShowSuccess(true); // state
            },
        });
    };

    const matchupHeadline = `${data.team_a_tag || data.team_a_name || 'Team 1'} vs ${data.team_b_tag || data.team_b_name || 'Team 2'}`;

    // --5. UI--
    return (
        <AdminLayout title={`Edit Match - MESF Admin`}>
            <Head title={`Edit Match #${match.id} - Admin`} />

            <div className="w-full max-w-6xl pb-16 space-y-5">
                {/* header bar: clean and simple */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BackButton href={route('admin.matches')} label="Back" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Edit Match: {matchupHeadline}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Update match details, teams, scores, date, and time.
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
                            disabled={(!isChanged && !isSaved) || processing} // check
                            className={`px-5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSaved
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                    : !isChanged || processing
                                        ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                                        : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_4px_16px_rgba(251,191,36,0.3)]'
                            }`}
                        >
                            {isSaved ? (
                                <>
                                    <span>✓</span>
                                    <span>SAVED</span>
                                </>
                            ) : processing ? (
                                <span>Saving...</span>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* unified saved popup modal */}
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                        <div className="w-full max-w-sm bg-[#0B0F1C] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white">Successfully Saved!</h3>
                                <p className="text-xs text-slate-400">
                                    Match changes have been saved.
                                </p>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('admin.matches'))}
                                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: match details cards (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Card 1: Match Details */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Match Details
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Tournament name, game, round, and format
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* tournament name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament Name <span className="text-amber-400">*</span>
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
                                                Game <span className="text-amber-400">*</span>
                                            </label>
                                            <select
                                                value={data.game_title} // state
                                                onChange={(e) => setData('game_title', e.target.value)} // trigger
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs sm:text-sm outline-none transition-all cursor-pointer font-sans"
                                            >
                                                <option value="">Select Game</option>
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
                                                Round / Stage
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
                                            Game Format
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            {MATCH_FORMATS.map((f) => {
                                                const isSelected = data.format === f.value;
                                                return (
                                                    <button
                                                        key={f.value}
                                                        type="button"
                                                        onClick={() => setData('format', f.value)} // trigger
                                                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold'
                                                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
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

                            {/* Card 2: Competing Teams & Scores */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                                            <Swords className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Teams & Score
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Update team names, tags, and match score
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Team 1 */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/[0.03] border border-sky-500/25 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold tracking-wider text-sky-400 uppercase">
                                                Team 1
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-sky-400/80 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                                                FIRST TEAM
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-300">
                                                Team 1 Name <span className="text-amber-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Todak"
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
                                                    Team Tag (Optional)
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
                                                    Score (Optional)
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

                                    {/* Team 2 */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/[0.03] border border-rose-500/25 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold tracking-wider text-rose-400 uppercase">
                                                Team 2
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-rose-400/80 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                                                SECOND TEAM
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold text-slate-300">
                                                Team 2 Name <span className="text-amber-400">*</span>
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
                                                    Team Tag (Optional)
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
                                                    Score (Optional)
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

                        {/* right column: schedule, venue & status (4 cols, sticky) */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                            {/* Card 3: Date, Time & Location */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                        Date, Time & Location
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Set when and where this match is played
                                    </p>
                                </div>

                                <div className="space-y-3.5">
                                    {/* Date with white calendar icon */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Match Date <span className="text-amber-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                required
                                                value={data.scheduled_date} // state
                                                onChange={(e) => setData('scheduled_date', e.target.value)} // trigger
                                                style={{ colorScheme: 'dark' }}
                                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                            />
                                            <Calendar className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                        {errors.scheduled_date && (
                                            <p className="text-xs text-rose-400">{errors.scheduled_date}</p>
                                        )}
                                    </div>

                                    {/* Time with white clock icon */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Match Time
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                value={data.scheduled_time} // state
                                                onChange={(e) => setData('scheduled_time', e.target.value)} // trigger
                                                style={{ colorScheme: 'dark' }}
                                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                            />
                                            <Clock className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Location / Venue
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="e.g. Online Arena / Sunway Pyramid"
                                                value={data.venue} // state
                                                onChange={(e) => setData('venue', e.target.value)} // trigger
                                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                            />
                                            <MapPin className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Live Stream Link <span className="text-slate-500 font-normal">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                placeholder="https://youtube.com/watch?v=..."
                                                value={data.stream_url} // state
                                                onChange={(e) => setData('stream_url', e.target.value)} // trigger
                                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                            />
                                            <Tv className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Match Status */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                        Match Status
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Select current status of this match
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
                                                className={`w-full p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-amber-400/10 border-amber-400 text-white shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
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
                                            Active Match Listing
                                        </span>
                                    </label>
                                </div>

                                <div className="pt-3 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={(!isChanged && !isSaved) || processing} // check
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                            isSaved
                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                : !isChanged || processing
                                                    ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                                                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_4px_16px_rgba(251,191,36,0.35)]'
                                        }`}
                                    >
                                        {isSaved ? (
                                            <>
                                                <span>✓</span>
                                                <span>SAVED</span>
                                            </>
                                        ) : processing ? (
                                            <span>Saving...</span>
                                        ) : (
                                            <span>Save Changes</span>
                                        )}
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
