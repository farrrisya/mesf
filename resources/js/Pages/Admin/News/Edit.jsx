// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
    Globe,
    Video,
    Move
} from 'lucide-react';
import NewsVideoPlayer, { parseVideoInfo } from '@/Components/NewsVideoPlayer';
import ImagePositionerModal from '@/Components/ImagePositionerModal';

// --2. properties--
const DEFAULT_CATEGORIES = [
    'TOURNAMENTS',
    'ACHIEVEMENTS',
    'PARTNERSHIPS',
    'ANNOUNCEMENTS'
];

// --3. main component--
export default function Edit({ article = {}, categories = DEFAULT_CATEGORIES }) {
    const fileInputRef = useRef(null); // properties
    const [imagePreview, setImagePreview] = useState(article.image_path || null); // state
    // original full poster source: prefer poster_path if available, otherwise image_path
    const [originalSource, setOriginalSource] = useState(article.poster_path || article.image_path || null); // state
    const [originalFile, setOriginalFile] = useState(null); // state
    const [hasCustomCrop, setHasCustomCrop] = useState(false); // state
    const [isPositionerOpen, setIsPositionerOpen] = useState(false); // state
    const [positionerSource, setPositionerSource] = useState(null); // state
    const [rawFileName, setRawFileName] = useState('cover.jpg'); // state
    const [processing, setProcessing] = useState(false); // state
    const [errors, setErrors] = useState({}); // state

    const [formData, setFormData] = useState({
        title: article.title || '',
        slug: article.slug || '',
        category: article.category || 'ACHIEVEMENTS',
        tag: article.tag || `[ ${article.category || 'ACHIEVEMENT'} ]`,
        excerpt: article.excerpt || '',
        content: article.content || '',
        location: article.location || '',
        status: article.status || 'published',
        is_featured: Boolean(article.is_featured),
        published_at: article.published_at || '',
        video_url: article.video_url || '',
        image: null,
        poster: null,
        remove_image: false,
    }); // state

    // --4. actions--
    const handleCategoryChange = (cat) => { // trigger
        setFormData((prev) => ({
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
            setOriginalSource(file); // state
            setPositionerSource(file); // state
            setIsPositionerOpen(true); // state
            setFormData((prev) => ({
                ...prev,
                poster: file, // full original poster
                image: file, // initial cover
                remove_image: false
            })); // state
            const reader = new FileReader(); // convert
            reader.onloadend = () => setImagePreview(reader.result); // state
            reader.readAsDataURL(file); // convert
            setHasCustomCrop(false); // state
        }
    };

    const handlePositionerComplete = (croppedFile, previewUrl) => { // save
        setFormData((prev) => ({
            ...prev,
            image: croppedFile, // 16:9 framed cover
            remove_image: false
        })); // state
        setImagePreview(previewUrl); // state
        setHasCustomCrop(true); // state
        // positionerSource remains original uncropped file/source so admin can reposition again anytime
    };

    const handleOpenPositioner = () => { // trigger
        const src = originalFile || originalSource || imagePreview; // state
        if (src) { // check
            setPositionerSource(src); // state
            setIsPositionerOpen(true); // state
        }
    };

    const handleResetFraming = () => { // trigger
        if (originalFile) { // check
            setFormData((prev) => ({ ...prev, image: originalFile })); // state
            const reader = new FileReader(); // convert
            reader.onloadend = () => setImagePreview(reader.result); // state
            reader.readAsDataURL(originalFile); // convert
            setHasCustomCrop(false); // state
        } else if (originalSource) {
            setFormData((prev) => ({ ...prev, image: null })); // state
            setImagePreview(originalSource); // state
            setHasCustomCrop(false); // state
        }
    };

    const handleRemoveImage = () => { // trigger
        setFormData((prev) => ({ ...prev, image: null, poster: null, remove_image: true })); // state
        setImagePreview(null); // state
        setOriginalSource(null); // state
        setOriginalFile(null); // state
        setPositionerSource(null); // state
        setHasCustomCrop(false); // state
        if (fileInputRef.current) { // check
            fileInputRef.current.value = ''; // state
        }
    };

    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        setProcessing(true); // state
        setErrors({}); // state

        const submission = new FormData(); // convert
        submission.append('title', formData.title); // state
        submission.append('category', formData.category); // state
        submission.append('tag', formData.tag); // state
        submission.append('status', formData.status); // state
        submission.append('is_featured', formData.is_featured ? '1' : '0'); // state
        submission.append('slug', formData.slug || ''); // state
        submission.append('excerpt', formData.excerpt || ''); // state
        submission.append('content', formData.content || ''); // state
        submission.append('location', formData.location || ''); // state
        submission.append('published_at', formData.published_at || ''); // state
        submission.append('video_url', formData.video_url || ''); // state

        if (formData.remove_image) { // check
            submission.append('remove_image', '1'); // state
        }
        if (formData.image instanceof File) { // check
            submission.append('image', formData.image); // state
        }
        if (formData.poster instanceof File) { // check
            submission.append('poster', formData.poster); // state
        }
        submission.append('_method', 'PUT'); // state

        router.post(route('admin.news.update', article.id), submission, { // redirect
            forceFormData: true,
            onFinish: () => setProcessing(false), // state
            onError: (errs) => {
                setProcessing(false); // state
                setErrors(errs); // error
            }
        });
    };

    // --5. UI--
    return (
        <AdminLayout
            title={`Edit: ${article.title || 'Article'} - MESF Admin`}
            contentClassName="p-6 sm:p-8"
        >
            <Head title={`Edit News: ${article.title || ''} - Admin`} />

            <div className="w-full max-w-6xl pb-16">
                {/* back button */}
                <div className="mb-6 sm:mb-8 flex items-center">
                    <BackButton href={route('admin.news')} label="Back to News" />
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
                                        value={formData.title} // state
                                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} // trigger
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
                                        value={formData.excerpt} // state
                                        onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))} // trigger
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
                                        value={formData.content} // state
                                        onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))} // trigger
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
                                                        {hasCustomCrop ? '16:9 Framed Cover' : 'Current Cover'}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                                                        Full Poster Preserved
                                                    </span>
                                                </div>

                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={handleOpenPositioner} // trigger
                                                        className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md flex items-center gap-1.5"
                                                        title="Reposition cover framing"
                                                    >
                                                        <Move className="w-3.5 h-3.5" />
                                                        <span>Reposition</span>
                                                    </button>
                                                    {hasCustomCrop && (
                                                        <button
                                                            type="button"
                                                            onClick={handleResetFraming} // trigger
                                                            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-neutral-200 text-xs font-mono transition-all cursor-pointer shadow-lg"
                                                            title="Use original framing"
                                                        >
                                                            Reset Crop
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()} // trigger
                                                        className="px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-lg"
                                                    >
                                                        Change
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage} // trigger
                                                        className="px-3.5 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer shadow-lg"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* admin friendly helper action rail */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                                                <p className="text-[11px] text-slate-400 font-mono">
                                                    Original full poster will be displayed in full-screen poster view.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={handleOpenPositioner} // trigger
                                                    className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer font-bold"
                                                >
                                                    <Move className="w-3 h-3" />
                                                    <span>Adjust Cover Crop (Re-position)</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()} // trigger
                                            className="w-full py-10 border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                                        >
                                            <UploadCloud className="w-8 h-8 text-amber-400" />
                                            <p className="text-xs font-semibold text-slate-200">Upload Featured Cover Image</p>
                                            <p className="text-[11px] text-slate-500">PNG, JPG, WEBP up to 10MB</p>
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

                                {/* video media link */}
                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                            <Video className="w-4 h-4 text-amber-400" />
                                            <span>Video Link (YouTube, Facebook, Vimeo)</span>
                                        </label>
                                        <span className="text-[10px] text-slate-400">Optional</span>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={formData.video_url} // state
                                            onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))} // trigger
                                            placeholder="https://www.youtube.com/watch?v=... or Facebook video link"
                                            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm outline-none transition-all font-sans pr-10"
                                        />
                                        {formData.video_url && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, video_url: '' }))} // trigger
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {errors.video_url && (
                                        <p className="text-xs text-rose-400 font-medium">{errors.video_url}</p>
                                    )}

                                    <p className="text-[11px] text-slate-400 leading-normal">
                                        Supports YouTube videos, YouTube Shorts, Vimeo, and Public Facebook video posts. Visitors will be able to play the video directly on the article page.
                                    </p>

                                    {/* live video preview in admin */}
                                    {formData.video_url && parseVideoInfo(formData.video_url) && (
                                        <div className="mt-3 p-3.5 rounded-2xl bg-white/[0.02] border border-amber-400/20">
                                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                                                    Live Player Preview
                                                </span>
                                            </div>
                                            <NewsVideoPlayer url={formData.video_url} title="Video Preview" className="!my-0" />
                                        </div>
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
                                            onClick={() => setFormData((prev) => ({ ...prev, status: 'published' }))} // trigger
                                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                formData.status === 'published'
                                                    ? 'bg-emerald-500 text-black shadow-md'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Published
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, status: 'draft' }))} // trigger
                                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                formData.status === 'draft'
                                                    ? 'bg-amber-400 text-black shadow-md'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Draft
                                        </button>
                                    </div>
                                </div>

                                {/* hero featured toggle */}
                                <div className="pt-2 border-t border-white/5">
                                    <label className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_featured} // state
                                            onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))} // trigger
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
                                    <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Publication Date</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.published_at} // state
                                        onChange={(e) => setFormData((prev) => ({ ...prev, published_at: e.target.value }))} // trigger
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none"
                                    />
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
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing && <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                                        <span>Save Changes</span>
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
                                        value={formData.category} // state
                                        onChange={(e) => handleCategoryChange(e.target.value)} // trigger
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none cursor-pointer"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* tag badge */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-slate-400">
                                            Tag Badge
                                        </label>
                                        <span className="text-[10px] text-amber-400/80 font-mono">Auto by category</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.tag} // state
                                        onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))} // trigger
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-amber-300 font-mono text-xs font-bold outline-none"
                                    />
                                </div>

                                {/* location */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Location</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location} // state
                                        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} // trigger
                                        placeholder="e.g. Kuala Lumpur"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-white text-xs outline-none"
                                    />
                                </div>

                                {/* custom slug */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                                        <span>URL Slug</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug} // state
                                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} // trigger
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400/60 text-slate-300 text-xs font-mono outline-none"
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
        </AdminLayout>
    );
}
