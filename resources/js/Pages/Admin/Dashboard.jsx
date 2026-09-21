// --1. imports--
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

// --2. main component--
export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard - MESF Admin">
            <Head title="Dashboard - Admin" />

            <div className="space-y-8 max-w-7xl">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-heading">
                        Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                        Overview of tournaments, news, match results, and administrative metrics.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
