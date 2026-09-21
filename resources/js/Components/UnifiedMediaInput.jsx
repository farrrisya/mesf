import React, { useState } from 'react';
import MediaPickerModal from './MediaPickerModal';

// --1. main component--
export default function UnifiedMediaInput({ 
    label = "Muat Naik Fail", 
    accept = "*/*", 
    value, 
    onChange, 
    error,
    allowUrl = true 
}) {
    // --2. state--
    const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'media', 'url'
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    // --3. actions--
    const handleFileChange = (e) => { // trigger
        if (e.target.files && e.target.files[0]) {
            onChange({ type: 'upload', file: e.target.files[0] });
        } else {
            onChange(null);
        }
    };

    const handleMediaSelect = (mediaItem) => { // trigger
        onChange({ type: 'media', path: mediaItem.file_path, mediaId: mediaItem.id });
    };

    const handleUrlChange = (e) => { // trigger
        onChange({ type: 'url', url: e.target.value });
    };

    // Determine current display based on value
    const hasValue = value !== null && value !== undefined;
    let displayValue = '';
    if (hasValue) {
        if (value.type === 'upload' && value.file) displayValue = value.file.name;
        else if (value.type === 'media' && value.path) displayValue = value.path.split('/').pop();
        else if (value.type === 'url' && value.url) displayValue = value.url;
    }

    // --4. UI--
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-600">{label}</label>
            </div>
            
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50">
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')} // trigger
                        className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === 'upload' ? 'bg-white text-[#0a192f] border-b-2 border-[#0a192f]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('media')} // trigger
                        className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === 'media' ? 'bg-white text-[#0a192f] border-b-2 border-[#0a192f]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Media Library
                    </button>
                    {allowUrl && ( // check
                        <button
                            type="button"
                            onClick={() => setActiveTab('url')} // trigger
                            className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === 'url' ? 'bg-white text-[#0a192f] border-b-2 border-[#0a192f]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Pautan URL
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 relative">
                    {hasValue && ( // check
                        <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-bold text-emerald-700 truncate">
                                    {value.type === 'upload' ? 'Fail Dipilih: ' : value.type === 'media' ? 'Media Dipilih: ' : 'URL Dipilih: '}
                                    {displayValue}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onChange(null)} // trigger
                                className="w-6 h-6 shrink-0 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}

                    {!hasValue && activeTab === 'upload' && ( // check
                        <div>
                            <input
                                type="file"
                                onChange={handleFileChange} // trigger
                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#0a192f] file:text-white hover:file:bg-slate-800 cursor-pointer"
                                accept={accept}
                            />
                        </div>
                    )}

                    {!hasValue && activeTab === 'media' && ( // check
                        <div>
                            <button
                                type="button"
                                onClick={() => setIsMediaModalOpen(true)} // trigger
                                className="w-full py-3 px-4 border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-400 rounded-md text-xs font-bold transition flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Buka Media Library
                            </button>
                        </div>
                    )}

                    {!hasValue && activeTab === 'url' && ( // check
                        <div>
                            <input
                                type="url"
                                placeholder="https://..."
                                onChange={handleUrlChange} // trigger
                                className="w-full text-sm border-slate-200 rounded-md focus:ring-amber-500 focus:border-amber-500"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Masukkan pautan URL terus ke fail atau media.</p>
                        </div>
                    )}
                </div>
            </div>
            {error && <div className="text-red-500 text-xs mt-1.5 font-medium">{error}</div>}

            <MediaPickerModal 
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)} // trigger
                onSelect={handleMediaSelect}
            />
        </div>
    );
}
