// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';
import NewsVideoPlayer from '@/Components/NewsVideoPlayer';
import { Calendar, MapPin, User, Eye, Newspaper } from 'lucide-react';

// --2. main component--
export default function NewsArticle({ article = {}, latestFeed = [] }) {
    // --3. actions--
    const [scrollProgress, setScrollProgress] = useState(0); // state
    const [scrollY, setScrollY] = useState(0); // state

    // track scroll progress and parallax position
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight; // convert
            const currentScroll = window.scrollY; // state
            setScrollY(currentScroll); // state
            if (totalHeight > 0) { // check
                setScrollProgress(Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100)); // state
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // parse content into readable paragraphs
    const paragraphs = article?.content
        ? article.content.split(/\n\s*\n/).filter(Boolean)
        : []; // convert

    // --4. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title={`${article?.title || 'News Article'} - MESF`} />

            {/* custom animation for moving footer beam */}
            <style>{`
                @keyframes beamScan {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(400%);
                    }
                }
                .footer-beam {
                    animation: beamScan 12s linear infinite;
                }
            `}</style>

            {/* reading progress bar in natural grey/silver */}
            <div
                className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 z-[60] transition-all duration-75 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* background SVG grain texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="news" />
            </div>

            {/* 2. full-screen hero cover */}
            <section className="relative w-full min-h-[70vh] md:min-h-[80vh] flex flex-col justify-end overflow-hidden pt-28">
                {article?.image ? (
                    <img
                        src={article.image}
                        alt={article.title || 'Article Cover'}
                        className="absolute inset-0 w-full h-[115%] object-cover object-center will-change-transform opacity-60"
                        style={{
                            transform: `translateY(${scrollY * 0.2}px)`
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#0A0F1E] -z-10" />
                )}

                <div className="absolute inset-0 bg-[#070B14]/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/85 to-transparent" />
                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 bg-amber-400/10 rounded-full blur-3xl" />

                {/* hero text */}
                <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pb-12 md:pb-16 text-left relative z-10">
                    <div className="max-w-4xl space-y-4">
                        <div>
                            <BackButton href="/news" label="Back to News" />
                        </div>

                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md text-xs font-black tracking-wider text-white uppercase font-mono shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                                {(article?.tag || article?.category || 'NEWS').replace(/^\[\s*|\s*\]$/g, '').trim()}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            {article?.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-400 font-medium pt-2">
                            <span className="flex items-center gap-1.5 text-neutral-300">
                                <Calendar className="w-4 h-4 text-amber-400" />
                                <span>{article?.date}</span>
                            </span>
                            {article?.location && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-neutral-500" />
                                        <span>{article.location}</span>
                                    </span>
                                </>
                            )}
                            {article?.author && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-neutral-500" />
                                        <span>By {article.author}</span>
                                    </span>
                                </>
                            )}
                            {article?.views_count > 0 && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4 text-neutral-500" />
                                        <span>{article.views_count} reads</span>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. 2-column editorial layout: article on left, latest feed on right */}
            <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 py-12 md:py-20 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
                    {/* left column: story narrative (8 of 12 columns) */}
                    <article className="lg:col-span-8 space-y-7 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
                        {article?.excerpt && (
                            <p className="text-xl sm:text-2xl text-neutral-100 font-normal leading-relaxed border-b border-white/10 pb-6">
                                {article.excerpt}
                            </p>
                        )}

                        {article?.video_url && (
                            <NewsVideoPlayer
                                url={article.video_url} // state
                                title={article.title} // state
                            />
                        )}

                        {paragraphs.length > 0 ? (
                            paragraphs.map((p, idx) => {
                                // check if paragraph looks like a quote
                                if (p.startsWith('"') || p.startsWith('“')) {
                                    return (
                                        <blockquote key={idx} className="my-8 pl-5 border-l-2 border-amber-400 bg-transparent">
                                            <p className="text-lg sm:text-xl italic font-medium text-neutral-200 leading-normal">
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
                            <p className="whitespace-pre-line text-neutral-300">
                                {article?.content || 'No detailed content available for this article.'}
                            </p>
                        )}

                        {/* share & tags */}
                        <div className="border-t border-white/10 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-start">
                                <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mr-1">
                                    Share
                                </span>
                                <button
                                    type="button"
                                    aria-label="Share on X"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article?.title || '')}&url=${encodeURIComponent(window.location.href)}`, '_blank')} // trigger
                                    className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Share on Facebook"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} // trigger
                                    className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-400">#MESF</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-400">#MALAYSIA</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-400">#ESPORTS</span>
                            </div>
                        </div>
                    </article>

                    {/* right column: latest new sidebar */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 block">
                                    Feed
                                </span>
                                <h2 className="text-lg font-bold text-white tracking-tight">
                                    Latest Updates
                                </h2>
                            </div>
                            <Link
                                href="/news"
                                className="text-xs font-semibold text-neutral-400 hover:text-white uppercase transition-colors"
                            >
                                All &rarr;
                            </Link>
                        </div>

                        {/* vertical card list with clean compact media rows */}
                        <div className="space-y-3.5">
                            {latestFeed.length === 0 ? (
                                <p className="text-xs text-neutral-500">No other articles in feed.</p>
                            ) : (
                                latestFeed.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.slug}`}
                                        className="group flex gap-3.5 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-400/30 transition-all duration-200"
                                    >
                                        <div className="w-20 aspect-square rounded-lg bg-[#0A0F1D] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                                />
                                            ) : (
                                                <Newspaper className="w-5 h-5 text-neutral-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                                                <span className="text-amber-400 font-bold">{item.tag || item.category}</span>
                                                <span>•</span>
                                                <span>{item.date}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                                {item.title}
                                            </h3>
                                            {item.excerpt && (
                                                <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                                                    {item.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </aside>
                </div>
            </main>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}
