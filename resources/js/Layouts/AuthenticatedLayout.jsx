// --1. imports--
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';

// --2. main component--
export default function AuthenticatedLayout({ children, header }) {
    const user = usePage().props.auth.user; // properties
    const [sidebarOpen, setSidebarOpen] = useState(false); // state

    const menuItems = [ // properties
        {
            name: 'Dashboard',
            icon: (
                <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
            ),
            route: 'member.dashboard',
            params: { tab: 'overview' },
            active: route().current('member.dashboard') && (route().params.tab === 'overview' || !route().params.tab)
        },
        {
            name: 'Penyata Simpanan',
            icon: (
                <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            route: 'member.dashboard',
            params: { tab: 'savings' },
            active: route().current('member.dashboard') && route().params.tab === 'savings'
        },
        {
            name: 'Permohonan Pembiayaan',
            icon: (
                <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            route: 'member.dashboard',
            params: { tab: 'financing' },
            active: route().current('member.dashboard') && route().params.tab === 'financing'
        },
        {
            name: 'Mohon Pembiayaan Baru',
            icon: (
                <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            route: 'member.financing.apply',
            active: route().current('member.financing.apply')
        },
        {
            name: 'Profil Anggota',
            icon: (
                <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            route: 'member.dashboard',
            params: { tab: 'profile' },
            active: route().current('member.dashboard') && route().params.tab === 'profile'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex antialiased">
            {/* Sidebar */}
            <aside className={`bg-[#0a192f] text-slate-350 w-64 min-h-screen border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ${sidebarOpen ? 'ml-0' : '-ml-64'} md:ml-0 fixed md:static z-50`}>
                <div>
                    <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                        <img
                            src="/images/mesf_logo.png"
                            alt="MESF Logo"
                            className="h-10 w-auto object-contain"
                        />
                        <div>
                            <span className="font-bold text-white text-xs tracking-wider block">MESF</span>
                            <span className="text-[9px] text-amber-400 font-extrabold uppercase">Konsol Ahli</span>
                        </div>
                    </div>

                    <nav className="p-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={route(item.route, item.params)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md text-xs font-bold transition-all ${item.active
                                    ? 'bg-[#0a192f] text-white shadow-xs'
                                    : 'text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                <span className="flex items-center text-white">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-black/10 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Portal Anggota
                    </span>
                </div>
            </aside>

            {/* Sidebar overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-slate-500 hover:text-slate-800 focus:outline-none md:hidden flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 text-slate-500 hover:text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {header}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-bold leading-4 text-slate-600 transition duration-150 ease-in-out hover:text-slate-800 focus:outline-none"
                                        >
                                            {user.name}

                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('home')}>
                                        Laman Utama
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={(e) => { // trigger
                                            if (!window.confirm("Adakah anda pasti mahu log keluar daripada akaun?")) { // check
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Log Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8 max-w-[1350px] w-full mx-auto flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
