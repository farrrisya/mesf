// --1. imports--
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';

// --2. main component--
export default function HubungiKami({ auth, settings = {} }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Parse direktori list safely
    let direktoriList = [];
    try {
        direktoriList = settings?.contact_direktori_list ? JSON.parse(settings.contact_direktori_list) : [];
    } catch (e) {
        direktoriList = [];
    }

    // Smooth scroll handler for anchor links
    const handleSmoothScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <PublicLayout auth={auth}>
      <Head title="Hubungi Kami - MESF" />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#0a192f] text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
          {/* Background Image with Low Opacity */}
          <div 
              className="absolute inset-0 z-0 opacity-30" 
              style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
              }}
          ></div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
          
          <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-black mb-6 md:mb-8 text-white leading-tight uppercase tracking-widest drop-shadow-lg">
                  HUBUNGI KAMI
              </h1>
              
              {/* Horizontal Menu */}
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-2">
                  <a 
                      href="#talian-hubungan" 
                      onClick={(e) => handleSmoothScroll(e, 'talian-hubungan')}
                      className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-200"
                  >
                      Talian Hubungan
                  </a>
                  <span className="text-white/20 text-xs hidden sm:block">•</span>
                  <a 
                      href="#direktori" 
                      onClick={(e) => handleSmoothScroll(e, 'direktori')}
                      className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-200"
                  >
                      Direktori Kakitangan
                  </a>
                  <span className="text-white/20 text-xs hidden sm:block">•</span>
                  <a 
                      href="#lokasi" 
                      onClick={(e) => handleSmoothScroll(e, 'lokasi')}
                      className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-200"
                  >
                      Lokasi
                  </a>
              </div>
          </div>
      </div>

      <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-16 md:pb-24 space-y-20 md:space-y-32">


        <div>
            {/* Intro Text */}
            <div className="text-center pb-10 border-b border-slate-100 max-w-2xl mx-auto mb-12 md:mb-16">
            <p className="text-base md:text-lg font-medium text-slate-500">
                Sebarang aduan atau pertanyaan boleh rujuk info dibawah
            </p>
            </div>

            {/* Hubungan & Operasi Section */}
            <section id="talian-hubungan" className="scroll-mt-28">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                    
                    {/* Talian Hubungan - Left Side (Bigger) */}
                    <div className="lg:col-span-2 flex flex-col bg-[#0a192f] p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden group/talian border border-slate-800">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-bl-full -mr-16 -mt-16 pointer-events-none transition-transform duration-700 group-hover/talian:scale-105"></div>
                        
                        <div className="mb-8 text-center lg:text-left relative z-10">
                            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 lg:after:left-0 after:-translate-x-1/2 lg:after:translate-x-0 after:w-12 after:h-1 after:bg-amber-400 after:rounded-full">
                                Talian Hubungan
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 relative z-10">
                            {/* WhatsApp Card */}
                            <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 flex flex-col group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.84.497 3.593 1.442 5.127L2.102 22l4.981-1.306A9.972 9.972 0 0012.031 22c5.535 0 10.03-4.495 10.03-10.03S17.566 2 12.031 2zm5.418 14.542c-.23.649-1.332 1.258-1.84 1.341-.47.077-1.077.135-3.327-.798-2.67-1.107-4.407-3.824-4.543-4.004-.136-.18-1.085-1.446-1.085-2.76 0-1.314.685-1.956.929-2.227.244-.27.53-.338.706-.338.176 0 .352.001.503.008.159.008.375-.061.587.45.22.536.705 1.724.77 1.854.065.13.109.28.02.46-.089.176-.135.289-.27.438-.135.15-.285.327-.406.46-.134.15-.282.316-.123.592.16.275.713 1.18 1.534 1.912 1.058.944 1.936 1.236 2.215 1.37.279.135.441.11.604-.075.163-.186.705-.823.895-1.106.189-.283.378-.236.634-.135.257.101 1.62.766 1.899.905.279.14.466.21.534.326.068.115.068.67-.162 1.319z" clipRule="evenodd" /></svg>
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">WhatsApp</h3>
                                </div>
                                {settings.contact_whatsapp ? (
                                    <a href={`https://wa.me/${(settings.contact_whatsapp || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="relative z-10 mt-auto px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn">
                                    <span>{settings.contact_whatsapp || "N/A"}</span>
                                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </a>
                                ) : (
                                    <span className="relative z-10 text-lg font-bold text-slate-400 mt-auto">N/A</span>
                                )}
                            </div>

                            {/* No. Telefon Card */}
                            <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 flex flex-col group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">No. Telefon</h3>
                                </div>
                                <a href={`tel:${(settings.contact_phone || '').replace(/[^0-9+]/g, '')}`} className="relative z-10 mt-auto text-xl md:text-2xl font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                {settings.contact_phone || "N/A"}
                                </a>
                            </div>

                            {/* No. Faks Card */}
                            <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-500 flex flex-col group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">No. Faks</h3>
                                </div>
                                <p className="relative z-10 mt-auto text-xl md:text-2xl font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {settings.contact_fax || "N/A"}
                                </p>
                            </div>

                            {/* Emel Rasmi Card */}
                            <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-500 flex flex-col group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Emel Rasmi</h3>
                                </div>
                                <a href={`mailto:${settings.contact_email || ''}`} className="relative z-10 mt-auto text-[16px] lg:text-[15px] xl:text-lg font-bold text-slate-700 group-hover:text-rose-600 transition-colors break-all">
                                {settings.contact_email || "N/A"}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Waktu Operasi - Right Side (Smaller) */}
                    <div className="lg:col-span-1 flex flex-col">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 lg:after:left-0 after:-translate-x-1/2 lg:after:translate-x-0 after:w-12 after:h-1 after:bg-amber-500 after:rounded-full">
                                Waktu Operasi
                            </h2>
                        </div>
                        
                        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-500 flex flex-col flex-1 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
                            
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Waktu Pejabat</h3>
                            </div>

                            <div className="relative z-10 flex flex-col gap-4 text-[14px] font-bold text-slate-500 w-full mt-auto">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                    <span className="text-slate-700">Isnin</span>
                                    <span className="text-slate-500 font-medium">09:00 AM - 06:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                    <span className="text-slate-700">Selasa</span>
                                    <span className="text-slate-500 font-medium">09:00 AM - 06:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                    <span className="text-slate-700">Rabu</span>
                                    <span className="text-slate-500 font-medium">09:00 AM - 06:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                    <span className="text-slate-700">Khamis</span>
                                    <span className="text-slate-500 font-medium">09:00 AM - 06:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                    <span className="text-slate-700">Jumaat</span>
                                    <span className="text-slate-500 font-medium">09:00 AM - 06:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-rose-600 font-black">Sabtu &amp; Ahad</span>
                                    <span className="font-black text-rose-600 uppercase tracking-wider">Tutup</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* Direktori Section */}
        {direktoriList.length > 0 ? (
          <section id="direktori" className="scroll-mt-28">
              <div className="mb-10 text-center">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide inline-block">
                      Direktori Kakitangan
                  </h2>
              </div>
              <div className="w-full border border-slate-100 rounded-3xl bg-white shadow-xl overflow-hidden flex flex-col">
                  {/* Search Bar Header */}
                  <div className="p-6 md:p-8 border-b border-slate-100 bg-[#0a192f] flex justify-start relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                      <div className="relative w-full md:w-96 z-10">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                          <input 
                              type="text" 
                              placeholder="Cari kakitangan atau unit..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white shadow-inner transition-all duration-300"
                          />
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                  <th className="px-8 py-5 font-black text-slate-700 uppercase tracking-widest text-[11px] w-[25%] align-top">Kakitangan</th>
                                  <th className="px-8 py-5 font-black text-slate-700 uppercase tracking-widest text-[11px] w-[35%] align-top">Unit</th>
                                  <th className="px-8 py-5 font-black text-slate-700 uppercase tracking-widest text-[11px] text-center align-top w-[15%]">
                                      No. Sambungan
                                      <span className="block mt-1 text-slate-400 font-semibold normal-case">(03-22824647)</span>
                                  </th>
                                  <th className="px-8 py-5 font-black text-slate-700 uppercase tracking-widest text-[11px] text-center align-top w-[25%]">Tindakan</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {direktoriList.filter(item => 
                                  (item.nama && item.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                  (item.unit && item.unit.toLowerCase().includes(searchQuery.toLowerCase()))
                              ).map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                      <td className="px-8 py-5 font-bold text-slate-900">{item.nama || '-'}</td>
                                      <td className="px-8 py-5 text-slate-600 font-medium">{item.unit || '-'}</td>
                                      <td className="px-8 py-5 text-slate-700 text-center font-bold">{item.sambungan || '-'}</td>
                                      <td className="px-8 py-5 text-slate-600 text-center">
                                          {item.whatsapp ? (
                                              <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                                                  <a href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group/btn">
                                                      <svg className="w-4 h-4 transform group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.84.497 3.593 1.442 5.127L2.102 22l4.981-1.306A9.972 9.972 0 0012.031 22c5.535 0 10.03-4.495 10.03-10.03S17.566 2 12.031 2zm5.418 14.542c-.23.649-1.332 1.258-1.84 1.341-.47.077-1.077.135-3.327-.798-2.67-1.107-4.407-3.824-4.543-4.004-.136-.18-1.085-1.446-1.085-2.76 0-1.314.685-1.956.929-2.227.244-.27.53-.338.706-.338.176 0 .352.001.503.008.159.008.375-.061.587.45.22.536.705 1.724.77 1.854.065.13.109.28.02.46-.089.176-.135.289-.27.438-.135.15-.285.327-.406.46-.134.15-.282.316-.123.592.16.275.713 1.18 1.534 1.912 1.058.944 1.936 1.236 2.215 1.37.279.135.441.11.604-.075.163-.186.705-.823.895-1.106.189-.283.378-.236.634-.135.257.101 1.62.766 1.899.905.279.14.466.21.534.326.068.115.068.67-.162 1.319z" clipRule="evenodd" /></svg>
                                                      {item.whatsapp}
                                                  </a>
                                              </div>
                                          ) : '-'}
                                      </td>
                                  </tr>
                              ))}
                              {direktoriList.filter(item => 
                                  (item.nama && item.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                  (item.unit && item.unit.toLowerCase().includes(searchQuery.toLowerCase()))
                              ).length === 0 && (
                                  <tr>
                                      <td colSpan="4" className="px-8 py-16 text-center text-slate-500 font-medium bg-slate-50/50">Tiada padanan ditemui.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </section>
        ) : null}

        {/* Lokasi Section */}
        <section id="lokasi" className="scroll-mt-28">
            <div className="mb-10 text-center">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide inline-block">
                    Lokasi
                </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-500">
                    <div className="p-8 md:p-10 flex-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </span>
                            Pejabat
                        </h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap relative z-10">
                            {settings.contact_address || "Alamat tidak disediakan."}
                        </p>
                    </div>
                    <div className="w-full aspect-[16/10] bg-slate-50 relative overflow-hidden group-hover:brightness-95 transition-all duration-500">
                        {settings.contact_map_url && settings.contact_map_url.includes('<iframe') ? (
                            <div dangerouslySetInnerHTML={{ __html: settings.contact_map_url.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }} className="w-full h-full pointer-events-none group-hover:pointer-events-auto [&>iframe]:w-full [&>iframe]:h-full" />
                        ) : (
                            <iframe
                                src={settings.contact_map_url || "https://maps.google.com/maps?q=Menara%20Mutiara%20Bangsar,%20Jalan%20Liku,%2059100%20Kuala%20Lumpur&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="pointer-events-none group-hover:pointer-events-auto"
                            ></iframe>
                        )}
                    </div>
                </div>

                <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-500">
                    <div className="p-8 md:p-10 flex-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </span>
                            Operasi
                        </h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap relative z-10">
                            {settings.contact_address_operasi || "Alamat tidak disediakan."}
                        </p>
                    </div>
                    <div className="w-full aspect-[16/10] bg-slate-50 relative overflow-hidden group-hover:brightness-95 transition-all duration-500">
                        {settings.contact_map_url_operasi && settings.contact_map_url_operasi.includes('<iframe') ? (
                            <div dangerouslySetInnerHTML={{ __html: settings.contact_map_url_operasi.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }} className="w-full h-full pointer-events-none group-hover:pointer-events-auto [&>iframe]:w-full [&>iframe]:h-full" />
                        ) : (
                            <iframe
                                src={settings.contact_map_url_operasi || "https://maps.google.com/maps?q=Menara%20Mutiara%20Bangsar,%20Jalan%20Liku,%2059100%20Kuala%20Lumpur&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="pointer-events-none group-hover:pointer-events-auto"
                            ></iframe>
                        )}
                    </div>
                </div>
            </div>
        </section>
      </main>
    </PublicLayout>
  );
}
