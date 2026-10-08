// --1. imports--
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import Footer from '@/Components/Footer';
import BackButton from '@/Components/BackButton';
import { useState } from 'react';
import {
    Handshake,
    Users,
    Trophy,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ChevronDown,
    Clock,
    ShieldCheck,
    Mail,
    Phone,
    HelpCircle,
    Briefcase
} from 'lucide-react';

// --2. properties--
const PARTNERSHIP_TYPES = [
    'Official Federation Sponsor (Title / Main Partner)',
    'National Team (Team MYS) Apparel & Jersey Sponsor',
    'Gaming Hardware & Peripheral Sponsor',
    'Beverage / FMCG / Energy Partner',
    'Telecommunication / High-Speed Network Partner',
    'Venue / Arena & Training Facility Partner',
    'Broadcast & Media Production Partner',
    'Grassroots & Academy Ecosystem Partner',
    'Other Commercial Collaboration'
];

// --3. main component--
export default function Partnership() {
    const { flash = {}, settings = {} } = usePage().props; // properties
    const [submitted, setSubmitted] = useState(false); // state

    const replyEmail = settings?.replyEmail || settings?.supportEmail || 'contact@mesf.my'; // properties
    const contactPhone = settings?.phone || '+603-8052 5278'; // properties

    // form state
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'partnership', // state
        name: '', // state
        email: '', // state
        phone: '', // state
        organization: '', // state
        partnership_type: '', // state
        proposal_summary: '', // state
        message: '', // state
    });

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // trigger
        post('/inquiries', {
            onSuccess: () => {
                reset(); // state
                setSubmitted(true); // state
            }
        }); // save
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title="Partnership & Sponsorship - MESF" />



            {/* Custom Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[12%] right-[8%] w-[520px] h-[520px] bg-emerald-600/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[20%] left-[8%] w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[160px]" />
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
                            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                                Commercial &amp; Strategic Partnerships
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white mt-1">
                                Partner With MESF
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal leading-relaxed mt-2">
                                Collaborate with the national governing body for esports in Malaysia. Connect your brand with millions of competitive gamers, Team MYS, and national circuits.
                            </p>
                        </div>

                        {/* Subnav switcher between the 3 inquiry forms */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <Link
                                href="/join-tournament" // redirect
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all"
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span>Join Tournament</span>
                            </Link>
                            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black shadow-[0_0_18px_rgba(251,191,36,0.3)]">
                                <Handshake className="w-3.5 h-3.5" />
                                <span>Partnership</span>
                            </span>
                            <Link
                                href="/host-tournament" // redirect
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all"
                            >
                                <Trophy className="w-3.5 h-3.5" />
                                <span>Host Event</span>
                            </Link>
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
                            <h3 className="text-base font-bold text-white">Proposal Received Successfully!</h3>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                                {flash?.success || 'Thank you, your partnership inquiry has been received. Our strategic partnerships desk will review your proposal and get in touch.'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Form Area */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Card 1: Organization & Contact Details */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        01
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Organization &amp; Contact Details
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Information regarding your company, agency, or brand.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Company Name */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Company / Organization Name <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.organization} // state
                                            onChange={(e) => setData('organization', e.target.value)} // trigger
                                            placeholder="e.g. Company Name / Brand Agency / Partner Entity"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.organization && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.organization}
                                            </p>
                                        )}
                                    </div>

                                    {/* Partnership Scope */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Partnership Scope / Category <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={data.partnership_type} // state
                                                onChange={(e) => setData('partnership_type', e.target.value)} // trigger
                                                className="w-full appearance-none px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all pr-10 hover:border-white/20"
                                            >
                                                <option value="" disabled className="bg-[#090D18] text-neutral-400">Select partnership scope</option>
                                                {PARTNERSHIP_TYPES.map((type) => (
                                                    <option key={type} value={type} className="bg-[#090D18] text-white">{type}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-neutral-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {errors.partnership_type && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.partnership_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Contact Person Name */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Contact Person Name <span className="text-amber-400 font-bold">*</span></span>
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

                                    {/* Official Business Email */}
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Official Business Email <span className="text-amber-400 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email} // state
                                            onChange={(e) => setData('email', e.target.value)} // trigger
                                            placeholder="e.g. partner@example.com"
                                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" />{errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone / Mobile */}
                                    <div className="md:col-span-2">
                                        <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                            <span>Direct Phone / Mobile WhatsApp <span className="text-amber-400 font-bold">*</span></span>
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

                            {/* Card 2: Proposal Summary & Objectives */}
                            <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
                                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                    <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                        02
                                    </span>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Proposal Summary &amp; Objectives
                                        </h2>
                                        <p className="text-xs text-neutral-400">
                                            Briefly outline what your organization is proposing, target deliverables, or timeline.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                        <span>Proposal Executive Summary <span className="text-amber-400 font-bold">*</span></span>
                                    </label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={data.proposal_summary} // state
                                        onChange={(e) => setData('proposal_summary', e.target.value)} // trigger
                                        placeholder="e.g. Outline your proposed collaboration, sponsorship terms, brand activation goals, or targeted initiatives..."
                                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 text-white text-sm outline-none transition-all placeholder:text-neutral-500 hover:border-white/20 leading-relaxed"
                                    />
                                    {errors.proposal_summary && (
                                        <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />{errors.proposal_summary}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-semibold text-neutral-300 tracking-wide mb-2">
                                        <span>Additional Remarks / Pitch Deck Link</span>
                                        <span className="text-[11px] text-neutral-500 font-normal">Optional</span>
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={data.message} // state
                                        onChange={(e) => setData('message', e.target.value)} // trigger
                                        placeholder="e.g. Link to cloud presentation deck, official website, or proposed timeline notes..."
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
                                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>All proposals are handled under strict non-disclosure commercial standards.</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                >
                                    {processing ? 'Submitting Proposal...' : 'Submit Partnership Proposal'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Secretariat Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Commercial Evaluation Process Card */}
                        <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                <span>Evaluation Process</span>
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        1
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Proposal Ingestion &amp; Review</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            The MESF Strategic Partnerships Committee assesses commercial synergy and brand alignment.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        2
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Introductory Engagement</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            A formal introductory meeting or briefing is scheduled with our commercial directors.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        3
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">Memorandum &amp; Activation</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                                            Formal partnership agreement execution followed by national media and circuit rollout.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct Commercial Desk Contact Card */}
                        <div className="bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-emerald-400" />
                                <span>Commercial Desk</span>
                            </h3>

                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Prefer to speak directly regarding bespoke sponsorship packages or title rights?
                            </p>

                            <div className="space-y-2.5 pt-1">
                                <a
                                    href={`mailto:${replyEmail}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <Mail className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate">{replyEmail}</span>
                                </a>

                                <a
                                    href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <Phone className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
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
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        <span>Join Tournament</span>
                                    </div>
                                    <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">&rarr;</span>
                                </Link>

                                <Link
                                    href="/host-tournament" // redirect
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-all text-xs group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Trophy className="w-4 h-4 text-amber-400" />
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

