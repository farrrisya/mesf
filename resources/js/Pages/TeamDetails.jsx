// --1. imports--
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';
import { Shield, Trophy, Users, Globe, ExternalLink, Calendar, MapPin, Award, CheckCircle } from 'lucide-react';

// --2. properties--
const TEAMS_DATABASE = {
    'harimau-my': {
        name: 'Harimau MY',
        tag: 'HMY',
        slug: 'harimau-my',
        motto: 'Tanah Tumpahnya Darahku, Gemilang di Persada Maya',
        region: 'National / All Malaysia',
        country: 'Malaysia',
        flag: '🇲🇾',
        status: 'National Flagship',
        created: '2023',
        founder: 'Malaysian Esports Federation (MESF)',
        headCoach: 'Ahmad "Moskov" Zakaria',
        headCoachNat: '🇲🇾',
        assistantCoach: 'Hafiz "Apex" Rosli',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'MLBB & Multi-Discipline Squad',
        stats: {
            circuit: 'IESF / SEA Games Selection',
            winRate: '78%',
            placement: '#1 National Rank',
            tier: 'MESF Tier 1'
        },
        roster: [
            { id: 1, ign: 'Sekys', name: 'Muhammad Haqqullah Ahmad', role: 'Jungler', flag: '🇲🇾', status: 'National Roster' },
            { id: 2, ign: 'Stormie', name: 'Hazeq Danish', role: 'Mid Laner', flag: '🇲🇾', status: 'National Roster' },
            { id: 3, ign: 'YumS', name: 'Zul Hisham Mohd Noor', role: 'Roamer / Captain', flag: '🇲🇾', status: 'National Roster' },
            { id: 4, ign: 'Innocent', name: 'John Vincent Banal', role: 'Gold Laner', flag: '🇵🇭', status: 'Active Starter' },
            { id: 5, ign: 'Kramm', name: 'Mark Genzon Rusiana', role: 'EXP Laner', flag: '🇵🇭', status: 'Active Starter' },
            { id: 6, ign: 'Gojes', name: 'Ahmad Syazwan', role: 'Substitute / Flex', flag: '🇲🇾', status: 'Reserve' }
        ],
        recentMatches: [
            { opponent: 'Indonesia National Squad', result: 'WIN', score: '2 - 1', stage: 'IESF Asia Qualifier' },
            { opponent: 'Philippines National Squad', result: 'WIN', score: '3 - 2', stage: 'SEA Esports Championship' },
            { opponent: 'Thailand Cyber Squad', result: 'WIN', score: '2 - 0', stage: 'International Group Stage' }
        ],
        channels: [
            { name: 'MESF Portal', url: 'https://mesf.gg' },
            { name: 'Instagram', url: 'https://www.instagram.com/mesf_official/' }
        ]
    },
    'selangor-red-giants': {
        name: 'Selangor Red Giants',
        tag: 'SRG',
        slug: 'selangor-red-giants',
        motto: 'Red & Yellow Glory, MSC 2024 World Champions',
        region: 'Selangor',
        country: 'Malaysia',
        flag: '🇲🇾',
        status: 'Reigning World Champion',
        created: '2023',
        founder: 'Selangor FC & Yoodo Esports',
        headCoach: 'Michael Angelo "Arcadia" Bocado',
        headCoachNat: '🇵🇭',
        assistantCoach: 'Pabz',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'Mobile Legends: Bang Bang (MPL MY)',
        stats: {
            circuit: 'MPL Malaysia / MSC World',
            winRate: '92%',
            placement: '#1 World Rank',
            tier: 'Tier 1 World Elite'
        },
        roster: [
            { id: 1, ign: 'Sekys', name: 'Muhammad Haqqullah', role: 'Jungler', flag: '🇲🇾', status: 'MSC Finals MVP' },
            { id: 2, ign: 'Innocent', name: 'John Vincent Banal', role: 'Gold Laner', flag: '🇵🇭', status: 'Active Starter' },
            { id: 3, ign: 'Kramm', name: 'Mark Genzon Rusiana', role: 'EXP Laner', flag: '🇵🇭', status: 'Active Starter' },
            { id: 4, ign: 'Stormie', name: 'Hazeq Danish', role: 'Mid Laner', flag: '🇲🇾', status: 'Active Starter' },
            { id: 5, ign: 'YumS', name: 'Muhammad Nur Suhairi', role: 'Roamer / IGL', flag: '🇲🇾', status: 'Team Captain' },
            { id: 6, ign: 'Zakqt', name: 'Muhammad Alif', role: 'Mid Sub', flag: '🇲🇾', status: 'Reserve' }
        ],
        recentMatches: [
            { opponent: 'Falcons AP.Bren', result: 'WIN', score: '4 - 3', stage: 'MSC 2024 Grand Finals' },
            { opponent: 'Team Liquid PH', result: 'WIN', score: '3 - 2', stage: 'MSC Semifinals' },
            { opponent: 'HomeBois', result: 'WIN', score: '4 - 2', stage: 'MPL MY S13 Grand Finals' }
        ],
        channels: [
            { name: 'Instagram', url: 'https://www.instagram.com/selangorredgiants/' },
            { name: 'Selangor FC Hub', url: 'https://selangorfc.com' }
        ]
    },
    'todak-gaming': {
        name: 'Todak Gaming',
        tag: 'TDK',
        slug: 'todak-gaming',
        motto: 'Langgar! Pioneering Malaysian Esports Excellence',
        region: 'Kuala Lumpur / Langkawi',
        country: 'Malaysia',
        flag: '🇲🇾',
        status: 'Franchise Veteran',
        created: '2019',
        founder: 'Khairul Azlan & Todak Holdings',
        headCoach: 'Muhammad "Moyy" Faris',
        headCoachNat: '🇲🇾',
        assistantCoach: 'Ashi',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'Mobile Legends: Bang Bang',
        stats: {
            circuit: 'MPL Malaysia Season 14',
            winRate: '71%',
            placement: 'Top 4 Contender',
            tier: 'Tier 1 Franchise'
        },
        roster: [
            { id: 1, ign: 'CikuGais', name: 'Muhammad Danial Mohamad Fuad', role: 'Gold / Mid', flag: '🇲🇾', status: 'Franchise Icon' },
            { id: 2, ign: '4Meyz', name: 'Muhammad Zaim Bin Alam', role: 'EXP Laner', flag: '🇲🇾', status: 'Active Starter' },
            { id: 3, ign: 'Rival', name: 'Muhammad Alif Bin Akmal', role: 'Jungler', flag: '🇲🇾', status: 'Active Starter' },
            { id: 4, ign: 'Momo', name: 'Zikry Shamsuddin', role: 'Roamer', flag: '🇲🇾', status: 'Active Starter' },
            { id: 5, ign: 'Flint', name: 'Amirul Daniel', role: 'Mid Laner', flag: '🇲🇾', status: 'Active Starter' }
        ],
        recentMatches: [
            { opponent: 'HomeBois', result: 'WIN', score: '2 - 1', stage: 'Regular Season W6' },
            { opponent: 'Geek Fam MY', result: 'WIN', score: '2 - 0', stage: 'Regular Season W5' },
            { opponent: 'Selangor Red Giants', result: 'LOSS', score: '1 - 2', stage: 'Upper Bracket Semis' }
        ],
        channels: [
            { name: 'Instagram', url: 'https://www.instagram.com/todakgaming/' },
            { name: 'Official Store', url: 'https://todak.com' }
        ]
    },
    'homebois': {
        name: 'HomeBois',
        tag: 'HB',
        slug: 'homebois',
        motto: 'Keluarga HomeBois: Born From Grassroots, Built For Trophies',
        region: 'Kelantan / Kuala Lumpur',
        country: 'Malaysia',
        flag: '🇲🇾',
        status: 'MPL Champions & M-Series',
        created: '2020',
        founder: 'Nour "Daddyhood" Eddine',
        headCoach: 'Khairul "Pabz" Azman',
        headCoachNat: '🇲🇾',
        assistantCoach: 'Abat',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'Mobile Legends: Bang Bang',
        stats: {
            circuit: 'MPL Malaysia / Games of the Future',
            winRate: '81%',
            placement: '#2 Malaysia',
            tier: 'Tier 1 Elite'
        },
        roster: [
            { id: 1, ign: 'Udil', name: 'Muhammad Julian Ardiansyah', role: 'Mid Laner', flag: '🇮🇩', status: 'Star Player' },
            { id: 2, ign: 'Nets', name: 'Kenneth Barro', role: 'Gold Laner', flag: '🇵🇭', status: 'Active Starter' },
            { id: 3, ign: 'Sepat', name: 'Muhammad Irfan Aiman', role: 'EXP Laner', flag: '🇲🇾', status: 'Active Starter' },
            { id: 4, ign: 'Chibi', name: 'Muhammad Nazhan Mohd Nor', role: 'Jungler', flag: '🇲🇾', status: 'Active Starter' },
            { id: 5, ign: 'Xorn', name: 'Mohamad Zul Hisham', role: 'Roamer', flag: '🇲🇾', status: 'Veteran Leader' }
        ],
        recentMatches: [
            { opponent: 'Team Secret', result: 'WIN', score: '2 - 0', stage: 'MPL Week 7' },
            { opponent: 'Todak Gaming', result: 'WIN', score: '2 - 1', stage: 'Playoffs R2' },
            { opponent: 'Selangor Red Giants', result: 'LOSS', score: '2 - 4', stage: 'MPL MY Grand Finals' }
        ],
        channels: [
            { name: 'Instagram', url: 'https://www.instagram.com/homebois.my/' }
        ]
    },
    'geek-fam-my': {
        name: 'Geek Fam MY',
        tag: 'GEEK',
        slug: 'geek-fam-my',
        motto: 'Once a Geek, Always a Fam',
        region: 'Kuala Lumpur',
        country: 'Malaysia',
        flag: '🇲🇾',
        status: 'Active Franchise',
        created: '2016',
        founder: 'Keat Lim & Joseph Yeoh',
        headCoach: 'Ariff "Ranger" Hafiz',
        headCoachNat: '🇲🇾',
        assistantCoach: 'Zik',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'Mobile Legends & Dota 2',
        stats: {
            circuit: 'MPL MY & Regional Contenders',
            winRate: '68%',
            placement: 'Top 5 Franchise',
            tier: 'Tier 1 Franchise'
        },
        roster: [
            { id: 1, ign: 'Maima', name: 'Ahmad Maiman', role: 'Jungler', flag: '🇲🇾', status: 'Active Starter' },
            { id: 2, ign: 'Artell', name: 'Nur Arif Danial', role: 'Mid Laner', flag: '🇲🇾', status: 'Active Starter' },
            { id: 3, ign: 'Snapper', name: 'Mohamad Shafiq', role: 'Roamer', flag: '🇲🇾', status: 'Active Starter' },
            { id: 4, ign: 'Xeno', name: 'Muhammad Adam', role: 'EXP Laner', flag: '🇲🇾', status: 'Active Starter' },
            { id: 5, ign: 'Veno', name: 'Bryan Tan', role: 'Gold Laner', flag: '🇲🇾', status: 'Active Starter' }
        ],
        recentMatches: [
            { opponent: 'Todak Gaming', result: 'LOSS', score: '0 - 2', stage: 'Regular Season' },
            { opponent: 'Barracx MY', result: 'WIN', score: '2 - 0', stage: 'Challenger Stage' }
        ],
        channels: [
            { name: 'Instagram', url: 'https://www.instagram.com/geekfam.my/' }
        ]
    },
    'team-secret-my': {
        name: 'Team Secret Academy MY',
        tag: 'TS',
        slug: 'team-secret-my',
        motto: 'Global Prestige, Malaysian Prodigies',
        region: 'Kuala Lumpur / Global',
        country: 'Malaysia',
        flag: '🇲🇾',
        status: 'Developmental Academy',
        created: '2021',
        founder: 'Clement "Puppey" Ivanov / John Yao',
        headCoach: 'Danial "Kuro" Syazwan',
        headCoachNat: '🇲🇾',
        assistantCoach: 'Faris Lee',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'Valorant & Mobile Legends',
        stats: {
            circuit: 'MESF Academy Division & VCT MY',
            winRate: '73%',
            placement: 'Rising Contender',
            tier: 'MESF Tier 1 Academy'
        },
        roster: [
            { id: 1, ign: 'Vortex', name: 'Ahmad Faiz', role: 'Duelist / Entry', flag: '🇲🇾', status: 'Academy Roster' },
            { id: 2, ign: 'Kael', name: 'Darren Lim', role: 'Controller', flag: '🇲🇾', status: 'Academy Roster' },
            { id: 3, ign: 'Nox', name: 'Muhd Rayyan', role: 'Initiator', flag: '🇲🇾', status: 'Academy Roster' },
            { id: 4, ign: 'Zephyr', name: 'Tan Wei Lun', role: 'Sentinel', flag: '🇲🇾', status: 'Academy Roster' },
            { id: 5, ign: 'Chronos', name: 'Syed Al-Hafiz', role: 'Flex / IGL', flag: '🇲🇾', status: 'Academy Captain' }
        ],
        recentMatches: [
            { opponent: 'Geek Fam MY', result: 'WIN', score: '2 - 1', stage: 'Academy Invitational' },
            { opponent: 'Todak Academy', result: 'WIN', score: '2 - 0', stage: 'MESF Youth Cup' }
        ],
        channels: [
            { name: 'Instagram', url: 'https://www.instagram.com/teamsecret/' }
        ]
    },
    'team-vamos': {
        name: 'Team Vamos',
        tag: 'VMS',
        slug: 'team-vamos',
        motto: 'Vamos Bersama! The People\'s Champions',
        region: 'Kuala Lumpur',
        country: 'Malaysia',
        flag: '🇲🇾',
        status: 'Active Franchise',
        created: '2024',
        founder: 'Fariz "Soloz" Zakaria',
        headCoach: 'Khairul "Pabz" Azman',
        headCoachNat: '🇲🇾',
        assistantCoach: 'Afiq "Kuja" Syazwan',
        assistantCoachNat: '🇲🇾',
        primaryGame: 'Mobile Legends: Bang Bang (MPL MY)',
        stats: {
            circuit: 'MPL Malaysia Season 14',
            winRate: '85%',
            placement: '#2 Regular Season',
            tier: 'Tier 1 Elite'
        },
        roster: [
            { id: 1, ign: 'Smooth', name: 'Mohd Aiman Mohd Nizam', role: 'EXP Laner', flag: '🇲🇾', status: 'Active Starter' },
            { id: 2, ign: 'Warlord', name: 'Rizky Agustian', role: 'Mid Laner', flag: '🇮🇩', status: 'Active Starter' },
            { id: 3, ign: 'Nets', name: 'Kenneth Barro', role: 'Gold Laner', flag: '🇵🇭', status: 'Active Starter' },
            { id: 4, ign: 'Xorn', name: 'Mohamad Zul Hisham Mohd Noor', role: 'Roamer / IGL', flag: '🇲🇾', status: 'Team Captain' },
            { id: 5, ign: 'Chibi', name: 'Muhammad Nazhan Mohd Nor', role: 'Jungler', flag: '🇲🇾', status: 'Active Starter' }
        ],
        recentMatches: [
            { opponent: 'Todak Gaming', result: 'WIN', score: '2 - 0', stage: 'MPL MY S14 W4' },
            { opponent: 'Selangor Red Giants', result: 'LOSS', score: '1 - 2', stage: 'MPL MY S14 W5' },
            { opponent: 'HomeBois', result: 'WIN', score: '2 - 1', stage: 'MPL MY S14 W6' }
        ],
        channels: [
            { name: 'Instagram', url: 'https://www.instagram.com/teamvamos.my/' }
        ]
    }
};

