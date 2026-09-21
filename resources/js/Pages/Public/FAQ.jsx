// --1. imports--
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';

// --2. main component--
export default function FAQ({ auth, faqs = [] }) {

  const [openIndex, setOpenIndex] = useState(null); // state

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <PublicLayout auth={auth}>
      <Head title="Soalan Lazim (FAQ) - MESF" />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white min-h-[220px] md:min-h-[280px] flex items-center justify-center">
          {/* Background Image with Low Opacity */}
          <div 
              className="absolute inset-0 z-0 opacity-30" 
              style={{
                  backgroundImage: "url('/images/faq-bg-new.png')",
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
              }}
          ></div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
          
          <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-black mb-6 md:mb-8 text-white leading-tight uppercase tracking-widest drop-shadow-lg">
                  SOALAN LAZIM (FAQ)
              </h1>
          </div>
      </div>

      <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-16 md:pb-20">

        <div className="space-y-4">
          {faqs.length > 0 ? faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden group/faq ${isOpen ? 'border-amber-500/30 shadow-md ring-1 ring-amber-500/10' : 'border-slate-200 hover:border-amber-500/40 hover:shadow-md hover:-translate-y-0.5'}`}
              >
                <button
                  onClick={() => toggleFAQ(idx)} // trigger
                  className={`w-full p-6 px-8 text-left flex items-center justify-between gap-4 focus:outline-none transition-colors duration-300 ${isOpen ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'}`}
                >
                  <h3 className={`font-semibold text-sm md:text-base transition-all duration-300 transform ${isOpen ? 'text-[#0a192f] translate-x-1' : 'text-slate-700 group-hover/faq:text-[#0a192f] group-hover/faq:translate-x-1'
                    }`}>
                    {faq.question}
                  </h3>
                  <span className={`p-2 rounded-full shrink-0 transition-all duration-500 flex items-center justify-center ${isOpen ? 'bg-[#0a192f] text-white rotate-45 shadow-md scale-110' : 'bg-slate-50 text-slate-400 group-hover/faq:bg-amber-100 group-hover/faq:text-amber-600 group-hover/faq:scale-110'
                    }`}>
                    <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-8 py-6 pt-4 text-sm md:text-base text-slate-700 leading-loose font-medium bg-white whitespace-pre-wrap">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-10 px-4 bg-slate-50 rounded border border-slate-100 text-sm font-semibold text-slate-400">
              Tiada Soalan Lazim ditemui pada masa ini.
            </div>
          )}
        </div>

        {/* Additional Help CTA */}
        <div className="mt-12 rounded-xl p-6 md:p-8 relative overflow-hidden group shadow-md border border-slate-800">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] z-0"></div>
          
          {/* Subtle Accent Glow */}
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/20 blur-[40px] rounded-full z-0 group-hover:bg-amber-500/30 transition-colors duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5 text-center md:text-left w-full">
              <div className="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <h4 className="font-black text-white text-base md:text-lg tracking-wide uppercase mb-1 md:mt-0.5">
                  Masih Mempunyai Soalan?
                </h4>
                <p className="text-slate-300 text-xs md:text-sm">
                  Pasukan sokongan kami sentiasa bersedia untuk membantu anda dengan maklumat lanjut.
                </p>
              </div>
            </div>
            
            <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <Link
                href={route('hubungi-kami')}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a192f] rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                Hubungi Kami
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
