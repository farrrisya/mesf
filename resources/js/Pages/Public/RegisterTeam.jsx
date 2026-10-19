// --1. imports--
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import Footer from '@/Components/Footer';
import BackButton from '@/Components/BackButton';
import { useState, useRef, useEffect } from 'react';
import {
    Shield,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Image as ImageIcon,
    X,
    Check
} from 'lucide-react';

// --2. properties--
const GAME_DISCIPLINES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Honor of Kings',
    'Tekken 8',
    'Dota 2',
    'EA Sports FC',
    'Counter-Strike 2',
    'Apex Legends',
    'Free Fire',
    'Other Competitive Title'
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

const TEAM_TYPES = [
    { id: 'pro', label: 'Club / Pro Team' },
    { id: 'state', label: 'State Affiliate' },
    { id: 'national', label: 'National Squad' }
];

// --3. main component--
export default function RegisterTeam({ auth = {} }) {
    const { flash = {} } = usePage().props; // properties
    const user = auth?.user; // properties

    const fileInputRef = useRef(null); // properties
    const successRef = useRef(null); // properties
    const [logoPreview, setLogoPreview] = useState(null); // state
    const [customGameTitle, setCustomGameTitle] = useState(''); // state
    const [submitted, setSubmitted] = useState(false); // state

    // form state
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: '', // state
        type: 'pro', // state
        regions: user?.state ? [user.state] : ['Selangor'], // state
        region: user?.state || 'Selangor', // state
        games: ['Mobile Legends: Bang Bang (MLBB)'], // state
        game_title: 'Mobile Legends: Bang Bang (MLBB)', // state
        manager_name: user?.name || '', // state
        contact_email: user?.email || '', // state
        motto: '', // state
        players: 5, // state
        logo: null, // state
        website_url: '' // state
    });

    useEffect(() => {
        if (submitted || flash?.success) { // check
            window.scrollTo({ top: 0, behavior: 'smooth' }); // trigger
            successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); // trigger
        }
    }, [submitted, flash?.success]);

    transform((formData) => {
        let finalGames = [...(formData.games || [])]; // state
        if (finalGames.includes('Other Competitive Title')) { // check
            finalGames = finalGames.filter((g) => g !== 'Other Competitive Title'); // convert
            if (customGameTitle.trim()) { // check
                finalGames.push(customGameTitle.trim()); // save
            }
        }
        return {
            ...formData,
            games: finalGames,
            game_title: finalGames.join(', '),
            region: (formData.regions || []).join(', ')
        };
    });

    // --4. actions--
    const toggleGame = (game) => { // trigger
        const current = data.games || []; // state
        if (current.includes(game)) { // check
            const next = current.filter((g) => g !== game); // state
            setData('games', next); // save
        } else {
            const next = [...current, game]; // state
            setData('games', next); // save
        }
    };

    const toggleRegion = (st) => { // trigger
        if (st === 'National / All Malaysia') { // check
            setData('regions', ['National / All Malaysia']); // save
            return;
        }
        const current = (data.regions || []).filter((r) => r !== 'National / All Malaysia'); // state
        if (current.includes(st)) { // check
            const next = current.filter((r) => r !== st); // state
            setData('regions', next.length > 0 ? next : [st]); // save
        } else {
            const next = [...current, st]; // state
            setData('regions', next); // save
        }
    };

    const handleLogoChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setData('logo', file); // state
            const reader = new FileReader(); // convert
            reader.onload = (uploadEvent) => { // trigger
                setLogoPreview(uploadEvent.target?.result); // state
            };
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
        e.preventDefault(); // trigger
        post('/register-team', {
            forceFormData: true,
            preserveScroll: false,
            onSuccess: () => {
                reset(); // state
                setLogoPreview(null); // state
                setSubmitted(true); // state
                window.scrollTo({ top: 0, behavior: 'smooth' }); // trigger
            }
        }); // save
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title="Team Registration - MESF" />

            {/* Custom Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[12%] left-[8%] w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[20%] right-[8%] w-[520px] h-[520px] bg-blue-600/10 rounded-full blur-[160px]" />
            </div>

            {/* Floating Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar />
            </div>

            {/* Hero Header */}
            <header className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-32 sm:pt-36 pb-8">
                <div className="mb-8">
                    <BackButton href="/profile" label="Back" />
                </div>

                <div className="pb-6 border-b border-white/10 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                        [ NATIONAL FEDERATION TEAM REGISTRY ]
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white leading-tight">
                        Register Your Team
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal leading-relaxed mt-2">
                        Register your esports club or squad for official federation recognition and tournament sanctioning.
                    </p>
                </div>
            </header>

            {/* Main Form Content */}
            <main className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pb-28">
                {/* Success Banner */}
                {(submitted || flash?.success) && (
                    <div
                        ref={successRef}
                        className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-[#0c1825] to-[#090D18] border border-emerald-500/30 text-white backdrop-blur-2xl animate-fadeIn shadow-2xl space-y-4"
                    >
                        <div className="flex items-start gap-3.5">
                            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-0.5" />
                            <div className="space-y-1.5 flex-1">
                                <h3 className="text-base sm:text-lg font-bold text-white">Registration Submitted Successfully</h3>
                                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                    {flash?.success || 'Your team registration has been recorded and is pending verification by MESF Secretariat.'}
                                </p>
                            </div>
                        </div>

                        {/* Promoted Get Involved Box */}
                        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/5">
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                    Looking to participate or partner with MESF?
                                </p>
                                <p className="text-xs text-neutral-400">
                                    Explore national leagues, tournament sanctioning, or federation initiatives.
                                </p>
                            </div>

                            <Link
                                href="/get-involved" // redirect
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] shrink-0 font-sans cursor-pointer"
                            >
                                <span>Get Involved</span>
                                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </Link>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#090D18]/90 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
                    {/* Section 1: Team Identity */}
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                Team Identity
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Official club identification, category, and emblem.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Team Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Official Team Name <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name} // state
                                    onChange={(e) => setData('name', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-white text-sm outline-none transition-all font-sans"
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Team Category / Type */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Team Category <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {TEAM_TYPES.map((t) => {
                                        const isSelected = data.type === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setData('type', t.id)} // trigger
                                                className={`py-3 px-3.5 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer font-sans ${
                                                    isSelected
                                                        ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-sm font-bold'
                                                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                                                }`}
                                            >
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Team Emblem / Logo Upload */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Team Logo
                                </label>
                                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Team Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-neutral-500" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-neutral-300">Square emblem (PNG, JPG, max 5MB)</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={fileInputRef} // properties
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange} // trigger
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()} // trigger
                                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer font-sans"
                                        >
                                            {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                        </button>
                                        {logoPreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveLogo} // trigger
                                                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                                title="Remove Logo"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {errors.logo && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.logo}
                                    </p>
                                )}
                            </div>

                            {/* Team Motto (Optional) */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Motto / Slogan (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.motto} // state
                                    onChange={(e) => setData('motto', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 text-white text-sm outline-none transition-all font-sans"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Section 2: Esports Disciplines (Multi-select) */}
                    <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                    Esports Disciplines <span className="text-amber-400 font-bold">*</span>
                                </h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Select one or more competitive titles your squad plays.
                                </p>
                            </div>
                            <span className="text-xs text-amber-400 font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                                {data.games?.length || 0} Selected
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {GAME_DISCIPLINES.map((game) => {
                                const isChecked = (data.games || []).includes(game);
                                return (
                                    <button
                                        key={game}
                                        type="button"
                                        onClick={() => toggleGame(game)} // trigger
                                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer font-sans ${
                                            isChecked
                                                ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-sm font-semibold'
                                                : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
                                        }`}
                                    >
                                        <span className="truncate">{game}</span>
                                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] shrink-0 ml-2 ${
                                            isChecked
                                                ? 'bg-amber-400 border-amber-400 text-black font-extrabold'
                                                : 'border-white/20'
                                        }`}>
                                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {(data.games || []).includes('Other Competitive Title') && (
                            <div className="pt-2">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide mb-1.5">
                                    Specify Other Game Title
                                </label>
                                <input
                                    type="text"
                                    value={customGameTitle} // state
                                    onChange={(e) => setCustomGameTitle(e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-400/40 text-white text-sm outline-none font-sans"
                                />
                            </div>
                        )}

                        {errors.games && (
                            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                <AlertCircle className="w-3.5 h-3.5" />{errors.games}
                            </p>
                        )}
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Section 3: Territory / State (Multi-select) */}
                    <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                    Territory / State <span className="text-amber-400 font-bold">*</span>
                                </h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Select home state or competitive jurisdiction.
                                </p>
                            </div>
                            <span className="text-xs text-amber-400 font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                                {data.regions?.length || 0} Selected
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                            {MALAYSIA_STATES.map((st) => {
                                const isChecked = (data.regions || []).includes(st);
                                return (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => toggleRegion(st)} // trigger
                                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer font-sans ${
                                            isChecked
                                                ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-sm font-semibold'
                                                : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
                                        }`}
                                    >
                                        <span className="truncate">{st}</span>
                                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] shrink-0 ml-1.5 ${
                                            isChecked
                                                ? 'bg-amber-400 border-amber-400 text-black font-extrabold'
                                                : 'border-white/20'
                                        }`}>
                                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {errors.region && (
                            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                <AlertCircle className="w-3.5 h-3.5" />{errors.region}
                            </p>
                        )}
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Section 4: Contact & Details */}
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                Manager &amp; Contact Details
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Federation liaison and roster representation contact.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Manager Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Manager / Representative Full Name <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.manager_name} // state
                                    onChange={(e) => setData('manager_name', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-white text-sm outline-none transition-all font-sans"
                                />
                                {errors.manager_name && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.manager_name}
                                    </p>
                                )}
                            </div>

                            {/* Contact Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Official Contact Email <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={data.contact_email} // state
                                    onChange={(e) => setData('contact_email', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-white text-sm outline-none transition-all font-sans"
                                />
                                {errors.contact_email && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.contact_email}
                                    </p>
                                )}
                            </div>

                            {/* Players */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Players <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={50}
                                    required
                                    value={data.players} // state
                                    onChange={(e) => setData('players', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-white text-sm outline-none transition-all font-sans"
                                />
                                {errors.players && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.players}
                                    </p>
                                )}
                            </div>

                            {/* Website (Optional) */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Official Website (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={data.website_url} // state
                                    onChange={(e) => setData('website_url', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 text-white text-sm outline-none transition-all font-sans"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer font-sans"
                        >
                            <Shield className="w-4 h-4 text-black stroke-[2.5]" />
                            <span>{processing ? 'Submitting Registration...' : 'Submit Team Registration'}</span>
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
