// --1. imports--
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, Move, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon } from 'lucide-react';

// --2. main component--
export default function ImagePositionerModal({
    isOpen,
    onClose,
    imageSource, // File, Blob, or URL string
    fileName = 'image.jpg',
    aspectRatio = 16 / 9, // 16/9 for banners/covers, 1/1 for logos/avatars
    aspectRatioLabel = '16:9 Landscape',
    onComplete, // (croppedFile, previewUrl) => void
    outputWidth = 1600,
    title = 'Reposition & Frame Image',
}) {
    // --3. state--
    const [imageObj, setImageObj] = useState(null); // state
    const [zoom, setZoom] = useState(1); // state
    const [pan, setPan] = useState({ x: 0, y: 0 }); // state
    const [isDragging, setIsDragging] = useState(false); // state
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // state
    const [boxSize, setBoxSize] = useState({ width: 0, height: 0 }); // state
    const [isProcessing, setIsProcessing] = useState(false); // state

    const containerRef = useRef(null); // properties
    const viewportRef = useRef(null); // properties

    // --4. actions--
    // load image and determine dimensions
    useEffect(() => {
        if (!isOpen || !imageSource) { // check
            setImageObj(null);
            return;
        }

        let url = '';
        let shouldRevoke = false;

        if (typeof imageSource === 'string') { // check
            url = imageSource;
        } else if (imageSource instanceof Blob || imageSource instanceof File) {
            url = URL.createObjectURL(imageSource); // convert
            shouldRevoke = true;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous'; // config
        img.onload = () => {
            setImageObj(img); // state
            setZoom(1); // state
            setPan({ x: 0, y: 0 }); // state
        };
        img.src = url;

        return () => {
            if (shouldRevoke) URL.revokeObjectURL(url); // clean
        };
    }, [isOpen, imageSource]);

    // calculate responsive viewport box dimensions
    useEffect(() => {
        if (!containerRef.current) return; // check

        const updateBoxDimensions = () => {
            if (!containerRef.current) return;
            const containerW = containerRef.current.clientWidth;
            const containerH = containerRef.current.clientHeight || 380;

            let w = containerW;
            let h = w / aspectRatio;

            if (h > containerH) { // check
                h = containerH;
                w = h * aspectRatio;
            }

            setBoxSize({ width: Math.round(w), height: Math.round(h) }); // state
        };

        updateBoxDimensions();
        window.addEventListener('resize', updateBoxDimensions); // trigger
        return () => window.removeEventListener('resize', updateBoxDimensions);
    }, [isOpen, aspectRatio]);

    // calculate current layout geometry
    const getGeometry = useCallback(() => {
        if (!imageObj || boxSize.width === 0 || boxSize.height === 0) return null; // check

        const naturalW = imageObj.naturalWidth;
        const naturalH = imageObj.naturalHeight;

        // cover scale
        const scaleCover = Math.max(boxSize.width / naturalW, boxSize.height / naturalH);
        const baseW = naturalW * scaleCover;
        const baseH = naturalH * scaleCover;

        const currentW = baseW * zoom;
        const currentH = baseH * zoom;

        // max allowed panning bounds to keep frame nicely filled
        const maxPanX = Math.max(0, (currentW - boxSize.width) / 2);
        const maxPanY = Math.max(0, (currentH - boxSize.height) / 2);

        return {
            naturalW,
            naturalH,
            baseW,
            baseH,
            currentW,
            currentH,
            maxPanX,
            maxPanY,
        };
    }, [imageObj, boxSize, zoom]);

    // clamp pan coordinates within bounds
    const clampPan = useCallback((x, y, geom) => {
        if (!geom) return { x, y }; // check
        const clampedX = Math.max(-geom.maxPanX, Math.min(geom.maxPanX, x));
        const clampedY = Math.max(-geom.maxPanY, Math.min(geom.maxPanY, y));
        return { x: clampedX, y: clampedY };
    }, []);

    // mouse / touch drag handlers (Instagram style)
    const handleMouseDown = (e) => { // trigger
        e.preventDefault();
        setIsDragging(true); // state
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); // state
    };

    const handleMouseMove = (e) => { // trigger
        if (!isDragging) return; // check
        const geom = getGeometry();
        const rawX = e.clientX - dragStart.x;
        const rawY = e.clientY - dragStart.y;
        setPan(clampPan(rawX, rawY, geom)); // state
    };

    const handleMouseUp = () => { // trigger
        setIsDragging(false); // state
    };

    const handleTouchStart = (e) => { // trigger
        if (e.touches.length === 1) { // check
            setIsDragging(true); // state
            setDragStart({
                x: e.touches[0].clientX - pan.x,
                y: e.touches[0].clientY - pan.y,
            }); // state
        }
    };

    const handleTouchMove = (e) => { // trigger
        if (!isDragging || e.touches.length !== 1) return; // check
        const geom = getGeometry();
        const rawX = e.touches[0].clientX - dragStart.x;
        const rawY = e.touches[0].clientY - dragStart.y;
        setPan(clampPan(rawX, rawY, geom)); // state
    };

    const handleTouchEnd = () => { // trigger
        setIsDragging(false); // state
    };

    // zoom adjustments
    const handleZoomChange = (newZoom) => { // state
        const val = Math.max(1, Math.min(3, newZoom));
        setZoom(val);
        const geom = getGeometry();
        if (geom) {
            setPan((prev) => clampPan(prev.x, prev.y, geom));
        }
    };

    const handleReset = () => { // trigger
        setZoom(1); // state
        setPan({ x: 0, y: 0 }); // state
    };

    // render canvas and export cropped file
    const handleApply = async () => { // save
        if (!imageObj || !boxSize.width || !boxSize.height) return; // check

        try {
            setIsProcessing(true); // state
            const geom = getGeometry();
            if (!geom) return;

            const canvasW = outputWidth;
            const canvasH = Math.round(outputWidth / aspectRatio);

            const canvas = document.createElement('canvas');
            canvas.width = canvasW;
            canvas.height = canvasH;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            // image top-left in viewport coordinate space
            const imgLeft = boxSize.width / 2 + pan.x - geom.currentW / 2;
            const imgTop = boxSize.height / 2 + pan.y - geom.currentH / 2;

            // mapping ratio from screen viewport to natural source image pixels
            const ratio = geom.naturalW / geom.currentW;

            const srcX = Math.max(0, (0 - imgLeft) * ratio);
            const srcY = Math.max(0, (0 - imgTop) * ratio);
            const srcW = Math.min(geom.naturalW - srcX, boxSize.width * ratio);
            const srcH = Math.min(geom.naturalH - srcY, boxSize.height * ratio);

            // fill high quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(imageObj, srcX, srcY, srcW, srcH, 0, 0, canvasW, canvasH); // render

            canvas.toBlob((blob) => {
                if (!blob) {
                    setIsProcessing(false);
                    return;
                }

                // create File instance
                const cleanName = fileName.replace(/\.[^/.]+$/, '') + '.jpg';
                const croppedFile = new File([blob], cleanName, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });

                const previewUrl = URL.createObjectURL(blob); // convert
                setIsProcessing(false); // state
                onComplete(croppedFile, previewUrl); // trigger
                onClose(); // trigger
            }, 'image/jpeg', 0.92);
        } catch (err) {
            console.error('Failed to crop and reposition image', err); // error
            setIsProcessing(false); // state
        }
    };

    if (!isOpen) return null; // check

    const geom = getGeometry();

    // --5. UI--
    return (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-3xl bg-[#090D18] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-neutral-300">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-wide uppercase">{title}</h3>
                            <p className="text-[11px] font-mono text-neutral-400">
                                Drag to move & position • {aspectRatioLabel}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose} // trigger
                        className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* viewport area */}
                <div
                    ref={containerRef}
                    className="relative w-full h-[380px] sm:h-[440px] bg-black/60 flex items-center justify-center p-4 select-none overflow-hidden"
                >
                    {imageObj && boxSize.width > 0 ? (
                        <div
                            ref={viewportRef}
                            style={{
                                width: `${boxSize.width}px`,
                                height: `${boxSize.height}px`,
                            }}
                            onMouseDown={handleMouseDown} // trigger
                            onMouseMove={handleMouseMove} // trigger
                            onMouseUp={handleMouseUp} // trigger
                            onMouseLeave={handleMouseUp} // trigger
                            onTouchStart={handleTouchStart} // trigger
                            onTouchMove={handleTouchMove} // trigger
                            onTouchEnd={handleTouchEnd} // trigger
                            className={`relative overflow-hidden border-2 border-white/40 shadow-2xl ${
                                isDragging ? 'cursor-grabbing' : 'cursor-grab'
                            }`}
                        >
                            {/* image layer */}
                            {geom && (
                                <img
                                    src={imageObj.src}
                                    alt="Reposition Preview"
                                    draggable={false}
                                    style={{
                                        width: `${geom.currentW}px`,
                                        height: `${geom.currentH}px`,
                                        transform: `translate3d(${boxSize.width / 2 + pan.x - geom.currentW / 2}px, ${
                                            boxSize.height / 2 + pan.y - geom.currentH / 2
                                        }px, 0px)`,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        maxWidth: 'none',
                                        maxHeight: 'none',
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}

                            {/* Instagram style 3x3 rule of thirds guide lines */}
                            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                                <div className="border-r border-b border-white/15" />
                                <div className="border-r border-b border-white/15" />
                                <div className="border-b border-white/15" />
                                <div className="border-r border-b border-white/15" />
                                <div className="border-r border-b border-white/15" />
                                <div className="border-b border-white/15" />
                                <div className="border-r border-white/15" />
                                <div className="border-r border-white/15" />
                                <div />
                            </div>

                            {/* subtle helper badge */}
                            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-neutral-300 pointer-events-none flex items-center gap-1.5 border border-white/10">
                                <Move className="w-3 h-3 text-neutral-300" />
                                <span>Drag to reposition</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                            <span>Loading image preview...</span>
                        </div>
                    )}
                </div>

                {/* controls bar */}
                <div className="px-6 py-4 bg-[#070B14] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* zoom controls */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => handleZoomChange(zoom - 0.15)} // trigger
                            disabled={zoom <= 1} // check
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>

                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.01"
                            value={zoom} // state
                            onChange={(e) => handleZoomChange(parseFloat(e.target.value))} // trigger
                            className="w-36 sm:w-44 accent-white bg-white/10 h-1.5 rounded-lg cursor-pointer"
                        />

                        <button
                            type="button"
                            onClick={() => handleZoomChange(zoom + 0.15)} // trigger
                            disabled={zoom >= 3} // check
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>

                        <span className="text-[11px] font-mono text-neutral-400 min-w-[36px]">
                            {Math.round(zoom * 100)}%
                        </span>

                        <button
                            type="button"
                            onClick={handleReset} // trigger
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
                            title="Reset framing"
                        >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                        </button>
                    </div>

                    {/* action buttons */}
                    <div className="flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose} // trigger
                            className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleApply} // trigger
                            disabled={isProcessing || !imageObj} // check
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white text-black text-xs font-bold tracking-wider uppercase hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                        >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isProcessing ? 'Processing...' : 'Apply Framing'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
