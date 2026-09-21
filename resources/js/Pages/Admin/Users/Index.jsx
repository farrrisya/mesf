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
    XCircle,
    AlertTriangle,
    X
} from 'lucide-react';

// --2. properties--
const ROLE_BADGES = {
    admin: {
        label: 'Admin',
        badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30'
    },
    editor: {
        label: 'Editor',
        badge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
    },
    secretariat: {
        label: 'Secretariat',
        badge: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30'
    }
};

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
    const filteredUsers = users.filter((u) => { // convert
        const matchesQuery =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()); // check
        const matchesRole = roleFilter === 'all' || u.role === roleFilter; // check
        return matchesQuery && matchesRole;
    });

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
                {/* Header title & Add User Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                            Manage Staff Roles
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Assign management portal privileges, create staff accounts, and regulate active permissions.
                        </p>
                    </div>

                    <Link
                        href={route('admin.users.create')} // redirect
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer w-fit"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Staff Account</span>
                    </Link>
                </div>

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
                <div className="p-4 rounded-3xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder="Search by staff name or email address..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={roleFilter} // state
                            onChange={(e) => setRoleFilter(e.target.value)} // trigger
                            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/10 text-xs sm:text-sm text-slate-300 focus:border-amber-400 outline-none transition-all cursor-pointer font-sans"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="secretariat">Secretariat</option>
                        </select>
                    </div>
                </div>

                {/* Staff List Table Card */}
                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-5">Staff Member</th>
                                    <th className="py-4 px-5">Role</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5">Registered</th>
                                    <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500">
                                            No staff accounts found matching your query.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => {
                                        const roleConfig = ROLE_BADGES[u.role] || {
                                            label: u.role,
                                            badge: 'bg-slate-500/20 text-slate-300 border-white/10'
                                        };
                                        const isCurrentUser = u.id === currentUserId; // check

                                        return (
                                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-5">
                                                    <div className="font-bold text-white flex items-center gap-2">
                                                        <span>{u.name}</span>
                                                        {isCurrentUser && (
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono font-normal">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                                                        {u.email}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleConfig.badge}`}>
                                                        <Shield className="w-3 h-3" />
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
                                                    <div className="inline-flex items-center gap-2">
                                                        <Link
                                                            href={route('admin.users.edit', u.id)} // redirect
                                                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 border border-white/10 transition-all cursor-pointer"
                                                            title="Edit Role & Status"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(u)} // trigger
                                                            disabled={isCurrentUser} // check
                                                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                                                isCurrentUser
                                                                    ? 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed opacity-40'
                                                                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border-rose-500/20'
                                                            }`}
                                                            title={isCurrentUser ? 'Cannot delete your own account' : 'Delete Staff Account'}
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
