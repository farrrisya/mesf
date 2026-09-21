import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

// --1. main component--
export default function Keanggotaan() {
    // --2. UI--
    return (
        <PublicLayout isHome={false}>
            <Head title="Keanggotaan - MESF" />
            
            {/* Header Section */}
            <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-800/40 via-[#0a192f] to-[#0a192f] pointer-events-none"></div>
                
                {/* Clean geometric accents */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/[0.03] to-transparent transform -skew-x-12 translate-x-20"></div>
                <div className="absolute bottom-0 left-10 w-64 h-64 bg-red-600/[0.05] rounded-full blur-3xl"></div>

                <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <span className="w-8 h-[1px] bg-red-500/50"></span>
                        <span className="text-red-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                            Sertai Kami
                        </span>
                        <span className="w-8 h-[1px] bg-red-500/50"></span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-widest drop-shadow-lg mb-6">
                        Manfaat Keanggotaan
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
                        Nikmati pelbagai keistimewaan eksklusif termasuk penyelesaian kewangan bersepadu dan manfaat perlindungan yang direka khas untuk anda dan keluarga.
                    </p>
                </div>
            </div>

            <div className="max-w-[1350px] mx-auto px-4 pt-8 pb-16 md:pt-12 md:pb-24 space-y-16 md:space-y-24">
                
                {/* 6 Benefits Section */}
                <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
                                Manfaat Utama
                            </h3>
                            <p className="text-slate-500">Kelebihan yang bakal anda nikmati sebagai anggota koperasi.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        
                        {/* Benefit 1 */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-black text-xl font-serif">
                                01
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors">Tabungan & Pelaburan</h3>
                            <ul className="text-slate-600 space-y-2.5 flex-grow text-sm">
                                <li className="flex items-start gap-3"><span className="text-blue-500 mt-0.5">•</span> Caruman minima RM50 sebulan</li>
                                <li className="flex items-start gap-3"><span className="text-blue-500 mt-0.5">•</span> Simpanan Khas</li>
                                <li className="flex items-start gap-3"><span className="text-blue-500 mt-0.5">•</span> Dividen Tahunan</li>
                                <li className="flex items-start gap-3"><span className="text-blue-500 mt-0.5">•</span> Skim Pelaburan Dana Ar Rahn</li>
                                <li className="flex items-start gap-3"><span className="text-blue-500 mt-0.5">•</span> Buku Simpanan Emas (BSE)</li>
                            </ul>
                        </div>

                        {/* Benefit 2 */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 font-black text-xl font-serif">
                                02
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors">Skim Pembiayaan</h3>
                            <ul className="text-slate-600 space-y-2.5 flex-grow text-sm">
                                <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5">•</span> Tunai Segera RM 600</li>
                                <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5">•</span> Kecemasan RM3000</li>
                                <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5">•</span> Kembali ke Sekolah RM1800</li>
                                <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5">•</span> Sara Hidup RM1000</li>
                                <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5">•</span> Skim Peribadi Tanpa Penjamin RM5000</li>
                                <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5">•</span> Insurans, Cukai Jalan dan Tayar RM 5000</li>
                            </ul>
                        </div>

                        {/* Benefit 3 */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6 font-black text-xl font-serif">
                                03
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors">Skim Perlindungan</h3>
                            <ul className="text-slate-600 space-y-2.5 flex-grow text-sm">
                                <li className="flex items-start gap-3"><span className="text-red-500 mt-0.5">•</span> Perlindungan kepada anggota dan keluarga serendah RM10 sebulan</li>
                                <li className="flex items-start gap-3"><span className="text-red-500 mt-0.5">•</span> Manfaat perlindungan sehingga RM34,000 seorang</li>
                            </ul>
                        </div>

                        {/* Benefit 4 */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 font-black text-xl font-serif">
                                04
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors">Tabung Kebajikan Am</h3>
                            <ul className="text-slate-600 space-y-2.5 flex-grow text-sm">
                                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">•</span> Kemasukan Tahun 1 RM100</li>
                                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">•</span> Penyakit Kronik RM200</li>
                                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">•</span> Bencana Alam RM300</li>
                                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">•</span> Anugerah Kecemerlangan Pendidikan</li>
                            </ul>
                        </div>

                        {/* Benefit 5 */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 font-black text-xl font-serif">
                                05
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors">Tabung Khairat Kematian</h3>
                            <ul className="text-slate-600 space-y-2.5 flex-grow text-sm">
                                <li className="flex items-start gap-3"><span className="text-purple-500 mt-0.5">•</span> Anggota RM1000</li>
                                <li className="flex items-start gap-3"><span className="text-purple-500 mt-0.5">•</span> Pasangan RM500</li>
                                <li className="flex items-start gap-3"><span className="text-purple-500 mt-0.5">•</span> Anak RM500</li>
                                <li className="flex items-start gap-3"><span className="text-purple-500 mt-0.5">•</span> Ibu/Bapa RM300</li>
                                <li className="flex items-start gap-3"><span className="text-purple-500 mt-0.5">•</span> Ibu/Bapa Mertua RM300</li>
                            </ul>
                        </div>

                        {/* Benefit 6 */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full">
                            <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center mb-6 font-black text-xl font-serif">
                                06
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors">Manfaat Lain</h3>
                            <ul className="text-slate-600 space-y-2.5 flex-grow text-sm">
                                <li className="flex items-start gap-3"><span className="text-cyan-500 mt-0.5">•</span> Latihan/Kursus IKMA dengan yuran minima</li>
                                <li className="flex items-start gap-3"><span className="text-cyan-500 mt-0.5">•</span> Terlibat dengan aktiviti koperasi</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Info and CTA Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Eligibility & Contact */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Kelayakan Menjadi Anggota
                            </h4>
                            <ul className="text-slate-600 space-y-3 text-sm">
                                <li className="flex items-start gap-2">- Kakitangan NSTP/MPB (Sepenuhnya Masa dan Kontrak HR)</li>
                                <li className="flex items-start gap-2">- Bekas Kakitangan NSTP/MPB</li>
                                <li className="flex items-start gap-2">- Ahli Keluarga</li>
                                <li className="flex items-start gap-2">- Rakan Niaga Koperasi</li>
                            </ul>
                            <p className="text-[10px] text-slate-400 mt-4 italic">* Tertakluk Terma dan Syarat</p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Pertanyaan & Bantuan
                            </h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Sebarang pertanyaan berkaitan pendaftaran, sila hubungi wakil kami:
                            </p>
                            <a 
                                href="https://wa.me/601120507235"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-slate-900 font-bold bg-white hover:bg-emerald-50 p-3 rounded-lg border border-slate-200 hover:border-emerald-200 shadow-sm transition-all duration-300 group cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                011-20507235 (Ismadi/Ridzwan)
                            </a>
                        </div>
                    </div>

                    {/* Registration Instructions & CTA */}
                    <div className="lg:col-span-2">
                        <div className="w-full h-full bg-[#0a192f] rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-800/20 via-[#172554]/20 to-transparent pointer-events-none"></div>
                            
                            <h3 className="text-2xl md:text-3xl font-serif font-black text-white mb-6 relative z-10">
                                Langkah Mudah Pendaftaran:
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
                                    <p className="text-slate-300 mt-1">Klik pada pautan <span className="text-white font-bold">DAFTAR ANGGOTA BARU</span> di portal i-Koop.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
                                    <p className="text-slate-300 mt-1">Isi <span className="text-white font-bold">No. Kad Pengenalan (KP)</span> dan ikut arahan seterusnya yang dipaparkan.</p>
                                </div>
                            </div>
                            
                            <div className="relative z-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6 justify-between">
                                <p className="text-slate-300 text-sm max-w-sm">
                                    Daftar sekarang dan nikmati segala kemudahan serta manfaat yang disediakan khas untuk anda.
                                </p>
                                <a 
                                    href="https://app.ikoop.com.my/knstp/index.php?page=login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto whitespace-nowrap"
                                >
                                    <span>Klik Untuk Daftar</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
