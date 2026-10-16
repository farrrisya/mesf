// --1. imports--
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import Footer from '@/Components/Footer';
import {
    User,
    MapPin,
    IdCard,
    Mail,
    Phone,
    Lock,
    LogOut,
    CheckCircle2,
    Check,
    Key,
    Clock,
    Trophy,
    Users,
    Handshake,
    ExternalLink,
    ShieldCheck,
    Copy,
    Calendar,
    FileText,
    CheckCircle,
    XCircle,
    Camera,
    Printer,
    X,
    Trash2,
    ShieldAlert,
    QrCode,
    ChevronRight,
    AtSign,
    Smartphone,
    Shield,
    Settings,
    ArrowRight,
    Gamepad2,
    AlertTriangle
} from 'lucide-react';

// --2. properties--
const MALAYSIAN_STATES = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Perak',
    'Perlis',
    'Pulau Pinang',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
    'Wilayah Persekutuan Kuala Lumpur',
    'Wilayah Persekutuan Labuan',
    'Wilayah Persekutuan Putrajaya'
];

// --2. barcode helper--
function BarcodeSvg({ value = 'MESF-00001' }) {
    const pattern = [2, 1, 3, 1, 1, 2, 3, 2, 1, 3, 1, 2, 1, 3, 2, 1, 1, 3, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2];
    let currentX = 2;
    const bars = pattern.map((w, i) => {
        const bar = <rect key={i} x={currentX} y={0} width={w} height={34} fill="#000000" />;
        currentX += w + (i % 2 === 0 ? 2 : 1.5);
        return bar;
    });

    return (
        <div className="p-2 sm:p-2.5 rounded-xl bg-white flex flex-col items-center justify-center shrink-0 shadow-sm border border-black/10">
            <svg className="w-28 sm:w-36 h-9" viewBox="0 0 95 34" preserveAspectRatio="none">
                {bars}
            </svg>
            <span className="font-mono text-[9px] text-slate-900 font-bold tracking-widest mt-1">
                *{value}*
            </span>
        </div>
    );
}

