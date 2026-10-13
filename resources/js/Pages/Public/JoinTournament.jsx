// --1. imports--
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import Footer from '@/Components/Footer';
import BackButton from '@/Components/BackButton';
import { useState } from 'react';
import {
    Trophy,
    Users,
    Handshake,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ChevronDown,
    Clock,
    ShieldCheck,
    Mail,
    Phone,
    HelpCircle,
    FileText
} from 'lucide-react';

// --2. properties--
const SANCTIONED_GAMES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Tekken 8',
    'Honor of Kings',
    'Dota 2',
    'eFootball',
    'Counter-Strike 2',
    'Other / Open Title'
];

const MALAYSIA_STATES = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Pulau Pinang',
    'Perak',
    'Perlis',
    'Selangor',
    'Terengganu',
    'Sabah',
    'Sarawak',
    'WP Kuala Lumpur',
    'WP Labuan',
    'WP Putrajaya',
    'Other / International'
];

// --3. main component--
export default function JoinTournament() {
    const { flash = {}, settings = {} } = usePage().props; // properties
    const [submitted, setSubmitted] = useState(false); // state
    const [customGameTitle, setCustomGameTitle] = useState(''); // state
    const [customState, setCustomState] = useState(''); // state

    const replyEmail = settings?.replyEmail || settings?.supportEmail || 'contact@mesf.my'; // properties
    const contactPhone = settings?.phone || '+603-8052 5278'; // properties

    // form state
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        type: 'join_tournament', // state
        name: '', // state
        email: '', // state
        phone: '', // state
        organization: '', // state
        team_name: '', // state
        game_title: '', // state
        player_count: 5, // state
        state: '', // state
        message: '', // state
    });

    transform((formData) => ({
        ...formData,
        game_title: formData.game_title === 'Other / Open Title' && customGameTitle.trim()
            ? `Other (${customGameTitle.trim()})`
            : formData.game_title,
        state: formData.state === 'Other / International' && customState.trim()
            ? `Other (${customState.trim()})`
            : formData.state,
    }));

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // trigger
        post('/inquiries', {
            onSuccess: () => {
                reset(); // state
                setCustomGameTitle(''); // state
                setCustomState(''); // state
                setSubmitted(true); // state
            }
        }); // save
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
            <Head title="Join Tournament Registration - MESF" />



            {/* Custom Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[12%] left-[8%] w-[520px] h-[520px] bg-purple-600/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[20%] right-[8%] w-[520px] h-[520px] bg-blue-600/10 rounded-full blur-[160px]" />
            </div>

            {/* Floating Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar />
            </div>

            {/* Hero Header */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-32 pb-8">
                {/* Back Link */}
                <div className="mb-6">
                    <BackButton href="/get-involved" label="Back to Inquiries" />
                </div>

                <div className="pb-6 border-b border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                                Official Registration Desk
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white mt-1">
                                Join A Tournament
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal leading-relaxed mt-2">
                                Register your team or squad for MESF-sanctioned national leagues, qualifiers, and grassroots championship circuits.
                            </p>
                        </div>

                        {/* Subnav switcher between the 3 inquiry forms */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-black shadow-md font-bold">
                                <Users className="w-3.5 h-3.5" />
                                <span>Join Tournament</span>
                            </span>
                            <Link
                                href="/partnership" // redirect
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all"
                            >
                                <Handshake className="w-3.5 h-3.5" />
                                <span>Partnership</span>
                            </Link>
                            <Link
                                href="/host-tournament" // redirect
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all"
                            >
                                <Trophy className="w-3.5 h-3.5" />
                                <span>Host Event</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area: Form + Guidelines Sidebar */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-28">
                {/* Success Banner */}
                {(submitted || flash?.success) && (
                    <div className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-4 backdrop-blur-xl animate-fadeIn shadow-xl">
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-0.5" />
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-white">Registration Received Successfully!</h3>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                                {flash?.success || 'Thank you, your inquiry has been received. Our competitions desk will review your submission and contact your team coordinator via WhatsApp or email.'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Form Area */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Card 1: Team & Game Specifications */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/15 text-neutral-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        01
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Team &amp; Game Specifications
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Enter your squad roster details and the official esports discipline.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Team Name */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Team / Squad Name <span className="text-rose-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.team_name} // state
                                            onChange={(e) => setData('team_name', e.target.value)} // trigger
                                            placeholder="e.g. Team Alpha / Shadow Squad"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.team_name && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.team_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* State Origin */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>State / Region Origin <span className="text-rose-400 font-bold">*</span></span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={data.state} // state
                                                onChange={(e) => {
                                                    setData('state', e.target.value); // trigger
                                                    if (e.target.value !== 'Other / International') {
                                                        setCustomState(''); // state
                                                    }
                                                }}
                                                className="w-full appearance-none px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all pr-10 hover:border-white/20"
                                            >
                                                <option value="" disabled className="bg-[#090D18] text-neutral-400">Select state of origin</option>
                                                {MALAYSIA_STATES.map((st) => (
                                                    <option key={st} value={st} className="bg-[#090D18] text-white">{st}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-neutral-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {errors.state && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.state}
                                            </p>
                                        )}

                                        {data.state === 'Other / International' && (
                                            <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                                                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                                    Specify Region / Country <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={customState} // state
                                                    onChange={(e) => setCustomState(e.target.value)} // trigger
                                                    placeholder="e.g. Country / Regional Area"
                                                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/15 focus:border-white/40 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Game Title */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Game Title <span className="text-rose-400 font-bold">*</span></span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={data.game_title} // state
                                                onChange={(e) => {
                                                    setData('game_title', e.target.value); // trigger
                                                    if (e.target.value !== 'Other / Open Title') {
                                                        setCustomGameTitle(''); // state
                                                    }
                                                }}
                                                className="w-full appearance-none px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all pr-10 hover:border-white/20"
                                            >
                                                <option value="" disabled className="bg-[#090D18] text-neutral-400">Select game title</option>
                                                {SANCTIONED_GAMES.map((game) => (
                                                    <option key={game} value={game} className="bg-[#090D18] text-white">{game}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-neutral-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {errors.game_title && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.game_title}
                                            </p>
                                        )}

                                        {data.game_title === 'Other / Open Title' && (
                                            <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                                                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                                    Specify Game Title <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={customGameTitle} // state
                                                    onChange={(e) => setCustomGameTitle(e.target.value)} // trigger
                                                    placeholder="e.g. Game Title / Competitive Discipline"
                                                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/15 focus:border-white/40 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Number of Players */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Squad Size <span className="text-rose-400 font-bold">*</span></span>
                                            <span className="text-[11px] text-neutral-400 font-normal">incl. subs</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            required
                                            value={data.player_count} // state
                                            onChange={(e) => setData('player_count', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all hover:border-white/20"
                                        />
                                        {errors.player_count && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.player_count}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Captain / Manager Contact */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/15 text-neutral-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        02
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Captain / Manager Contact
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Primary liaison responsible for tournament briefings and schedules.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Contact Person Name */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Contact Person Name <span className="text-rose-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name} // state
                                            onChange={(e) => setData('name', e.target.value)} // trigger
                                            placeholder="e.g. Full Name"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Club / Gaming Organization */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Gaming Club / Organization</span>
                                            <span className="text-[11px] text-neutral-500 font-normal">Optional</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.organization} // state
                                            onChange={(e) => setData('organization', e.target.value)} // trigger
                                            placeholder="e.g. Organization / Gaming Club Name"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.organization && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.organization}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Email Address <span className="text-rose-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email} // state
                                            onChange={(e) => setData('email', e.target.value)} // trigger
                                            placeholder="e.g. contact@example.com"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone / WhatsApp */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Phone / WhatsApp Number <span className="text-rose-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone} // state
                                            onChange={(e) => setData('phone', e.target.value)} // trigger
                                            placeholder="e.g. +60 12-345 6789"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Roster & Additional Notes */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/15 text-neutral-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        03
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Roster List &amp; Additional Information
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Optionally list player In-Game Nicknames (IGNs) or qualifier preferences.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                        <span>Roster Breakdown &amp; Remarks</span>
                                        <span className="text-[11px] text-neutral-500 font-normal">Optional</span>
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.message} // state
                                        onChange={(e) => setData('message', e.target.value)} // trigger
                                        placeholder="e.g. Player 1: IGN (ID), Player 2: IGN (ID), Player 3: IGN (ID)..."
                                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/10 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20 leading-relaxed"
                                    />
                                    {errors.message && (
                                        <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />{errors.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit & Security Card */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5 text-xs text-neutral-400 text-left">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Submissions are strictly processed under official MESF regulations.</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-white/10 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                >
                                    {processing ? 'Submitting Registration...' : 'Submit Tournament Entry'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Secretariat Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* What Happens Next Card */}
                        <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neutral-400" />
                                <span>What Happens Next?</span>
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        1
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Entry Logging &amp; Validation</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            The MESF Competitions Desk records your roster in the national inquiry registry.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        2
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Review &amp; Bracket Seeding</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            Player eligibility and regional quotas are verified within 2 to 4 working days.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        3
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Direct Liaison Briefing</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            Your captain receives official WhatsApp schedule links and discord match channels.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct Secretariat Contact Card */}
                        <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-neutral-400" />
                                <span>Need Assistance?</span>
                            </h3>

                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Have questions regarding eligibility, registration deadlines, or rules? Contact the national desk:
                            </p>

                            <div className="space-y-2.5 pt-1">
                                <a
                                    href={`mailto:${replyEmail}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="truncate">{replyEmail}</span>
                                </a>

                                <a
                                    href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>{contactPhone}</span>
                                </a>
                            </div>
                        </div>

                        {/* Other Inquiries Switcher Card */}
                        <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-3">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                Other Federation Inquiries
                            </span>
                            <div className="space-y-2 pt-1">
                                <Link
                                    href="/partnership" // redirect
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Handshake className="w-4 h-4 text-emerald-400" />
                                        <span>Become a Partner</span>
                                    </div>
                                    <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">&rarr;</span>
                                </Link>

                                <Link
                                    href="/host-tournament" // redirect
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Trophy className="w-4 h-4 text-neutral-400" />
                                        <span>Host a Tournament</span>
                                    </div>
                                    <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MESF Footer */}
            <Footer />
        </div>
    );
}

