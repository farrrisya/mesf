// --1. imports--
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import {
    Save,
    Shield,
    Check,
    AlertCircle,
    UserCheck
} from 'lucide-react';

// --2. properties--
const ROLES = [
    { value: 'admin', label: 'Admin', desc: 'Full administration, system settings, activity logs & role management.' },
    { value: 'editor', label: 'Editor', desc: 'Manage editorial content, news, leagues, matches, teams, and library.' },
    { value: 'secretariat', label: 'Secretary', desc: 'Manage official inquiries, incoming correspondence, and secretary desk.' }
];

// --3. main component--
export default function Edit({ staffUser = {} }) {
    const { data, setData, put, processing, errors } = useForm({ // state
        role: staffUser?.role || 'editor',
        is_active: staffUser?.is_active ?? true,
    });

    // --4. actions--
    const handleSubmit = (e) => { // trigger
        e.preventDefault(); // check
        put(route('admin.users.update', staffUser.id)); // save
    };

    // --5. UI--
    return (
        <AdminLayout title={`Edit Staff User - ${staffUser.name}`}>
            <Head title={`Edit Role - ${staffUser.name}`} />

            <div className="w-full max-w-3xl pb-16 space-y-5">
                {/* header bar: tightly positioned with inline back button */}
                <div className="flex items-center gap-3">
                    <BackButton href={route('admin.users.index')} label="Back" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Edit Staff Role & Status
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Update permissions, assigned role level, and active login state.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit} // trigger
                    className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
                >
                    {/* Safeguard Error Alert */}
                    {errors?.error && (
                        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center gap-3 animate-fadeIn">
                            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold">{errors.error}</span>
                        </div>
                    )}

                    {/* Staff Info Preview Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#070B14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Account Details
                            </div>
                            <div className="text-base font-bold text-white mt-0.5">
                                {staffUser.name}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                                {staffUser.email}
                            </div>
                        </div>

                        <div className="text-left sm:text-right">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                                Registered On
                            </span>
                            <span className="text-xs font-mono text-slate-300">
                                {new Date(staffUser.created_at).toLocaleDateString('en-MY', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
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

                    {/* Account Status Switch */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#070B14] border border-white/10 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <label className="text-sm font-bold text-white block">
                                Account Active Status
                            </label>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Deactivated accounts cannot log in to the management portal.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setData('is_active', !data.is_active)} // toggle
                            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                data.is_active ? 'bg-amber-400' : 'bg-white/20'
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-[#070B14] shadow-lg ring-0 transition duration-200 ease-in-out ${
                                    data.is_active ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                    {errors.is_active && (
                        <p className="text-xs text-rose-400 mt-1 font-medium">{errors.is_active}</p>
                    )}

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
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
