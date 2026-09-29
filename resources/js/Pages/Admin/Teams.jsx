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
    Gamepad2
} from 'lucide-react';

// --2. properties--
const SECTIONS = [
    { id: 'national', label: 'National & Pro Teams', icon: Flag },
    { id: 'states', label: 'State Affiliates', icon: MapPin }
];

// --3. main component--
export default function Teams({ teams = [] }) {
    // --4. actions--
    const [activeSection, setActiveSection] = useState('national'); // state
    const [hoveredSection, setHoveredSection] = useState(null); // state
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 }); // state

    const sectionRefs = useRef({}); // properties

    // update sliding indicator
    useEffect(() => {
        const targetId = hoveredSection || activeSection;
        const currentRef = sectionRefs.current[targetId];
        if (currentRef) {
            setIndicatorStyle({
                left: currentRef.offsetLeft,
                width: currentRef.offsetWidth,
                opacity: 1,
            });
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

    const handleDelete = (id, name) => { // trigger
        if (confirm(`Are you sure you want to delete "${name}"?`)) { // check
            router.delete(route('admin.teams.destroy', id), { // save
                preserveScroll: true
            });
        }
    };

    // --5. UI--
    return (
        <AdminLayout title="Manage Teams - MESF Admin">
            <Head title="Manage Teams - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* Header title & Register Team Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                            Teams Management
                        </h1>
                    </div>

                    <Link
                        href={route('admin.teams.create')} // redirect
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap active:scale-95 w-fit"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Register Team</span>
                    </Link>
                </div>

                {/* search bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder={activeSection === 'national' ? 'Search national teams, tags, game titles...' : 'Search state associations, territories...'}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                        />
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
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                {activeSection === 'national' ? <Flag className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
                            </div>

                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    {activeSection === 'national' ? 'National Teams Section' : 'State Affiliates Section'}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                    {activeSection === 'national'
                                        ? 'No national squads registered yet. Add your official national lineups to display on public registry.'
                                        : 'No state affiliates registered yet. Add your state esports associations to display in directory.'}
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={route('admin.teams.create')} // redirect
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-[0_4px_16px_rgba(251,191,36,0.25)] cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                                    <span>{activeSection === 'national' ? 'Create First National Team' : 'Create First State Affiliate'}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                        {filteredTeams.map((team) => (
                            <div
                                key={team.id}
                                className="group bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 hover:border-amber-400/40 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-2xl bg-[#0d1424] border border-white/15 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-amber-400/30 transition-all">
                                                {team.logo_url ? (
                                                    <img src={team.logo_url} alt={team.name} className="w-10 h-10 object-contain" />
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
                                                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-1 line-clamp-1">
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
                                                onClick={() => handleDelete(team.id, team.name)} // trigger
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
                                    <Link
                                        href={route('admin.teams.edit', team.id)} // redirect
                                        className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
