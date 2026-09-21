// --1. imports--
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

// --2. main component--
export default function Penerbitan({ auth, buletinKopmedia, buletinKontemporari, laporanTahunan }) {
    
    // Smooth scroll handler for anchor links
    const handleSmoothScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Poster Grid Component (For Buletins)
    const PosterGrid = ({ items }) => {
        const getPosterUrl = (item) => {
            if (item.image_path) {
                if (item.image_path.startsWith('/storage/') || item.image_path.startsWith('http')) {
                    return item.image_path;
                }
                return `/storage/${item.image_path}`;
            }
            if (item.media_type === 'file' && item.file_path && item.file_path.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                if (item.file_path.startsWith('/storage/')) return item.file_path;
                return `/storage/${item.file_path}`;
            }
            if (item.media_type === 'url' && item.url_link && item.url_link.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                return item.url_link;
            }
            return null;
        };

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
                {items.map((item) => {
                    const posterUrl = getPosterUrl(item);
                    return (
                        <a
                            key={item.id}
                            href={item.media_type === 'url' ? item.url_link : `/storage/${item.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block aspect-[1/1.414] bg-slate-100 rounded-md overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200"
                        >
                            {/* Image or Placeholder */}
                            {posterUrl ? (
                                <img 
                                    src={posterUrl} 
                                    alt={item.title} 
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out" 
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-50 to-slate-200 transition-transform duration-700 ease-out">
                                    <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-3">Tiada Poster Disediakan</span>
                                </div>
                            )}
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#0a192f]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                <div className="bg-white text-[#0a192f] text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-1.5">
                                    <span>Baca</span>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        );
    };

    // Document Grid Component
    const DocumentGrid = ({ items }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {items.map((item) => (
                <a
                    key={item.id}
                    href={item.media_type === 'url' ? item.url_link : `/storage/${item.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-slate-200 rounded-sm p-6 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 h-full relative overflow-hidden"
                >
                    {/* Decorative Top Accent */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-100 group-hover:bg-[#0a192f] transition-colors duration-300"></div>
                    
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            {/* File Icon */}
                            <svg className="w-7 h-7 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <h3 className="text-[15px] font-bold text-slate-900 group-hover:underline decoration-2 underline-offset-2 leading-snug">
                            {item.title}
                        </h3>
                    </div>

                    {/* Action Pill */}
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#0a192f] transition-colors mt-4">
                        <span>{item.media_type === 'url' ? 'Buka Pautan' : 'Muat Turun'}</span>
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </a>
            ))}
        </div>
    );

    return (
        <PublicLayout auth={auth}>
            <Head title="Penerbitan - Kopmedia" />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
                {/* Background Image with Low Opacity */}
                <div 
                    className="absolute inset-0 z-0 opacity-40" 
                    style={{
                        backgroundImage: "url('/images/penerbitan-bg.png')",
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                ></div>
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                
                <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 md:mb-8 text-white leading-tight uppercase tracking-widest drop-shadow-lg">
                        PENERBITAN
                    </h1>
                    
                    {/* Horizontal Menu */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-2">
                        <a 
                            href="#buletin-kopmedia" 
                            onClick={(e) => handleSmoothScroll(e, 'buletin-kopmedia')}
                            className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                        >
                            Buletin Kopmedia
                        </a>
                        <span className="text-white/20 text-xs hidden sm:block">•</span>
                        <a 
                            href="#buletin-kontemporari" 
                            onClick={(e) => handleSmoothScroll(e, 'buletin-kontemporari')}
                            className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                        >
                            Buletin Kontemporari
                        </a>
                        <span className="text-white/20 text-xs hidden sm:block">•</span>
                        <a 
                            href="#laporan-tahunan" 
                            onClick={(e) => handleSmoothScroll(e, 'laporan-tahunan')}
                            className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                        >
                            Laporan Tahunan
                        </a>
                    </div>
                </div>
            </div>

            <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-16 md:pb-20 space-y-16 md:space-y-24">
                
                {/* No Intro Text */}

                {/* Buletin Kopmedia Section */}
                <section id="buletin-kopmedia" className="scroll-mt-28">
                    <div className="mb-10 flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase">
                            Buletin Kopmedia
                        </h2>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    
                    {buletinKopmedia && buletinKopmedia.length > 0 ? (
                        <PosterGrid items={buletinKopmedia} />
                    ) : (
                        <div className="py-12 text-center text-slate-500 font-medium bg-slate-50 rounded border border-slate-100 max-w-4xl mx-auto text-sm">
                            Tiada buletin direkodkan.
                        </div>
                    )}
                </section>

                {/* Buletin Kontemporari Section */}
                <section id="buletin-kontemporari" className="scroll-mt-28">
                    <div className="mb-10 flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase">
                            Buletin Kontemporari
                        </h2>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    
                    {buletinKontemporari && buletinKontemporari.length > 0 ? (
                        <PosterGrid items={buletinKontemporari} />
                    ) : (
                        <div className="py-12 text-center text-slate-500 font-medium bg-slate-50 rounded border border-slate-100 max-w-4xl mx-auto text-sm">
                            Tiada buletin direkodkan.
                        </div>
                    )}
                </section>

                {/* Laporan Tahunan Section */}
                <section id="laporan-tahunan" className="scroll-mt-28">
                    <div className="mb-10 flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase">
                            Laporan Tahunan
                        </h2>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    
                    {laporanTahunan && laporanTahunan.length > 0 ? (
                        <DocumentGrid items={laporanTahunan} />
                    ) : (
                        <div className="py-12 text-center text-slate-500 font-medium bg-slate-50 rounded border border-slate-100 max-w-4xl mx-auto text-sm">
                            Tiada laporan direkodkan.
                        </div>
                    )}
                </section>

            </main>
        </PublicLayout>
    );
}
