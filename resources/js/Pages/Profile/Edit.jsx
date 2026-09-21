// --1. imports--
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// --2. main component--
export default function Edit({ mustVerifyEmail, status }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-bold leading-tight text-gray-800">
          Kemas Kini Profil
        </h2>
      }
    >
      <Head title="Profil Anggota - iKOOP" />

      <div className="py-8 bg-slate-50">
        <div className="mx-auto max-w-4xl space-y-8 sm:px-6 lg:px-8">
          {/* Header Intro Card */}
          <div className="bg-[#0a192f] text-white p-6 md:p-8 rounded-md shadow-sm border border-slate-800 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">KONFIGURASI AKAUN</span>
            <h3 className="text-xl md:text-2xl font-black mt-1">Urus Maklumat Akaun</h3>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl">
              Kemas kini maklumat profil peribadi anda, alamat e-mel, dan tukar kata laluan keselamatan anda di sini.
            </p>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </div>

          <div className="bg-white p-6 md:p-10 rounded-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out">
            <UpdatePasswordForm className="max-w-xl" />
          </div>

          <div className="bg-white p-6 md:p-10 rounded-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
