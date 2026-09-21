// --1. imports--
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Activity,
    Search,
    User as UserIcon,
    Clock,
    Layers,
    ChevronLeft,
    ChevronRight,
    Shield
} from 'lucide-react';

// --2. properties--
const ACTION_BADGES = {
    'Tambah': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Kemaskini': 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    'Hapus': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'Log Masuk': 'bg-sky-400/20 text-sky-300 border-sky-400/30',
};

const getModelLabel = (modelType) => { // convert
    if (!modelType) return '-';
    const parts = modelType.split('\\');
    return parts[parts.length - 1] || modelType;
};

// --3. main component--
export default function Index({ logs = { data: [], links: [] }, filters = {} }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || ''); // state

    // --4. actions--
    const handleSearch = (e) => { // trigger
        e.preventDefault(); // check
        router.get(route('admin.activity-logs.index'), { search: searchQuery }, { // redirect
            preserveState: true,
            preserveScroll: true
        });
    };

    // --5. UI--
    return (
        <AdminLayout title="Activity Logs - MESF Admin">
            <Head title="Activity Logs - Admin" />

            <div className="space-y-6 max-w-7xl pb-16">
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                            Activity Logs & Audit Trail
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            System audit history tracking federation administrative updates, additions, and deletions.
                        </p>
                    </div>

                    <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 w-fit">
                        {logs.total ?? logs.data?.length ?? 0} Recorded Actions
                    </span>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch} // trigger
                    className="p-4 rounded-3xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl flex items-center gap-3"
                >
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder="Search logs by staff name, action, description, or model..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                        Search
                    </button>
                </form>

                {/* Logs Table Card */}
                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-5">Timestamp</th>
                                    <th className="py-4 px-5">User</th>
                                    <th className="py-4 px-5">Action</th>
                                    <th className="py-4 px-5">Module / Target</th>
                                    <th className="py-4 px-5">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {!logs.data || logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500">
                                            No activity logs recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => {
                                        const actionBadge = ACTION_BADGES[log.action] || 'bg-slate-500/20 text-slate-300 border-white/10';
                                        const modelName = getModelLabel(log.model_type);

                                        return (
                                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                {/* Timestamp */}
                                                <td className="py-4 px-5 font-mono text-xs text-slate-300 whitespace-nowrap">
                                                    <div>
                                                        {new Date(log.created_at).toLocaleDateString('en-MY', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        {new Date(log.created_at).toLocaleTimeString('en-MY', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit'
                                                        })}
                                                    </div>
                                                </td>

                                                {/* User */}
                                                <td className="py-4 px-5">
                                                    {log.user ? (
                                                        <div>
                                                            <div className="font-bold text-white flex items-center gap-1.5">
                                                                <span>{log.user.name}</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 font-mono">
                                                                {log.user.email}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-500 italic">System / Anonymous</span>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td className="py-4 px-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${actionBadge}`}>
                                                        {log.action}
                                                    </span>
                                                </td>

                                                {/* Model / Target */}
                                                <td className="py-4 px-5 font-mono text-xs text-amber-300/90 whitespace-nowrap">
                                                    {modelName} {log.model_id ? `#${log.model_id}` : ''}
                                                </td>

                                                {/* Description */}
                                                <td className="py-4 px-5 text-slate-300 text-xs leading-relaxed max-w-xs sm:max-w-md">
                                                    {log.description || '-'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.links && logs.links.length > 3 && (
                        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-2">
                            <div className="text-xs text-slate-400 font-mono">
                                Showing {logs.from || 0} to {logs.to || 0} of {logs.total || 0} logs
                            </div>
                            <div className="flex items-center gap-1.5">
                                {logs.links.map((link, idx) => {
                                    if (!link.url && link.label.includes('Previous')) {
                                        return null;
                                    }
                                    if (!link.url && link.label.includes('Next')) {
                                        return null;
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'} // redirect
                                            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                                                link.active
                                                    ? 'bg-amber-400 text-black shadow'
                                                    : link.url
                                                        ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                                                        : 'text-slate-600 cursor-not-allowed opacity-40'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
