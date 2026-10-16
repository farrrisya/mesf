// --1. imports--
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import Footer from '@/Components/Footer';
import BackButton from '@/Components/BackButton';
import { useState, useRef, useMemo } from 'react';
import {
    Shield,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ExternalLink,
    Image as ImageIcon,
    Camera,
    X,
    Check,
    Save,
    Users,
    MapPin,
    Gamepad2,
    Globe,
    Trash2,
    AlertTriangle,
    Clock
} from 'lucide-react';

// --2. properties--
const GAME_DISCIPLINES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Honor of Kings',
    'Tekken 8',
    'Dota 2',
    'EA Sports FC',
    'Counter-Strike 2',
    'Apex Legends',
    'Free Fire'
];

const MALAYSIA_STATES = [
    'National / All Malaysia',
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

// --3. main component--
export default function ManageTeam({ team = {} }) {
    const { flash = {} } = usePage().props; // properties

    const logoInputRef = useRef(null); // properties
    const picInputRef = useRef(null); // properties

    const [logoPreview, setLogoPreview] = useState(team.logo_url || null); // state
    const [picPreview, setPicPreview] = useState(team.team_pic_url || null); // state
    const [showDeleteModal, setShowDeleteModal] = useState(false); // state
    const [isDeleting, setIsDeleting] = useState(false); // state
    const [teamSaved, setTeamSaved] = useState(false); // state

    const { data, setData, post, processing, errors } = useForm({
        name: team.name || '', // state
        motto: team.motto || '', // state
        manager_name: team.manager_name || '', // state
        contact_email: team.contact_email || '', // state
        players: team.roster_size || 5, // state
        website_url: team.website_url || '', // state
        games: team.games?.length > 0 ? team.games : [team.game_title].filter(Boolean), // state
        regions: team.regions?.length > 0 ? team.regions : [team.region].filter(Boolean), // state
        social_links: {
            instagram: team.social_links?.instagram || '', // state
            discord: team.social_links?.discord || '', // state
            facebook: team.social_links?.facebook || '', // state
            tiktok: team.social_links?.tiktok || '' // state
        },
        logo: null, // state
        team_pic: null // state
    });

    // check if squad details changed
    const isTeamChanged = useMemo(() => {
        // check files
        if (data.logo || data.team_pic) return true; // check

        // check scalar fields
        if ((data.name || '') !== (team.name || '')) return true; // check
        if ((data.motto || '') !== (team.motto || '')) return true; // check
        if ((data.manager_name || '') !== (team.manager_name || '')) return true; // check
        if ((data.contact_email || '') !== (team.contact_email || '')) return true; // check
        if (Number(data.players || 5) !== Number(team.roster_size || 5)) return true; // check
        if ((data.website_url || '') !== (team.website_url || '')) return true; // check

        // check games array
        const initialGames = team.games?.length > 0 ? team.games : [team.game_title].filter(Boolean); // properties
        const currentGames = data.games || []; // properties
        if (initialGames.length !== currentGames.length) return true; // check
        const sortedInitGames = [...initialGames].sort(); // convert
        const sortedCurrGames = [...currentGames].sort(); // convert
        if (sortedInitGames.some((g, i) => g !== sortedCurrGames[i])) return true; // check

        // check regions array
        const initialRegions = team.regions?.length > 0 ? team.regions : [team.region].filter(Boolean); // properties
        const currentRegions = data.regions || []; // properties
        if (initialRegions.length !== currentRegions.length) return true; // check
        const sortedInitRegions = [...initialRegions].sort(); // convert
        const sortedCurrRegions = [...currentRegions].sort(); // convert
        if (sortedInitRegions.some((r, i) => r !== sortedCurrRegions[i])) return true; // check

        // check social links
        const initSocial = team.social_links || {}; // properties
        const currSocial = data.social_links || {}; // properties
        if ((currSocial.instagram || '') !== (initSocial.instagram || '')) return true; // check
        if ((currSocial.discord || '') !== (initSocial.discord || '')) return true; // check
        if ((currSocial.facebook || '') !== (initSocial.facebook || '')) return true; // check
        if ((currSocial.tiktok || '') !== (initSocial.tiktok || '')) return true; // check

        return false; // check
    }, [data, team]);

    // --4. actions--
    const toggleGame = (game) => { // trigger
        const current = data.games || []; // state
        if (current.includes(game)) { // check
            setData('games', current.filter((g) => g !== game)); // save
        } else {
            setData('games', [...current, game]); // save
        }
    };

    const toggleRegion = (st) => { // trigger
        if (st === 'National / All Malaysia') { // check
            setData('regions', ['National / All Malaysia']); // save
            return;
        }
        const current = (data.regions || []).filter((r) => r !== 'National / All Malaysia'); // state
        if (current.includes(st)) { // check
            const next = current.filter((r) => r !== st); // state
            setData('regions', next.length > 0 ? next : [st]); // save
        } else {
            setData('regions', [...current, st]); // save
        }
    };

    const handleLogoChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setData('logo', file); // state
            const reader = new FileReader(); // convert
            reader.onload = (uploadEvent) => { // trigger
                setLogoPreview(uploadEvent.target?.result); // state
            };
            reader.readAsDataURL(file); // convert
        }
    };

    const handlePicChange = (e) => { // trigger
        const file = e.target.files?.[0]; // state
        if (file) { // check
            setData('team_pic', file); // state
            const reader = new FileReader(); // convert
            reader.onload = (uploadEvent) => { // trigger
                setPicPreview(uploadEvent.target?.result); // state
            };
            reader.readAsDataURL(file); // convert
        }
    };

    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // trigger
        post(`/my-teams/${team.id}/manage`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setTeamSaved(true); // save
                setTimeout(() => setTeamSaved(false), 3000); // clock
            }
        }); // save
    };

    const handleRequestDelete = () => { // trigger
        setIsDeleting(true); // state
        router.post(`/my-teams/${team.id}/request-delete`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false); // state
                setShowDeleteModal(false); // toggle
            }
        }); // save
    };

    const handleCancelDelete = () => { // trigger
        router.post(`/my-teams/${team.id}/cancel-delete`, {}, {
            preserveScroll: true
        }); // save
    };

    // --5. UI--
    const isDeletionRequested = team.status === 'DELETION_REQUESTED' || team.status === 'deletion_requested';
    const isPending = team.status === 'PENDING' || team.status === 'pending';

    return (
        <div className="relative min-h-screen w-full bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden">
            <Head title={`Manage ${team.name} - MESF`} />

            {/* Custom Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[12%] left-[8%] w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[20%] right-[8%] w-[520px] h-[520px] bg-blue-600/10 rounded-full blur-[160px]" />
            </div>

            {/* Floating Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar />
            </div>

            {/* Hero Header */}
            <header className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-32 sm:pt-36 pb-8">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <BackButton href="/profile" label="Back to Profile" />
                    <Link
                        href={`/teams/${team.slug || team.id}`} // redirect
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer font-sans"
                    >
                        <span>View Public Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="pb-6 border-b border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                            [ FEDERATION CLUB MANAGEMENT ]
                        </span>
                        {isDeletionRequested ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold uppercase animate-pulse flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                                <span>Deletion Requested</span>
                            </span>
                        ) : isPending ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>Pending Admin Approval</span>
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Approved &amp; Active</span>
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white leading-tight">
                        Manage {team.name}
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-normal leading-relaxed">
                        Update your official squad information, competitive titles, home jurisdiction, and contact credentials. Any submitted edits require administrator approval before going live.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pb-28 space-y-8">
                {/* Notice Banners */}
                {isDeletionRequested && (
                    <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 backdrop-blur-2xl animate-fadeIn shadow-xl flex items-start gap-3.5">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                            <h3 className="text-sm font-bold text-white">Removal Request Submitted</h3>
                            <p className="text-neutral-300 leading-relaxed">
                                A request to remove/disband this squad has been submitted to the MESF administration. You can cancel this request anytime before the administrator reviews it.
                            </p>
                        </div>
                    </div>
                )}

                {isPending && !isDeletionRequested && (
                    <div className="p-5 rounded-3xl bg-amber-400/10 border border-amber-400/30 text-amber-300 backdrop-blur-2xl animate-fadeIn shadow-xl flex items-start gap-3.5">
                        <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                            <h3 className="text-sm font-bold text-white">Updates Pending Administrator Review</h3>
                            <p className="text-neutral-300 leading-relaxed">
                                Your recent changes have been saved and submitted. An MESF administrator will review and approve the updates before they appear publicly.
                            </p>
                        </div>
                    </div>
                )}

                {/* Success Banner */}
                {flash?.success && (
                    <div className="p-6 sm:p-7 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 backdrop-blur-2xl animate-fadeIn shadow-2xl">
                        <div className="flex items-start gap-3.5">
                            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-0.5" />
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-white">Request Received</h3>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                    {flash.success}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#090D18]/90 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
                    {/* Section 1: Team Identity & Media */}
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                Team Identity &amp; Branding
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Club name, logo emblem, squad photo, and official motto.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Team Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Official Team Name <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name} // state
                                    onChange={(e) => setData('name', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-white text-sm outline-none transition-all font-sans"
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Logos & Pictures */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Team Emblem */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                        Team Logo / Emblem
                                    </label>
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3.5">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Team Logo" className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-neutral-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-neutral-300">Square Emblem</p>
                                            <input
                                                ref={logoInputRef} // properties
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange} // trigger
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => logoInputRef.current?.click()} // trigger
                                                className="mt-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer font-sans"
                                            >
                                                Change Logo
                                            </button>
                                        </div>
                                    </div>
                                    {errors.logo && (
                                        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                            <AlertCircle className="w-3.5 h-3.5" />{errors.logo}
                                        </p>
                                    )}
                                </div>

                                {/* Squad Photo */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                        Official Squad Photo
                                    </label>
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3.5">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            {picPreview ? (
                                                <img src={picPreview} alt="Squad Photo" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-6 h-6 text-neutral-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-neutral-300">Roster Picture</p>
                                            <input
                                                ref={picInputRef} // properties
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePicChange} // trigger
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => picInputRef.current?.click()} // trigger
                                                className="mt-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer font-sans"
                                            >
                                                {picPreview ? 'Change Photo' : 'Upload Photo'}
                                            </button>
                                        </div>
                                    </div>
                                    {errors.team_pic && (
                                        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                            <AlertCircle className="w-3.5 h-3.5" />{errors.team_pic}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Motto */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Motto / Slogan (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.motto} // state
                                    onChange={(e) => setData('motto', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 text-white text-sm outline-none transition-all font-sans"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Section 2: Esports Disciplines (Multi-select) */}
                    <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                    Esports Disciplines <span className="text-amber-400 font-bold">*</span>
                                </h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Toggle competitive games your team participates in.
                                </p>
                            </div>
                            <span className="text-xs text-amber-400 font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                                {data.games?.length || 0} Selected
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {GAME_DISCIPLINES.map((game) => {
                                const isChecked = (data.games || []).includes(game);
                                return (
                                    <button
                                        key={game}
                                        type="button"
                                        onClick={() => toggleGame(game)} // trigger
                                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer font-sans ${
                                            isChecked
                                                ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-sm font-semibold'
                                                : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
                                        }`}
                                    >
                                        <span className="truncate">{game}</span>
                                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] shrink-0 ml-2 ${
                                            isChecked
                                                ? 'bg-amber-400 border-amber-400 text-black font-extrabold'
                                                : 'border-white/20'
                                        }`}>
                                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Section 3: Territory / State (Multi-select) */}
                    <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                    Territory / State <span className="text-amber-400 font-bold">*</span>
                                </h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Select home state or competitive jurisdiction.
                                </p>
                            </div>
                            <span className="text-xs text-amber-400 font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                                {data.regions?.length || 0} Selected
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                            {MALAYSIA_STATES.map((st) => {
                                const isChecked = (data.regions || []).includes(st);
                                return (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => toggleRegion(st)} // trigger
                                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer font-sans ${
                                            isChecked
                                                ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-sm font-semibold'
                                                : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
                                        }`}
                                    >
                                        <span className="truncate">{st}</span>
                                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] shrink-0 ml-1.5 ${
                                            isChecked
                                                ? 'bg-amber-400 border-amber-400 text-black font-extrabold'
                                                : 'border-white/20'
                                        }`}>
                                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Section 4: Manager & Contact */}
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                                Manager &amp; Contact Details
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Federation point of contact and official website links.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Manager Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Manager / Representative Full Name <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.manager_name} // state
                                    onChange={(e) => setData('manager_name', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-white text-sm outline-none transition-all font-sans"
                                />
                                {errors.manager_name && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.manager_name}
                                    </p>
                                )}
                            </div>

                            {/* Contact Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Official Contact Email <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={data.contact_email} // state
                                    onChange={(e) => setData('contact_email', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-white text-sm outline-none transition-all font-sans"
                                />
                                {errors.contact_email && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-sans">
                                        <AlertCircle className="w-3.5 h-3.5" />{errors.contact_email}
                                    </p>
                                )}
                            </div>

                            {/* Players */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Players <span className="text-amber-400 font-bold">*</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={50}
                                    required
                                    value={data.players} // state
                                    onChange={(e) => setData('players', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 text-white text-sm outline-none transition-all font-sans"
                                />
                            </div>

                            {/* Website */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Official Website URL
                                </label>
                                <input
                                    type="url"
                                    value={data.website_url} // state
                                    onChange={(e) => setData('website_url', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 text-white text-sm outline-none transition-all font-sans"
                                />
                            </div>

                            {/* Instagram */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    value={data.social_links.instagram} // state
                                    onChange={(e) => setData('social_links', { ...data.social_links, instagram: e.target.value })} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 text-white text-sm outline-none transition-all font-sans"
                                />
                            </div>

                            {/* Discord */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-300 tracking-wide">
                                    Discord Community
                                </label>
                                <input
                                    type="text"
                                    value={data.social_links.discord} // state
                                    onChange={(e) => setData('social_links', { ...data.social_links, discord: e.target.value })} // trigger
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400/50 text-white text-sm outline-none transition-all font-sans"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 space-y-2">
                        <button
                            type="submit"
                            disabled={processing || (!isTeamChanged && !teamSaved)} // check
                            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans ${
                                teamSaved
                                    ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-400'
                                    : !isTeamChanged
                                    ? 'bg-white/10 text-neutral-500 border border-white/5 cursor-not-allowed opacity-50'
                                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.3)]'
                            }`}
                        >
                            {teamSaved && <Check className="w-4 h-4 stroke-[3] text-black" />}
                            <span>{processing ? 'Submitting for Approval...' : teamSaved ? 'SUBMITTED' : 'Submit for Approval'}</span>
                        </button>
                        <p className="text-[11px] text-center text-neutral-400 leading-relaxed font-sans">
                            All updates submitted require administrator review and approval before becoming active in the public directory.
                        </p>
                    </div>
                </form>

                {/* Danger Zone: Squad Removal / Deletion Request */}
                <div className="bg-[#090D18]/90 border border-rose-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="space-y-1.5">
                            <h3 className="text-base font-bold text-rose-300 uppercase tracking-wide flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                <span>Request Squad Removal / Disbandment</span>
                            </h3>
                            <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                                Request the MESF administration to decommission and remove <strong className="text-white">{team.name}</strong> from the national esports directory. An administrator will review and process the removal.
                            </p>
                        </div>
                        <div className="shrink-0">
                            {isDeletionRequested ? (
                                <button
                                    type="button"
                                    onClick={handleCancelDelete} // trigger
                                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-colors border border-white/10 cursor-pointer"
                                >
                                    Cancel Deletion Request
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)} // toggle
                                    className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Request Removal</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Request Deletion Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-md rounded-3xl bg-[#090D18] border border-rose-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                                    Request Team Removal
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    Are you sure you want to request the removal of <strong className="text-white">{team.name}</strong>? An MESF administrator will review and process the permanent disbandment of this squad.
                                </p>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-300 space-y-1 font-mono">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Squad:</span>
                                <span className="text-white font-bold">{team.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Contact:</span>
                                <span className="text-amber-400">{team.contact_email}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)} // toggle
                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                            >
                                Keep Squad
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleRequestDelete} // trigger
                                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
                            >
                                {isDeleting ? 'Submitting...' : 'Confirm Removal Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
