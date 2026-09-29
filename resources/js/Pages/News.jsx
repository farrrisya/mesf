// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import {
    Play,
    Search,
    X,
    ArrowRight,
    Calendar,
    MapPin,
    Sparkles,
    Newspaper,
    Video
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
    const [onlyVideos, setOnlyVideos] = useState(false); // state

    // filter articles by category, video toggle, and search keyword
    const filteredArticles = useMemo(() => { // filter
        return articles.filter((article) => {
            const matchesCat = activeCategory === 'ALL' || article.category === activeCategory; // check
            if (!matchesCat) return false;

            if (onlyVideos && !article.video_url) return false; // check

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
    }, [articles, activeCategory, onlyVideos, searchQuery]);

    // reset all active filters
    const handleResetFilters = () => { // trigger
        setActiveCategory('ALL'); // state
        setSearchQuery(''); // state
        setOnlyVideos(false); // state
    };

    // fallback featured article if none provided
    const displayHero = featuredArticle || (articles.length > 0 ? articles[0] : null); // state

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
            <Head title="Latest News & Press Releases - MESF" />

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

            {/* page content wrapper */}
            <main className="relative z-20 pt-28 sm:pt-32 pb-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
                {/* 1. editorial hero (featured story) */}
                {displayHero ? (
                    <section className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group bg-[#0A0F1D] min-h-[440px] md:min-h-[520px] flex flex-col justify-end">
                        {/* image background if available */}
                        {displayHero.image ? (
                            <img
                                src={displayHero.image}
                                alt={displayHero.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-[#070B14]/80 -z-10" />
                        )}

                        {/* subtle monochrome gradient vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/85 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/90 via-[#070B14]/40 to-transparent pointer-events-none" />

                        {/* hero story content */}
                        <div className="relative z-10 w-full p-6 sm:p-10 md:p-14 flex flex-col justify-end text-left max-w-4xl space-y-4">
                            {/* badges row */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                                    <Sparkles className="w-3 h-3 text-neutral-300" />
                                    <span className="text-[11px] font-mono font-medium tracking-wider text-neutral-200 uppercase">
                                        FEATURED STORY
                                    </span>
                                </span>

                                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium uppercase bg-[#070B14]/80 border border-white/15 text-neutral-300 backdrop-blur-md">
                                    {(displayHero.tag || displayHero.category || '').replace(/^\[\s*|\s*\]$/g, '').trim()}
                                </span>

                                {displayHero.video_url && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1.5 backdrop-blur-md">
                                        <Play className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                                        <span>Video Feature</span>
                                    </span>
                                )}
                            </div>

                            {/* headline */}
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight drop-shadow-md">
                                {displayHero.title}
                            </h1>

                            {/* excerpt */}
                            {displayHero.excerpt && (
                                <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal line-clamp-2">
                                    {displayHero.excerpt}
                                </p>
                            )}

                            {/* metadata & cta button */}
                            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                                <Link
                                    href={displayHero.slug ? `/news/${displayHero.slug}` : '/news/article'}
                                    className="group/btn inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs tracking-wider uppercase transition-colors duration-200 shadow-lg cursor-pointer"
                                >
                                    <span>READ FULL STORY</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                                </Link>

                                <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                                    {displayHero.date && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                            <span>{displayHero.date}</span>
                                        </span>
                                    )}
                                    {displayHero.detail && (
                                        <>
                                            <span className="text-neutral-600">•</span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>{displayHero.detail}</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="relative py-16 sm:py-20 px-6 sm:px-12 w-full rounded-3xl overflow-hidden border border-white/10 bg-[#0A0F1D]/80 backdrop-blur-2xl text-center space-y-3">
                        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                            [ MESF NEWSROOM ]
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                            LATEST NEWS & PRESS RELEASES
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                            Official tournament bulletins, national esports updates, and federation press releases.
                        </p>
                    </section>
                )}

                {/* 2. search & filter control hub */}
                <section className="w-full mt-10 sm:mt-14 mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* search input */}
                        <div className="relative w-full md:max-w-md">
                            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder="Search articles, tournaments, announcements..."
                                className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white/[0.04] border border-white/10 focus:border-white/30 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none backdrop-blur-md transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')} // trigger
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* quick video toggle & counter */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setOnlyVideos((prev) => !prev)} // state
                                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide uppercase transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                                    onlyVideos
                                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                                        : 'bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                                }`}
                            >
                                <Video className="w-3.5 h-3.5" />
                                <span>Videos Only</span>
                            </button>

                            <span className="text-xs font-mono text-neutral-400 whitespace-nowrap">
                                {filteredArticles.length} {filteredArticles.length === 1 ? 'Story' : 'Stories'}
                            </span>
                        </div>
                    </div>

                    {/* category filter pill tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat; // check
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)} // state
                                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-colors duration-200 cursor-pointer select-none ${
                                        isActive
                                            ? 'bg-white/15 border border-white/30 text-white backdrop-blur-md shadow-sm font-semibold'
                                            : 'border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 3. editorial article cards grid */}
                <section className="w-full">
                    {filteredArticles.length === 0 ? (
                        <div className="py-20 text-center rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-md p-8 space-y-4 max-w-xl mx-auto">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 mx-auto flex items-center justify-center text-neutral-400">
                                <Newspaper className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-base font-bold text-white">No matching stories found</p>
                                <p className="text-xs font-mono text-neutral-400">
                                    Try adjusting your search keywords or switching category filters.
                                </p>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={handleResetFilters} // trigger
                                    className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer border border-white/15"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                            {filteredArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={article.slug ? `/news/${article.slug}` : '/news/article'}
                                    className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:bg-white/[0.07] hover:border-white/25 backdrop-blur-md overflow-hidden cursor-pointer transition-colors duration-200 shadow-md"
                                >
                                    {/* top: image container & content */}
                                    <div>
                                        {/* 16:9 framed photo box */}
                                        <div className="aspect-video w-full overflow-hidden relative bg-[#070B14] flex items-center justify-center border-b border-white/10">
                                            {article.image ? (
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    onError={(e) => {
                                                        e.target.style.opacity = '0'; // fallback
                                                    }}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-2 text-neutral-600">
                                                    <Newspaper className="w-8 h-8 opacity-40" />
                                                    <span className="text-[10px] font-mono uppercase text-neutral-500">Official Release</span>
                                                </div>
                                            )}

                                            {/* subtle bottom gradient overlay */}
                                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                                            {/* category badge */}
                                            <div className="absolute top-3.5 left-3.5">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-medium uppercase bg-[#070B14]/85 backdrop-blur-md border border-white/20 text-neutral-200 shadow-sm">
                                                    {(article.tag || article.category || '').replace(/^\[\s*|\s*\]$/g, '').trim()}
                                                </span>
                                            </div>

                                            {/* video indicator badge */}
                                            {article.video_url && (
                                                <div className="absolute top-3.5 right-3.5">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-300 flex items-center gap-1 shadow-sm">
                                                        <Play className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                                                        <span>Video</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* text content padding */}
                                        <div className="p-5 sm:p-6 space-y-3">
                                            {/* meta row: date & location */}
                                            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                                                <span>{article.date}</span>
                                                {article.detail && (
                                                    <>
                                                        <span className="text-neutral-600">•</span>
                                                        <span className="truncate">{article.detail}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* title headline */}
                                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug line-clamp-2">
                                                {article.title}
                                            </h3>

                                            {/* excerpt summary */}
                                            {article.excerpt && (
                                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal line-clamp-3">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* bottom action footer */}
                                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                        <span className="font-mono text-[11px] text-neutral-500">
                                            MESF Editorial
                                        </span>
                                        <span className="font-medium text-neutral-400 group-hover:text-white transition-colors duration-200 flex items-center gap-1">
                                            Read Story <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}
