// --1. imports--
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    UserPlus,
    Shield,
    ArrowLeft,
    Check,
    AlertCircle
} from 'lucide-react';

// --2. properties--
const ROLES = [
    { value: 'super_admin', label: 'Super Admin', desc: 'Full unrestricted system access, system settings & role management.' },
    { value: 'admin', label: 'Admin', desc: 'Full administration except settings and user role management.' },
    { value: 'editor', label: 'Editor', desc: 'Manage editorial content, news, leagues, matches, teams, and gallery.' },
    { value: 'secretariat', label: 'Secretariat', desc: 'Manage official inquiries, incoming correspondence, and secretariat desk.' }
];

// --3. main component--
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({ // state
        name: '',
        email: '',
        role: 'editor',
        password: '',
        password_confirmation: '',
    });

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        post(route('admin.users.store')); // save
    };

    // --5. UI--
    return (
        <AdminLayout title="Add Staff Account - MESF Admin">
            <Head title="Create Staff User - Admin" />

            <div className="space-y-6 max-w-3xl pb-16">
                {/* Header title */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.users.index')} // redirect
                            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                                Add Staff Account
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                Create an official federation administrator or management staff profile.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit} // trigger
                    className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
                >
                    {/* General Errors */}
                    {errors?.error && (
                        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold">{errors.error}</span>
                        </div>
                    )}

                    {/* Staff Name */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name} // input
                            onChange={(e) => setData('name', e.target.value)} // trigger
                            placeholder="e.g. Ahmad Razak bin Zainal"
                            className="w-full px-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                            required
                        />
                        {errors.name && (
                            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Official Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email} // input
                            onChange={(e) => setData('email', e.target.value)} // trigger
                            placeholder="staff@mesf.my"
                            className="w-full px-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all font-mono"
                            required
                        />
                        {errors.email && (
                            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email}</p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Assigned Management Role
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ROLES.map((role) => {
                                const isSelected = data.role === role.value; // check

                                return (
                                    <div
                                        key={role.value}
                                        onClick={() => setData('role', role.value)} // trigger
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                            isSelected
                                                ? 'bg-amber-400/10 border-amber-400/60 shadow-lg shadow-amber-400/10'
                                                : 'bg-[#070B14]/70 border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-sm font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                                                {role.label}
                                            </span>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            {role.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.role && (
                            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.role}</p>
                        )}
                    </div>

                    {/* Password & Confirmation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Temporary Password
                            </label>
                            <input
                                type="password"
                                value={data.password} // input
                                onChange={(e) => setData('password', e.target.value)} // trigger
                                placeholder="Minimum 8 characters"
                                className="w-full px-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all font-mono"
                                required
                            />
                            {errors.password && (
                                <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation} // input
                                onChange={(e) => setData('password_confirmation', e.target.value)} // trigger
                                placeholder="Repeat password"
                                className="w-full px-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all font-mono"
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <Link
                            href={route('admin.users.index')} // redirect
                            className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing} // check
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>{processing ? 'Creating Account...' : 'Create Account'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
