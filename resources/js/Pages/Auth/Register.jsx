// --1. imports--
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

// --2. main component--
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Ahli - MESF" />

            <div className="mb-6 text-center">
                <h2 className="text-xl font-black text-[#0a192f] uppercase tracking-wide">Pendaftaran Anggota</h2>
                <p className="text-xs text-slate-400 mt-1">Sila isi borang di bawah untuk memohon sebagai anggota MESF.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Penuh" className="text-xs font-bold text-slate-700 uppercase" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:border-[#0a192f]"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 text-xs" /> {/* error */}
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat E-mel" className="text-xs font-bold text-slate-700 uppercase" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:border-[#0a192f]"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-xs" /> {/* error */}
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Laluan" className="text-xs font-bold text-slate-700 uppercase" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:border-[#0a192f]"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-xs" /> {/* error */}
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Sahkan Kata Laluan"
                        className="text-xs font-bold text-slate-700 uppercase"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:border-[#0a192f]"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError // error
                        message={errors.password_confirmation}
                        className="mt-2 text-xs"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#0a192f] hover:bg-[#0a192f] text-white font-bold text-xs uppercase rounded transition duration-150 shadow-md disabled:opacity-50"
                        disabled={processing}
                    >
                        Daftar Ahli
                    </button>
                </div>

                <div className="border-t border-slate-100 mt-6 pt-4 text-center">
                    <span className="text-xs text-slate-400">Sudah mendaftar sebagai anggota?</span>
                    <Link
                        href={route('login')}
                        className="block mt-1 text-xs font-bold text-[#0a192f] hover:text-amber-500 transition hover:underline uppercase"
                    >
                        Log Masuk Sini
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
