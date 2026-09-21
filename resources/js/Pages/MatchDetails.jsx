// --1. imports--
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

// --2. main component--
export default function MatchDetails() {
    // --3. UI--
    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden flex flex-col justify-between">
            <Head title="Match Details - MESF" />

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
            <PublicNavbar activeTab="matches" />

            {/* 2. main body container */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-24 flex-1">
                {/* back button */}
                <div className="mb-8">
                    <Link
                        href="/matches" // redirect
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-amber-400 transition-colors py-2 px-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 w-fit cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back</span>
                    </Link>
                </div>
            </main>

            {/* 3. footer */}
            <Footer />
        </div>
    );
}
