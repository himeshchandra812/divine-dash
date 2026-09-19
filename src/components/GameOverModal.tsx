import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameStats } from '../types';
import { RotateCcw, Trophy, Sparkles, Navigation, Home } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  isNewHigh: boolean;
  onRestart: () => void;
  onMainMenu?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, isNewHigh, onRestart, onMainMenu }) => {
  useEffect(() => {
    if (isNewHigh) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff6b00', '#d62246', '#00f5d4'],
      });
    }
  }, [isNewHigh]);

  return (
    <section 
      id="gameover-modal" 
      aria-label="Game Over"
      className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-md bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/60 text-center flex flex-col items-center">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg mb-4 text-2xl">
          {isNewHigh ? '🏆' : '🪔'}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
          {isNewHigh ? 'New High Score!' : 'Run Complete'}
        </h2>
        <p className="text-sm text-neutral-400 mt-1 mb-6">
          {isNewHigh ? 'Divine performance! You broke your record!' : 'May the divine blessings guide your next dash!'}
        </p>

        {/* Score Card */}
        <div className="w-full bg-neutral-950/70 border border-amber-500/20 rounded-2xl p-4 mb-5 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Final Score</span>
          <span className="text-4xl font-black text-amber-200 font-mono my-1">
            {stats.score.toLocaleString()}
          </span>

          <div className="w-full border-t border-neutral-800 my-3" />

          <div className="grid grid-cols-4 gap-2 w-full text-center">
            {/* Distance */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-amber-400" /> Dist
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-200 font-mono">
                {Math.floor(stats.distance)}m
              </span>
            </div>

            {/* Modaks */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Modaks
              </span>
              <span className="text-sm sm:text-base font-bold text-amber-300 font-mono">
                {stats.modaks}
              </span>
            </div>

            {/* Blessings */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                🪙 Bless
              </span>
              <span className="text-sm sm:text-base font-bold text-yellow-300 font-mono">
                {stats.blessingTokens || 0}
              </span>
            </div>

            {/* Best Score */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" /> Best
              </span>
              <span className="text-sm sm:text-base font-bold text-amber-400 font-mono">
                {stats.highScore.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <button
            id="btn-play-again"
            onClick={onRestart}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-neutral-950 font-black text-base uppercase tracking-wider shadow-lg shadow-amber-600/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>

          {onMainMenu && (
            <button
              id="btn-main-menu"
              onClick={onMainMenu}
              className="py-3 px-5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/30"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>Main Menu</span>
            </button>
          )}
        </div>

        <span className="text-xs text-neutral-500 mt-3">
          Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-300 text-[10px]">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-300 text-[10px]">Enter</kbd> to restart
        </span>
      </div>
    </section>
  );
};
