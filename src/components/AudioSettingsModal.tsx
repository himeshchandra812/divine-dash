import React from 'react';
import { GameSettings } from '../types';
import { soundEngine } from '../audio/soundEngine';
import { Volume2, VolumeX, Sparkles, Music, Bell, X, Disc } from 'lucide-react';

interface AudioSettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const isMuted = !!settings.muted;

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ ...settings, musicVolume: val });
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ ...settings, sfxVolume: val });
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    soundEngine.setMuted(newMuted);
    onUpdateSettings({ ...settings, muted: newMuted });
    if (!newMuted) {
      soundEngine.playButtonClick();
    }
  };

  const handleTestSFX = (type: 'modak' | 'idol' | 'bell' | 'shankh') => {
    soundEngine.init();
    if (type === 'modak') soundEngine.playModakCollect(3);
    else if (type === 'idol') soundEngine.playIdolPieceCollect();
    else if (type === 'bell') soundEngine.playAssemblyPieceSnap();
    else if (type === 'shankh') soundEngine.playConchShankh();
  };

  return (
    <section
      id="audio-settings-modal"
      aria-label="Audio & Music Settings"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="w-full max-w-md bg-gradient-to-b from-[#2d021b] via-[#1a0010] to-[#0d0008] border-2 border-[#ffd700] rounded-3xl p-5 sm:p-7 shadow-[0_0_35px_rgba(255,183,3,0.5),inset_0_0_15px_rgba(0,0,0,0.85)] text-center flex flex-col items-center relative overflow-hidden">
        {/* Top Filigree Flourish Highlights */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#fff3b0] pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#fff3b0] pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#fff3b0] pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#fff3b0] pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-audio-settings"
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-900/90 border border-[#ffd700]/50 text-neutral-300 hover:text-white hover:border-[#ffd700] flex items-center justify-center transition-all cursor-pointer"
          title="Close Settings"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-500/30 mb-2.5">
          <Music className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-[#ffd700] to-amber-300 font-serif">
          Festival Audio Settings
        </h2>
        <p className="text-xs text-amber-200/80 mb-5 font-sans">
          Customize original Dhol-Tasha music & festival SFX
        </p>

        {/* Master Mute Bar */}
        <div className="w-full flex items-center justify-between bg-black/50 border border-[#ffd700]/40 rounded-2xl p-3 mb-4">
          <div className="flex items-center gap-2.5 text-left">
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-[#ffd700]" />
            )}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Master Audio Output
              </span>
              <span className="text-[10px] text-neutral-400">
                {isMuted ? 'Muted (Silent Mode)' : 'Active (Music & Sound On)'}
              </span>
            </div>
          </div>

          <button
            id="btn-toggle-mute"
            onClick={handleToggleMute}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>

        {/* Volume Sliders Box */}
        <div className="w-full bg-black/40 border border-[#ffd700]/30 rounded-2xl p-4 mb-4 flex flex-col gap-4 text-left">
          {/* Music Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-200">
              <span className="flex items-center gap-1.5 text-amber-200">
                <Music className="w-4 h-4 text-[#ffd700]" />
                Festival Dhol-Tasha BGM
              </span>
              <span className="font-mono text-[#ffd700] font-bold">
                {isMuted ? '0%' : `${Math.round(settings.musicVolume * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              disabled={isMuted}
              onChange={handleMusicChange}
              className="w-full accent-[#ffd700] h-2 bg-neutral-800 rounded-lg cursor-pointer disabled:opacity-40"
            />
            <span className="text-[9px] text-neutral-400">
              Dynamically scales with runner speed & festival stage
            </span>
          </div>

          {/* SFX Volume */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-800">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-200">
              <span className="flex items-center gap-1.5 text-amber-200">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                Sound Effects & Chimes
              </span>
              <span className="font-mono text-[#ffd700] font-bold">
                {isMuted ? '0%' : `${Math.round(settings.sfxVolume * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              disabled={isMuted}
              onChange={handleSfxChange}
              className="w-full accent-[#ffd700] h-2 bg-neutral-800 rounded-lg cursor-pointer disabled:opacity-40"
            />
            <span className="text-[9px] text-neutral-400">
              Modaks, idol pieces, jumps, landing, and sacred bells
            </span>
          </div>
        </div>

        {/* Audio FX Preview Tester */}
        <div className="w-full bg-black/40 border border-[#ffd700]/20 rounded-2xl p-3 mb-5 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-2">
            <Disc className="w-3.5 h-3.5 text-[#ffd700]" />
            Test Sound Effects
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleTestSFX('modak')}
              className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 rounded-xl text-[10px] font-bold text-amber-200 hover:text-white transition-all text-center cursor-pointer"
            >
              Modak 🍯
            </button>
            <button
              onClick={() => handleTestSFX('idol')}
              className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 rounded-xl text-[10px] font-bold text-amber-200 hover:text-white transition-all text-center cursor-pointer"
            >
              Idol ✨
            </button>
            <button
              onClick={() => handleTestSFX('bell')}
              className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 rounded-xl text-[10px] font-bold text-amber-200 hover:text-white transition-all text-center cursor-pointer"
            >
              Snap 🪷
            </button>
            <button
              onClick={() => handleTestSFX('shankh')}
              className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 rounded-xl text-[10px] font-bold text-amber-200 hover:text-white transition-all text-center cursor-pointer"
            >
              Shankh 🐚
            </button>
          </div>
        </div>

        {/* Save & Done */}
        <button
          id="btn-done-audio-settings"
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[#ffd700] to-yellow-400 text-neutral-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-[#fff3b0]"
        >
          Done & Apply
        </button>
      </div>
    </section>
  );
};
