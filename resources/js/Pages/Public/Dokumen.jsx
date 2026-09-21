import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useMemo } from 'react';

// --1. helpers--
const getFileStyle = (ext) => {
    switch (ext?.toLowerCase()) {
        case 'pdf':
            return {
                color: 'text-red-600',
                bg: 'bg-red-50',
                border: 'border-red-200',
                badge: 'bg-red-100 text-red-700 border-red-200',
                hoverBorder: 'hover:border-red-300',
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                )
            };
        case 'doc':
        case 'docx':
            return {
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                badge: 'bg-blue-100 text-blue-700 border-blue-200',
                hoverBorder: 'hover:border-blue-300',
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )
            };
        case 'xls':
        case 'xlsx':
            return {
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                hoverBorder: 'hover:border-emerald-300',
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )
            };
        case 'url':
            return {
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
                border: 'border-indigo-200',
                badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                hoverBorder: 'hover:border-indigo-300',
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                )
            };
        default:
            return {
                color: 'text-slate-600',
                bg: 'bg-slate-50',
                border: 'border-slate-200',
                badge: 'bg-slate-100 text-slate-700 border-slate-200',
                hoverBorder: 'hover:border-slate-300',
                icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                )
            };
    }
};

const HighlightedText = ({ text, highlight }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
                ) : (
                    part
                )
            )}
        </span>
    );
};

