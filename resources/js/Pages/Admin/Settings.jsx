// --1. imports--
import { Head, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Building2,
    Share2,
    UploadCloud,
    Camera,
    Check,
    Copy,
    Save,
    Image as ImageIcon,
    Mail,
    Phone,
    MapPin,
    Map,
    Globe,
    Trash2,
    ExternalLink,
    AlertCircle,
    AlertTriangle,
    X,
    Layers,
    Users,
    Plus,
    RotateCcw,
    Shield,
    BookOpen,
    Eye,
    EyeOff
} from 'lucide-react';

// --2. properties--
const MALAYSIA_STATES = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Perak',
    'Perlis',
    'Penang',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
    'Kuala Lumpur',
    'Putrajaya',
    'Labuan'
];

const CATEGORY_TABS = [
    { id: 'all', label: 'All' },
    { id: 'general', label: 'General' },
    { id: 'branding', label: 'Branding' },
    { id: 'sliders', label: 'Hero Sliders' },
    { id: 'about', label: 'About & Committee' },
    { id: 'contact', label: 'Contact' },
    { id: 'address', label: 'Address' },
    { id: 'social', label: 'Social Media' },
];

const DEFAULT_EXECUTIVE_SECTIONS = [
    {
        id: 'leadership',
        sectionTitle: 'Executive Leadership',
        members: [
            { id: 'naim', name: 'Muhammad Naim Al-Amin', title: 'President', contact: 'naim@mesf.my' },
            { id: 'afiq', name: 'Afiq Fadhli', title: 'Deputy President', contact: 'afiq@mesf.my' }
        ]
    },
    {
        id: 'vice_presidents',
        sectionTitle: 'Vice Presidents',
        members: [
            { id: 'khir', name: 'Mohamad Khir', title: 'Vice President 1', contact: 'khir@mesf.my' },
            { id: 'faries', name: 'Faries Faizal', title: 'Vice President 2', contact: 'faries@mesf.my' },
            { id: 'zatul', name: 'Dr. Zatul Iffah', title: 'Vice President Women', contact: 'drzatul@mesf.my' },
            { id: 'muzakkir', name: 'Muzakkir', title: 'Vice President Youth', contact: 'muzakkir@mesf.my' }
        ]
    },
    {
        id: 'secretariat',
        sectionTitle: 'Secretary & Administration',
        members: [
            { id: 'syed', name: 'Syed Fakrurrozi', title: 'Secretary General', contact: 'syed@mesf.my' },
            { id: 'hakimi', name: 'Alif Hakimi', title: 'Asst. Secretary General', contact: 'hakimi@mesf.my' },
            { id: 'shahrul', name: 'Shahrul Nizam', title: 'Treasurer', contact: 'shahrul@mesf.my' },
            { id: 'azrai', name: 'Azrai Abdul Aziz', title: 'Chief Communication', contact: 'azrai@mesf.my' }
        ]
    }
];

const DEFAULT_GENERAL_COMMITTEE = [
    { id: 'adib', name: 'Adib', title: 'Committee', contact: 'adib@mesf.my' },
    { id: 'akbar', name: 'Akbar', title: 'Committee', contact: 'akbar@mesf.my' },
    { id: 'akif', name: 'Akif', title: 'Committee', contact: 'contact@mesf.my' },
    { id: 'alex', name: 'Alex', title: 'Committee', contact: 'alex@mesf.my' },
    { id: 'azza', name: 'Azza', title: 'Committee', contact: 'azzarizal@mesf.my' },
    { id: 'chucky', name: 'Chucky', title: 'Committee', contact: 'cheoh@mesf.my' },
    { id: 'dr-yew', name: 'Dr. Yew', title: 'Committee', contact: 'dryew@mesf.my' },
    { id: 'eugene', name: 'Eugene', title: 'Committee', contact: 'eugene@mesf.my' },
    { id: 'husyin', name: 'Husyin', title: 'Committee', contact: 'husyin@mesf.my' },
    { id: 'joker', name: 'Joker', title: 'Committee', contact: 'jokerlai@mesf.my' },
    { id: 'kymie', name: 'Kymie', title: 'Committee', contact: 'kymie@mesf.my' },
    { id: 'luqman', name: 'Luqman', title: 'Committee', contact: 'luqman@mesf.my' },
    { id: 'razak', name: 'Razak', title: 'Committee', contact: 'razak@mesf.my' },
    { id: 'shahril', name: 'Shahril', title: 'Committee', contact: 'shahril@mesf.my' },
    { id: 'syahrul', name: 'Syahrul', title: 'Committee', contact: 'syahrul@mesf.my' },
    { id: 'thariq', name: 'Thariq', title: 'Committee', contact: 'thariq@mesf.my' }
];

const DEFAULT_ABOUT_STORY = `<p>Malaysia Esports Federation or MESF is a national-level sports association registered with the Malaysian Sports Commissioner under the Sports Development Act 1997 with registration number 7402/2014 and is an affiliate of the International Esports Federation (IeSF) &amp; the Asian Electronic Sports Federation (AESF).</p><p>MESF had its registration confirmed on 4th December 2014 to respond to the government’s call through the Ministry of Youth and Sports (KBS) to make sports a catalyst for the development of human capital and industry that can generate the nation’s economic growth.</p><p>MESF acts as the custodian of all esports related activities in Malaysia with the aim of developing, encouraging and promoting esports to all levels as well as planning the development of athletes, officials, coaches and unearthing new talents to represent Malaysia in any esports competition at the international level.</p>`;

const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'clean']
    ]
};

const QUILL_FORMATS = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list',
    'link'
];

const parseJsonSetting = (raw, fallback) => {
    if (!raw) return fallback;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') return raw;
    try {
        const parsed = JSON.parse(raw);
        return parsed && (Array.isArray(parsed) ? parsed.length > 0 : true) ? parsed : fallback;
    } catch (e) {
        return fallback;
    }
};

const getSafeImageUrl = (url, fallback) => {
    if (!url || typeof url !== 'string' || url === '[object Object]' || url === '[object File]' || url.trim() === '') {
        return fallback;
    }
    return url;
};

