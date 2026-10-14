// --1. imports--
import { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    Users,
    UploadCloud,
    X,
    Flag,
    MapPin,
    Gamepad2,
    Shield,
    Check,
    CheckCircle2,
    Move,
    Mail,
    Globe,
    Share2,
    FolderOpen,
    Image as ImageIcon
} from 'lucide-react';
import ImagePositionerModal from '@/Components/ImagePositionerModal';
import MediaPickerModal from '@/Components/MediaPickerModal';

// --2. properties--
const TEAM_TYPES = [
    { id: 'national', label: 'National Team', desc: 'Official squad representing Malaysia in international esports tournaments.' },
    { id: 'state', label: 'State Affiliate', desc: 'Official state esports association or state representation team.' },
    { id: 'pro', label: 'Club / Pro Team', desc: 'Registered competitive esports club or professional team.' }
];

const MALAYSIA_STATES = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Penang',
    'Perak',
    'Perlis',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
    'WP Kuala Lumpur',
    'WP Labuan',
    'WP Putrajaya'
];

const GAME_DISCIPLINES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Dota 2',
    'EA Sports FC',
    'Honor of Kings',
    'Tekken 8',
    'Apex Legends',
    'Counter-Strike 2',
    'Free Fire'
];

// --3. main component--
export default function Create() {
    const fileInputLogoRef = useRef(null); // properties
    const fileInputPicRef = useRef(null); // properties

    const [logoPreview, setLogoPreview] = useState(null); // state
    const [teamPicPreview, setTeamPicPreview] = useState(null); // state
    const [showSuccess, setShowSuccess] = useState(false); // state

    const [isPositionerOpen, setIsPositionerOpen] = useState(false); // state
    const [isLogoLibraryOpen, setIsLogoLibraryOpen] = useState(false); // state
    const [isPicLibraryOpen, setIsPicLibraryOpen] = useState(false); // state
    const [positionerSource, setPositionerSource] = useState(null); // state
    const [rawFileName, setRawFileName] = useState('logo.jpg'); // state

    const { data, setData, post, processing, errors } = useForm({ // state
        name: '',
        tag: '',
        type: 'national',
        region: 'National / All Malaysia',
        game_title: '',
        games: ['Mobile Legends: Bang Bang (MLBB)'],
        manager_name: '',
        contact_email: '',
        website_url: '',
        social_links: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            tiktok: '',
            discord: ''
        },
        motto: '',
        roster_size: 5,
        status: 'ACTIVE',
        image_display_mode: 'both',
        logo: null,
        library_logo_path: null,
        team_pic: null,
        library_team_pic_path: null
    });

    // --4. actions--
    const handleTypeChange = (newType) => { // trigger
        setData((prev) => ({
            ...prev,
            type: newType,
            region: newType === 'national' ? 'National / All Malaysia' : (prev.region === 'National / All Malaysia' ? 'Selangor' : prev.region)
        })); // state
    };

    const toggleGame = (game) => { // trigger
        const currentGames = data.games || []; // state
        if (currentGames.includes(game)) { // check
            setData('games', currentGames.filter((g) => g !== game)); // state
        } else {
            setData('games', [...currentGames, game]); // state
        }
    };

    const handleLogoChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setRawFileName(file.name); // state
            setPositionerSource(file); // state
            setIsPositionerOpen(true); // state
            const reader = new FileReader(); // convert
            reader.onloadend = () => setLogoPreview(reader.result); // state
            reader.readAsDataURL(file); // convert
            setData((prev) => ({
                ...prev,
                logo: file,
                library_logo_path: null
            })); // state
        }
    };

    const handleTeamPicChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            const reader = new FileReader(); // convert
            reader.onloadend = () => setTeamPicPreview(reader.result); // state
            reader.readAsDataURL(file); // convert
            setData((prev) => ({
                ...prev,
                team_pic: file,
                library_team_pic_path: null
            })); // state
        }
    };

    const handleSelectLogoFromLibrary = (mediaItem) => { // trigger
        setLogoPreview(mediaItem.url); // state
        setData((prev) => ({
            ...prev,
            library_logo_path: mediaItem.file_path,
            logo: null
        })); // state
        setPositionerSource(mediaItem.url); // state
        setRawFileName(mediaItem.file_name); // state
        if (fileInputLogoRef.current) { // check
            fileInputLogoRef.current.value = ''; // state
        }
        setIsLogoLibraryOpen(false); // toggle
    };

    const handleSelectPicFromLibrary = (mediaItem) => { // trigger
        setTeamPicPreview(mediaItem.url); // state
        setData((prev) => ({
            ...prev,
            library_team_pic_path: mediaItem.file_path,
            team_pic: null
        })); // state
        if (fileInputPicRef.current) { // check
            fileInputPicRef.current.value = ''; // state
        }
        setIsPicLibraryOpen(false); // toggle
    };

    const handlePositionerComplete = (croppedFile, previewUrl) => { // save
        setData((prev) => ({
            ...prev,
            logo: croppedFile,
            library_logo_path: null
        })); // state
        setLogoPreview(previewUrl); // state
        setPositionerSource(croppedFile); // state
    };

    const handleRemoveLogo = () => { // trigger
        setData((prev) => ({
            ...prev,
            logo: null,
            library_logo_path: null
        })); // state
        setLogoPreview(null); // state
        if (fileInputLogoRef.current) { // check
            fileInputLogoRef.current.value = ''; // state
        }
    };

    const handleRemoveTeamPic = () => { // trigger
        setData((prev) => ({
            ...prev,
            team_pic: null,
            library_team_pic_path: null
        })); // state
        setTeamPicPreview(null); // state
        if (fileInputPicRef.current) { // check
            fileInputPicRef.current.value = ''; // state
        }
    };

    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        post(route('admin.teams.store'), { // save
            forceFormData: true,
            onSuccess: () => { // trigger
                setShowSuccess(true); // state
                setTimeout(() => { // clock
                    router.visit(route('admin.teams')); // redirect
                }, 800);
            },
        });
    };

    // --5. UI--
    return (
        <AdminLayout title="Create Team Profile - MESF Admin">
            <Head title="Create Team Profile - Admin" />

            <div className="w-full max-w-6xl pb-16 space-y-5">
                {/* header bar: tightly positioned with inline back button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BackButton href={route('admin.teams')} label="Back" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Register New Team
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Add team info, game disciplines, and media for public and homepage displays.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('admin.teams')} // redirect
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold tracking-wider transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit} // trigger
                            disabled={processing} // check
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.3)] cursor-pointer disabled:opacity-50"
                        >
                            {processing ? 'Registering...' : 'Save Team Profile'}
                        </button>
                    </div>
                </div>

                {/* success popup modal */}
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                        <div className="w-full max-w-md bg-[#0B0F1C] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-bold text-white">Successfully Created!</h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    Team profile has been created successfully. Redirecting to teams directory...
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Link
                                    href={route('admin.teams')} // redirect
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-400/20"
                                >
                                    Continue
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* main form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* left column: team information (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Card 1: Team Class Selection */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Team Class
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Choose which category this team belongs to
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {TEAM_TYPES.map((t) => {
                                        const isSelected = data.type === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => handleTypeChange(t.id)} // trigger
                                                className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-amber-400/10 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                                }`}
                                            >
                                                <div className="text-xs font-bold tracking-wide flex items-center justify-between">
                                                    <span>{t.label}</span>
                                                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                    {t.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Card 2: Dynamic Form Fields based on Team Class */}
                            {data.type === 'national' && (
                                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 animate-fadeIn">
                                    <div className="border-b border-white/10 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                                <Flag className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                    National Squad Details
                                                </h2>
                                                <p className="text-xs text-slate-400">
                                                    Official Malaysia national lineup details and games played
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Team Name */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                Team Name <span className="text-amber-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.name} // state
                                                onChange={(e) => setData('name', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                            />
                                            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                        </div>

                                        {/* Multi-select Games for National Team */}
                                        <div className="space-y-2 pt-1">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    Games Played <span className="text-amber-400">*</span>
                                                </label>
                                                <span className="text-[11px] text-amber-400 font-mono">
                                                    {data.games?.length || 0} Games Selected
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400">
                                                National teams can compete in multiple games. Click to toggle all titles played.
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                {GAME_DISCIPLINES.map((game) => {
                                                    const isChecked = (data.games || []).includes(game);
                                                    return (
                                                        <button
                                                            key={game}
                                                            type="button"
                                                            onClick={() => toggleGame(game)} // trigger
                                                            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                                                isChecked
                                                                    ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-sm'
                                                                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-300'
                                                            }`}
                                                        >
                                                            <span className="truncate">{game}</span>
                                                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] shrink-0 ml-2 ${
                                                                isChecked
                                                                    ? 'bg-amber-400 border-amber-400 text-black font-extrabold'
                                                                    : 'border-white/20'
                                                            }`}>
                                                                {isChecked && '✓'}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Website & Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Official Website</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.website_url || ''} // state
                                                    onChange={(e) => setData('website_url', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Official Email</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.contact_email} // state
                                                    onChange={(e) => setData('contact_email', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>
                                        </div>

                                        {/* Motto & Manager */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    Team Motto
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.motto} // state
                                                    onChange={(e) => setData('motto', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    Team Manager / Coach
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.manager_name} // state
                                                    onChange={(e) => setData('manager_name', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.type === 'state' && (
                                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 animate-fadeIn">
                                    <div className="border-b border-white/10 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                    State Affiliate Association
                                                </h2>
                                                <p className="text-xs text-slate-400">
                                                    State esports association identity and official representation
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Association Name */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                Association Name <span className="text-amber-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.name} // state
                                                onChange={(e) => setData('name', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                            />
                                            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    State / Territory <span className="text-amber-400">*</span>
                                                </label>
                                                <select
                                                    value={data.region} // state
                                                    onChange={(e) => setData('region', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                                >
                                                    {MALAYSIA_STATES.map((state) => (
                                                        <option key={state} value={state}>
                                                            {state}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    President / Liaison Person
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.manager_name} // state
                                                    onChange={(e) => setData('manager_name', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Official Website</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.website_url || ''} // state
                                                    onChange={(e) => setData('website_url', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Official Email</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.contact_email} // state
                                                    onChange={(e) => setData('contact_email', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                State Motto / Slogan
                                            </label>
                                            <input
                                                type="text"
                                                value={data.motto} // state
                                                onChange={(e) => setData('motto', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.type === 'pro' && (
                                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 animate-fadeIn">
                                    <div className="border-b border-white/10 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                    Club / Pro Team Details
                                                </h2>
                                                <p className="text-xs text-slate-400">
                                                    Competitive esports organization profile
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Club / Team Name */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                Club / Team Name <span className="text-amber-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.name} // state
                                                onChange={(e) => setData('name', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-white text-sm font-semibold outline-none transition-all font-sans"
                                            />
                                            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    Game Discipline <span className="text-amber-400">*</span>
                                                </label>
                                                <select
                                                    value={data.game_title} // state
                                                    onChange={(e) => setData('game_title', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                                >
                                                    <option value="">Select Primary Game</option>
                                                    {GAME_DISCIPLINES.map((game) => (
                                                        <option key={game} value={game}>
                                                            {game}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    Home State / Region
                                                </label>
                                                <select
                                                    value={data.region} // state
                                                    onChange={(e) => setData('region', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all cursor-pointer font-sans"
                                                >
                                                    {MALAYSIA_STATES.map((state) => (
                                                        <option key={state} value={state}>
                                                            {state}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    Manager / Team Leader
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.manager_name} // state
                                                    onChange={(e) => setData('manager_name', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Official Website</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data.website_url || ''} // state
                                                    onChange={(e) => setData('website_url', e.target.value)} // trigger
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-amber-400" />
                                                <span>Official Email</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={data.contact_email} // state
                                                onChange={(e) => setData('contact_email', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Card 3: Social Media Channels (For All Team Classes) */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                                Social Media
                                            </h2>
                                            <p className="text-xs text-slate-400">
                                                Official accounts and social channels
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Instagram URL / Handle
                                        </label>
                                        <input
                                            type="text"
                                            value={data.social_links?.instagram || ''} // state
                                            onChange={(e) => setData('social_links', { ...data.social_links, instagram: e.target.value })} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Facebook Page URL
                                        </label>
                                        <input
                                            type="text"
                                            value={data.social_links?.facebook || ''} // state
                                            onChange={(e) => setData('social_links', { ...data.social_links, facebook: e.target.value })} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            X / Twitter URL
                                        </label>
                                        <input
                                            type="text"
                                            value={data.social_links?.twitter || ''} // state
                                            onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            YouTube / TikTok / Discord
                                        </label>
                                        <input
                                            type="text"
                                            value={data.social_links?.youtube || ''} // state
                                            onChange={(e) => setData('social_links', { ...data.social_links, youtube: e.target.value })} // trigger
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-sm outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right column: emblem, team picture & status (5 cols, bigger and spacious) */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                            {/* image mode selector card - made bigger and spacious */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                                <div className="border-b border-white/10 pb-3.5">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                        Team Images & Display
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Choose if you want to upload a Logo, a Team Picture, or Both.
                                    </p>
                                </div>

                                {/* display options: Both, Logo, Team Pic */}
                                <div className="grid grid-cols-3 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setData('image_display_mode', 'both')} // trigger
                                        className={`py-2.5 px-2 rounded-xl font-bold transition-colors cursor-pointer text-center ${
                                            data.image_display_mode === 'both'
                                                ? 'bg-amber-400 text-black shadow-sm'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Both
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('image_display_mode', 'logo')} // trigger
                                        className={`py-2.5 px-2 rounded-xl font-bold transition-colors cursor-pointer text-center ${
                                            data.image_display_mode === 'logo'
                                                ? 'bg-amber-400 text-black shadow-sm'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Logo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('image_display_mode', 'pic')} // trigger
                                        className={`py-2.5 px-2 rounded-xl font-bold transition-colors cursor-pointer text-center ${
                                            data.image_display_mode === 'pic'
                                                ? 'bg-amber-400 text-black shadow-sm'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Team Pic
                                    </button>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-slate-400 space-y-1.5 leading-relaxed">
                                    <p>• <span className="text-slate-200 font-semibold">Logo</span> appears on public teams directory card.</p>
                                    <p>• <span className="text-slate-200 font-semibold">Team Picture</span> appears on homepage roster (national teams) and detail page.</p>
                                </div>

                                {/* 1. Logo upload slot */}
                                {(data.image_display_mode === 'both' || data.image_display_mode === 'logo') && (
                                    <div className="space-y-3 pt-3 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                Team Logo
                                            </span>
                                            <span className="text-[11px] text-slate-500 font-mono">1:1 Square</span>
                                        </div>

                                        {logoPreview ? (
                                            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 p-5 flex items-center justify-center">
                                                <img src={logoPreview} alt="Logo Preview" className="w-28 h-28 object-contain" />
                                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPositionerSource(logoPreview); // state
                                                            setIsPositionerOpen(true); // trigger
                                                        }}
                                                        className="p-2 rounded-xl bg-black/70 hover:bg-black text-white text-xs border border-white/20 cursor-pointer shadow-md"
                                                        title="Crop"
                                                    >
                                                        <Move className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveLogo} // trigger
                                                        className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs cursor-pointer shadow-md"
                                                        title="Remove"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-white/15 rounded-2xl p-5 text-center bg-white/[0.02] space-y-2.5">
                                                <div className="flex items-center justify-center gap-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputLogoRef.current?.click()} // trigger
                                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                    >
                                                        <UploadCloud className="w-4 h-4 text-amber-400" />
                                                        <span>Upload</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsLogoLibraryOpen(true)} // trigger
                                                        className="px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                    >
                                                        <FolderOpen className="w-4 h-4" />
                                                        <span>Library</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputLogoRef} // properties
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange} // trigger
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* 2. Team Picture upload slot */}
                                {(data.image_display_mode === 'both' || data.image_display_mode === 'pic') && (
                                    <div className="space-y-3 pt-3 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                Team Picture
                                            </span>
                                            <span className="text-[11px] text-slate-500 font-mono">16:9 Landscape</span>
                                        </div>

                                        {teamPicPreview ? (
                                            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 aspect-[16/9] flex items-center justify-center">
                                                <img src={teamPicPreview} alt="Team Photo Preview" className="w-full h-full object-cover" />
                                                <div className="absolute top-2.5 right-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveTeamPic} // trigger
                                                        className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs cursor-pointer shadow-lg"
                                                        title="Remove"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-white/15 rounded-2xl p-5 text-center bg-white/[0.02] space-y-2.5">
                                                <div className="flex items-center justify-center gap-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputPicRef.current?.click()} // trigger
                                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                    >
                                                        <UploadCloud className="w-4 h-4 text-amber-400" />
                                                        <span>Upload</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsPicLibraryOpen(true)} // trigger
                                                        className="px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                    >
                                                        <FolderOpen className="w-4 h-4" />
                                                        <span>Library</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputPicRef} // properties
                                            type="file"
                                            accept="image/*"
                                            onChange={handleTeamPicChange} // trigger
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Status & Registration Card */}
                            <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                        Status & Registration
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Current team standing and active roster size.
                                    </p>
                                </div>

                                <div className="space-y-3.5">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Status
                                        </label>
                                        <select
                                            value={data.status} // state
                                            onChange={(e) => setData('status', e.target.value)} // trigger
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1424] border border-white/10 focus:border-amber-400/60 text-white text-xs sm:text-sm outline-none transition-all cursor-pointer font-sans"
                                        >
                                            <option value="ACTIVE">Active & Sanctioned</option>
                                            <option value="PENDING">Pending Verification</option>
                                            <option value="INACTIVE">Inactive / Hiatus</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">
                                            Player Count
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={25}
                                            value={data.roster_size} // state
                                            onChange={(e) => setData('roster_size', parseInt(e.target.value) || 5)} // trigger
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 text-white text-xs sm:text-sm outline-none transition-all font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-white/10 space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={processing} // check
                                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(251,191,36,0.35)] cursor-pointer disabled:opacity-50"
                                    >
                                        {processing ? 'Registering Team...' : 'Save Team Profile'}
                                    </button>

                                    <Link
                                        href={route('admin.teams')} // redirect
                                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white font-semibold text-xs tracking-wider transition-all text-center block"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* logo repositioner modal */}
            <ImagePositionerModal
                isOpen={isPositionerOpen}
                onClose={() => setIsPositionerOpen(false)}
                imageSource={positionerSource}
                fileName={rawFileName}
                aspectRatio={1 / 1}
                aspectRatioLabel="1:1 Square Logo"
                title="Reposition Team Logo"
                outputWidth={800}
                onComplete={handlePositionerComplete}
            />

            {/* media library picker modal for logo */}
            <MediaPickerModal
                isOpen={isLogoLibraryOpen}
                onClose={() => setIsLogoLibraryOpen(false)}
                onSelect={handleSelectLogoFromLibrary}
            />

            {/* media library picker modal for team pic */}
            <MediaPickerModal
                isOpen={isPicLibraryOpen}
                onClose={() => setIsPicLibraryOpen(false)}
                onSelect={handleSelectPicFromLibrary}
            />
        </AdminLayout>
    );
}
