// --1. imports--
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';
import Lightbox from '@/Components/Lightbox';

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

export default function Galeri({ auth, galleries = [], albums = [] }) {
    const allItems = [ // state
        ...(albums || []).map(a => ({ ...a, item_type: 'album', type: 'image' })),
        ...(galleries || []).map(g => ({ ...g, item_type: 'gallery' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const gambarItems = allItems.filter(item => item.type === 'image');
    const videoItems = allItems.filter(item => item.type === 'video');

    // Lightbox state
    const [activeLightboxItems, setActiveLightboxItems] = useState(null);

    // Smooth scroll to section if hash is present
    useEffect(() => {
        const handleHash = () => {
            if (window.location.hash) {
                const id = window.location.hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        };

        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    const renderItem = (item) => {
        if (item.item_type === 'album') {
            return (
                <Link
                    key={`album-${item.id}`}
                    href={route('galeri.album', item.id)}
                    className="bg-white rounded-md border border-slate-100 shadow-xs overflow-hidden cursor-pointer flex flex-col h-full hover:shadow-md transition-shadow"
                >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50 relative flex items-center justify-center border-b border-slate-100">
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-sm flex items-center gap-1.5 z-10">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Album
                        </div>
                        {!item.latest_gallery ? (
                            <div className="text-slate-400 flex flex-col items-center">
                                <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        ) : (
                            <img src={`/storage/${item.latest_gallery.image_path}`} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500" />
                        )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1">{item.title}</h4>
                        <p className="text-xs md:text-sm text-slate-500 mt-2.5 leading-relaxed font-semibold line-clamp-2">{item.description}</p>
                        <div className="mt-3 text-[10px] text-slate-400 font-medium">
                            {item.created_at ? new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() : '-'}
                        </div>
                    </div>
                </Link>
            );
        }

        if (item.type === 'video') {
            return (
                <div
                    key={`gallery-${item.id}`}
                    className="bg-white rounded-md border border-slate-100 shadow-xs overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                        router.visit(route('galeri.show', item.id));
                    }}
                >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                        <div className="w-full h-full relative transition-transform duration-500">
                            {getYoutubeThumbnail(item.video_url) ? (
                                <img
                                    src={getYoutubeThumbnail(item.video_url)}
                                    alt={item.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                    <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {/* Play icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1">{item.title}</h4>
                        <p className="text-xs md:text-sm text-slate-500 mt-2.5 leading-relaxed font-semibold line-clamp-2">{item.description}</p>
                        <div className="mt-3 text-[10px] text-slate-400 font-medium">
                            {item.created_at ? new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() : '-'}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                key={`gallery-${item.id}`}
                className="bg-white rounded-md border border-slate-100 shadow-xs overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                    router.visit(route('galeri.show', item.id));
                }}
            >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                    <img
                        src={`/storage/${item.image_path}`}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-6 flex flex-col flex-grow relative z-20 bg-white">
                    <h4 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1">{item.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 mt-2.5 leading-relaxed font-semibold line-clamp-2">{item.description}</p>
                    <div className="mt-3 text-[10px] text-slate-400 font-medium">
                        {item.created_at ? new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() : '-'}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Galeri - MESF" />

            {/* Header Section */}
            <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-800/40 via-[#0a192f] to-[#0a192f] pointer-events-none"></div>
                
                {/* Clean geometric accents */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/[0.03] to-transparent transform -skew-x-12 translate-x-20"></div>
                <div className="absolute bottom-0 left-10 w-64 h-64 bg-red-600/[0.05] rounded-full blur-3xl"></div>

                <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-widest drop-shadow-lg">
                        GALERI
                    </h1>
                    
                    {/* Horizontal Desc */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-6">
                        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70">
                            Gambar
                        </span>
                        <span className="text-white/20 text-xs hidden sm:block">•</span>
                        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70">
                            Video
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-12 md:pb-16">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    
                    {/* LEFT COLUMN: GAMBAR (Takes up more space) */}
                    <div className="lg:w-[70%]">
                        
                        {/* Latest 3 Gambar */}
                        {gambarItems.slice(0, 3).length > 0 && (
                            <div className="flex flex-col">
                                {gambarItems.slice(0, 3).map((item, index) => (
                                    <div key={`latest-img-${item.id}`} className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10 border-b border-slate-200 pb-10 last:mb-0 last:border-b last:border-black last:pb-12 group cursor-pointer" onClick={() => {
                                        if (item.item_type === 'album') {
                                            router.visit(route('galeri.album', item.id));
                                        }
                                        else {
                                            router.visit(route('galeri.show', item.id));
                                        }
                                    }}>
                                        <div className="md:w-1/3 flex flex-col justify-center order-2 md:order-1">
                                            {index === 0 && (
                                                <div className="text-[11px] font-black text-red-600 mb-3 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-red-600"></span> TERKINI
                                                </div>
                                            )}
                                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight mb-3 group-hover:text-slate-600 transition-colors">
                                                {item.title}
                                            </h2>
                                            <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-4">{item.description}</p>
                                            
                                            {item.item_type === 'album' && (
                                                <div className="mb-4">
                                                    <span 
                                                        className="inline-flex items-center gap-1.5 text-[9px] font-light uppercase tracking-[0.15em] text-red-600 bg-white border border-red-600 px-2 py-1 rounded-[2px]"
                                                        style={{ fontFamily: "'Chivo', sans-serif" }}
                                                    >
                                                        <svg className="w-2.5 h-2.5 mb-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        Album
                                                    </span>
                                                </div>
                                            )}

                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                {item.created_at ? new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '-'}
                                            </div>
                                        </div>
                                        <div className="md:w-2/3 order-1 md:order-2">
                                            <div className="aspect-[3/2] w-full overflow-hidden bg-slate-100">
                                                {item.item_type === 'album' ? (
                                                    item.latest_gallery ? (
                                                        <img src={`/storage/${item.latest_gallery.image_path}`} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                    )
                                                ) : (
                                                    <img src={`/storage/${item.image_path}`} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Older Gambar (Grid) */}
                        {gambarItems.slice(3).length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mt-12">
                                {gambarItems.slice(3).map((item) => (
                                    <div key={`older-img-${item.id}`} className="flex flex-row gap-4 cursor-pointer items-start group" onClick={() => {
                                        if (item.item_type === 'album') {
                                            router.visit(route('galeri.album', item.id));
                                        }
                                        else {
                                            router.visit(route('galeri.show', item.id));
                                        }
                                    }}>
                                        <div className="w-[40%] shrink-0 relative">
                                            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                                {item.item_type === 'album' ? (
                                                    item.latest_gallery ? (
                                                        <img src={`/storage/${item.latest_gallery.image_path}`} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                                    )
                                                ) : (
                                                    <img src={`/storage/${item.image_path}`} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-[60%] flex flex-col pt-0.5">
                                            <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-slate-600 transition-colors">{item.title}</h3>
                                            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{item.description}</p>
                                            
                                            {item.item_type === 'album' && (
                                                <div className="mt-2.5">
                                                    <span 
                                                        className="inline-flex items-center gap-1 text-[8px] font-light uppercase tracking-[0.15em] text-red-600 bg-white border border-red-600 px-1.5 py-0.5 rounded-[2px]"
                                                        style={{ fontFamily: "'Chivo', sans-serif" }}
                                                    >
                                                        <svg className="w-2.5 h-2.5 mb-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        Album
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {gambarItems.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <p className="font-semibold text-sm">Tiada gambar ditemui.</p>
                            </div>
                        )}
                    </div>

                    {/* Divider for desktop */}
                    <div className="hidden lg:block w-[1px] bg-slate-200"></div>
                    
                    {/* RIGHT COLUMN: VIDEO (Takes up less space) */}
                    <div className="lg:w-[30%] flex flex-col">
                        
                        {/* Latest 2 Videos (Playable) */}
                        {videoItems.slice(0, 2).length > 0 && (
                            <div className="flex flex-col">
                                {videoItems.slice(0, 2).map((item) => {
                                    const videoId = getYoutubeThumbnail(item.video_url)?.split('/vi/')[1]?.split('/')[0];
                                    return (
                                        <div key={`latest-vid-${item.id}`} className="mb-10 border-b border-slate-200 pb-10 last:mb-0 last:border-b-0 last:pb-0">
                                            {videoId ? (
                                                <div className="aspect-video w-full overflow-hidden bg-black mb-4">
                                                    <iframe 
                                                        className="w-full h-full"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title={item.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ) : (
                                                <div className="aspect-video w-full bg-slate-800 flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            <h3 className="font-bold text-slate-900 text-lg leading-snug">{item.title}</h3>
                                            <p className="text-slate-700 text-sm leading-relaxed mt-2 mb-3">{item.description}</p>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                {item.created_at ? new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '-'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Older Videos (List) */}
                        {videoItems.slice(2).length > 0 && (
                            <div className="mt-12 border-t border-black pt-12">
                                <div className="flex flex-col gap-6">
                                    {videoItems.slice(2).map((item) => {
                                        const videoId = getYoutubeThumbnail(item.video_url)?.split('/vi/')[1]?.split('/')[0];
                                        return (
                                        <a key={`older-vid-${item.id}`} href={item.video_url} target="_blank" rel="noopener noreferrer" className="flex flex-row gap-3 cursor-pointer items-start group block">
                                            <div className="w-[45%] shrink-0 relative aspect-video bg-black overflow-hidden">
                                                {videoId ? (
                                                    <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover group-hover:opacity-85 transition-opacity duration-300" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-6 h-6 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-600 transition-colors">
                                                        <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-[55%] flex flex-col">
                                                <h5 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-slate-600 transition-colors">{item.title}</h5>
                                                <p className="text-slate-600 text-xs mt-1 mb-2 leading-relaxed">{item.description}</p>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                    {item.created_at ? new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '-'}
                                                </div>
                                            </div>
                                        </a>
                                    )})}
                                </div>
                            </div>
                        )}

                        {videoItems.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <p className="font-semibold text-sm">Tiada video ditemui.</p>
                            </div>
                        )}

                    </div>
                </div>

                {activeLightboxItems !== null && (
                    <Lightbox 
                        images={activeLightboxItems} 
                        initialIndex={0} 
                        onClose={() => setActiveLightboxItems(null)} 
                    />
                )}
            </main>
        </PublicLayout>
    );
}
