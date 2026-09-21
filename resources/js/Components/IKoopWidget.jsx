// --1. imports--
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// --2. main component--
export default function IKoopWidget() {
    const [isOpen, setIsOpen] = useState(false); // state
    const [mounted, setMounted] = useState(false); // state

    useEffect(() => {
        setMounted(true);
    }, []);

    // --3. UI--
    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)} // toggle
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-[60] bg-white py-2 pl-2 pr-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-200 rounded-l-2xl group flex flex-col items-center justify-center hover:pr-2.5 transition-all duration-300 ${isOpen ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}
            >
                <div className="w-8 h-8 bg-[#0a192f] rounded-full flex items-center justify-center text-white shadow-sm">
                    {/* Portal/Laptop Icon */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 18H5V6H19M21 4H3C1.89 4 1 4.89 1 6V18C1 19.11 1.89 20 3 20H7V22H17V20H21C22.11 20 23 19.11 23 18V6C23 4.89 22.11 4 21 4Z" />
                    </svg>
                </div>
            </button>

            {/* Modal Overlay / Popover via Portal */}
            {mounted && createPortal(
                <>
                    {/* Blurry overlay for click-away */}
                    <div 
                        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                        onClick={() => setIsOpen(false)} // toggle
                    ></div>
                    
                    {/* Side Panel */}
                    <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-[60] bg-[#0a192f] text-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-800 w-[260px] overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}>
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                            <div className="relative z-10 border-b border-slate-800 pb-2 w-full flex justify-between items-center">
                                <h3 className="text-sm font-black text-amber-400 tracking-wide uppercase flex items-center gap-2">
                                    iKOOP PORTAL
                                </h3>
                                <button 
                                    onClick={() => setIsOpen(false)} // toggle
                                    className="relative z-10 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 pt-0">
                            <div className="flex flex-col gap-4 bg-black/15 p-4 rounded border border-slate-800/80 items-center text-center">
                                <img
                                    src="https://kopmedia.my/theme/koop/images/Final_Logo_KOPMPB.jpg"
                                    alt="iKoop"
                                    className="w-16 h-16 object-contain rounded-md border border-slate-800/60 shadow-xs bg-white p-1 shrink-0"
                                />
                                <div>
                                    <span className="text-[10px] text-red-400 font-extrabold bg-red-950/80 border border-red-900/60 px-3 py-1 rounded-full uppercase tracking-wider">Akan Datang</span>
                                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed font-semibold">Sistem Koperasi kewangan bagi Pembiayaan Peribadi, Pelaburan, Takaful, Insuran dan Daftar Anggota Koperasi Company Name Kembali</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
