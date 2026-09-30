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
    Shield,
    LogIn,
    PlusCircle,
    Edit3,
    Trash2,
    SlidersHorizontal,
    X
} from 'lucide-react';

// --2. properties--
const ACTION_BADGE_STYLES = {
    'Create': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'Update': 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    'Delete': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    'Sign In': 'bg-sky-400/15 text-sky-300 border-sky-400/30',
    'Sign Out': 'bg-slate-400/15 text-slate-300 border-slate-400/30',
    'Start Impersonation': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    'End Impersonation': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    'Status Change': 'bg-teal-400/15 text-teal-300 border-teal-400/30',
    'Featured Toggle': 'bg-amber-500/15 text-amber-200 border-amber-500/30',
};

const ACTION_TABS = [
    { id: 'all', label: 'All Activities' },
    { id: 'sign_in', label: 'Sign Ins', icon: LogIn },
    { id: 'create', label: 'Creations', icon: PlusCircle },
    { id: 'update', label: 'Updates', icon: Edit3 },
    { id: 'delete', label: 'Deletions', icon: Trash2 },
    { id: 'impersonation', label: 'Impersonations', icon: Shield },
];

const formatEnglishAction = (action) => { // convert
    if (!action) return 'Activity';
    const map = {
        'Tambah': 'Create',
        'create': 'Create',
        'Create': 'Create',
        'Kemaskini': 'Update',
        'update': 'Update',
        'Update': 'Update',
        'Hapus': 'Delete',
        'delete': 'Delete',
        'Delete': 'Delete',
        'Log Masuk': 'Sign In',
        'login': 'Sign In',
        'Sign In': 'Sign In',
        'logout': 'Sign Out',
        'impersonation_start': 'Start Impersonation',
        'impersonation_end': 'End Impersonation',
        'toggle_status': 'Status Change',
        'toggle_featured': 'Featured Toggle',
    };
    return map[action] || action;
};

const formatEnglishDescription = (desc) => { // convert
    if (!desc) return '-';
    let text = String(desc);
    text = text.replace(/Telah log masuk ke sistem/gi, 'Signed into the administrative portal');
    text = text.replace(/Menambah data /gi, 'Created ');
    text = text.replace(/Mengemaskini data /gi, 'Updated ');
    text = text.replace(/Menghapus data /gi, 'Deleted ');
    text = text.replace(/Notis & Berita/gi, 'News Article');
    text = text.replace(/Penerbitan/gi, 'Publication');
    text = text.replace(/Muat Turun \(Dokumen\)/gi, 'Official Document');
    text = text.replace(/Galeri/gi, 'Gallery');
    text = text.replace(/Album/gi, 'Photo Album');
    text = text.replace(/Slider/gi, 'Banner Slider');
    text = text.replace(/Tetapan Sistem/gi, 'System Settings');
    text = text.replace(/Pengguna \(Staff & Admin\)/gi, 'Staff User Account');
    text = text.replace(/log masuk/gi, 'sign in');
    return text;
};

const formatEnglishModel = (modelType) => { // convert
    if (!modelType) return '-';
    const parts = modelType.split('\\');
    const base = parts[parts.length - 1] || modelType;
    const map = {
        'Notice': 'News Article',
        'News': 'News Article',
        'League': 'Tournament League',
        'Team': 'Esports Team',
        'EsportMatch': 'Match Fixture',
        'Document': 'Official Document',
        'Penerbitan': 'Publication',
        'User': 'Staff Account',
        'Setting': 'System Setting',
        'Gallery': 'Photo Gallery',
        'Album': 'Photo Album',
        'Slider': 'Banner Slider',
        'Inquiry': 'Public Inquiry',
        'Media': 'Media Asset',
    };
    return map[base] || base;
};

