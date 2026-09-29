// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    Trophy,
    UploadCloud,
    X,
    Calendar,
    Sparkles,
    Shield,
    Check,
    Coins,
    Clock,
    Users,
    MapPin,
    Layers,
    Info,
    Move
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
            title="Edit League - MESF Admin"
            contentClassName="p-6 sm:p-8"
        >
            <Head title={`Edit ${league.name} - Admin`} />

            <div className="w-full max-w-6xl pb-16">
                {/* back button */}
                <div className="mb-6 sm:mb-8 flex items-center">
                    <BackButton href={route('admin.leagues')} label="Back to Leagues" />
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">League updated successfully! Redirecting to leagues dashboard...</span>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: league overview details (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                                {/* league title & season */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Tournament / League Title <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name} // state
                                            onChange={(e) => setData('name', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Edition / Season
                                        </label>
                                        <input
                                            type="text"
                                            value={data.season} // state
                                            onChange={(e) => setData('season', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>

                                {/* tier & game discipline */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Game Title <span className="text-amber-400">*</span>
                                        </label>
                                        <select
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
                                    </div>
                                </div>

                                {/* format & prize pool */}
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
                                            required
                                            value={data.start_date} // state
                                            onChange={(e) => setData('start_date', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                        />
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
                                    </div>
                                </div>

                                {/* entry fee & venue/location */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                </div>
                            </div>

                            {/* homepage display options card */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                        Homepage Card Display Options
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Choose which tournament details to display as info badges on the homepage circuit cards. Checked items will be shown when they have data.
                                    </p>
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

                        {/* right column: poster & status (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* banner upload card */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Official Banner Artwork
                                    </h3>
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
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:scale-105 transition-all mb-3">
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
                            </div>

                            {/* registration status */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Registration State
                                    </label>
                                    <select
                                        value={data.registration_status} // state
                                        onChange={(e) => setData('registration_status', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all cursor-pointer font-sans"
                                    >
                                        <option value="">Choose Registration State</option>
                                        <option value="REGISTRATION OPEN">Registration Open</option>
                                        <option value="LIVE SEASON">Live Season</option>
                                        <option value="CLOSED">Registration Closed</option>
                                        <option value="INVITATIONAL">By Invitation Only</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Max Team Slots
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 32 Squads"
                                        value={data.slots} // state
                                        onChange={(e) => setData('slots', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                    />
                                </div>

                                <div className="pt-2 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={processing} // check
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {processing ? 'Saving Changes...' : 'Save League Changes'}
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
