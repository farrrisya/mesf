// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    Trophy,
    UploadCloud,
    Calendar,
    Check,
    Coins,
    Clock,
    Users,
    MapPin,
    Layers,
    Info,
    Move,
    Shield,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import ImagePositionerModal from '@/Components/ImagePositionerModal';

// --2. properties--
const LEAGUE_TIERS = [
    { value: 'Tier 1 - National Championship', label: 'Tier 1 - National Championship' },
    { value: 'Tier 2 - State Circuit', label: 'Tier 2 - State Circuit' },
    { value: 'Tier 3 - Grassroots / Community Cup', label: 'Tier 3 - Grassroots / Community Cup' },
    { value: 'Collegiate / Varsity League', label: 'Collegiate / Varsity League' }
];

const GAME_DISCIPLINES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Dota 2',
    'EA Sports FC',
    'Honor of Kings',
    'Tekken 8',
    'Multi-Title Championship'
];

const TOURNAMENT_FORMATS = [
    'Group Stage + Single Elimination',
    'Double Elimination Playoffs',
    'Round Robin Circuit',
    'Single Elimination Bracket',
    'Swiss Stage + Finals'
];

const DISPLAY_OPTIONS_CONFIG = [
    { id: 'prize_pool', label: 'Prize Pool', icon: Trophy, desc: 'Display total prize bounty' },
    { id: 'dates', label: 'Tournament Dates', icon: Calendar, desc: 'Display event date schedule' },
    { id: 'closing_date', label: 'Closing Date', icon: Clock, desc: 'Display registration deadline' },
    { id: 'slots', label: 'Team Slots', icon: Users, desc: 'Display maximum team capacity' },
    { id: 'fee', label: 'Entry Fee', icon: Coins, desc: 'Display participation price' },
    { id: 'format', label: 'Format / Structure', icon: Layers, desc: 'Display tournament bracket format' },
    { id: 'location', label: 'Venue / Location', icon: MapPin, desc: 'Display physical or online venue' }
];

