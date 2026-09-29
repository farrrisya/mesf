// --1. imports--
import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    UserCheck,
    Plus,
    Search,
    Edit2,
    Trash2,
    Shield,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    X,
    LogIn
} from 'lucide-react';

// --2. properties--
const ROLE_BADGES = {
    admin: {
        label: 'Admin',
        badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
        avatar: 'bg-amber-400/10 text-amber-300 border-amber-400/30'
    },
    editor: {
        label: 'Editor',
        badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
        avatar: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
    },
    secretariat: {
        label: 'Secretary',
        badge: 'bg-indigo-400/15 text-indigo-300 border-indigo-400/30',
        avatar: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30'
    }
};

const ROLE_TABS = [
    { id: 'all', label: 'All' },
    { id: 'admin', label: 'Admin' },
    { id: 'editor', label: 'Editor' },
    { id: 'secretariat', label: 'Secretary' }
];

// --3. main component--
export default function Index({ users = [] }) {
    const { auth, errors = {}, flash = {} } = usePage().props; // properties
    const currentUserId = auth?.user?.id; // state
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [roleFilter, setRoleFilter] = useState('all'); // state
    const [confirmModal, setConfirmModal] = useState({ // state
        isOpen: false,
        user: null
    });

    // --4. actions--
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const counts = {
        all: users.length,
        admin: users.filter((u) => u.role === 'admin').length,
        editor: users.filter((u) => u.role === 'editor').length,
        secretariat: users.filter((u) => u.role === 'secretariat').length
    };

    const filteredUsers = users.filter((u) => { // convert
        const matchesQuery =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()); // check
        const matchesRole = roleFilter === 'all' || u.role === roleFilter; // check
        return matchesQuery && matchesRole;
    });

    const handleSwitchTo = (targetUser) => { // trigger
        if (targetUser.role === 'admin') return; // check
        if (window.confirm(`Adakah anda pasti mahu menukar sesi akaun kepada ${targetUser.name} (${targetUser.role})?`)) { // check
            router.post(route('admin.users.switch-to', targetUser.id)); // redirect
        }
    };

    const handleDelete = (userToDelete) => { // trigger
        setConfirmModal({
            isOpen: true,
            user: userToDelete
        });
    };

    const confirmDelete = () => { // trigger
        if (!confirmModal.user) return; // check
        router.delete(route('admin.users.destroy', confirmModal.user.id), { // redirect
            preserveScroll: true,
            onFinish: () => {
                setConfirmModal({ isOpen: false, user: null }); // toggle
            }
        });
    };

    // --5. UI--
    return (
        <AdminLayout title="Manage Staff Roles - MESF Admin">
            <Head title="Manage Roles - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* Feedback Alerts */}
                {errors?.error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 animate-fadeIn">
                        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold">{errors.error}</span>
                    </div>
                )}

                {flash?.success && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fadeIn">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold">{flash.success}</span>
                    </div>
                )}

                {/* Filter and Search Bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* search input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                id="staff-search-input"
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder="Search staff by name or email address..."
                                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')} // trigger
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* action controls */}
                        <div className="flex items-center gap-3">
                            <Link
                                id="add-staff-btn"
                                href={route('admin.users.create')} // redirect
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Staff Account</span>
                            </Link>
                        </div>
                    </div>

                    {/* role filter tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
                        {ROLE_TABS.map((tab) => {
                            const isActive = roleFilter === tab.id;
                            const count = counts[tab.id] || 0;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setRoleFilter(tab.id)} // trigger
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                                        isActive
                                            ? 'bg-amber-400 text-black shadow-md font-extrabold'
                                            : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Staff List Table Card */}
                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-3.5 px-5">Staff Member</th>
                                    <th className="py-3.5 px-5 w-40">Role</th>
                                    <th className="py-3.5 px-5 w-32">Status</th>
                                    <th className="py-3.5 px-5 w-40">Registered</th>
                                    <th className="py-3.5 px-5 w-36 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-14 text-center">
                                            <div className="space-y-2 max-w-sm mx-auto">
                                                <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
                                                <p className="text-sm font-semibold text-slate-400">
                                                    No staff accounts found
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {searchQuery ? `No staff match "${searchQuery}".` : 'No accounts exist under this filter.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => {
                                        const roleConfig = ROLE_BADGES[u.role] || {
                                            label: u.role,
                                            badge: 'bg-slate-500/20 text-slate-300 border-white/10',
                                            avatar: 'bg-slate-500/10 text-slate-300 border-white/10'
                                        };
                                        const isCurrentUser = u.id === currentUserId; // check
                                        const canImpersonate = auth?.user?.role === 'admin' && !isCurrentUser && u.role !== 'admin'; // check

                                        return (
                                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${roleConfig.avatar}`}>
                                                            {getInitials(u.name)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-white flex items-center gap-2 truncate">
                                                                <span className="truncate">{u.name}</span>
                                                                {isCurrentUser && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono font-normal shrink-0">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-slate-400 font-mono truncate">
                                                                {u.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${roleConfig.badge}`}>
                                                        <Shield className="w-3.5 h-3.5" />
                                                        {roleConfig.label}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5">
                                                    {u.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                                                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-5 text-xs text-slate-400 font-mono">
                                                    {new Date(u.created_at).toLocaleDateString('en-MY', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>

                                                <td className="py-4 px-5 text-right">
                                                    <div className="inline-flex items-center justify-end gap-1.5">
                                                        {canImpersonate ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSwitchTo(u)} // trigger
                                                                className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 border border-amber-400/30 transition-all cursor-pointer shadow-sm"
                                                                title={`Switch into ${u.name}'s account`}
                                                            >
                                                                <LogIn className="w-3.5 h-3.5" />
                                                            </button>
                                                        ) : (
                                                            <div className="w-[34px]" />
                                                        )}

                                                        <Link
                                                            href={route('admin.users.edit', u.id)} // redirect
                                                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 border border-white/10 transition-all cursor-pointer"
                                                            title="Edit Role & Status"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Link>

                                                        {!isCurrentUser ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(u)} // trigger
                                                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
                                                                title="Delete Staff Account"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        ) : (
                                                            <div className="w-[34px]" />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer Stats */}
                    <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-slate-400">
                        <span>
                            Showing <strong className="text-white">{filteredUsers.length}</strong> of <strong className="text-white">{users.length}</strong> accounts
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                            MESF Role Administration
                        </span>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {confirmModal.isOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:pl-72 bg-black/40 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setConfirmModal({ isOpen: false, user: null })} // toggle
                    >
                        <div
                            className="relative w-full max-w-md rounded-3xl bg-[#0B101D] border border-white/20 p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-4"
                            onClick={(e) => e.stopPropagation()} // trigger
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                        Delete Staff Account?
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal({ isOpen: false, user: null })} // toggle
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Are you sure you want to permanently delete the staff account for{' '}
                                <span className="font-bold text-white font-mono">{confirmModal.user?.name}</span> ({confirmModal.user?.email})?
                            </p>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal({ isOpen: false, user: null })} // toggle
                                    className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-white/10 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete} // trigger
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
