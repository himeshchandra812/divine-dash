import React from 'react';
import { GameSettings, GraphicsQuality } from '../types';
import { Play, RotateCcw, Volume2, VolumeX, Monitor, Shield, Sparkles, Home } from 'lucide-react';

interface PauseModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenAudio?: () => void;
  onMainMenu?: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  settings,
  onUpdateSettings,
  onResume,
  onRestart,
  onOpenAudio,
  onMainMenu,
}) => {
  const handleQualityChange = (q: GraphicsQuality) => {
    onUpdateSettings({ ...settings, quality: q });
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ ...settings, musicVolume: val });
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ ...settings, sfxVolume: val });
  };

  return (
    <section 
      id="pause-modal" 
      aria-label="Game Paused"
      className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-md bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/60 text-center flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-amber-300 mb-1">
          Game Paused
        </h2>
        <p className="text-xs text-neutral-400 mb-6">Take a breather, noble runner.</p>

        {/* Settings Container */}
        <div className="w-full bg-neutral-950/70 border border-amber-500/20 rounded-2xl p-4 mb-6 flex flex-col gap-4 text-left">
          {/* Graphics Quality */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-amber-400" /> Graphics Quality (1080p Target)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                <button
                  key={q}
                  id={`btn-quality-${q}`}
                  onClick={() => handleQualityChange(q)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                    settings.quality === q
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  {q === 'high' ? 'High 1080p' : q}
                </button>
              ))}
            </div>
          </div>

          {/* Music Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-300">
              <span className="flex items-center gap-1.5">
                {settings.musicVolume > 0 ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
                Festival Music
              </span>
              <span className="font-mono text-neutral-400">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={handleMusicChange}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sound FX
              </span>
              <span className="font-mono text-neutral-400">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={handleSfxChange}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            id="btn-resume"
            onClick={onResume}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-black text-base uppercase tracking-wider shadow-lg shadow-amber-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume Game</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-toggle-mute"
              onClick={() => onUpdateSettings({ ...settings, muted: !settings.muted })}
              className={`py-2.5 px-4 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                settings.muted
                  ? 'bg-red-950/80 border-red-500/60 text-red-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
              }`}
            >
              {settings.muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{settings.muted ? 'Muted' : 'Sound On'}</span>
            </button>

            {onOpenAudio ? (
              <button
                id="btn-advanced-audio"
                onClick={onOpenAudio}
                className="py-2.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Audio Mixer</span>
              </button>
            ) : (
              <button
                id="btn-restart"
                onClick={onRestart}
                className="py-2.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-restart"
              onClick={onRestart}
              className="py-2.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Run</span>
            </button>

            {onMainMenu && (
              <button
                id="btn-main-menu"
                onClick={onMainMenu}
                className="py-2.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-amber-500/30 cursor-pointer"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Main Menu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