const getCategoryIcon = (category) => {
    const t = category.toLowerCase();
    if (t.includes('borang')) return (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    if (t.includes('jadual')) return (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    if (t.includes('polisi') || t.includes('laporan')) return (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    return (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
    );
};

// --2. main component--
export default function Dokumen({ auth, documents = [] }) {
    // state
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategory, setExpandedCategory] = useState(null);

    // convert & filter documents
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        }).map(doc => {
            let filePath = "#";
            if (doc.media_type === 'file' || doc.media_type === 'media') {
                const baseUrl = route('home').replace(/\/$/, '');
                filePath = doc.file_path ? `${baseUrl}/storage/${doc.file_path}` : "#";
            } else if (doc.media_type === 'url') {
                filePath = doc.url_link || "#";
            }

            const fileExt = doc.file_path ? doc.file_path.split('.').pop().toUpperCase() : "PDF";

            return {
                ...doc,
                file_ext: fileExt,
                download_path: filePath
            };
        });
    }, [documents, searchTerm]);

    const categoriesToRender = useMemo(() => {
        const cats = [...new Set(filteredDocuments.map(p => p.category))].filter(Boolean);
        const normalCats = cats.filter(c => !c.toLowerCase().includes('jadual')).sort();
        const jadualCats = cats.filter(c => c.toLowerCase().includes('jadual')).sort();
        return [...normalCats, ...jadualCats];
    }, [filteredDocuments]);

    // group by category for display
    const groupedDocuments = useMemo(() => {
        const groups = {};
        filteredDocuments.forEach(doc => {
            if (!groups[doc.category]) groups[doc.category] = [];
            groups[doc.category].push(doc);
        });
        return groups;
    }, [filteredDocuments]);

    const handleDownload = (e, file_path, title) => { // trigger
        if (file_path === '#') { // check
            e.preventDefault();
            alert(`Sistem Simulasi: Memulakan pautan/fail "${title}"... (Fail fizikal tidak ditemui di pelayan)`);
        }
    };

    const toggleCategory = (category) => {
        setExpandedCategory(prev => prev === category ? null : category);
    };

    const renderTableRow = (doc) => {
        const style = getFileStyle(doc.file_ext);
        return (
            <tr key={doc.id} className="hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-none">
                <td className="p-4 pl-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${style.bg} ${style.color} ${style.border}`}>
                            {style.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm md:text-base group-hover:text-[#0a192f] transition-colors leading-snug">
                                <HighlightedText text={doc.title} highlight={searchTerm} />
                            </span>
                            <span className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{doc.file_ext}</span>
                        </div>
                    </div>
                </td>
                <td className="p-4 text-right pr-6 w-24 align-middle">
                    <a
                        href={doc.download_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleDownload(e, doc.download_path, doc.title)}
                        className={`inline-flex items-center justify-center p-3 rounded-xl bg-white border border-slate-200 text-slate-400 shadow-sm hover:${style.bg} hover:${style.color} hover:${style.hoverBorder} transition-all duration-300 transform hover:scale-110`}
                        title="Buka Dokumen"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </td>
            </tr>
        );
    };

    // --2. UI--
    return (
        <PublicLayout auth={auth}>
            <Head title="Dokumen & Muat Turun - MESF" />

            <div className="bg-[#f4f7fb] min-h-screen pb-24">
                {/* Header section */}
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        opacity: 0;
                    }
                `}</style>
                <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a192f] to-[#0a192f] pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-widest drop-shadow-lg mb-4">
                            DOKUMEN
                        </h1>
                        <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            Pusat muat turun dokumen, borang, jadual bayaran balik, dan rujukan koperasi.
                        </p>
                    </div>
                </div>

                <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-10 pb-12">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari dokumen..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0a192f]/20 focus:border-[#0a192f] transition-all placeholder-slate-400 text-slate-700 font-medium shadow-sm"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-rose-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Main Accordions */}
                    {categoriesToRender.length > 0 ? (
                        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
                            {categoriesToRender.map((category, index) => {
                                    const items = groupedDocuments[category] || [];
                                    const isExpanded = expandedCategory === category || searchTerm.trim().length > 0;

                                    let contentToRender;
                                    if (category === 'Borang-borang') {
                                        // Group by sub_category
                                        const subGroups = {};
                                        items.forEach(doc => {
                                            const sub = doc.sub_category || 'Lain-lain';
                                            if (!subGroups[sub]) subGroups[sub] = [];
                                            subGroups[sub].push(doc);
                                        });

                                        contentToRender = Object.keys(subGroups).sort().map(sub => (
                                            <div key={sub} className="mb-8 last:mb-0">
                                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                    </svg>
                                                    {sub}
                                                </h4>
                                                <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
                                                    <table className="w-full text-left border-collapse">
                                                        <tbody className="divide-y divide-slate-100">
                                                            {subGroups[sub].map(doc => renderTableRow(doc))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ));
                                    } else {
                                        contentToRender = (
                                            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
                                                <table className="w-full text-left border-collapse">
                                                    <tbody className="divide-y divide-slate-100">
                                                        {items.map(doc => renderTableRow(doc))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div 
                                            id={`accordion-${category}`}
                                            key={category} 
                                            className="flex flex-col w-full h-full animate-fade-in-up scroll-mt-24"
                                            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                                        >
                                        <div
                                            onClick={() => toggleCategory(category)}
                                            className={`flex items-center gap-5 bg-gradient-to-r from-[#0a192f] via-[#112240] to-[#0a192f] bg-[length:200%_100%] p-6 md:p-8 shadow-lg transition-all duration-500 border-none cursor-pointer group w-full hover:bg-[100%_0] ${isExpanded ? 'rounded-t-2xl ring-2 ring-[#0a192f]/20' : 'rounded-2xl hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#0a192f]/20'}`}
                                        >
                                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner border border-white/10 group-hover:bg-white/20">
                                                {getCategoryIcon(category)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-black text-white text-lg md:text-2xl transition-colors leading-snug drop-shadow-md">
                                                    {category}
                                                </div>
                                                <div className="text-sm font-medium text-slate-400 mt-1 transition-colors group-hover:text-slate-300">
                                                    {items.length} Dokumen
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-white/30">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-white/20 text-white' : 'group-hover:bg-white/10 group-hover:text-white'}`}>
                                                    <svg className={`w-5 h-5 transform transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`grid transition-all duration-500 ease-in-out bg-slate-50 border-x border-b shadow-md rounded-b-2xl ${isExpanded ? 'grid-rows-[1fr] border-slate-200 opacity-100' : 'grid-rows-[0fr] border-transparent opacity-0'}`}>
                                            <div className="overflow-hidden">
                                                <div className="p-4 md:p-6 lg:p-8">
                                                    {contentToRender}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                ) : (
                    <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
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
                        <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-widest drop-shadow-sm">Tiada Dokumen Ditemui</h3>
                        <p className="text-slate-500 max-w-sm text-sm leading-relaxed mx-auto font-medium">
                            Kami tidak dapat menjumpai dokumen yang sepadan dengan carian anda. Sila cuba kata kunci atau kategori lain.
                        </p>
                    </div>
                )}
                </main>
            </div>
        </PublicLayout>
    );
}
