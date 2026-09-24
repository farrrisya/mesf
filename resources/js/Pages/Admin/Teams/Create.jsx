// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    Users,
    UploadCloud,
    X,
    AlertCircle,
    Flag,
    MapPin,
    Gamepad2,
    Shield,
    Sparkles,
    Check
} from 'lucide-react';

// --2. properties--
const TEAM_TYPES = [
    { id: 'national', label: 'National Team', desc: 'Official national squad representing Malaysia in global championships.' },
    { id: 'state', label: 'State Affiliate', desc: 'State-level esports association or state representation team.' },
    { id: 'pro', label: 'Club / Pro Team', desc: 'Registered competitive esports club, academy, or grassroots squad.' }
];

const MALAYSIA_STATES = [
    'National / All Malaysia',
    'Johor',
    'Kedah',
    'Kelantan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Penang',
    'Perak',
    'Perlis',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
    'WP Kuala Lumpur',
    'WP Labuan',
    'WP Putrajaya'
];

const GAME_DISCIPLINES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Dota 2',
    'EA Sports FC',
    'Honor of Kings',
    'Tekken 8',
    'Apex Legends',
    'Counter-Strike 2',
    'Other / Multi-Discipline'
];

// --3. main component--
export default function Create() {
    const fileInputRef = useRef(null); // properties
    const [logoPreview, setLogoPreview] = useState(null); // state
    const [isSubmitting, setIsSubmitting] = useState(false); // state
    const [showSuccess, setShowSuccess] = useState(false); // state

    const { data, setData, errors } = useForm({ // state
        name: '',
        tag: '',
        type: '',
        region: '',
        game_title: '',
        manager_name: '',
        contact_email: '',
        motto: '',
        roster_size: 5,
        status: '',
        logo: null
    });

    // --4. actions--
    const handleLogoChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setData('logo', file); // state
            const reader = new FileReader(); // convert
            reader.onloadend = () => setLogoPreview(reader.result); // state
            reader.readAsDataURL(file); // convert
        }
    };

    const handleRemoveLogo = () => { // trigger
        setData('logo', null); // state
        setLogoPreview(null); // state
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
                router.visit(route('admin.teams')); // redirect
            }, 1200);
        }, 600);
    };

    // --5. UI--
    return (
        <AdminLayout
            title="Create Team Profile - MESF Admin"
            contentClassName="p-6 sm:p-8"
        >
            <Head title="Create Team Profile - Admin" />

            <div className="w-full max-w-6xl pb-16">
                {/* back button */}
                <div className="mb-6 sm:mb-8 flex items-center">
                    <BackButton href={route('admin.teams')} label="Back to Teams" />
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">Team profile successfully created! Redirecting to teams directory...</span>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: team information (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                                {/* team type selector */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Team Classification <span className="text-amber-400">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {TEAM_TYPES.map((t) => {
                                            const isSelected = data.type === t.id;
                                            return (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => setData('type', t.id)} // trigger
                                                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-amber-400/10 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="text-xs font-bold tracking-wide flex items-center justify-between">
                                                        <span>{t.label}</span>
                                                        {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                        {t.desc}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* team name and tag */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Team Full Name <span className="text-amber-400">*</span>
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
                                            Tag / Acronym <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={data.tag} // state
                                            onChange={(e) => setData('tag', e.target.value.toUpperCase())} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-bold uppercase tracking-wider outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>

                                {/* game discipline & region */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Primary Discipline <span className="text-amber-400">*</span>
                                        </label>
                                        <select
                                            value={data.game_title} // state
                                            onChange={(e) => setData('game_title', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Discipline</option>
                                            {GAME_DISCIPLINES.map((game) => (
                                                <option key={game} value={game}>
                                                    {game}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            State / Territory <span className="text-amber-400">*</span>
                                        </label>
                                        <select
                                            value={data.region} // state
                                            onChange={(e) => setData('region', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose State / Territory</option>
                                            {MALAYSIA_STATES.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* motto / bio */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Team Motto / Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={data.motto} // state
                                        onChange={(e) => setData('motto', e.target.value)} // trigger
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                    />
                                </div>

                                {/* manager & contact */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Team Manager / Captain
                                        </label>
                                        <input
                                            type="text"
                                            value={data.manager_name} // state
                                            onChange={(e) => setData('manager_name', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Official Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.contact_email} // state
                                            onChange={(e) => setData('contact_email', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right column: emblem & status (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* emblem / logo upload card */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Official Team Emblem
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        PNG or SVG with transparent background recommended.
                                    </p>
                                </div>

                                {logoPreview ? (
                                    <div className="relative group rounded-2xl overflow-hidden border border-white/15 bg-black/40 p-6 flex items-center justify-center">
                                        <img
                                            src={logoPreview} // state
                                            alt="Team Logo Preview"
                                            className="w-32 h-32 object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo} // trigger
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
                                            Click to upload logo
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            PNG, WEBP, SVG up to 5MB
                                        </p>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef} // properties
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange} // trigger
                                    className="hidden"
                                />
                            </div>

                            {/* roster & status card */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Affiliation Status
                                    </label>
                                    <select
                                        value={data.status} // state
                                        onChange={(e) => setData('status', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all cursor-pointer font-sans"
                                    >
                                        <option value="">Choose Status</option>
                                        <option value="active">Active & Sanctioned</option>
                                        <option value="pending">Pending Federation Verification</option>
                                        <option value="inactive">Inactive / Seasonal Hiatus</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Registered Roster Size
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={data.roster_size} // state
                                        onChange={(e) => setData('roster_size', parseInt(e.target.value) || 5)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all font-sans"
                                    />
                                </div>

                                <div className="pt-2 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting} // check
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Registering Team...' : 'Create Team Profile'}
                                    </button>

                                    <Link
                                        href={route('admin.teams')} // redirect
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
