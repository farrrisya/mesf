// --1. imports--
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

// --2. main component--
export default function Lightbox({ images = [], initialIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent scrollbar layout shift glitch
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, images]);

    if (!images || images.length === 0) return null;

    const currentImage = images[currentIndex];
    const hasMultiple = images.length > 1;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // --3. UI--
    const modalContent = (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col md:flex-row backdrop-blur-sm">
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full md:bg-transparent"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Left Column (Image & Thumbnails) */}
            <div className="flex-1 flex flex-col min-w-0 h-[60vh] md:h-full">
                {/* Main Image Container */}
                <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 min-h-0">
                    {hasMultiple && (
                        <button 
                            onClick={prevSlide}
                            className="absolute left-4 z-10 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {currentImage.type === 'video' ? (
                        <a href={currentImage.video_url} target="_blank" rel="noopener noreferrer" className="relative flex items-center justify-center max-w-full max-h-full group">
                            {getYoutubeThumbnail(currentImage.video_url) ? (
                                <img key={currentImage.id || currentIndex} src={getYoutubeThumbnail(currentImage.video_url)} alt={currentImage.title} className="max-w-full max-h-full object-contain select-none" />
                            ) : (
                                <div className="w-[600px] h-[400px] max-w-full bg-slate-800 flex items-center justify-center">
                                    <svg className="w-24 h-24 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                                    <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                            </div>
                        </a>
                    ) : (
                        <img 
                            key={currentImage.id || currentIndex}
                            src={`/storage/${currentImage.image_path}`} 
                            alt={currentImage.title}
                            className="max-w-full max-h-full object-contain select-none"
                        />
                    )}

                    {hasMultiple && (
                        <button 
                            onClick={nextSlide}
                            className="absolute right-4 z-10 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Thumbnails */}
                {hasMultiple && (
                    <div className="h-20 md:h-28 bg-black/50 border-t border-white/10 flex items-center justify-center px-4 overflow-x-auto shrink-0">
                        <div className="flex gap-2 min-w-max mx-auto py-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`relative h-14 md:h-20 w-20 md:w-28 flex-shrink-0 overflow-hidden transition-all duration-200 ${idx === currentIndex ? 'ring-2 ring-amber-500 opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                >
                                    {img.type === 'video' ? (
                                        <>
                                            {getYoutubeThumbnail(img.video_url) ? (
                                                <img src={getYoutubeThumbnail(img.video_url)} alt={img.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                        </>
                                    ) : (
                                        <img 
                                            src={`/storage/${img.image_path}`} 
                                            alt={img.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column (Details Panel) */}
            {(currentImage.description || currentImage.title) && (
                <div className="w-full md:w-[350px] lg:w-[400px] bg-slate-900 border-t md:border-t-0 md:border-l border-white/10 flex flex-col shrink-0 max-h-[40vh] md:max-h-none">
                    <div className="p-6 md:p-8 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
                        {currentImage.title && (
                            <h3 className="text-white font-bold text-lg mb-4 leading-snug pr-4">{currentImage.title}</h3>
                        )}
                        {currentImage.description && (
                            <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                                {currentImage.description}
                            </p>
                        )}
                        {currentImage.created_at && (
                            <div className="mt-6 text-[10px] text-white/40 uppercase tracking-wider font-bold">
                                Dimuat naik pada: {new Date(currentImage.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return mounted ? createPortal(modalContent, document.body) : null;
}
