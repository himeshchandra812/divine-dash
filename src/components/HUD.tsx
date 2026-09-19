import React from 'react';
import { GameStats } from '../types';
import { IDOL_PIECES } from '../game/constants';
import { GoldenLotusSVG, GoldenModakSVG } from './FestivalIcons';
import { Shield, Magnet, Zap, Sparkles, Volume2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, FastForward } from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  onPause: () => void;
  onOpenAudio?: () => void;
  onSkipAssembly?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ stats, onPause, onOpenAudio, onSkipAssembly }) => {
  const collectedCount = stats.collectedPieces ? stats.collectedPieces.length : 0;
  const isAllCollected = collectedCount >= 6;

  return (
    <header className="absolute inset-x-0 top-0 p-3 sm:p-5 pointer-events-none flex flex-col justify-between h-full z-20 select-none">
      {/* ================= TOP ROW ================= */}
      <div className="flex items-start justify-between w-full">
        {/* TOP LEFT: Modak Counter Pill */}
        <div className="pointer-events-auto relative group">
          {/* Ornate Gold Filigree Container */}
          <div
            id="hud-modak-counter"
            className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-b from-[#420427] via-[#2d021b] to-[#1a0010] border-2 border-[#ffd700] shadow-[0_0_20px_rgba(255,183,3,0.45),inset_0_0_12px_rgba(0,0,0,0.8)]"
          >
            {/* Corner Filigree Flourish Highlights */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#fff3b0] rounded-tl-sm pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#fff3b0] rounded-tr-sm pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#fff3b0] rounded-bl-sm pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#fff3b0] rounded-br-sm pointer-events-none" />

            {/* Glowing 3D Modak Icon */}
            <div className="relative -ml-1 flex items-center justify-center filter drop-shadow-[0_2px_8px_rgba(255,190,11,0.6)] animate-pulse">
              <GoldenModakSVG className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            {/* Label & Number */}
            <div className="flex flex-col pr-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#ffe66d] font-serif font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                MODAKS
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {stats.modaks}
              </span>
            </div>

            {/* Floating Sparkle Stars */}
            <span className="absolute -top-1.5 right-6 text-yellow-300 text-xs animate-ping opacity-75">✦</span>
          </div>

          {/* Active Multiplier Pill if active */}
          {stats.multiplier > 1 && (
            <div
              id="hud-multiplier-pill"
              className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-white font-black text-[11px] tracking-wider shadow-lg animate-bounce border border-yellow-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{stats.multiplier}X MULTIPLIER</span>
            </div>
          )}
        </div>

        {/* TOP CENTER: Royal Grand Score, Distance & Idol Quest Ribbon */}
        <div className="flex flex-col items-center pointer-events-auto max-w-lg">
          {/* Main Arched Royal Plaque */}
          <div
            id="hud-score-display"
            className="relative flex flex-col items-center px-6 sm:px-9 pt-2 pb-2 rounded-[28px] bg-gradient-to-b from-[#4e052f] via-[#2f011c] to-[#18000f] border-2 border-[#ffd700] shadow-[0_4px_25px_rgba(255,183,3,0.5),inset_0_0_15px_rgba(0,0,0,0.85)] min-w-[210px] sm:min-w-[260px]"
          >
            {/* Top Center Arch Peak Finial */}
            <div className="absolute -top-2.5 inset-x-0 flex justify-center pointer-events-none">
              <div className="w-5 h-3 bg-[#ffd700] rounded-t-full shadow-md border-t border-[#fff3b0]" />
            </div>

            {/* SCORE Label */}
            <span className="text-[10px] sm:text-xs font-serif font-black uppercase tracking-[0.25em] text-[#ffdd53] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              SCORE
            </span>

            {/* Big Score with Lotus Icons on Both Sides */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-0.5">
              <div className="filter drop-shadow-[0_0_8px_rgba(255,215,0,0.7)] animate-pulse">
                <GoldenLotusSVG className="w-5 h-4 sm:w-7 sm:h-6" />
              </div>

              <span className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fff07c] to-[#ffb703] font-mono tracking-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                {stats.score.toLocaleString()}
              </span>

              <div className="filter drop-shadow-[0_0_8px_rgba(255,215,0,0.7)] animate-pulse">
                <GoldenLotusSVG className="w-5 h-4 sm:w-7 sm:h-6" />
              </div>
            </div>

            {/* Bottom Distance & Best Ribbon */}
            <div className="flex items-center justify-between w-full pt-1.5 mt-0.5 border-t border-[#ffd700]/30 text-[10px] sm:text-xs text-[#fdf0d5] font-semibold">
              <div className="flex items-center gap-1">
                <span className="text-[#ffdd53]/80 uppercase tracking-wider text-[9px] sm:text-[10px]">DIST:</span>
                <span className="font-mono text-white font-bold">{Math.floor(stats.distance)} m</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">👑</span>
                <span className="text-[#ffdd53]/80 uppercase tracking-wider text-[9px] sm:text-[10px]">BEST:</span>
                <span className="font-mono text-white font-bold">
                  {(stats.highScore || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Sacred Ganpati Idol Quest Collection Ribbon */}
          <div
            id="hud-idol-quest-ribbon"
            className="mt-1.5 flex flex-col items-center bg-gradient-to-r from-[#240115]/95 via-[#3b0424]/95 to-[#240115]/95 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl border border-[#ffd700]/60 shadow-lg"
          >
            <div className="flex items-center justify-between w-full gap-2 mb-1">
              <span className="text-[9px] sm:text-[10px] font-serif font-black uppercase tracking-wider text-[#ffdd53] flex items-center gap-1">
                <span>🪷</span> GANPATI IDOL QUEST
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-200">
                {collectedCount} / 6 PIECES
              </span>
            </div>

            {/* 6 Piece Slots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {IDOL_PIECES.map((piece) => {
                const isCollected = stats.collectedPieces?.includes(piece.id);
                return (
                  <div
                    key={piece.id}
                    title={`${piece.name} - ${isCollected ? 'Secured' : 'Missing'}`}
                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${
                      isCollected
                        ? 'bg-gradient-to-b from-[#ffd700] to-[#ff9e00] border border-[#fff3b0] shadow-[0_0_10px_rgba(255,215,0,0.8)] scale-105'
                        : 'bg-black/60 border border-neutral-700/60 opacity-40'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{piece.icon}</span>
                    {isCollected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white flex items-center justify-center text-[7px] text-black font-black">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* TOP RIGHT: Ornate Circular Sound & Pause Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          {onOpenAudio && (
            <button
              id="hud-audio-btn"
              onClick={onOpenAudio}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#420427] via-[#2d021b] to-[#1a0010] border-2 border-[#ffd700] shadow-[0_0_15px_rgba(255,183,3,0.35),inset_0_0_8px_rgba(0,0,0,0.8)] flex items-center justify-center text-[#ffd700] hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title="Audio & Music Settings"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}

          <button
            id="hud-pause-btn"
            onClick={onPause}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#420427] via-[#2d021b] to-[#1a0010] border-2 sm:border-[2.5px] border-[#ffd700] shadow-[0_0_20px_rgba(255,183,3,0.45),inset_0_0_10px_rgba(0,0,0,0.8)] flex items-center justify-center text-[#ffd700] hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Pause Game (Esc / P)"
          >
            {/* Concentric Gold Accent Ring */}
            <div className="absolute inset-1 rounded-full border border-[#ffdd53]/40 pointer-events-none" />
            {/* Pause Double Bars */}
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-5 sm:h-6 rounded-full bg-gradient-to-b from-[#fff3b0] via-[#ffd700] to-[#ff9e00] shadow-sm" />
              <div className="w-1.5 h-5 sm:h-6 rounded-full bg-gradient-to-b from-[#fff3b0] via-[#ffd700] to-[#ff9e00] shadow-sm" />
            </div>
          </button>
        </div>
      </div>

      {/* ================= RECENT MILESTONE / DIVINE BANNER TOAST ================= */}
      {stats.recentMilestoneMessage && (
        <div className="w-full flex justify-center py-2 pointer-events-auto animate-bounce">
          <div
            id="hud-milestone-banner"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4e052f] via-[#b83b5e] to-[#4e052f] border-2 border-[#ffd700] shadow-[0_0_25px_rgba(255,183,3,0.7)] flex items-center gap-3 text-white backdrop-blur-md"
          >
            <span className="text-xl animate-spin">🪷</span>
            <span className="text-xs sm:text-sm font-serif font-black tracking-wide text-[#fff3b0] drop-shadow">
              {stats.recentMilestoneMessage}
            </span>
          </div>
        </div>
      )}

      {/* ================= ACTIVE POWER-UP TIMERS ================= */}
      {stats.activePowerUps.length > 0 && (
        <div className="w-full flex justify-center py-1 pointer-events-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {stats.activePowerUps.map((p) => {
              const pct = (p.remainingTime / p.duration) * 100;
              let title = 'Power';
              let icon = <Sparkles className="w-4 h-4" />;
              let colorClass = 'from-amber-500 to-yellow-400';
              let borderClass = 'border-amber-400';

              if (p.type === 'shield') {
                title = 'Lotus Shield';
                icon = <Shield className="w-4 h-4 text-cyan-300" />;
                colorClass = 'from-cyan-500 to-blue-400';
                borderClass = 'border-cyan-400';
              } else if (p.type === 'magnet') {
                title = 'Modak Magnet';
                icon = <Magnet className="w-4 h-4 text-rose-300" />;
                colorClass = 'from-rose-500 to-amber-400';
                borderClass = 'border-rose-400';
              } else if (p.type === 'boost') {
                title = 'Garuda Boost';
                icon = <Zap className="w-4 h-4 text-yellow-300" />;
                colorClass = 'from-yellow-400 to-amber-500';
                borderClass = 'border-yellow-400';
              } else if (p.type === 'multiplier') {
                title = '2X Score';
                icon = <Sparkles className="w-4 h-4 text-purple-300" />;
                colorClass = 'from-purple-500 to-pink-400';
                borderClass = 'border-purple-400';
              }

              return (
                <div
                  key={p.type}
                  id={`hud-powerup-${p.type}`}
                  className={`flex items-center gap-2 bg-[#2d021b]/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border ${borderClass} shadow-xl min-w-[130px]`}
                >
                  <div className="p-1 rounded-lg bg-black/40 text-amber-300">
                    {icon}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-amber-100">
                      <span>{title}</span>
                      <span className="font-mono text-yellow-300">{Math.ceil(p.remainingTime)}s</span>
                    </div>
                    <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-100 rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= BOTTOM ROW (MATCHING REFERENCE IMAGE) ================= */}
      <div className="flex items-end justify-between w-full pb-1">
        {/* BOTTOM LEFT: Controls Pill */}
        <div
          id="hud-controls-pill"
          className="pointer-events-auto flex items-center gap-3 sm:gap-5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-[22px] bg-gradient-to-b from-[#2d021b]/90 to-[#15000d]/90 backdrop-blur-md border border-[#ffd700]/70 shadow-[0_4px_20px_rgba(0,0,0,0.7),inset_0_0_8px_rgba(255,215,0,0.2)]"
        >
          {/* Move Left / Right */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-neutral-900/90 border border-neutral-700/80 flex items-center justify-center text-neutral-200 text-xs shadow">
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-neutral-900/90 border border-neutral-700/80 flex items-center justify-center text-neutral-200 text-xs shadow">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-neutral-300 font-medium mt-0.5 tracking-tight">
              Move
            </span>
          </div>

          {/* Jump */}
          <div className="flex flex-col items-center border-l border-neutral-700/50 pl-3 sm:pl-4">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-neutral-900/90 border border-neutral-700/80 flex items-center justify-center text-neutral-200 text-xs shadow">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] sm:text-[10px] text-neutral-300 font-medium mt-0.5 tracking-tight">
              Jump
            </span>
          </div>

          {/* Slide */}
          <div className="flex flex-col items-center border-l border-neutral-700/50 pl-3 sm:pl-4">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-neutral-900/90 border border-neutral-700/80 flex items-center justify-center text-neutral-200 text-xs shadow">
              <ArrowDown className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] sm:text-[10px] text-neutral-300 font-medium mt-0.5 tracking-tight">
              Slide
            </span>
          </div>
        </div>

        {/* BOTTOM RIGHT: "Be Fast Be Blessed" Scalloped Medallion */}
        <div
          id="hud-blessing-seal"
          className="pointer-events-auto relative flex flex-col items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-[20px] bg-gradient-to-b from-[#4e052f] via-[#2f011c] to-[#18000f] border-2 border-[#ffd700] shadow-[0_0_20px_rgba(255,183,3,0.45),inset_0_0_10px_rgba(0,0,0,0.85)]"
        >
          {/* Decorative Corner Filigree */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#fff3b0]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#fff3b0]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#fff3b0]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#fff3b0]" />

          <span className="text-xs sm:text-sm font-serif font-black text-[#fff3b0] tracking-wide leading-tight drop-shadow">
            Be Fast
          </span>
          <span className="text-xs sm:text-sm font-serif font-black text-[#ffc837] tracking-wide leading-tight drop-shadow">
            Be Blessed
          </span>

          <div className="mt-0.5 filter drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]">
            <GoldenLotusSVG className="w-5 h-4 sm:w-6 sm:h-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
};

