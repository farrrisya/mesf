// --1. imports--
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    ArrowLeft,
    Check
} from 'lucide-react';

// --2. main component--
export default function Register() {
    const { settings } = usePage().props; // properties
    const logoUrl = settings?.logoUrl || '/images/mesf_logo.png'; // properties
    const bannerUrl = settings?.bannerUrl || '/images/mesf_bg_v2.jpg'; // properties
    const orgName = settings?.orgName || 'Malaysia Esports Federation'; // properties

    const { data, setData, post, processing, errors, reset } = useForm({ // state
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false); // state

    // --3. actions--
    

    const handleBack = (e) => { // trigger
        e.preventDefault();
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/'); // fallback
        }
    };

    const submit = (e) => { // trigger
        e.preventDefault();
        post(route('register'), { // save
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation; // check

    // --4. UI--
    return (
        <div className="relative min-h-screen w-full font-sans bg-[#070B14] text-white selection:bg-amber-400 selection:text-black flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6">
            <Head title="Sign Up - MESF" />

            {/* background wallpaper and gradients */}
            <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none">
                <img
                    src={bannerUrl}
                    alt="Background"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/mesf_bg_v2.jpg';
                    }}
                    className="h-full w-full object-cover object-center filter brightness-[0.55] contrast-[1.15]"
                />
                <div className="absolute inset-0 bg-[#070B14]/80" />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(7, 11, 20, 0.3) 0%, rgba(7, 11, 20, 0.85) 55%, #070B14 100%)'
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(7, 11, 20, 0.95) 0%, transparent 25%, transparent 75%, #070B14 100%)'
                    }}
                />
            </div>

            {/* main centered container */}
            <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto py-4">
                {/* back button positioned directly above the card */}
                <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-1">
                    <button
                        type="button"
                        onClick={handleBack} // trigger
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white text-xs font-semibold transition-all backdrop-blur-md cursor-pointer group shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        <span>Back</span>
                    </button>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        REGISTRATION
                    </span>
                </div>

                <div
                    className="w-full max-w-[420px] text-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_1px_1px_rgba(255,255,255,0.08)] border border-white/10 relative overflow-hidden flex flex-col justify-center"
                    style={{
                        backgroundColor: 'rgba(7, 11, 22, 0.94)',
                        backdropFilter: 'blur(36px) saturate(190%)',
                        WebkitBackdropFilter: 'blur(36px) saturate(190%)',
                    }}
                >
                    <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl" />

                    {/* brand identity & title */}
                    <div className="flex flex-col items-center text-center mb-3 shrink-0">
                        <Link href="/" className="inline-block mb-1.5 cursor-pointer" aria-label="MESF Home">
                            <img
                                src={logoUrl}
                                alt="MESF Logo"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/images/mesf_logo.png';
                                }}
                                className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.25)]"
                            />
                        </Link>
                        <div className="text-[10px] font-mono font-bold text-amber-400 tracking-[0.2em] uppercase">
                            {orgName}
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-0.5">
                            Sign Up
                        </h1>
                    </div>

                    {/* dual mode switcher tabs */}
                    <div className="w-full grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-3 shrink-0">
                        <Link
                            href={route('login')} // redirect
                            className="py-1.5 rounded-lg text-slate-400 hover:text-white font-bold text-[11px] text-center uppercase tracking-wider transition-colors"
                        >
                            Log In
                        </Link>
                        <div className="py-1.5 rounded-lg bg-amber-400 text-black font-extrabold text-[11px] text-center uppercase tracking-wider shadow-sm">
                            Sign Up
                        </div>
                    </div>

                    {/* form */}
                    <form onSubmit={submit} className="space-y-2.5">
                        {/* full name */}
                        <div className="space-y-1">
                            <label
                                htmlFor="name"
                                className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider"
                            >
                                Full Name <span className="text-amber-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <User className="w-3.5 h-3.5" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    value={data.name} // input
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)} // trigger
                                    className="block w-full pl-9 pr-3.5 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner transition-all font-sans"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-0.5 text-[11px] font-medium text-rose-400" /> {/* error */}
                        </div>

                        {/* email address */}
                        <div className="space-y-1">
                            <label
                                htmlFor="email"
                                className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider"
                            >
                                Email Address <span className="text-amber-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    value={data.email} // input
                                    placeholder="name@example.com"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)} // trigger
                                    className="block w-full pl-9 pr-3.5 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner transition-all font-sans"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-0.5 text-[11px] font-medium text-rose-400" /> {/* error */}
                        </div>

                        {/* password & confirm row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* password */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="password"
                                    className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider"
                                >
                                    Password <span className="text-amber-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <Lock className="w-3.5 h-3.5" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={data.password} // input
                                        placeholder="Min 8 chars"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)} // trigger
                                        className="block w-full pl-9 pr-9 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner transition-all font-sans"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)} // toggle
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1 cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-3.5 h-3.5" />
                                        ) : (
                                            <Eye className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* confirm password */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider"
                                    >
                                        Confirm <span className="text-amber-400">*</span>
                                    </label>
                                    {data.password_confirmation && (
                                        <span className={`text-[10px] font-semibold ${passwordsMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {passwordsMatch ? 'Match' : 'Mismatch'}
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <Lock className="w-3.5 h-3.5" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        required
                                        value={data.password_confirmation} // input
                                        placeholder="Repeat pass"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)} // trigger
                                        className="block w-full pl-9 pr-8 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner transition-all font-sans"
                                    />
                                    {data.password_confirmation && passwordsMatch && (
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <InputError message={errors.password || errors.password_confirmation} className="mt-0.5 text-[11px] font-medium text-rose-400" /> {/* error */}

                        {/* submit button */}
                        <div className="pt-1.5">
                            <button
                                type="submit"
                                disabled={processing} // toggle
                                className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_4px_22px_rgba(251,191,36,0.45)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign Up</span>
                                        <UserPlus className="w-3.5 h-3.5 text-black" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* log in switch prompt */}
                        <div className="pt-2 text-center text-[11px] text-slate-400">
                            <span>Already have an account? </span>
                            <Link
                                href={route('login')} // redirect
                                className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 transition-colors"
                            >
                                Log In Instead
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            {/* footer */}
            <footer className="relative z-10 text-center py-1 text-[10px] font-mono text-slate-500 shrink-0">
                © {new Date().getFullYear()} Malaysia Esports Federation (MESF). All rights reserved.
            </footer>
        </div>
    );
}
