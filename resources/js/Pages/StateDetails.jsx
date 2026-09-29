// --1. imports--
import React from 'react';
import { Head } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';
import BackButton from '@/Components/BackButton';
import { MapPin, Shield, CheckCircle2, Globe, Mail, Phone } from 'lucide-react';

// --2. properties--
const STATE_DATABASE = {
    johor: {
        stateName: 'Johor',
        bodyName: 'Persatuan Sukan Elektronik Negeri Johor',
        code: 'JHR',
        status: 'Active State Affiliate',
        headquarters: 'Johor Bahru, Johor',
        parentBody: 'Malaysian Esports Federation (MESF)',
        image: '/images/states/johor_transparent.png',
        districts: ['Johor Bahru', 'Muar', 'Batu Pahat', 'Kluang', 'Kota Tinggi', 'Segamat', 'Pontian', 'Kulai', 'Tangkak', 'Mersing'],
        programs: [
            { id: 'JHR-01', title: 'Piala Presiden Esports Johor', discipline: 'MLBB & PUBG Mobile', cadence: 'Annual Championship', status: 'Sanctioned' },
            { id: 'JHR-02', title: 'Liga Belia Daerah Johor', discipline: 'Multi-Discipline', cadence: 'Quarterly Series', status: 'Grassroots' }
        ],
        contactInfo: {
            address: 'Kompleks Belia & Sukan Negeri Johor, Johor Bahru',
            email: 'sekretariat@esportsjohor.my',
            phone: '+60 7-223 8844',
            website: 'www.esportsjohor.my'
        },
        executiveCommittee: [
            { role: 'President', name: 'Dato’ Sri Mohd Ariff' },
            { role: 'Deputy President', name: 'Mohd Hafizul Zakaria' },
            { role: 'Secretary General', name: 'Nurul Aisyah Binti Radzi' }
        ]
    },
    kedah: {
        stateName: 'Kedah',
        bodyName: 'Persatuan Sukan Elektronik Negeri Kedah',
        code: 'KDH',
        status: 'Active State Affiliate',
        headquarters: 'Alor Setar, Kedah',
        parentBody: 'Malaysian Esports Federation (MESF)',
        image: '/images/states/kedah_transparent.png',
        districts: ['Kota Setar', 'Kuala Muda', 'Kulim', 'Kubang Pasu', 'Baling', 'Langkawi', 'Yan', 'Sik', 'Padang Terap', 'Pendang', 'Bandar Baharu'],
        programs: [
            { id: 'KDH-01', title: 'Kedah Esports Darul Aman Cup', discipline: 'MLBB & Valorant', cadence: 'Annual Championship', status: 'Sanctioned' },
            { id: 'KDH-02', title: 'Jelajah Esports Komuniti Kedah', discipline: 'Mobile Gaming', cadence: 'Bi-Monthly', status: 'Grassroots' }
        ],
        contactInfo: {
            address: 'Pusat Sukan Komuniti Negeri Kedah, Alor Setar',
            email: 'info@esportskedah.my',
            phone: '+60 4-733 1122',
            website: 'www.esportskedah.my'
        },
        executiveCommittee: [
            { role: 'President', name: 'Syed Faizal Al-Hadi' },
            { role: 'Deputy President', name: 'Azman Bin Kassim' },
            { role: 'Secretary General', name: 'Siti Sarah Othman' }
        ]
    },
    selangor: {
        stateName: 'Selangor',
        bodyName: 'Persatuan Sukan Elektronik Negeri Selangor',
        code: 'SGR',
        status: 'Active State Affiliate',
        headquarters: 'Shah Alam, Selangor',
        parentBody: 'Malaysian Esports Federation (MESF)',
        image: '/images/states/selangor_transparent.png',
        districts: ['Petaling', 'Hulu Langat', 'Klang', 'Gombak', 'Kuala Langat', 'Sepang', 'Kuala Selangor', 'Hulu Selangor', 'Sabak Bernam'],
        programs: [
            { id: 'SGR-01', title: 'Selangor Esports League (SEL)', discipline: 'MLBB, Valorant & Tekken 8', cadence: 'Bi-Annual Circuit', status: 'Sanctioned' },
            { id: 'SGR-02', title: 'Piala Raja Muda Selangor Esports', discipline: 'Youth Invitational', cadence: 'Annual Championship', status: 'Tier 1 Official' }
        ],
        contactInfo: {
            address: 'Wisma Kebudayaan & Sukan Negeri Selangor, Seksyen 14, Shah Alam',
            email: 'admin@esportsselangor.my',
            phone: '+60 3-5510 2200',
            website: 'www.esportsselangor.my'
        },
        executiveCommittee: [
            { role: 'President', name: 'Abdul Razak Bin Hashim' },
            { role: 'Deputy President', name: 'Khairul Anuar Bin Ahmad' },
            { role: 'Secretary General', name: 'Farah Nadia Binti Kamaruddin' }
        ]
    },
    penang: {
        stateName: 'Pulau Pinang',
        bodyName: 'Persatuan Sukan Elektronik Pulau Pinang',
        code: 'PNG',
        status: 'Active State Affiliate',
        headquarters: 'Georgetown, Pulau Pinang',
        parentBody: 'Malaysian Esports Federation (MESF)',
        image: '/images/states/penang_transparent.png',
        districts: ['Timur Laut', 'Barat Daya', 'Seberang Perai Utara', 'Seberang Perai Tengah', 'Seberang Perai Selatan'],
        programs: [
            { id: 'PNG-01', title: 'Penang International Esports Championship', discipline: 'Dota 2 & CS2', cadence: 'Annual Championship', status: 'Sanctioned' },
            { id: 'PNG-02', title: 'Piala Komuniti Mutiara', discipline: 'Mobile Esports', cadence: 'Quarterly Series', status: 'Grassroots' }
        ],
        contactInfo: {
            address: 'Pusat Konvensyen & Sukan Komuniti Pulau Pinang, Georgetown',
            email: 'contact@esportspenang.my',
            phone: '+60 4-262 7700',
            website: 'www.esportspenang.my'
        },
        executiveCommittee: [
            { role: 'President', name: 'Tan Chee Keong' },
            { role: 'Deputy President', name: 'Muhammad Zulhilmi' },
            { role: 'Secretary General', name: 'Lim Wei Shen' }
        ]
    },
    sabah: {
        stateName: 'Sabah',
        bodyName: 'Persatuan Sukan Elektronik Negeri Sabah',
        code: 'SBH',
        status: 'Active State Affiliate',
        headquarters: 'Kota Kinabalu, Sabah',
        parentBody: 'Malaysian Esports Federation (MESF)',
        image: '/images/states/sabah_transparent.png',
        districts: ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Penampang', 'Lahad Datu', 'Keningau', 'Tuaran'],
        programs: [
            { id: 'SBH-01', title: 'Sabah Borneo Esports Masters', discipline: 'PUBG Mobile & MLBB', cadence: 'Annual Championship', status: 'Sanctioned' },
            { id: 'SBH-02', title: 'Liga Belia Kinabalu', discipline: 'Mobile & PC Gaming', cadence: 'Bi-Monthly', status: 'Grassroots' }
        ],
        contactInfo: {
            address: 'Kompleks Sukan Likas, Kota Kinabalu, Sabah',
            email: 'urusetia@esportssabah.my',
            phone: '+60 88-234 567',
            website: 'www.esportssabah.my'
        },
        executiveCommittee: [
            { role: 'President', name: 'Datuk Jeffrey Kitingan' },
            { role: 'Deputy President', name: 'Mohd Fadhil Bin Yusof' },
            { role: 'Secretary General', name: 'Grace Wong Siew Mei' }
        ]
    },
    sarawak: {
        stateName: 'Sarawak',
        bodyName: 'Persatuan Sukan Elektronik Sarawak',
        code: 'SWK',
        status: 'Active State Affiliate',
        headquarters: 'Kuching, Sarawak',
        parentBody: 'Malaysian Esports Federation (MESF)',
        image: '/images/states/sarawak_transparent.png',
        districts: ['Kuching', 'Miri', 'Sibu', 'Bintulu', 'Samarahan', 'Sri Aman', 'Sarikei', 'Kapit'],
        programs: [
            { id: 'SWK-01', title: 'Sarawak Bumi Kenyalang Cup', discipline: 'Dota 2, MLBB & E-Racing', cadence: 'Annual Circuit', status: 'Sanctioned' },
            { id: 'SWK-02', title: 'SUKMA Sarawak Development Series', discipline: 'National Squad Qualifier', cadence: 'Bi-Annual', status: 'Tier 1 Official' }
        ],
        contactInfo: {
            address: 'Perbadanan Sukan Sarawak, Stadium Negeri, Kuching',
            email: 'admin@esportssarawak.my',
            phone: '+60 82-445 566',
            website: 'www.esportssarawak.my'
        },
        executiveCommittee: [
            { role: 'President', name: 'Afif Bin Mohamad' },
            { role: 'Deputy President', name: 'Leonard Ting' },
            { role: 'Secretary General', name: 'Ahmad Faizul' }
        ]
    }
};

