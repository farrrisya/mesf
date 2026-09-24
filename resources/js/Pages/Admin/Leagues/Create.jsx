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
    Coins
} from 'lucide-react';

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

// --3. main component--
export default function Create() {
    const fileInputRef = useRef(null); // properties
    const [bannerPreview, setBannerPreview] = useState(null); // state
    const [isSubmitting, setIsSubmitting] = useState(false); // state
    const [showSuccess, setShowSuccess] = useState(false); // state

    const { data, setData } = useForm({ // state
        name: '',
        season: '',
        game_title: '',
        tier: '',
        format: '',
        prize_pool: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        slots: '',
        registration_status: '',
        banner: null
    });

    // --4. actions--
    const handleBannerChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setData('banner', file); // state
            const reader = new FileReader(); // convert
            reader.onloadend = () => setBannerPreview(reader.result); // state
            reader.readAsDataURL(file); // convert
        }
    };

    const handleRemoveBanner = () => { // trigger
        setData('banner', null); // state
        setBannerPreview(null); // state
        if (fileInputRef.current) { // check
            fileInputRef.current.value = ''; // state
        }
    };

    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        setIsSubmitting(true); // state
        setTimeout(() => { // clock
            setIsSubmitting(false); // state
            setShowSuccess(true); // state
            setTimeout(() => { // clock
                router.visit(route('admin.leagues')); // redirect
            }, 1200);
        }, 600);
    };

    // --5. UI--
    return (
        <AdminLayout
            title="Create League - MESF Admin"
            contentClassName="p-6 sm:p-8"
        >
            <Head title="Create League - Admin" />

            <div className="w-full max-w-6xl pb-16">
                {/* back button */}
                <div className="mb-6 sm:mb-8 flex items-center">
                    <BackButton href={route('admin.leagues')} label="Back to Leagues" />
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">League successfully registered! Redirecting to leagues dashboard...</span>
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
                                            onChange={(e) => setData('prize_pool', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm font-semibold outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>

                                {/* dates */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        <button
                                            type="button"
                                            onClick={handleRemoveBanner} // trigger
                                            className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-rose-600 text-white transition-all cursor-pointer shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
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
                                        <option value="open">Open for Team Registration</option>
                                        <option value="closed">Registration Closed</option>
                                        <option value="invitational">By Invitation Only</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Max Team Slots
                                    </label>
                                    <input
                                        type="number"
                                        min={2}
                                        max={128}
                                        value={data.slots} // state
                                        onChange={(e) => setData('slots', parseInt(e.target.value) || 16)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                    />
                                </div>

                                <div className="pt-2 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting} // check
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating League...' : 'Create League'}
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
        </AdminLayout>
    );
}
