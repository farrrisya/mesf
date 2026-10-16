// --1. imports--
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import Footer from '@/Components/Footer';
import BackButton from '@/Components/BackButton';
import {
    Users,
    Handshake,
    Trophy,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    Mail,
    Phone,
    Check,
    Copy,
    ExternalLink
} from 'lucide-react';

// --2. properties--
const INQUIRY_OPTIONS = [
    {
        id: 'join-tournament',
        title: 'Join a Tournament',
        eyebrow: 'For Players & Teams',
        description: 'Register your squad or roster for official MESF national leagues, state qualifiers, and grassroots championship circuits.',
        href: '/join-tournament',
        icon: Users,
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
        accentGlow: 'group-hover:bg-purple-500/20',
        hoverBorder: 'hover:border-purple-500/50',
        actionLabel: 'Enter Tournament',
        highlights: [
            'National league & qualifier entry',
            'State team selection trials',
            'Official player ranking points'
        ]
    },
    {
        id: 'partnership',
        title: 'Become a Partner',
        eyebrow: 'For Brands & Sponsors',
        description: 'Collaborate with the national governing body as a commercial sponsor, hardware supplier, venue partner, or broadcast affiliate.',
        href: '/partnership',
        icon: Handshake,
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
        accentGlow: 'group-hover:bg-emerald-500/20',
        hoverBorder: 'hover:border-emerald-500/50',
        actionLabel: 'Submit Proposal',
        highlights: [
            'Team MYS national jersey sponsorship',
            'Official league naming & title rights',
            'Access to nationwide esports community'
        ]
    },
    {
        id: 'host-tournament',
        title: 'Host a Tournament',
        eyebrow: 'For Organizers & Agencies',
        description: 'Apply for official MESF endorsement, certified referees, national circuit points, technical assistance, and event scheduling.',
        href: '/host-tournament',
        icon: Trophy,
        badgeBg: 'bg-white/10 text-neutral-200 border-white/20',
        accentGlow: 'group-hover:bg-white/10',
        hoverBorder: 'hover:border-white/30',
        actionLabel: 'Apply to Host',
        highlights: [
            'Official federation endorsement & support',
            'MESF-certified arbiters & marshals',
            'National calendar scheduling support'
        ]
    }
];


