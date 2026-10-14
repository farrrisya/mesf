// --1. imports--
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Image as ImageIcon,
    Plus,
    Search,
    UploadCloud,
    Trash2,
    Copy,
    Check,
    Eye,
    X,
    FileText,
    CheckSquare
} from 'lucide-react';

// --2. main component--
export default function Library({ mediaList = [] }) {
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [previewItem, setPreviewItem] = useState(null); // state
    const [deleteItem, setDeleteItem] = useState(null); // state
    const [copiedId, setCopiedId] = useState(null); // state
    const [isSelectMode, setIsSelectMode] = useState(false); // state
    const [selectedIds, setSelectedIds] = useState([]); // state
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false); // state
    const [bulkDeleting, setBulkDeleting] = useState(false); // state

    // --3. actions--
    const filteredMedia = mediaList.filter((item) => { // check
        return item.file_name.toLowerCase().includes(searchQuery.toLowerCase()); // check
    });

    const toggleSelectMode = () => { // trigger
        setIsSelectMode((prev) => {
            if (prev) setSelectedIds([]); // state
            return !prev;
        });
    };

    const toggleSelectItem = (id) => { // trigger
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        ); // state
    };

    const handleSelectAll = () => { // trigger
        const currentFilteredIds = filteredMedia.map((m) => m.id); // state
        const allSelected = currentFilteredIds.length > 0 && currentFilteredIds.every((id) => selectedIds.includes(id)); // check
        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !currentFilteredIds.includes(id))); // state
        } else {
            setSelectedIds(Array.from(new Set([...selectedIds, ...currentFilteredIds]))); // state
        }
    };


    const handleCopyUrl = (item) => { // trigger
        if (!item?.url) return; // check
        const fullUrl = item.url.startsWith('http') ? item.url : `${window.location.origin}${item.url}`; // convert
        navigator.clipboard.writeText(fullUrl); // save
        setCopiedId(item.id); // state
        setTimeout(() => setCopiedId(null), 2000); // clock
    };

    const handleDelete = () => { // trigger
        if (!deleteItem) return; // check
        router.delete(route('admin.library.destroy', deleteItem.id), { // save
            onSuccess: () => setDeleteItem(null) // state
        });
    };

    const handleBulkDelete = () => { // trigger
        if (selectedIds.length === 0) return; // check
        setBulkDeleting(true); // state
        router.post(route('admin.library.bulk-destroy'), { ids: selectedIds }, { // save
            onFinish: () => {
                setBulkDeleting(false); // state
                setBulkDeleteModalOpen(false); // state
                setSelectedIds([]); // state
                setIsSelectMode(false); // toggle
            }
        });
    };

    const totalCount = mediaList.length; // state

    // --4. UI--
    return (
        <AdminLayout title="Media Library - MESF Admin">
            <Head title="Media Library - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* Search & Action Toolbar */}
                <div className={`p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl ${isSelectMode ? 'space-y-4' : ''}`}>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* search input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder="Search library files by filename..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
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
                            <span className="hidden sm:inline-flex text-xs font-mono px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap">
                                {totalCount} Files Stored
                            </span>
                            <button
                                type="button"
                                onClick={toggleSelectMode} // trigger
                                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                                    isSelectMode
                                        ? 'bg-amber-400/20 border-amber-400/40 text-amber-300 shadow-sm'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                                }`}
                            >
                                <CheckSquare className="w-4 h-4 text-amber-400" />
                                <span>{isSelectMode ? 'Cancel Selection' : 'Select'}</span>
                            </button>
                            <Link
                                href={route('admin.library.create')} // redirect
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                <UploadCloud className="w-4 h-4" />
                                <span>Upload</span>
                            </Link>
                        </div>
                    </div>


                    {/* selection sub-bar */}
                    {isSelectMode && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleSelectAll} // trigger
                                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
                                >
                                    {filteredMedia.length > 0 && filteredMedia.every((m) => selectedIds.includes(m.id))
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                                <span className="text-xs font-mono text-amber-300 font-semibold">
                                    {selectedIds.length} of {filteredMedia.length} selected
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setBulkDeleteModalOpen(true)} // trigger
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer active:scale-95"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete ({selectedIds.length}) Selected</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSelectMode(false);
                                        setSelectedIds([]);
                                    }} // trigger
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Media Grid */}
                {filteredMedia.length === 0 ? (
                    <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-white tracking-wide">
                                {searchQuery ? 'No Matching Media Files' : 'Media Library is Empty'}
                            </h3>
                            {searchQuery && (
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                                    No files matched your search filter. Try clearing the search query.
                                </p>
                            )}
                        </div>
                        <div className="pt-2">
                            <Link
                                href={route('admin.library.create')} // redirect
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-all cursor-pointer shadow-lg"
                            >
                                <UploadCloud className="w-4 h-4" />
                                <span>Upload</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredMedia.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        if (isSelectMode) {
                                            toggleSelectItem(item.id);
                                        }
                                    }}
                                    className={`group relative rounded-2xl border ${
                                        isSelected
                                            ? 'border-amber-400 ring-2 ring-amber-400/40 bg-amber-400/[0.04]'
                                            : 'border-white/10 hover:border-amber-400/50 bg-[#090D18]/85'
                                    } backdrop-blur-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-200 cursor-pointer`}
                                >
                                    {/* selection checkbox button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isSelectMode) setIsSelectMode(true);
                                            toggleSelectItem(item.id);
                                        }}
                                        className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                                            isSelected
                                                ? 'bg-amber-400 border-amber-400 text-black'
                                                : isSelectMode
                                                    ? 'bg-black/70 border-white/40 text-transparent hover:border-amber-400'
                                                    : 'bg-black/60 border-white/20 text-transparent opacity-0 group-hover:opacity-100 hover:border-amber-400 hover:bg-black/80'
                                        }`}
                                        title={isSelected ? "Deselect item" : "Select item"}
                                    >
                                        <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>

                                    {/* image / preview container */}
                                    <div className="relative aspect-square bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/5">
                                        {item.is_image ? (
                                            <img
                                                src={item.url} // state
                                                alt={item.file_name}
                                                className="w-full h-full object-contain p-2 transition-transform duration-200"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                                                <FileText className="w-10 h-10 text-slate-500 mb-1" />
                                                <span className="text-[10px] font-mono text-slate-400 uppercase truncate max-w-full">
                                                    {item.file_type}
                                                </span>
                                            </div>
                                        )}

                                        {/* hover overlay with quick action buttons (hidden when in select mode) */}
                                        {!isSelectMode && (
                                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2 z-10">
                                                {item.is_image && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewItem(item);
                                                        }}
                                                        className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow"
                                                        title="Preview full image"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopyUrl(item);
                                                    }}
                                                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow"
                                                    title="Copy file URL"
                                                >
                                                    {copiedId === item.id ? (
                                                        <Check className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteItem(item);
                                                    }}
                                                    className="w-8 h-8 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow"
                                                    title="Delete file"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* card details */}
                                    <div className="p-3 space-y-1">
                                        <p className="text-xs font-bold text-white truncate" title={item.file_name}>
                                            {item.file_name}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                            <span>{item.human_size}</span>
                                            <span className="truncate max-w-[80px]">{item.created_at ? item.created_at.split(',')[0] : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>



            {/* Preview Lightbox Modal */}
            {previewItem && (
                <div
                    onClick={() => setPreviewItem(null)} // trigger
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn cursor-pointer"
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // check
                        className="relative max-w-4xl max-h-[90vh] bg-[#090D18] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="truncate pr-4">
                                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{previewItem.file_name}</h4>
                                <span className="text-[10px] text-slate-400 font-mono">{previewItem.human_size} • {previewItem.file_type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleCopyUrl(previewItem)} // trigger
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                                >
                                    {copiedId === previewItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedId === previewItem.id ? 'Copied!' : 'Copy Link'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewItem(null)} // trigger
                                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 max-h-[75vh] flex items-center justify-center overflow-auto bg-black/40">
                            <img
                                src={previewItem.url} // state
                                alt={previewItem.file_name}
                                className="max-w-full max-h-[70vh] object-contain rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-md bg-[#090D18] border border-white/15 rounded-3xl p-6 shadow-2xl text-center space-y-4 text-white">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="text-base font-bold text-white">Delete File from Library?</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Are you sure you want to delete <strong className="text-white font-mono">{deleteItem.file_name}</strong>?
                                <span className="block text-slate-400 text-xs mt-1.5">This action cannot be undone.</span>
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteItem(null)} // trigger
                                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete} // trigger
                                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Confirmation Modal */}
            {bulkDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-md bg-[#090D18] border border-white/15 rounded-3xl p-6 shadow-2xl text-center space-y-4 text-white">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="text-base font-bold text-white">Delete {selectedIds.length} File{selectedIds.length === 1 ? '' : 's'}?</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Are you sure you want to delete <strong className="text-white font-mono">{selectedIds.length}</strong> selected file{selectedIds.length === 1 ? '' : 's'}?
                                <span className="block text-slate-400 text-xs mt-1.5">This action cannot be undone.</span>
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setBulkDeleteModalOpen(false)} // trigger
                                disabled={bulkDeleting} // check
                                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkDelete} // trigger
                                disabled={bulkDeleting} // check
                                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.length} File${selectedIds.length === 1 ? '' : 's'}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
