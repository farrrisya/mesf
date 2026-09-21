// --1. imports--
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef } from 'react';

// --2. main component--
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

import Lightbox from '@/Components/Lightbox';

// --3. helpers--
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

export default function AlbumShow({ auth, album, otherAlbums = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  
  // Array of all items (images and videos) for the lightbox
  const lightboxImages = album.galleries ? album.galleries : [];

  return (
    <PublicLayout auth={auth} hideNavbar={true} hideFooter={true}>
      <Head title={`${album.title} - Galeri Aktiviti`} />

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
                          Album
                      </span>
                      {album.created_at && (
                          <span className="text-slate-500 text-xs md:text-sm font-semibold tracking-wider uppercase">
                              {new Date(album.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                      )}
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
                      {album.title}
                  </h1>

                  {album.description && (
                      <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap max-w-xl">
                          {album.description}
                      </p>
                  )}
              </div>
          </div>

          {/* Right Panel (Scrolling Photos, White Background) */}
          <div className="w-full lg:w-[55%] bg-white flex justify-start relative z-0">
              <div className="w-full max-w-[900px] px-6 sm:px-12 lg:px-20 pt-10 md:pt-14 pb-24 flex flex-col gap-14 lg:gap-20">
                  
                  {album.galleries && album.galleries.length > 0 ? (
                      album.galleries.map((item) => (
                          <RevealOnScroll key={item.id}>
                              <figure 
                                  className="w-full group cursor-pointer flex flex-col"
                                  onClick={() => {
                                      router.visit(route('galeri.show', item.id));
                                  }}
                              >
                                  {/* Photo Frame / Border */}
                                  <div className="w-full bg-white p-2 sm:p-3 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100 rounded-sm relative group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                                      <div className="relative w-full aspect-[4/3] md:aspect-video bg-slate-100 overflow-hidden rounded-sm">
                                          {item.type === 'video' ? (
                                              <>
                                                  {getYoutubeThumbnail(item.video_url) ? (
                                                      <img
                                                        src={getYoutubeThumbnail(item.video_url)}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover"
                                                      />
                                                  ) : (
                                                      <div className="w-full h-full flex items-center justify-center">
                                                          <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                          </svg>
                                                      </div>
                                                  )}
                                                  {/* Simple Video Hover Overlay */}
                                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
                                                      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-600/90 text-white shadow-lg transform scale-95 group-hover:scale-100 transition-all duration-300">
                                                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                      </div>
                                                  </div>
                                              </>
                                          ) : (
                                              <>
                                                  <img
                                                      src={`/storage/${item.image_path}`}
                                                      alt={item.title}
                                                      loading="lazy"
                                                      decoding="async"
                                                      className="w-full h-full object-cover"
                                                  />
                                                  {/* Simple Image Hover Overlay */}
                                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                                                      <div className="bg-black/70 text-white p-3 rounded-full backdrop-blur-sm shadow-md transform scale-95 group-hover:scale-100 transition-transform duration-300">
                                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                                      </div>
                                                  </div>
                                              </>
                                          )}
                                      </div>
                                  </div>
                                  
                                  {/* Only show photo description if it exists and isn't identical to the album title */}
                                  {(item.title || item.description) && (item.title !== album.title) && (
                                      <figcaption className="mt-6 flex flex-col items-start px-2">
                                          {item.title && <h4 className="font-bold text-slate-800 text-lg leading-snug">{item.title}</h4>}
                                          {item.description && <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">{item.description}</p>}
                                      </figcaption>
                                  )}
                              </figure>
                          </RevealOnScroll>
                      ))
                  ) : (
                      <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                          <p className="font-medium text-lg">Tiada gambar atau video telah dimuat naik ke dalam album ini lagi.</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Lightbox */}
          {lightboxIndex !== null && (
              <Lightbox 
                  images={lightboxImages} 
                  initialIndex={lightboxIndex} 
                  onClose={() => setLightboxIndex(null)} 
              />
          )}
      </main>
      
      {/* More Albums Section */}
      {otherAlbums && otherAlbums.length > 0 && (
          <section className="bg-white py-20 lg:py-28 border-t border-slate-200 z-20 relative">
              <div className="max-w-[1350px] mx-auto px-4 sm:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                      <div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Album Lain</h2>
                          <p className="text-slate-500 text-[15px]">Terokai aktiviti dan program yang lain</p>
                      </div>
                      <Link href={route('galeri')} className="text-[#0a192f] font-bold hover:text-red-600 transition-colors flex items-center gap-1.5 text-sm uppercase tracking-wide">
                          Lihat Semua Galeri <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {otherAlbums.map((otherAlbum) => (
                          <Link key={otherAlbum.id} href={route('galeri.album', otherAlbum.id)} className="group block">
                              <div className="w-full aspect-[4/3] bg-slate-100 mb-5 overflow-hidden rounded-sm relative border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-500">
                                  {otherAlbum.latest_gallery && (otherAlbum.latest_gallery.image_path || otherAlbum.latest_gallery.video_url) ? (
                                      <img 
                                          src={otherAlbum.latest_gallery.type === 'video' ? getYoutubeThumbnail(otherAlbum.latest_gallery.video_url) : `/storage/${otherAlbum.latest_gallery.image_path}`} 
                                          alt={otherAlbum.title} 
                                          loading="lazy"
                                          decoding="async"
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                      />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                          <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                      </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                              </div>
                              <h3 className="font-bold text-slate-900 text-[17px] group-hover:text-red-600 transition-colors leading-snug line-clamp-2">{otherAlbum.title}</h3>
                              <span className="text-slate-500 font-medium text-[13px] mt-1.5 block">{new Date(otherAlbum.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </Link>
                      ))}
                  </div>
              </div>
          </section>
      )}

    </PublicLayout>
  );
}
