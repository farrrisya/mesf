// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    UploadCloud,
    X,
    AlertCircle,
    Flame,
    Calendar,
    MapPin,
    Tag,
    Move,
    FolderOpen,
    Clock
} from 'lucide-react';
import ImagePositionerModal from '@/Components/ImagePositionerModal';
import MediaPickerModal from '@/Components/MediaPickerModal';

// --2. properties--
const DEFAULT_CATEGORIES = [
    'TOURNAMENTS',
    'ACHIEVEMENTS',
    'PARTNERSHIPS',
    'ANNOUNCEMENTS'
];

// --3. main component--
export default function Create({ categories = DEFAULT_CATEGORIES }) {
    const fileInputRef = useRef(null); // properties
    const [imagePreview, setImagePreview] = useState(null); // state
    const [originalFile, setOriginalFile] = useState(null); // state
    const [originalPreview, setOriginalPreview] = useState(null); // state
    const [hasCustomCrop, setHasCustomCrop] = useState(false); // state
    const [isPositionerOpen, setIsPositionerOpen] = useState(false); // state
    const [isLibraryOpen, setIsLibraryOpen] = useState(false); // state
    const [positionerSource, setPositionerSource] = useState(null); // state
    const [rawFileName, setRawFileName] = useState('cover.jpg'); // state
    const initialCategory = categories[0] || 'TOURNAMENTS'; // state

    const todayDate = new Date().toISOString().split('T')[0]; // clock

    const { data, setData, post, processing, errors, transform } = useForm({ // state
        title: '',
        category: initialCategory,
        tag: `[ ${initialCategory} ]`,
        excerpt: '',
        content: '',
        location: '',
        status: 'published',
        is_featured: false,
        published_at: todayDate,
        image: null,
        poster: null,
        library_image_path: null,
        library_poster_path: null,
    });

    const isScheduled = Boolean(data.published_at && data.published_at > todayDate); // check

    // --4. actions--
    const handleCategoryChange = (cat) => { // trigger
        setData((prev) => ({
            ...prev,
            category: cat,
            tag: `[ ${cat} ]`
        })); // state
    };

    const handleImageChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setRawFileName(file.name); // state
            setOriginalFile(file); // state
            setPositionerSource(file); // state
            setIsPositionerOpen(true); // state
            const reader = new FileReader(); // convert
            reader.onloadend = () => {
                setImagePreview(reader.result); // state
                setOriginalPreview(reader.result); // state
            };
            reader.readAsDataURL(file); // convert
            setData((prev) => ({
                ...prev,
                poster: file, // full original poster
                image: file, // initial cover
                library_image_path: null,
                library_poster_path: null,
            }));
            setHasCustomCrop(false); // state
        }
    };

    const handleSelectFromLibrary = (mediaItem) => { // trigger
        setImagePreview(mediaItem.url); // state
        setOriginalPreview(mediaItem.url); // state
        setOriginalFile(null); // state
        setPositionerSource(mediaItem.url); // state
        setRawFileName(mediaItem.file_name); // state
        setData((prev) => ({
            ...prev,
            library_image_path: mediaItem.file_path,
            library_poster_path: mediaItem.file_path,
            image: null,
            poster: null,
        }));
        setHasCustomCrop(false); // state
        if (fileInputRef.current) { // check
            fileInputRef.current.value = ''; // state
        }
        setIsLibraryOpen(false); // toggle
    };

    const handlePositionerComplete = (croppedFile, previewUrl) => { // save
        setData((prev) => ({
            ...prev,
            image: croppedFile, // 16:9 framed cover
            library_image_path: null, // cropped binary overrides library cover
        }));
        setImagePreview(previewUrl); // state
        setHasCustomCrop(true); // state
    };

    const handleOpenPositioner = () => { // trigger
        const src = originalFile || originalPreview || imagePreview; // state
        if (src) { // check
            setPositionerSource(src); // state
            setIsPositionerOpen(true); // state
        }
    };

    const handleResetFraming = () => { // trigger
        if (originalFile && originalPreview) { // check
            setData((prev) => ({
                ...prev,
                image: originalFile, // reset cover to natural file
                library_image_path: null,
            }));
            setImagePreview(originalPreview); // state
            setHasCustomCrop(false); // state
        } else if (originalPreview) {
            setData((prev) => ({
                ...prev,
                image: null,
                library_image_path: data.library_poster_path,
            }));
            setImagePreview(originalPreview); // state
            setHasCustomCrop(false); // state
        }
    };

    const handleRemoveImage = () => { // trigger
        setData((prev) => ({
            ...prev,
            image: null,
            poster: null,
            library_image_path: null,
            library_poster_path: null
        })); // state
        setImagePreview(null); // state
        setOriginalPreview(null); // state
        setOriginalFile(null); // state
        setPositionerSource(null); // state
        setHasCustomCrop(false); // state
        if (fileInputRef.current) { // check
            fileInputRef.current.value = ''; // state
        }
    };

    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        const finalStatus = isScheduled ? 'draft' : data.status; // state
        transform((raw) => ({
            ...raw,
            status: finalStatus,
            is_featured: raw.is_featured ? 1 : 0,
            category: raw.category || initialCategory,
        }));
        post(route('admin.news.store'), { forceFormData: true }); // save
    };

    // --5. UI--
    return (
        <AdminLayout title="Create News Article - MESF Admin">
            <Head title="Create News Article - Admin" />

            <div className="w-full max-w-6xl pb-16 space-y-5">
                {/* header bar: tightly positioned with inline back button */}
                <div className="flex items-center gap-3">
                    <BackButton href={route('admin.news')} label="Back" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Create News Article
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Draft press releases, official announcements, and editorial articles.
                        </p>
                    </div>
                </div>

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: story narrative (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                                {/* headline title */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Headline Title <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title} // state
                                        onChange={(e) => setData('title', e.target.value)} // trigger
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-base font-semibold outline-none transition-all font-sans"
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-rose-400 font-medium">{errors.title}</p>
                                    )}
                                </div>

                                {/* short summary / excerpt */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Short Summary / Excerpt
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.excerpt} // state
                                        onChange={(e) => setData('excerpt', e.target.value)} // trigger
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all resize-y leading-relaxed font-sans"
                                    />
                                </div>

                                {/* full narrative content */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Full Article Story Body
                                    </label>
                                    <textarea
                                        rows={12}
                                        value={data.content} // state
                                        onChange={(e) => setData('content', e.target.value)} // trigger
                                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans leading-relaxed resize-y"
                                    />
                                </div>

                                {/* cover image uploader */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Featured Cover Image
                                    </label>
                                    {imagePreview ? (
                                        <div className="space-y-3">
                                            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/15 bg-black/40 group">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* badge overlay */}
                                                <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                                                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white uppercase">
                                                        {hasCustomCrop ? '16:9 Framed Cover' : 'Natural Display'}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                                                        Full Poster Preserved
                                                    </span>
                                                </div>

                                                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleOpenPositioner} // trigger
                                                        className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md flex items-center gap-1.5"
                                                        title="Reposition cover framing"
                                                    >
                                                        <Move className="w-3.5 h-3.5" />
                                                        <span>Crop</span>
                                                    </button>
                                                    {hasCustomCrop && (
                                                        <button
                                                            type="button"
                                                            onClick={handleResetFraming} // trigger
                                                            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-neutral-200 text-xs font-mono transition-all cursor-pointer shadow-lg"
                                                            title="Use original framing"
                                                        >
                                                            Reset Crop
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()} // trigger
                                                        className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-lg"
                                                    >
                                                        Upload
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsLibraryOpen(true)} // trigger
                                                        className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                                                    >
                                                        <FolderOpen className="w-3.5 h-3.5" />
                                                        <span>Library</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage} // trigger
                                                        className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer shadow-lg"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* admin friendly helper action rail */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                                                <p className="text-[11px] text-slate-400 font-mono">
                                                    Original full poster will be saved for the public full-screen poster view.
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsLibraryOpen(true)} // trigger
                                                        className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
                                                    >
                                                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                                                        <span>Change from Library</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleOpenPositioner} // trigger
                                                        className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer font-bold"
                                                    >
                                                        <Move className="w-3 h-3" />
                                                        <span>Adjust Crop</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full py-9 px-4 border-2 border-dashed border-white/15 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-2.5">
                                                <UploadCloud className="w-6 h-6" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-200">Select Featured Cover Image</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5 mb-4">PNG, JPG, WEBP up to 10MB (16:9 recommended)</p>
                                            <div className="flex items-center gap-2.5 w-full max-w-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()} // trigger
                                                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                                >
                                                    <UploadCloud className="w-4 h-4 text-amber-400" />
                                                    <span>Upload File</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsLibraryOpen(true)} // trigger
                                                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/35 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                                >
                                                    <FolderOpen className="w-4 h-4" />
                                                    <span>From Library</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange} // trigger
                                        className="hidden"
                                    />
                                    {errors.image && (
                                        <p className="text-xs text-rose-400 font-medium">{errors.image}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* right column: publishing settings & categorization (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* publish box */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                                    Publishing Status
                                </h3>

                                {/* status toggle */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-400">
                                        Visibility
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setData('status', 'published')} // trigger
                                            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                                data.status === 'published' && !isScheduled
                                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-black shadow-md shadow-emerald-500/20'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Published
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('status', 'draft')} // trigger
                                            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                                data.status === 'draft' || isScheduled
                                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/20'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            {isScheduled ? 'Scheduled (Draft)' : 'Draft'}
                                        </button>
                                    </div>
                                </div>

                                {/* hero featured toggle */}
                                <div className="pt-2 border-t border-white/5">
                                    <label className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured} // state
                                            onChange={(e) => setData('is_featured', e.target.checked)} // trigger
                                            className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400/30 bg-black border-white/20 mt-0.5"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                                <Flame className="w-3.5 h-3.5 text-amber-400" />
                                                <span>Hero Featured Story</span>
                                            </p>
                                            <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                                                Displays as the massive featured cover on public newsroom
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* publication date */}
                                <div className="space-y-1.5 pt-2 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Publication Date</span>
                                        </label>
                                        {isScheduled && (
                                            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full">
                                                Future Date
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="date"
                                        value={data.published_at} // state
                                        onChange={(e) => setData('published_at', e.target.value)} // trigger
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none"
                                    />
                                    {isScheduled && (
                                        <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs flex items-start gap-2.5 animate-fadeIn mt-2">
                                            <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-sky-300">Scheduled Post (Draft)</p>
                                                <p className="text-[11px] text-sky-300/80 leading-relaxed mt-0.5">
                                                    Because this date is set in the future, this article will be automatically saved as a Draft until publication.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* action buttons & inline notice */}
                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    {Object.keys(errors).length > 0 && (
                                        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                            <span>Please check required fields marked above.</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing} // check
                                        className={`w-full py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                                            isScheduled
                                                ? 'bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 hover:brightness-110 text-black shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                                                : data.status === 'published'
                                                    ? 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 hover:brightness-110 text-black shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                                                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                        }`}
                                    >
                                        {processing && <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                                        <span>
                                            {isScheduled
                                                ? 'Schedule Post (Draft)'
                                                : data.status === 'draft'
                                                    ? 'Save as Draft'
                                                    : 'Publish Article'}
                                        </span>
                                    </button>

                                    <Link
                                        href={route('admin.news')} // redirect
                                        className="w-full block py-2.5 rounded-2xl text-center text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>

                            {/* metadata & classification card */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                                    Classification
                                </h3>

                                {/* category */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Category</span>
                                    </label>
                                    <select
                                        value={data.category} // state
                                        onChange={(e) => handleCategoryChange(e.target.value)} // trigger
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none cursor-pointer"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-xs text-rose-400 font-medium">{errors.category}</p>
                                    )}
                                </div>

                                {/* tag badge display (read only, automatic) */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-slate-400">
                                            Tag Badge
                                        </label>
                                        <span className="text-[10px] text-amber-400/80 font-mono">Auto by category</span>
                                    </div>
                                    <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center">
                                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold tracking-wider">
                                            {data.tag || `[ ${data.category} ]`}
                                        </span>
                                    </div>
                                </div>

                                {/* location */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Location</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location} // state
                                        onChange={(e) => setData('location', e.target.value)} // trigger
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* image repositioner modal */}
            <ImagePositionerModal
                isOpen={isPositionerOpen}
                onClose={() => setIsPositionerOpen(false)}
                imageSource={positionerSource}
                fileName={rawFileName}
                aspectRatio={16 / 9}
                aspectRatioLabel="16:9 Landscape Cover"
                title="Reposition Cover Image"
                onComplete={handlePositionerComplete}
            />

            {/* media library picker modal */}
            <MediaPickerModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={handleSelectFromLibrary}
            />
        </AdminLayout>
    );
}
