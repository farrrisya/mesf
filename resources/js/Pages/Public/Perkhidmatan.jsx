import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useMemo } from 'react';

const HARDCODED_CATEGORIES = [
    'Skim Pembiayaan',
    'Skim Kebajikan',
    'Skim Pelancongan',
    'Seminar',
    'AR-RAHNU X\'CHANGE',
    'Skim Pelaburan Dana Ar-Rahnu',
    'COOP MART',
    'KNSTP Smart Solutions'
];

const ALIRAN_PROSES_CATEGORY = 'Aliran Proses Pembiayaan dan Pengeluaran';
const ANUGERAH_CATEGORY = 'Anugerah Kecemerlangan Pendidikan Koperasi NSTP';

// --1. main component--
export default function Perkhidmatan({ auth, products = [] }) {
    // state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [expandedCategory, setExpandedCategory] = useState(null);

    // get unique categories for the dropdown filter
    const categories = useMemo(() => {
        const finalCats = ['Semua', ...HARDCODED_CATEGORIES];
        const existingCats = [...new Set(products.map(p => p.category))].filter(Boolean);

        existingCats.forEach(cat => {
            const exists = finalCats.some(hc => hc.toLowerCase() === cat.toLowerCase());
            if (!exists && !cat.toLowerCase().includes('anugerah') && !cat.toLowerCase().includes('aliran proses')) {
                finalCats.push(cat);
            }
        });

        // We add these specifically at the end of the filter
        finalCats.push(ALIRAN_PROSES_CATEGORY);
        finalCats.push(ANUGERAH_CATEGORY);

        return finalCats;
    }, [products]);

    // Determine which grid categories to show based on search/filter
    const categoriesToRender = useMemo(() => {
        let cats = [...HARDCODED_CATEGORIES];

        const existingCats = [...new Set(products.map(p => p.category))].filter(Boolean);
        existingCats.forEach(cat => {
            const exists = cats.some(hc => hc.toLowerCase() === cat.toLowerCase()) || cat.toLowerCase().includes('anugerah') || cat.toLowerCase().includes('aliran proses');
            if (!exists) cats.push(cat);
        });

        if (selectedCategory !== 'Semua' && selectedCategory !== ANUGERAH_CATEGORY && selectedCategory !== ALIRAN_PROSES_CATEGORY) {
            cats = cats.filter(c => c.toLowerCase() === selectedCategory.toLowerCase());
        } else if (selectedCategory === ANUGERAH_CATEGORY || selectedCategory === ALIRAN_PROSES_CATEGORY) {
            cats = []; // hide main grid if they selected one of the bottom sections
        }

        if (searchTerm) {
            cats = cats.filter(c => {
                // keep category if name matches, or if any product inside it matches
                const matchesName = c.toLowerCase().includes(searchTerm.toLowerCase());
                const hasMatchingProduct = products.some(p => p.category.toLowerCase() === c.toLowerCase() && p.title.toLowerCase().includes(searchTerm.toLowerCase()));
                return matchesName || hasMatchingProduct;
            });
        }

        return cats;
    }, [products, selectedCategory, searchTerm]);

    const anugerahItems = useMemo(() => {
        let items = products.filter(p => p.category.toLowerCase().includes('anugerah'));
        if (searchTerm) {
            items = items.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return items;
    }, [products, searchTerm]);

    const aliranProsesItems = useMemo(() => {
        let items = products.filter(p => p.category.toLowerCase().includes('aliran proses'));
        if (searchTerm) {
            items = items.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return items;
    }, [products, searchTerm]);

    // --2. helpers--
    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const getIconForTitle = (title) => {
        const t = title.toLowerCase();
        
        // 1. Skim Pembiayaan (Wallet)
        if (t.includes('pembiayaan') || t.includes('kredit')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12h.01M17 12h.01M12 12h.01" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            );
        }

        // 2. Skim Kebajikan / Zakat / Cukai (Heart)
        if (t.includes('kebajikan') || t.includes('zakat') || t.includes('cukai')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20.5l-1.45-1.32C5.4 14.25 2 11.28 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.78-3.4 6.75-8.55 11.68L12 20.5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }

        // 3. Skim Pelancongan / Umrah / Haji (Globe/Travel)
        if (t.includes('pelancongan') || t.includes('umrah') || t.includes('haji')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
                </svg>
            );
        }

        // 4. Seminar (Presentation Board)
        if (t.includes('seminar')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="5" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 21L12 17L16 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 10H17M7 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }

        // 5. AR-RAHNU X'CHANGE (Diamond/Jewel)
        if (t.includes('x\'change') || (t.includes('ar-rahnu') && !t.includes('pelaburan'))) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 5H18L22 10L12 21L2 10L6 5Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 10H22M12 21V10M6 5L10 10M18 5L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }

        // 6. Skim Pelaburan Dana Ar-Rahnu (Chart Trending Up)
        if (t.includes('pelaburan') || t.includes('dana')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="5" y="14" width="4" height="7" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="11" y="9" width="4" height="12" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 13L9 7L13 11L19 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }

        // 7. COOP MART (Store/Cart)
        if (t.includes('mart')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }

        // 8. KNSTP Smart Solutions (Lightbulb)
        if (t.includes('smart') || t.includes('solutions') || t.includes('knstp')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21h6M10.5 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3a6 6 0 00-6 6c0 2 1.5 3.5 2 5h8c.5-1.5 2-3 2-5a6 6 0 00-6-6z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }

        // 9. Aliran Proses (Flowchart)
        if (t.includes('aliran proses')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="3" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="15" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="15" y="15" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0H6v3m6-3h6v3" />
                </svg>
            );
        }

        // 10. Anugerah / Pendidikan (Graduation Cap)
        if (t.includes('anugerah') || t.includes('pendidikan')) {
            return (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L3 9L12 14L21 9L12 4Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 10.5V15.5C5 17.5 8 19 12 19C16 19 19 17.5 19 15.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 9V15M21 15C21 16.1046 20.1046 17 19 17C17.8954 17 17 16.1046 17 15C17 13.8954 17.8954 13 19 13C20.1046 13 21 13.8954 21 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        }

        // Default
        return (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
            </svg>
        );
    };

    const getCategoryStyle = (title) => {
        const t = title.toLowerCase();
        if (t.includes('kebajikan') || t.includes('zakat') || t.includes('cukai')) return { text: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-100', shadow: 'hover:shadow-emerald-500/20' };
        if (t.includes('ar-rahnu')) return { text: 'text-amber-600', bg: 'bg-amber-50', hover: 'group-hover:bg-amber-100', shadow: 'hover:shadow-amber-500/20' };
        if (t.includes('pelancongan') || t.includes('haji') || t.includes('umrah')) return { text: 'text-cyan-600', bg: 'bg-cyan-50', hover: 'group-hover:bg-cyan-100', shadow: 'hover:shadow-cyan-500/20' };
        if (t.includes('mart')) return { text: 'text-rose-600', bg: 'bg-rose-50', hover: 'group-hover:bg-rose-100', shadow: 'hover:shadow-rose-500/20' };
        if (t.includes('pembiayaan')) return { text: 'text-blue-600', bg: 'bg-blue-50', hover: 'group-hover:bg-blue-100', shadow: 'hover:shadow-blue-500/20' };
        if (t.includes('seminar') || t.includes('pendidikan')) return { text: 'text-purple-600', bg: 'bg-purple-50', hover: 'group-hover:bg-purple-100', shadow: 'hover:shadow-purple-500/20' };
        return { text: 'text-[#0055a5]', bg: 'bg-[#f0f6fc]', hover: 'group-hover:bg-[#e1effa]', shadow: 'hover:shadow-blue-500/20' };
    };

    // --3. UI--
    return (
        <PublicLayout auth={auth}>
            <Head title="Perkhidmatan - MESF" />

            {/* Soft icy blue background for the entire page body */}
            <div className="bg-[#f4f7fb] min-h-screen pb-24">

                {/* Header section */}
                <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a192f] to-[#0a192f] pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-widest drop-shadow-lg mb-4">
                            PERKHIDMATAN
                        </h1>
                        <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            Terokai pelbagai produk dan perkhidmatan eksklusif yang ditawarkan oleh Koperasi Media Prima Berhad.
                        </p>
                    </div>
                </div>

                <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-8 pb-16">

                    {/* Left-aligned Search Bar */}
                    <div className="mb-8 max-w-lg">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari perkhidmatan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // input
                                className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]/10 focus:border-[#0a192f] transition-all"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-500 transition-colors" /* trigger */>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                        {categoriesToRender.map((category) => {
                            const items = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
                            const hasItems = items.length > 0;
                            const isExpanded = expandedCategory === category;
                            const isPembiayaan = category.toLowerCase() === 'skim pembiayaan';
                            const subcategories = isPembiayaan ? [...new Set(items.map(i => i.sub_category))].filter(Boolean) : [];

                            const style = getCategoryStyle(category);

                            return (
                                <div key={category} className="flex flex-col w-full h-full">
                                    <div
                                        onClick={() => {
                                            if (!hasItems) return;
                                            toggleCategory(category);
                                        }} // toggle
                                        className={`flex items-center gap-4 sm:gap-5 bg-white p-5 sm:p-7 shadow-xs transition-all duration-300 border cursor-pointer group w-full ${isExpanded ? `rounded-t-2xl border-slate-300/80 border-b-transparent ring-2 ring-[#0a192f]/10 ${style.shadow}` : `rounded-2xl border-slate-200/90 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${style.shadow}`}`}
                                    >
                                        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 ${style.bg} ${style.text} ${style.hover} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-xs`}>
                                            {getIconForTitle(category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-black ${isExpanded ? 'text-[#0a192f]' : 'text-slate-800 group-hover:text-[#0a192f]'} text-base sm:text-lg transition-colors leading-snug`}>
                                                {category}
                                            </div>
                                            <div className="text-sm font-medium text-slate-400 mt-1 transition-colors group-hover:text-slate-500">
                                                {items.length} Perkhidmatan
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 text-slate-400">
                                            {hasItems && (
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-slate-100 text-[#0055a5]' : 'group-hover:bg-slate-50 group-hover:text-slate-700'}`}>
                                                    <svg className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Accordion Content */}
                                    {hasItems && (
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-slate-50/70 border-x border-b border-slate-200/90 rounded-b-2xl ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 border-transparent'}`}>
                                            <div className="p-4 md:p-6 grid grid-cols-1 gap-3">
                                                {/* For Skim Pembiayaan: Render subcategories leading to the subcategory view OR direct link if only 1 product */}
                                                {isPembiayaan && subcategories.map((sub) => {
                                                    const subProducts = items.filter(i => i.sub_category === sub);
                                                    const targetRoute = subProducts.length === 1
                                                        ? route('public.produk.show', subProducts[0].id)
                                                        : route('perkhidmatan.pembiayaan', sub);

                                                    return (
                                                        <Link
                                                            key={sub}
                                                            href={targetRoute}
                                                            className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group" /* redirect */
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </div>
                                                                <span className="font-semibold text-sm text-slate-800 group-hover:text-[#0055a5] transition-colors">{sub}</span>
                                                            </div>
                                                            <div className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-[#0055a5] py-1 px-3 rounded-full bg-blue-50/80 group-hover:bg-blue-100/80 transition-colors">
                                                                <span>Lihat Senarai</span>
                                                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}

                                                {/* For all other items or items without subcategories: Render direct links to the product */}
                                                {items.map((doc) => (
                                                    (!isPembiayaan) && (
                                                        <Link
                                                            key={doc.id}
                                                            href={route('public.produk.show', doc.id)}
                                                            className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group" /* redirect */
                                                        >
                                                            <div className="flex flex-col min-w-0 pr-2">
                                                                <span className="font-bold text-slate-800 group-hover:text-[#0055a5] transition-colors leading-snug">{doc.title}</span>
                                                                <span className="text-xs text-slate-500 mt-1 line-clamp-1">{doc.description ? doc.description.replace(/(<([^>]+)>)/gi, "") : "Sila klik untuk maklumat lanjut."}</span>
                                                            </div>
                                                            <div className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-[#0055a5] py-1.5 px-3 rounded-full bg-blue-50/80 group-hover:bg-blue-100/80 transition-colors">
                                                                <span>Ketahui Lanjut</span>
                                                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </Link>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Aliran Proses & Program Khas Section (Equal heights & unified 2-column layout) */}
                    {((!searchTerm || aliranProsesItems.length > 0 || anugerahItems.length > 0)) && (
                        <div className="mt-14 pt-10 border-t border-slate-200/80">
                            <div className="mb-6">
                                <h2 className="text-lg md:text-xl font-black text-[#0a192f] tracking-wide uppercase">
                                    Proses & Program Khas
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 items-start">
                                {/* Aliran Proses */}
                                {(!searchTerm || aliranProsesItems.length > 0) && (
                                    <div className="flex flex-col w-full h-full">
                                        <div
                                            onClick={() => {
                                                if (aliranProsesItems.length === 0) return;
                                                toggleCategory(ALIRAN_PROSES_CATEGORY);
                                            }} // toggle
                                            className={`flex items-center gap-4 sm:gap-5 bg-white p-5 sm:p-7 min-h-[120px] sm:min-h-[130px] shadow-xs transition-all duration-300 border cursor-pointer group w-full ${expandedCategory === ALIRAN_PROSES_CATEGORY ? 'rounded-t-2xl border-slate-300/80 border-b-transparent ring-2 ring-blue-500/10' : 'rounded-2xl border-slate-200/90 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'}`}
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[#f0f6fc] text-[#0055a5] group-hover:bg-[#e1effa] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-xs">
                                                {getIconForTitle(ALIRAN_PROSES_CATEGORY)}
                                            </div>
                                            <div className="flex-1 min-w-0 min-h-[56px] flex flex-col justify-center">
                                                <div className={`font-black ${expandedCategory === ALIRAN_PROSES_CATEGORY ? 'text-[#0a192f]' : 'text-slate-800 group-hover:text-[#0a192f]'} text-base sm:text-lg transition-colors leading-snug`}>
                                                    {ALIRAN_PROSES_CATEGORY}
                                                </div>
                                                <div className="text-sm font-medium text-slate-400 mt-1 transition-colors group-hover:text-slate-500">
                                                    {aliranProsesItems.length} Perkhidmatan
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-slate-400">
                                                {aliranProsesItems.length > 0 && (
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${expandedCategory === ALIRAN_PROSES_CATEGORY ? 'bg-slate-100 text-[#0055a5]' : 'group-hover:bg-slate-50 group-hover:text-slate-700'}`}>
                                                        <svg className={`w-4 h-4 transform transition-transform duration-300 ${expandedCategory === ALIRAN_PROSES_CATEGORY ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {aliranProsesItems.length > 0 && (
                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-slate-50/70 border-x border-b border-slate-200/90 rounded-b-2xl ${expandedCategory === ALIRAN_PROSES_CATEGORY ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 border-transparent'}`}>
                                                <div className="p-4 md:p-6 grid grid-cols-1 gap-3">
                                                    {aliranProsesItems.map((doc) => (
                                                        <Link
                                                            key={doc.id}
                                                            href={route('public.produk.show', doc.id)}
                                                            className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group" /* redirect */
                                                        >
                                                            <div className="flex flex-col min-w-0 pr-2">
                                                                <span className="font-bold text-slate-800 group-hover:text-[#0055a5] transition-colors leading-snug">{doc.title}</span>
                                                                <span className="text-xs text-slate-500 mt-1 line-clamp-1">{doc.description ? doc.description.replace(/(<([^>]+)>)/gi, "") : "Lihat maklumat proses."}</span>
                                                            </div>
                                                            <div className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-[#0055a5] py-1.5 px-3 rounded-full bg-blue-50/80 group-hover:bg-blue-100/80 transition-colors">
                                                                <span>Ketahui Lanjut</span>
                                                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Anugerah / Programs */}
                                {(!searchTerm || anugerahItems.length > 0) && (
                                    <div className="flex flex-col w-full h-full">
                                        <div
                                            onClick={() => {
                                                if (anugerahItems.length === 0) return;
                                                toggleCategory(ANUGERAH_CATEGORY);
                                            }} // toggle
                                            className={`flex items-center gap-4 sm:gap-5 bg-white p-5 sm:p-7 min-h-[120px] sm:min-h-[130px] shadow-xs transition-all duration-300 border cursor-pointer group w-full ${expandedCategory === ANUGERAH_CATEGORY ? 'rounded-t-2xl border-slate-300/80 border-b-transparent ring-2 ring-yellow-500/20' : 'rounded-2xl border-slate-200/90 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'}`}
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 text-amber-600 group-hover:bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-xs">
                                                {getIconForTitle(ANUGERAH_CATEGORY)}
                                            </div>
                                            <div className="flex-1 min-w-0 min-h-[56px] flex flex-col justify-center">
                                                <div className={`font-black ${expandedCategory === ANUGERAH_CATEGORY ? 'text-[#0a192f]' : 'text-slate-800 group-hover:text-[#0a192f]'} text-base sm:text-lg transition-colors leading-snug`}>
                                                    {ANUGERAH_CATEGORY}
                                                </div>
                                                <div className="text-sm font-medium text-slate-400 mt-1 transition-colors group-hover:text-slate-500">
                                                    {anugerahItems.length} Program
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-slate-400">
                                                {anugerahItems.length > 0 && (
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${expandedCategory === ANUGERAH_CATEGORY ? 'bg-slate-100 text-amber-600' : 'group-hover:bg-slate-50 group-hover:text-slate-700'}`}>
                                                        <svg className={`w-4 h-4 transform transition-transform duration-300 ${expandedCategory === ANUGERAH_CATEGORY ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {anugerahItems.length > 0 && (
                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-slate-50/70 border-x border-b border-slate-200/90 rounded-b-2xl ${expandedCategory === ANUGERAH_CATEGORY ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 border-transparent'}`}>
                                                <div className="p-4 md:p-6 grid grid-cols-1 gap-3">
                                                    {anugerahItems.map((doc) => (
                                                        <Link
                                                            key={doc.id}
                                                            href={route('public.produk.show', doc.id)}
                                                            className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-yellow-300 transition-all group" /* redirect */
                                                        >
                                                            <div className="flex flex-col min-w-0 pr-2">
                                                                <span className="font-bold text-slate-800 group-hover:text-[#0a192f] transition-colors leading-snug">{doc.title}</span>
                                                                <span className="text-xs text-slate-500 mt-1 line-clamp-1">{doc.description ? doc.description.replace(/(<([^>]+)>)/gi, "") : "Lihat senarai penerima anugerah."}</span>
                                                            </div>
                                                            <div className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 group-hover:text-amber-700 py-1.5 px-3 rounded-full bg-amber-50/80 group-hover:bg-amber-100/80 transition-colors">
                                                                <span>Ketahui Lanjut</span>
                                                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bottom Corporate Inquiry Card */}
                    <div className="mt-16 bg-gradient-to-br from-[#0a192f] to-[#112a4f] rounded-2xl p-7 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
                        <div className="space-y-1.5 text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-black tracking-tight">Perlukan Bantuan atau Pertanyaan Lanjut?</h3>
                            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">Pegawai perkhidmatan MESF sedia membantu menjawab sebarang pertanyaan mengenai kemudahan dan perkhidmatan kami.</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Link href={route('faq')} className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all" /* redirect */>
                                Soalan Lazim
                            </Link>
                            <Link href={route('hubungi-kami')} className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0a192f] text-xs font-black uppercase tracking-wider transition-all shadow-md" /* redirect */>
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>

                    {/* Empty State Fallback */}
                    {categoriesToRender.length === 0 && anugerahItems.length === 0 && aliranProsesItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden max-w-3xl mx-auto mt-8">
                            <div className="relative w-32 h-32 mb-6">
                                {/* Premium Folder Back */}
                                <svg className="absolute inset-0 w-full h-full text-slate-200 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                {/* Magnifying Glass */}
                                <svg className="absolute bottom-1 -right-2 w-14 h-14 text-slate-400 drop-shadow-md bg-white rounded-full p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {/* Small Sparkles */}
                                <svg className="absolute top-2 right-4 w-6 h-6 text-slate-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-widest drop-shadow-sm relative z-10">Tiada Maklumat Ditemui</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed relative z-10">
                                Kami tidak menemui sebarang perkhidmatan yang sepadan dengan carian <strong>"{searchTerm}"</strong>. Sila cuba kata kunci lain.
                            </p>
                            
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-2.5 bg-[#0a192f] hover:bg-[#112240] text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg relative z-10 transform hover:-translate-y-0.5"
                            >
                                Kosongkan Carian
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </PublicLayout>
    );
}
