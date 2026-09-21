// --1. imports--
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

// --2. main component--
export default function Login({ status, canResetPassword }) {
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const bannerUrl = settings?.bannerUrl || '/images/mesf_bg_v2.jpg'; // properties
    const orgName = settings?.orgName || 'Malaysia Esports Federation'; // properties

    const { data, setData, post, processing, errors, reset } = useForm({ // state
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false); // state

    // --3. actions--
    const submit = (e) => { // trigger
        e.preventDefault();
        post(route('login'), { // save
            onFinish: () => reset('password'),
        });
    };

    // --4. UI--
    return (
        <div className="relative min-h-screen w-full font-sans bg-[#070B14] text-white selection:bg-amber-400 selection:text-black overflow-x-hidden flex flex-col justify-between items-center py-6 sm:py-8 px-4 sm:px-6">
            <Head title="Management Portal Sign In - MESF" />

            {/* texture effect */}
            <div
                className="pointer-events-none fixed inset-0 z-40 opacity-[0.06] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* background wallpaper and gradients */}
            <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none">
                <img
                    src={bannerUrl}
                    alt="Background"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/mesf_bg_v2.jpg';
                    }}
                    className="h-full w-full object-cover object-center scale-[1.03] filter brightness-[0.7] contrast-[1.15]"
                />
                <div className="absolute inset-0 bg-[#070B14]/65" />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(7, 11, 20, 0.25) 0%, rgba(7, 11, 20, 0.8) 55%, rgba(7, 11, 20, 0.98) 85%, #070B14 100%)'
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(7, 11, 20, 0.95) 0%, transparent 35%, transparent 65%, #070B14 100%)'
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to right, rgba(7, 11, 20, 0.95) 0%, transparent 35%, transparent 65%, rgba(7, 11, 20, 0.95) 100%)'
                    }}
                />
            </div>

            <header className="relative z-10 w-full max-w-5xl flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-semibold rounded-full transition-all border border-white/10 group"
                >
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Homepage</span>
                </Link>
            </header>

            <main className="relative z-10 w-full max-w-[420px] my-auto py-6 flex flex-col items-center">
                <div className="flex flex-col items-center text-center mb-6 [perspective:1000px]">
                    <Link href="/" className="group inline-block mb-4 cursor-pointer" aria-label="MESF Home">
                        <img
                            src={logoUrl}
                            alt="MESF Logo"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/mesf_logo.png';
                            }}
                            className="h-28 sm:h-32 w-auto object-contain drop-shadow-[0_0_40px_rgba(245,158,11,0.35)] group-hover:[transform:rotateY(720deg)] transition-transform duration-1000 ease-in-out"
                        />
                    </Link>
                    <div className="text-xs font-mono font-bold text-amber-400 tracking-[0.25em] uppercase mb-1.5">
                        {orgName}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                        Management Portal
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 font-medium">
                        Enter your credentials to access the management portal
                    </p>
                </div>

                <div
                    className="w-full text-white rounded-2xl p-7 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_1px_1px_rgba(255,255,255,0.08)] border border-white/10 relative overflow-hidden"
                    style={{
                        backgroundColor: 'rgba(7, 11, 22, 0.94)',
                        backdropFilter: 'blur(36px) saturate(190%)',
                        WebkitBackdropFilter: 'blur(36px) saturate(190%)',
                    }}
                >
                    <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />

                    {status && ( // check
                        <div className="mb-5 text-sm font-semibold text-emerald-300 bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-500/30 flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="w-full">
                            <InputLabel
                                htmlFor="email"
                                value="Email Address"
                                className="!text-xs !font-bold !text-slate-300 !uppercase !tracking-wider mb-2 block"
                            />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email} // input
                                style={{ width: '100%', boxSizing: 'border-box' }}
                                className="block w-full bg-white/[0.04] border border-white/15 rounded-xl py-3.5 px-4 text-sm sm:text-base text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner transition-all"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)} // trigger
                            />
                            <InputError message={errors.email} className="mt-1.5 text-xs font-medium text-red-400" /> {/* error */}
                        </div>

                        <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="!text-xs !font-bold !text-slate-300 !uppercase !tracking-wider block"
                                />
                                {canResetPassword && ( // check
                                    <Link
                                        href={route('password.request')} // redirect
                                        className="text-xs font-medium text-amber-400/80 hover:text-amber-400 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative w-full">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password} // input
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                    className="block w-full bg-white/[0.04] border border-white/15 rounded-xl py-3.5 pl-4 pr-12 text-sm sm:text-base text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner transition-all"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)} // trigger
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)} // toggle
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none p-1 cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1.5 text-xs font-medium text-red-400" /> {/* error */}
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember} // input
                                    onChange={(e) => setData('remember', e.target.checked)} // trigger
                                    className="rounded border-white/20 bg-white/5 text-amber-400 shadow-sm focus:ring-amber-400 h-4 w-4 transition-colors"
                                />
                                <span className="ms-2.5 text-xs sm:text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                style={{ width: '100%' }}
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl transition-all duration-200 shadow-md shadow-amber-400/20 hover:shadow-lg hover:shadow-amber-400/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                disabled={processing} // toggle
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="relative z-10 text-center py-2 text-[11px] font-mono text-slate-500">
                © {new Date().getFullYear()} Malaysia Esports Federation (MESF). All rights reserved.
            </footer>
        </div>
    );
}