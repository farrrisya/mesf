// --1. imports--
import { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    MessageSquare,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Filter,
    Users,
    Handshake,
    Trophy,
    Building2,
    Mail,
    Phone,
    Calendar,
    Save,
    X,
    Lock,
    AlertCircle,
    ChevronRight,
    MapPin,
    Gamepad2
} from 'lucide-react';

// --2. properties--
const TYPE_CONFIG = {
    join_tournament: {
        label: 'Join Tournament',
        badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        icon: Users,
        color: 'text-purple-400',
    },
    partnership: {
        label: 'Partnership',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        icon: Handshake,
        color: 'text-emerald-400',
    },
    host_tournament: {
        label: 'Host Tournament',
        badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
        icon: Trophy,
        color: 'text-amber-400',
    },
};

const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
        dot: 'bg-amber-400',
    },
    reviewed: {
        label: 'Reviewed',
        badge: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
        dot: 'bg-sky-400',
    },
    approved: {
        label: 'Approved',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
    },
    rejected: {
        label: 'Rejected',
        badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        dot: 'bg-rose-400',
    },
};

// --3. main component--
export default function Inquiries({ inquiries = { data: [] }, filters = {}, stats = {} }) {
    const { auth } = usePage().props; // properties
    const user = auth?.user; // state
    const userRole = user?.role || 'admin'; // state
    const inquiryList = inquiries.data || []; // state

    // Filter states
    const [searchQuery, setSearchQuery] = useState(filters.search || ''); // state
    const [selectedType, setSelectedType] = useState(filters.type || 'all'); // state
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all'); // state

    // Selected inquiry modal detail state
    const [activeInquiry, setActiveInquiry] = useState(null); // state
    const [notesText, setNotesText] = useState(''); // state
    const [isUpdating, setIsUpdating] = useState(false); // state
    const [actionMessage, setActionMessage] = useState(null); // state

    // Open detail modal handler
    const handleOpenDetail = (item) => { // trigger
        setActiveInquiry(item); // state
        setNotesText(item.admin_notes || ''); // state
        setActionMessage(null); // state
    };

    // Close modal
    const handleCloseDetail = () => { // trigger
        setActiveInquiry(null); // state
    };

    // --4. actions--
    // Update status or notes
    const handleUpdateStatus = (newStatus) => { // trigger
        if (!activeInquiry) return; // check

        // Check secretariat restriction client-side
        if (userRole === 'secretariat' && newStatus === 'approved' && activeInquiry.type !== 'join_tournament') {
            setActionMessage({ type: 'error', text: 'Only Admin can approve partnership or tournament sanctioning inquiries.' }); // check
            return;
        }

        setIsUpdating(true); // state
        router.put(`/admin/inquiries/${activeInquiry.id}`, {
            status: newStatus, // state
            admin_notes: notesText, // state
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsUpdating(false); // state
                setActionMessage({ type: 'success', text: `Inquiry marked as ${newStatus} successfully.` }); // state
                // Update local active modal state
                setActiveInquiry(prev => prev ? { ...prev, status: newStatus, admin_notes: notesText, handled_by: user?.id, handler: { name: user?.name, role: user?.role } } : null); // state
            },
            onError: (err) => {
                setIsUpdating(false); // state
                setActionMessage({ type: 'error', text: err?.message || 'Failed to update inquiry.' }); // state
            }
        }); // save
    };

    // Save notes only
    const handleSaveNotes = () => { // trigger
        if (!activeInquiry) return; // check
        setIsUpdating(true); // state
        router.put(`/admin/inquiries/${activeInquiry.id}`, {
            status: activeInquiry.status, // state
            admin_notes: notesText, // state
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsUpdating(false); // state
                setActionMessage({ type: 'success', text: 'Internal notes saved.' }); // state
                setActiveInquiry(prev => prev ? { ...prev, admin_notes: notesText } : null); // state
            },
            onError: () => {
                setIsUpdating(false); // state
                setActionMessage({ type: 'error', text: 'Failed to save notes.' }); // state
            }
        }); // save
    };

    // Filter items locally as user types and switches filters
    const filteredInquiries = useMemo(() => { // filter
        return inquiryList.filter((item) => {
            // Type filter
            if (selectedType !== 'all' && item.type !== selectedType) return false; // check

            // Status filter
            if (selectedStatus !== 'all' && item.status !== selectedStatus) return false; // check

            // Search query filter
            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                const matchName = (item.name || '').toLowerCase().includes(q);
                const matchEmail = (item.email || '').toLowerCase().includes(q);
                const matchPhone = (item.phone || '').toLowerCase().includes(q);
                const matchOrg = (item.organization || '').toLowerCase().includes(q);
                const matchMsg = (item.message || '').toLowerCase().includes(q);
                if (!matchName && !matchEmail && !matchPhone && !matchOrg && !matchMsg) {
                    return false; // check
                }
            }

            return true; // filter
        });
    }, [inquiryList, selectedType, selectedStatus, searchQuery]);

    // Format date helper
    const formatDate = (dateString) => { // convert
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        return d.toLocaleDateString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --5. UI--
    return (
        <AdminLayout title="Inquiries & Applications - MESF" role={userRole}>
            <Head title="Inquiries & Applications Management" />

            <div className="space-y-8 max-w-7xl">
                {/* 1. Stat Cards (Real Database Counts) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Stat Card 1: Total Inquiries */}
                    <div className="p-6 rounded-3xl bg-[#090D18]/90 border border-white/10 backdrop-blur-2xl shadow-xl flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</span>
                            <div className="text-3xl font-black text-white">{stats.total ?? inquiryList.length}</div>
                            <span className="text-[11px] text-slate-500 font-medium">All submissions to date</span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stat Card 2: Pending Review */}
                    <div className="p-6 rounded-3xl bg-[#090D18]/90 border border-white/10 backdrop-blur-2xl shadow-xl flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Pending Review</span>
                            <div className="text-3xl font-black text-amber-400">{stats.pending ?? 0}</div>
                            <span className="text-[11px] text-amber-400/70 font-medium">Requires attention</span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner animate-pulse">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stat Card 3: Resolved */}
                    <div className="p-6 rounded-3xl bg-[#090D18]/90 border border-white/10 backdrop-blur-2xl shadow-xl flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Resolved Inquiries</span>
                            <div className="text-3xl font-black text-emerald-400">{stats.resolved ?? (stats.approved || 0) + (stats.rejected || 0)}</div>
                            <span className="text-[11px] text-slate-500 font-medium">Approved &amp; Rejected</span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 2. Search & Filter Bar */}
                <div className="p-6 rounded-3xl bg-[#090D18]/90 border border-white/10 backdrop-blur-2xl shadow-xl space-y-5">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder="Search by sender name, email, phone, organization, or message..."
                            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/40 transition-all font-sans"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
                        {/* Type Filters */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Type:</span>
                            {[
                                { id: 'all', label: 'All Types' },
                                { id: 'join_tournament', label: 'Join Tournament' },
                                { id: 'partnership', label: 'Partnership' },
                                { id: 'host_tournament', label: 'Host Tournament' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedType(tab.id)} // trigger
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                        selectedType === tab.id
                                            ? 'bg-amber-400 text-black font-bold shadow-sm'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Status Filters */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'pending', label: 'Pending' },
                                { id: 'reviewed', label: 'Reviewed' },
                                { id: 'approved', label: 'Approved' },
                                { id: 'rejected', label: 'Rejected' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedStatus(tab.id)} // trigger
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                        selectedStatus === tab.id
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-sm'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Inquiries Table / List */}
                <div className="rounded-3xl bg-[#090D18]/90 border border-white/10 backdrop-blur-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                Inquiries &amp; Correspondence
                            </h2>
                            <p className="text-xs text-slate-400">
                                Showing {filteredInquiries.length} {filteredInquiries.length === 1 ? 'submission' : 'submissions'}
                            </p>
                        </div>
                    </div>

                    {filteredInquiries.length === 0 ? (
                        <div className="p-12 text-center space-y-3">
                            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-white">No inquiries found</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                No inquiries match the selected type, status, or search query.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                                        <th className="py-3.5 px-6">Sender &amp; Organization</th>
                                        <th className="py-3.5 px-6">Type</th>
                                        <th className="py-3.5 px-6">Status</th>
                                        <th className="py-3.5 px-6">Date Submitted</th>
                                        <th className="py-3.5 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredInquiries.map((item) => {
                                        const typeConf = TYPE_CONFIG[item.type] || { label: item.type, badge: 'bg-white/10 text-white' };
                                        const statusConf = STATUS_CONFIG[item.status] || { label: item.status, badge: 'bg-white/10 text-white', dot: 'bg-white' };
                                        const TypeIcon = typeConf.icon || MessageSquare;

                                        return (
                                            <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                                                {/* Sender & Contact */}
                                                <td className="py-4 px-6">
                                                    <div className="space-y-1">
                                                        <div className="font-bold text-white group-hover:text-amber-300 transition-colors text-sm">
                                                            {item.name}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                            <span>{item.email}</span>
                                                            <span>•</span>
                                                            <span>{item.phone}</span>
                                                        </div>
                                                        {item.organization && (
                                                            <div className="text-[11px] font-medium text-amber-400/90 flex items-center gap-1">
                                                                <Building2 className="w-3 h-3 shrink-0" />
                                                                <span>{item.organization}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Inquiry Type */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeConf.badge}`}>
                                                        <TypeIcon className="w-3.5 h-3.5" />
                                                        <span>{typeConf.label}</span>
                                                    </span>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConf.badge}`}>
                                                        <span className={`w-2 h-2 rounded-full ${statusConf.dot}`} />
                                                        <span>{statusConf.label}</span>
                                                    </span>
                                                </td>

                                                {/* Submitted Date */}
                                                <td className="py-4 px-6 text-slate-400 text-xs whitespace-nowrap">
                                                    {formatDate(item.created_at)}
                                                </td>

                                                {/* Action Button */}
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenDetail(item)} // trigger
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>View</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Inquiry Detail & Action Modal */}
            {activeInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
                    <div className="relative w-full max-w-3xl rounded-3xl bg-[#0A0E1A] border border-white/15 shadow-2xl overflow-hidden my-8">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-white/[0.02]">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${TYPE_CONFIG[activeInquiry.type]?.badge || 'bg-white/10'}`}>
                                        {TYPE_CONFIG[activeInquiry.type]?.label || activeInquiry.type}
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${STATUS_CONFIG[activeInquiry.status]?.badge || 'bg-white/10'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[activeInquiry.status]?.dot || 'bg-white'}`} />
                                        <span>{STATUS_CONFIG[activeInquiry.status]?.label || activeInquiry.status}</span>
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white pt-1">
                                    Inquiry from {activeInquiry.name}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Submitted on {formatDate(activeInquiry.created_at)}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseDetail} // trigger
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Action Feedback message */}
                            {actionMessage && (
                                <div className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2.5 ${
                                    actionMessage.type === 'error'
                                        ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                                        : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                                }`}>
                                    {actionMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                                    <span>{actionMessage.text}</span>
                                </div>
                            )}

                            {/* Section 1: Contact Information */}
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Sender &amp; Contact Details
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-slate-500 block mb-0.5">Name:</span>
                                        <span className="font-semibold text-white">{activeInquiry.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-0.5">Email:</span>
                                        <a href={`mailto:${activeInquiry.email}`} className="font-semibold text-amber-400 hover:underline">{activeInquiry.email}</a>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-0.5">Phone:</span>
                                        <a href={`tel:${activeInquiry.phone}`} className="font-semibold text-amber-400 hover:underline">{activeInquiry.phone}</a>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-0.5">Organization:</span>
                                        <span className="font-semibold text-white">{activeInquiry.organization || 'Individual / None'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Type-Specific Details */}
                            {activeInquiry.details && Object.keys(activeInquiry.details).length > 0 && (
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                                        Type-Specific Application Data
                                    </span>

                                    {/* Join Tournament fields */}
                                    {activeInquiry.type === 'join_tournament' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Team Name:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.team_name}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Game Title:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.game_title}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Player Count:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.player_count}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">State Origin:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.state}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Partnership fields */}
                                    {activeInquiry.type === 'partnership' && (
                                        <div className="space-y-3 text-xs">
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Partnership Scope:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.partnership_type}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Proposal Executive Summary:</span>
                                                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                                    {activeInquiry.details.proposal_summary}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Host Tournament fields */}
                                    {activeInquiry.type === 'host_tournament' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div className="sm:col-span-2">
                                                <span className="text-slate-500 block mb-0.5">Proposed Event Name:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.proposed_event_name}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Proposed Dates / Timeline:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.proposed_dates}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-0.5">Expected Teams / Slots:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.expected_teams}</span>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <span className="text-slate-500 block mb-0.5">Venue &amp; Format:</span>
                                                <span className="font-semibold text-white">{activeInquiry.details.venue}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Section 3: Submitted Message */}
                            {activeInquiry.message && (
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Submitted Message / Remarks
                                    </span>
                                    <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                        {activeInquiry.message}
                                    </p>
                                </div>
                            )}

                            {/* Section 4: Admin Internal Notes (Internal Only) */}
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Internal Admin Notes (Private)
                                    </span>
                                    <button
                                        type="button"
                                        disabled={isUpdating}
                                        onClick={handleSaveNotes} // trigger
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-[11px] font-bold transition-all cursor-pointer"
                                    >
                                        <Save className="w-3 h-3" />
                                        <span>Save Notes</span>
                                    </button>
                                </div>
                                <textarea
                                    rows="3"
                                    value={notesText} // state
                                    onChange={(e) => setNotesText(e.target.value)} // trigger
                                    placeholder="Add internal correspondence notes, follow-up dates, or officer remarks..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 text-white text-xs outline-none transition-all placeholder:text-neutral-600 leading-relaxed"
                                />
                            </div>

                            {/* Handled By metadata if present */}
                            {activeInquiry.handler && (
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
                                    <span>Last handled by:</span>
                                    <span className="font-semibold text-slate-300">{activeInquiry.handler.name} ({activeInquiry.handler.role})</span>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer / Status Action Controls */}
                        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Set Status:
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Mark as Pending */}
                                <button
                                    type="button"
                                    disabled={isUpdating || activeInquiry.status === 'pending'}
                                    onClick={() => handleUpdateStatus('pending')} // trigger
                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Pending
                                </button>

                                {/* Mark as Reviewed */}
                                <button
                                    type="button"
                                    disabled={isUpdating || activeInquiry.status === 'reviewed'}
                                    onClick={() => handleUpdateStatus('reviewed')} // trigger
                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Reviewed
                                </button>

                                {/* Reject button */}
                                <button
                                    type="button"
                                    disabled={isUpdating || activeInquiry.status === 'rejected'}
                                    onClick={() => handleUpdateStatus('rejected')} // trigger
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Reject
                                </button>

                                {/* Approve button (Enforce Role Rule) */}
                                {userRole === 'secretariat' && activeInquiry.type !== 'join_tournament' ? (
                                    <div className="relative group/btn">
                                        <button
                                            type="button"
                                            disabled={true}
                                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400/40 border border-emerald-500/20 opacity-50 cursor-not-allowed inline-flex items-center gap-1.5"
                                        >
                                            <Lock className="w-3.5 h-3.5" />
                                            <span>Approve</span>
                                        </button>
                                        <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/btn:block whitespace-nowrap px-2.5 py-1 rounded-md bg-black border border-white/20 text-[10px] text-amber-300 shadow-xl z-50">
                                            Requires Admin approval
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={isUpdating || activeInquiry.status === 'approved'}
                                        onClick={() => handleUpdateStatus('approved')} // trigger
                                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 shadow-sm"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Approve</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