// --3. main component--
export default function Index({
    logs = { data: [], links: [] },
    metrics = { total: 0, sign_ins: 0, creates: 0, updates: 0, deletes: 0 },
    filters = {}
}) {
    const [searchQuery, setSearchQuery] = useState(filters.search || ''); // state
    const currentActionType = filters.action_type || 'all'; // state

    // --4. actions--
    const handleFilter = (actionType = currentActionType, search = searchQuery) => { // trigger
        router.get(
            route('admin.activity-logs.index'),
            {
                search: search,
                action_type: actionType !== 'all' ? actionType : undefined
            },
            {
                preserveState: true,
                preserveScroll: true
            }
        );
    };

    const handleSearchSubmit = (e) => { // trigger
        e.preventDefault(); // check
        handleFilter(currentActionType, searchQuery); // trigger
    };

    const handleClearFilters = () => { // trigger
        setSearchQuery(''); // state
        router.get(route('admin.activity-logs.index'), {}, { preserveState: true }); // redirect
    };

    const hasActiveFilters = Boolean(searchQuery || (currentActionType && currentActionType !== 'all')); // check

    // --5. UI--
    return (
        <AdminLayout
            title="Activity Logs - MESF Admin"
            contentClassName="px-4 pt-3 pb-8 sm:px-8 sm:pt-4 sm:pb-10"
        >
            <Head title="Activity & Audit Logs - Admin" />

            <div className="space-y-4 sm:space-y-5 max-w-7xl">
                {/* stats summary cards: starts immediately at the top */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* card 1: total activities */}
                    <div
                        onClick={() => handleFilter('all', searchQuery)} // trigger
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            currentActionType === 'all'
                                ? 'bg-amber-400/10 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                                : 'bg-[#090D18]/85 border-white/10 hover:border-white/20'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Total Events
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                                <Activity className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono mt-2">
                            {metrics.total ?? 0}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">All administrative audit logs</p>
                    </div>

                    {/* card 2: sign ins */}
                    <div
                        onClick={() => handleFilter('sign_in', searchQuery)} // trigger
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            currentActionType === 'sign_in'
                                ? 'bg-sky-500/10 border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.12)]'
                                : 'bg-[#090D18]/85 border-white/10 hover:border-white/20'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                                User Sign Ins
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                                <LogIn className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono mt-2">
                            {metrics.sign_ins ?? 0}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Staff portal authentications</p>
                    </div>

                    {/* card 3: content updates */}
                    <div
                        onClick={() => handleFilter('update', searchQuery)} // trigger
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            currentActionType === 'update'
                                ? 'bg-amber-400/10 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                                : 'bg-[#090D18]/85 border-white/10 hover:border-white/20'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                                Modifications
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-300">
                                <Edit3 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono mt-2">
                            {metrics.updates ?? 0}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Records updated & adjusted</p>
                    </div>

                    {/* card 4: deletions */}
                    <div
                        onClick={() => handleFilter('delete', searchQuery)} // trigger
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            currentActionType === 'delete'
                                ? 'bg-rose-500/10 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
                                : 'bg-[#090D18]/85 border-white/10 hover:border-white/20'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                                Record Deletions
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                                <Trash2 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white font-mono mt-2">
                            {metrics.deletes ?? 0}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Removed data items</p>
                    </div>
                </div>

                {/* search & category filter toolbar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder="Search by staff name, email, action, module, or description..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_16px_rgba(251,191,36,0.25)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span>Filter Logs</span>
                            </button>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters} // trigger
                                    className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Clear</span>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* category filter pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-white/5 pt-3 scrollbar-none">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>Action Category:</span>
                        </span>
                        {ACTION_TABS.map((tab) => {
                            const isSelected = currentActionType === tab.id;
                            const TabIcon = tab.icon;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleFilter(tab.id, searchQuery)} // trigger
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                                        isSelected
                                            ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                                            : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                                    }`}
                                >
                                    {TabIcon && <TabIcon className="w-3.5 h-3.5" />}
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* main activity logs table card */}
                <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-5">Date & Time</th>
                                    <th className="py-4 px-5">Staff Member</th>
                                    <th className="py-4 px-5">Action Type</th>
                                    <th className="py-4 px-5">Target Module</th>
                                    <th className="py-4 px-5">Activity Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {!logs.data || logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-14 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-3">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-semibold text-white">No activity logs found</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {hasActiveFilters
                                                    ? 'No activity records matched your filter criteria.'
                                                    : 'No administrative actions have been logged yet.'}
                                            </p>
                                            {hasActiveFilters && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearFilters} // trigger
                                                    className="mt-3 text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
                                                >
                                                    Reset all search & category filters
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => {
                                        const englishAction = formatEnglishAction(log.action);
                                        const actionBadgeStyle = ACTION_BADGE_STYLES[englishAction] || 'bg-slate-500/15 text-slate-300 border-white/10';
                                        const modelName = formatEnglishModel(log.model_type);
                                        const englishDesc = formatEnglishDescription(log.description);

                                        return (
                                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                {/* Date & Time */}
                                                <td className="py-4 px-5 font-mono text-xs text-slate-300 whitespace-nowrap">
                                                    <div className="font-semibold text-white flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>
                                                            {new Date(log.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 pl-5">
                                                        {new Date(log.created_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </div>
                                                </td>

                                                {/* User */}
                                                <td className="py-4 px-5">
                                                    {log.user ? (
                                                        <div className="space-y-0.5">
                                                            <div className="font-bold text-white flex items-center gap-2">
                                                                <span>{log.user.name}</span>
                                                                {log.user.role && (
                                                                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                                                        {log.user.role}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 font-mono">
                                                                {log.user.email}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-slate-400 italic text-xs">
                                                            <Shield className="w-3.5 h-3.5" />
                                                            <span>System / Automated</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td className="py-4 px-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase font-mono ${actionBadgeStyle}`}>
                                                        {englishAction}
                                                    </span>
                                                </td>

                                                {/* Module / Target */}
                                                <td className="py-4 px-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                                                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{modelName}</span>
                                                    </div>
                                                    {log.model_id && (
                                                        <div className="text-[10px] font-mono text-slate-400 pl-5">
                                                            ID #{log.model_id}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Description */}
                                                <td className="py-4 px-5 text-slate-300 text-xs leading-relaxed max-w-sm sm:max-w-md">
                                                    <span>{englishDesc}</span>
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
                        <div className="px-5 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs text-slate-400 font-mono">
                                Showing {logs.from || 0} to {logs.to || 0} of {logs.total || 0} records
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
                                                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
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
