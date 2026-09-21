// --1. imports--
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

// --2. main component--
export default function PenerbitanShow({ auth, penerbitan }) {
    return (
        <PublicLayout auth={auth}>
            <Head title={`${penerbitan.title} - Kopmedia`} />

            <div className="max-w-[1350px] mx-auto px-4 md:px-8 py-8 md:py-10 text-left border-b border-slate-300">

                <h1 className="text-2xl md:text-4xl font-black mt-2 text-slate-900 leading-tight">
                    {penerbitan.title}
                </h1>
            </div>

            <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-12">
                <div className="mb-8">
                    <button
                        onClick={(e) => { e.preventDefault(); window.history.back(); }} // redirect
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0a192f] hover:text-amber-500 transition"
                    >
                        <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                </div>

                <div className="bg-white rounded-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden p-6 md:p-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Diterbitkan pada:</span>
                            <span className="font-semibold text-slate-600">
                                {new Date(penerbitan.created_at).toLocaleString('en-GB', { // convert
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}
                            </span>
                        </div>
                        <div>
                            <a
                                href={penerbitan.media_type === 'url' ? penerbitan.url_link : `/storage/${penerbitan.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a192f] text-white text-xs font-bold rounded hover:bg-amber-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Buka Fail Penerbitan
                            </a>
                        </div>
                    </div>

                    {penerbitan.image_path ? ( // check
                        <div className="w-full rounded-md overflow-hidden border border-slate-100 flex justify-center bg-slate-50">
                            <img
                                src={`/storage/${penerbitan.image_path}`}
                                alt={penerbitan.title}
                                className="w-full h-auto object-contain max-w-4xl"
                            />
                        </div>
                    ) : (
                        <div className="w-full rounded-md border border-slate-100 bg-slate-50 py-20 text-center flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-slate-400 font-bold">Tiada Poster Disediakan</span>
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
