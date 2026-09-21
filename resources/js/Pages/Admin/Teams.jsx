// --1. imports--
import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Flag,
    MapPin,
    Plus,
    Search
} from 'lucide-react';

// --2. properties--
const SECTIONS = [
    { id: 'national', label: 'National Teams', icon: Flag },
    { id: 'states', label: 'State Affiliates', icon: MapPin }
];

// --3. main component--
export default function Teams() {
    // --4. actions--
    const [activeSection, setActiveSection] = useState('national'); // state
    const [hoveredSection, setHoveredSection] = useState(null); // state
    const [searchQuery, setSearchQuery] = useState(''); // state
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 }); // state

    const sectionRefs = useRef({}); // properties

    // update sliding indicator
    useEffect(() => {
        const targetId = hoveredSection || activeSection;
        const currentRef = sectionRefs.current[targetId];
        if (currentRef) {
            setIndicatorStyle({
                left: currentRef.offsetLeft,
                width: currentRef.offsetWidth,
                opacity: 1,
            });
        }
    }, [activeSection, hoveredSection]);

    // --5. UI--
    return (
        <AdminLayout title="Manage Teams - MESF Admin">
            <Head title="Manage Teams - Admin" />

            <div className="space-y-8 max-w-7xl">
                {/* section switcher tabs with sliding indicator */}
                <div
                    className="relative flex items-center gap-8 border-b border-white/10 text-sm scrollbar-none pt-1"
                    onMouseLeave={() => setHoveredSection(null)} // toggle
                >
                    {SECTIONS.map((section) => {
                        const isSelected = activeSection === section.id;
                        const isHovered = hoveredSection === section.id;
                        const IconComponent = section.icon;

                        return (
                            <button
                                key={section.id}
                                ref={(el) => (sectionRefs.current[section.id] = el)} // properties
                                type="button"
                                onClick={() => setActiveSection(section.id)} // toggle
                                onMouseEnter={() => setHoveredSection(section.id)} // toggle
                                className={`relative pb-3.5 text-xs sm:text-sm tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${isSelected
                                    ? 'text-amber-400 font-semibold'
                                    : isHovered
                                        ? 'text-white'
                                        : 'text-slate-400 font-normal hover:text-white'
                                    }`}
                            >
                                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                                <span>{section.label}</span>
                            </button>
                        );
                    })}

                    {/* continuous sliding glowing underline indicator */}
                    <span
                        className="absolute -bottom-[1px] h-[1.5px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_6px_rgba(251,191,36,0.5)] pointer-events-none"
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`,
                            opacity: indicatorStyle.opacity,
                        }}
                    />
                </div>

                {/* search bar */}
                <div className="p-4 rounded-2xl bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 shadow-xl">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery} // state
                            onChange={(e) => setSearchQuery(e.target.value)} // trigger
                            placeholder={activeSection === 'national' ? 'Search national teams, titles, tags...' : 'Search state associations, territories...'}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                        />
                    </div>
                </div>

                {/* SECTION 1: NATIONAL TEAMS */}
                {activeSection === 'national' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                <Flag className="w-8 h-8" />
                            </div>

                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    National Teams Section
                                </h3>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 text-amber-400" />
                                    <span>Create First National Team</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECTION 2: STATE AFFILIATES */}
                {activeSection === 'states' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                                <MapPin className="w-8 h-8" />
                            </div>

                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    State Affiliates Section
                                </h3>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 text-amber-400" />
                                    <span>Create First State Affiliate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
