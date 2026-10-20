// --1. imports--
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
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
    Users,
    RotateCcw,
    Plus,
    Download,
    Check,
    Printer,
    Copy,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    Sparkles
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

// --3. main component--
export default function Index({ members = [], filters = {}, stats = {} }) {
    // search and filter state
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedState, setSelectedState] = useState(filters.state || 'ALL');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'ALL');

    // modals state
    const [viewingPassport, setViewingPassport] = useState(null);
    const [copiedId, setCopiedId] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteModalMember, setDeleteModalMember] = useState(null);
    const [resetPasswordMember, setResetPasswordMember] = useState(null);

    const [editSaved, setEditSaved] = useState(false);
    const [addSaved, setAddSaved] = useState(false);
    const [resetSaved, setResetSaved] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);

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
        state_region: 'Selangor',
        phone_number: '',
        password: '',
        is_active: true,
        game_ids: { mlbb: '', pubg: '', valorant: '' }
    });

    // reset password form
    const {
        data: resetData,
        setData: setResetData,
        post: postResetPassword,
        processing: resetProcessing,
        errors: resetErrors,
        reset: resetFormReset
    } = useForm({
        password: '',
        password_confirmation: ''
    });

    // check if edit form has changed
    const isEditChanged = useMemo(() => {
        if (!editingMember) return false;
        return (
            (editData.name || '') !== (editingMember.name || '') ||
            (editData.gamer_tag || '') !== (editingMember.gamer_tag || '') ||
            (editData.state_region || '') !== (editingMember.state_region || '') ||
            (editData.phone_number || '') !== (editingMember.phone_number !== '—' ? editingMember.phone_number : '') ||
            (editData.password || '') !== '' ||
            Boolean(editData.is_active) !== Boolean(editingMember.is_active) ||
            JSON.stringify(editData.game_ids || {}) !== JSON.stringify(editingMember.game_ids || {})
        );
    }, [editData, editingMember]);

    const isAddValid = useMemo(() => {
        return Boolean(addData.name?.trim() && addData.email?.trim());
    }, [addData.name, addData.email]);

    // actions
    const handleCopyId = (memberId) => {
        navigator.clipboard.writeText(memberId);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    const openAddModal = () => {
        resetAdd();
        setAddSaved(false);
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        resetAdd();
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        postAddMember(route('admin.members.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setAddSaved(true);
                setTimeout(() => {
                    closeAddModal();
                    setAddSaved(false);
                }, 1000);
            }
        });
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setEditSaved(false);
        setShowEditPassword(false);
        setEditData({
            name: member.name || '',
            gamer_tag: member.gamer_tag || '',
            state_region: member.state_region || 'Selangor',
            phone_number: member.phone_number !== '—' ? member.phone_number : '',
            password: '',
            is_active: Boolean(member.is_active),
            game_ids: member.game_ids || { mlbb: '', pubg: '', valorant: '' }
        });
    };

    const closeEditModal = () => {
        setEditingMember(null);
        resetEdit();
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingMember) return;

        patchMember(route('admin.members.update', editingMember.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditSaved(true);
                setTimeout(() => {
                    closeEditModal();
                    setEditSaved(false);
                }, 1000);
            }
        });
    };

    const openResetPasswordModal = (member) => {
        setResetPasswordMember(member);
        setResetSaved(false);
        setCopiedPassword(false);
        setShowResetPassword(false);
        setResetData({
            password: '',
            password_confirmation: ''
        });
    };

    const closeResetPasswordModal = () => {
        setResetPasswordMember(null);
        resetFormReset();
        setResetSaved(false);
        setCopiedPassword(false);
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        if (!resetPasswordMember) return;

        postResetPassword(route('admin.members.reset-password', resetPasswordMember.id), {
            preserveScroll: true,
            onSuccess: () => {
                setResetSaved(true);
                setTimeout(() => {
                    closeResetPasswordModal();
                }, 1800);
            }
        });
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
        let pass = 'Mesf@';
        for (let i = 0; i < 6; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setResetData({
            password: pass,
            password_confirmation: pass
        });
        setShowResetPassword(true);
    };

    const setDefaultPassword = () => {
        setResetData({
            password: 'password123',
            password_confirmation: 'password123'
        });
        setShowResetPassword(true);
    };

    const handleCopyPassword = (pass) => {
        if (!pass) return;
        navigator.clipboard.writeText(pass);
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
    };

    const handleToggleStatus = (member) => {
        router.post(route('admin.members.toggle-status', member.id), {}, {
            preserveScroll: true
        });
    };

    const confirmDelete = () => {
        if (!deleteModalMember) return;
        router.delete(route('admin.members.destroy', deleteModalMember.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModalMember(null)
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedState('ALL');
        setSelectedStatus('ALL');
        router.get(route('admin.members.index'), {}, { preserveState: true });
    };

    // client side filtering
    const filteredMembers = useMemo(() => {
        return members.filter((m) => {
            if (searchTerm.trim() !== '') {
                const term = searchTerm.toLowerCase();
                const matchId = m.member_id?.toLowerCase().includes(term);
                const matchName = m.name?.toLowerCase().includes(term);
                const matchTag = m.gamer_tag?.toLowerCase().includes(term);
                const matchEmail = m.email?.toLowerCase().includes(term);
                const matchPhone = m.phone_number?.toLowerCase().includes(term);
                const matchTeam = m.team_name?.toLowerCase().includes(term);
                const matchState = m.state_region?.toLowerCase().includes(term);
                if (!matchId && !matchName && !matchTag && !matchEmail && !matchPhone && !matchTeam && !matchState) {
                    return false;
                }
            }
            if (selectedState !== 'ALL' && m.state_region !== selectedState) {
                return false;
            }
            if (selectedStatus !== 'ALL') {
                const isActive = selectedStatus === 'active';
                if (m.is_active !== isActive) return false;
            }
            return true;
        });
    }, [members, searchTerm, selectedState, selectedStatus]);

    // export filtered members to CSV
    const exportToCSV = () => {
        const headers = ['Member ID', 'Full Name', 'Gamer Tag', 'Email', 'Phone', 'State', 'Team / Squad', 'Status', 'Registered Date'];
        const rows = filteredMembers.map((m) => [
            `"${m.member_id || ''}"`,
            `"${m.name || ''}"`,
            `"${m.gamer_tag || ''}"`,
            `"${m.email || ''}"`,
            `"${m.phone_number || ''}"`,
            `"${m.state_region || ''}"`,
            `"${m.team_name || 'Independent'}"`,
            `"${m.is_active ? 'Active' : 'Suspended'}"`,
            `"${m.created_at || ''}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `mesf_members_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper to get active games array from member.game_ids
    const getMemberGames = (member) => {
        const games = [];
        const g = member.game_ids || {};
        if (g.mlbb) games.push({ code: 'MLBB', id: g.mlbb });
        if (g.valorant) games.push({ code: 'VALORANT', id: g.valorant });
        if (g.pubg) games.push({ code: 'PUBG', id: g.pubg });
        return games;
    };

    return (
        <AdminLayout title="Manage Members - MESF">
            <Head title="Community Members - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* Clean Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                            Community Members
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Directory of registered Malaysian esports players, athlete credentials, and gamer profiles.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={exportToCSV}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            <span>Export CSV</span>
                        </button>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Add Member</span>
                        </button>
                    </div>
                </div>

                {/* 3 Clean, Simple Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-2xl bg-[#090D18]/85 border border-white/10 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-mono text-slate-400 uppercase">Total Members</div>
                            <div className="text-xl font-black text-white font-mono mt-0.5">{stats.total || members.length}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090D18]/85 border border-white/10 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-mono text-slate-400 uppercase">Active Accounts</div>
                            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{stats.active || 0}</div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090D18]/85 border border-white/10 flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[11px] font-mono text-slate-400 uppercase">Suspended</div>
                            <div className="text-xl font-black text-rose-400 font-mono mt-0.5">{stats.inactive || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Clean Search & Filter Bar */}
                <div className="p-4 rounded-2xl bg-[#090D18]/85 border border-white/10 shadow-lg space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Search Input */}
                        <div className="sm:col-span-6 relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, gamer tag, member ID, phone, or squad..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                            />
                        </div>

                        {/* State Filter */}
                        <div className="sm:col-span-3">
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                                <option value="ALL">All States</option>
                                {MALAYSIAN_STATES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="sm:col-span-3">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                                <option value="ALL">All Account Status</option>
                                <option value="active">Active Only</option>
                                <option value="suspended">Suspended Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Active filter pills */}
                    {(searchTerm || selectedState !== 'ALL' || selectedStatus !== 'ALL') && (
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                            <span>Showing {filteredMembers.length} of {members.length} members</span>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Clean Members Table */}
                <div className="rounded-2xl bg-[#090D18]/85 border border-white/10 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-white/[0.02] border-b border-white/10 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 font-bold">Member ID</th>
                                    <th className="py-3.5 px-4 font-bold">Player / Legal Name</th>
                                    <th className="py-3.5 px-4 font-bold">State</th>
                                    <th className="py-3.5 px-4 font-bold">Team / Squad</th>
                                    <th className="py-3.5 px-4 font-bold">Registered Games</th>
                                    <th className="py-3.5 px-4 font-bold">Status</th>
                                    <th className="py-3.5 px-4 font-bold">Joined</th>
                                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400">
                                            No community members found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((member) => {
                                        const games = getMemberGames(member);
                                        return (
                                            <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                                {/* Member ID with Passport Quick View */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewingPassport(member)}
                                                        className="inline-flex items-center gap-2 group cursor-pointer text-left"
                                                        title="Click to view Athlete Passport"
                                                    >
                                                        <span className="h-6 w-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                                                            <IdCard className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span className="font-bold text-amber-300 font-mono text-xs group-hover:underline">
                                                            {member.member_id}
                                                        </span>
                                                    </button>
                                                </td>

                                                {/* Player / Legal Name & Email */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold font-mono text-amber-400 text-xs shrink-0">
                                                            {member.gamer_tag?.charAt(0)?.toUpperCase() || 'M'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-white text-xs truncate">
                                                                {member.gamer_tag}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 truncate">
                                                                {member.name} • <span className="font-mono text-slate-500">{member.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Location (State) */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 text-slate-300">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                        <span>{member.state_region || '—'}</span>
                                                    </div>
                                                </td>

                                                {/* Team / Squad */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {member.team_name ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[11px] font-semibold">
                                                            <Users className="w-3 h-3 text-amber-400" />
                                                            <span>{member.team_name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500 text-[11px]">Independent</span>
                                                    )}
                                                </td>

                                                {/* Games Played / IDs */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {games.length > 0 ? (
                                                            games.map((g) => (
                                                                <span
                                                                    key={g.code}
                                                                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                                                                    title={`${g.code}: ${g.id}`}
                                                                >
                                                                    {g.code}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-slate-500 text-[11px]">No game IDs</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status Toggle */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(member)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                                                        title="Click to toggle status"
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                member.is_active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-400'
                                                            }`}
                                                        />
                                                        <span
                                                            className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                                                                member.is_active ? 'text-emerald-400' : 'text-red-400'
                                                            }`}
                                                        >
                                                            {member.is_active ? 'Active' : 'Suspended'}
                                                        </span>
                                                    </button>
                                                </td>

                                                {/* Joined Date */}
                                                <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                                                    {member.created_at}
                                                </td>

                                                {/* Action Buttons */}
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setViewingPassport(member)}
                                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                                            title="View Digital Passport Card"
                                                        >
                                                            <IdCard className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openResetPasswordModal(member)}
                                                            className="p-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                                            title="Reset Password"
                                                        >
                                                            <KeyRound className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(member)}
                                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                                            title="Edit Details"
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
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DIGITAL PASSPORT MODAL */}
            {viewingPassport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-md rounded-3xl bg-[#090D18] border border-white/15 p-6 text-white shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-2">
                                <IdCard className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                                    Athlete Passport Card
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingPassport(null)}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Card Content */}
                        <div className="rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 p-5 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-mono font-black text-lg">
                                        {viewingPassport.gamer_tag?.charAt(0)?.toUpperCase() || 'M'}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-base leading-tight">
                                            {viewingPassport.gamer_tag}
                                        </h3>
                                        <p className="text-xs text-slate-400">{viewingPassport.name}</p>
                                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">{viewingPassport.email}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                                    viewingPassport.is_active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'
                                }`}>
                                    {viewingPassport.is_active ? 'Active' : 'Suspended'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                                <div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Passport ID</span>
                                    <span className="font-mono font-bold text-amber-300">{viewingPassport.member_id}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase block">State</span>
                                    <span className="font-semibold text-slate-200">{viewingPassport.state_region || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Competitive Team</span>
                                    <span className="font-semibold text-slate-200">{viewingPassport.team_name || 'Independent'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Phone / Contact</span>
                                    <span className="font-semibold text-slate-200">{viewingPassport.phone_number || '—'}</span>
                                </div>
                            </div>

                            {/* Registered Games & IDs */}
                            <div className="pt-3 border-t border-white/10">
                                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">Registered Game Accounts</span>
                                <div className="space-y-1 text-xs font-mono">
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white/[0.02]">
                                        <span className="text-slate-400">MLBB ID:</span>
                                        <span className="text-white font-semibold">{viewingPassport.game_ids?.mlbb || 'Not registered'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white/[0.02]">
                                        <span className="text-slate-400">Valorant Riot ID:</span>
                                        <span className="text-white font-semibold">{viewingPassport.game_ids?.valorant || 'Not registered'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white/[0.02]">
                                        <span className="text-slate-400">PUBG Mobile UID:</span>
                                        <span className="text-white font-semibold">{viewingPassport.game_ids?.pubg || 'Not registered'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => handleCopyId(viewingPassport.member_id)}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                            >
                                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const target = viewingPassport;
                                        setViewingPassport(null);
                                        openResetPasswordModal(target);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>Reset Password</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewingPassport(null)}
                                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD MEMBER MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-lg rounded-3xl bg-[#090D18] border border-white/15 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                                    Register New Community Member
                                </h3>
                                <p className="text-xs text-slate-400">Add a new player profile to the community directory.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeAddModal}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Full Legal Name <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.name}
                                        onChange={(e) => setAddData('name', e.target.value)}
                                        placeholder="e.g. Muhammad Faris"
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {addErrors.name && <p className="mt-1 text-xs text-red-400">{addErrors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Gamer Tag / In-Game Name
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.gamer_tag}
                                        onChange={(e) => setAddData('gamer_tag', e.target.value)}
                                        placeholder="e.g. ShadowStrike"
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Email Address <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={addData.email}
                                        onChange={(e) => setAddData('email', e.target.value)}
                                        placeholder="athlete@example.com"
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {addErrors.email && <p className="mt-1 text-xs text-red-400">{addErrors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        State
                                    </label>
                                    <select
                                        value={addData.state_region}
                                        onChange={(e) => setAddData('state_region', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                                    >
                                        {MALAYSIAN_STATES.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Phone / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.phone_number}
                                        onChange={(e) => setAddData('phone_number', e.target.value)}
                                        placeholder="+6012-3456789"
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Initial Password (Optional)
                                    </label>
                                    <input
                                        type="password"
                                        value={addData.password}
                                        onChange={(e) => setAddData('password', e.target.value)}
                                        placeholder="Defaults to password123"
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            {/* Optional Player Game IDs */}
                            <div className="pt-2 border-t border-white/10 space-y-2">
                                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                                    Player Game IDs (Optional)
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">MLBB ID + Zone</label>
                                        <input
                                            type="text"
                                            value={addData.game_ids?.mlbb || ''}
                                            onChange={(e) => setAddData('game_ids', { ...addData.game_ids, mlbb: e.target.value })}
                                            placeholder="123456 (2026)"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">Valorant Riot ID</label>
                                        <input
                                            type="text"
                                            value={addData.game_ids?.valorant || ''}
                                            onChange={(e) => setAddData('game_ids', { ...addData.game_ids, valorant: e.target.value })}
                                            placeholder="Player#MY1"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">PUBG Mobile UID</label>
                                        <input
                                            type="text"
                                            value={addData.game_ids?.pubg || ''}
                                            onChange={(e) => setAddData('game_ids', { ...addData.game_ids, pubg: e.target.value })}
                                            placeholder="512345678"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addProcessing || !isAddValid}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                        addSaved
                                            ? 'bg-emerald-500 text-black'
                                            : !isAddValid
                                            ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black'
                                    }`}
                                >
                                    {addProcessing ? 'Creating...' : addSaved ? 'Registered!' : 'Register Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MEMBER DETAILS MODAL */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-lg rounded-3xl bg-[#090D18] border border-white/15 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div>
                                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                                    ID: {editingMember.member_id}
                                </span>
                                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                                    Edit Member Profile
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Gamer Tag / IGN <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.gamer_tag}
                                        onChange={(e) => setEditData('gamer_tag', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {editErrors.gamer_tag && <p className="mt-1 text-xs text-red-400">{editErrors.gamer_tag}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Full Legal Name <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                        required
                                    />
                                    {editErrors.name && <p className="mt-1 text-xs text-red-400">{editErrors.name}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        State
                                    </label>
                                    <select
                                        value={editData.state_region}
                                        onChange={(e) => setEditData('state_region', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-[#070B14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                                    >
                                        {MALAYSIAN_STATES.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Phone / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.phone_number}
                                        onChange={(e) => setEditData('phone_number', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            {/* Optional Password Update */}
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold text-slate-300">
                                        Change Password (Optional)
                                    </span>
                                    <span className="text-[10px] text-slate-500">Leave blank to keep existing</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showEditPassword ? 'text' : 'password'}
                                        value={editData.password}
                                        onChange={(e) => setEditData('password', e.target.value)}
                                        placeholder="Enter new password (min. 6 characters)..."
                                        className="w-full px-3 py-2 pr-9 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEditPassword(!showEditPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                                    >
                                        {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* In-Game IDs */}
                            <div className="pt-2 border-t border-white/10 space-y-2">
                                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                                    Player Game IDs (Optional)
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">MLBB ID + Zone</label>
                                        <input
                                            type="text"
                                            value={editData.game_ids?.mlbb || ''}
                                            onChange={(e) => setEditData('game_ids', { ...editData.game_ids, mlbb: e.target.value })}
                                            placeholder="123456 (2026)"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">Valorant Riot ID</label>
                                        <input
                                            type="text"
                                            value={editData.game_ids?.valorant || ''}
                                            onChange={(e) => setEditData('game_ids', { ...editData.game_ids, valorant: e.target.value })}
                                            placeholder="Player#MY1"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">PUBG Mobile UID</label>
                                        <input
                                            type="text"
                                            value={editData.game_ids?.pubg || ''}
                                            onChange={(e) => setEditData('game_ids', { ...editData.game_ids, pubg: e.target.value })}
                                            placeholder="512345678"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing || !isEditChanged}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                        editSaved
                                            ? 'bg-emerald-500 text-black'
                                            : !isEditChanged
                                            ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black'
                                    }`}
                                >
                                    {editProcessing ? 'Saving...' : editSaved ? 'Saved!' : 'Save Details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RESET PASSWORD MODAL */}
            {resetPasswordMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-md rounded-3xl bg-[#090D18] border border-white/15 p-6 text-white shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-2.5">
                                <KeyRound className="w-4 h-4 text-amber-400" />
                                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                                    Reset Password
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={closeResetPasswordModal}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Member Identity preview */}
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 mb-4 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-white text-xs">{resetPasswordMember.gamer_tag}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{resetPasswordMember.email}</div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                                {resetPasswordMember.member_id}
                            </span>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button
                                type="button"
                                onClick={setDefaultPassword}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3 text-amber-400" />
                                <span>Default: <code className="text-amber-400 font-mono">password123</code></span>
                            </button>
                            <button
                                type="button"
                                onClick={generateRandomPassword}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>Generate Secure</span>
                            </button>
                        </div>

                        <form onSubmit={handleResetSubmit} className="space-y-3.5">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11px] font-semibold text-slate-300">
                                        New Password <span className="text-amber-400">*</span>
                                    </label>
                                    {resetData.password && (
                                        <button
                                            type="button"
                                            onClick={() => handleCopyPassword(resetData.password)}
                                            className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                                        >
                                            {copiedPassword ? (
                                                <>
                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                    <span className="text-emerald-400">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showResetPassword ? 'text' : 'password'}
                                        value={resetData.password}
                                        onChange={(e) => setResetData('password', e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        className="w-full px-3 py-2 pr-9 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowResetPassword(!showResetPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                                    >
                                        {showResetPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                {resetErrors.password && <p className="mt-1 text-xs text-red-400">{resetErrors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                    Confirm New Password <span className="text-amber-400">*</span>
                                </label>
                                <input
                                    type={showResetPassword ? 'text' : 'password'}
                                    value={resetData.password_confirmation}
                                    onChange={(e) => setResetData('password_confirmation', e.target.value)}
                                    placeholder="Re-type new password"
                                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                                    required
                                />
                                {resetErrors.password_confirmation && (
                                    <p className="mt-1 text-xs text-red-400">{resetErrors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="p-2.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-[11px] text-slate-300 flex items-start gap-2">
                                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span>Takes effect immediately for member login.</span>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={closeResetPasswordModal}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetProcessing || !resetData.password || resetData.password !== resetData.password_confirmation}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                        resetSaved
                                            ? 'bg-emerald-500 text-black'
                                            : (!resetData.password || resetData.password !== resetData.password_confirmation)
                                            ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black'
                                    }`}
                                >
                                    {resetSaved ? 'Password Updated!' : resetProcessing ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModalMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-sm rounded-2xl bg-[#090D18] border border-red-500/30 p-5 text-white shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Delete Member</h3>
                                <p className="text-xs text-slate-400">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-300">
                            Are you sure you want to delete <strong className="text-white">{deleteModalMember.name}</strong> ({deleteModalMember.gamer_tag})?
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setDeleteModalMember(null)}
                                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
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