// --3. main component--
export default function Edit({ league }) {
    const fileInputRef = useRef(null); // properties
    const [bannerPreview, setBannerPreview] = useState(league?.banner_url || null); // state
    const [showSuccess, setShowSuccess] = useState(false); // state
    const [isPositionerOpen, setIsPositionerOpen] = useState(false); // state
    const [positionerSource, setPositionerSource] = useState(null); // state
    const [rawFileName, setRawFileName] = useState('banner.jpg'); // state

    const { data, setData, post, processing, errors } = useForm({ // state
        name: league?.name || '',
        season: league?.season || '',
        game_title: league?.game_title || '',
        tier: league?.tier || '',
        format: league?.format || '',
        prize_pool: league?.prize_pool || '',
        start_date: league?.start_date || '',
        end_date: league?.end_date || '',
        registration_deadline: league?.registration_deadline || '',
        slots: league?.slots || '',
        entry_fee: league?.entry_fee || 'Free Entry',
        location: league?.location || 'Malaysia',
        registration_status: league?.registration_status || 'REGISTRATION OPEN',
        display_options: league?.display_options || ['prize_pool', 'dates', 'closing_date', 'slots', 'fee', 'format', 'location'],
        description: league?.description || '',
        banner: null,
        _method: 'PUT'
    });

    // --4. actions--
    const handleBannerChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setRawFileName(file.name); // state
            setPositionerSource(file); // state
            setIsPositionerOpen(true); // state
            const reader = new FileReader(); // convert
            reader.onloadend = () => setBannerPreview(reader.result); // state
            reader.readAsDataURL(file); // convert
            setData('banner', file); // state
        }
    };

    const handlePositionerComplete = (croppedFile, previewUrl) => { // save
        setData('banner', croppedFile); // state
        setBannerPreview(previewUrl); // state
        setPositionerSource(croppedFile); // state
    };

    const handleRemoveBanner = () => { // trigger
        setData('banner', null); // state
        setBannerPreview(null); // state
        setPositionerSource(null); // state
        if (fileInputRef.current) { // check
            fileInputRef.current.value = ''; // state
        }
    };

    const toggleDisplayOption = (optionId) => { // trigger
        const current = data.display_options || []; // state
        if (current.includes(optionId)) { // check
            setData('display_options', current.filter((id) => id !== optionId)); // state
        } else {
            setData('display_options', [...current, optionId]); // state
        }
    };

    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        post(route('admin.leagues.update-post', league.id), { // save
            forceFormData: true,
            onSuccess: () => { // trigger
                setShowSuccess(true); // state
                setTimeout(() => { // clock
                    router.visit(route('admin.leagues')); // redirect
                }, 800);
            },
        });
    };

    // --5. UI--
    return (
        <AdminLayout
            title={`Edit ${league.name} - MESF Admin`}
            contentClassName="px-4 py-4 sm:px-8 sm:py-5"
        >
            <Head title={`Edit ${league.name} - Admin`} />

            <div className="w-full max-w-6xl pb-16 space-y-5">
                {/* header bar: tightly positioned with inline back button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BackButton href={route('admin.leagues')} label="Back" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Edit League: {league.name}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Modify tournament identity, competition format, schedule, and banner artwork.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('admin.leagues')} // redirect
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold tracking-wider transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit} // trigger
                            disabled={processing} // check
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.3)] cursor-pointer disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">League successfully updated! Redirecting to leagues dashboard...</span>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: structured details cards (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* card 1: tournament identity */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Tournament Identity
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Title, edition, game discipline, and federation tier classification
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                        Section 1
                                    </span>
                                </div>

                                {/* title & season */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament / League Title <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name} // state
                                            placeholder="e.g. Malaysia Esports League 2026"
                                            onChange={(e) => setData('name', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                        />
                                        {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Edition / Season
                                        </label>
                                        <input
                                            type="text"
                                            value={data.season} // state
                                            placeholder="e.g. Season 4 / 2026"
                                            onChange={(e) => setData('season', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                        {errors.season && <p className="text-xs text-rose-400 mt-1">{errors.season}</p>}
                                    </div>
                                </div>

                                {/* tier & game discipline */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Game Title <span className="text-amber-400">*</span>
                                        </label>
                                        <select
                                            required
                                            value={data.game_title} // state
                                            onChange={(e) => setData('game_title', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Game Title</option>
                                            {GAME_DISCIPLINES.map((game) => (
                                                <option key={game} value={game}>
                                                    {game}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.game_title && <p className="text-xs text-rose-400 mt-1">{errors.game_title}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Federation Tier <span className="text-amber-400">*</span>
                                        </label>
                                        <select
                                            value={data.tier} // state
                                            onChange={(e) => setData('tier', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Federation Tier</option>
                                            {LEAGUE_TIERS.map((tier) => (
                                                <option key={tier.value} value={tier.value}>
                                                    {tier.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.tier && <p className="text-xs text-rose-400 mt-1">{errors.tier}</p>}
                                    </div>
                                </div>

                                {/* description */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Tournament Description / Overview
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.description || ''} // state
                                        placeholder="Brief overview of the league format, eligibility, or qualifier stages..."
                                        onChange={(e) => setData('description', e.target.value)} // trigger
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans resize-none"
                                    />
                                    {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
                                </div>
                            </div>

                            {/* card 2: structure, prize & capacity */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Coins className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Format & Prize Structure
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Tournament bracket format, prize pool, team slots, and entry fees
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                        Section 2
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament Structure
                                        </label>
                                        <select
                                            value={data.format} // state
                                            onChange={(e) => setData('format', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Tournament Structure</option>
                                            {TOURNAMENT_FORMATS.map((fmt) => (
                                                <option key={fmt} value={fmt}>
                                                    {fmt}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.format && <p className="text-xs text-rose-400 mt-1">{errors.format}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Total Prize Pool
                                        </label>
                                        <input
                                            type="text"
                                            value={data.prize_pool} // state
                                            placeholder="e.g. RM 50,000"
                                            onChange={(e) => setData('prize_pool', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm font-semibold outline-none transition-all font-sans"
                                        />
                                        {errors.prize_pool && <p className="text-xs text-rose-400 mt-1">{errors.prize_pool}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Max Team Capacity / Slots
                                        </label>
                                        <input
                                            type="number"
                                            min={2}
                                            max={256}
                                            value={data.slots} // state
                                            placeholder="e.g. 16 or 32"
                                            onChange={(e) => setData('slots', e.target.value ? parseInt(e.target.value) : '')} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                        {errors.slots && <p className="text-xs text-rose-400 mt-1">{errors.slots}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Entry Fee / Price
                                        </label>
                                        <input
                                            type="text"
                                            value={data.entry_fee} // state
                                            placeholder="e.g. Free Entry, RM 50/team"
                                            onChange={(e) => setData('entry_fee', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                        {errors.entry_fee && <p className="text-xs text-rose-400 mt-1">{errors.entry_fee}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* card 3: schedule, registration & location */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Schedule, Registration & Location
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Competition dates, registration deadlines, participation state, and venue
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                        Section 3
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Registration State
                                        </label>
                                        <select
                                            value={data.registration_status} // state
                                            onChange={(e) => setData('registration_status', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Registration State</option>
                                            <option value="REGISTRATION OPEN">Registration Open</option>
                                            <option value="open">Open for Team Registration</option>
                                            <option value="closed">Registration Closed</option>
                                            <option value="REGISTRATION CLOSED">Registration Closed</option>
                                            <option value="invitational">By Invitation Only</option>
                                            <option value="INVITATIONAL">By Invitation Only</option>
                                        </select>
                                        {errors.registration_status && <p className="text-xs text-rose-400 mt-1">{errors.registration_status}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Venue / Location
                                        </label>
                                        <input
                                            type="text"
                                            value={data.location} // state
                                            placeholder="e.g. Online Qualifier / Kuala Lumpur LAN"
                                            onChange={(e) => setData('location', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                        {errors.location && <p className="text-xs text-rose-400 mt-1">{errors.location}</p>}
                                    </div>
                                </div>

                                {/* dates & deadlines */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date} // state
                                            onChange={(e) => setData('start_date', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
                                        {errors.start_date && <p className="text-xs text-rose-400 mt-1">{errors.start_date}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            End / Finals Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date} // state
                                            onChange={(e) => setData('end_date', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
                                        {errors.end_date && <p className="text-xs text-rose-400 mt-1">{errors.end_date}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Registration Closing Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.registration_deadline} // state
                                            onChange={(e) => setData('registration_deadline', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
                                        {errors.registration_deadline && <p className="text-xs text-rose-400 mt-1">{errors.registration_deadline}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* card 4: homepage card display options */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Homepage Card Display Badges
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Choose which tournament details appear as info badges on the homepage circuit cards
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                        Section 4
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {DISPLAY_OPTIONS_CONFIG.map((opt) => {
                                        const IconComp = opt.icon;
                                        const isSelected = (data.display_options || []).includes(opt.id);

                                        return (
                                            <button
                                                type="button"
                                                key={opt.id}
                                                onClick={() => toggleDisplayOption(opt.id)} // trigger
                                                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-amber-400/10 border-amber-400/40 text-white shadow-sm'
                                                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
                                                }`}
                                            >
                                                <div
                                                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                                        isSelected
                                                            ? 'bg-amber-400/20 text-amber-300'
                                                            : 'bg-white/5 text-slate-500'
                                                    }`}
                                                >
                                                    <IconComp className="w-4 h-4" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold tracking-wide">
                                                            {opt.label}
                                                        </span>
                                                        <span
                                                            className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                                                                isSelected
                                                                    ? 'bg-amber-400 border-amber-400 text-black font-extrabold'
                                                                    : 'border-white/20 bg-transparent'
                                                            }`}
                                                        >
                                                            {isSelected && '✓'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                                        {opt.desc}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* right column: banner artwork & quick action card (4 cols) */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                            {/* card 5: banner artwork */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div>
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Official Banner Artwork
                                    </h2>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Recommended ratio 16:9 for event banners and cards.
                                    </p>
                                </div>

                                {bannerPreview ? (
                                    <div className="relative group rounded-2xl overflow-hidden border border-white/15 bg-black/40 aspect-video flex items-center justify-center">
                                        <img
                                            src={bannerPreview} // state
                                            alt="League Banner Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPositionerSource(bannerPreview); // state
                                                    setIsPositionerOpen(true); // trigger
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md flex items-center gap-1.5"
                                            >
                                                <Move className="w-3.5 h-3.5" />
                                                <span>Reposition</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()} // trigger
                                                className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-lg"
                                            >
                                                Change
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRemoveBanner} // trigger
                                                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer shadow-lg"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()} // trigger
                                        className="border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-amber-400/[0.03] group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-all mb-3">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                                            Upload tournament banner
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            JPG, PNG, WEBP up to 8MB
                                        </p>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef} // properties
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerChange} // trigger
                                    className="hidden"
                                />
                                {errors.banner && <p className="text-xs text-rose-400 mt-1">{errors.banner}</p>}
                            </div>

                            {/* card 6: publish action box */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div>
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Save Tournament
                                    </h2>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Review details and update changes to the public circuit.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>Title:</span>
                                        <span className="font-semibold text-white truncate max-w-[170px]">
                                            {data.name || 'Pending title'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>Game:</span>
                                        <span className="font-semibold text-white truncate max-w-[170px]">
                                            {data.game_title || 'Pending game'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>State:</span>
                                        <span className="font-semibold text-amber-400 uppercase text-[11px]">
                                            {data.registration_status || 'Open'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={processing} // check
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {processing ? 'Saving Changes...' : 'Save Changes'}
                                    </button>

                                    <Link
                                        href={route('admin.leagues')} // redirect
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

            {/* banner repositioner modal */}
            <ImagePositionerModal
                isOpen={isPositionerOpen}
                onClose={() => setIsPositionerOpen(false)}
                imageSource={positionerSource}
                fileName={rawFileName}
                aspectRatio={16 / 9}
                aspectRatioLabel="16:9 Banner"
                title="Reposition Tournament Banner"
                onComplete={handlePositionerComplete}
            />
        </AdminLayout>
    );
}
