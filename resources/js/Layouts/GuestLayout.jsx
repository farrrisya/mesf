// --1. imports--
import { Link, usePage } from '@inertiajs/react';

// --2. main component--
export default function GuestLayout({ children }) {
    // --3. properties--
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const orgName = settings?.orgName || 'Malaysia Esports Federation'; // properties
    const orgAcronym = settings?.orgAcronym || 'MESF'; // properties

    // --4. UI--
    return (
        <div className="flex min-h-screen font-sans bg-[#050811] text-slate-100 selection:bg-red-600 selection:text-white relative overflow-hidden">
            
            {/* background textures & cyber glowing ambient */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_var(--tw-gradient-stops))] from-red-900/20 via-[#050811] to-[#020408]"></div>
                
                {/* cyber tech grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]"></div>
                
                {/* ambient glowing orbs */}
                <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-red-600/15 blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[140px]"></div>
                <div className="absolute top-[40%] left-[25%] w-[400px] h-[400px] rounded-full bg-red-500/5 blur-[120px]"></div>
            </div>

            {/* content wrapper */}
            <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row max-w-[1400px] mx-auto items-center justify-between px-6 sm:px-10 lg:px-12 xl:px-16 py-10 lg:py-12 gap-10 lg:gap-16">
                
                {/* left side: federation branding and portal features */}
                <div className="w-full lg:w-[54%] flex flex-col justify-center">
                    <div className="w-full max-w-[580px]">
                        
                        {/* logo & federation identity */}
                        <div className="mb-6">
                            <Link href="/" className="inline-flex items-center gap-4 group">
                                <div className="relative p-2 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_25px_rgba(239,68,68,0.15)] transition-all duration-300 group-hover:border-red-500/40 group-hover:shadow-[0_0_35px_rgba(239,68,68,0.25)]">
                                    <img 
                                        src={logoUrl} 
                                        alt={`${orgAcronym} Logo`}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = '/images/mesf_logo.png';
                                        }}
                                        className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-red-500 tracking-[0.25em] uppercase font-mono">
                                        Persekutuan Sukan Elektronik Malaysia
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-heading leading-tight">
                                        {orgName}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        
                        {/* eyebrow badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-[11px] font-bold text-red-400 uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Sistem Pengurusan Pusat (CMS)
                        </div>

                        {/* main heading & summary */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight uppercase font-heading leading-tight">
                            Portal Pentadbir Rasmi
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                            Akses kawalan berpusat untuk pengurusan kejohanan sukan elektronik, persatuan negeri, kalendar liga kebangsaan, siaran media dan dokumen rasmi MESF.
                        </p>

                        {/* feature tactical grid */}
                        <div className="space-y-3.5 mb-8">
                            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xs hover:border-red-500/30 transition-colors">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xs uppercase tracking-wide">Pengurusan Kejohanan & Liga Kebangsaan</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Pantau status kejohanan, jadual perlawanan dan rekod sukan elektronik.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xs hover:border-blue-500/30 transition-colors">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xs uppercase tracking-wide">Direktori Persatuan Negeri & Maklumat Rasmi</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Kemas kini profil persatuan negeri, logo, dan senarai kepimpinan.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xs hover:border-emerald-500/30 transition-colors">
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xs uppercase tracking-wide">Pusat Media & Berita Rasmi</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Siarkan artikel berita terkini, aset media, dan liputan kejohanan.</p>
                                </div>
                            </div>
                        </div>

                        {/* back to public link & footer info */}
                        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                            <Link 
                                href="/"
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-all border border-white/10 group"
                            >
                                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                Laman Utama MESF
                            </Link>
                            <span className="text-[11px] text-slate-500 font-mono">
                                &copy; {new Date().getFullYear()} MESF • v2.0
                            </span>
                        </div>
                    </div>
                </div>

                {/* right side: cyber login card */}
                <div className="w-full lg:w-[46%] flex flex-col justify-center items-center lg:items-end">
                    <div className="w-full max-w-[450px]">
                        {children}
                    </div>
                </div>
                
            </div>
        </div>
    );
}
