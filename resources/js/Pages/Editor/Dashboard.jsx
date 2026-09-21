// --1. imports--
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Newspaper, Trophy, Users, Calendar, Image, ArrowRight } from 'lucide-react';

// --2. main component--
export default function Dashboard() {
    const modules = [
        {
            title: 'News Articles',
            description: 'Publish and curate esports editorial stories, press releases, and articles.',
            href: '/admin/news',
            icon: Newspaper,
            tag: 'Editorial'
        },
        {
            title: 'Leagues & Tournaments',
            description: 'Manage sanctioned tournaments, competitive formats, and league brackets.',
            href: '/admin/leagues',
            icon: Trophy,
            tag: 'Competitions'
        },
        {
            title: 'Teams & Rosters',
            description: 'Maintain national teams, state affiliates, and registered rosters.',
            href: '/admin/teams',
            icon: Users,
            tag: 'Directory'
        },
        {
            title: 'Match Schedules & Results',
            description: 'Update live match scores, upcoming fixtures, and verified standings.',
            href: '/admin/matches',
            icon: Calendar,
            tag: 'Fixtures'
        },
        {
            title: 'Media Gallery',
            description: 'Upload and organize official tournament albums, photos, and highlights.',
            href: '/galeri',
            icon: Image,
            tag: 'Media'
        }
    ];

    // --3. UI--
    return (
        <AdminLayout title="Editor Dashboard - MESF" role="editor" portalTitle="MESF EDITOR">
            <Head title="Editor Dashboard" />

            <div className="space-y-8 max-w-7xl">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-heading">
                        Editor Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                        Editorial and competitive content management portal for MESF esports leagues, teams, matches, news, and gallery.
                    </p>
                </div>

                {/* Module Quick Access Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod) => (
                        <Link
                            key={mod.title}
                            href={mod.href} // redirect
                            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090D18]/80 backdrop-blur-2xl p-6 sm:p-7 transition-all duration-300 hover:border-amber-400/40 hover:bg-[#0E1526]/90 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-amber-400 group-hover:bg-amber-400/10 group-hover:border-amber-400/30 transition-all duration-300">
                                        <mod.icon className="w-5 h-5" />
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-amber-400 transition-colors">
                                        Open
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>

                                <div className="mt-5 space-y-1.5">
                                    <h2 className="text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors">
                                        {mod.title}
                                    </h2>
                                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                        {mod.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                                <span className="font-semibold text-amber-400">{mod.tag}</span>
                                <span className="text-neutral-400">MESF Portal</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