// --3. main component--
export default function Edit({ memberProfile = {}, userInquiries = [], userTeams = [] }) {
    const { auth, settings } = usePage().props; // properties
    const currentUser = auth?.user || {}; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties

    // active workspace tab
    const [activeTab, setActiveTab] = useState('personal'); // state
    const [toastMessage, setToastMessage] = useState(null); // state
    const [copiedId, setCopiedId] = useState(false); // state
    const [showCardModal, setShowCardModal] = useState(false); // state
    const [showDeleteModal, setShowDeleteModal] = useState(false); // state
    const [avatarPreview, setAvatarPreview] = useState(memberProfile?.avatar_url || null); // state
    const [profileSaved, setProfileSaved] = useState(false); // state
    const [passwordSaved, setPasswordSaved] = useState(false); // state

    const showToast = (msg) => { // trigger
        setToastMessage(msg); // save
        setTimeout(() => setToastMessage(null), 3000); // clock
    };

    // profile information form
    const {
        data: profileData,
        setData: setProfileData,
        patch: patchProfile,
        processing: profileProcessing,
        errors: profileErrors
    } = useForm({
        gamer_tag: memberProfile?.gamer_tag || currentUser?.gamer_tag || '',
        name: memberProfile?.name || currentUser?.name || '',
        email: memberProfile?.email || currentUser?.email || '',
        state_region: memberProfile?.state_region || currentUser?.state_region || 'Selangor',
        phone_number: memberProfile?.phone_number || currentUser?.phone_number || ''
    });

    // password update form
    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    // delete account form
    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroyAccount,
        processing: deleteProcessing,
        errors: deleteErrors,
        reset: resetDelete
    } = useForm({
        password: ''
    });

    // check if personal details changed
    const isProfileChanged = useMemo(() => {
        const origGamerTag = memberProfile?.gamer_tag || currentUser?.gamer_tag || ''; // properties
        const origName = memberProfile?.name || currentUser?.name || ''; // properties
        const origEmail = memberProfile?.email || currentUser?.email || ''; // properties
        const origState = memberProfile?.state_region || currentUser?.state_region || 'Selangor'; // properties
        const origPhone = memberProfile?.phone_number || currentUser?.phone_number || ''; // properties

        return (
            (profileData.gamer_tag || '') !== (origGamerTag || '') ||
            (profileData.name || '') !== (origName || '') ||
            (profileData.email || '') !== (origEmail || '') ||
            (profileData.state_region || '') !== (origState || '') ||
            (profileData.phone_number || '') !== (origPhone || '')
        ); // check
    }, [profileData, memberProfile, currentUser]);

    // check if password fields changed
    const isPasswordChanged = useMemo(() => {
        return Boolean(
            (passwordData.current_password && passwordData.current_password.length > 0) ||
            (passwordData.password && passwordData.password.length > 0) ||
            (passwordData.password_confirmation && passwordData.password_confirmation.length > 0)
        ); // check
    }, [passwordData]);

    // --4. actions--

    const handleProfileFieldChange = (field, value) => { // trigger
        setProfileData(field, value); // state
        if (profileSaved) { // check
            setProfileSaved(false); // toggle
        }
    };

    const handleProfileSubmit = (e) => { // trigger
        e.preventDefault(); // check
        patchProfile(route('profile.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setProfileSaved(true); // save
                showToast('Changes saved successfully.'); // save
            }
        });
    };

    const handlePasswordFieldChange = (field, value) => { // trigger
        setPasswordData(field, value); // state
        if (passwordSaved) { // check
            setPasswordSaved(false); // toggle
        }
    };

    const handlePasswordSubmit = (e) => { // trigger
        e.preventDefault(); // check
        putPassword(route('password.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                resetPassword(); // save
                setPasswordSaved(true); // save
                showToast('Password updated successfully.'); // save
            }
        });
    };

    const handleDeleteAccount = (e) => { // trigger
        e.preventDefault(); // check
        destroyAccount(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false); // toggle
            },
            onError: () => {
                resetDelete(); // save
            }
        });
    };

    const handleAvatarUpload = (e) => { // trigger
        const file = e.target.files?.[0]; // check
        if (!file) return;

        const objectUrl = URL.createObjectURL(file); // convert
        setAvatarPreview(objectUrl); // save

        router.post(route('profile.update'), {
            _method: 'patch',
            avatar: file
        }, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Profile photo updated!'); // save
            },
            onError: () => {
                setAvatarPreview(memberProfile?.avatar_url || null); // save
                showToast('Could not upload photo. Please try a smaller image.'); // error
            }
        });
    };

    const handleLogout = () => { // trigger
        router.post(route('logout'), {}, { replace: true }); // redirect
    };

    const displayGamerTag = profileData.gamer_tag?.trim() || currentUser?.name || 'Member'; // properties
    const displayMemberId = memberProfile?.member_id || `MESF-${String(currentUser?.id || 1).padStart(5, '0')}`; // properties
    const displayJoinedDate = memberProfile?.joined_at || '2026'; // properties

    const handleCopyMemberId = () => { // trigger
        navigator.clipboard.writeText(displayMemberId); // save
        setCopiedId(true); // toggle
        showToast(`Copied ${displayMemberId}`); // save
        setTimeout(() => setCopiedId(false), 2000); // clock
    };

    const getInquiryTypeLabel = (type) => { // convert
        if (type === 'join_tournament') return 'Team Registration';
        if (type === 'host_tournament') return 'Host Tournament Request';
        if (type === 'partnership') return 'Partnership Proposal';
        return 'General Inquiry';
    };

    const renderStatusBadge = (status) => { // screen
        if (status === 'approved') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Approved</span>
                </span>
            );
        }
        if (status === 'reviewed') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold">
                    <Clock className="w-3 h-3" />
                    <span>Under Review</span>
                </span>
            );
        }
        if (status === 'rejected') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold">
                    <XCircle className="w-3 h-3" />
                    <span>Not Approved</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                <Clock className="w-3 h-3" />
                <span>Pending Review</span>
            </span>
        );
    };

    // --5. UI--
    return (
        <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
            <Head title={`Member Profile - ${displayGamerTag} | MESF`} />

            {/* floating navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="profile" />
            </div>

            {/* dynamic atmospheric background lighting and subtle dot grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-amber-500/15 rounded-full blur-[140px]" />
                <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[160px]" />
                <div className="absolute bottom-20 -right-40 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[160px]" />
            </div>

            {/* toast alert */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold">{toastMessage}</span>
                </div>
            )}

            {/* MAIN TWO-COLUMN MANAGEMENT WORKSPACE */}
            <main className="relative z-10 pt-32 md:pt-36 pb-24 px-6 sm:px-8 lg:px-10 max-w-7xl mx-auto w-full flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: IDENTITY & NAVIGATION (4 COLS) */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

                        {/* 1. MEMBER IDENTITY CARD */}
                        <div className="rounded-3xl bg-[#090D18]/95 border border-white/10 hover:border-amber-400/25 transition-colors p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 relative overflow-hidden backdrop-blur-xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-amber-400/30 before:to-transparent">
                            {/* subtle background glow */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                            {/* avatar and gamer name */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative group shrink-0">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-400/25 via-amber-500/15 to-transparent border border-amber-400/40 flex items-center justify-center text-amber-300 font-mono font-black text-2xl overflow-hidden shadow-inner">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt={displayGamerTag}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span>{displayGamerTag.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <label
                                        htmlFor="avatar-upload-left"
                                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg transition-colors cursor-pointer border-2 border-[#090D18]"
                                        title="Change Photo"
                                    >
                                        <Camera className="w-3 h-3" />
                                        <input
                                            id="avatar-upload-left"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/jpg"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h2 className="text-lg font-black text-white font-mono uppercase tracking-tight truncate">
                                            {displayGamerTag}
                                        </h2>
                                        <span className="px-1.5 py-0.5 rounded bg-white/[0.08] text-neutral-300 text-[9px] font-mono uppercase border border-white/10">
                                            Public Member
                                        </span>
                                    </div>
                                    <div className="text-xs text-neutral-300 mt-0.5 truncate">
                                        {profileData.name || currentUser?.name || 'Member Name'}
                                    </div>
                                    <div className="text-[11px] text-neutral-400 mt-0.5 truncate flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                                        <span className="truncate">{profileData.email || currentUser?.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* member id and digital pass buttons */}
                            <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors">
                                    <div>
                                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">Member ID</span>
                                        <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">{displayMemberId}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyMemberId}
                                        className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                                        title="Copy ID"
                                    >
                                        {copiedId ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5 text-neutral-300" />
                                        )}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowCardModal(true)}
                                    className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/30 text-neutral-200 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <IdCard className="w-4 h-4 text-amber-400" />
                                    <span>View Member Card</span>
                                </button>
                            </div>
                        </div>

                        {/* 2. NOTICEABLE & CLEAN NAVIGATION SIDEBAR */}
                        <div className="rounded-3xl bg-[#090D18]/95 border border-white/10 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-2 backdrop-blur-xl">
                            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest px-3 pt-1 block">
                                Member Settings
                            </span>

                            {/* Nav Item 1: Personal Info */}
                            <button
                                type="button"
                                onClick={() => setActiveTab('personal')}
                                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === 'personal'
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black border border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                        : 'border border-white/5 bg-white/[0.02] text-neutral-300 hover:text-amber-300 hover:border-amber-400/40 hover:bg-amber-400/[0.06] hover:shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-xl transition-colors ${
                                        activeTab === 'personal' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-neutral-400 group-hover:text-amber-400'
                                    }`}>
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="text-left">Personal Information</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${
                                    activeTab === 'personal' ? 'text-slate-950 translate-x-0.5' : 'text-neutral-500 group-hover:text-amber-400'
                                }`} />
                            </button>

                            {/* Nav Item 2: My Team & Submissions */}
                            <button
                                type="button"
                                onClick={() => setActiveTab('teams')}
                                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === 'teams'
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black border border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                        : 'border border-white/5 bg-white/[0.02] text-neutral-300 hover:text-amber-300 hover:border-amber-400/40 hover:bg-amber-400/[0.06] hover:shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-xl transition-colors ${
                                        activeTab === 'teams' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-neutral-400 group-hover:text-amber-400'
                                    }`}>
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <span className="text-left">My Team & Submissions</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {userInquiries.length > 0 && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                            activeTab === 'teams' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                        }`}>
                                            {userInquiries.length}
                                        </span>
                                    )}
                                    <ChevronRight className={`w-4 h-4 transition-transform ${
                                        activeTab === 'teams' ? 'text-slate-950 translate-x-0.5' : 'text-neutral-500 group-hover:text-amber-400'
                                    }`} />
                                </div>
                            </button>

                            {/* Nav Item 4: Password & Safety */}
                            <button
                                type="button"
                                onClick={() => setActiveTab('security')}
                                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === 'security'
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black border border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                        : 'border border-white/5 bg-white/[0.02] text-neutral-300 hover:text-amber-300 hover:border-amber-400/40 hover:bg-amber-400/[0.06] hover:shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-xl transition-colors ${
                                        activeTab === 'security' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-neutral-400 group-hover:text-amber-400'
                                    }`}>
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <span className="text-left">Password & Safety</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${
                                    activeTab === 'security' ? 'text-slate-950 translate-x-0.5' : 'text-neutral-500 group-hover:text-amber-400'
                                }`} />
                            </button>

                            {/* Sign Out */}
                            <div className="pt-2 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all cursor-pointer"
                                >
                                    <div className="p-1.5 rounded-xl bg-red-500/10 text-red-400">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FOCUSED WORKSPACE (8 COLS) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* WORKSPACE TITLE & HEADER */}
                        <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wide">
                                    {activeTab === 'personal' && 'Personal Information'}
                                    {activeTab === 'teams' && 'My Team & Applications'}
                                    {activeTab === 'security' && 'Password & Security'}
                                </h1>
                                <p className="text-xs text-neutral-400 mt-1">
                                    {activeTab === 'personal' && 'Manage your account credentials, contact information, and home state.'}
                                    {activeTab === 'teams' && 'View your approved team and track submitted registrations.'}
                                    {activeTab === 'security' && 'Update your password and manage account security settings.'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 text-xs font-mono font-medium">
                                    Active Member
                                </span>
                            </div>
                        </div>

                        {/* SECTION 1: PERSONAL INFORMATION */}
                        {activeTab === 'personal' && (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                {/* CARD A: ATHLETE IDENTITY */}
                                <div className="rounded-3xl bg-[#090D18]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-lg backdrop-blur-xl">
                                    <div className="pb-3 border-b border-white/10">
                                        <h2 className="text-base font-bold text-white uppercase tracking-wide">
                                            Athlete Identity
                                        </h2>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Your official gaming handle and registered legal name.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Gamer Tag */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                                                Username / Gamer Tag
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                                                    <AtSign className="w-4 h-4 text-amber-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profileData.gamer_tag}
                                                    onChange={(e) => handleProfileFieldChange('gamer_tag', e.target.value)}
                                                    placeholder="e.g. ViperX"
                                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white/[0.06] transition-all font-mono"
                                                />
                                            </div>
                                            {profileErrors.gamer_tag && (
                                                <p className="text-xs text-red-400">{profileErrors.gamer_tag}</p>
                                            )}
                                        </div>

                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                                                Full Name <span className="text-amber-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                                                    <User className="w-4 h-4 text-amber-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                                                    placeholder="Your full name"
                                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white/[0.06] transition-all"
                                                    required
                                                />
                                            </div>
                                            {profileErrors.name && (
                                                <p className="text-xs text-red-400">{profileErrors.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CARD B: CONTACT COORDINATES & HOME STATE */}
                                <div className="rounded-3xl bg-[#090D18]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-lg backdrop-blur-xl">
                                    <div className="pb-3 border-b border-white/10">
                                        <h2 className="text-base font-bold text-white uppercase tracking-wide">
                                            Contact & Home State
                                        </h2>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Official contact channels and registered home state for federation events.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                                                Email Address <span className="text-amber-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                                                    <Mail className="w-4 h-4 text-amber-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white/[0.06] transition-all"
                                                    required
                                                />
                                            </div>
                                            {profileErrors.email && (
                                                <p className="text-xs text-red-400">{profileErrors.email}</p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                                                Phone / WhatsApp
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                                                    <Phone className="w-4 h-4 text-amber-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profileData.phone_number}
                                                    onChange={(e) => handleProfileFieldChange('phone_number', e.target.value)}
                                                    placeholder="e.g. 012-3456789"
                                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white/[0.06] transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Home State */}
                                        <div className="sm:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                                                Home State Region
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                                                    <MapPin className="w-4 h-4 text-amber-400" />
                                                </div>
                                                <select
                                                    value={profileData.state_region}
                                                    onChange={(e) => handleProfileFieldChange('state_region', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#070B14] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer"
                                                >
                                                    {MALAYSIAN_STATES.map((state) => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SAVE ACTION BAR */}
                                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/90 border border-white/10 shadow-lg backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            Review your athlete identity details before saving. Changes take effect on your profile immediately.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={(!isProfileChanged && !profileSaved) || profileProcessing} // check
                                        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                                            profileSaved
                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                : !isProfileChanged || profileProcessing
                                                    ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                                                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_4px_16px_rgba(251,191,36,0.3)]'
                                        }`}
                                    >
                                        {profileSaved ? (
                                            <>
                                                <span>✓</span>
                                                <span>SAVED</span>
                                            </>
                                        ) : profileProcessing ? (
                                            <span>Saving...</span>
                                        ) : (
                                            <span>Save Changes</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* SECTION 2: MY TEAM & SUBMISSIONS */}
                        {activeTab === 'teams' && (
                            <div className="space-y-6">
                                {/* CARD 1: SQUAD STATUS */}
                                <div className="rounded-3xl bg-[#090D18]/90 border border-white/10 p-6 sm:p-8 space-y-5 shadow-lg">
                                    <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-base font-bold text-white uppercase tracking-wide">
                                                Registered Competitive Squad
                                            </h2>
                                            <p className="text-xs text-neutral-400 mt-0.5">
                                                Your official esports club affiliation in the federation directory.
                                            </p>
                                        </div>
                                        <Link
                                            href="/register-team"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all cursor-pointer shrink-0"
                                        >
                                            <Users className="w-3.5 h-3.5" />
                                            <span>Register Team</span>
                                        </Link>
                                    </div>

                                    {userTeams && userTeams.length > 0 ? (
                                        <div className="space-y-4">
                                            {userTeams.map((team) => {
                                                const isDeletionRequested = team.status === 'DELETION_REQUESTED' || team.status === 'deletion_requested';
                                                const isPending = team.status === 'PENDING' || team.status === 'pending';
                                                const isRejected = team.status === 'REJECTED' || team.status === 'rejected';

                                                return (
                                                    <div
                                                        key={team.id}
                                                        onClick={() => router.visit(`/my-teams/${team.id}/manage`)} // redirect
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                router.visit(`/my-teams/${team.id}/manage`); // redirect
                                                            }
                                                        }}
                                                        className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-amber-400/50 hover:bg-white/[0.05] transition-colors space-y-5 shadow-lg cursor-pointer group text-left w-full block"
                                                    >
                                                        {/* Top Team Header */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                             <div className="flex items-center gap-4 min-w-0">
                                                                <div className="h-16 w-16 rounded-2xl bg-[#0d1424] border border-white/15 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                                                                    {team.logo_path ? (
                                                                        <img src={team.logo_path} alt={team.name} className="w-12 h-12 object-contain" />
                                                                    ) : (
                                                                        <div className="text-amber-300 font-mono font-black text-xl">
                                                                            {team.tag || team.name?.substring(0, 2).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight truncate group-hover:text-amber-300 transition-colors">
                                                                            {team.name}
                                                                        </h3>
                                                                        {team.tag && (
                                                                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-400 font-bold">
                                                                                [{team.tag}]
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {team.motto && (
                                                                        <p className="text-xs text-neutral-400 italic mt-0.5">
                                                                            "{team.motto}"
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Status Badge */}
                                                            <div className="flex items-center gap-3 shrink-0">
                                                                {isDeletionRequested ? (
                                                                    <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold uppercase flex items-center gap-1.5 animate-pulse">
                                                                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                                                        <span>Deletion Requested</span>
                                                                    </span>
                                                                ) : isPending ? (
                                                                    <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                                                                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                                                                        <span>Pending Review</span>
                                                                    </span>
                                                                ) : isRejected ? (
                                                                    <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                                                                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                                                        <span>Rejected</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                                        <span>Approved & Active</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Full Details Grid */}
                                                        <div className="pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                                                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Esports Title</span>
                                                                <span className="font-semibold text-white truncate block">{team.game_title || 'Esports'}</span>
                                                            </div>
                                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                                                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Territory</span>
                                                                <span className="font-semibold text-white truncate block">{team.region || 'National'}</span>
                                                            </div>
                                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                                                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Manager</span>
                                                                <span className="font-semibold text-white truncate block">{team.manager_name || 'Team Leader'}</span>
                                                            </div>
                                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                                                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Players</span>
                                                                <span className="font-semibold text-white truncate block">{team.roster_size || 5} Players</span>
                                                            </div>
                                                        </div>

                                                        {/* Clickable Card Footer */}
                                                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-400 border-t border-white/5 gap-2">
                                                            <span className="flex items-center gap-1.5 text-neutral-400">
                                                                <Shield className="w-3.5 h-3.5 text-amber-400" />
                                                                <span>Click this box to edit roster, request updates or request removal</span>
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                                                                <span>Manage Squad</span>
                                                                <ArrowRight className="w-3.5 h-3.5" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                                            <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                                                <Trophy className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                                    No Registered Squad Yet
                                                </h3>
                                                <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
                                                    You don't have a team in the federation directory yet. Register your team to enter state and national qualifiers.
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <Link
                                                    href="/register-team"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                                                >
                                                    <Users className="w-4 h-4" />
                                                    <span>Register a Team Now</span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* CARD 2: LIVE APPLICATION REVIEW TRACKER */}
                                <div className="rounded-3xl bg-[#090D18]/90 border border-white/10 p-6 sm:p-8 space-y-5 shadow-lg">
                                    <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-base font-bold text-white uppercase tracking-wide">
                                                Submitted Applications Tracker
                                            </h2>
                                            <p className="text-xs text-neutral-400 mt-0.5">
                                                Track review progress and notes from MESF tournament officials.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                                                {userInquiries.length} {userInquiries.length === 1 ? 'Record' : 'Records'}
                                            </span>
                                        </div>
                                    </div>

                                    {userInquiries && userInquiries.length > 0 ? (
                                        <div className="space-y-3">
                                            {userInquiries.map((inquiry) => (
                                                <div
                                                    key={inquiry.id}
                                                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-400/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                >
                                                    <div className="space-y-2 min-w-0">
                                                        <div className="flex items-center gap-2.5 flex-wrap">
                                                            <span className="text-xs font-bold text-white uppercase tracking-wide">
                                                                {getInquiryTypeLabel(inquiry.type)}
                                                            </span>
                                                            {renderStatusBadge(inquiry.status)}
                                                        </div>

                                                        <div className="text-xs text-neutral-300">
                                                            {inquiry.team_name && (
                                                                <span>Team: <strong className="text-white">{inquiry.team_name}</strong> • </span>
                                                            )}
                                                            {inquiry.game_title && (
                                                                <span>{inquiry.game_title} • </span>
                                                            )}
                                                            {inquiry.state && (
                                                                <span>{inquiry.state} • </span>
                                                            )}
                                                            {inquiry.proposed_event_name && (
                                                                <span>Event: <strong className="text-white">{inquiry.proposed_event_name}</strong> • </span>
                                                            )}
                                                            {inquiry.organization && (
                                                                <span>Org: {inquiry.organization}</span>
                                                            )}
                                                        </div>

                                                        {inquiry.admin_notes && (
                                                            <div className="text-[11px] text-amber-300/90 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20 mt-1">
                                                                <strong>MESF Secretariat Note:</strong> {inquiry.admin_notes}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                                                        <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                                                             Submitted On
                                                        </span>
                                                        <span className="text-xs text-neutral-200 font-mono">
                                                            {inquiry.created_at || 'Recently'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1 max-w-sm mx-auto">
                                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                                    No Submissions on Record Yet
                                                </h4>
                                                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                                                    You haven't submitted any tournament applications or federation inquiries. Explore our programs and get involved today.
                                                </p>
                                            </div>
                                            <div className="pt-1">
                                                <Link
                                                    href="/get-involved"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                                                >
                                                    <Handshake className="w-4 h-4 text-black stroke-[2.5]" />
                                                    <span>Get Involved</span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: PASSWORD & SAFETY */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                {/* CARD 1: CHANGE PASSWORD */}
                                <div className="rounded-3xl bg-[#090D18]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-lg">
                                    <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-base font-bold text-white uppercase tracking-wide">
                                                Change Password
                                            </h2>
                                            <p className="text-xs text-neutral-400 mt-0.5">
                                                Ensure your account uses a secure password with at least 8 characters.
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-mono text-neutral-400 uppercase">
                                            Min 8 Characters
                                        </span>
                                    </div>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        value={passwordData.current_password}
                                                        onChange={(e) => handlePasswordFieldChange('current_password', e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white/[0.06] transition-all"
                                                    />
                                                </div>
                                                {passwordErrors.current_password && (
                                                    <p className="mt-1.5 text-xs text-red-400">{passwordErrors.current_password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        value={passwordData.password}
                                                        onChange={(e) => handlePasswordFieldChange('password', e.target.value)}
                                                        placeholder="Min 8 characters"
                                                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white/[0.06] transition-all"
                                                    />
                                                </div>
                                                {passwordErrors.password && (
                                                    <p className="mt-1.5 text-xs text-red-400">{passwordErrors.password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        value={passwordData.password_confirmation}
                                                        onChange={(e) => handlePasswordFieldChange('password_confirmation', e.target.value)}
                                                        placeholder="Repeat new password"
                                                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white/[0.06] transition-all"
                                                    />
                                                </div>
                                                {passwordErrors.password_confirmation && (
                                                    <p className="mt-1.5 text-xs text-red-400">{passwordErrors.password_confirmation}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* PASSWORD FEEDBACK CHECKLIST */}
                                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`h-2 w-2 rounded-full ${passwordData.password.length >= 8 ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                                                <span className={passwordData.password.length >= 8 ? 'text-emerald-400' : 'text-neutral-500'}>
                                                    At least 8 characters
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`h-2 w-2 rounded-full ${passwordData.password && passwordData.password === passwordData.password_confirmation ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                                                <span className={passwordData.password && passwordData.password === passwordData.password_confirmation ? 'text-emerald-400' : 'text-neutral-500'}>
                                                    Passwords match
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={(!isPasswordChanged && !passwordSaved) || passwordProcessing} // check
                                                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                                    passwordSaved
                                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                        : !isPasswordChanged || passwordProcessing
                                                            ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                                                            : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-[0_4px_16px_rgba(251,191,36,0.3)]'
                                                }`}
                                            >
                                                {passwordSaved ? (
                                                    <>
                                                        <span>✓</span>
                                                        <span>SAVED</span>
                                                    </>
                                                ) : passwordProcessing ? (
                                                    <span>Updating...</span>
                                                ) : (
                                                    <span>Update Password</span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* CARD 2: AUTO LOG OUT NOTICE */}
                                <div className="rounded-3xl bg-[#090D18]/90 border border-white/10 p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3.5">
                                        <div className="h-10 w-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                                5-Minute Inactivity Safeguard
                                            </h3>
                                            <p className="text-xs text-neutral-400 mt-0.5 max-w-lg leading-relaxed">
                                                For your security on shared tournament PCs and LAN centers, sessions automatically sign out after 5 minutes of no activity.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors cursor-pointer shrink-0"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Sign Out Now</span>
                                    </button>
                                </div>

                                {/* CARD 3: DANGER ZONE: DELETE ACCOUNT */}
                                <div className="rounded-3xl bg-red-950/20 border border-red-500/25 p-6 sm:p-7 space-y-4 shadow-lg">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                                                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                                                <span>Delete Account</span>
                                            </h3>
                                            <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                                                Permanently delete your member identity, game passes, and tournament application records. This action cannot be reversed.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(true)}
                                            className="px-4 py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Delete Account</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* DIGITAL MEMBER CARD MODAL */}
            {showCardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <style>{`
                        @media print {
                            body * {
                                visibility: hidden !important;
                            }
                            #printable-member-card, #printable-member-card * {
                                visibility: visible !important;
                            }
                            #printable-member-card {
                                position: fixed !important;
                                left: 50% !important;
                                top: 50% !important;
                                transform: translate(-50%, -50%) !important;
                                width: 100% !important;
                                max-width: 440px !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                box-shadow: none !important;
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                        }
                    `}</style>
                    <div className="relative w-full max-w-lg rounded-3xl bg-[#090D18] border border-white/10 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-5 my-auto">
                        {/* modal top bar */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <IdCard className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                    Digital Member Card
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCardModal(false)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* CLEAN MEMBER CARD CONTAINER */}
                        <div id="printable-member-card" className="relative w-full rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#121829] via-[#090D18] to-[#060912] border border-amber-400/30 text-white shadow-xl overflow-hidden select-none space-y-5">
                            {/* card header */}
                            <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                        src={logoUrl}
                                        alt="MESF Logo"
                                        className="h-8 w-auto max-w-[120px] object-contain shrink-0 filter drop-shadow"
                                        onError={(e) => { e.currentTarget.src = '/images/mesf_logo.png'; }}
                                    />
                                    <div className="leading-tight min-w-0">
                                        <span className="block font-black text-white text-[11px] tracking-wider uppercase font-mono truncate">
                                            MALAYSIA ESPORTS FEDERATION
                                        </span>
                                        <span className="block text-[9px] text-amber-400/90 font-medium tracking-widest uppercase mt-0.5 truncate">
                                            OFFICIAL MEMBER CARD
                                        </span>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium shrink-0">
                                    Active
                                </span>
                            </div>

                            {/* card body */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-transparent border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono font-black text-xl shrink-0 overflow-hidden">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt={displayGamerTag}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span>{displayGamerTag.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 space-y-0.5">
                                        <h3 className="font-mono font-black text-base sm:text-lg text-white uppercase tracking-tight truncate">
                                            {displayGamerTag}
                                        </h3>
                                        <p className="text-xs text-neutral-300 truncate">
                                            {profileData.name || currentUser?.name || 'Verified Member'}
                                        </p>
                                        <span className="inline-block text-[10px] font-mono text-neutral-400 uppercase">
                                            State: {profileData.state_region || 'Malaysia'}
                                        </span>
                                    </div>
                                </div>

                                <BarcodeSvg value={displayMemberId} />
                            </div>

                            {/* card footer */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-[9px] text-neutral-400 uppercase font-mono block">
                                        Member ID
                                    </span>
                                    <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">
                                        {displayMemberId}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] text-neutral-400 uppercase font-mono block">
                                        Status
                                    </span>
                                    <span className="font-mono text-neutral-200 text-xs uppercase">
                                        Public Member
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* modal actions */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleCopyMemberId}
                                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                            >
                                {copiedId ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5 text-neutral-300" />
                                        <span>Copy ID</span>
                                    </>
                                )}
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCardModal(false)}
                                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE ACCOUNT MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md rounded-3xl bg-[#090D18] border border-red-500/40 p-6 sm:p-8 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-5">
                        <div className="flex items-center gap-3 text-red-400">
                            <div className="h-10 w-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white uppercase tracking-wide">
                                    Delete Account
                                </h3>
                                <p className="text-xs text-neutral-400">
                                    Are you sure you want to delete your account?
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed">
                            Once your account is deleted, all resources and registered athlete credentials will be permanently removed. Please enter your password to confirm.
                        </p>

                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                                    Confirm Your Password
                                </label>
                                <input
                                    type="password"
                                    value={deleteData.password}
                                    onChange={(e) => setDeleteData('password', e.target.value)}
                                    placeholder="Enter your current password"
                                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-colors"
                                    required
                                />
                                {deleteErrors.password && (
                                    <p className="mt-1 text-xs text-red-400">{deleteErrors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowDeleteModal(false); resetDelete(); }}
                                    className="px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteProcessing}
                                    className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{deleteProcessing ? 'Deleting...' : 'Permanently Delete'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* footer */}
            <Footer />
        </div>
    );
}
