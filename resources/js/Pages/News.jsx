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
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden flex flex-col justify-between">
            <Head title="News & Announcements - MESF" />

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

            {/* main content area */}
            <div className="flex-1">
                {/* 1. page header section */}
                <header className="relative z-20 pt-32 pb-8 px-6 sm:px-10 md:px-14 max-w-7xl mx-auto text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                        News
                    </h1>
                </header>

                {/* 2. content wrapper with spacious layout */}
                <main className="relative z-20 pb-28 px-6 sm:px-10 md:px-14 max-w-7xl mx-auto space-y-12 sm:space-y-16">
                    {/* editorial hero (featured story) */}
                    {displayHero && (
                        <section className="relative w-full rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group bg-[#0A0F1D] min-h-[380px] md:min-h-[440px] flex flex-col justify-end">
                            {/* top luminous highlight beam */}
                            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70 z-20" />

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

                            {/* gradient vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none" />

                            {/* hero story content */}
                            <div className="relative z-10 w-full p-8 sm:p-12 flex flex-col justify-end text-left max-w-3xl space-y-4">
                                <span className="inline-block px-3 py-1 rounded-lg text-xs font-mono font-semibold uppercase bg-white/10 border border-white/20 text-neutral-200 backdrop-blur-md w-fit">
                                    {(displayHero.tag || displayHero.category || 'News').replace(/^\[\s*|\s*\]$/g, '').trim()}
                                </span>

                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                                    {displayHero.title}
                                </h2>

                                <div className="pt-2 flex items-center gap-6">
                                    <Link
                                        href={displayHero.slug ? `/news/${displayHero.slug}` : '/news/article'}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-wider uppercase transition-colors shadow-md cursor-pointer"
                                    >
                                        <span>Read Story</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    {displayHero.date && (
                                        <span className="text-xs text-neutral-400 font-mono">
                                            {displayHero.date}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* search & filter control hub */}
                    <section className="w-full space-y-6 pt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* search input */}
                            <div className="relative w-full md:max-w-md">
                                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery} // state
                                    onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                    placeholder="Search articles, tournaments, announcements..."
                                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#0e1628] border border-white/15 focus:border-white/40 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none backdrop-blur-md transition-colors shadow-inner"
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
                                    className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wide uppercase transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                                        onlyVideos
                                            ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                                            : 'bg-[#0e1628] border border-white/15 text-neutral-300 hover:text-white hover:border-white/30'
                                    }`}
                                >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Videos Only</span>
                                </button>

                                <span className="text-xs font-mono text-neutral-400 whitespace-nowrap px-3 py-2 rounded-xl bg-white/5 border border-white/10">
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
                                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                                            isActive
                                                ? 'bg-white text-black border border-white shadow-md font-extrabold'
                                                : 'border border-white/15 bg-[#0e1628] text-neutral-300 hover:text-white hover:border-white/30 hover:bg-[#131d33]'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* editorial article cards grid */}
                    <section className="w-full">
                        {filteredArticles.length === 0 ? (
                            <div className="py-20 text-center rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-xl p-8 space-y-4 max-w-xl mx-auto shadow-xl">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 mx-auto flex items-center justify-center text-neutral-400 shadow-inner">
                                    <Newspaper className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-bold text-white">No matching stories found</p>
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
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                                {filteredArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={article.slug ? `/news/${article.slug}` : '/news/article'}
                                        className="group relative flex flex-col justify-between rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] hover:border-white/30 hover:bg-[#121b30] backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.65)]"
                                    >
                                        {/* top luminous highlight beam */}
                                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 opacity-70 z-10" />

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
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-mono font-medium uppercase bg-[#070B14]/85 backdrop-blur-md border border-white/20 text-neutral-200 shadow-sm">
                                                        {(article.tag || article.category || '').replace(/^\[\s*|\s*\]$/g, '').trim()}
                                                    </span>
                                                </div>

                                                {/* video indicator badge */}
                                                {article.video_url && (
                                                    <div className="absolute top-3.5 right-3.5">
                                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-300 flex items-center gap-1 shadow-sm">
                                                            <Play className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                                                            <span>Video</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* text content padding */}
                                            <div className="p-6 sm:p-7 space-y-3">
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
                                                <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug line-clamp-2">
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
                                        <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                            <span className="font-mono text-[11px] text-neutral-500">
                                                MESF Editorial
                                            </span>
                                            <span className="font-bold text-neutral-300 group-hover:text-white transition-colors duration-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                                                <span>Read Story</span>
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* footer */}
            <Footer />
        </div>
    );
}
