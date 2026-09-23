// --1. imports--
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';

// --2. main component--
export default function NewsArticle() {
    // --3. actions--
    const [scrollProgress, setScrollProgress] = useState(0); // state
    const [scrollY, setScrollY] = useState(0); // state

    // track scroll progress and parallax position
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setScrollY(currentScroll); // scroll
            if (totalHeight > 0) {
                setScrollProgress(Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100)); // state
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --4. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title="Headline Title - MESF" />

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
                className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-neutral-600 via-neutral-300 to-neutral-500 z-[60] transition-all duration-75 shadow-[0_0_8px_rgba(255,255,255,0.25)]"
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
            <section className="relative w-full h-screen flex flex-col justify-end overflow-hidden">
                <img
                    src="/images/news/featured.jpg"
                    alt="Article Cover"
                    onError={(e) => {
                        e.target.style.opacity = '0';
                    }}
                    className="absolute inset-0 w-full h-[115%] object-cover object-center will-change-transform opacity-70"
                    style={{
                        transform: `translateY(${scrollY * 0.2}px)`
                    }}
                />

                <div className="absolute inset-0 bg-[#070B14]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/75 to-transparent" />
                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 bg-amber-400/10 rounded-full blur-3xl" />

                {/* hero text */}
                <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pb-16 md:pb-20 text-left relative z-10">
                    <div className="max-w-3xl">
                        <div className="mb-6">
                            <BackButton href="/news" label="Back to News" />
                        </div>

                        <div className="mb-3">
                            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                                [ Category / Tag ]
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                            Headline Title
                        </h1>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 font-medium">
                            <span>Date</span>
                            <span>•</span>
                            <span>Location</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. 2-column editorial layout: article on left, latest feed on right */}
            <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 py-12 md:py-20 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
                    {/* left column: story narrative (8 of 12 columns) */}
                    <article className="lg:col-span-8 space-y-7 text-base sm:text-lg text-neutral-300/90 leading-relaxed font-normal">
                        <p className="text-xl sm:text-2xl text-neutral-100 font-normal leading-relaxed">
                            Introductory paragraph placeholder text outlining the primary announcement, event details, and official federation statement.
                        </p>

                        <p>
                            Detailed paragraph placeholder text elaborating on the program schedule, participating athletes, match outcomes, and operational highlights across national esports initiatives.
                        </p>

                        <blockquote className="my-8 pl-5 border-l-2 border-amber-400/80 bg-transparent">
                            <p className="text-lg sm:text-xl italic font-medium text-neutral-200 leading-normal">
                                &ldquo;Quote placeholder text representing official statements from federation leadership, tournament organizers, or team captains.&rdquo;
                            </p>
                        </blockquote>

                        <p>
                            Additional narrative placeholder text covering key milestones, community feedback, strategic objectives, and athlete development pathways under the federation's roadmap.
                        </p>

                        <div className="w-full aspect-[21/9] min-h-[260px] rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center my-8">
                            <span className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">Image</span>
                        </div>

                        <p>
                            Concluding remarks placeholder text providing closing acknowledgments, next steps, and upcoming tournament schedules for the season.
                        </p>

                        {/* share & tags */}
                        <div className="border-t border-white/10 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-start">
                                <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mr-1">
                                    Share
                                </span>
                                <button
                                    type="button"
                                    aria-label="Share on X"
                                    className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Share on Facebook"
                                    className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-400">#MESF</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-400">#TEAMMYS</span>
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
                            {[
                                { id: 1, tag: 'TOURNAMENTS', title: 'Title', date: 'Date', excerpt: 'Description' },
                                { id: 2, tag: 'NATIONAL CIRCUIT', title: 'Title', date: 'Date', excerpt: 'Description' },
                                { id: 3, tag: 'PARTNERSHIP', title: 'Title', date: 'Date', excerpt: 'Description' }
                            ].map((item) => (
                                <Link
                                    key={item.id}
                                    href="/news/article"
                                    className="group flex gap-3.5 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-400/30 transition-all duration-200"
                                >
                                    <div className="w-20 aspect-square rounded-lg bg-[#0A0F1D] border border-white/10 shrink-0 flex items-center justify-center">
                                        <span className="text-[9px] font-semibold text-neutral-600 uppercase">Image</span>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1">
                                            <span className="text-amber-400 font-bold">{item.tag}</span>
                                            <span>•</span>
                                            <span>{item.date}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>

            {/* 4. footer */}
            <Footer />
        </div>
    );
}
