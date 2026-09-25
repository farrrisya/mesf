// --1. imports--
import { useState, useMemo } from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';

// --2. helpers--
export function parseVideoInfo(url) {
    if (!url || typeof url !== 'string') return null; // check
    const trimmed = url.trim(); // convert

    // YouTube check
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/); // check
    if (ytMatch && ytMatch[1]) { // check
        return {
            type: 'youtube', // state
            platform: 'YouTube', // state
            embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`, // convert
            originalUrl: trimmed, // state
        };
    }

    // Facebook check
    if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) { // check
        return {
            type: 'facebook', // state
            platform: 'Facebook', // state
            embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0&autoplay=0`, // convert
            originalUrl: trimmed, // state
        };
    }

    // Vimeo check
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/); // check
    if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) { // check
        const id = vimeoMatch[3] || vimeoMatch[1]; // state
        return {
            type: 'vimeo', // state
            platform: 'Vimeo', // state
            embedUrl: `https://player.vimeo.com/video/${id}`, // convert
            originalUrl: trimmed, // state
        };
    }

    // Direct MP4/WebM check
    if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) { // check
        return {
            type: 'direct', // state
            platform: 'Video File', // state
            embedUrl: trimmed, // state
            originalUrl: trimmed, // state
        };
    }

    // Generic URL fallback
    if (/^https?:\/\//i.test(trimmed)) { // check
        return {
            type: 'generic', // state
            platform: 'External Video', // state
            embedUrl: trimmed, // state
            originalUrl: trimmed, // state
        };
    }

    return null; // check
}

// --3. main component--
export default function NewsVideoPlayer({ url, title = 'Video Coverage', className = '' }) {
    const [isLoaded, setIsLoaded] = useState(false); // state
    const videoInfo = useMemo(() => parseVideoInfo(url), [url]); // convert

    if (!videoInfo) return null; // check

    // --4. UI--
    return (
        <div className={`w-full my-8 space-y-2.5 ${className}`}>
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30">
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span>{videoInfo.platform}</span>
                    </span>
                    <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                        {title}
                    </span>
                </div>

                <a
                    href={videoInfo.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-amber-400 transition-colors"
                >
                    <span>Open in {videoInfo.platform}</span>
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl backdrop-blur-sm">
                {videoInfo.type === 'direct' ? (
                    <video
                        controls
                        playsInline
                        className="w-full h-full object-contain bg-black"
                        src={videoInfo.embedUrl}
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <iframe
                        src={videoInfo.embedUrl}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => setIsLoaded(true)} // state
                        className="w-full h-full border-0 absolute inset-0 bg-black"
                    />
                )}
            </div>

            {videoInfo.type === 'facebook' && (
                <p className="text-[11px] text-neutral-500 italic px-1">
                    Note: If the Facebook video does not load, ensure the post is set to Public on Facebook.
                </p>
            )}
        </div>
    );
}
