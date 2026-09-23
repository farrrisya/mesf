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
    Clock,
    ShieldCheck,
    Mail,
    Phone,
    HelpCircle,
    Calendar,
    MapPin
} from 'lucide-react';

// --2. main component--
export default function HostTournament() {
    const { flash = {}, settings = {} } = usePage().props; // properties
    const [submitted, setSubmitted] = useState(false); // state

    const replyEmail = settings?.replyEmail || settings?.supportEmail || 'contact@mesf.my'; // properties
    const contactPhone = settings?.phone || '+603-8052 5278'; // properties

    // form state
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'host_tournament', // state
        name: '', // state
        email: '', // state
        phone: '', // state
        organization: '', // state
        proposed_event_name: '', // state
        proposed_dates: '', // state
        venue: '', // state
        expected_teams: '', // state
        message: '', // state
    });

    // --3. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // trigger
        post('/inquiries', {
            onSuccess: () => {
                reset(); // state
                setSubmitted(true); // state
            }
        }); // save
    };

    // --4. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title="Host a Tournament - MESF" />

            {/* Background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Custom Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[12%] left-[8%] w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[20%] right-[8%] w-[520px] h-[520px] bg-purple-600/10 rounded-full blur-[160px]" />
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
                            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 font-mono">
                                Official Tournament Hosting
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white mt-1">
                                Host A Tournament
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal leading-relaxed mt-2">
                                Apply for official MESF endorsement, certified referees, national circuit ranking points, and technical federation support.
                            </p>
                        </div>

                        {/* Subnav switcher between the 3 inquiry forms */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <Link
                                href="/join-tournament" // redirect
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all hover:scale-105"
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span>Join Tournament</span>
                            </Link>
                            <Link
                                href="/partnership" // redirect
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all hover:scale-105"
                            >
                                <Handshake className="w-3.5 h-3.5" />
                                <span>Partnership</span>
                            </Link>
                            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black shadow-[0_0_18px_rgba(251,191,36,0.3)]">
                                <Trophy className="w-3.5 h-3.5" />
                                <span>Host a Tournament</span>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area: Form + Sidebar */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-28">
                {/* Success Banner */}
                {(submitted || flash?.success) && (
                    <div className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-4 backdrop-blur-xl animate-fadeIn shadow-xl">
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-0.5" />
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-white">Hosting Application Received!</h3>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                                {flash?.success || 'Thank you, your tournament hosting application has been received. Our competitions committee will review the event specifications and contact your organizing lead.'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Form Area */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Card 1: Organizing Body Information */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        01
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Organizing Body Information
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Details of the company, university, club, or agency hosting the esports competition.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Organizing Entity */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Organizing Entity / Organization <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.organization} // state
                                            onChange={(e) => setData('organization', e.target.value)} // trigger
                                            placeholder="e.g. Organization / Event Organizer / Esports Club"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.organization && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.organization}
                                            </p>
                                        )}
                                    </div>

                                    {/* Organizing Lead */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Organizing Lead / Contact Person <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name} // state
                                            onChange={(e) => setData('name', e.target.value)} // trigger
                                            placeholder="e.g. Full Name"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Official Email Address <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email} // state
                                            onChange={(e) => setData('email', e.target.value)} // trigger
                                            placeholder="e.g. contact@example.com"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Phone / Mobile WhatsApp <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone} // state
                                            onChange={(e) => setData('phone', e.target.value)} // trigger
                                            placeholder="e.g. +60 12-345 6789"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Event Specifications */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        02
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Event Specifications &amp; Scale
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Specifications for the tournament applying for official MESF endorsement &amp; support.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Proposed Event Name */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Proposed Event / League Name <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.proposed_event_name} // state
                                            onChange={(e) => setData('proposed_event_name', e.target.value)} // trigger
                                            placeholder="e.g. Tournament Title / Championship Series"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.proposed_event_name && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.proposed_event_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Expected Teams */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Expected Teams / Participant Slots <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.expected_teams} // state
                                            onChange={(e) => setData('expected_teams', e.target.value)} // trigger
                                            placeholder="e.g. 32 Teams / 160 Players"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.expected_teams && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.expected_teams}
                                            </p>
                                        )}
                                    </div>

                                    {/* Proposed Dates */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Proposed Dates / Timeline <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.proposed_dates} // state
                                            onChange={(e) => setData('proposed_dates', e.target.value)} // trigger
                                            placeholder="e.g. DD/MM/YYYY or Proposed Date Range"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.proposed_dates && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.proposed_dates}
                                            </p>
                                        )}
                                    </div>

                                    {/* Venue & Format */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Venue &amp; Competition Format <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.venue} // state
                                            onChange={(e) => setData('venue', e.target.value)} // trigger
                                            placeholder="e.g. Online Qualifiers + LAN Finals (Venue / City)"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.venue && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.venue}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Additional Event Information */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
                                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        03
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Additional Event Details &amp; Proposals
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Prize pool breakdown, format rules, or links to rulebook or deck.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                        <span>Prize Pool &amp; Tournament Structure</span>
                                        <span className="text-[11px] text-neutral-500 font-normal">Optional</span>
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.message} // state
                                        onChange={(e) => setData('message', e.target.value)} // trigger
                                        placeholder="e.g. Prize pool breakdown, tournament rulebook link, requested certified marshals, broadcast technical requirements..."
                                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20 leading-relaxed"
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
                                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span>Event endorsement is issued in compliance with National Sports Council guidelines.</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                >
                                    {processing ? 'Submitting Application...' : 'Submit Hosting Application'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Secretariat Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Hosting Process Card */}
                        <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span>Hosting Application Process</span>
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        1
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Application Assessment</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            The MESF Technical Committee verifies dates against the national esports tournament calendar.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        2
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Rulebook &amp; Marshal Allocation</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            Assistance with certified head referees, anti-cheat protocols, and player dispute procedures.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        3
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Official Endorsement</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            Official certificate issuance, public listing on the MESF events portal, and ranking points.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct Competitions Desk Contact Card */}
                        <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-amber-400" />
                                <span>Competitions Desk</span>
                            </h3>

                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Need emergency scheduling clearance or certified referee deployment? Contact the competitions desk:
                            </p>

                            <div className="space-y-2.5 pt-1">
                                <a
                                    href={`mailto:${replyEmail}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <Mail className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate">{replyEmail}</span>
                                </a>

                                <a
                                    href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <Phone className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
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
                                    href="/join-tournament" // redirect
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-400/40 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        <span>Join Tournament</span>
                                    </div>
                                    <span className="text-neutral-500 group-hover:text-amber-400 transition-colors">&rarr;</span>
                                </Link>

                                <Link
                                    href="/partnership" // redirect
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-400/40 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Handshake className="w-4 h-4 text-emerald-400" />
                                        <span>Become a Partner</span>
                                    </div>
                                    <span className="text-neutral-500 group-hover:text-amber-400 transition-colors">&rarr;</span>
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


