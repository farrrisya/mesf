// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';
import NewsVideoPlayer from '@/Components/NewsVideoPlayer';
import {
    Calendar,
    MapPin,
    User,
    Eye,
    Newspaper,
    Clock,
    Share2,
    Check,
    Copy,
    ArrowRight,
    ShieldCheck,
    Maximize2,
    X,
    ExternalLink
} from 'lucide-react';

// --2. main component--
export default function NewsArticle({ article = {}, latestFeed = [] }) {
    // --3. actions--
    const [scrollProgress, setScrollProgress] = useState(0); // state
    const [copied, setCopied] = useState(false); // state
    const [isPosterOpen, setIsPosterOpen] = useState(false); // state

    // track scroll progress for top reading indicator
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight; // convert
            const currentScroll = window.scrollY; // state
            if (totalHeight > 0) { // check
                setScrollProgress(Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100)); // state
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // lock body scroll and listen for escape key when full poster modal is open
    useEffect(() => {
        if (!isPosterOpen) return; // check
        const originalOverflow = document.body.style.overflow; // state
        document.body.style.overflow = 'hidden'; // state

        const handleKeyDown = (e) => { // trigger
            if (e.key === 'Escape') setIsPosterOpen(false); // state
        };
        window.addEventListener('keydown', handleKeyDown); // trigger

        return () => {
            document.body.style.overflow = originalOverflow; // state
            window.removeEventListener('keydown', handleKeyDown); // trigger
        };
    }, [isPosterOpen]);

    // calculate estimated read time in minutes
    const readTimeMinutes = useMemo(() => { // convert
        const wordCount = ((article?.content || '') + ' ' + (article?.excerpt || '')).trim().split(/\s+/).filter(Boolean).length; // check
        return Math.max(1, Math.ceil(wordCount / 180)); // state
    }, [article?.content, article?.excerpt]);

    // parse article body content into readable paragraph blocks
    const paragraphs = useMemo(() => { // convert
        return article?.content
            ? article.content.split(/\n\s*\n/).filter(Boolean)
            : []; // convert
    }, [article?.content]);

    // copy article url to clipboard
    const handleCopyLink = () => { // trigger
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href); // save
            setCopied(true); // state
            setTimeout(() => setCopied(false), 2200); // clock
        }
    };

    // --4. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden flex flex-col justify-between">
            <Head title={`${article?.title || 'News Article'} - MESF`} />

            {/* reading progress indicator bar */}
            <div
                className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 z-[60] transition-all duration-75 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* ambient background glows */}
            <div className="pointer-events-none fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px] z-0" />
            <div className="pointer-events-none fixed top-1/3 -right-20 h-[450px] w-[450px] rounded-full bg-emerald-500/5 blur-[160px] z-0" />

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="news" />
            </div>

            {/* article main container */}
            <div className="flex-1">
                {/* 1. article masthead header */}
                <header className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-6 text-left">
                    <div className="space-y-5">
                        {/* back navigation */}
                        <div>
                            <BackButton href="/news" label="Back to News" />
                        </div>

                        {/* category badge & metadata row */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-amber-400 text-black shadow-sm">
                                {(article?.tag || article?.category || 'News').replace(/^\[\s*|\s*\]$/g, '').trim()}
                            </span>

                            {article?.date && (
                                <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{article.date}</span>
                                </span>
                            )}

                            <span className="text-neutral-600 hidden sm:inline">•</span>

                            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                <span>{readTimeMinutes} min read</span>
                            </span>

                            {article?.location && (
                                <>
                                    <span className="text-neutral-600 hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>{article.location}</span>
                                    </span>
                                </>
                            )}
                        </div>

                        {/* headline title */}
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.15]">
                            {article?.title}
                        </h1>

                        {/* lead excerpt */}
                        {article?.excerpt && (
                            <p className="text-base sm:text-xl text-neutral-300 font-normal leading-relaxed pt-1">
                                {article.excerpt}
                            </p>
                        )}

                        {/* author, views & share action bar */}
                        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* author and reads */}
                            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                                <div className="flex items-center gap-1.5 text-neutral-300">
                                    <User className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>By {article?.author || 'MESF Editorial'}</span>
                                </div>
                                {article?.views_count > 0 && (
                                    <>
                                        <span className="text-neutral-600">•</span>
                                        <span className="flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5 text-neutral-400" />
                                            <span>{article.views_count} reads</span>
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* social share buttons */}
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mr-1">
                                    Share:
                                </span>

                                {/* share on X */}
                                <button
                                    type="button"
                                    aria-label="Share on X"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article?.title || '')}&url=${encodeURIComponent(window.location.href)}`, '_blank')} // trigger
                                    className="h-8 w-8 rounded-lg bg-[#0e1628] hover:bg-[#15203a] border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </button>

                                {/* share on facebook */}
                                <button
                                    type="button"
                                    aria-label="Share on Facebook"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} // trigger
                                    className="h-8 w-8 rounded-lg bg-[#0e1628] hover:bg-[#15203a] border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>

                                {/* copy link */}
                                <button
                                    type="button"
                                    onClick={handleCopyLink} // trigger
                                    className={`px-3 h-8 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border ${
                                        copied
                                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                            : 'bg-[#0e1628] hover:bg-[#15203a] border-white/15 text-neutral-300 hover:text-white'
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 2. featured media showcase (crystal clear, high definition with hover & click-to-pop-up) */}
                <div className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
                    {article?.image ? (
                        <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.65)] group">
                            {/* top luminous highlight beam */}
                            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70 z-10" />

                            {/* crisp interactive image display (opens full poster pop-up on click) */}
                            <button
                                type="button"
                                onClick={() => setIsPosterOpen(true)} // trigger
                                className="w-full bg-[#070B14] flex items-center justify-center overflow-hidden relative cursor-zoom-in text-left block focus:outline-none"
                                title="View full poster"
                            >
                                <img
                                    src={article.image}
                                    alt={article.title || 'Article Cover'}
                                    className="w-full max-h-[680px] object-contain object-center"
                                />

                                {/* hover overlay with pure SVG icon (no sentence/text) */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                                    <div className="w-14 h-14 rounded-full bg-black/75 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl">
                                        <Maximize2 className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </button>

                            {/* caption footer */}
                            <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-mono text-neutral-400">
                                <span className="truncate">{article.title}</span>
                                <button
                                    type="button"
                                    onClick={() => setIsPosterOpen(true)} // trigger
                                    aria-label="View full poster"
                                    className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    title="View full poster"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : article?.video_url ? (
                        <div className="rounded-3xl border border-white/15 overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.65)]">
                            <NewsVideoPlayer
                                url={article.video_url} // state
                                title={article.title} // state
                            />
                        </div>
                    ) : null}
                </div>

                {/* 3. article narrative layout: story text on left, feed & meta on right */}
                <main className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                        {/* story narrative column (8 cols) */}
                        <article className="lg:col-span-8 space-y-7">
                            {/* embedded video player if article has BOTH image and video */}
                            {article?.image && article?.video_url && (
                                <div className="rounded-2xl border border-white/15 overflow-hidden shadow-lg mb-8">
                                    <NewsVideoPlayer
                                        url={article.video_url} // state
                                        title={article.title} // state
                                    />
                                </div>
                            )}

                            {/* article body paragraphs */}
                            <div className="space-y-6 text-base sm:text-lg text-neutral-200 leading-[1.8] font-normal">
                                {paragraphs.length > 0 ? (
                                    paragraphs.map((p, idx) => {
                                        // check if paragraph is a quote
                                        if (p.startsWith('"') || p.startsWith('“')) {
                                            return (
                                                <blockquote
                                                    key={idx}
                                                    className="my-8 pl-6 py-3 border-l-2 border-amber-400 bg-white/[0.02] rounded-r-2xl"
                                                >
                                                    <p className="text-lg sm:text-xl italic font-medium text-neutral-100 leading-relaxed">
                                                        {p}
                                                    </p>
                                                </blockquote>
                                            );
                                        }
                                        return (
                                            <p key={idx} className="whitespace-pre-line">
                                                {p}
                                            </p>
                                        );
                                    })
                                ) : (
                                    <p className="whitespace-pre-line text-neutral-400">
                                        {article?.content || 'No detailed content available for this article.'}
                                    </p>
                                )}
                            </div>

                            {/* tags & share footer */}
                            <div className="border-t border-white/10 pt-6 mt-12 space-y-6">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-mono text-neutral-500 uppercase mr-1">
                                        Filed under:
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
                                        #MESF
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
                                        #{article?.category || 'ESPORTS'}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
                                        #MALAYSIA
                                    </span>
                                </div>

                                {/* federation official dispatch notice card */}
                                <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e1628] to-[#070B14] flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 text-amber-400">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <p className="font-bold text-white uppercase tracking-wider font-mono">
                                            Malaysia Esports Federation
                                        </p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            Official communication released by the Communications and Media Division of the Malaysia Esports Federation (MESF). All rights reserved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* sidebar column (4 cols) */}
                        <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                            {/* article quick facts card */}
                            <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] to-[#090e1a] backdrop-blur-xl p-5 space-y-4 shadow-lg">
                                <div className="pb-3 border-b border-white/10">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold">
                                        Overview
                                    </span>
                                    <h2 className="text-sm font-bold text-white uppercase tracking-tight">
                                        Story Details
                                    </h2>
                                </div>

                                <div className="space-y-3 text-xs font-mono">
                                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                                        <span className="text-neutral-400">Category</span>
                                        <span className="text-white font-bold">{article?.category || 'News'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                                        <span className="text-neutral-400">Published</span>
                                        <span className="text-white">{article?.date || 'Recent'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                                        <span className="text-neutral-400">Author</span>
                                        <span className="text-white">{article?.author || 'MESF'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-neutral-400">Location</span>
                                        <span className="text-white">{article?.location || 'Malaysia'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* latest updates feed */}
                            <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] to-[#090e1a] backdrop-blur-xl p-5 space-y-4 shadow-lg">
                                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                    <div>
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold">
                                            Feed
                                        </span>
                                        <h2 className="text-sm font-bold text-white uppercase tracking-tight">
                                            Latest Stories
                                        </h2>
                                    </div>
                                    <Link
                                        href="/news"
                                        className="text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors flex items-center gap-1"
                                    >
                                        <span>All</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {latestFeed.length === 0 ? (
                                        <p className="text-xs text-neutral-500 font-mono py-2">No other stories available.</p>
                                    ) : (
                                        latestFeed.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/news/${item.slug}`}
                                                className="group flex gap-3 p-2.5 rounded-xl border border-white/5 bg-[#0e1628]/60 hover:bg-[#121c33] hover:border-white/20 transition-all duration-200"
                                            >
                                                {/* thumbnail box (no hover zoom) */}
                                                <div className="w-16 h-16 rounded-lg bg-[#070B14] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    ) : (
                                                        <Newspaper className="w-5 h-5 text-neutral-600" />
                                                    )}
                                                </div>

                                                {/* item content */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 mb-1">
                                                        <span className="text-amber-400 font-bold">
                                                            {(item.tag || item.category || '').replace(/^\[\s*|\s*\]$/g, '').trim()}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{item.date}</span>
                                                    </div>
                                                    <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>

            {/* 4. full poster pop-up modal lightbox */}
            {isPosterOpen && article?.image && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Full Article Poster"
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md"
                    onClick={() => setIsPosterOpen(false)} // trigger
                >
                    {/* close button */}
                    <button
                        type="button"
                        onClick={() => setIsPosterOpen(false)} // trigger
                        aria-label="Close poster view"
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-amber-400 transition-colors cursor-pointer shadow-lg backdrop-blur-md"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* complete uncropped poster */}
                    <div
                        onClick={(e) => e.stopPropagation()} // trigger
                        className="relative max-h-screen max-w-screen flex items-center justify-center p-1 sm:p-2"
                    >
                        <img
                            src={article.image}
                            alt={article.title || 'Full Poster'}
                            className="max-h-[94vh] max-w-[96vw] w-auto h-auto object-contain select-none shadow-2xl rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* 5. footer */}
            <Footer />
        </div>
    );
}
