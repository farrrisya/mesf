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
    List
} from 'lucide-react';

// --2. properties--
const SECTIONS = [
    { id: 'national', label: 'National & Pro Teams', icon: Flag },
    { id: 'states', label: 'State Affiliates', icon: MapPin }
];

// --3. main component--
export default function Teams({ teams = [] }) {
    // --4. actions--
    const hasNational = teams.some((t) => t.type === 'national' || t.type === 'pro'); // check
    const [activeSection, setActiveSection] = useState(hasNational ? 'national' : 'states'); // state
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
        const matchSection = activeSection === 'national' ? (t.type === 'national' || t.type === 'pro') : (t.type === 'state');
        const matchQuery = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.tag || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.game_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.region || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchSection && matchQuery;
    });

    const confirmDelete = () => { // trigger
        if (!deleteModalState.item) return; // check
        router.delete(route('admin.teams.destroy', deleteModalState.item.id), { // save
            preserveScroll: true,
            onSuccess: () => setDeleteModalState({ isOpen: false, item: null }) // state
        });
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
                                placeholder={activeSection === 'national' ? 'Search national teams, tags, game titles...' : 'Search state associations, territories...'}
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
                                        isSelected
                                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                            : 'bg-white/10 text-slate-400'
                                    }`}>
                                        {teams.filter((t) => section.id === 'national' ? (t.type === 'national' || t.type === 'pro') : (t.type === 'state')).length}
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
                                {activeSection === 'national' ? <Flag className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                            </div>

                            <div className="space-y-1 max-w-md mx-auto">
                                <h3 className="text-base font-bold text-white tracking-wide">
                                    {activeSection === 'national' ? 'National Teams Section' : 'State Affiliates Section'}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                    {activeSection === 'national'
                                        ? 'No national squads registered yet. Add your official national lineups to display on public registry.'
                                        : 'No state affiliates registered yet. Add your state esports associations to display in directory.'}
                                </p>
                            </div>

                            <div className="pt-1">
                                <Link
                                    href={route('admin.teams.create')} // redirect
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-[0_4px_16px_rgba(251,191,36,0.25)] cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                                    <span>{activeSection === 'national' ? 'Create First National Team' : 'Create First State Affiliate'}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'list' ? (
                    /* List View: Clean horizontal rows */
                    <div className="space-y-3 animate-fadeIn">
                        {filteredTeams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
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
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-sm sm:text-base font-bold text-white truncate">
                                                {team.name}
                                            </h3>
                                            {team.tag && (
                                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-bold">
                                                    [{team.tag}]
                                                </span>
                                            )}
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                                                {team.status || 'ACTIVE'}
                                            </span>
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

                                <div className="flex items-center justify-end gap-2 shrink-0 border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
                                    <span className="text-[11px] font-mono text-slate-500 hidden sm:inline mr-2">
                                        Roster: {team.roster_size || 5}
                                    </span>
                                    <Link
                                        href={route('admin.teams.edit', team.id)} // redirect
                                        className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                                        title="Edit Team"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteModalState({ isOpen: true, item: team })} // trigger
                                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                        title="Delete Team"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                        {filteredTeams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl transition-colors flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-2xl bg-[#0d1424] border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
                                                {team.logo_url || team.team_pic_url ? (
                                                    <img src={team.logo_url || team.team_pic_url} alt={team.name} className="w-10 h-10 object-contain" />
                                                ) : (
                                                    <span className="text-xs font-bold text-amber-400 font-mono">
                                                        {team.tag || 'TEAM'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                                                        {team.status || 'ACTIVE'}
                                                    </span>
                                                    {team.tag && (
                                                        <span className="text-[10px] font-mono text-slate-400">
                                                            [{team.tag}]
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-bold text-white transition-colors mt-1 line-clamp-1">
                                                    {team.name}
                                                </h3>
                                                {team.motto && (
                                                    <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                                                        "{team.motto}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Link
                                                href={route('admin.teams.edit', team.id)} // redirect
                                                className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                                                title="Edit Team"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => setDeleteModalState({ isOpen: true, item: team })} // trigger
                                                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                title="Delete Team"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-slate-400 border-t border-white/5 pt-3">
                                        {team.game_title && (
                                            <div className="flex items-center gap-2">
                                                <Gamepad2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span className="line-clamp-1">{team.game_title}</span>
                                            </div>
                                        )}
                                        {team.region && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span>{team.region}</span>
                                            </div>
                                        )}
                                        {team.manager_name && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span>Manager: {team.manager_name}</span>
                                            </div>
                                        )}
                                        {team.contact_email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span className="truncate">{team.contact_email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                                    <span className="text-[11px] font-mono">
                                        Roster: {team.roster_size || 5} Players
                                    </span>
                                    <span className="text-[11px] font-mono uppercase text-slate-500">
                                        {team.region || (team.type === 'state' ? 'State Affiliate' : 'National Squad')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* unified delete confirmation modal */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-md bg-[#0B0F1C] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Delete Team Profile?</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Are you sure you want to delete <span className="text-white font-semibold">"{deleteModalState.item?.name}"</span>?
                                <span className="block text-slate-400 text-xs mt-1.5">This action cannot be undone.</span>
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModalState({ isOpen: false, item: null })}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