// --3. main component--
export default function GetInvolved() {
    const { settings } = usePage().props; // properties
    const officialEmail = settings?.replyEmail || settings?.supportEmail || 'contact@mesf.my'; // properties
    const phone = settings?.phone || '+603-8052 5278'; // properties

    // --4. actions--
    const [gmailLaunched, setGmailLaunched] = useState(false); // state
    const [copiedEmailText, setCopiedEmailText] = useState(false); // state
    const [copiedPhoneText, setCopiedPhoneText] = useState(false); // state

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(officialEmail)}&su=${encodeURIComponent('General Inquiry - MESF')}`;
    const defaultMailUrl = `mailto:${officialEmail}?subject=${encodeURIComponent('General Inquiry - MESF')}`;

    const handleOpenGmail = () => { // trigger
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(officialEmail);
        }
        setGmailLaunched(true);
        setTimeout(() => setGmailLaunched(false), 2500);
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCopyEmailOnly = () => { // trigger
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(officialEmail);
        }
        setCopiedEmailText(true);
        setTimeout(() => setCopiedEmailText(false), 2000);
    };

    const handleCopyPhone = () => { // trigger
        if (!phone) return;
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(phone);
        }
        setCopiedPhoneText(true);
        setTimeout(() => setCopiedPhoneText(false), 2000);
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
            <Head title="Get Involved & Inquiries - MESF" />



            {/* Custom Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[15%] left-[10%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
                <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px]" />
            </div>

            {/* 1. Floating Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar />
            </div>

            {/* 2. Main Content Container */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-36 sm:pt-40 pb-36 text-left">
                {/* Standard Back Button */}
                <div className="mb-10 sm:mb-12">
                    <BackButton href="/" label="Back to Home" />
                </div>

                {/* Hero Header Section */}
                <header className="pb-12 border-b border-white/10 mb-14 sm:mb-16 space-y-3">
                    <div className="mb-2">
                        <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                            [ FEDERATION ENGAGEMENT &amp; INQUIRIES ]
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase text-white leading-tight">
                        Get Involved
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-400 mt-3 max-w-2xl font-normal leading-relaxed">
                        Choose an option below to enter official competitions, establish commercial partnerships, or apply to host official tournaments under MESF.
                    </p>
                </header>


                {/* Main Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
                    {INQUIRY_OPTIONS.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <Link
                                key={option.id}
                                href={option.href} // link
                                className={`group relative rounded-3xl p-8 sm:p-9 md:p-10 bg-[#090D18]/90 border border-white/10 ${option.hoverBorder} backdrop-blur-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] cursor-pointer overflow-hidden text-left`}
                            >
                                {/* Radial Backlight Accent */}
                                <div className={`pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl ${option.accentGlow} transition-all duration-500`} />

                                <div className="space-y-7 relative z-10">
                                    {/* Icon and Eyebrow */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                                            <IconComponent className="w-7 h-7 text-neutral-300 group-hover:text-white" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${option.badgeBg}`}>
                                            {option.eyebrow}
                                        </span>
                                    </div>

                                    {/* Title and Description */}
                                    <div className="space-y-3">
                                        <h2 className="text-xl sm:text-2xl font-black text-white transition-colors tracking-wide uppercase">
                                            {option.title}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                                            {option.description}
                                        </p>
                                    </div>

                                    {/* Key Highlights */}
                                    <div className="pt-4 border-t border-white/10 space-y-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">
                                            Key Features:
                                        </span>
                                        <ul className="space-y-2.5">
                                            {option.highlights.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2.5 text-xs text-neutral-300">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/90 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Bottom Action Button */}
                                <div className="pt-10 relative z-10">
                                    <div className="w-full py-3.5 px-6 rounded-2xl bg-white/5 group-hover:bg-white border border-white/10 group-hover:border-white text-white group-hover:text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-between transition-all duration-300 shadow-sm group-hover:shadow-lg">
                                        <span>{option.actionLabel}</span>
                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Direct Secretary Contact Row */}
                <div className="mt-16 sm:mt-20 p-8 sm:p-10 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-300 shrink-0 shadow-inner">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                Have a Custom or General Inquiry?
                            </h3>
                            <p className="text-xs text-neutral-400">
                                Reach our secretary desk directly at{' '}
                                <span className="relative inline-block">
                                    <button
                                        type="button"
                                        onClick={handleCopyEmailOnly} // trigger
                                        title="Click to copy email address"
                                        className="text-white hover:text-neutral-300 font-mono font-semibold underline underline-offset-2 decoration-white/40 hover:decoration-white cursor-pointer inline-flex items-center gap-1"
                                    >
                                        <span>{officialEmail}</span>
                                        {copiedEmailText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                                    </button>
                                    {copiedEmailText && (
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-md shadow-lg pointer-events-none flex items-center gap-1 whitespace-nowrap z-30 animate-in fade-in zoom-in-75 duration-150">
                                            <Check className="w-2.5 h-2.5" />
                                            <span>Copied!</span>
                                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-500" />
                                        </span>
                                    )}
                                </span>
                                {phone && (
                                    <>
                                        {' '}or hotline{' '}
                                        <span className="relative inline-block">
                                            <button
                                                type="button"
                                                onClick={handleCopyPhone} // trigger
                                                title="Click to copy phone number"
                                                className="text-white hover:text-neutral-300 font-mono font-semibold underline underline-offset-2 decoration-white/40 hover:decoration-white cursor-pointer inline-flex items-center gap-1"
                                            >
                                                <span>{phone}</span>
                                                {copiedPhoneText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                                            </button>
                                            {copiedPhoneText && (
                                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-md shadow-lg pointer-events-none flex items-center gap-1 whitespace-nowrap z-30 animate-in fade-in zoom-in-75 duration-150">
                                                    <Check className="w-2.5 h-2.5" />
                                                    <span>Copied!</span>
                                                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-500" />
                                                </span>
                                            )}
                                        </span>
                                    </>
                                )}.
                            </p>
                        </div>
                    </div>

                    {/* Interactive Direct Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
                        <button
                            type="button"
                            onClick={handleOpenGmail} // trigger
                            title={`Compose new email in Gmail to ${officialEmail}`}
                            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                                gmailLaunched
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                                    : 'bg-white hover:bg-neutral-100 border-white text-black font-extrabold shadow-lg'
                            }`}
                        >
                            {gmailLaunched ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Opened in Gmail!</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="w-3.5 h-3.5 text-slate-950" />
                                    <span>Open in Gmail</span>
                                </>
                            )}
                        </button>

                        <a
                            href={defaultMailUrl} // link
                            title="Open in your default email client (Apple Mail, Outlook, etc.)"
                            className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Default App</span>
                        </a>
                    </div>
                </div>
            </main>

            {/* 3. MESF Footer */}
            <Footer />
        </div>
    );
}
