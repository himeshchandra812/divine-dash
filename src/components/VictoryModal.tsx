import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameStats } from '../types';
import { IDOL_PIECES } from '../game/constants';
import { GoldenModakSVG } from './FestivalIcons';
import { RotateCcw, Sparkles, Navigation, Home, CheckCircle2 } from 'lucide-react';

interface VictoryModalProps {
  stats: GameStats;
  onRestart: () => void;
  onMainMenu?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ stats, onRestart, onMainMenu }) => {
  useEffect(() => {
    // Grand celebration confetti blast
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff6b00', '#ff4d8d', '#00f5d4', '#d62246', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <section
      id="victory-modal"
      aria-label="Festival Completion"
      className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 pointer-events-none select-none animate-fade-in"
    >
      {/* Top Auspicious Banner */}
      <div className="w-full flex justify-center pt-2 pointer-events-auto">
        <div className="bg-gradient-to-r from-amber-950/85 via-yellow-950/90 to-amber-950/85 border border-[#ffd700]/70 rounded-full px-5 py-2 shadow-[0_0_25px_rgba(255,215,0,0.5)] backdrop-blur-md flex items-center gap-3">
          <span className="text-xl">🪷</span>
          <div className="text-center">
            <h1 className="text-base sm:text-xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-200 font-serif leading-tight">
              GANPATI BAPPA MORYA!
            </h1>
            <p className="text-[11px] font-bold text-amber-200 uppercase tracking-widest">
              THE FESTIVAL IS COMPLETE
            </p>
          </div>
          <span className="text-xl">🪷</span>
        </div>
      </div>

      {/* Middle Area: Kept Open & Unobstructed for the 3D Lord Ganesha Idol */}
      <div className="flex-1 min-h-[140px] pointer-events-none" />

      {/* Bottom Floating Stats & Replay Card */}
      <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-[#2e041d]/90 via-[#1d0112]/95 to-[#0f0009]/95 border-2 border-[#ffd700]/80 rounded-3xl p-4 sm:p-5 shadow-[0_0_40px_rgba(255,183,3,0.45),inset_0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md pointer-events-auto relative overflow-hidden">
        {/* Subtle Corner Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#ffd700]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#ffd700]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#ffd700]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#ffd700]" />

        {/* 6 Assembled Pieces Badges */}
        <div className="flex items-center justify-between bg-black/40 border border-[#ffd700]/30 rounded-xl px-3 py-1.5 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffdd53] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            Idol Pieces Collected:
          </span>
          <div className="flex items-center gap-1.5">
            {IDOL_PIECES.map((p) => (
              <span key={p.id} title={p.name} className="text-sm">
                {p.icon}
              </span>
            ))}
            <span className="text-xs font-mono font-bold text-amber-300 ml-1">
              6 / 6 Complete
            </span>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-black/50 border border-amber-500/20 rounded-2xl p-2.5 mb-3 text-center">
          {/* Final Score */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold">
              Final Score
            </span>
            <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 font-mono">
              {stats.score.toLocaleString()}
            </span>
          </div>

          {/* Distance Traveled */}
          <div className="flex flex-col items-center justify-center border-x border-amber-500/20">
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold flex items-center gap-1">
              <Navigation className="w-2.5 h-2.5 text-amber-400" /> Distance
            </span>
            <span className="text-base sm:text-lg font-bold text-white font-mono">
              {Math.floor(stats.distance)} m
            </span>
          </div>

          {/* Modaks Collected */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold flex items-center gap-1">
              <GoldenModakSVG className="w-3 h-3" /> Modaks
            </span>
            <span className="text-base sm:text-lg font-bold text-yellow-300 font-mono">
              {stats.modaks}
            </span>
          </div>
        </div>

        {/* Play Again & Main Menu Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <button
            id="btn-victory-restart"
            onClick={onRestart}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-neutral-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_25px_rgba(255,183,3,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#fff3b0]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          {onMainMenu && (
            <button
              id="btn-victory-main-menu"
              onClick={onMainMenu}
              className="py-3 px-5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/40"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>Main Menu</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
