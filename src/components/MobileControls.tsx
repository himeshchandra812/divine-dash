import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface MobileControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onLeft,
  onRight,
  onJump,
  onSlide,
}) => {
  return (
    <div 
      id="mobile-touch-controls" 
      className="md:hidden absolute inset-x-0 bottom-4 px-6 flex justify-between items-end pointer-events-none z-10 select-none"
    >
      {/* Left/Right Steer D-Pad */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          id="btn-touch-left"
          onTouchStart={(e) => { e.preventDefault(); onLeft(); }}
          onClick={onLeft}
          className="w-14 h-14 rounded-2xl bg-neutral-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 active:bg-amber-500 active:text-neutral-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button
          id="btn-touch-right"
          onTouchStart={(e) => { e.preventDefault(); onRight(); }}
          onClick={onRight}
          className="w-14 h-14 rounded-2xl bg-neutral-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 active:bg-amber-500 active:text-neutral-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          aria-label="Move Right"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Jump & Slide Action Buttons */}
      <div className="flex flex-col gap-3 pointer-events-auto items-center">
        <button
          id="btn-touch-jump"
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
          onClick={onJump}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-neutral-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform font-bold"
          aria-label="Jump"
        >
          <ArrowUp className="w-7 h-7 stroke-[3]" />
        </button>

        <button
          id="btn-touch-slide"
          onTouchStart={(e) => { e.preventDefault(); onSlide(); }}
          onClick={onSlide}
          className="w-14 h-14 rounded-2xl bg-neutral-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 active:bg-amber-500 active:text-neutral-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          aria-label="Slide"
        >
          <ArrowDown className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
