// --1. imports--
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Filter,
    X,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    User,
    Gamepad2,
    MapPin,
    IdCard,
    Shield,
    Phone,
    Mail,
    Trophy,
    RotateCcw,
    Plus,
    Download,
    Check,
    Printer,
    Copy,
    Users,
    AlertTriangle,
    Eye
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

const ESPORTS_TITLES = [
    'Mobile Legends: Bang Bang (MLBB)',
    'PUBG Mobile',
    'Valorant',
    'Honor of Kings (HOK)',
    'Free Fire',
    'Dota 2',
    'EA Sports FC / FIFA',
    'Tekken 8',
    'Apex Legends',
    'Counter-Strike 2'
];

// barcode pattern for digital passport cards
const BARCODE_STRIPES = [
    2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2,
    1, 3, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 3
];

// --3. main component--
export default function Index({ members = [], filters = {}, stats = {} }) {
    // search and filter state
    const [searchTerm, setSearchTerm] = useState(filters.search || ''); // state
    const [selectedState, setSelectedState] = useState(filters.state || 'ALL'); // state
    const [selectedGame, setSelectedGame] = useState(filters.game || 'ALL'); // state
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'ALL'); // state

    // modals state
    const [viewingPassport, setViewingPassport] = useState(null); // state
    const [copiedId, setCopiedId] = useState(false); // state
    const [editingMember, setEditingMember] = useState(null); // state
    const [showAddModal, setShowAddModal] = useState(false); // state
    const [deleteModalMember, setDeleteModalMember] = useState(null); // state
    const [editSaved, setEditSaved] = useState(false); // state
    const [addSaved, setAddSaved] = useState(false); // state

    // add member form
    const {
        data: addData,
        setData: setAddData,
        post: postAddMember,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd
    } = useForm({
        name: '',
        email: '',
        gamer_tag: '',
        primary_game: 'Mobile Legends: Bang Bang (MLBB)',
        state_region: 'Selangor',
        phone_number: '',
        password: '',
        is_active: true,
        game_ids: { mlbb: '', pubg: '', valorant: '' }
    });

    // edit member form
    const {
        data: editData,
        setData: setEditData,
        patch: patchMember,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit
    } = useForm({
        name: '',
        gamer_tag: '',
        primary_game: 'Mobile Legends: Bang Bang (MLBB)',
        state_region: 'Selangor',
        phone_number: '',
        is_active: true,
        game_ids: { mlbb: '', pubg: '', valorant: '' }
    });

    // check if edit form has changed
    const isEditChanged = useMemo(() => {
        if (!editingMember) return false; // check
        return (
            (editData.name || '') !== (editingMember.name || '') ||
            (editData.gamer_tag || '') !== (editingMember.gamer_tag || '') ||
            (editData.primary_game || '') !== (editingMember.primary_game || '') ||
            (editData.state_region || '') !== (editingMember.state_region || '') ||
            (editData.phone_number || '') !== (editingMember.phone_number !== '—' ? editingMember.phone_number : '') ||
            Boolean(editData.is_active) !== Boolean(editingMember.is_active) ||
            JSON.stringify(editData.game_ids || {}) !== JSON.stringify(editingMember.game_ids || {})
        ); // check
    }, [editData, editingMember]);

    // check if add form has required values
    const isAddValid = useMemo(() => {
        return Boolean(addData.name?.trim() && addData.email?.trim()); // check
    }, [addData.name, addData.email]);

    // --4. actions--
    const handleCopyId = (memberId) => { // trigger
        navigator.clipboard.writeText(memberId); // save
        setCopiedId(true); // state
        setTimeout(() => setCopiedId(false), 2000); // clock
    };

    const openAddModal = () => { // trigger
        resetAdd(); // save
        setAddSaved(false); // state
        setShowAddModal(true); // toggle
    };

    const closeAddModal = () => { // trigger
        setShowAddModal(false); // toggle
        resetAdd(); // save
    };

    const handleAddSubmit = (e) => { // trigger
        e.preventDefault(); // check
        postAddMember(route('admin.members.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setAddSaved(true); // save
                setTimeout(() => {
                    closeAddModal(); // toggle
                    setAddSaved(false); // state
                }, 1000);
            }
        });
    };

    const openEditModal = (member) => { // trigger
        setEditingMember(member); // save
        setEditSaved(false); // state
        setEditData({
            name: member.name || '',
            gamer_tag: member.gamer_tag || '',
            primary_game: member.primary_game || 'Mobile Legends: Bang Bang (MLBB)',
            state_region: member.state_region || 'Selangor',
            phone_number: member.phone_number !== '—' ? member.phone_number : '',
            is_active: Boolean(member.is_active),
            game_ids: member.game_ids || { mlbb: '', pubg: '', valorant: '' }
        });
    };

    const closeEditModal = () => { // trigger
        setEditingMember(null); // toggle
        resetEdit(); // save
    };

    const handleEditSubmit = (e) => { // trigger
        e.preventDefault(); // check
        if (!editingMember) return; // check

        patchMember(route('admin.members.update', editingMember.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditSaved(true); // save
                setTimeout(() => {
                    closeEditModal(); // toggle
                    setEditSaved(false); // state
                }, 1000);
            }
        });
    };

    const handleToggleStatus = (member) => { // trigger
        router.post(route('admin.members.toggle-status', member.id), {}, {
            preserveScroll: true
        });
    };

    const confirmDelete = () => { // trigger
        if (!deleteModalMember) return; // check
        router.delete(route('admin.members.destroy', deleteModalMember.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModalMember(null) // toggle
        });
    };

    const clearFilters = () => { // trigger
        setSearchTerm(''); // save
        setSelectedState('ALL'); // save
        setSelectedGame('ALL'); // save
        setSelectedStatus('ALL'); // save
        router.get(route('admin.members.index'), {}, { preserveState: true }); // redirect
    };

    // client side filtering
    const filteredMembers = useMemo(() => { // convert
        return members.filter((m) => {
            // search match
            if (searchTerm.trim() !== '') {
                const term = searchTerm.toLowerCase();
                const matchId = m.member_id?.toLowerCase().includes(term);
                const matchName = m.name?.toLowerCase().includes(term);
                const matchTag = m.gamer_tag?.toLowerCase().includes(term);
                const matchEmail = m.email?.toLowerCase().includes(term);
                const matchPhone = m.phone_number?.toLowerCase().includes(term);
                const matchTeam = m.team_name?.toLowerCase().includes(term);
                if (!matchId && !matchName && !matchTag && !matchEmail && !matchPhone && !matchTeam) {
                    return false;
                }
            }
            // state filter
            if (selectedState !== 'ALL' && m.state_region !== selectedState) {
                return false;
            }
            // game filter
            if (selectedGame !== 'ALL' && m.primary_game !== selectedGame) {
                return false;
            }
            // status filter
            if (selectedStatus !== 'ALL') {
                const isActive = selectedStatus === 'active';
                if (m.is_active !== isActive) return false;
            }
            return true;
        });
    }, [members, searchTerm, selectedState, selectedGame, selectedStatus]);

    // export filtered members to CSV
    const exportToCSV = () => { // export
        const headers = ['Passport ID', 'Full Name', 'Gamer Tag', 'Email', 'Phone', 'Primary Game', 'State Region', 'Competitive Team', 'Status', 'Registered Date'];
        const rows = filteredMembers.map((m) => [
            `"${m.member_id || ''}"`,
            `"${m.name || ''}"`,
            `"${m.gamer_tag || ''}"`,
            `"${m.email || ''}"`,
            `"${m.phone_number || ''}"`,
            `"${m.primary_game || ''}"`,
            `"${m.state_region || ''}"`,
            `"${m.team_name || 'Independent'}"`,
            `"${m.is_active ? 'Active' : 'Suspended'}"`,
            `"${m.created_at || ''}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `mesf_members_directory_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --5. UI--
    return (
        <AdminLayout title="Manage Members - MESF">
            <Head title="Manage Members - MESF Portal" />

            <div className="space-y-6">
                {/* page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                            COMMUNITY DIRECTORY
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
                            Manage Members & Athlete Passports
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                            Review, verify, and manage registered Malaysian esports athlete passports and gamer identities.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={exportToCSV}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Export CSV</span>
                        </button>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Add Member</span>
                        </button>
                    </div>
                </div>

                {/* KPI stats cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                            <IdCard className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-mono text-neutral-400 uppercase">Total Members</div>
                            <div className="text-xl font-black text-white font-mono mt-0.5">{stats.total || members.length}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-mono text-neutral-400 uppercase">Active Athletes</div>
                            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{stats.active || 0}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-mono text-neutral-400 uppercase">Suspended</div>
                            <div className="text-xl font-black text-rose-400 font-mono mt-0.5">{stats.inactive || 0}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <Gamepad2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[11px] font-mono text-neutral-400 uppercase">Top Title</div>
                            <div className="text-xs font-bold text-white truncate mt-0.5">{stats.top_game || 'MLBB'}</div>
                        </div>
                    </div>

                    <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[11px] font-mono text-neutral-400 uppercase">Top State</div>
                            <div className="text-xs font-bold text-white truncate mt-0.5">{stats.top_state || 'Selangor'}</div>
                        </div>
                    </div>
                </div>

                {/* search & filters bar */}
                <div className="p-4 rounded-2xl bg-[#090D18]/90 border border-white/10 space-y-3 shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* search input */}
                        <div className="lg:col-span-2 relative">
                            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, gamer tag, ID, squad..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                            />
                        </div>

                        {/* state filter */}
                        <div>
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                                <option value="ALL">All States</option>
                                {MALAYSIAN_STATES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* game filter */}
                        <div>
                            <select
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                                <option value="ALL">All Games</option>
                                {ESPORTS_TITLES.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        {/* status filter */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                                <option value="ALL">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/* active filters indicator */}
                    {(searchTerm || selectedState !== 'ALL' || selectedGame !== 'ALL' || selectedStatus !== 'ALL') && (
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-neutral-400">
                            <span>Showing {filteredMembers.length} of {members.length} member(s)</span>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reset Filters</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* members table */}
                <div className="rounded-2xl border border-white/10 bg-[#090D18]/90 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-white/[0.02] border-b border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 font-bold">Passport ID</th>
                                    <th className="py-3.5 px-4 font-bold">Athlete & Gamer Tag</th>
                                    <th className="py-3.5 px-4 font-bold">Primary Game</th>
                                    <th className="py-3.5 px-4 font-bold">State Affiliate</th>
                                    <th className="py-3.5 px-4 font-bold">Squad</th>
                                    <th className="py-3.5 px-4 font-bold">Status</th>
                                    <th className="py-3.5 px-4 font-bold">Joined</th>
                                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-neutral-400">
                                            <IdCard className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                                            <div className="text-sm font-bold text-white">No members found</div>
                                            <div className="text-xs text-neutral-500 mt-1">
                                                No community members matched your search criteria.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                            {/* Passport ID with quick view card */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewingPassport(member)}
                                                    className="font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                                    title="Click to view Athlete Passport"
                                                >
                                                    <IdCard className="w-3.5 h-3.5 opacity-70" />
                                                    <span>{member.member_id}</span>
                                                </button>
                                            </td>

                                            {/* Athlete */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono font-black text-xs shrink-0">
                                                        {member.gamer_tag.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-white font-mono uppercase tracking-wide truncate">
                                                            {member.gamer_tag}
                                                        </div>
                                                        <div className="text-[11px] text-neutral-300 truncate">
                                                            {member.name}
                                                        </div>
                                                        <div className="text-[10px] text-neutral-500 truncate">
                                                            {member.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Primary Game & IDs */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-neutral-200 text-[11px]">
                                                        <Gamepad2 className="w-3 h-3 text-amber-400" />
                                                        <span>{member.primary_game}</span>
                                                    </span>
                                                    {member.game_ids && Object.values(member.game_ids).some(v => Boolean(v)) && (
                                                        <div className="text-[9px] font-mono text-neutral-500">
                                                            {member.game_ids.mlbb && `MLBB: ${member.game_ids.mlbb} `}
                                                            {member.game_ids.valorant && `Riot: ${member.game_ids.valorant}`}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* State */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-neutral-300">
                                                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                                    <span>{member.state_region}</span>
                                                </span>
                                            </td>

                                            {/* Squad */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                {member.team_name ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-semibold">
                                                        <Users className="w-3 h-3" />
                                                        <span>{member.team_name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-neutral-500 font-mono">
                                                        Independent
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(member)}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-colors bg-white/[0.02] border border-white/5 hover:border-white/15"
                                                    title="Click to toggle status"
                                                >
                                                    <span className="relative flex h-2 w-2">
                                                        <span
                                                            className={`relative inline-flex rounded-full h-2 w-2 ${
                                                                member.is_active ? 'bg-emerald-400' : 'bg-red-500'
                                                            }`}
                                                        />
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                                                            member.is_active ? 'text-emerald-400' : 'text-red-400'
                                                        }`}
                                                    >
                                                        {member.is_active ? 'Active' : 'Suspended'}
                                                    </span>
                                                </button>
                                            </td>

                                            {/* Registered */}
                                            <td className="py-3.5 px-4 font-mono text-neutral-400 whitespace-nowrap">
                                                {member.created_at}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewingPassport(member)}
                                                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                                        title="View Digital Passport Card"
                                                    >
                                                        <IdCard className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(member)}
                                                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                                        title="Edit Member Passport"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteModalMember(member)}
                                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                                        title="Delete Member"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DIGITAL ATHLETE PASSPORT MODAL */}
            {viewingPassport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="relative w-full max-w-lg rounded-3xl bg-[#090D18] border border-amber-400/30 p-6 sm:p-7 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2 text-amber-400">
                                <IdCard className="w-5 h-5" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                                    Official Athlete Passport
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingPassport(null)}
                                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* DIGITAL CARD PREVIEW */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1222] via-[#090D18] to-[#12192d] border border-amber-400/20 relative overflow-hidden shadow-2xl space-y-5">
                            {/* Card Background Glow */}
                            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

                            {/* Card Top Brand */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div>
                                    <span className="text-[9px] font-mono font-bold tracking-widest text-amber-400 block uppercase">
                                        MALAYSIAN ESPORTS FEDERATION
                                    </span>
                                    <span className="text-xs font-bold text-white tracking-wide">
                                        COMMUNITY ATHLETE PASSPORT
                                    </span>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                    viewingPassport.is_active ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                    {viewingPassport.is_active ? 'Active' : 'Suspended'}
                                </span>
                            </div>

                            {/* Athlete Info */}
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-300 font-mono font-black text-2xl shrink-0 shadow-inner">
                                    {viewingPassport.gamer_tag.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <h3 className="text-xl font-black text-white font-mono uppercase tracking-wide truncate">
                                        {viewingPassport.gamer_tag}
                                    </h3>
                                    <p className="text-xs text-neutral-300 font-medium truncate">
                                        {viewingPassport.name}
                                    </p>
                                    <p className="text-[11px] text-neutral-400 font-mono truncate">
                                        {viewingPassport.email}
                                    </p>
                                </div>
                            </div>

                            {/* Athlete Coordinates */}
                            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                                    <span className="text-[9px] font-mono text-neutral-400 uppercase block">
                                        Primary Game
                                    </span>
                                    <span className="font-bold text-white text-[11px] block truncate">
                                        {viewingPassport.primary_game}
                                    </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                                    <span className="text-[9px] font-mono text-neutral-400 uppercase block">
                                        State Affiliate
                                    </span>
                                    <span className="font-bold text-white text-[11px] block truncate">
                                        {viewingPassport.state_region}
                                    </span>
                                </div>
                            </div>

                            {/* Squad Info if any */}
                            {viewingPassport.team_name && (
                                <div className="p-2.5 rounded-xl bg-amber-400/5 border border-amber-400/15 flex items-center justify-between text-xs">
                                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Registered Squad</span>
                                    <span className="font-bold text-amber-300">{viewingPassport.team_name}</span>
                                </div>
                            )}

                            {/* Barcode Strip */}
                            <div className="pt-3 border-t border-white/10 space-y-2">
                                <div className="h-9 w-full bg-white/[0.05] rounded-lg p-1.5 flex items-center justify-between gap-1 overflow-hidden">
                                    {BARCODE_STRIPES.map((w, idx) => (
                                        <div
                                            key={idx}
                                            style={{ width: `${w * 2}px` }}
                                            className="h-full bg-white/70 rounded-[1px] shrink-0"
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-neutral-400">PASSPORT NO:</span>
                                    <span className="font-bold text-amber-300 tracking-wider text-sm">{viewingPassport.member_id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => handleCopyId(viewingPassport.member_id)}
                                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
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
                                    onClick={() => setViewingPassport(null)}
                                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD NEW MEMBER MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="relative w-full max-w-2xl rounded-3xl bg-[#090D18] border border-white/15 p-6 md:p-7 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                                    NEW ATHLETE ONBOARDING
                                </span>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight mt-0.5">
                                    Register Community Member
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={closeAddModal}
                                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Gamer Tag */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Gamer Tag / IGN
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.gamer_tag}
                                        onChange={(e) => setAddData('gamer_tag', e.target.value)}
                                        placeholder="e.g. ShadowStrike"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                                    />
                                    {addErrors.gamer_tag && (
                                        <p className="mt-1 text-xs text-red-400">{addErrors.gamer_tag}</p>
                                    )}
                                </div>

                                {/* Full Legal Name */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Full Legal Name <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.name}
                                        onChange={(e) => setAddData('name', e.target.value)}
                                        placeholder="e.g. Ahmad Faiz"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {addErrors.name && (
                                        <p className="mt-1 text-xs text-red-400">{addErrors.name}</p>
                                    )}
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Email Address <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={addData.email}
                                        onChange={(e) => setAddData('email', e.target.value)}
                                        placeholder="faiz@esports.my"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {addErrors.email && (
                                        <p className="mt-1 text-xs text-red-400">{addErrors.email}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Phone / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.phone_number}
                                        onChange={(e) => setAddData('phone_number', e.target.value)}
                                        placeholder="+6012-3456789"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                    />
                                    {addErrors.phone_number && (
                                        <p className="mt-1 text-xs text-red-400">{addErrors.phone_number}</p>
                                    )}
                                </div>

                                {/* Primary Game */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Primary Game
                                    </label>
                                    <select
                                        value={addData.primary_game}
                                        onChange={(e) => setAddData('primary_game', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                                    >
                                        {ESPORTS_TITLES.map((game) => (
                                            <option key={game} value={game}>{game}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* State Affiliate */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        State Affiliate
                                    </label>
                                    <select
                                        value={addData.state_region}
                                        onChange={(e) => setAddData('state_region', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                                    >
                                        {MALAYSIAN_STATES.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Initial Password (Optional)
                                    </label>
                                    <input
                                        type="password"
                                        value={addData.password}
                                        onChange={(e) => setAddData('password', e.target.value)}
                                        placeholder="Defaults to password123"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                    />
                                </div>

                                {/* Active Status Toggle */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Initial Account Status
                                    </label>
                                    <div className="flex items-center gap-3 pt-1">
                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={addData.is_active}
                                                onChange={(e) => setAddData('is_active', e.target.checked)}
                                                className="h-4 w-4 rounded border-white/20 bg-white/5 text-amber-400 focus:ring-amber-400"
                                            />
                                            <span className="text-xs font-semibold text-neutral-200">
                                                {addData.is_active ? 'Active Community Athlete' : 'Inactive / Suspended'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Tournament In-Game IDs */}
                            <div className="pt-3 border-t border-white/10">
                                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-2 font-bold">
                                    Player Tournament In-Game IDs (Optional)
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                                            MLBB User ID + Zone
                                        </label>
                                        <input
                                            type="text"
                                            value={addData.game_ids?.mlbb || ''}
                                            onChange={(e) => setAddData('game_ids', { ...addData.game_ids, mlbb: e.target.value })}
                                            placeholder="12345678 (2026)"
                                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                                            Valorant Riot ID
                                        </label>
                                        <input
                                            type="text"
                                            value={addData.game_ids?.valorant || ''}
                                            onChange={(e) => setAddData('game_ids', { ...addData.game_ids, valorant: e.target.value })}
                                            placeholder="Player#MY1"
                                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                                            PUBG Mobile UID
                                        </label>
                                        <input
                                            type="text"
                                            value={addData.game_ids?.pubg || ''}
                                            onChange={(e) => setAddData('game_ids', { ...addData.game_ids, pubg: e.target.value })}
                                            placeholder="5123456789"
                                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-neutral-300 uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addProcessing || (!isAddValid && !addSaved)} // check
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                        addSaved
                                            ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400'
                                            : !isAddValid
                                            ? 'bg-white/10 text-neutral-500 border border-white/5 cursor-not-allowed opacity-50'
                                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                    }`}
                                >
                                    {addSaved && <Check className="w-4 h-4 stroke-[3]" />}
                                    <span>{addProcessing ? 'Registering...' : addSaved ? 'SAVED' : 'Register Member'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MEMBER DETAILS MODAL */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="relative w-full max-w-2xl rounded-3xl bg-[#090D18] border border-white/15 p-6 md:p-7 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                                    PASSPORT ID: {editingMember.member_id}
                                </span>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight mt-0.5">
                                    Edit Athlete Passport & Credentials
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Gamer Tag */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Gamer Tag / IGN <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.gamer_tag}
                                        onChange={(e) => setEditData('gamer_tag', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {editErrors.gamer_tag && (
                                        <p className="mt-1 text-xs text-red-400">{editErrors.gamer_tag}</p>
                                    )}
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Full Legal Name <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {editErrors.name && (
                                        <p className="mt-1 text-xs text-red-400">{editErrors.name}</p>
                                    )}
                                </div>

                                {/* Primary Game */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Primary Esports Game
                                    </label>
                                    <select
                                        value={editData.primary_game}
                                        onChange={(e) => setEditData('primary_game', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                                    >
                                        {ESPORTS_TITLES.map((game) => (
                                            <option key={game} value={game}>{game}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* State Affiliate */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        State Affiliate
                                    </label>
                                    <select
                                        value={editData.state_region}
                                        onChange={(e) => setEditData('state_region', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                                    >
                                        {MALAYSIAN_STATES.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Phone / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.phone_number}
                                        onChange={(e) => setEditData('phone_number', e.target.value)}
                                        placeholder="+6012-3456789"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                    />
                                </div>

                                {/* Active Status Toggle */}
                                <div>
                                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                                        Account Status
                                    </label>
                                    <div className="flex items-center gap-3 pt-1">
                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editData.is_active}
                                                onChange={(e) => setEditData('is_active', e.target.checked)}
                                                className="h-4 w-4 rounded border-white/20 bg-white/5 text-amber-400 focus:ring-amber-400 cursor-pointer"
                                            />
                                            <span className="text-xs font-semibold text-neutral-200">
                                                {editData.is_active ? 'Athlete Active' : 'Account Suspended'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Tournament In-Game IDs */}
                            <div className="pt-3 border-t border-white/10">
                                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-2 font-bold">
                                    Player Tournament In-Game IDs
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                                            MLBB User ID + Zone
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.game_ids?.mlbb || ''}
                                            onChange={(e) => setEditData('game_ids', { ...editData.game_ids, mlbb: e.target.value })}
                                            placeholder="12345678 (2026)"
                                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                                            Valorant Riot ID
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.game_ids?.valorant || ''}
                                            onChange={(e) => setEditData('game_ids', { ...editData.game_ids, valorant: e.target.value })}
                                            placeholder="Player#MY1"
                                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                                            PUBG Mobile UID
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.game_ids?.pubg || ''}
                                            onChange={(e) => setEditData('game_ids', { ...editData.game_ids, pubg: e.target.value })}
                                            placeholder="5123456789"
                                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-neutral-300 uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing || (!isEditChanged && !editSaved)} // check
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                        editSaved
                                            ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400'
                                            : !isEditChanged
                                            ? 'bg-white/10 text-neutral-500 border border-white/5 cursor-not-allowed opacity-50'
                                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                                    }`}
                                >
                                    {editSaved && <Check className="w-4 h-4 stroke-[3]" />}
                                    <span>{editProcessing ? 'Saving...' : editSaved ? 'SAVED' : 'Save Member Details'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MEMBER MODAL */}
            {deleteModalMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="relative w-full max-w-md rounded-2xl bg-[#090D18] border border-red-500/30 p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-black text-white uppercase tracking-tight">
                                    Delete Member Account
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    Are you sure you want to delete <strong className="text-white">{deleteModalMember.name}</strong> ({deleteModalMember.gamer_tag})?
                                    <br />
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalMember(null)}
                                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-neutral-300 uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md"
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
