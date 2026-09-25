// --1. imports--
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FileText,
    Plus,
    Search,
    Download,
    ExternalLink,
    Trash2,
    HardDrive,
    Tag,
    Clock
} from 'lucide-react';

// --2. main component--
export default function Documents({ documents = [] }) {
    // --3. actions--
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [selectedCategory, setSelectedCategory] = useState('ALL'); // state

    const categories = ['ALL', ...new Set(documents.map(d => d.category).filter(Boolean))]; // state

    const filteredDocuments = documents.filter((doc) => { // check
        const matchQuery = (doc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (doc.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (doc.version_ref || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
        return matchQuery && matchCategory;
    });

    const handleDelete = (id, title) => { // trigger
        if (confirm(`Are you sure you want to delete "${title}"?`)) { // check
            router.delete(route('admin.documents.destroy', id), { // save
                preserveScroll: true
            });
        }
    };

    // --4. UI--
    return (
        <AdminLayout title="Documents Management - MESF Admin">
            <Head title="Documents Management - Admin" />

            <div className="space-y-8 max-w-7xl">
                {/* header action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                            Internal Documents Archive
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Confidential and administrative federation documents (visible exclusively to administrators).
                        </p>
                    </div>

                    <Link
                        href={route('admin.documents.create')} // redirect
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-[0_4px_16px_rgba(251,191,36,0.25)] cursor-pointer"
                    >
                        <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                        <span>Upload New Document</span>
                    </Link>
                </div>

                {/* search & category filter */}
                <div className="p-4 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder="Search constitution, tournament rulebooks, sanction forms, revisions..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                        />
                    </div>

                    {categories.length > 2 && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)} // trigger
                                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                        selectedCategory === cat
                                            ? 'bg-amber-400 text-black font-bold'
                                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Documents Management Section */}
                {documents.length === 0 ? (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                <FileText className="w-8 h-8" />
                            </div>

                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    Documents Management Section
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                    Upload and maintain official federation constitution, sanction guidelines, and downloadable files.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={route('admin.documents.create')} // redirect
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-[0_4px_16px_rgba(251,191,36,0.25)] cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                                    <span>Upload New Document</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center text-slate-400">
                        No documents matched your search filter.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                        {filteredDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="group bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 hover:border-amber-400/40 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(doc.id, doc.title)} // trigger
                                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            title="Delete Document"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full inline-block mb-2">
                                            {doc.category}
                                        </span>
                                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                                            {doc.title}
                                        </h3>
                                        {doc.version_ref && (
                                            <p className="text-xs text-slate-400 mt-1 font-mono">
                                                Ref: {doc.version_ref}
                                            </p>
                                        )}
                                        {doc.description && (
                                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-sans">
                                                {doc.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                                        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                                        {doc.file_size || 'N/A'}
                                    </span>

                                    {doc.file_url ? (
                                        <a
                                            href={doc.file_url} // redirect
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-amber-400 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Download</span>
                                        </a>
                                    ) : doc.url_link ? (
                                        <a
                                            href={doc.url_link} // redirect
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-amber-400 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>Open Link</span>
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
