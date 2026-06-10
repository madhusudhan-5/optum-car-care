'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImageSplitter({ imageUrl }: { imageUrl: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-ew-resize select-none group"
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* Before Image (Desaturated/Dull) */}
      <img
        src={imageUrl}
        alt="Before Protection"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none filter grayscale opacity-50 contrast-75 blur-[1px]"
      />
      <div className="absolute top-6 left-6 bg-black/60 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded backdrop-blur-sm z-10">Before</div>

      {/* After Image (Vibrant) */}
      <div 
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img
          src={imageUrl}
          alt="After Protection"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out pointer-events-none"
        />
        <div className="absolute top-6 right-6 bg-primary/90 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded backdrop-blur-sm shadow-lg">After</div>
      </div>

      {/* Slider Line & Button */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center transform -translate-x-1/2"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className={`w-12 h-12 bg-black border-2 border-primary text-primary rounded-full flex items-center justify-center text-xs font-bold font-sans shadow-2xl transition-transform ${isDragging ? 'scale-110' : 'scale-100 hover:scale-105'}`}>
          ◀ ▶
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0 pointer-events-none"></div>
    </div>
  );
}
