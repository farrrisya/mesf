// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import NewsVideoPlayer from '@/Components/NewsVideoPlayer';
import {
    Play,
    Search,
    X,
    ArrowRight,
    Calendar,
    Newspaper,
    ExternalLink
} from 'lucide-react';

// --2. properties--
const DEFAULT_CATEGORIES = ['ALL', 'TOURNAMENTS', 'ACHIEVEMENTS', 'PARTNERSHIPS', 'ANNOUNCEMENTS'];

// --3. main component--
export default function News({
    articles = [],
    featuredArticle = null,
    categories = DEFAULT_CATEGORIES,
    activeCategory: initialCategory = 'ALL',
    search: initialSearch = ''
}) {
    // --4. actions--
    const [activeCategory, setActiveCategory] = useState(initialCategory); // state
    const [searchQuery, setSearchQuery] = useState(initialSearch); // state
    const [videoModalArticle, setVideoModalArticle] = useState(null); // state
    const [heroInlineVideo, setHeroInlineVideo] = useState(false); // state

    // lock background scroll when video modal is active
    useEffect(() => {
        if (!videoModalArticle) return; // check
        const originalOverflow = document.body.style.overflow; // state
        document.body.style.overflow = 'hidden'; // state

        const handleKeyDown = (e) => { // trigger
            if (e.key === 'Escape') setVideoModalArticle(null); // state
        };
        window.addEventListener('keydown', handleKeyDown); // trigger

        return () => {
            document.body.style.overflow = originalOverflow; // state
            window.removeEventListener('keydown', handleKeyDown); // trigger
        };
    }, [videoModalArticle]);

    // filter articles by category and search keyword
    const filteredArticles = useMemo(() => { // filter
        return articles.filter((article) => {
            const matchesCat = activeCategory === 'ALL' ||
                (article.category && article.category.toUpperCase().trim() === activeCategory.toUpperCase().trim()); // check
            if (!matchesCat) return false;

            if (searchQuery.trim()) { // check
                const q = searchQuery.toLowerCase();
                const inTitle = (article.title || '').toLowerCase().includes(q);
                const inExcerpt = (article.excerpt || '').toLowerCase().includes(q);
                const inTag = (article.tag || '').toLowerCase().includes(q);
                const inDetail = (article.detail || '').toLowerCase().includes(q);
                return inTitle || inExcerpt || inTag || inDetail;
            }

            return true;
        });
    }, [articles, activeCategory, searchQuery]);

    // reset all active filters
    const handleResetFilters = () => { // trigger
        setActiveCategory('ALL'); // state
        setSearchQuery(''); // state
    };

    // fallback featured article if none provided
    const displayHero = featuredArticle || (articles.length > 0 ? articles[0] : null); // state

    // determine whether to show spotlight hero card: ONLY when viewing ALL categories and not searching
    const showSpotlight = !searchQuery && displayHero && activeCategory === 'ALL'; // check

    // grid articles: exclude hero from grid on ALL category to prevent duplication; show all articles in normal grid when filtered by category
    const displayGridArticles = useMemo(() => { // filter
        if (showSpotlight && displayHero) { // check
            return filteredArticles.filter((article) => article.id !== displayHero.id); // filter
        }
        return filteredArticles; // state
    }, [filteredArticles, showSpotlight, displayHero]);

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title="News & Media - MESF" />

            {/* static ambient background glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
                <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-amber-600/10 blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[160px]" />
            </div>

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="news" />
            </div>

            {/* 1. minimalist editorial header */}
            <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-6 text-left">
                <div className="space-y-2 max-w-2xl">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-white drop-shadow-sm">
                        News
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-normal leading-relaxed">
                        Official announcements, tournament reports, and federation updates.
                    </p>
                </div>
            </header>

            {/* 2. minimalist category navigation & search */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-0">
                    {/* minimalist category tabs */}
                    <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat; // check
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)} // state
                                    className={`text-xs uppercase tracking-wider font-semibold pb-3.5 transition-colors duration-200 whitespace-nowrap relative cursor-pointer ${
                                        isActive
                                            ? 'text-white border-b-2 border-white'
                                            : 'text-neutral-400 hover:text-neutral-200 border-b-2 border-transparent'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* minimalist search input */}
                    <div className="relative w-full sm:w-56 md:w-64 pb-3.5 sm:pb-3">
                        <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder="Search news..."
                            className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-white/30 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')} // trigger
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. main editorial content */}
            <div className="flex-1">
                <main className="relative z-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* editorial hero spotlight */}
                    {showSpotlight && (
                        <div className="mb-10 sm:mb-12">
                            <div className="group relative block w-full rounded-2xl md:rounded-3xl border border-white/10 hover:border-amber-400/40 bg-[#090F1E]/90 hover:bg-[#0E162B] backdrop-blur-xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.55)] transition-colors duration-300">
                                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                                    {/* media column: if playing video inline, show player; otherwise show image */}
                                    <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto min-h-[260px] sm:min-h-[320px] lg:min-h-[400px] bg-[#060A14] overflow-hidden flex items-center justify-center">
                                        {heroInlineVideo && displayHero.video_url ? (
                                            <div className="w-full h-full p-4 flex flex-col justify-center bg-black">
                                                <div className="flex items-center justify-between pb-2">
                                                    <span className="text-xs font-mono text-amber-400 uppercase">Live Playback</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setHeroInlineVideo(false)} // trigger
                                                        className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        <span>Close Player</span>
                                                    </button>
                                                </div>
                                                <NewsVideoPlayer url={displayHero.video_url} title={displayHero.title} className="my-0" />
                                            </div>
                                        ) : (
                                            <>
                                                {displayHero.image ? (
                                                    <img
                                                        src={displayHero.image}
                                                        alt={displayHero.title}
                                                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-600 p-8">
                                                        <Newspaper className="w-10 h-10 opacity-40 text-neutral-400" />
                                                        <span className="text-xs font-mono uppercase text-neutral-400">Official Release</span>
                                                    </div>
                                                )}

                                                {/* gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                                                {/* badges on image */}
                                                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-amber-400 text-black shadow-sm">
                                                        Lead Story
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase bg-[#070B14]/85 backdrop-blur-md border border-white/20 text-neutral-200">
                                                        {(displayHero.tag || displayHero.category || 'News').replace(/^\[\s*|\s*\]$/g, '').trim()}
                                                    </span>
                                                </div>

                                                {/* video play action overlay if spotlight has video */}
                                                {displayHero.video_url && (
                                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                                        <button
                                                            type="button"
                                                            onClick={() => setHeroInlineVideo(true)} // trigger
                                                            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono tracking-wider uppercase transition-colors shadow-2xl cursor-pointer"
                                                        >
                                                            <Play className="w-4 h-4 fill-black" />
                                                            <span>Watch Video Here</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* content column */}
                                    <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-4 text-left border-t lg:border-t-0 lg:border-l border-white/10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                                                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                                                <span>{displayHero.date}</span>
                                                {displayHero.detail && displayHero.detail !== 'OFFICIAL' && (
                                                    <>
                                                        <span className="text-neutral-600">•</span>
                                                        <span className="truncate">{displayHero.detail}</span>
                                                    </>
                                                )}
                                            </div>

                                            <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors duration-200 tracking-tight leading-snug">
                                                {displayHero.title}
                                            </h2>

                                            {displayHero.excerpt && (
                                                <p className="text-xs sm:text-sm text-neutral-300/90 font-normal leading-relaxed line-clamp-3 lg:line-clamp-4">
                                                    {displayHero.excerpt}
                                                </p>
                                            )}
                                        </div>

                                        {/* spotlight actions */}
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                                            {displayHero.video_url ? (
                                                <div className="flex items-center gap-3 w-full justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => setHeroInlineVideo(true)} // trigger
                                                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                                    >
                                                        <Play className="w-3.5 h-3.5 fill-black" />
                                                        <span>Play Video</span>
                                                    </button>
                                                    {displayHero.slug && (
                                                        <Link
                                                            href={`/news/${displayHero.slug}`} // redirect
                                                            className="text-xs text-neutral-400 hover:text-white uppercase font-mono tracking-wider transition-colors"
                                                        >
                                                            Full Article &rarr;
                                                        </Link>
                                                    )}
                                                </div>
                                            ) : (
                                                displayHero.slug && (
                                                    <Link
                                                        href={`/news/${displayHero.slug}`} // redirect
                                                        className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors cursor-pointer w-full justify-between"
                                                    >
                                                        <span>Read Full Story</span>
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* editorial article cards grid */}
                    <section className="w-full">
                        {filteredArticles.length === 0 ? (
                            <div className="py-20 text-center rounded-2xl border border-white/15 bg-[#0e1628]/90 backdrop-blur-xl p-8 space-y-4 max-w-xl mx-auto shadow-xl">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 mx-auto flex items-center justify-center text-neutral-400 shadow-inner">
                                    <Newspaper className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-bold text-white">No matching dispatches found</p>
                                    <p className="text-xs text-neutral-400">
                                        Try adjusting your search keywords or switching category filters.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleResetFilters} // trigger
                                        className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer hover:bg-neutral-200 shadow-md"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        ) : displayGridArticles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
                                {displayGridArticles.map((article) => {
                                    const cleanCategory = (article.tag || article.category || 'News')
                                        .replace(/^\[\s*|\s*\]$/g, '')
                                        .trim(); // convert
                                    const hasVideo = Boolean(article.video_url); // check

                                    // card container content
                                    const CardContent = (
                                        <div className="group flex flex-col justify-between h-full rounded-2xl bg-[#090F1E]/90 hover:bg-[#0E162B] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl overflow-hidden cursor-pointer transition-colors duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
                                            <div>
                                                {/* 16:10 aspect ratio thumbnail box (static geometry, no zoom) */}
                                                <div className="aspect-[16/10] w-full overflow-hidden relative bg-[#060A14] flex items-center justify-center border-b border-white/[0.08] shrink-0">
                                                    {article.image ? (
                                                        <img
                                                            src={article.image}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                                                            onError={(e) => {
                                                                e.target.style.opacity = '0'; // error
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center gap-2 text-neutral-600">
                                                            <Newspaper className="w-8 h-8 opacity-40 text-neutral-500" />
                                                            <span className="text-[10px] font-mono uppercase text-neutral-500">Official Release</span>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                                                    {/* category badge */}
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#070B14]/90 backdrop-blur-md border border-white/20 text-neutral-200">
                                                            {cleanCategory}
                                                        </span>
                                                    </div>

                                                    {/* prominent video badge / play overlay */}
                                                    {hasVideo && (
                                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                                            <span className="w-11 h-11 rounded-full bg-amber-400/90 group-hover:bg-amber-400 text-black flex items-center justify-center shadow-lg transition-colors">
                                                                <Play className="w-5 h-5 fill-black translate-x-0.5" />
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* card text details */}
                                                <div className="p-5 sm:p-6 space-y-2.5 text-left">
                                                    {/* meta */}
                                                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                                                        <Calendar className="w-3 h-3 text-neutral-500" />
                                                        <span>{article.date}</span>
                                                        {article.detail && article.detail !== 'OFFICIAL' && (
                                                            <>
                                                                <span className="text-neutral-600">•</span>
                                                                <span className="truncate">{article.detail}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* title headline: stays static in size, shifts color to amber on hover */}
                                                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors duration-200 tracking-tight leading-snug line-clamp-2 min-h-[2.5rem]">
                                                        {article.title}
                                                    </h3>

                                                    {/* excerpt */}
                                                    {article.excerpt && (
                                                        <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed font-normal">
                                                            {article.excerpt}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* bottom action footer */}
                                            <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                                                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                                                    {hasVideo ? 'Video Broadcast' : 'Official Story'}
                                                </span>

                                                {hasVideo ? (
                                                    <span className="font-semibold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                                                        <Play className="w-3 h-3 fill-amber-400 group-hover:fill-amber-300" />
                                                        <span>Watch Video</span>
                                                    </span>
                                                ) : (
                                                    <span className="font-semibold text-neutral-300 group-hover:text-white transition-colors duration-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                                                        <span>Read Story</span>
                                                        <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );

                                    // if article has a video, click shows the video in-page without navigating away!
                                    if (hasVideo) {
                                        return (
                                            <div
                                                key={article.id}
                                                onClick={() => setVideoModalArticle(article)} // modal
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        setVideoModalArticle(article); // modal
                                                    }
                                                }}
                                                className="text-left select-none focus:outline-none"
                                            >
                                                {CardContent}
                                            </div>
                                        );
                                    }

                                    // standard text article: navigates to article page
                                    return (
                                        <Link
                                            key={article.id}
                                            href={article.slug ? `/news/${article.slug}` : '/news'} // redirect
                                            className="text-left select-none focus:outline-none"
                                        >
                                            {CardContent}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : null}
                    </section>
                </main>
            </div>

            {/* 4. in-page video theater modal (plays video right here without redirecting!) */}
            {videoModalArticle && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={videoModalArticle.title}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
                    onClick={() => setVideoModalArticle(null)} // trigger
                >
                    <div
                        className="relative w-full max-w-4xl rounded-2xl bg-[#090F1E] border border-white/20 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // trigger
                    >
                        {/* modal top bar */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0E162B]">
                            <div className="flex items-center gap-2.5 min-w-0 pr-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-400 text-black shrink-0">
                                    {(videoModalArticle.tag || videoModalArticle.category || 'Video').replace(/^\[\s*|\s*\]$/g, '').trim()}
                                </span>
                                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                                    {videoModalArticle.title}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setVideoModalArticle(null)} // trigger
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                                aria-label="Close video"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* video player body */}
                        <div className="p-4 sm:p-6 bg-black">
                            <NewsVideoPlayer
                                url={videoModalArticle.video_url} // state
                                title={videoModalArticle.title} // state
                                className="my-0"
                            />
                        </div>

                        {/* modal bottom action bar */}
                        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-[#0E162B] text-xs">
                            <span className="text-neutral-400 font-mono text-[11px]">
                                {videoModalArticle.date}
                            </span>
                            {videoModalArticle.slug && (
                                <Link
                                    href={`/news/${videoModalArticle.slug}`} // redirect
                                    className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-amber-400 font-mono uppercase text-[11px] transition-colors"
                                >
                                    <span>Read Full Article & Details</span>
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* footer */}
            <Footer />
        </div>
    );
}
