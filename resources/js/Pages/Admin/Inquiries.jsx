// --1. imports--
import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    MessageSquare,
    Search
} from 'lucide-react';

// --2. properties--

// --3. main component--
export default function Inquiries() {
    const { auth } = usePage().props; // properties
    const user = auth?.user; // state
    const [searchQuery, setSearchQuery] = useState(''); // state

    // --4. actions--

    // --5. UI--
    return (
        <AdminLayout title="Inquiries Management - MESF Admin" role={user?.role}>
            <Head title="Inquiries Management - Admin" />

            <div className="space-y-8 max-w-7xl">
                {/* search bar */}
                <div className="p-4 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder="Search public inquiries, sender names, emails..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                        />
                    </div>
                </div>

                {/* Inquiries Section */}
                <div className="space-y-6 animate-fadeIn">
                    <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                            <MessageSquare className="w-8 h-8" />
                        </div>

                        <div className="space-y-1.5 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-white tracking-wide">
                                Inquiries & Correspondence
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                Manage incoming public messages, feedback, and federation correspondence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
