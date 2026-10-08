// --1. imports--
import { useState, useEffect, useRef } from 'react';
import {
    Image as ImageIcon,
    Search,
    UploadCloud,
    Check,
    X,
    Filter,
    FileText,
    RefreshCw
} from 'lucide-react';

// --2. main component--
export default function MediaPickerModal({
    isOpen = false,
    onClose = () => {},
    onSelect = () => {},
    title = 'Choose from Media Library',
    type = 'image', // 'image' or 'all'
}) {
    const [mediaItems, setMediaItems] = useState([]); // state
    const [loading, setLoading] = useState(false); // state
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [selectedItem, setSelectedItem] = useState(null); // state
    const [uploading, setUploading] = useState(false); // state
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'upload'
    const uploadInputRef = useRef(null); // properties

    // --3. actions--
    const fetchMedia = async (search = '') => { // trigger
        setLoading(true); // state
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (type) params.append('type', type);

            const res = await fetch(`/admin/library/items?${params.toString()}`, { // trigger
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) { // check
                const data = await res.json();
                setMediaItems(data.items || []); // state
            }
        } catch (err) {
            console.error('Failed to fetch media library items', err); // error
        } finally {
            setLoading(false); // state
        }
    };

    useEffect(() => {
        if (isOpen) { // check
            setSelectedItem(null); // state
            fetchMedia(searchQuery); // trigger
        }
    }, [isOpen]);

    const handleSearchSubmit = (e) => { // trigger
        e.preventDefault(); // check
        fetchMedia(searchQuery); // trigger
    };

    const handleUploadFiles = async (e) => { // trigger
        const files = e.target.files; // properties
        if (!files || files.length === 0) return; // check

        setUploading(true); // state
        const formData = new FormData(); // properties
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]); // state
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/admin/library', { // save
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (res.ok) { // check
                const data = await res.json();
                await fetchMedia(searchQuery); // trigger
                setActiveTab('browse'); // state
                if (data.items && data.items.length > 0) { // check
                    setSelectedItem(data.items[0]); // state
                }
            }
        } catch (err) {
            console.error('Failed to upload files', err); // error
        } finally {
            setUploading(false); // state
            if (uploadInputRef.current) uploadInputRef.current.value = ''; // trigger
        }
    };

    const handleConfirmSelect = () => { // trigger
        if (!selectedItem) return; // check
        onSelect(selectedItem); // trigger
        onClose(); // trigger
    };

    if (!isOpen) return null; // check

    // --4. UI--
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#090D18] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
                {/* header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-wide">
                                {title}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                                Select an image or upload directly to the library
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* tabs: browse vs upload */}
                        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                type="button"
                                onClick={() => setActiveTab('browse')} // toggle
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === 'browse'
                                        ? 'bg-amber-400 text-black font-bold shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Library ({mediaItems.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('upload')} // toggle
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === 'upload'
                                        ? 'bg-amber-400 text-black font-bold shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Upload New
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose} // trigger
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer ml-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* body */}
                {activeTab === 'browse' ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* toolbar */}
                        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/[0.01]">
                            <form onSubmit={handleSearchSubmit} className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery} // state
                                    onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                    placeholder="Search library files by filename..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                                />
                            </form>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => fetchMedia(searchQuery)} // trigger
                                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                                    <span>Refresh</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => uploadInputRef.current?.click()} // trigger
                                    className="px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                                >
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>Upload</span>
                                </button>
                            </div>
                        </div>

                        {/* grid list */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
                                    <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                                    <span className="text-xs">Loading media files...</span>
                                </div>
                            ) : mediaItems.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-2xl">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-white">No media files found</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                        {searchQuery ? 'No items match your search keyword.' : 'The library is currently empty. Upload files to get started.'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => uploadInputRef.current?.click()} // trigger
                                        className="mt-4 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all cursor-pointer shadow-md"
                                    >
                                        Upload First File
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                    {mediaItems.map((item) => {
                                        const isSelected = selectedItem?.id === item.id;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedItem(item)} // trigger
                                                onDoubleClick={handleConfirmSelect} // trigger
                                                className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col bg-[#070B14]/80 ${
                                                    isSelected
                                                        ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] ring-2 ring-amber-400'
                                                        : 'border-white/10 hover:border-white/25 hover:bg-white/[0.03]'
                                                }`}
                                            >
                                                {/* thumbnail area */}
                                                <div className="relative aspect-video bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/5">
                                                    {item.is_image ? (
                                                        <img
                                                            src={item.url} // state
                                                            alt={item.file_name}
                                                            className="w-full h-full object-contain p-2"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                                            <FileText className="w-8 h-8 text-slate-500" />
                                                            <span className="text-[10px] font-mono mt-1 uppercase text-slate-500">{item.file_type}</span>
                                                        </div>
                                                    )}

                                                    {/* selected badge */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg font-bold">
                                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* metadata label */}
                                                <div className="p-2.5 space-y-0.5">
                                                    <p className="text-xs font-semibold text-white truncate" title={item.file_name}>
                                                        {item.file_name}
                                                    </p>
                                                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                                        <span>{item.human_size}</span>
                                                        <span>{item.created_at ? item.created_at.split(',')[0] : ''}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* upload tab */
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div
                            onClick={() => uploadInputRef.current?.click()} // trigger
                            className="w-full max-w-lg border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02] hover:bg-amber-400/[0.02] group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform mb-4">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            <h4 className="text-sm font-bold text-white">
                                {uploading ? 'Uploading to Library...' : 'Click to select or drop files here'}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                                Upload logos, banners, tournament artwork, team badges, or photos (PNG, JPG, WEBP, SVG up to 20MB)
                            </p>
                            <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 group-hover:text-white">
                                Choose File
                            </span>
                        </div>
                    </div>
                )}

                {/* hidden file input for uploading */}
                <input
                    ref={uploadInputRef} // properties
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleUploadFiles} // trigger
                    className="hidden"
                />

                {/* footer */}
                <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.02]">
                    <div className="text-xs text-slate-400 truncate max-w-md">
                        {selectedItem ? (
                            <span>Selected: <strong className="text-white font-mono">{selectedItem.file_name}</strong> ({selectedItem.human_size})</span>
                        ) : (
                            <span>Click an item to select it, or double-click to choose immediately.</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={onClose} // trigger
                            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={!selectedItem} // check
                            onClick={handleConfirmSelect} // trigger
                            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
                        >
                            Insert Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
