// --1. imports--
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Trophy,
    Plus,
    Search,
    Trash2,
    Calendar,
    Coins,
    Gamepad2,
    MapPin,
    ExternalLink,
    Edit2,
    Clock,
    Users
} from 'lucide-react';

// --2. main component--
export default function Leagues({ leagues = [] }) {
    // --3. actions--
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, item: null }); // state

    const filteredLeagues = leagues.filter((league) => { // check
        return (league.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (league.game_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (league.tier || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    const confirmDelete = () => { // trigger
        if (!deleteModalState.item) return; // check
        router.delete(route('admin.leagues.destroy', deleteModalState.item.id), { // save
            preserveScroll: true,
            onSuccess: () => setDeleteModalState({ isOpen: false, item: null }) // state
        });
    };

    // --4. UI--
    return (
        <AdminLayout title="Leagues Management - MESF Admin">
            <Head title="Leagues Management - Admin" />

            <div className="space-y-6 max-w-7xl">
                {/* search & action bar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* search input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery} // state
                                onChange={(e) => setSearchQuery(e.target.value)} // trigger
                                placeholder="Search leagues, tournaments, game titles, circuits..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                            />
                        </div>

                        {/* action controls */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.leagues.create')} // redirect
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create League</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Leagues list or empty state */}
                {leagues.length === 0 ? (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                <Trophy className="w-8 h-8" />
                            </div>

                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    Leagues & Tournaments Section
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                    No tournaments scheduled yet. Create your first league to broadcast on the public circuit page.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={route('admin.leagues.create')} // redirect
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-[0_4px_16px_rgba(251,191,36,0.25)] cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                                    <span>Create First League</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : filteredLeagues.length === 0 ? (
                    <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center text-slate-400">
                        No leagues found matching "{searchQuery}".
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                        {filteredLeagues.map((league) => (
                            <div
                                key={league.id}
                                className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-xl transition-colors flex flex-col justify-between"
                            >
                                <div>
                                    {/* banner image or fallback */}
                                    <div className="aspect-[16/8] w-full bg-[#0d1424] relative overflow-hidden border-b border-white/10 flex items-center justify-center">
                                        {league.banner_url ? (
                                            <img
                                                src={league.banner_url}
                                                alt={league.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                                                <Trophy className="w-8 h-8 opacity-40 text-amber-400" />
                                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">No Banner Uploaded</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#090D18]/40 via-transparent to-transparent pointer-events-none" />
                                    </div>

                                    {/* info inside the box */}
                                    <div className="p-6 space-y-3">
                                        {/* badges row inside the box */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white font-mono">
                                                {league.game_title || 'All Games'}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono">
                                                {league.registration_status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span>{league.date_range}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white transition-colors line-clamp-1">
                                            {league.name}
                                        </h3>

                                        {league.tier && (
                                            <p className="text-xs text-slate-400 line-clamp-1">
                                                {league.tier}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 border-t border-white/5">
                                            {league.prize_pool && (
                                                <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono">
                                                    <Coins className="w-3.5 h-3.5" />
                                                    <span>{league.prize_pool}</span>
                                                </div>
                                            )}
                                            {league.slots && (
                                                <div className="text-[11px] text-slate-400 font-mono">
                                                    {league.slots} Slots
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                                    <a
                                        href={`/leagues/${league.slug}`} // redirect
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Public Page</span>
                                    </a>

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={route('admin.leagues.edit', league.id)} // redirect
                                            className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                                            title="Edit League"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteModalState({ isOpen: true, item: league })} // trigger
                                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            title="Delete League"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* unified delete confirmation modal */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="w-full max-w-md bg-[#0B0F1C] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Delete League?</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Are you sure you want to delete <span className="text-white font-semibold">"{deleteModalState.item?.name}"</span>?
                                <span className="block text-slate-400 text-xs mt-1.5">This action cannot be undone.</span>
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModalState({ isOpen: false, item: null })}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-500/20"
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