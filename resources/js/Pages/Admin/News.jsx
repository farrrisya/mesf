// --1. imports--
import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Newspaper,
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Star,
    CheckCircle2,
    Calendar,
    MapPin,
    Eye,
    X,
    AlertCircle,
    Flame,
    Video
} from 'lucide-react';

// --2. properties--
const DEFAULT_CATEGORIES = [
    'TOURNAMENTS',
    'ACHIEVEMENTS',
    'PARTNERSHIPS',
    'ANNOUNCEMENTS'
];

// --3. main component--
export default function News({ articles = [], categories = DEFAULT_CATEGORIES, filters = {} }) {
    const { flash = {} } = usePage().props; // properties

    // filter states
    const [searchQuery, setSearchQuery] = useState(filters.search || ''); // state
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'ALL'); // state
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'ALL'); // state
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, article: null }); // state

    // --4. actions--
    const handleToggleStatus = (article) => { // trigger
        router.patch(route('admin.news.toggle-status', article.id), {}, { preserveScroll: true }); // redirect
    };

    const handleToggleFeatured = (article) => { // trigger
        router.patch(route('admin.news.toggle-featured', article.id), {}, { preserveScroll: true }); // redirect
    };

    const confirmDelete = (article) => { // trigger
        setDeleteModalState({ isOpen: true, article }); // state
    };

    const handleDelete = () => { // trigger
        if (!deleteModalState.article) return; // check
        router.delete(route('admin.news.destroy', deleteModalState.article.id), { // redirect
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalState({ isOpen: false, article: null }); // state
            }
        });
    };

    // client side filtering for rapid response
    const filteredArticles = articles.filter((item) => { // convert
        const matchesSearch = searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase())); // check

        const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory; // check
        const matchesStatus = selectedStatus === 'ALL' || (selectedStatus === 'featured' ? Boolean(item.is_featured) : item.status === selectedStatus); // check

        return matchesSearch && matchesCategory && matchesStatus; // check
    });

    // --5. UI--
    return (
        <AdminLayout title="News Management - MESF Admin">
            <Head title="News Management - Admin" />

            <div className="space-y-6 max-w-7xl">
                {/* flash messages */}
                {flash?.success && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-sm shadow-lg animate-fadeIn">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-rose-300 text-sm shadow-lg animate-fadeIn">
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* search & action bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.65)] space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* search input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                id="news-search-input"
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder="Search articles by title, excerpt, location, tag..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')} // trigger
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* action controls */}
                        <div className="flex items-center gap-3">
                            {/* status selector */}
                            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                                {[
                                    { key: 'ALL', label: 'All' },
                                    { key: 'published', label: 'Published' },
                                    { key: 'draft', label: 'Draft' },
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => setSelectedStatus(item.key)} // trigger
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                            selectedStatus === item.key
                                                ? 'bg-amber-400 text-black shadow-md'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* create new article button (navigates to dedicated page) */}
                            <Link
                                id="create-news-btn"
                                href={route('admin.news.create')} // redirect
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create Article</span>
                            </Link>
                        </div>
                    </div>

                    {/* category filter tabs */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('ALL')} // trigger
                            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                                selectedCategory === 'ALL'
                                    ? 'bg-white/20 text-white border border-white/30 shadow'
                                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)} // trigger
                                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                                        : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* articles card list */}
                {filteredArticles.length === 0 ? (
                    <div className="bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] border border-white/15 rounded-2xl p-8 sm:p-10 shadow-xl text-center space-y-4">
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                            <Newspaper className="w-7 h-7" />
                        </div>
                        <div className="space-y-1 max-w-md mx-auto">
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">No News Articles Found</h3>
                            <p className="text-xs sm:text-sm text-slate-400">
                                {searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL'
                                    ? 'Try adjusting your search filters to find what you are looking for.'
                                    : 'Start by creating your first official news story or tournament announcement.'}
                            </p>
                        </div>
                        <div className="pt-1">
                            <Link
                                href={route('admin.news.create')} // redirect
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all cursor-pointer shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create First News Article</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredArticles.map((article) => {
                            const isPublished = article.status === 'published';
                            const isFeatured = Boolean(article.is_featured);

                            return (
                                <div
                                    key={article.id}
                                    className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                                        isFeatured
                                            ? 'bg-gradient-to-br from-[#121c33] via-[#0f172a] to-[#0a1020] border-amber-400/40 shadow-[0_14px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(251,191,36,0.12)] ring-1 ring-amber-400/25'
                                            : 'bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] border-white/15 hover:border-white/35 hover:bg-[#121b30] shadow-[0_14px_32px_rgba(0,0,0,0.65)]'
                                    }`}
                                >
                                    {/* top edge luminous highlight beam */}
                                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-amber-400/40 opacity-70" />

                                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-5">
                                        {/* thumbnail image (NO HOVER ZOOM) */}
                                        <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-black/70 border border-white/20 shrink-0 flex items-center justify-center shadow-inner">
                                            {article.image_path ? (
                                                <img
                                                    src={article.image_path}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-colors"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                                                    <Newspaper className="w-6 h-6 text-slate-400" />
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">No Image</span>
                                                </div>
                                            )}

                                            {/* featured hero badge indicator */}
                                            {isFeatured && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider shadow-lg">
                                                    <Flame className="w-3.5 h-3.5 fill-black" />
                                                    <span>Hero Story</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* main text & metadata */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 text-amber-300">
                                                    {article.tag || `[ ${article.category} ]`}
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold text-slate-300 bg-white/10 border border-white/10">
                                                    {article.category}
                                                </span>
                                                {article.video_url && (
                                                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/40">
                                                        <Video className="w-3 h-3 text-amber-400" />
                                                        <span>Video</span>
                                                    </span>
                                                )}
                                                {article.location && (
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                                                        <MapPin className="w-3 h-3 text-amber-400" />
                                                        <span>{article.location}</span>
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                                                {article.title}
                                            </h4>

                                            {article.excerpt && (
                                                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-normal">
                                                    {article.excerpt}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                                                <span className="flex items-center gap-1 text-slate-300">
                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                    <span>{article.published_at_formatted || article.created_at}</span>
                                                </span>
                                                <span>•</span>
                                                <span>By <strong className="text-slate-200">{article.author}</strong></span>
                                                {article.views_count > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1 text-slate-300">
                                                            <Eye className="w-3 h-3 text-slate-400" />
                                                            <span>{article.views_count} views</span>
                                                        </span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span className="font-mono text-slate-400 text-[10px]">/{article.slug}</span>
                                            </div>
                                        </div>

                                        {/* right action controls */}
                                        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0 shrink-0">
                                            {/* status toggle pill */}
                                            <button
                                                type="button"
                                                title={`Click to switch to ${isPublished ? 'draft' : 'published'}`}
                                                onClick={() => handleToggleStatus(article)} // trigger
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                                    isPublished
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'}`} />
                                                <span className="capitalize">{article.status}</span>
                                            </button>

                                            {/* hero featured star button */}
                                            <button
                                                type="button"
                                                title={isFeatured ? 'Featured as Hero Story. Click to unfeature.' : 'Click to make this the main Hero Story.'}
                                                onClick={() => handleToggleFeatured(article)} // trigger
                                                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                                    isFeatured
                                                        ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.45)]'
                                                        : 'bg-white/10 text-slate-300 border-white/15 hover:text-amber-400 hover:border-amber-400/40 hover:bg-white/15'
                                                }`}
                                            >
                                                <Star className={`w-4 h-4 ${isFeatured ? 'fill-black' : ''}`} />
                                            </button>

                                            {/* view live public button */}
                                            <a
                                                href={`/news/${article.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="View article on public website"
                                                className="p-2.5 rounded-xl bg-white/10 text-slate-300 border border-white/15 hover:text-white hover:border-white/30 hover:bg-white/20 transition-all cursor-pointer"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>

                                            {/* edit button (navigates to dedicated edit page) */}
                                            <Link
                                                href={route('admin.news.edit', article.id)} // redirect
                                                title="Edit article"
                                                className="p-2.5 rounded-xl bg-white/10 text-slate-200 border border-white/15 hover:text-amber-300 hover:border-amber-400/40 hover:bg-amber-400/10 transition-all cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>

                                            {/* delete button */}
                                            <button
                                                type="button"
                                                title="Delete article"
                                                onClick={() => confirmDelete(article)} // trigger
                                                className="p-2.5 rounded-xl bg-white/10 text-slate-300 border border-white/15 hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* delete confirmation modal */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-md bg-[#0B0F1C] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Delete News Article?</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Are you sure you want to delete <span className="text-white font-semibold">"{deleteModalState.article?.title}"</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModalState({ isOpen: false, article: null })} // trigger
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete} // trigger
                                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-500/20"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
