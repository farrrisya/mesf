// --1. imports--
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// --2. main component--
export default function PublicLayout({ auth = {}, isHome = false, hideNavbar = false, hideFooter = false, children }) {
    const { settings } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // state
    const [openMenu, setOpenMenu] = useState(null); // state
    const [isScrolled, setIsScrolled] = useState(false); // state
    const [isMenuHidden, setIsMenuHidden] = useState(false); // state
    const headerRef = useRef(null); // state
    const hamburgerRef = useRef(null); // state
    const [headerHeight, setHeaderHeight] = useState(0); // state
    const [closePos, setClosePos] = useState({ top: 32, right: 32, bottom: 100 }); // state
    const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu); // trigger
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' }); // trigger

    // trigger
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50); // state
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // trigger
    useEffect(() => {
        if (isScrolled) {
            setIsMenuHidden(true);
        } else {
            const timer = setTimeout(() => setIsMenuHidden(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isScrolled]);

    // trigger
    useEffect(() => {
        if (!headerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // adding border height (if border-box is not fully captured or just use offsetHeight)
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        });

        observer.observe(headerRef.current);

        // Also fallback window events just in case
        const updatePos = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };
        window.addEventListener('resize', updatePos);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updatePos);
        };
    }, []);

    // trigger
    useEffect(() => {
        const updatePos = () => {
            if (hamburgerRef.current) {
                const rect = hamburgerRef.current.getBoundingClientRect();
                setClosePos({
                    top: rect.top,
                    right: window.innerWidth - rect.right,
                    bottom: rect.bottom
                });
            }
        };

        if (isSidebarOpen) {
            updatePos();
            window.addEventListener('resize', updatePos);
            window.addEventListener('scroll', updatePos);
            return () => {
                window.removeEventListener('resize', updatePos);
                window.removeEventListener('scroll', updatePos);
            };
        }
    }, [isSidebarOpen, isScrolled]);

    const getLinkStyle = (path) => { // state
        const isActive = typeof window !== 'undefined' && (path === '/' ? window.location.pathname === '/' : window.location.pathname.startsWith(path));
        
        if (!isScrolled) {
            return isActive 
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white drop-shadow-md' 
                : 'text-white drop-shadow-md after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-300 after:ease-in-out';
        }
        
        return isActive 
            ? 'text-[#0a192f] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0a192f]' 
            : 'text-slate-600 hover:text-[#0a192f] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0a192f] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-300 after:ease-in-out';
    };

    return (
        <div className={`min-h-screen ${isHome ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100' : 'bg-white'} text-slate-800 font-sans antialiased relative`}>

            {/* SVG Filter for crisp logo outline and filling internal transparency */}
            <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
                <filter id="white-outline" x="-20%" y="-20%" width="140%" height="140%">
                    {/* 1. Morphological Closing: Dilate then Erode. This fills internal transparent holes up to 8px wide but keeps the outer edge at the exact original size. */}
                    <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="DILATED"></feMorphology>
                    <feMorphology in="DILATED" operator="erode" radius="4" result="CLOSED_ALPHA"></feMorphology>
                    
                    {/* 2. Apply a smooth Gaussian blur to the closed shape to create the stroke */}
                    <feGaussianBlur in="CLOSED_ALPHA" stdDeviation="2.5" result="BLUR"></feGaussianBlur>
                    
                    {/* 3. Harden the blur into a solid, crisp outline */}
                    <feComponentTransfer in="BLUR" result="SMOOTH_OUTLINE">
                        <feFuncA type="linear" slope="20" />
                    </feComponentTransfer>
                    
                    {/* 4. Color the stroke white */}
                    <feFlood floodColor="white" floodOpacity="1" result="WHITE"></feFlood>
                    <feComposite in="WHITE" in2="SMOOTH_OUTLINE" operator="in" result="OUTLINE"></feComposite>
                    
                    {/* 5. Merge the white backing/outline with the original image */}
                    <feMerge>
                        <feMergeNode in="OUTLINE" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </svg>

            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-[#0a192f]/10 via-amber-500/3 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-[45%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-amber-500/8 via-[#0a192f]/3 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-[15%] left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#0a192f]/10 via-red-500/2 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Header Placeholder to prevent layout shift */}
            {/* Removed so the page content goes all the way to the top under the transparent navbar */}

            {/* Fixed Scrolling Header */}
            {!hideNavbar && (
                <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none w-full">
                    <header ref={headerRef} className={`w-full transition-all duration-300 ease-in-out pointer-events-auto ${isScrolled ? 'bg-white/40 backdrop-blur-2xl backdrop-saturate-[1.5] border-b border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'bg-transparent border-transparent pt-2 md:pt-3'}`}>
                        <div className="max-w-[1350px] mx-auto w-full px-4 md:px-8">
                            <div className="w-full">
                                {/* Header Content */}
                                <div className="transition-all duration-300 ease-in-out flex items-center justify-between py-1.5 md:py-2">

                                    {/* Left: Logo */}
                                    <div className="flex-shrink-0">
                                        <Link href="/" className="flex items-center" /* redirect */>
                                            <img
                                                src={settings?.logoUrl || '/images/mesf_logo.png'}
                                                alt="MESF Logo"
                                                className="w-auto object-contain transition-all duration-300 ease-in-out h-14 md:h-16 lg:h-20 relative z-10"
                                                style={{ filter: !isScrolled ? 'url(#white-outline)' : 'none' }}
                                            />
                                        </Link>
                                    </div>

                                    {/* Right: Full Menu */}
                                    <div className="flex-1 ml-2 md:ml-4 lg:ml-8 overflow-visible py-2 flex justify-end">
                                        <ul
                                            className="flex items-center justify-end gap-x-6 md:gap-x-8 lg:gap-x-12 font-bold tracking-[0.05em] uppercase whitespace-nowrap transition-all duration-300 ease-in-out text-[10px] lg:text-[12px]"
                                            style={{ fontFamily: "'Chivo', sans-serif" }}
                                        >
                                            {/* Utama */}
                                            <li className="relative group/item">
                                                <Link href={route('home')} className={`relative flex items-center py-1 transition-colors duration-300 ${getLinkStyle('/')}`}>
                                                    Utama
                                                </Link>
                                            </li>

                                            {/* Profil */}
                                            <li className="relative group/item">
                                                <Link href={route('profil')} className={`relative flex items-center py-1 transition-colors duration-300 ${getLinkStyle('/profil')}`}>
                                                    Profil
                                                </Link>
                                            </li>

                                            {/* Dokumen */}
                                            <li className="relative group/item">
                                                <Link href={route('dokumen')} className={`relative flex items-center py-1 transition-colors duration-300 ${getLinkStyle('/dokumen')}`}>
                                                    Dokumen
                                                </Link>
                                            </li>

                                            {/* Log Masuk */}
                                            <li className="relative group/item ml-2 md:ml-4">
                                                <Link
                                                    href={route('login')}
                                                    className="relative flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 transition-all duration-300 shadow-sm"
                                                >
                                                    Log Masuk
                                                </Link>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Footer */}
            {!hideFooter && (
                <footer className="w-full bg-[#061122] text-slate-300 border-t border-slate-800/50 pt-12 pb-0 relative z-20 shadow-md">
                    {/* Clean, professional top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

                    <div className="max-w-[1350px] mx-auto px-4 md:px-8 space-y-8 pb-8">
                        {/* Top Row: Brand, Socials & Support */}
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                            {/* Brand & Social */}
                            <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
                                <div className="flex items-center gap-4 transition-opacity duration-300 hover:opacity-80">
                                    <img
                                        src="/logo.png"
                                        alt="MESF Logo"
                                        className="h-16 w-auto object-contain drop-shadow-sm brightness-[2] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                    />
                                    <div className="text-left">
                                        <span className="font-black text-white tracking-wide text-xl block leading-none mb-1">MESF</span>
                                        <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest block leading-tight">Malaysia Esports Federation</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center md:items-start gap-4 mt-2">
                                    {settings?.social_facebook && (
                                        <a
                                            href={settings.social_facebook}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center gap-3.5 transition-all duration-300"
                                            title="Facebook"
                                        >
                                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-400 group-hover:border-transparent group-hover:bg-[#1877F2] group-hover:text-white group-hover:shadow-[0_8px_16px_rgba(24,119,242,0.25)] group-hover:-translate-y-1 transition-all duration-300 z-10 shrink-0">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                                </svg>
                                            </div>
                                            {settings?.social_facebook_username ? (
                                                <span className="text-[14px] font-semibold text-slate-500 group-hover:text-[#1877F2] transition-colors duration-300">{settings.social_facebook_username}</span>
                                            ) : (
                                                <span className="text-[14px] font-semibold text-slate-500 group-hover:text-[#1877F2] transition-colors duration-300">Facebook</span>
                                            )}
                                        </a>
                                    )}
                                    
                                    {settings?.social_instagram && (
                                        <a
                                            href={settings.social_instagram}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center gap-3.5 transition-all duration-300"
                                            title="Instagram"
                                        >
                                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-400 group-hover:border-transparent group-hover:bg-gradient-to-tr group-hover:from-[#f58529] group-hover:via-[#dd2a7b] group-hover:to-[#8134af] group-hover:text-white group-hover:shadow-[0_8px_16px_rgba(225,48,108,0.25)] group-hover:-translate-y-1 transition-all duration-300 z-10 shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                                </svg>
                                            </div>
                                            {settings?.social_instagram_username ? (
                                                <span className="text-[14px] font-semibold text-slate-500 group-hover:text-[#E1306C] transition-colors duration-300">{settings.social_instagram_username}</span>
                                            ) : (
                                                <span className="text-[14px] font-semibold text-slate-500 group-hover:text-[#E1306C] transition-colors duration-300">Instagram</span>
                                            )}
                                        </a>
                                    )}

                                    {settings?.social_tiktok && (
                                        <a
                                            href={settings.social_tiktok}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center gap-3.5 transition-all duration-300"
                                            title="TikTok"
                                        >
                                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-400 group-hover:border-transparent group-hover:bg-[#111111] group-hover:text-white group-hover:shadow-[0_8px_16px_rgba(17,17,17,0.25)] group-hover:-translate-y-1 transition-all duration-300 z-10 shrink-0">
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512">
                                                    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                                                </svg>
                                            </div>
                                            {settings?.social_tiktok_username ? (
                                                <span className="text-[14px] font-semibold text-slate-500 group-hover:text-[#111111] transition-colors duration-300">{settings.social_tiktok_username}</span>
                                            ) : (
                                                <span className="text-[14px] font-semibold text-slate-500 group-hover:text-[#111111] transition-colors duration-300">TikTok</span>
                                            )}
                                        </a>
                                    )}
                                </div>
                            </div>

                        {/* Support Links */}
                        <div className="flex flex-col sm:flex-row items-start gap-12 sm:gap-16">
                            <div className="flex flex-col gap-4 w-full sm:w-auto">
                                <h4 className="flex items-center justify-center sm:justify-start gap-2 text-[15px] font-bold text-white/90">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    Pautan Pantas
                                </h4>
                                 <div className="flex flex-col gap-3 px-1 text-[13px] font-medium text-slate-400 text-center sm:text-left">
                                     <Link href={route('home')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Utama
                                     </Link>
                                     <Link href={route('profil')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Profil
                                     </Link>
                                     <Link href={route('dokumen')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Dokumen
                                     </Link>
                                     <Link href={route('public.penerbitan')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Penerbitan
                                     </Link>
                                     <Link href={route('public.notices')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Berita & Notis
                                     </Link>
                                     <Link href={route('galeri')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Galeri
                                     </Link>
                                 </div>
                             </div>

                             <div className="flex flex-col gap-4 w-full sm:w-auto">
                                 <Link href={route('hubungi-kami')} className="group flex items-center justify-center sm:justify-start gap-2 text-[15px] font-bold text-white/90 transition-colors duration-300" /* redirect */>
                                     <svg className="w-4 h-4 text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                     Hubungi Kami
                                 </Link>
                                 <div className="flex flex-col gap-3 px-1 text-[13px] font-medium text-slate-400 text-center sm:text-left">
                                     <Link href={route('hubungi-kami')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Talian Hubungan
                                     </Link>
                                     <Link href={route('hubungi-kami')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Direktori Kakitangan
                                     </Link>
                                     <Link href={route('hubungi-kami')} className="group flex items-center justify-center sm:justify-start gap-1.5" /* redirect */>
                                         <svg className="w-3 h-3 text-slate-500 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         Lokasi
                                     </Link>
                                 </div>
                             </div>
                             
                             <div className="flex flex-col gap-4 w-full sm:w-auto">
                                 <h4 className="flex items-center justify-center sm:justify-start gap-2 text-[15px] font-bold text-white/90">
                                     <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                     Waktu Operasi
                                 </h4>
                                 <div className="flex flex-col gap-2 px-1 text-[12px] font-medium text-slate-400 text-center sm:text-left min-w-[160px]">
                                     <div className="flex justify-between gap-4">
                                         <span>Isnin</span>
                                         <span className="text-slate-400 font-normal">09:00 AM - 06:00 PM</span>
                                     </div>
                                     <div className="flex justify-between gap-4">
                                         <span>Selasa</span>
                                         <span className="text-slate-400 font-normal">09:00 AM - 06:00 PM</span>
                                     </div>
                                     <div className="flex justify-between gap-4">
                                         <span>Rabu</span>
                                         <span className="text-slate-400 font-normal">09:00 AM - 06:00 PM</span>
                                     </div>
                                     <div className="flex justify-between gap-4">
                                         <span>Khamis</span>
                                         <span className="text-slate-400 font-normal">09:00 AM - 06:00 PM</span>
                                     </div>
                                     <div className="flex justify-between gap-4">
                                         <span>Jumaat</span>
                                         <span className="text-slate-400 font-normal">09:00 AM - 06:00 PM</span>
                                     </div>
                                     <div className="flex justify-between gap-4 text-rose-500/80">
                                         <span>Sabtu &amp; Ahad</span>
                                         <span className="font-normal">Tutup</span>
                                     </div>
                                 </div>
                             </div>

                             <Link href={route('faq')} className="group flex items-center justify-center sm:justify-start gap-2 text-[15px] font-bold text-white/90 hover:text-white transition-colors duration-300 pt-2 sm:pt-0" /* redirect */>
                                 <svg className="w-4 h-4 text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 Soalan Lazim (FAQ)
                             </Link>
                         </div>
                     </div>

                     {/* Bottom Row: Horizontal Logos */}
                     <div className="pt-8 mt-4 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-8">
                         <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap mb-4 md:mb-0">
                             Rangkaian Koperasi & Rakan Korporat
                         </h4>
                         <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 md:gap-8 brightness-0 invert">
                             <a href="https://www.skm.gov.my/" target="_blank" rel="noreferrer" className="block opacity-60 hover:opacity-100 transition-opacity duration-300" /* redirect */>
                                 <img src="/images/logo-skm.png" alt="SKM Logo" loading="lazy" decoding="async" className="h-8 w-auto object-contain" />
                             </a>
                             <a href="https://www.angkasa.coop/" target="_blank" rel="noreferrer" className="block opacity-60 hover:opacity-100 transition-opacity duration-300" /* redirect */>
                                 <img src="/images/logo-angkasa.png" alt="Angkasa Logo" loading="lazy" decoding="async" className="h-8 w-auto object-contain" />
                             </a>
                             <a href="https://ikma.edu.my/" target="_blank" rel="noreferrer" className="block opacity-60 hover:opacity-100 transition-opacity duration-300" /* redirect */>
                                 <img src="/images/logo-ikma.png" alt="IKMa Logo" loading="lazy" decoding="async" className="h-8 w-auto object-contain" />
                             </a>
                             
                             {/* Subtle Divider between groups */}
                             <div className="hidden md:block w-[1px] h-4 bg-slate-700 mx-1"></div>
                             
                             <a href="https://www.mediaprima.com.my/" target="_blank" rel="noreferrer" className="block opacity-60 hover:opacity-100 transition-opacity duration-300" /* redirect */>
                                 <img src="/images/logo-mediaprima.png" alt="Media Prima" loading="lazy" decoding="async" className="h-6 w-auto object-contain" />
                             </a>
                             <a href="https://www.allianz.com.my/" target="_blank" rel="noreferrer" className="block opacity-60 hover:opacity-100 transition-opacity duration-300" /* redirect */>
                                 <img src="/images/logo-allianz.png" alt="Allianz" loading="lazy" decoding="async" className="h-6 w-auto object-contain" />
                             </a>
                             <a href="https://www.sunlifemalaysia.com/" target="_blank" rel="noreferrer" className="block opacity-60 hover:opacity-100 transition-opacity duration-300" /* redirect */>
                                 <img src="/images/logo-sunlife.png" alt="Sun Life" loading="lazy" decoding="async" className="h-6 w-auto object-contain" />
                             </a>
                             <a href="https://www.malaymail.com/" target="_blank" rel="noreferrer" className="block opacity-60 hover:opacity-100 transition-opacity duration-300" /* redirect */>
                                 <img src="/images/logo-malaymail.png" alt="Malay Mail" loading="lazy" decoding="async" className="h-6 w-auto object-contain" />
                             </a>
                         </div>
                     </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="bg-transparent py-6 border-t border-slate-800">
                        <div className="max-w-[1350px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
                            <p className="text-center md:text-left">© MESF. Hak cipta terpelihara.</p>
                            <button onClick={scrollToTop} className="group flex items-center gap-2 font-normal text-slate-500 hover:text-slate-300 transition-colors">
                                Kembali ke Atas
                                <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </footer>
            )}

            {/* Sidebar Overlay */}
            <div className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[110] shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Absolute Close Button matches exact location of Hamburger */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute z-10 flex items-center text-slate-500 hover:text-black transition-colors"
                    style={{ top: closePos.top, right: closePos.right }}
                >
                    <svg className={`stroke-[1.5] transition-all duration-500 ease-out ${isScrolled ? 'w-6 h-6' : 'w-7 h-7'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="overflow-y-auto h-full w-full p-6 md:p-8 flex flex-col" style={{ paddingTop: closePos.bottom + 20 }}>
                    {/* Sidebar Header */}
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-black">
                        <span className="font-black text-xl tracking-wider uppercase text-slate-900">Menu</span>
                    </div>

                    {/* Sidebar Links */}
                    <div className="flex flex-col gap-2 flex-grow font-medium tracking-wide text-[13px] md:text-sm">
                        <Link href={route('home')} className="block py-3 border-b border-slate-100 transition-colors hover:opacity-50 text-slate-800" onClick={() => setIsSidebarOpen(false)}>Utama</Link>

                        <Link href={route('profil')} className="block py-3 border-b border-slate-100 transition-colors hover:opacity-50 text-slate-800" onClick={() => setIsSidebarOpen(false)}>Profil</Link>

                        <div className="border-b border-slate-100">
                            <Link href={route('dokumen')} className="block w-full py-3 transition-colors hover:opacity-50 text-slate-800" onClick={() => setIsSidebarOpen(false)}>
                                Dokumen
                            </Link>
                        </div>

                        <div className="pt-4 mt-auto">
                            <Link
                                href={route('login')}
                                className="block w-full py-3 px-4 rounded-xl text-center font-bold tracking-wider uppercase text-black bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                Log Masuk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
