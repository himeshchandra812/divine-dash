import React, { useState } from 'react';
import { Play, Trophy, Sparkles, Volume2, BookOpen, Info, Shield, Magnet, Zap, X } from 'lucide-react';
import { GraphicsQuality } from '../types';
import { IDOL_PIECES } from '../game/constants';
import { GoldenLotusSVG, GoldenModakSVG } from './FestivalIcons';

interface StartScreenProps {
  highScore: number;
  quality: GraphicsQuality;
  onQualityChange: (q: GraphicsQuality) => void;
  onStart: () => void;
  onOpenAudio?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  highScore,
  quality,
  onQualityChange,
  onStart,
  onOpenAudio,
}) => {
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);

  return (
    <section 
      id="start-screen" 
      aria-label="Start Screen"
      className="absolute inset-0 z-20 flex flex-col justify-between items-center p-4 sm:p-6 bg-gradient-to-b from-neutral-950/75 via-neutral-950/85 to-neutral-950/95 backdrop-blur-[2px] overflow-y-auto"
    >
      {/* Top Brand & High Score */}
      <header className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff6b00] to-[#ffd700] flex items-center justify-center shadow-lg shadow-amber-500/30 text-xl border border-yellow-200">
            🪔
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black tracking-widest text-[11px] uppercase text-[#ffd700]">
              DIVINE DASH 3D
            </span>
            <span className="text-[10px] text-amber-200/80 font-mono">
              Ganpati Festival Run
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAudio && (
            <button
              id="start-screen-audio-btn"
              onClick={onOpenAudio}
              className="flex items-center gap-1.5 bg-[#2d021b]/90 border border-[#ffd700]/40 hover:border-[#ffd700] px-3 py-1.5 rounded-2xl shadow-lg text-amber-300 hover:text-white transition-all cursor-pointer text-xs font-bold"
              title="Festival Audio Settings"
            >
              <Volume2 className="w-4 h-4 text-[#ffd700]" />
              <span className="hidden sm:inline">Audio</span>
            </button>
          )}

          {highScore > 0 && (
            <div 
              id="start-high-score"
              className="flex items-center gap-2 bg-[#2d021b]/90 border border-[#ffd700]/40 px-3.5 py-1.5 rounded-2xl shadow-lg"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase tracking-wider text-amber-300/70 font-bold leading-none">Best Score</span>
                <span className="text-sm font-extrabold text-amber-200 font-mono leading-tight">{highScore.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Title, Story & Description */}
      <div className="flex flex-col items-center text-center max-w-2xl my-auto py-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#4e052f]/90 border border-[#ffd700]/50 text-yellow-300 text-xs font-serif font-bold tracking-widest uppercase mb-2 shadow-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Ganesh Chaturthi Competition Edition
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fff07c] to-[#ffb703] drop-shadow-2xl font-serif">
          Divine Dash 3D
        </h1>
        <h2 className="text-sm sm:text-base font-serif font-bold tracking-widest uppercase text-amber-300 mt-0.5 flex items-center justify-center gap-2">
          <span>॥</span> Ganpati Festival Run <span>॥</span>
        </h2>

        {/* Respectful Story Introduction Card */}
        <div className="w-full bg-[#240115]/90 border border-[#ffd700]/40 rounded-2xl p-3.5 sm:p-4 mt-3 text-left shadow-xl">
          <p className="text-xs sm:text-sm text-[#ffe8a3] font-sans leading-relaxed text-center sm:text-left">
            <strong className="text-[#ffd700] font-serif">Story Mission: </strong>
            The grand Ganesh Chaturthi festival is about to commence! Run through illuminated neighborhood streets, markets, and grand pandals to collect all <strong className="text-white font-bold">6 Sacred Idol Components</strong> to assemble Lord Ganesha's idol for the Grand Sthapana Aarti ceremony!
          </p>

          {/* 6 Collectibles Showcase */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-3 pt-3 border-t border-[#ffd700]/20">
            {IDOL_PIECES.map((piece) => (
              <div
                key={piece.id}
                className="flex flex-col items-center bg-black/40 border border-amber-500/30 rounded-xl p-1.5 text-center"
              >
                <span className="text-base sm:text-lg">{piece.icon}</span>
                <span className="text-[9px] font-bold text-amber-200 leading-tight mt-0.5">
                  {piece.name.split(' ')[0]}
                </span>
                <span className="text-[8px] text-neutral-400 font-mono">Stage {piece.stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5 w-full">
          <button
            id="btn-start-game"
            onClick={onStart}
            className="flex-1 min-w-[200px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-neutral-950 font-black text-lg uppercase tracking-wider shadow-[0_0_25px_rgba(255,183,3,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-[#fff3b0]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Game</span>
          </button>

          <button
            id="btn-instructions"
            onClick={() => setShowInstructions(true)}
            className="px-5 py-3.5 rounded-2xl bg-[#2d021b]/90 hover:bg-[#420427] border border-[#ffd700]/50 text-amber-200 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Instructions</span>
          </button>

          <button
            id="btn-credits"
            onClick={() => setShowCredits(true)}
            className="px-5 py-3.5 rounded-2xl bg-[#2d021b]/90 hover:bg-[#420427] border border-[#ffd700]/50 text-amber-200 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span>Credits</span>
          </button>
        </div>

        <span className="text-[11px] text-neutral-400 mt-2 font-mono">
          Press <kbd className="px-2 py-0.5 bg-neutral-900 rounded border border-neutral-700 text-neutral-200 text-xs">Space</kbd> or <kbd className="px-2 py-0.5 bg-neutral-900 rounded border border-neutral-700 text-neutral-200 text-xs">Enter</kbd> to launch
        </span>
      </div>

      {/* Footer: Controls & Graphics Quality */}
      <footer className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800/80">
        {/* Controls Guide */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-xl border border-neutral-800">
            <div className="flex gap-1 text-[10px] font-mono text-amber-300 font-bold">
              <span>← / A</span>
              <span>→ / D</span>
            </div>
            <span>Switch Lane</span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-xl border border-neutral-800">
            <div className="text-[10px] font-mono text-amber-300 font-bold">
              ↑ / Space / W
            </div>
            <span>Jump</span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-xl border border-neutral-800">
            <div className="text-[10px] font-mono text-amber-300 font-bold">
              ↓ / S
            </div>
            <span>Slide</span>
          </div>
        </div>

        {/* Quality Selector */}
        <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-500 px-2">Quality:</span>
          {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
            <button
              key={q}
              onClick={() => onQualityChange(q)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                quality === q
                  ? 'bg-amber-500 text-neutral-950 font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {q === 'high' ? '1080p' : q}
            </button>
          ))}
        </div>
      </footer>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-500/20">
              <h3 className="text-xl font-black uppercase text-amber-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> Game Instructions
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-xs mb-1">Objective</h4>
                <p>Run through 3 decorated environments to collect Modaks and 6 Sacred Idol Pieces to complete Lord Ganesha's idol for the Grand Sthapana Aarti!</p>
              </div>

              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-xs mb-2">Controls</h4>
                <ul className="space-y-1.5 text-xs font-mono">
                  <li><span className="text-yellow-300 font-bold">Left / Right Arrow (A / D):</span> Change Lane</li>
                  <li><span className="text-yellow-300 font-bold">Up Arrow / Space (W):</span> Jump over barrier obstacles</li>
                  <li><span className="text-yellow-300 font-bold">Down Arrow (S):</span> Slide under festoon arches</li>
                  <li><span className="text-yellow-300 font-bold">Esc / P:</span> Pause / Resume game</li>
                </ul>
              </div>

              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-xs mb-2">Power-Ups</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-black/40 p-2 rounded-xl border border-cyan-500/30 flex flex-col items-center">
                    <Shield className="w-4 h-4 text-cyan-300 mb-1" />
                    <span className="font-bold text-cyan-200 text-[10px]">Lotus Shield</span>
                    <span className="text-[9px] text-neutral-400">5s Invincible</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl border border-rose-500/30 flex flex-col items-center">
                    <Magnet className="w-4 h-4 text-rose-300 mb-1" />
                    <span className="font-bold text-rose-200 text-[10px]">Modak Magnet</span>
                    <span className="text-[9px] text-neutral-400">8s Attraction</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl border border-amber-500/30 flex flex-col items-center">
                    <Zap className="w-4 h-4 text-yellow-300 mb-1" />
                    <span className="font-bold text-amber-200 text-[10px]">Garuda Boost</span>
                    <span className="text-[9px] text-neutral-400">Speed Boost</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider text-xs cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto text-center">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-500/20 text-left">
              <h3 className="text-xl font-black uppercase text-amber-300 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" /> Competition Credits
              </h3>
              <button
                onClick={() => setShowCredits(false)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-neutral-300 text-left">
              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1">Game Title</h4>
                <p className="font-serif font-black text-base text-white">Divine Dash 3D: Ganpati Festival Run</p>
                <p className="text-xs text-amber-200/80">College Game-Development Competition Edition</p>
              </div>

              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1">Key Technologies</h4>
                <ul className="list-disc list-inside text-xs space-y-1 text-neutral-300 font-mono">
                  <li>Three.js 3D WebGL Rendering Engine</li>
                  <li>Web Audio API Synthesizer (Dhol-Tasha, Bansuri, Tutari)</li>
                  <li>React 18 + Tailwind CSS UI Framework</li>
                  <li>Procedural Road & Pandal Segment Generator</li>
                </ul>
              </div>

              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1">Presentation Features</h4>
                <p className="text-xs text-neutral-300">
                  Built with respect for Ganesh Chaturthi cultural traditions. Features 3 procedural festival environments, 6 sacred idol pieces, power-up systems, and a grand final Sthapana Aarti reveal.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCredits(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

