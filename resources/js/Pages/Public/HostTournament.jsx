// --1. imports--
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import Footer from '@/Components/Footer';
import { useState } from 'react';
import { Trophy, Users, Handshake, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

// --2. properties--

// --3. main component--
export default function HostTournament() {
    const { flash = {} } = usePage().props; // properties
    const [submitted, setSubmitted] = useState(false); // state

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
            <Head title="Host / Sanction a Tournament - MESF" />

            {/* Background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Custom Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
            </div>

            {/* 1. Floating Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar />
            </div>

            {/* 2. Hero Header */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-8 text-left">
                {/* Standard Back Button matching StateDetails & TeamDetails */}
                <div className="mb-8">
                    <Link
                        href="/get-involved" // redirect
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer group"
                    >
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span>Back to Inquiries</span>
                    </Link>
                </div>

                <div className="pb-6 border-b border-white/10 space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase text-white leading-tight">
                        Host &amp; Sanction A Tournament
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal leading-relaxed">
                        Submit your tournament proposal to receive official sanctioning, technical endorsement, certified referees, and national circuit points from MESF.
                    </p>

                    {/* Subnav switcher between the 3 inquiry forms */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                        <Link
                            href="/join-tournament"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all hover:scale-105"
                        >
                            <Users className="w-3.5 h-3.5" />
                            <span>Join Tournament</span>
                        </Link>
                        <Link
                            href="/partnership"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all hover:scale-105"
                        >
                            <Handshake className="w-3.5 h-3.5" />
                            <span>Become a Partner</span>
                        </Link>
                        <Link
                            href="/host-tournament"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-transform hover:scale-105"
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Host a Tournament</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* 3. Form Section */}
            <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pb-28 text-left">
                {/* Success Banner */}
                {(submitted || flash?.success) && (
                    <div className="mb-8 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-4 backdrop-blur-xl animate-fadeIn shadow-xl max-w-4xl">
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-0.5" />
                        <div className="space-y-1 text-left">
                            <h3 className="text-base font-bold text-white">Sanctioning Request Received!</h3>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                                {flash?.success || 'Thank you, your sanctioning application has been received. Our competitions committee will review the event specifications.'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="max-w-4xl rounded-3xl p-6 sm:p-10 lg:p-12 bg-[#090D18]/90 border border-white/10 shadow-2xl backdrop-blur-2xl text-left">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 1. Organizer Information */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-wide">
                                    1. Organizing Body Information
                                </h2>
                                <p className="text-xs text-neutral-400">
                                    Details of the company, university, club, or agency hosting the esports competition.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Organizing Entity / Organization <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.organization} // state
                                        onChange={(e) => setData('organization', e.target.value)} // trigger
                                        placeholder="e.g. Universiti Malaya Esports Club / Geek Events Sdn Bhd"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.organization && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.organization}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Organizing Lead / Contact Person <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name} // state
                                        onChange={(e) => setData('name', e.target.value)} // trigger
                                        placeholder="Full legal name"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.name && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Official Email <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email} // state
                                        onChange={(e) => setData('email', e.target.value)} // trigger
                                        placeholder="organizer@domain.com"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.email && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Phone / Mobile WhatsApp <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={data.phone} // state
                                        onChange={(e) => setData('phone', e.target.value)} // trigger
                                        placeholder="+6012-345 6789"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.phone && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/10" />

                        {/* 2. Proposed Tournament Details */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-wide">
                                    2. Event Specifications
                                </h2>
                                <p className="text-xs text-neutral-400">
                                    Specifications for the tournament applying for MESF sanctioning.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Proposed Event / League Name <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.proposed_event_name} // state
                                        onChange={(e) => setData('proposed_event_name', e.target.value)} // trigger
                                        placeholder="e.g. Selangor Youth Esports Cup 2026 / Campus Championship Season 4"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.proposed_event_name && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.proposed_event_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Proposed Dates / Timeline <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.proposed_dates} // state
                                        onChange={(e) => setData('proposed_dates', e.target.value)} // trigger
                                        placeholder="e.g. 15-20 November 2026"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.proposed_dates && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.proposed_dates}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Expected Number of Teams / Slots <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.expected_teams} // state
                                        onChange={(e) => setData('expected_teams', e.target.value)} // trigger
                                        placeholder="e.g. 64 Teams / 320 Players"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.expected_teams && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.expected_teams}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                        Venue &amp; Competition Format <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.venue} // state
                                        onChange={(e) => setData('venue', e.target.value)} // trigger
                                        placeholder="e.g. Online Qualifiers + Grand Finals LAN at Axiata Arena, Bukit Jalil"
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600"
                                    />
                                    {errors.venue && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.venue}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/10" />

                        {/* 3. Additional Details */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-wide">
                                    3. Additional Event Information
                                </h2>
                                <p className="text-xs text-neutral-400">
                                    Prize pool breakdown, rules overview, or link to official proposal document.
                                </p>
                            </div>

                            <div>
                                <textarea
                                    rows="4"
                                    value={data.message} // state
                                    onChange={(e) => setData('message', e.target.value)} // trigger
                                    placeholder="e.g. Total Prize Pool: RM 20,000. Games included: MLBB & PUBG Mobile. Link to deck/rulebook..."
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-neutral-600 leading-relaxed"
                                />
                                {errors.message && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.message}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* 4. MESF Footer */}
            <Footer />
        </div>
    );
}
