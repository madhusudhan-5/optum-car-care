'use client';

import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  title: string;
  beforeImage?: string;
  afterImage?: string;
}

export default function BeforeAfterSlider({ title, beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    if ('touches' in e) {
      handleMove(e.touches[0].clientX);
    } else {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full flex flex-col items-stretch text-left">
      <div className="text-sm font-black uppercase tracking-widest mb-4 text-white/70">{title}</div>
      <div
        ref={containerRef}
        onMouseDown={handleStartDrag}
        onTouchStart={handleStartDrag}
        className="h-[450px] bg-[#111] rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl select-none cursor-ew-resize"
      >
        {/* BEFORE SIDE (Dull, scratched paint background) */}
        <div className="absolute inset-0 bg-[#0f0f0f] flex items-center justify-center">
          {beforeImage ? (
            <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(45deg,#888_25%,transparent_25%),linear-gradient(-45deg,#888_25%,transparent_25%)] bg-[size:10px_10px]"></div>
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_30%_40%,transparent_40%,#444_45%,transparent_50%)] bg-[size:120px_120px]"></div>
              <span className="text-gray-700 text-sm font-black uppercase tracking-widest pointer-events-none">Unprotected Paint Surface</span>
            </>
          )}
          <div className="absolute top-6 left-6 bg-black/60 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500">
            Before
          </div>
        </div>

        {/* AFTER SIDE (Vibrant, glossy, protected paint background) */}
        <div
          className="absolute inset-y-0 left-0 right-0 bg-[#151515] flex items-center justify-center overflow-hidden transition-all ease-out duration-75"
          style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
          suppressHydrationWarning
        >
          {afterImage ? (
            <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-primary via-yellow-300 to-[#e0b07b]"></div>
              <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(115deg,transparent_40%,#fff_45%,#fff_50%,transparent_55%)] bg-[size:300px_300px] animate-pulse"></div>
              <span className="text-primary text-sm font-black uppercase tracking-widest pointer-events-none drop-shadow">Self-Healing Glass Coating</span>
            </>
          )}
          <div className="absolute top-6 right-6 bg-primary/20 border border-primary text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            After
          </div>
        </div>

        {/* SLIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary/80 transform -translate-x-1/2 flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
          suppressHydrationWarning
        >
          <div className="w-10 h-10 bg-black border border-primary rounded-full shadow-2xl flex items-center justify-center text-primary text-sm font-black select-none pointer-events-none hover:scale-105 active:scale-95 transition-transform">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
}
