// --1. imports--
import React from 'react';
import { router } from '@inertiajs/react';

// --2. main component--
export default function BackButton({ href = '/', label = 'Back', className = '' }) {
    // --3. actions--
    const handleClick = (e) => { // trigger
        e.preventDefault();
        // Go back to the exact previous page and scroll position in browser history
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
        } else {
            router.visit(href, { preserveScroll: true }); // fallback redirect
        }
    };

    // --4. UI--
    return (
        <button
            type="button"
            onClick={handleClick} // trigger
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer group ${className}`}
        >
            <svg
                className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back</span>
        </button>
    );
}
