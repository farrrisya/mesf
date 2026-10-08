// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    UploadCloud,
    X,
    FileText,
    ImageIcon,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Plus,
    FileCheck
} from 'lucide-react';

// --2. helpers--
function formatFileSize(bytes) { // convert
    if (!bytes || bytes === 0) return '0 B'; // check
    const units = ['B', 'KB', 'MB', 'GB']; // properties
    const i = Math.floor(Math.log(bytes) / Math.log(1024)); // convert
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// --3. main component--
export default function Create() {
    const fileInputRef = useRef(null); // properties
    const [selectedFiles, setSelectedFiles] = useState([]); // state
    const [isDragging, setIsDragging] = useState(false); // state
    const [uploading, setUploading] = useState(false); // state
    const [errorMessage, setErrorMessage] = useState(''); // state

    // --4. actions--
    const addFiles = (newFiles) => { // trigger
        setErrorMessage(''); // state
        const validFiles = []; // state
        const maxSizeBytes = 20 * 1024 * 1024; // 20MB check

        Array.from(newFiles).forEach((file) => {
            if (file.size > maxSizeBytes) { // check
                setErrorMessage(`File "${file.name}" exceeds the 20MB maximum file size limit.`); // error
                return;
            }
            const isImage = file.type.startsWith('image/'); // check
            const previewUrl = isImage ? URL.createObjectURL(file) : null; // convert

            validFiles.push({ // save
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                raw: file,
                name: file.name,
                size: file.size,
                type: file.type || 'application/octet-stream',
                isImage,
                previewUrl
            });
        });

        if (validFiles.length > 0) { // check
            setSelectedFiles((prev) => [...prev, ...validFiles]); // state
        }
    };

    const handleFileInputChange = (e) => { // trigger
        if (e.target.files && e.target.files.length > 0) { // check
            addFiles(e.target.files); // trigger
            e.target.value = ''; // trigger
        }
    };

    const handleDragOver = (e) => { // trigger
        e.preventDefault(); // check
        setIsDragging(true); // state
    };

    const handleDragLeave = (e) => { // trigger
        e.preventDefault(); // check
        setIsDragging(false); // state
    };

    const handleDrop = (e) => { // trigger
        e.preventDefault(); // check
        setIsDragging(false); // state
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { // check
            addFiles(e.dataTransfer.files); // trigger
        }
    };

    const handleRemoveFile = (idToRemove) => { // trigger
        setSelectedFiles((prev) => {
            const target = prev.find((f) => f.id === idToRemove);
            if (target && target.previewUrl) {
                URL.revokeObjectURL(target.previewUrl); // trigger
            }
            return prev.filter((f) => f.id !== idToRemove); // state
        });
    };

    const handleClearAll = () => { // trigger
        selectedFiles.forEach((f) => {
            if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); // trigger
        });
        setSelectedFiles([]); // state
        setErrorMessage(''); // state
    };

    const handleUploadSubmit = (e) => { // trigger
        e.preventDefault(); // check
        if (selectedFiles.length === 0) { // check
            setErrorMessage('Please select at least one file to upload.'); // error
            return;
        }

        setUploading(true); // state
        setErrorMessage(''); // state

        const formData = new FormData(); // properties
        selectedFiles.forEach((fileObj) => {
            formData.append('files[]', fileObj.raw); // save
        });

        router.post(route('admin.library.store'), formData, { // save
            forceFormData: true,
            onError: (errs) => { // error
                setUploading(false); // state
                const firstKey = Object.keys(errs)[0];
                setErrorMessage(errs[firstKey] || 'Failed to upload files. Please try again.'); // error
            },
            onFinish: () => { // trigger
                setUploading(false); // state
            }
        });
    };

    const totalSelectedBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0); // convert

    // --5. UI--
    return (
        <AdminLayout title="Upload Files - MESF Admin">
            <Head title="Upload Files - Admin" />

            <div className="w-full max-w-5xl pb-16 space-y-6">
                {/* header bar: inline back button, title, and actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <BackButton href={route('admin.library')} label="Back" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Upload to Library
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Add images, logos, banners, or documents to the centralized media repository.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('admin.library')} // redirect
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold tracking-wider transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleUploadSubmit} // trigger
                            disabled={uploading || selectedFiles.length === 0} // check
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>{uploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}</span>
                        </button>
                    </div>
                </div>

                {/* error message banner */}
                {errorMessage && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setErrorMessage('')} // trigger
                            className="text-rose-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* left column: dropzone and selected files list (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* drag and drop upload zone */}
                        <div
                            onDragOver={handleDragOver} // trigger
                            onDragLeave={handleDragLeave} // trigger
                            onDrop={handleDrop} // trigger
                            onClick={() => fileInputRef.current?.click()} // trigger
                            className={`group relative rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
                                isDragging
                                    ? 'border-amber-400 bg-amber-400/10 ring-4 ring-amber-400/20'
                                    : 'border-white/15 hover:border-amber-400/50 bg-[#090D18]/85 backdrop-blur-2xl'
                            } shadow-xl`}
                        >
                            <input
                                ref={fileInputRef} // properties
                                type="file"
                                multiple
                                accept="image/*,.pdf"
                                onChange={handleFileInputChange} // trigger
                                className="hidden"
                            />

                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 transition-colors">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-white">
                                        Drag & drop files here, or{' '}
                                        <span className="text-amber-400 underline underline-offset-4">browse</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                        Supports PNG, JPG, JPEG, WEBP, SVG, and PDF documents. You can select multiple files at once.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 mt-2">
                                    Max size: 20MB per file
                                </span>
                            </div>
                        </div>

                        {/* selected files queue */}
                        {selectedFiles.length > 0 && (
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                                            <FileCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs sm:text-sm font-bold text-white">
                                                Selected Files ({selectedFiles.length})
                                            </h3>
                                            <p className="text-[10px] sm:text-xs text-slate-400">
                                                Total size: {formatFileSize(totalSelectedBytes)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()} // trigger
                                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Add More</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClearAll} // trigger
                                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-all cursor-pointer"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto pr-1">
                                    {selectedFiles.map((fileObj) => (
                                        <div
                                            key={fileObj.id}
                                            className="py-3 flex items-center justify-between gap-3 group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* thumbnail / icon */}
                                                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                                    {fileObj.isImage && fileObj.previewUrl ? (
                                                        <img
                                                            src={fileObj.previewUrl} // state
                                                            alt={fileObj.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>

                                                {/* details */}
                                                <div className="min-w-0 space-y-0.5">
                                                    <p className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                                                        {fileObj.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                                        <span>{formatFileSize(fileObj.size)}</span>
                                                        <span>•</span>
                                                        <span className="truncate uppercase">{fileObj.type.split('/')[1] || 'FILE'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* remove file */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(fileObj.id)} // trigger
                                                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer shrink-0"
                                                title="Remove file"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* right column: guidelines & submit card (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* upload summary box */}
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                Upload Summary
                            </h3>
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                                    <span className="text-slate-400">Total Files</span>
                                    <span className="font-mono font-bold text-white">{selectedFiles.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                                    <span className="text-slate-400">Combined Size</span>
                                    <span className="font-mono font-bold text-amber-300">{formatFileSize(totalSelectedBytes)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                                    <span className="text-slate-400">Upload Status</span>
                                    <span className="font-semibold text-slate-300">
                                        {uploading ? 'Uploading to server...' : selectedFiles.length > 0 ? 'Ready to upload' : 'Waiting for files'}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleUploadSubmit} // trigger
                                disabled={uploading || selectedFiles.length === 0} // check
                                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <UploadCloud className="w-4 h-4" />
                                <span>{uploading ? 'Processing Upload...' : 'Upload Files Now'}</span>
                            </button>
                        </div>

                        {/* tips card */}
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                Library Guidelines
                            </h4>
                            <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <span>Uploaded files are automatically made available to all admin editors in News, Leagues, and Teams.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <span>High-resolution PNG or WEBP with transparent backgrounds are recommended for logos and emblems.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <span>Each individual file must not exceed 20MB in size.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
