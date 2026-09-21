import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import 'react-quill/dist/quill.snow.css';

export default function ProdukShow({ auth, product }) {
  let filePath = "#";
  if (product.media_type === 'file' || product.media_type === 'media') {
    const baseUrl = route('home').replace(/\/$/, '');
    filePath = product.file_path ? `${baseUrl}/storage/${product.file_path}` : "#";
  } else if (product.media_type === 'url') {
    filePath = product.url_link || "#";
  }

  const hasMedia = filePath !== "#";
  const hasDescription = product.description && product.description.trim() !== '' && product.description !== '<p><br></p>';
  const hasDescription2 = product.description2 && product.description2.trim() !== '' && product.description2 !== '<p><br></p>';

  const getValidUrl = (url) => {
    if (!url || url === '#') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const getLogo = (category) => {
    switch(category) {
      case "AR-RAHNU X'CHANGE":
      case "Ar-Rahnu":
        return "/images/bg-arrahnu.png";
      case "COOP MART":
      case "Coop Mart":
        return "/images/bg-coopmart.jpg";
      case "KNSTP SMART SOLUTIONS":
      case "KNSTP":
        return "/images/bg-knstp.jpg";
      default:
        return null;
    }
  };

  const logoSrc = getLogo(product.category);

  const formatDescription = (html) => {
    if (!html) return '';
    let formatted = html.replace(/href="([^"]+)"/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('/') || url.startsWith('#')) return match;
      return `href="https://${url}"`;
    });
    return formatted.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  };

  return (
    <PublicLayout auth={auth}>
      <Head title={`${product.title || product.category} - Kopmedia`} />
      
      {/* Background Container */}
      <div className="bg-[#f4f7fb] min-h-screen pb-24 font-sans">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[300px] flex items-end pt-20 pb-0">
            {/* Background patterns / Logo */}
            {logoSrc ? (
                <>
                    <div className="absolute inset-0 z-0">
                        <img src={logoSrc} alt={product.category} className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent"></div>
                    </div>
                </>
            ) : (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a192f] to-[#0a192f] pointer-events-none z-0"></div>
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/pattern.svg')] opacity-[0.03] pointer-events-none z-0"></div>
                </>
            )}
            
            <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 pt-16 pb-6 md:pt-28 md:pb-8">
                
                {/* Breadcrumbs / Back button */}
                <div className="mb-4">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white hover:-translate-x-1 transition-all duration-300 shadow-sm"
                  >
                    <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                  </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                        {!logoSrc && (
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs uppercase font-bold tracking-widest rounded-full border border-white/20 shadow-sm">
                                    {product.category}
                                </span>
                                {product.category === 'SKIM PEMBIAYAAN' && product.sub_category && (
                                    <span className="px-4 py-1.5 bg-amber-500/20 backdrop-blur-sm text-amber-300 text-xs uppercase font-bold tracking-widest rounded-full border border-amber-500/30 shadow-sm">
                                    {product.sub_category}
                                    </span>
                                )}
                            </div>
                        )}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-lg max-w-4xl">
                            {product.title || product.category}
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Layout */}
        <main className="relative z-20 max-w-[1350px] mx-auto px-4 md:px-8 pt-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Column - Content */}
                <div className="flex-1 w-full flex flex-col gap-8">
                    
                    {(hasDescription || hasDescription2) ? (
                        <>
                            {hasDescription && (
                                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
                                    <div className="ql-snow">
                                        <div 
                                        className="ql-editor !p-0 text-slate-700 font-medium 
                                                    [&_h2]:font-black [&_h2]:text-[#0a192f] [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                                                    [&_h3]:font-bold [&_h3]:text-[#0a192f] [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                                                    [&_a]:text-blue-600 hover:[&_a]:text-blue-800 [&_a]:underline
                                                    [&_img]:rounded-xl [&_img]:shadow-md"
                                        dangerouslySetInnerHTML={{ __html: formatDescription(product.description) }}
                                        />
                                    </div>
                                </div>
                            )}

                            {hasDescription2 && (
                                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 overflow-hidden relative">
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-tr-full pointer-events-none"></div>
                                    <div className="ql-snow">
                                        <div 
                                        className="ql-editor !p-0 text-slate-700 font-medium 
                                                    [&_h2]:font-black [&_h2]:text-[#0a192f] [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                                                    [&_h3]:font-bold [&_h3]:text-[#0a192f] [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                                                    [&_a]:text-blue-600 hover:[&_a]:text-blue-800 [&_a]:underline
                                                    [&_img]:rounded-xl [&_img]:shadow-md"
                                        dangerouslySetInnerHTML={{ __html: formatDescription(product.description2) }}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : hasMedia ? (
                        <div className="bg-[#0a192f] rounded-2xl shadow-xl p-10 md:p-16 relative overflow-hidden group flex flex-col items-center justify-center gap-6 border border-blue-900/50 text-center min-h-[350px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-bl-full transition-transform duration-700 group-hover:scale-110 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-tr-full transition-transform duration-700 group-hover:scale-110 pointer-events-none"></div>
                            
                            <div className="w-20 h-20 bg-white/10 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative z-10 mb-2">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {product.media_type === 'url' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    )}
                                </svg>
                            </div>
                            
                            <div className="relative z-10">
                                <h3 className="font-black text-white text-2xl md:text-3xl leading-tight mb-3">Lampiran Tersedia</h3>
                                <p className="text-sm md:text-base text-slate-300 max-w-md mx-auto">Sila klik butang di bawah untuk muat turun atau lihat lampiran dokumen yang disediakan.</p>
                            </div>

                            <a
                                href={product.media_type === 'url' ? getValidUrl(filePath) : filePath}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 mt-4 bg-amber-500 hover:bg-amber-400 text-[#0a192f] rounded-xl text-sm font-black uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-300 relative z-10"
                            >
                                {product.media_type === 'url' ? 'Buka Pautan' : 'Muat Turun Dokumen'}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 overflow-hidden relative flex flex-col items-center justify-center py-20 text-center min-h-[350px]">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Tiada Maklumat Lanjut</h3>
                            <p className="text-slate-500 max-w-sm">
                                Maklumat mengenai perkhidmatan ini sedang dikemas kini.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Actions / Info Sidebar */}
                <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                    {hasMedia && (hasDescription || hasDescription2) && (
                        <div className="bg-[#0a192f] rounded-2xl shadow-lg p-6 relative overflow-hidden group flex flex-col items-start gap-5 border border-blue-900/50">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
                            
                            <div className="flex items-center gap-4 relative z-10 w-full">
                                <div className="w-12 h-12 bg-white/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {product.media_type === 'url' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        )}
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-base leading-tight mb-1">Lampiran Tersedia</h3>
                                    <p className="text-[11px] text-slate-400 leading-snug">Klik untuk muat turun atau lihat lampiran</p>
                                </div>
                            </div>

                            <a
                                href={product.media_type === 'url' ? getValidUrl(filePath) : filePath}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a192f] rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all duration-300 relative z-10"
                            >
                                {product.media_type === 'url' ? 'Buka Pautan' : 'Muat Turun'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    )}

                    {/* Contact Help Card (Always displayed) */}
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150 pointer-events-none"></div>
                        
                        <h3 className="font-bold text-[#0a192f] text-lg mb-2 flex items-center gap-2 relative z-10">
                            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Perlukan Bantuan?
                        </h3>
                        <p className="text-sm text-slate-500 mb-5 leading-relaxed relative z-10">
                            Jika anda mempunyai sebarang persoalan, pasukan sokongan kami sedia membantu anda.
                        </p>
                        
                        <Link
                            href={route('hubungi-kami')}
                            className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-500 text-slate-700 hover:text-amber-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 relative z-10"
                        >
                            Hubungi Kami
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </PublicLayout>
  );
}
