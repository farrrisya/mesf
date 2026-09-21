import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef } from 'react';

const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  let videoId = null;
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

const RevealOnScroll = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: "50px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out transform w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
            {children}
        </div>
    );
};

export default function GalleryShow({ auth, galleryItem, otherGalleries = [] }) {
  return (
    <PublicLayout auth={auth} hideNavbar={true} hideFooter={true}>
      <Head title={`${galleryItem.title} - Galeri`} />

      <main className="min-h-screen text-slate-900 font-sans flex flex-col lg:flex-row">
          
          {/* Left Panel (Sticky on Desktop, Soft Brand Background) */}
          <div className="w-full lg:w-[45%] bg-[#f4f5f7] flex justify-end relative z-10 border-r border-slate-200/60">
              {/* Inner container for max-width alignment */}
              <div className="w-full max-w-[700px] px-6 sm:px-12 lg:px-16 pt-10 md:pt-14 pb-16 lg:pb-24 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto hide-scrollbar flex flex-col items-start">
                  
                  {/* Back Button */}
                  <button
                    onClick={(e) => { e.preventDefault(); window.history.back(); }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 lg:mb-10"
                  >
                    <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                  </button>

                  <div className="flex items-center gap-3 mb-5">
                      <span className="text-red-600 font-extrabold uppercase tracking-widest text-[10px] md:text-xs border-b-2 border-red-600 pb-0.5">
                          {galleryItem.type === 'video' ? 'Video' : 'Gambar'}
                      </span>
                      {galleryItem.created_at && (
                          <span className="text-slate-500 text-xs md:text-sm font-semibold tracking-wider uppercase">
                              {new Date(galleryItem.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                      )}
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
                      {galleryItem.title}
                  </h1>

                  {galleryItem.description && (
                      <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap max-w-xl">
                          {galleryItem.description}
                      </p>
                  )}
              </div>
          </div>

          {/* Right Panel (Single Photo/Video, White Background) */}
          <div className="w-full lg:w-[55%] bg-white flex justify-start relative z-0 min-h-screen">
              <div className="w-full max-w-[900px] px-6 sm:px-12 lg:px-20 pt-10 md:pt-14 pb-24 flex flex-col justify-center">
                  <RevealOnScroll>
                      <figure className="w-full flex flex-col">
                          {/* Photo Frame / Border */}
                          <div className="w-full bg-white p-2 sm:p-3 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100 rounded-sm relative group hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                              <div className="relative w-full aspect-[4/3] md:aspect-video bg-slate-100 overflow-hidden rounded-sm">
                                  {galleryItem.type === 'video' ? (
                                      <>
                                        <iframe 
                                            className="w-full h-full absolute inset-0 z-10"
                                            src={`https://www.youtube.com/embed/${getYoutubeThumbnail(galleryItem.video_url)?.split('/vi/')[1]?.split('/')[0]}?autoplay=0`}
                                            title={galleryItem.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                      </>
                                  ) : (
                                      <img
                                          src={`/storage/${galleryItem.image_path}`}
                                          alt={galleryItem.title}
                                          loading="lazy"
                                          decoding="async"
                                          className="w-full h-full object-contain"
                                      />
                                  )}
                              </div>
                          </div>
                      </figure>
                  </RevealOnScroll>
              </div>
          </div>
      </main>
      
      {/* More Galleries Section */}
      {otherGalleries && otherGalleries.length > 0 && (
          <section className="bg-white py-20 lg:py-28 border-t border-slate-200 z-20 relative">
              <div className="max-w-[1350px] mx-auto px-4 sm:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                      <div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Galeri Lain</h2>
                          <p className="text-slate-500 text-[15px]">Terokai aktiviti dan program yang lain</p>
                      </div>
                      <Link href={route('galeri')} className="text-[#0a192f] font-bold hover:text-red-600 transition-colors flex items-center gap-1.5 text-sm uppercase tracking-wide">
                          Lihat Semua Galeri <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {otherGalleries.map((item) => (
                          <Link key={item.id} href={route('galeri.show', item.id)} className="group block">
                              <div className="w-full aspect-[4/3] bg-slate-100 mb-5 overflow-hidden rounded-sm relative border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-500">
                                  {item.type === 'video' ? (
                                      <>
                                        <img 
                                            src={getYoutubeThumbnail(item.video_url)} 
                                            alt={item.title} 
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-10 h-10 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-600 transition-colors">
                                                <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                        </div>
                                      </>
                                  ) : (
                                      <img 
                                          src={`/storage/${item.image_path}`} 
                                          alt={item.title} 
                                          loading="lazy"
                                          decoding="async"
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                      />
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                              </div>
                              <h3 className="font-bold text-slate-900 text-[17px] group-hover:text-red-600 transition-colors leading-snug line-clamp-2">{item.title}</h3>
                              <span className="text-slate-500 font-medium text-[13px] mt-1.5 block">{new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </Link>
                      ))}
                  </div>
              </div>
          </section>
      )}

    </PublicLayout>
  );
}
