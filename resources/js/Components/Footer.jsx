// --1. imports--
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// --2. main component--
export default function Footer({ showCta = true }) {
    // --3. properties--
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const orgName = settings?.orgName || 'Malaysia Esports Federation (MESF)'; // properties
    const orgSlogan = settings?.orgSlogan || 'Bersama Memacu Esports Malaysia'; // properties
    const replyEmail = settings?.replyEmail || settings?.supportEmail || 'contact@mesf.my'; // properties
    const phone = settings?.phone || '+603-8052 5278'; // properties
    const streetAddress = settings?.streetAddress || ''; // properties
    const postalCode = settings?.postalCode || ''; // properties
    const city = settings?.city || ''; // properties
    const state = settings?.state || ''; // properties
    const country = settings?.country || 'Malaysia'; // properties
    const address = streetAddress
        ? `${streetAddress}, ${postalCode ? `${postalCode} ` : ''}${city ? `${city}, ` : ''}${state ? `${state}, ` : ''}${country}`
        : 'Spacerubix, Jalan TPP 1/7, Taman Perindustrian Puchong, 47100 Puchong, Selangor, Malaysia'; // properties

    // --4. state--
    const [newsletterEmail, setNewsletterEmail] = useState(''); // state
    const [isSubscribed, setIsSubscribed] = useState(false); // state

    // --5. actions--
    const handleSubscribe = (e) => { // trigger
        e.preventDefault(); // trigger
        if (!newsletterEmail.trim()) return; // check
        setIsSubscribed(true); // save
        setNewsletterEmail(''); // state
    };

    // --6. UI--
    return (
        <footer className="relative w-full bg-[#030508] border-t border-white/5 overflow-hidden">
            {/* subtle glowing top edge gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* giant atmospheric text watermark across bottom */}
            <div className="pointer-events-none absolute bottom-4 sm:bottom-2 left-1/2 -translate-x-1/2 text-[13vw] font-['Anton'] uppercase text-white/[0.02] whitespace-nowrap select-none leading-none tracking-widest z-0">
                MALAYSIA ESPORTS
            </div>

            {/* footer inner content */}
            <div className="relative z-10 pt-20 pb-10 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
                {/* the hook / top call-to-action */}
                {showCta && (
                    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/5">
                        <div className="space-y-1.5 text-left">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
                                JOIN, PARTNER &amp; BUILD WITH MESF
                            </h2>
                            <p className="text-xs sm:text-sm font-semibold tracking-wider text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                                Official registration and inquiry hub for athletes, brands, organizers, and communities.
                            </p>
                        </div>
                        <Link
                            href="/get-involved"
                            className="relative overflow-hidden px-8 py-3.5 rounded-full backdrop-blur-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs sm:text-sm tracking-widest uppercase border border-white/20 hover:border-amber-400/60 shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group shrink-0 inline-flex items-center justify-center select-none"
                        >
                            <span className="relative z-10">GET STARTED</span>
                        </Link>
                    </div>
                )}

                {/* the footer content (brand, secretariat, newsletter) */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start ${showCta ? 'pt-12' : 'pt-0'}`}>
                    {/* the brand */}
                    <div className="space-y-6 text-left md:col-span-2 lg:col-span-5 max-w-md">
                        <img
                            src={logoUrl}
                            alt="MESF Logo"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/mesf_logo.png';
                            }}
                            className="h-24 sm:h-28 w-auto max-w-[260px] object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.15)] select-none"
                        />
                        <div className="space-y-2">
                            <div className="inline-block text-xs sm:text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
                                &ldquo;{orgSlogan}&rdquo;
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                                The official national governing body for electronic sports in Malaysia under the Ministry of Youth and Sports (KBS) and Majlis Sukan Negara (MSN).
                            </p>
                        </div>

                        {/* social icons */}
                        <div className="flex items-center gap-2.5 pt-2">
                            {[
                                {
                                    name: 'Facebook',
                                    href: settings?.facebook || 'https://facebook.com',
                                    icon: (
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'Instagram',
                                    href: settings?.instagram || 'https://instagram.com',
                                    icon: (
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'TikTok',
                                    href: settings?.tiktok || 'https://tiktok.com',
                                    icon: (
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'X',
                                    href: settings?.xUrl || settings?.twitter || 'https://x.com',
                                    icon: (
                                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    )
                                }
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="group/social relative flex items-center justify-center h-10 w-10 rounded-xl bg-white/[0.04] hover:bg-amber-400/[0.12] border border-white/10 hover:border-amber-400/50 text-neutral-400 hover:text-amber-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(251,191,36,0.25)] cursor-pointer"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* the secretariat desk */}
                    <div className="w-full space-y-3 text-left md:col-span-1 lg:col-span-4">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-white/50 block">
                            Official Secretariat Desk
                        </span>
                        <div className="space-y-2.5 text-xs text-neutral-300">
                            <a
                                href={`mailto:${replyEmail}`} // link
                                className="flex items-center gap-2.5 hover:text-amber-300 transition-colors group"
                            >
                                <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="font-mono">{replyEmail}</span>
                            </a>

                            <a
                                href={`tel:${phone.replace(/\s+/g, '')}`} // link
                                className="flex items-center gap-2.5 hover:text-amber-300 transition-colors group"
                            >
                                <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="font-mono">{phone}</span>
                            </a>

                            <div className="flex items-start gap-2.5 text-neutral-400">
                                <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="leading-relaxed">{address}</span>
                            </div>
                        </div>
                    </div>

                    {/* the newsletter / circulars subscription */}
                    <div className="w-full space-y-3 text-left md:col-span-1 lg:col-span-3">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-white/50 block">
                            Official Circulars &amp; Dispatch
                        </span>
                        <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                            Receive verified tournament bulletins, sanctioning notices, and national athlete updates.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)} // input
                                    placeholder="e.g. contact@example.com"
                                    required
                                    className="w-full h-9.5 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-400/30 transition-all duration-300"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubscribed}
                                className={`w-full h-9 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                                    isSubscribed
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black hover:shadow-[0_0_18px_rgba(251,191,36,0.35)] active:scale-[0.98]'
                                }`}
                            >
                                {isSubscribed ? (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Subscribed</span>
                                    </>
                                ) : (
                                    <span>Subscribe to Circulars</span>
                                )}
                            </button>
                        </form>
                        {isSubscribed ? (
                            <p className="text-[11px] text-emerald-400/90 font-medium">
                                Thank you! You will receive verified MESF announcements.
                            </p>
                        ) : (
                            <p className="text-[10px] text-neutral-500">
                                Verified federation circulars only. Unsubscribe at any time.
                            </p>
                        )}
                    </div>
                </div>

                {/* sub-footer row */}
                <div className="relative z-10 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 text-center sm:text-left">
                    <p>
                        &copy; {new Date().getFullYear()} Malaysia Esports Federation (MESF). All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-neutral-300 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-neutral-300 transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-neutral-300 transition-colors">
                            Sanctioning Code
                        </a>
                        <button
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // trigger
                            className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer select-none"
                        >
                            <span>Back to top</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