const getEmbedMapSrc = (input) => {
    if (!input || typeof input !== 'string') return '';
    const trimmed = input.trim();
    if (trimmed.includes('<iframe')) {
        const match = trimmed.match(/src=["']([^"']+)["']/i);
        return match ? match[1] : '';
    }
    return trimmed;
};

// --3. main component--
export default function Settings({ settings = {}, sliders = [] }) {
    const [activeTab, setActiveTab] = useState('all'); // state
    const [hoveredTab, setHoveredTab] = useState(null); // state
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 }); // state
    const [isSaving, setIsSaving] = useState(false); // state
    const [showSuccessToast, setShowSuccessToast] = useState(false); // state
    const [copiedField, setCopiedField] = useState(false); // state
    const [confirmModal, setConfirmModal] = useState({ // state
        isOpen: false,
        title: 'Are you sure?',
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete',
        onConfirm: () => {}
    });

    const logoInputRef = useRef(null); // properties
    const bannerInputRef = useRef(null); // properties
    const sliderFileInputRef = useRef(null); // properties
    const tabRefs = useRef({}); // properties

    const [logoFile, setLogoFile] = useState(null); // state
    const [bannerFile, setBannerFile] = useState(null); // state

    const [newSliderFile, setNewSliderFile] = useState(null); // state
    const [newSliderPreview, setNewSliderPreview] = useState(''); // state
    const [newSliderTitle, setNewSliderTitle] = useState(''); // state
    const [newSliderSortOrder, setNewSliderSortOrder] = useState(0); // state
    const [isUploadingSlider, setIsUploadingSlider] = useState(false); // state

    const [formData, setFormData] = useState({
        orgName: settings?.orgName || '',
        orgAcronym: settings?.orgAcronym || '',
        tagline: settings?.tagline || '',
        rosNumber: settings?.rosNumber || '',
        replyEmail: settings?.replyEmail || '',
        supportEmail: settings?.supportEmail || '',
        phone: settings?.phone || '',
        fax: settings?.fax || '',
        streetAddress: settings?.streetAddress || '',
        city: settings?.city || '',
        state: settings?.state || 'Kuala Lumpur',
        postalCode: settings?.postalCode || '',
        country: settings?.country || 'Malaysia',
        googleMapEmbed: settings?.googleMapEmbed || settings?.contact_map_url || '',
        websiteUrl: settings?.websiteUrl || '',
        facebook: settings?.facebook || '',
        facebookHandle: settings?.facebookHandle || '',
        instagram: settings?.instagram || '',
        instagramHandle: settings?.instagramHandle || '',
        tiktok: settings?.tiktok || '',
        tiktokHandle: settings?.tiktokHandle || '',
        youtube: settings?.youtube || '',
        youtubeHandle: settings?.youtubeHandle || '',
        iesfUrl: settings?.iesfUrl || '',
        iesfHandle: settings?.iesfHandle || '',
        xUrl: settings?.xUrl || settings?.twitter || '',
        xHandle: settings?.xHandle || settings?.twitterHandle || '',
        logoUrl: getSafeImageUrl(settings?.logoUrl, '/images/mesf_logo.png'),
        bannerUrl: getSafeImageUrl(settings?.bannerUrl, '/images/mesf_bg_v2.jpg'),
        aboutHeroSubtitle: settings?.aboutHeroSubtitle || 'Official national governing body registered under the Sports Development Act 1997, overseeing electronic sports across Malaysia.',
        aboutStoryHtml: settings?.aboutStoryHtml || (settings?.aboutStoryP1 ? `<p>${settings.aboutStoryP1}</p><p>${settings.aboutStoryP2 || ''}</p><p>${settings.aboutStoryP3 || ''}</p>` : DEFAULT_ABOUT_STORY),
        executiveSections: parseJsonSetting(settings?.executiveSections, DEFAULT_EXECUTIVE_SECTIONS),
        generalCommittee: parseJsonSetting(settings?.generalCommittee, DEFAULT_GENERAL_COMMITTEE),
    }); // state

    // update sliding indicator position
    useEffect(() => { // trigger
        const currentTargetId = hoveredTab || activeTab; // properties
        const element = tabRefs.current[currentTargetId]; // properties
        if (element) { // check
            setIndicatorStyle({ // save
                left: element.offsetLeft,
                width: element.offsetWidth,
                opacity: 1
            });
        }
    }, [activeTab, hoveredTab]);

    // --4. actions--
    const handleSliderFileSelect = (e) => { // trigger
        const file = e.target.files?.[0]; // input
        if (file) { // check
            setNewSliderFile(file); // save
            setNewSliderPreview(URL.createObjectURL(file)); // convert
        }
    };

    const handleCreateSlider = (e) => { // trigger
        if (e) e.preventDefault(); // check
        if (!newSliderFile) return; // check
        setIsUploadingSlider(true); // toggle

        const payload = new FormData(); // convert
        payload.append('image', newSliderFile); // save
        if (newSliderTitle) payload.append('title', newSliderTitle); // save
        payload.append('sort_order', newSliderSortOrder); // save

        router.post(route('admin.sliders.store'), payload, { // redirect
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { // trigger
                setIsUploadingSlider(false); // toggle
                setNewSliderFile(null); // save
                setNewSliderPreview(''); // save
                setNewSliderTitle(''); // save
                setNewSliderSortOrder(0); // save
                if (sliderFileInputRef.current) sliderFileInputRef.current.value = ''; // save
            },
            onError: () => { // error
                setIsUploadingSlider(false); // toggle
            }
        });
    };

    const handleToggleSliderStatus = (slider) => { // trigger
        router.patch(route('admin.sliders.status', slider.id), { // redirect
            is_active: !slider.is_active // convert
        }, {
            preserveScroll: true
        });
    };

    const handleDeleteSlider = (slider) => { // trigger
        askConfirmation({
            title: 'Delete Slider?',
            message: `Are you sure you want to delete "${slider.title || 'this slider'}"?`,
            confirmLabel: 'Delete Slider',
            onConfirm: () => { // trigger
                router.delete(route('admin.sliders.destroy', slider.id), { // redirect
                    preserveScroll: true
                });
            }
        });
    };

    const askConfirmation = ({ title = 'Are you sure?', message, confirmLabel = 'Delete', onConfirm }) => { // trigger
        setConfirmModal({ // save
            isOpen: true,
            title,
            message: message || 'Are you sure you want to proceed?',
            confirmLabel,
            onConfirm: () => { // trigger
                onConfirm(); // trigger
                setConfirmModal(prev => ({ ...prev, isOpen: false })); // toggle
            }
        });
    };

    const handleInputChange = (field, value) => { // trigger
        setFormData(prev => ({ ...prev, [field]: value })); // save
    };

    const handleUpdateExecMember = (secIdx, memIdx, field, val) => { // trigger
        setFormData(prev => { // save
            const updated = [...prev.executiveSections]; // convert
            updated[secIdx] = {
                ...updated[secIdx],
                members: [...updated[secIdx].members]
            };
            updated[secIdx].members[memIdx] = {
                ...updated[secIdx].members[memIdx],
                [field]: val
            };
            return { ...prev, executiveSections: updated }; // save
        });
    };

    const handleAddExecMember = (secIdx) => { // trigger
        setFormData(prev => { // save
            const updated = [...prev.executiveSections]; // convert
            const newMember = {
                id: `exec_${Date.now()}`,
                name: 'New Member',
                title: 'Executive Officer',
                contact: 'member@mesf.my',
                phone: ''
            };
            updated[secIdx] = {
                ...updated[secIdx],
                members: [...updated[secIdx].members, newMember]
            };
            return { ...prev, executiveSections: updated }; // save
        });
    };

    const handleDeleteExecMember = (secIdx, memIdx) => { // trigger
        const memberName = formData.executiveSections[secIdx]?.members[memIdx]?.name || 'this member';
        askConfirmation({
            title: 'Are you sure?',
            message: `Are you sure you want to delete ${memberName} from leadership?`,
            confirmLabel: 'Delete Member',
            onConfirm: () => {
                setFormData(prev => { // save
                    const updated = [...prev.executiveSections]; // convert
                    updated[secIdx] = {
                        ...updated[secIdx],
                        members: updated[secIdx].members.filter((_, i) => i !== memIdx)
                    };
                    return { ...prev, executiveSections: updated }; // save
                });
            }
        });
    };

    const handleUpdateGenMember = (memIdx, field, val) => { // trigger
        setFormData(prev => { // save
            const updated = [...prev.generalCommittee]; // convert
            updated[memIdx] = {
                ...updated[memIdx],
                [field]: val
            };
            return { ...prev, generalCommittee: updated }; // save
        });
    };

    const handleAddGenMember = () => { // trigger
        setFormData(prev => { // save
            const newMember = {
                id: `gen_${Date.now()}`,
                name: 'New Committee Member',
                title: 'Committee',
                contact: 'committee@mesf.my',
                phone: ''
            };
            return {
                ...prev,
                generalCommittee: [...prev.generalCommittee, newMember] // save
            };
        });
    };

    const handleDeleteGenMember = (memIdx) => { // trigger
        const memberName = formData.generalCommittee[memIdx]?.name || 'this member';
        askConfirmation({
            title: 'Are you sure?',
            message: `Are you sure you want to delete ${memberName} from the general committee?`,
            confirmLabel: 'Delete Member',
            onConfirm: () => {
                setFormData(prev => ({
                    ...prev,
                    generalCommittee: prev.generalCommittee.filter((_, i) => i !== memIdx) // save
                }));
            }
        });
    };

    const handleResetCommittee = () => { // trigger
        askConfirmation({
            title: 'Are you sure?',
            message: 'Are you sure you want to reset executive and general committee members to the default official structure? Any custom member additions will be restored.',
            confirmLabel: 'Reset Defaults',
            onConfirm: () => {
                setFormData(prev => ({
                    ...prev,
                    executiveSections: DEFAULT_EXECUTIVE_SECTIONS, // save
                    generalCommittee: DEFAULT_GENERAL_COMMITTEE // save
                }));
            }
        });
    };

    const handleLogoUpload = (e) => { // trigger
        const file = e.target.files?.[0]; // input
        if (file) { // check
            setLogoFile(file); // save
            const previewUrl = URL.createObjectURL(file); // convert
            setFormData(prev => ({ ...prev, logoUrl: previewUrl })); // save
        }
    };

    const handleBannerUpload = (e) => { // trigger
        const file = e.target.files?.[0]; // input
        if (file) { // check
            setBannerFile(file); // save
            const previewUrl = URL.createObjectURL(file); // convert
            setFormData(prev => ({ ...prev, bannerUrl: previewUrl })); // save
        }
    };

    const handleRemoveLogo = () => { // trigger
        askConfirmation({
            title: 'Are you sure?',
            message: 'Are you sure you want to remove the organization logo? The default MESF logo will be displayed instead.',
            confirmLabel: 'Remove Logo',
            onConfirm: () => {
                setLogoFile(null); // save
                setFormData(prev => ({ ...prev, logoUrl: '' })); // save
            }
        });
    };

    const handleRemoveBanner = () => { // trigger
        askConfirmation({
            title: 'Are you sure?',
            message: 'Are you sure you want to remove the cover banner image?',
            confirmLabel: 'Remove Banner',
            onConfirm: () => {
                setBannerFile(null); // save
                setFormData(prev => ({ ...prev, bannerUrl: '' })); // save
            }
        });
    };

    const handleCopyInfo = () => { // trigger
        const infoString = `${formData.orgName || 'N/A'} (${formData.orgAcronym || 'N/A'})\n${formData.replyEmail || 'N/A'}\n${formData.phone || 'N/A'}\n${formData.streetAddress || ''}, ${formData.postalCode || ''} ${formData.city || ''}, ${formData.state || ''}, ${formData.country || 'Malaysia'}`; // convert
        navigator.clipboard.writeText(infoString); // save
        setCopiedField(true); // toggle
        setTimeout(() => setCopiedField(false), 2000); // clock
    };

    const handleSave = (e) => { // trigger
        e.preventDefault(); // check
        setIsSaving(true); // toggle

        const payload = {}; // save
        Object.keys(formData).forEach(key => { // trigger
            if (key === 'logoUrl') { // check
                if (logoFile) payload.logoFile = logoFile; // save
                else if (formData.logoUrl && !formData.logoUrl.startsWith('blob:')) payload.logoUrl = formData.logoUrl; // save
            } else if (key === 'bannerUrl') { // check
                if (bannerFile) payload.bannerFile = bannerFile; // save
                else if (formData.bannerUrl && !formData.bannerUrl.startsWith('blob:')) payload.bannerUrl = formData.bannerUrl; // save
            } else if (key === 'executiveSections' || key === 'generalCommittee') { // check
                payload[key] = JSON.stringify(formData[key]); // convert
            } else {
                payload[key] = formData[key]; // save
            }
        });

        router.post(route('admin.settings.update'), payload, { // redirect
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { // trigger
                setIsSaving(false); // toggle
                setShowSuccessToast(true); // toggle
                setTimeout(() => setShowSuccessToast(false), 4000); // clock
            },
            onError: () => { // error
                setIsSaving(false); // toggle
            }
        });
    };

    // --5. UI--
    return (
        <AdminLayout title="Settings - MESF">
            <Head>
                <title>Settings - Admin</title>
                <style>{`
                    .quill-dark-wrapper .ql-toolbar.ql-snow {
                        background: #090D18;
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-top-left-radius: 1rem;
                        border-top-right-radius: 1rem;
                        padding: 10px 14px;
                    }
                    .quill-dark-wrapper .ql-container.ql-snow {
                        background: #070B14;
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-top: none;
                        border-bottom-left-radius: 1rem;
                        border-bottom-right-radius: 1rem;
                        font-family: inherit;
                        font-size: 0.875rem;
                        color: #f1f5f9;
                        min-height: 260px;
                    }
                    .quill-dark-wrapper .ql-editor {
                        min-height: 260px;
                        line-height: 1.75;
                        padding: 16px 18px;
                    }
                    .quill-dark-wrapper .ql-editor p {
                        margin-bottom: 1rem;
                        line-height: 1.75;
                    }
                    .quill-dark-wrapper .ql-editor p:last-child {
                        margin-bottom: 0;
                    }
                    .quill-dark-wrapper .ql-editor.ql-blank::before {
                        color: #64748b;
                        font-style: normal;
                        left: 18px;
                    }
                    .quill-dark-wrapper .ql-snow .ql-stroke {
                        stroke: #94a3b8;
                    }
                    .quill-dark-wrapper .ql-snow .ql-fill {
                        fill: #94a3b8;
                    }
                    .quill-dark-wrapper .ql-snow .ql-picker {
                        color: #94a3b8;
                    }
                    .quill-dark-wrapper .ql-snow .ql-picker-options {
                        background-color: #0D1322;
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 0.75rem;
                        padding: 6px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    }
                    .quill-dark-wrapper .ql-snow .ql-picker-item {
                        color: #94a3b8;
                    }
                    .quill-dark-wrapper .ql-snow .ql-picker-item:hover,
                    .quill-dark-wrapper .ql-snow .ql-picker-item.ql-selected {
                        color: #fbbf24;
                    }
                    .quill-dark-wrapper .ql-snow button:hover .ql-stroke,
                    .quill-dark-wrapper .ql-snow button.ql-active .ql-stroke,
                    .quill-dark-wrapper .ql-snow .ql-picker-label:hover .ql-stroke,
                    .quill-dark-wrapper .ql-snow .ql-picker-label.ql-active .ql-stroke {
                        stroke: #fbbf24;
                    }
                    .quill-dark-wrapper .ql-snow button:hover .ql-fill,
                    .quill-dark-wrapper .ql-snow button.ql-active .ql-fill,
                    .quill-dark-wrapper .ql-snow .ql-picker-label:hover .ql-fill,
                    .quill-dark-wrapper .ql-snow .ql-picker-label.ql-active .ql-fill {
                        fill: #fbbf24;
                    }
                `}</style>
            </Head>

            <div className="space-y-8 max-w-7xl pb-16">
                {/* toast notification */}
                {showSuccessToast && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold">
                                Settings saved successfully.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowSuccessToast(false)} // toggle
                            className="text-emerald-400 hover:text-emerald-200 text-xs font-bold px-2 py-1 cursor-pointer"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* category filter tabs at very top */}
                <div
                    className="relative flex items-center gap-7 overflow-x-auto border-b border-white/10 text-sm scrollbar-none pt-1"
                    onMouseLeave={() => setHoveredTab(null)} // toggle
                >
                    {CATEGORY_TABS.map((tab) => {
                        const isSelected = activeTab === tab.id;
                        const isHovered = hoveredTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                ref={(el) => (tabRefs.current[tab.id] = el)} // properties
                                type="button"
                                onClick={() => setActiveTab(tab.id)} // toggle
                                onMouseEnter={() => setHoveredTab(tab.id)} // toggle
                                className={`relative pb-3.5 text-xs sm:text-sm tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer ${isSelected
                                    ? 'text-amber-400 font-semibold'
                                    : isHovered
                                        ? 'text-white'
                                        : 'text-slate-400 font-normal hover:text-white'
                                    }`}
                            >
                                <span>{tab.label}</span>
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

                {/* main form card */}
                <form onSubmit={handleSave} className="bg-[#090D18]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">

                    {/* basic info header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
                        <div>
                            <h2 className="text-base font-bold text-white tracking-wide">
                                General Details
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Update organization and website information.
                            </p>
                        </div>
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                        >
                            <span>Live Website</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* 1. logo */}
                    {(activeTab === 'all' || activeTab === 'branding') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label className="text-sm font-bold text-white">Logo</label>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Main logo shown on top header and sidebar.
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    (Recommended: 800 × 800px)
                                </p>
                            </div>

                            <div className="md:col-span-8 flex items-center gap-5">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-2xl bg-[#070B14] border border-white/15 flex items-center justify-center overflow-hidden shadow-inner p-2.5">
                                        {formData.logoUrl ? (
                                            <img
                                                src={getSafeImageUrl(formData.logoUrl, '/images/mesf_logo.png')}
                                                alt="Logo Preview"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = '/images/mesf_logo.png';
                                                }}
                                            />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-slate-400" />
                                        )}
                                    </div>

                                    {formData.logoUrl && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo} // trigger
                                            title="Delete Logo"
                                            className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md transition-all cursor-pointer"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        ref={logoInputRef} // properties
                                        onChange={handleLogoUpload} // trigger
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()} // trigger
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                                    >
                                        <Camera className="w-4 h-4 text-amber-400" />
                                        Replace Logo
                                    </button>
                                    <p className="text-[11px] text-slate-400">
                                        PNG, JPG, SVG or WEBP (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. cover banner */}
                    {(activeTab === 'all' || activeTab === 'branding') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label className="text-sm font-bold text-white">Cover Banner</label>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Hero background and preview banner image.
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    (Recommended: 1200 × 630px)
                                </p>
                            </div>

                            <div className="md:col-span-8 space-y-3">
                                <input
                                    type="file"
                                    ref={bannerInputRef} // properties
                                    onChange={handleBannerUpload} // trigger
                                    accept="image/*"
                                    className="hidden"
                                />

                                {formData.bannerUrl ? (
                                    <div className="space-y-3">
                                        <div className="relative rounded-2xl overflow-hidden border border-white/15 aspect-[21/9] max-h-56 group bg-[#070B14]">
                                            <img
                                                src={getSafeImageUrl(formData.bannerUrl, '/images/mesf_bg_v2.jpg')}
                                                alt="Cover Banner"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = '/images/mesf_bg_v2.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => bannerInputRef.current?.click()} // trigger
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                                            >
                                                <Camera className="w-4 h-4 text-amber-400" />
                                                Replace Banner
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRemoveBanner} // trigger
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => bannerInputRef.current?.click()} // trigger
                                        className="border-2 border-dashed border-white/20 hover:border-amber-400/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white/[0.02] hover:bg-amber-400/[0.03] transition-all cursor-pointer text-center"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">
                                                <span className="text-amber-300 hover:underline">Click to upload banner</span> or drag and drop
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                PNG, JPG, or WEBP (Max 10MB)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. hero sliders management */}
                    {(activeTab === 'all' || activeTab === 'sliders') && (
                        <div className="pb-8 border-b border-white/10 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide">
                                        Hero Sliders
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Upload and manage rotating banner slides featured on the public homepage carousel.
                                    </p>
                                </div>
                                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 w-fit">
                                    {sliders.length} {sliders.length === 1 ? 'Slide' : 'Slides'} Total
                                </span>
                            </div>

                            {/* add new slider card */}
                            <div className="rounded-2xl bg-[#070B14] border border-white/10 p-4 sm:p-5 space-y-4">
                                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                    Add New Slide
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                    {/* image selector */}
                                    <div className="lg:col-span-5 space-y-2">
                                        <input
                                            type="file"
                                            ref={sliderFileInputRef} // properties
                                            onChange={handleSliderFileSelect} // trigger
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        {newSliderPreview ? (
                                            <div className="relative rounded-xl overflow-hidden border border-white/20 aspect-[16/9] bg-black/40 group">
                                                <img
                                                    src={newSliderPreview}
                                                    alt="New Slide Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewSliderFile(null); // save
                                                        setNewSliderPreview(''); // save
                                                        if (sliderFileInputRef.current) sliderFileInputRef.current.value = ''; // save
                                                    }} // trigger
                                                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow transition-all cursor-pointer"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => sliderFileInputRef.current?.click()} // trigger
                                                className="border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-white/[0.01] hover:bg-amber-400/[0.02] transition-all cursor-pointer text-center aspect-[16/9]"
                                            >
                                                <UploadCloud className="w-6 h-6 text-amber-400" />
                                                <div className="text-[11px] text-slate-300">
                                                    <span className="text-amber-300 font-semibold hover:underline">Select slide image</span> (PNG, JPG, WEBP)
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* title and sort order */}
                                    <div className="lg:col-span-7 space-y-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Slide Title / Caption (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newSliderTitle} // state
                                                onChange={(e) => setNewSliderTitle(e.target.value)} // trigger
                                                placeholder="e.g. National Esports Championship 2026"
                                                className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs outline-none transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 items-end">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                    Display Order
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={newSliderSortOrder} // state
                                                    onChange={(e) => setNewSliderSortOrder(parseInt(e.target.value) || 0)} // trigger
                                                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs outline-none transition-all font-mono"
                                                />
                                            </div>

                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={handleCreateSlider} // trigger
                                                    disabled={!newSliderFile || isUploadingSlider} // check
                                                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>{isUploadingSlider ? 'Uploading...' : 'Add Slide'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* existing sliders list */}
                            <div className="space-y-3 pt-2">
                                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    Current Sliders ({sliders.length})
                                </div>

                                {sliders.length === 0 ? (
                                    <div className="rounded-2xl border border-white/10 bg-[#070B14]/50 p-6 text-center text-xs text-slate-400">
                                        No slides added yet. Use the form above to add your first hero carousel slide.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {sliders.map((slider) => {
                                            const slideImgUrl = slider.image_path ? (slider.image_path.startsWith('http') || slider.image_path.startsWith('/') ? slider.image_path : `/storage/${slider.image_path}`) : '/images/mesf_bg_v2.jpg'; // convert

                                            return (
                                                <div
                                                    key={slider.id}
                                                    className="group relative rounded-2xl bg-[#070B14] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/25 transition-all shadow-lg"
                                                >
                                                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/50">
                                                        <img
                                                            src={slideImgUrl}
                                                            alt={slider.title || 'Hero Slide'}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = '/images/mesf_bg_v2.jpg';
                                                            }}
                                                        />
                                                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                                            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono font-bold text-white border border-white/15">
                                                                #{slider.sort_order}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm border ${slider.is_active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800/80 text-slate-400 border-white/10'}`}>
                                                                {slider.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-white line-clamp-1">
                                                                {slider.title || 'Untitled Slide'}
                                                            </h4>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleSliderStatus(slider)} // trigger
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${slider.is_active ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'}`}
                                                            >
                                                                {slider.is_active ? (
                                                                    <>
                                                                        <Eye className="w-3 h-3" />
                                                                        <span>Active</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <EyeOff className="w-3 h-3" />
                                                                        <span>Hidden</span>
                                                                    </>
                                                                )}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteSlider(slider)} // trigger
                                                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
                                                                title="Delete Slide"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 4. organization name */}
                    {(activeTab === 'all' || activeTab === 'general') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label htmlFor="orgName" className="text-sm font-bold text-white">
                                    Organization Name
                                </label>
                                <p className="text-xs text-slate-400">
                                    Official federation name.
                                </p>
                            </div>

                            <div className="md:col-span-8">
                                <input
                                    id="orgName"
                                    type="text"
                                    value={formData.orgName} // state
                                    onChange={(e) => handleInputChange('orgName', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* 4. acronym & reg number */}
                    {(activeTab === 'all' || activeTab === 'general') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label htmlFor="orgAcronym" className="text-sm font-bold text-white">
                                    Acronym & Registration
                                </label>
                                <p className="text-xs text-slate-400">
                                    Short code and sports registration number.
                                </p>
                            </div>

                            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="orgAcronym" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Short Name / Acronym
                                    </label>
                                    <input
                                        id="orgAcronym"
                                        type="text"
                                        value={formData.orgAcronym} // state
                                        onChange={(e) => handleInputChange('orgAcronym', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all font-mono"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rosNumber" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Registration No.
                                    </label>
                                    <input
                                        id="rosNumber"
                                        type="text"
                                        value={formData.rosNumber} // state
                                        onChange={(e) => handleInputChange('rosNumber', e.target.value)} // trigger
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. tagline */}
                    {(activeTab === 'all' || activeTab === 'general') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label htmlFor="tagline" className="text-sm font-bold text-white">
                                    Tagline
                                </label>
                                <p className="text-xs text-slate-400">
                                    Short slogan shown on website header.
                                </p>
                            </div>

                            <div className="md:col-span-8">
                                <input
                                    id="tagline"
                                    type="text"
                                    value={formData.tagline} // state
                                    onChange={(e) => handleInputChange('tagline', e.target.value)} // trigger
                                    className="w-full px-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* About Us Page Content - Unified Rich Text Box */}
                    {(activeTab === 'all' || activeTab === 'about') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-amber-400" />
                                    <label className="text-sm font-bold text-white">
                                        About Us Content
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Manage the official narrative, mission, and accreditation story. Use bold, italic, colors, lists, and formatting freely.
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Press Return for natural standard paragraph spacing.
                                </p>
                            </div>

                            <div className="md:col-span-8 space-y-5">
                                {/* Hero Banner Subtitle */}
                                <div>
                                    <label htmlFor="aboutHeroSubtitle" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Hero Banner Subtitle
                                    </label>
                                    <input
                                        id="aboutHeroSubtitle"
                                        type="text"
                                        value={formData.aboutHeroSubtitle} // state
                                        onChange={(e) => handleInputChange('aboutHeroSubtitle', e.target.value)} // trigger
                                        placeholder="Official national governing body registered under the Sports Development Act 1997..."
                                        className="w-full px-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs sm:text-sm outline-none transition-all leading-relaxed"
                                    />
                                </div>

                                {/* Single Big Rich Text Box */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            About Us Official Story (Rich Text Editor)
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            Bold • Italic • Colors • Alignment • Lists
                                        </span>
                                    </div>

                                    {/* Dark styled ReactQuill container */}
                                    <div className="quill-dark-wrapper rounded-2xl overflow-hidden shadow-inner">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.aboutStoryHtml} // state
                                            onChange={(val) => handleInputChange('aboutStoryHtml', val)} // trigger
                                            modules={QUILL_MODULES} // properties
                                            formats={QUILL_FORMATS} // properties
                                            placeholder="Write the official About Us narrative..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Executive Leadership & Secretary Sections */}
                    {(activeTab === 'all' || activeTab === 'about') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-amber-400" />
                                    <label className="text-sm font-bold text-white">
                                        Executive Leadership
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Manage President, Vice Presidents, Secretary, and principal office bearers.
                                </p>
                            </div>

                            <div className="md:col-span-8 space-y-6">
                                {formData.executiveSections.map((sec, secIdx) => (
                                    <div key={sec.id || secIdx} className="bg-[#070B14] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xs sm:text-sm font-bold text-white">
                                                    {sec.sectionTitle}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-bold">
                                                    {sec.members.length}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleAddExecMember(secIdx)} // trigger
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Add Member
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            {sec.members.map((member, memIdx) => (
                                                <div
                                                    key={member.id || memIdx}
                                                    className="bg-[#090D18] border border-white/10 hover:border-white/20 rounded-xl p-3.5 space-y-2.5 transition-all relative group"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-[10px] font-black text-amber-300">
                                                                {member.name ? member.name.charAt(0).toUpperCase() : '#'}
                                                            </div>
                                                            <span className="text-[11px] font-bold text-slate-300 truncate">
                                                                Member #{memIdx + 1}
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteExecMember(secIdx, memIdx)} // trigger
                                                            title="Delete Member"
                                                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                                Full Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={member.name || ''} // state
                                                                onChange={(e) => handleUpdateExecMember(secIdx, memIdx, 'name', e.target.value)} // trigger
                                                                className="w-full px-3 py-1.5 rounded-xl bg-[#070B14] border border-white/10 focus:border-amber-400 text-white text-xs outline-none transition-all font-medium"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                                Role / Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={member.title || ''} // state
                                                                onChange={(e) => handleUpdateExecMember(secIdx, memIdx, 'title', e.target.value)} // trigger
                                                                className="w-full px-3 py-1.5 rounded-xl bg-[#070B14] border border-white/10 focus:border-amber-400 text-amber-300 text-xs outline-none transition-all font-medium"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                                    Contact Email
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    placeholder="name@mesf.my"
                                                                    value={member.contact || ''} // state
                                                                    onChange={(e) => handleUpdateExecMember(secIdx, memIdx, 'contact', e.target.value)} // trigger
                                                                    className="w-full px-3 py-1.5 rounded-xl bg-[#070B14] border border-white/10 focus:border-amber-400 text-slate-300 text-xs outline-none transition-all font-mono"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                                    Phone Number
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="+60 12-345 6789"
                                                                    value={member.phone || ''} // state
                                                                    onChange={(e) => handleUpdateExecMember(secIdx, memIdx, 'phone', e.target.value)} // trigger
                                                                    className="w-full px-3 py-1.5 rounded-xl bg-[#070B14] border border-white/10 focus:border-amber-400 text-slate-300 text-xs outline-none transition-all font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General Committee Members */}
                    {(activeTab === 'all' || activeTab === 'about') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-amber-400" />
                                    <label className="text-sm font-bold text-white">
                                        General Committee
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Manage general committee members and council representatives across states.
                                </p>
                            </div>

                            <div className="md:col-span-8 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#070B14] border border-white/10 rounded-2xl p-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xs sm:text-sm font-bold text-white">
                                            Committee Members
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-bold font-mono">
                                            {formData.generalCommittee.length} Members
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleResetCommittee} // trigger
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            Reset Defaults
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAddGenMember} // trigger
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all cursor-pointer shadow-sm shadow-amber-400/20"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Add Member
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {formData.generalCommittee.map((member, memIdx) => (
                                        <div
                                            key={member.id || memIdx}
                                            className="bg-[#070B14] border border-white/10 hover:border-white/20 rounded-xl p-3 space-y-2 transition-all relative"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                                        {memIdx + 1}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
                                                        {member.name || 'Unnamed'}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGenMember(memIdx)} // trigger
                                                    title="Delete Member"
                                                    className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Name"
                                                        value={member.name || ''} // state
                                                        onChange={(e) => handleUpdateGenMember(memIdx, 'name', e.target.value)} // trigger
                                                        className="w-full px-2.5 py-1 rounded-lg bg-[#090D18] border border-white/10 focus:border-amber-400 text-white text-xs outline-none transition-all font-medium"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Role / Title"
                                                        value={member.title || ''} // state
                                                        onChange={(e) => handleUpdateGenMember(memIdx, 'title', e.target.value)} // trigger
                                                        className="w-full px-2.5 py-1 rounded-lg bg-[#090D18] border border-white/10 focus:border-amber-400 text-amber-300 text-[11px] outline-none transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <input
                                                        type="email"
                                                        placeholder="Email"
                                                        value={member.contact || ''} // state
                                                        onChange={(e) => handleUpdateGenMember(memIdx, 'contact', e.target.value)} // trigger
                                                        className="w-full px-2.5 py-1 rounded-lg bg-[#090D18] border border-white/10 focus:border-amber-400 text-slate-300 text-[11px] outline-none transition-all font-mono"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Phone"
                                                        value={member.phone || ''} // state
                                                        onChange={(e) => handleUpdateGenMember(memIdx, 'phone', e.target.value)} // trigger
                                                        className="w-full px-2.5 py-1 rounded-lg bg-[#090D18] border border-white/10 focus:border-amber-400 text-slate-300 text-[11px] outline-none transition-all font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. emails */}
                    {(activeTab === 'all' || activeTab === 'contact') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label htmlFor="replyEmail" className="text-sm font-bold text-white">
                                    Official Emails
                                </label>
                                <p className="text-xs text-slate-400">
                                    Email addresses for public inquiries and helpdesk.
                                </p>
                            </div>

                            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="replyEmail" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        General Inquiries Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            id="replyEmail"
                                            type="email"
                                            value={formData.replyEmail} // state
                                            onChange={(e) => handleInputChange('replyEmail', e.target.value)} // trigger
                                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="supportEmail" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Support Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            id="supportEmail"
                                            type="email"
                                            value={formData.supportEmail} // state
                                            onChange={(e) => handleInputChange('supportEmail', e.target.value)} // trigger
                                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 7. phone & website */}
                    {(activeTab === 'all' || activeTab === 'contact') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label htmlFor="phone" className="text-sm font-bold text-white">
                                    Phone & Website
                                </label>
                                <p className="text-xs text-slate-400">
                                    Office phone number and website link.
                                </p>
                            </div>

                            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phone" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Phone / Hotline Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            id="phone"
                                            type="text"
                                            value={formData.phone} // state
                                            onChange={(e) => handleInputChange('phone', e.target.value)} // trigger
                                            placeholder="+60 3-8000 8000"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="websiteUrl" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Website URL
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            id="websiteUrl"
                                            type="url"
                                            value={formData.websiteUrl} // state
                                            onChange={(e) => handleInputChange('websiteUrl', e.target.value)} // trigger
                                            placeholder="https://mesf.my"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 8. address */}
                    {(activeTab === 'all' || activeTab === 'address') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label className="text-sm font-bold text-white">
                                    HQ Address
                                </label>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Physical office location shown on contact page and footer.
                                </p>
                            </div>

                            <div className="md:col-span-8 space-y-4">
                                <div>
                                    <label htmlFor="streetAddress" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Street Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                        <textarea
                                            id="streetAddress"
                                            rows={4}
                                            value={formData.streetAddress} // state
                                            onChange={(e) => handleInputChange('streetAddress', e.target.value)} // trigger
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all resize-y leading-relaxed"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            City
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            value={formData.city} // state
                                            onChange={(e) => handleInputChange('city', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            State
                                        </label>
                                        <select
                                            id="state"
                                            value={formData.state} // state
                                            onChange={(e) => handleInputChange('state', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all cursor-pointer"
                                        >
                                            {MALAYSIA_STATES.map((st) => (
                                                <option key={st} value={st} className="bg-[#090D18] text-white">
                                                    {st}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="postalCode" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Postal Code
                                        </label>
                                        <input
                                            id="postalCode"
                                            type="text"
                                            value={formData.postalCode} // state
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)} // trigger
                                            className="w-full px-4 py-2.5 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Country
                                        </label>
                                        <input
                                            id="country"
                                            type="text"
                                            value={formData.country} // state
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm outline-none cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Google Maps Embed */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label htmlFor="googleMapEmbed" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Google Maps Embed (URL or &lt;iframe&gt;)
                                        </label>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            Paste iframe or embed link
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Map className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                        <textarea
                                            id="googleMapEmbed"
                                            rows={3}
                                            value={formData.googleMapEmbed} // state
                                            onChange={(e) => handleInputChange('googleMapEmbed', e.target.value)} // trigger
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-xs sm:text-sm font-mono outline-none transition-all resize-y leading-relaxed"
                                        />
                                    </div>

                                    {/* Map live preview */}
                                    {getEmbedMapSrc(formData.googleMapEmbed) ? (
                                        <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 bg-[#070B14] shadow-inner">
                                            <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                                                <span className="font-semibold text-white flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                    Map Live Preview
                                                </span>
                                                <span className="font-mono text-[10px] text-slate-500">Interactive</span>
                                            </div>
                                            <div className="w-full h-48 sm:h-56 relative bg-slate-900">
                                                <iframe
                                                    src={getEmbedMapSrc(formData.googleMapEmbed)}
                                                    title="Google Maps Location Preview"
                                                    className="w-full h-full border-0"
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-slate-500 mt-1.5">
                                            Paste a Google Maps embed URL or iframe code to preview the interactive map.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 9. social media */}
                    {(activeTab === 'all' || activeTab === 'social') && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-white/10">
                            <div className="md:col-span-4 space-y-1">
                                <label className="text-sm font-bold text-white">
                                    Social Media
                                </label>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Official links displayed in the website footer and contact sections.
                                </p>
                            </div>

                            <div className="md:col-span-8 space-y-4">
                                {/* Instagram */}
                                <div className="p-4 rounded-2xl bg-[#090D1A] border border-white/10 space-y-3">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Instagram</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="instagram" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Profile URL
                                            </label>
                                            <input
                                                id="instagram"
                                                type="url"
                                                value={formData.instagram} // state
                                                onChange={(e) => handleInputChange('instagram', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="instagramHandle" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Display Handle / Username
                                            </label>
                                            <input
                                                id="instagramHandle"
                                                type="text"
                                                value={formData.instagramHandle} // state
                                                onChange={(e) => handleInputChange('instagramHandle', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* TikTok */}
                                <div className="p-4 rounded-2xl bg-[#090D1A] border border-white/10 space-y-3">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">TikTok</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="tiktok" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Profile URL
                                            </label>
                                            <input
                                                id="tiktok"
                                                type="url"
                                                value={formData.tiktok} // state
                                                onChange={(e) => handleInputChange('tiktok', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="tiktokHandle" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Display Handle / Username
                                            </label>
                                            <input
                                                id="tiktokHandle"
                                                type="text"
                                                value={formData.tiktokHandle} // state
                                                onChange={(e) => handleInputChange('tiktokHandle', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Facebook */}
                                <div className="p-4 rounded-2xl bg-[#090D1A] border border-white/10 space-y-3">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Facebook</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="facebook" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Page URL
                                            </label>
                                            <input
                                                id="facebook"
                                                type="url"
                                                value={formData.facebook} // state
                                                onChange={(e) => handleInputChange('facebook', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="facebookHandle" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Display Name / Handle
                                            </label>
                                            <input
                                                id="facebookHandle"
                                                type="text"
                                                value={formData.facebookHandle} // state
                                                onChange={(e) => handleInputChange('facebookHandle', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* YouTube */}
                                <div className="p-4 rounded-2xl bg-[#090D1A] border border-white/10 space-y-3">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">YouTube</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="youtube" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Channel URL
                                            </label>
                                            <input
                                                id="youtube"
                                                type="url"
                                                value={formData.youtube} // state
                                                onChange={(e) => handleInputChange('youtube', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="youtubeHandle" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Display Handle / Channel Name
                                            </label>
                                            <input
                                                id="youtubeHandle"
                                                type="text"
                                                value={formData.youtubeHandle} // state
                                                onChange={(e) => handleInputChange('youtubeHandle', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* X / Twitter */}
                                <div className="p-4 rounded-2xl bg-[#090D1A] border border-white/10 space-y-3">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">X / Twitter</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="xUrl" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Profile URL
                                            </label>
                                            <input
                                                id="xUrl"
                                                type="url"
                                                value={formData.xUrl} // state
                                                onChange={(e) => handleInputChange('xUrl', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="xHandle" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Display Handle / Username
                                            </label>
                                            <input
                                                id="xHandle"
                                                type="text"
                                                value={formData.xHandle} // state
                                                onChange={(e) => handleInputChange('xHandle', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* IeSF Member Portal */}
                                <div className="p-4 rounded-2xl bg-[#090D1A] border border-white/10 space-y-3">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">IeSF Member Portal</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="iesfUrl" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Member Profile URL
                                            </label>
                                            <input
                                                id="iesfUrl"
                                                type="url"
                                                value={formData.iesfUrl} // state
                                                onChange={(e) => handleInputChange('iesfUrl', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="iesfHandle" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Display Label
                                            </label>
                                            <input
                                                id="iesfHandle"
                                                type="text"
                                                value={formData.iesfHandle} // state
                                                onChange={(e) => handleInputChange('iesfHandle', e.target.value)} // trigger
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* bottom action save bar */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>Changes will directly update the live public website.</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => window.location.reload()} // trigger
                                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving} // check
                                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-70 ${
                                    showSuccessToast
                                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 border border-emerald-400'
                                        : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-lg shadow-amber-400/25'
                                }`}
                            >
                                {showSuccessToast ? (
                                    <>
                                        <Check className="w-4 h-4 stroke-[3]" />
                                        <span>SAVED</span>
                                    </>
                                ) : (
                                    <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                                )}
                            </button>
                        </div>
                    </div>

                </form>

                {/* Confirmation Modal Popup - Blurry Backdrop */}
                {confirmModal.isOpen && (
                    <div
                        className="fixed inset-0 z-40 flex items-center justify-center p-4 md:pl-72 bg-black/35 backdrop-blur-[3px] animate-fadeIn"
                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} // toggle
                    >
                        <div
                            className="relative w-full max-w-md rounded-3xl bg-[#0B101D] border border-white/20 p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] space-y-4"
                            onClick={(e) => e.stopPropagation()} // trigger
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                        {confirmModal.title}
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} // toggle
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                    aria-label="Close dialog"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="py-1">
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    {confirmModal.message}
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} // toggle
                                    className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-white/10 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => confirmModal.onConfirm()} // trigger
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>{confirmModal.confirmLabel || 'Delete'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
