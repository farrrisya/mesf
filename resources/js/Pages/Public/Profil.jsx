// --1. imports--
import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

// --2. main component--
export default function Profil({ auth, settings }) {
    const defaultTab = settings?.company_struktur_organisasi ? 'organisasi' 
                     : settings?.company_jawatankuasa_kecil ? 'jawatankuasa-kecil'
                     : settings?.company_anggota_lembaga ? 'anggota-lembaga'
                     : settings?.company_jawatankuasa_audit ? 'audit-dalaman'
                     : 'organisasi';
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Smooth scroll handler for anchor links
    const handleSmoothScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, '', `#${id}`);
        }
    };

    // Smooth scroll to section if hash is present
    useEffect(() => {
        const handleHash = () => {
            if (window.location.hash) {
                const id = window.location.hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    // Add a small delay to ensure images/layout are rendered
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        };

        handleHash();

        // Listen for hash changes if clicking dropdown while already on page
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    return (
        <PublicLayout auth={auth}>
            <Head title="Profil - MESF" />

            {/* Header section */}
            <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a192f] to-[#0a192f] pointer-events-none"></div>
                
                <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-widest drop-shadow-lg">
                        PROFIL
                    </h1>
                    
                    {/* Horizontal Menu */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-6">
                        <a 
                            href="#tentang-kami" 
                            onClick={(e) => handleSmoothScroll(e, 'tentang-kami')}
                            className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-red-400 transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300"
                        >
                            Tentang Kami
                        </a>
                        <span className="text-white/20 text-xs hidden sm:block">•</span>
                        <a 
                            href="#visi-misi" 
                            onClick={(e) => handleSmoothScroll(e, 'visi-misi')}
                            className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-red-400 transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300"
                        >
                            Visi, Misi & Motto
                        </a>
                        <span className="text-white/20 text-xs hidden sm:block">•</span>
                        <a 
                            href="#struktur-organisasi" 
                            onClick={(e) => handleSmoothScroll(e, 'struktur-organisasi')}
                            className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-red-400 transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-red-600 hover:after:w-full after:transition-all after:duration-300"
                        >
                            Organisasi & Jawatankuasa
                        </a>
                    </div>
                </div>
            </div>

            <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-12 md:pb-16 space-y-16 md:space-y-20">

                {/* TENTANG KAMI */}
                <section id="tentang-kami" className="scroll-mt-28">
                    <div className="mb-10 text-center">
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide inline-block">
                            Tentang Kami
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Pengenalan Section */}
                        <div className="bg-white p-8 rounded-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition duration-500" />
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-11 h-11 rounded bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/50">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-wide">Pengenalan</h2>
                            </div>

                            <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium relative z-10 whitespace-pre-wrap">
                                {settings?.about_intro ? (
                                    settings.about_intro
                                ) : (
                                    "Maklumat pengenalan belum dikemaskini."
                                )}
                            </div>

                            {settings?.about_brochure && (
                                <div className="mt-6 relative z-10">
                                    <a
                                        href={settings.about_brochure.startsWith('http') ? settings.about_brochure : (settings.about_brochure.startsWith('storage/') ? '/' + settings.about_brochure : '/storage/' + settings.about_brochure)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11.5px] text-[#0a192f] mt-1.5 block font-semibold leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-between group/brochure"
                                    >
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Lihat Brosur Disini
                                        </span>
                                        <svg className="w-4 h-4 opacity-50 group-hover/brochure:opacity-100 group-hover/brochure:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Maklumat Syarikat Section */}
                        <div className="bg-[#0a192f] text-white p-8 rounded-md border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition duration-500" />

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-11 h-11 rounded bg-white/5 text-amber-400 flex items-center justify-center border border-white/10">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-black text-white tracking-wide">Maklumat Syarikat</h2>
                            </div>

                            <div className="space-y-1 text-sm relative z-10">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-3.5 border-b border-white/10">
                                    <span className="text-slate-400 font-bold text-[10px] tracking-wider flex items-center">No Pendaftaran</span>
                                    <span className="col-span-2 font-semibold">{settings?.company_no_pendaftaran || '-'}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-3.5 border-b border-white/10">
                                    <span className="text-slate-400 font-bold text-[10px] tracking-wider flex items-center">Aktiviti</span>
                                    <span className="col-span-2 font-semibold">{settings?.company_aktiviti || '-'}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-3.5 border-b border-white/10">
                                    <span className="text-slate-400 font-bold text-[10px] tracking-wider flex items-center">Tarikh Penubuhan</span>
                                    <span className="col-span-2 font-semibold">{settings?.company_tarikh_penubuhan || '-'}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-3.5">
                                    <span className="text-slate-400 font-bold text-[10px] tracking-wider pt-0.5">Maklumat Bank</span>
                                    <span className="col-span-2 font-semibold">
                                        {settings?.company_maklumat_bank || '-'}
                                        {settings?.company_alamat_bank && (
                                            <span className="text-[11.5px] text-slate-300 mt-1.5 block font-medium leading-relaxed bg-white/5 p-3 rounded-md border border-white/5 whitespace-pre-wrap">
                                                {settings.company_alamat_bank}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="my-16"></div>

                {/* VISI, MISI, MOTTO */}
                <section id="visi-misi" className="scroll-mt-28">
                    <div className="mb-10 text-center">
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide inline-block">
                            Visi, Misi & Motto
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Visi */}
                        <div className="bg-slate-50 p-8 rounded-sm border border-slate-200 border-t-4 border-t-amber-500 shadow-sm relative">
                            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 text-slate-700 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 tracking-widest uppercase">Visi</h3>
                            </div>
                            <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {settings?.company_visi || 'Maklumat visi belum dikemaskini.'}
                            </div>
                        </div>

                        {/* Misi */}
                        <div className="bg-slate-50 p-8 rounded-sm border border-slate-200 border-t-4 border-t-slate-800 shadow-sm relative">
                            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 text-slate-700 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 tracking-widest uppercase">Misi</h3>
                            </div>
                            <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {settings?.company_misi || 'Maklumat misi belum dikemaskini.'}
                            </div>
                        </div>

                        {/* Motto */}
                        <div className="bg-slate-50 p-8 rounded-sm border border-slate-200 border-t-4 border-t-red-600 shadow-sm relative">
                            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-full bg-slate-200/60 text-slate-700 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 tracking-widest uppercase">Motto</h3>
                            </div>
                            <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {settings?.company_motto || 'Maklumat motto belum dikemaskini.'}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="my-16"></div>

                {/* ORGANISASI & JAWATANKUASA TABS */}
                <section id="struktur-organisasi" className="scroll-mt-28">
                    <div className="mb-10 text-center">
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide inline-block">
                            Organisasi & Jawatankuasa
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                        {/* Tabs Header */}
                        <div className="p-3 bg-slate-50 border-b border-slate-200/80">
                            <div className="flex flex-wrap md:flex-nowrap gap-1.5 bg-slate-200/70 p-1.5 rounded-xl">
                                {[
                                    { id: 'organisasi', label: 'Carta Organisasi', img: settings?.company_struktur_organisasi },
                                    { id: 'jawatankuasa-kecil', label: 'Jawatankuasa Kecil', img: settings?.company_jawatankuasa_kecil },
                                    { id: 'anggota-lembaga', label: 'Anggota Lembaga', img: settings?.company_anggota_lembaga },
                                    { id: 'audit-dalaman', label: 'Audit Dalaman', img: settings?.company_jawatankuasa_audit },
                                ].map((tab) => tab.img && (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)} // trigger
                                        className={`flex-1 py-3 px-4 text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? 'bg-white text-[#0a192f] shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tabs Content */}
                        <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
                            {[
                                { id: 'organisasi', title: 'Carta Organisasi', img: settings?.company_struktur_organisasi },
                                { id: 'jawatankuasa-kecil', title: 'Jawatankuasa Kecil 2025', img: settings?.company_jawatankuasa_kecil },
                                { id: 'anggota-lembaga', title: 'Anggota Lembaga Koperasi NSTP', img: settings?.company_anggota_lembaga },
                                { id: 'audit-dalaman', title: 'Ahli Jawatankuasa Audit Dalaman (JKAD)', img: settings?.company_jawatankuasa_audit },
                            ].map((tab) => tab.img && activeTab === tab.id && (
                                <div key={tab.id} className="animate-in fade-in duration-500">
                                    <div className="relative mx-auto max-w-4xl">
                                        <a 
                                            href={tab.img.startsWith('http') ? tab.img : (tab.img.startsWith('storage/') ? '/' + tab.img : '/storage/' + tab.img)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block overflow-hidden rounded-md border border-slate-100 shadow-sm bg-slate-50/50 cursor-zoom-in"
                                            title="Klik untuk lihat gambar penuh"
                                        >
                                            <img
                                                src={tab.img.startsWith('http') ? tab.img : (tab.img.startsWith('storage/') ? '/' + tab.img : '/storage/' + tab.img)}
                                                alt={tab.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-auto object-contain"
                                            />
                                        </a>
                                    </div>
                                </div>
                            ))}
                            
                            {!settings?.company_struktur_organisasi && !settings?.company_jawatankuasa_kecil && !settings?.company_anggota_lembaga && !settings?.company_jawatankuasa_audit && (
                                <div className="text-center text-slate-500 font-serif py-12">
                                    Maklumat organisasi belum dikemaskini.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

            </main>
        </PublicLayout>
    );
}
