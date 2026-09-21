// --1. imports--
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { MessageSquare, Inbox, Search, MailQuestion } from 'lucide-react';

// --2. main component--
export default function Dashboard() {
    // --3. UI--
    return (
        <AdminLayout title="Secretariat Dashboard - MESF" role="secretariat" portalTitle="MESF SECRETARIAT">
            <Head title="Secretariat Dashboard" />

            <div className="space-y-8 max-w-7xl">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-heading">
                        Secretariat Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                        Secretariat communication portal for handling official public and member inquiries.
                    </p>
                </div>

                {/* Metrics Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl border border-white/10 bg-[#090D18]/80 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</span>
                            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                <Inbox className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white mt-3">0</div>
                        <p className="text-xs text-slate-400 mt-1">All recorded inquiries</p>
                    </div>

                    <div className="p-6 rounded-3xl border border-white/10 bg-[#090D18]/80 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
                            <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/20">
                                <MailQuestion className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white mt-3">0</div>
                        <p className="text-xs text-slate-400 mt-1">Awaiting secretariat response</p>
                    </div>

                    <div className="p-6 rounded-3xl border border-white/10 bg-[#090D18]/80 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolved</span>
                            <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white mt-3">0</div>
                        <p className="text-xs text-slate-400 mt-1">Completed inquiries</p>
                    </div>
                </div>

                {/* Inquiries Section Placeholder / Empty State */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#090D18]/80 backdrop-blur-2xl p-8 sm:p-12 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 shadow-inner">
                        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400/80" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                        <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                            No Pending Inquiries
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                            All incoming public feedback, partnership requests, and secretariat tickets will appear here once submitted through official contact channels.
                        </p>
                    </div>

                    <div className="pt-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-neutral-400">
                            <Search className="w-3.5 h-3.5 text-amber-400" />
                            Inbox is up to date
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