// --3. main component--
export default function TeamDetails({ teamSlug, slug }) {
    // --4. actions--
    const [currentSlug] = useState(() => {
        if (slug) return slug;
        if (teamSlug) return teamSlug;
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('slug') || params.get('team');
            if (q) return q;
        }
        return 'harimau-my';
    }); // state

    const team = TEAMS_DATABASE[currentSlug] || TEAMS_DATABASE['harimau-my']; // state

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title={`${team.name} - Team Profile - MESF`} />

            {/* ambient background glows */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
            <div className="pointer-events-none absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[150px]" />

            {/* grain overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* main body container */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-24 text-left flex-1">
                {/* top navigation bar */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <BackButton href="/teams" label="Back to Team Directory" />

                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Official MESF Sanctioned Team</span>
                    </div>
                </div>

                {/* elevated team marquee hero box */}
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-2xl p-8 sm:p-12 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                    {/* top edge luminous highlight beam */}
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        {/* emblem monogram & name block */}
                        <div className="flex items-center gap-6 sm:gap-8">
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-black/75 border border-white/20 flex items-center justify-center shrink-0 p-3 shadow-inner ring-1 ring-white/10">
                                <span className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase font-mono">
                                    {team.tag}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                                        {team.status}
                                    </span>
                                    <span className="text-neutral-500 text-xs">•</span>
                                    <span className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                                        <span>{team.flag}</span>
                                        <span>{team.region}</span>
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                                    {team.name}
                                </h1>
                                <p className="text-sm italic text-neutral-300 font-normal">
                                    &ldquo;{team.motto}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* high-level stats pills */}
                        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                            <div className="px-5 py-3.5 rounded-2xl border border-white/10 bg-[#070b14]/80 min-w-[130px] shadow-inner">
                                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Circuit</span>
                                <span className="text-sm sm:text-base font-bold text-white">{team.stats.circuit}</span>
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl border border-white/10 bg-[#070b14]/80 min-w-[110px] shadow-inner">
                                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Standing</span>
                                <span className="text-sm sm:text-base font-bold text-emerald-400">{team.stats.placement}</span>
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl border border-white/10 bg-[#070b14]/80 min-w-[90px] shadow-inner">
                                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block">Est.</span>
                                <span className="text-sm sm:text-base font-bold text-white">{team.created}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2-column split: active roster (left) & team specs (right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
                    {/* left column (8 cols): active lineup & recent fixtures */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* roster header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <span className="text-xs font-black tracking-widest text-neutral-400 uppercase block mb-1">
                                    Competitive Lineup
                                </span>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    {team.primaryGame}
                                </h2>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/15 text-neutral-200">
                                {team.roster.length} Players
                            </span>
                        </div>

                        {/* player cards grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {team.roster.map((player) => (
                                <div
                                    key={player.id}
                                    className="p-5 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] hover:border-white/30 hover:bg-[#121b30] shadow-xl transition-all duration-200 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="h-12 w-12 rounded-xl bg-black/60 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
                                            <span className="text-sm font-black text-white font-mono">
                                                {player.ign.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-black text-white truncate">
                                                    {player.ign}
                                                </h3>
                                                <span className="text-xs">{player.flag}</span>
                                            </div>
                                            <p className="text-xs text-neutral-400 truncate">
                                                {player.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="inline-block px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-bold tracking-wider text-neutral-200 uppercase">
                                            {player.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* recent match performance */}
                        <div className="p-6 sm:p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-4">
                            <h3 className="text-sm font-black tracking-widest text-neutral-300 uppercase">
                                Recent Competitive Fixtures
                            </h3>
                            <div className="divide-y divide-white/10">
                                {team.recentMatches.map((match, idx) => (
                                    <div key={idx} className="py-3.5 flex items-center justify-between text-sm">
                                        <div className="space-y-0.5">
                                            <span className="text-white font-semibold">{match.opponent}</span>
                                            <span className="text-xs text-neutral-400 block">{match.stage}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-neutral-200 font-bold">{match.score}</span>
                                            <span
                                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase ${
                                                    match.result === 'WIN'
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                                }`}
                                            >
                                                {match.result}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* right column (4 cols): organization details & channels */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="p-6 sm:p-7 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-5">
                            <h3 className="text-sm font-black tracking-widest text-white uppercase pb-3 border-b border-white/10">
                                Organization Details
                            </h3>

                            <div className="space-y-4 text-xs sm:text-sm">
                                <div className="p-3 rounded-xl bg-[#070b14]/70 border border-white/5">
                                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">Founder / Patron</span>
                                    <span className="text-white font-bold">{team.founder}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#070b14]/70 border border-white/5">
                                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">Head Coach</span>
                                    <span className="text-white font-bold">{team.headCoach} {team.headCoachNat}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#070b14]/70 border border-white/5">
                                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">Assistant Coach</span>
                                    <span className="text-white font-bold">{team.assistantCoach} {team.assistantCoachNat}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#070b14]/70 border border-white/5">
                                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">Sanctioned Tier</span>
                                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {team.stats.tier}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* official channels */}
                        <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-3">
                            <span className="text-xs font-black tracking-widest text-neutral-300 uppercase block">
                                Official Channels
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {team.channels && team.channels.map((ch, idx) => (
                                    <a
                                        key={idx}
                                        href={ch.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white text-neutral-200 hover:text-black border border-white/15 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                    >
                                        <span>{ch.name}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* other teams selector quick list */}
                        <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-3">
                            <span className="text-xs font-black tracking-widest text-neutral-300 uppercase block">
                                Explore Other Teams
                            </span>
                            <div className="space-y-2">
                                {Object.keys(TEAMS_DATABASE).filter(s => s !== currentSlug).slice(0, 4).map((s) => {
                                    const t = TEAMS_DATABASE[s];
                                    return (
                                        <Link
                                            key={s}
                                            href={`/teams/details?slug=${s}`}
                                            className="p-2.5 rounded-xl bg-[#070b14]/70 hover:bg-white/10 border border-white/5 hover:border-white/20 flex items-center justify-between text-xs transition-all group block"
                                        >
                                            <span className="font-bold text-white group-hover:text-neutral-200 truncate">
                                                {t.name}
                                            </span>
                                            <span className="text-neutral-400 font-mono text-[11px] shrink-0">
                                                [{t.tag}]
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* footer */}
            <Footer />
        </div>
    );
}
