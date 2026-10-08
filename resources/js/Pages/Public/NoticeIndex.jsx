// --1. imports--
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

// --2. main component--
export default function NoticeIndex({ notices }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleItemsCount, setVisibleItemsCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleItemsCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 400);
  };

  // Smooth scroll handler for anchor links
  const handleSmoothScroll = (e, id) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isRecent = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const otherNotices = notices.slice(2);
  const filteredNotices = otherNotices.filter((notice) =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (notice.content && notice.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  return (
    <PublicLayout>
      <Head title="Berita & Notis" />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a192f] to-[#0a192f] pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-widest drop-shadow-lg">
                  BERITA & NOTIS
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-6">
                  <a 
                      href="#terkini" 
                      onClick={(e) => handleSmoothScroll(e, 'terkini')}
                      className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-200"
                  >
                      Terkini
                  </a>
                  <span className="text-white/20 text-xs hidden sm:block">•</span>
                  <a 
                      href="#lalu" 
                      onClick={(e) => handleSmoothScroll(e, 'lalu')}
                      className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-200"
                  >
                      Lalu
                  </a>
              </div>
          </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-[1350px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-12 md:pb-16">

        
        <div className="space-y-20 md:space-y-32 w-full">
        {notices.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200/65 rounded-sm shadow-sm">
            <svg className="w-16 h-16 text-slate-350 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-700 mb-1">Tiada Notis Ditemui</h3>
            <p className="text-slate-500 text-sm">Sila layari kembali nanti untuk berita dan notis terbaharu.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top Latest Notices (Bento Box / Magazine Layout) */}
            {notices.slice(0, 3).length > 0 && (
              <section id="terkini" className="scroll-mt-28">
                <div className="mb-10 text-center">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide inline-block uppercase">
                        Berita Utama
                    </h2>
                </div>
                
                {/* Bento Grid container */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  {notices.slice(0, 3).map((notice, index) => {
                    // Dynamic classes for Bento layout
                    const isMain = index === 0;
                    const gridClass = isMain 
                      ? "md:col-span-8 md:row-span-2 min-h-[350px] md:min-h-[500px]" 
                      : "md:col-span-4 min-h-[250px] md:min-h-[238px]";
                    
                    return (
                      <Link
                        key={notice.id}
                        href={route('notices.show', notice.id)}
                        className={`group relative overflow-hidden block shadow-sm hover:shadow-xl transition-all duration-300 bg-[#0a192f] ${gridClass}`}
                      >
                        {/* Background Image (Anchored to Top) */}
                        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a192f]">
                          {notice.image_path ? (
                            <img
                              src={`/storage/${notice.image_path}`}
                              alt={notice.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover object-top opacity-85 transition-opacity duration-300 transform scale-[1.15]"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#0a192f] to-[#1a365d] flex items-center justify-center">
                              <span className="text-white/10 font-black text-8xl select-none">K</span>
                            </div>
                          )}
                        </div>

                        {/* Gradient Overlay for Text Readability */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-[#050f1f] via-[#050f1f]/70 to-transparent ${isMain ? 'md:via-[#050f1f]/50' : ''}`}></div>

                        {/* Content */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                          <div className="flex items-center gap-3 mb-3 md:mb-4">
                            {isRecent(notice.published_at || notice.created_at) && (
                              <span className="bg-red-600 text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                TERBAHARU
                              </span>
                            )}
                            <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                              Pengumuman
                            </span>
                          </div>
                          
                          <h3 className={`font-black text-white group-hover:underline decoration-2 underline-offset-4 leading-snug drop-shadow-md line-clamp-3 ${isMain ? 'text-2xl md:text-4xl mb-3' : 'text-lg md:text-xl mb-2'}`}>
                            {notice.title}
                          </h3>
                          
                          {isMain && notice.content && notice.content !== '-' && (
                            <p className="text-slate-300 text-sm md:text-base line-clamp-2 mb-6 max-w-3xl drop-shadow">
                              {notice.content.replace(/<[^>]*>?/gm, '')}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs font-bold text-white/70">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDate(notice.published_at || notice.created_at)}</span>
                            </div>
                            {isMain && (
                              <div className="hidden md:flex items-center gap-1.5 text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <span>Baca Lanjut</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Other Notices */}
            {notices.slice(2).length > 0 && (
              <section id="lalu" className="scroll-mt-28">
                <div className="mb-10 flex flex-col items-center justify-center gap-6">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase text-center">
                        Lalu
                    </h2>
                    
                    {/* Minimalist Search Bar */}
                    <div className="w-full md:w-96 relative mx-auto">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Cari..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setVisibleItemsCount(6);
                        }}
                        className="w-full pl-8 pr-2 py-2 border-0 border-b-2 border-slate-200 bg-transparent text-sm focus:ring-0 focus:border-[#0a192f] transition-colors placeholder:text-slate-400 focus:placeholder-transparent outline-none shadow-none text-center"
                      />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNotices.slice(0, visibleItemsCount).map((notice) => (
                    <Link
                      key={notice.id}
                      href={route('notices.show', notice.id)}
                      className="group flex flex-row gap-4 sm:gap-5 items-stretch bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300" /* redirect */
                    >
                      {/* Left side: Image */}
                      <div className="w-28 sm:w-36 md:w-40 shrink-0 relative aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                        {notice.image_path ? (
                          <img
                            src={`/storage/${notice.image_path}`}
                            alt={notice.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#0a192f] to-[#1a365d] flex items-center justify-center">
                            <span className="text-white/20 font-black text-3xl select-none">K</span>
                          </div>
                        )}
                      </div>

                      {/* Right side: Content */}
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                            <span>Pengumuman</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0a192f] group-hover:underline decoration-2 underline-offset-2 leading-snug mb-1.5 line-clamp-2 transition-all">
                            {notice.title}
                          </h3>
                          {notice.content && notice.content !== '-' && (
                            <p className="text-slate-500 text-[12px] sm:text-[13px] leading-relaxed line-clamp-2">
                              {notice.content.replace(/<[^>]*>?/gm, '')}
                            </p>
                          )}
                        </div>
                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-[11px] font-semibold w-fit border border-slate-200/60">
                          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(notice.published_at || notice.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredNotices.length === 0 && (
                  <div className="text-center py-12 text-slate-500 font-medium bg-white rounded border border-slate-200 mt-6">
                    Tiada padanan ditemui untuk carian anda.
                  </div>
                )}

                {visibleItemsCount < filteredNotices.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-[#0a192f] hover:border-slate-300 hover:bg-slate-50 shadow-sm px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all w-full md:w-auto min-w-[200px]"
                    >
                      {isLoadingMore ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Memuatkan...</span>
                        </>
                      ) : (
                        <>
                          <span>Muat Turun Lagi</span>
                          <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
        </div>
      </main>
    </PublicLayout>
  );
}