// --3. main component--
export default function StateDetails({ stateSlug = 'selangor', slug = null }) {
    // --4. actions--
    const key = (slug || stateSlug || 'selangor').toLowerCase().replace('-', '_'); // check
    const data = STATE_DATABASE[key] || {
        ...STATE_DATABASE.selangor,
        stateName: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        bodyName: `Persatuan Sukan Elektronik Negeri ${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}`,
        code: key.slice(0, 3).toUpperCase(),
        image: `/images/states/${key}_transparent.png`,
    };

    // --5. UI--
    return (
        <div className="relative min-h-screen bg-[#070B14] text-white selection:bg-amber-400 selection:text-black font-sans overflow-x-hidden antialiased flex flex-col justify-between">
            <Head title={`${data.bodyName} - State Association | MESF`} />

            {/* ambient background glows */}
            <div className="pointer-events-none fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px] z-0" />
            <div className="pointer-events-none fixed top-1/3 -right-20 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[160px] z-0" />

            {/* grain overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-10 opacity-[0.035]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* 1. floating glass navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <PublicNavbar activeTab="teams" />
            </div>

            {/* main content */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-32 pb-24 flex-1 text-left">
                {/* back link */}
                <div className="mb-8">
                    <BackButton href="/teams" label="Back to Directory" />
                </div>

                {/* state profile hero banner */}
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] backdrop-blur-2xl p-6 sm:p-10 md:p-12 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                    {/* top edge luminous highlight beam */}
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex items-start sm:items-center gap-6 sm:gap-8">
                            {/* state crest container (NO HOVER SCALE) */}
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-black/70 border border-white/20 flex items-center justify-center shrink-0 p-3 shadow-inner ring-1 ring-white/10">
                                <img
                                    src={data.image}
                                    alt={data.stateName}
                                    className="h-full w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'; // fallback
                                        if (e.currentTarget.nextSibling) {
                                            e.currentTarget.nextSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                                <div className="h-full w-full rounded-xl bg-neutral-900 border border-white/10 items-center justify-center hidden">
                                    <span className="text-xl font-black text-white font-mono">{data.code}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/15">
                                        {data.status}
                                    </span>
                                    <span className="text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
                                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                        {data.headquarters}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                                    {data.bodyName}
                                </h1>

                                <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                                    Affiliated governing body under {data.parentBody}
                                </p>
                            </div>
                        </div>

                        {/* high-level overview capsules */}
                        <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                            <div className="px-5 py-3 rounded-2xl bg-[#070b14]/80 border border-white/15 text-center min-w-[110px] shadow-inner">
                                <span className="block text-2xl font-black text-white font-mono">{data.districts.length}</span>
                                <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">Districts</span>
                            </div>
                            <div className="px-5 py-3 rounded-2xl bg-[#070b14]/80 border border-white/15 text-center min-w-[110px] shadow-inner">
                                <span className="block text-2xl font-black text-emerald-400 font-mono">{data.programs.length}</span>
                                <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">Circuits</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* left column: sanctioned programs & districts */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* programs & qualifiers */}
                        <section className="space-y-4">
                            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">
                                    Sanctioned Programs & Qualifiers
                                </h2>
                                <span className="text-xs text-neutral-400 font-mono font-bold">[ STATE REGISTRY ]</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {data.programs.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-5 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-lg flex items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-neutral-400">{item.id}</span>
                                                <span className="text-neutral-600">&bull;</span>
                                                <span className="text-xs text-white font-semibold">{item.discipline}</span>
                                            </div>
                                            <h3 className="text-base font-bold text-white tracking-wide">
                                                {item.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs text-neutral-400 hidden sm:inline">{item.cadence}</span>
                                            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 border border-white/15 text-white">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* registered districts */}
                        <section className="space-y-4">
                            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">
                                    Registered Districts & Sub-Associations
                                </h2>
                                <span className="text-xs text-neutral-400 font-mono font-bold">{data.districts.length} Districts</span>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {data.districts.map((district) => (
                                    <span
                                        key={district}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] border border-white/15 text-xs font-semibold text-neutral-200 flex items-center gap-2 shadow-sm"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        {district}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* right column: secretary & board */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* contact box */}
                        <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-4">
                            <h3 className="text-xs font-black tracking-widest text-neutral-300 uppercase pb-2 border-b border-white/10">
                                Official Secretariat
                            </h3>

                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Address</span>
                                    <span className="text-neutral-200 font-medium leading-relaxed">{data.contactInfo.address}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Email</span>
                                    <span className="text-white font-mono">{data.contactInfo.email}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Contact</span>
                                    <span className="text-white font-mono">{data.contactInfo.phone}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-500 uppercase tracking-wider block text-[10px] mb-0.5">Official Portal</span>
                                    <span className="text-neutral-300 font-mono">{data.contactInfo.website}</span>
                                </div>
                            </div>
                        </div>

                        {/* executive board */}
                        <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-[#101728] via-[#0d1424] to-[#090e1a] shadow-xl space-y-3">
                            <h3 className="text-xs font-black tracking-widest text-neutral-300 uppercase pb-2 border-b border-white/10">
                                Executive Board
                            </h3>

                            <div className="space-y-2 text-xs">
                                {data.executiveCommittee.map((official) => (
                                    <div key={official.role} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                                        <span className="text-neutral-400">{official.role}</span>
                                        <span className="text-white font-bold">{official.name}</span>
                                    </div>
                                ))}
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

