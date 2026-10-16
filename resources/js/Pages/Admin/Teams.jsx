// --1. imports--
import { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Flag,
    MapPin,
    Plus,
    Search,
    Trash2,
    Edit2,
    Users,
    Mail,
    Gamepad2,
    LayoutGrid,
    List,
    Clock,
    CheckCircle2,
    XCircle,
    Check,
    X,
    Shield,
    AlertTriangle
} from 'lucide-react';

// --2. properties--
const SECTIONS = [
    { id: 'pending', label: 'Pending Requests', icon: Clock },
    { id: 'national', label: 'National & Pro Teams', icon: Flag },
    { id: 'states', label: 'State Affiliates', icon: MapPin }
];

// --3. main component--
export default function Teams({ teams = [] }) {
    // --4. actions--
    const isPendingStatus = (st) => ['PENDING', 'pending', 'DELETION_REQUESTED', 'deletion_requested'].includes(st); // check
    const pendingCount = teams.filter((t) => isPendingStatus(t.status)).length; // check
    const [activeSection, setActiveSection] = useState(pendingCount > 0 ? 'pending' : 'national'); // state
    const [hoveredSection, setHoveredSection] = useState(null); // state
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [viewMode, setViewMode] = useState('grid'); // state
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, item: null }); // state
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 }); // state

    const sectionRefs = useRef({}); // properties

    useEffect(() => { // trigger
        const targetId = hoveredSection || activeSection;
        const currentRef = sectionRefs.current[targetId];
        if (currentRef) { // check
            setIndicatorStyle({
                left: currentRef.offsetLeft,
                width: currentRef.offsetWidth,
                opacity: 1,
            }); // state
        }
    }, [activeSection, hoveredSection]);

    const filteredTeams = teams.filter((t) => { // check
        let matchSection = false; // state
        if (activeSection === 'pending') {
            matchSection = isPendingStatus(t.status);
        } else if (activeSection === 'national') {
            matchSection = (t.type === 'national' || t.type === 'pro') && !isPendingStatus(t.status);
        } else {
            matchSection = t.type === 'state' && !isPendingStatus(t.status);
        }

        const matchQuery = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tag || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.game_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.region || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.manager_name || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchSection && matchQuery;
    });

    const handleApprove = (team) => { // trigger
        router.post(route('admin.teams.approve', team.id), {}, { // save
            preserveScroll: true,
        });
    };

    const handleReject = (team) => { // trigger
        if (!confirm(`Are you sure you want to reject registration for '${team.name}'?`)) return; // check
        router.post(route('admin.teams.reject', team.id), {}, { // save
            preserveScroll: true,
        });
    };

    const confirmDelete = () => { // trigger
        if (!deleteModalState.item) return; // check
        router.delete(route('admin.teams.destroy', deleteModalState.item.id), { // save
            preserveScroll: true,
            onSuccess: () => setDeleteModalState({ isOpen: false, item: null }) // state
        });
    };

    const getSectionCount = (sectionId) => { // convert
        if (sectionId === 'pending') {
            return teams.filter((t) => isPendingStatus(t.status)).length;
        } else if (sectionId === 'national') {
            return teams.filter((t) => (t.type === 'national' || t.type === 'pro') && !isPendingStatus(t.status)).length;
        } else {
            return teams.filter((t) => t.type === 'state' && !isPendingStatus(t.status)).length;
        }
    };

    // --5. UI--
    return (
        <AdminLayout title="Manage Teams - MESF Admin">
            <Head title="Manage Teams - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* search & action bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* search input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder={activeSection === 'pending' ? 'Search pending applications, managers, games...' : activeSection === 'national' ? 'Search national teams, tags, game titles...' : 'Search state associations, territories...'}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                            />
                        </div>

                        {/* action controls */}
                        <div className="flex items-center gap-3">
                            {/* view toggle: grid vs list */}
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')} // toggle
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                        viewMode === 'grid'
                                            ? 'bg-amber-400 text-black shadow-sm'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')} // toggle
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                        viewMode === 'list'
                                            ? 'bg-amber-400 text-black shadow-sm'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                    title="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            <Link
                                href={route('admin.teams.create')} // redirect
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Register Team</span>
                            </Link>
                        </div>
                    </div>

                    {/* section switcher tabs with sliding indicator */}
                    <div
                        className="relative flex items-center gap-8 border-t border-white/5 text-sm scrollbar-none pt-3"
                        onMouseLeave={() => setHoveredSection(null)} // toggle
                    >
                        {SECTIONS.map((section) => {
                            const isSelected = activeSection === section.id;
                            const isHovered = hoveredSection === section.id;
                            const IconComponent = section.icon;
                            const count = getSectionCount(section.id);

                            return (
                                <button
                                    key={section.id}
                                    ref={(el) => (sectionRefs.current[section.id] = el)} // properties
                                    type="button"
                                    onClick={() => setActiveSection(section.id)} // toggle
                                    onMouseEnter={() => setHoveredSection(section.id)} // toggle
                                    className={`relative pb-1.5 text-xs sm:text-sm tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${isSelected
                                        ? 'text-amber-400 font-semibold'
                                        : isHovered
                                            ? 'text-white'
                                            : 'text-slate-400 font-normal hover:text-white'
                                        }`}
                                >
                                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                                    <span>{section.label}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                        section.id === 'pending' && count > 0
                                            ? 'bg-amber-400 text-black shadow-sm animate-pulse'
                                            : isSelected
                                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                                : 'bg-white/10 text-slate-400'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}

                        {/* continuous sliding glowing underline indicator */}
                        <span
                            className="absolute -bottom-[1px] h-[1.5px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_6px_rgba(251,191,36,0.5)] pointer-events-none"
                            style={{
                                left: `${indicatorStyle.left}px`,
                                width: `${indicatorStyle.width}px`,
                                opacity: indicatorStyle.opacity,
                            }}
                        />
                    </div>
                </div>

                {/* Empty State */}
                {filteredTeams.length === 0 ? (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-3">
                            <div className="mx-auto w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                {activeSection === 'pending' ? <Clock className="w-6 h-6" /> : activeSection === 'national' ? <Flag className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                            </div>

                            <div className="space-y-1 max-w-md mx-auto">
                                <h3 className="text-base font-bold text-white tracking-wide">
                                    {activeSection === 'pending'
                                        ? 'No Pending Applications'
                                        : activeSection === 'national'
                                            ? 'National Teams Section'
                                            : 'State Affiliates Section'}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                    {activeSection === 'pending'
                                        ? 'No new team registration requests awaiting review. Teams submitted via the website registry will appear here for one-click verification and activation.'
                                        : activeSection === 'national'
                                            ? 'No national squads registered yet. Add your official national lineups to display on public registry.'
                                            : 'No state affiliates registered yet. Add your state esports associations to display in directory.'}
                                </p>
                            </div>

                            {activeSection !== 'pending' && (
                                <div className="pt-1">
                                    <Link
                                        href={route('admin.teams.create')} // redirect
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-[0_4px_16px_rgba(251,191,36,0.25)] cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                                        <span>{activeSection === 'national' ? 'Create First National Team' : 'Create First State Affiliate'}</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                ) : viewMode === 'list' ? (
                    /* List View: Clean horizontal rows */
                    <div className="space-y-3 animate-fadeIn">
                        {filteredTeams.map((team) => {
                            const isPending = team.status === 'PENDING' || team.status === 'pending';
                            const isRejected = team.status === 'REJECTED' || team.status === 'rejected';
                            const isDeletionRequested = team.status === 'DELETION_REQUESTED' || team.status === 'deletion_requested';

                            return (
                                <div
                                    key={team.id}
                                    className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                >
                                    {/* Left: Identity */}
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-[#0d1424] border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
                                            {team.logo_url || team.team_pic_url ? (
                                                <img
                                                    src={team.logo_url || team.team_pic_url}
                                                    alt={team.name}
                                                    className="w-8 h-8 object-contain"
                                                />
                                            ) : (
                                                <span className="text-[11px] font-bold text-amber-400 font-mono">
                                                    {team.tag || 'TEAM'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                                                    {team.name}
                                                </h3>
                                                {team.tag && (
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-amber-400 font-bold shrink-0">
                                                        [{team.tag}]
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                                                {team.game_title && (
                                                    <span className="flex items-center gap-1">
                                                        <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                                                        <span>{team.game_title}</span>
                                                    </span>
                                                )}
                                                {team.region && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{team.region}</span>
                                                    </span>
                                                )}
                                                {team.manager_name && (
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{team.manager_name}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Dedicated Status & Controls */}
                                    <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                                        {/* Status Badge in its own dedicated space */}
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${
                                            isDeletionRequested
                                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                                                : isPending
                                                    ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                                                    : isRejected
                                                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                        }`}>
                                            {isDeletionRequested ? (
                                                <>
                                                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                                                    <span>Deletion Requested</span>
                                                </>
                                            ) : isPending ? (
                                                <>
                                                    <Clock className="w-3 h-3 text-amber-400" />
                                                    <span>Pending Review</span>
                                                </>
                                            ) : isRejected ? (
                                                <>
                                                    <XCircle className="w-3 h-3 text-rose-400" />
                                                    <span>Rejected</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                    <span>Active</span>
                                                </>
                                            )}
                                        </span>

                                        <span className="text-[11px] font-mono text-slate-400 hidden xl:inline">
                                            {team.roster_size || 5} Players
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {isDeletionRequested && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteModalState({ isOpen: true, item: team })} // trigger
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
                                                        title="Approve Deletion & Disband Squad"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>Approve Deletion</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApprove(team)} // trigger
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                                        title="Decline Removal & Keep Active"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Keep Active</span>
                                                    </button>
                                                </>
                                            )}

                                            {isPending && !isDeletionRequested && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApprove(team)} // trigger
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all cursor-pointer shadow-md"
                                                        title="Approve & Activate Team"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReject(team)} // trigger
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                                                        title="Reject Team"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </>
                                            )}

                                            <Link
                                                href={route('admin.teams.edit', team.id)} // redirect
                                                className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors cursor-pointer"
                                                title="Edit Team"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteModalState({ isOpen: true, item: team })} // trigger
                                                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                                                title="Delete Team"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Grid View: Clean, Spacious, Uncramped Cards */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                        {filteredTeams.map((team) => {
                            const isPending = team.status === 'PENDING' || team.status === 'pending';
                            const isRejected = team.status === 'REJECTED' || team.status === 'rejected';
                            const isDeletionRequested = team.status === 'DELETION_REQUESTED' || team.status === 'deletion_requested';

                            return (
                                <div
                                    key={team.id}
                                    className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl transition-colors flex flex-col justify-between space-y-5"
                                >
                                    <div className="space-y-4">
                                        {/* Card Top Row: Type on left, un-cramped Status Badge on right */}
                                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                                                {team.type === 'national' ? 'National Squad' : team.type === 'state' ? 'State Affiliate' : 'Club / Pro Team'}
                                            </span>
                                            {/* Dedicated Status Badge */}
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                                isDeletionRequested
                                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                                                    : isPending
                                                        ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                                                        : isRejected
                                                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                            }`}>
                                                {isDeletionRequested ? (
                                                    <>
                                                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                                                        <span>Deletion Requested</span>
                                                    </>
                                                ) : isPending ? (
                                                    <>
                                                        <Clock className="w-3 h-3 text-amber-400" />
                                                        <span>Pending Review</span>
                                                    </>
                                                ) : isRejected ? (
                                                    <>
                                                        <XCircle className="w-3 h-3 text-rose-400" />
                                                        <span>Rejected</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                        <span>Active</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Main Identity Row */}
                                        <div className="flex items-center justify-between gap-3 pt-1">
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="w-14 h-14 rounded-2xl bg-[#0d1424] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                                    {team.logo_url || team.team_pic_url ? (
                                                        <img src={team.logo_url || team.team_pic_url} alt={team.name} className="w-10 h-10 object-contain" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-amber-400 font-mono">
                                                            {team.tag || 'TEAM'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base font-bold text-white tracking-tight truncate">
                                                            {team.name}
                                                        </h3>
                                                        {team.tag && (
                                                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-amber-400 font-bold shrink-0">
                                                                [{team.tag}]
                                                            </span>
                                                        )}
                                                    </div>
                                                    {team.motto && (
                                                        <p className="text-xs text-slate-400 italic line-clamp-1 mt-0.5">
                                                            "{team.motto}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <Link
                                                    href={route('admin.teams.edit', team.id)} // redirect
                                                    className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors cursor-pointer"
                                                    title="Edit Team"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteModalState({ isOpen: true, item: team })} // trigger
                                                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                                                    title="Delete Team"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Structured Info Box */}
                                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                                                    <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Discipline:</span>
                                                </span>
                                                <span className="text-slate-200 font-semibold truncate text-right">
                                                    {team.game_title || 'Competitive Esports'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Territory:</span>
                                                </span>
                                                <span className="text-slate-200 font-medium truncate text-right">
                                                    {team.region || 'National'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Manager:</span>
                                                </span>
                                                <span className="text-slate-200 font-medium truncate text-right">
                                                    {team.manager_name || 'Team Leader'}
                                                </span>
                                            </div>
                                            {team.contact_email && (
                                                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                                                    <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Email:</span>
                                                    </span>
                                                    <span className="text-slate-300 font-mono text-[11px] truncate text-right">
                                                        {team.contact_email}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Bar / Footer */}
                                    {isDeletionRequested ? (
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-mono text-rose-400 font-bold">
                                                Removal Requested
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(team)} // trigger
                                                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                                >
                                                    Keep Active
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteModalState({ isOpen: true, item: team })} // trigger
                                                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
                                                >
                                                    Approve Deletion
                                                </button>
                                            </div>
                                        </div>
                                    ) : isPending ? (
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-mono text-amber-400">
                                                {team.roster_size || 5} Players
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleReject(team)} // trigger
                                                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(team)} // trigger
                                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all cursor-pointer shadow-md"
                                                >
                                                    Approve Team
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                                            <span className="font-mono text-[11px]">
                                                {team.roster_size || 5} Active Players
                                            </span>
                                            <Link
                                                href={route('admin.teams.edit', team.id)} // redirect
                                                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                                            >
                                                Edit Details →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-[#0d1424] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-400">
                            <Trash2 className="w-6 h-6" />
                            <h3 className="text-lg font-bold text-white">Delete Team Record</h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Are you sure you want to permanently remove <strong className="text-white">'{deleteModalState.item?.name}'</strong> from the federation database? This action cannot be reversed.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalState({ isOpen: false, item: null })} // trigger
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete} // trigger
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
                            >
                                Delete Team
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
