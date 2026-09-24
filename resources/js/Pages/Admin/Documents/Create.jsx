// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    FileText,
    UploadCloud,
    Link as LinkIcon,
    X,
    Check,
    AlertCircle,
    FileCheck,
    File,
    HardDrive
} from 'lucide-react';

// --2. properties--
const DOCUMENT_CATEGORIES = [
    'Constitution & Statutes',
    'Tournament Rulebooks',
    'Sanction & Endorsement Forms',
    'Federation Guidelines & Policies',
    'Annual Reports & Circulars',
    'Player & Referee Regulations'
];

// --3. main component--
export default function Create() {
    const fileInputRef = useRef(null); // properties
    const [fileInfo, setFileInfo] = useState(null); // state
    const [isSubmitting, setIsSubmitting] = useState(false); // state
    const [showSuccess, setShowSuccess] = useState(false); // state

    const { data, setData } = useForm({ // state
        title: '',
        category: '',
        media_type: 'file', // 'file' | 'link'
        url_link: '',
        version_ref: '',
        description: '',
        is_active: '',
        file: null
    });

    // --4. actions--
    const handleFileChange = (e) => { // trigger
        const selectedFile = e.target.files?.[0]; // state
        if (selectedFile) { // check
            setData('file', selectedFile); // state
            const sizeInMb = (selectedFile.size / (1024 * 1024)).toFixed(2); // convert
            setFileInfo({ // state
                name: selectedFile.name,
                size: `${sizeInMb} MB`,
                type: selectedFile.type || 'Document'
            });
        }
    };

    const handleRemoveFile = () => { // trigger
        setData('file', null); // state
        setFileInfo(null); // state
        if (fileInputRef.current) { // check
            fileInputRef.current.value = ''; // state
        }
    };

    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        setIsSubmitting(true); // state
        setTimeout(() => { // clock
            setIsSubmitting(false); // state
            setShowSuccess(true); // state
            setTimeout(() => { // clock
                router.visit(route('admin.documents')); // redirect
            }, 1200);
        }, 600);
    };

    // --5. UI--
    return (
        <AdminLayout
            title="Upload Document - MESF Admin"
            contentClassName="p-6 sm:p-8"
        >
            <Head title="Upload Document - Admin" />

            <div className="w-full max-w-6xl pb-16">
                {/* back button */}
                <div className="mb-6 sm:mb-8 flex items-center">
                    <BackButton href={route('admin.documents')} label="Back to Documents" />
                </div>

                {/* success banner */}
                {showSuccess && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">Document registered successfully! Redirecting to documents archive...</span>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: document metadata (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                                {/* document title */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Document Title <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title} // state
                                        onChange={(e) => setData('title', e.target.value)} // trigger
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                    />
                                </div>

                                {/* category and version */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Document Category <span className="text-amber-400">*</span>
                                        </label>
                                        <select
                                            value={data.category} // state
                                            onChange={(e) => setData('category', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="">Choose Category</option>
                                            {DOCUMENT_CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Revision / Reference No.
                                        </label>
                                        <input
                                            type="text"
                                            value={data.version_ref} // state
                                            onChange={(e) => setData('version_ref', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>

                                {/* media source switcher tabs */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Document Source Format
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData('media_type', 'file')} // trigger
                                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                                                data.media_type === 'file'
                                                    ? 'bg-amber-400/10 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                            }`}
                                        >
                                            <FileText className={`w-5 h-5 ${data.media_type === 'file' ? 'text-amber-400' : 'text-slate-400'}`} />
                                            <div>
                                                <div className="text-xs font-bold">Uploaded File</div>
                                                <div className="text-[11px] text-slate-400">PDF, DOCX, XLSX document</div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('media_type', 'link')} // trigger
                                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                                                data.media_type === 'link'
                                                    ? 'bg-amber-400/10 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                            }`}
                                        >
                                            <LinkIcon className={`w-5 h-5 ${data.media_type === 'link' ? 'text-amber-400' : 'text-slate-400'}`} />
                                            <div>
                                                <div className="text-xs font-bold">External Resource URL</div>
                                                <div className="text-[11px] text-slate-400">Cloud link or web portal</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* conditional: external url or description */}
                                {data.media_type === 'link' && (
                                    <div className="space-y-1.5 animate-fadeIn">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            External Destination Link <span className="text-amber-400">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={data.url_link} // state
                                            onChange={(e) => setData('url_link', e.target.value)} // trigger
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>
                                )}

                                {/* description */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Document Description & Overview
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.description} // state
                                        onChange={(e) => setData('description', e.target.value)} // trigger
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all resize-y leading-relaxed font-sans"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* right column: file upload & publish status (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* file upload card (when media_type === 'file') */}
                            {data.media_type === 'file' && (
                                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 animate-fadeIn">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Document Attachment
                                        </h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Upload official PDF, Word, or spreadsheet asset.
                                        </p>
                                    </div>

                                    {fileInfo ? (
                                        <div className="p-4 rounded-2xl border border-white/15 bg-white/[0.03] space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                                    <FileCheck className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-bold text-white truncate">
                                                        {fileInfo.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-mono">
                                                        {fileInfo.size}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFile} // trigger
                                                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()} // trigger
                                            className="border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-amber-400/[0.03] group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:scale-105 transition-all mb-3">
                                                <UploadCloud className="w-6 h-6" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                                                Choose document file
                                            </p>
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                PDF, DOCX, XLSX up to 25MB
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef} // properties
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                        onChange={handleFileChange} // trigger
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {/* status & submission card */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Public Availability
                                    </label>
                                    <select
                                        value={data.is_active} // state
                                        onChange={(e) => setData('is_active', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none transition-all cursor-pointer font-sans"
                                    >
                                        <option value="">Choose Availability</option>
                                        <option value="active">Active & Available for Download</option>
                                        <option value="draft">Internal Draft / Hidden</option>
                                    </select>
                                </div>

                                <div className="pt-2 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting} // check
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Uploading...' : 'Publish Document'}
                                    </button>

                                    <Link
                                        href={route('admin.documents')} // redirect
                                        className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white font-semibold text-xs tracking-wider transition-all text-center block"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
