// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import { Play } from 'lucide-react';

// --2. properties--
const DEFAULT_CATEGORIES = ['ALL', 'TOURNAMENTS', 'ACHIEVEMENTS', 'PARTNERSHIPS', 'ANNOUNCEMENTS'];

// --3. main component--
export default function News({
    articles = [],
    featuredArticle = null,
    categories = DEFAULT_CATEGORIES,
    activeCategory: initialCategory = 'ALL'
}) {
    // --4. actions--
    const [activeCategory, setActiveCategory] = useState(initialCategory); // state

    const filteredArticles = activeCategory === 'ALL'
        ? articles
        : articles.filter((article) => article.category === activeCategory); // convert

    // fallback featured article if none provided
    const displayHero = featuredArticle || (articles.length > 0 ? articles[0] : null); // state

    // --5. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
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
                className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="news" />
            </div>

            {/* page content wrapper */}
            <main className="relative z-20 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
                {/* 2. editorial hero (featured story) */}
                {displayHero ? (
                    <section className="relative h-[55vh] md:h-[65vh] min-h-[420px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group bg-[#0A0F1D]">
                        {/* image background if available */}
                        {displayHero.image ? (
                            <img
                                src={displayHero.image}
                                alt={displayHero.title}
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-[#070B14]/80 -z-10" />
                        )}

                        {/* subtle ambient glow */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-500" />
                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 bg-blue-500/10 rounded-full blur-3xl" />

                        {/* heavy bottom-to-top dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/85 to-transparent pointer-events-none" />

                        {/* hero story content */}
                        <div className="relative z-10 h-full w-full p-6 sm:p-10 md:p-14 flex flex-col justify-end text-left max-w-4xl">
                            {/* category tag & video badge */}
                            <div className="mb-3 flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-400 uppercase drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                                    {displayHero.tag || `[ ${displayHero.category} ]`}
                                </span>
                                {displayHero.video_url && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center gap-1 shadow-sm">
                                        <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                        <span>Video Included</span>
                                    </span>
                                )}
                            </div>

                            {/* massive headline */}
                            <h1 className="font-['Anton'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wide leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] mb-4">
                                {displayHero.title}
                            </h1>

                            {/* excerpt */}
                            {displayHero.excerpt && (
                                <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal mb-6 line-clamp-2">
                                    {displayHero.excerpt}
                                </p>
                            )}

                            {/* cta button */}
                            <div>
                                <Link
                                    href={displayHero.slug ? `/news/${displayHero.slug}` : '/news/article'}
                                    className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 rounded-full backdrop-blur-2xl bg-white/[0.08] hover:bg-white/[0.16] text-white font-bold text-xs sm:text-sm tracking-widest uppercase border border-white/20 hover:border-amber-400/60 shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                >
                                    READ FULL STORY
                                </Link>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="relative py-16 sm:py-24 px-6 sm:px-12 w-full rounded-3xl overflow-hidden border border-white/10 bg-[#0A0F1D]/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center space-y-4">
                        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 bg-amber-400/10 rounded-full blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 bg-blue-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                            <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-400 uppercase">
                                [ MESF NEWSROOM ]
                            </span>
                            <h1 className="font-['Anton'] text-3xl sm:text-5xl text-white uppercase tracking-wide">
                                LATEST NEWS & UPDATES
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                                Official press releases, tournament announcements, and federation updates will be posted here by the MESF editorial board.
                            </p>
                        </div>
                    </section>
                )}

                {/* 3. category filter bar */}
                <section className="w-full my-10 sm:my-14">
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)} // trigger
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer select-none ${
                                        isActive
                                            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105'
                                            : 'border border-white/10 backdrop-blur-md bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 4. editorial article grid */}
                <section className="w-full">
                    {filteredArticles.length === 0 ? (
                        <div className="py-16 text-center text-neutral-400 space-y-2">
                            <p className="text-lg font-bold text-white">No articles found in this category.</p>
                            <p className="text-sm">Check back soon for new updates and announcements.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={article.slug ? `/news/${article.slug}` : '/news/article'}
                                    className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden cursor-pointer hover:border-amber-400/30 hover:bg-white/[0.04] transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Unified Image Section (Edge-to-Edge at the top) */}
                                    <div className="aspect-video w-full overflow-hidden relative bg-[#0A0F1D] flex items-center justify-center border-b border-white/5">
                                        {article.image ? (
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                onError={(e) => {
                                                    e.target.style.opacity = '0';
                                                }}
                                                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-neutral-600 group-hover:text-neutral-500 transition-colors">
                                                <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                                <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-500">Image</span>
                                            </div>
                                        )}
                                        {/* Subtle gradient to blend into the card body */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                                        {/* Category tag inside image */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md border border-white/10 text-amber-400">
                                                {article.tag || `[ ${article.category} ]`}
                                            </span>
                                        </div>

                                        {/* Video badge if article has video */}
                                        {article.video_url && (
                                            <div className="absolute top-4 right-4">
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-black/75 backdrop-blur-md border border-amber-400/40 text-amber-300 flex items-center gap-1 shadow-lg">
                                                    <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                    <span>Video</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Unified Content Section (Inside the card with generous padding) */}
                                    <div className="p-5 sm:p-6 flex-1 flex flex-col text-left">
                                        {/* Meta row */}
                                        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 tracking-widest uppercase mb-3">
                                            <span>{article.date}</span>
                                            <span>{article.detail}</span>
                                        </div>

                                        {/* Headline */}
                                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors duration-200 mb-2 leading-snug">
                                            {article.title}
                                        </h3>

                                        {/* Description */}
                                        {article.excerpt && (
                                            <p className="text-sm text-neutral-400 leading-relaxed font-normal pb-1 line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* 5. footer */}
            <Footer />
        </div>
    );
}
