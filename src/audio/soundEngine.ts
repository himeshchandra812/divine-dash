/**
 * DIVINE DASH 3D — PROFESSIONAL FESTIVAL SOUNDTRACK & SOUND ENGINE
 * Ganesh Chaturthi Edition
 * 
 * 100% Original Procedural Web Audio API Synthesizer:
 * - Authentic Indian Festival Dhol-Tasha Polyrhythms & Percussion
 * - Adaptive Real-time Dynamic Music (BPM & Instrumentation scales with Stage & Running Speed)
 * - Peaceful Devotional Transition for Lord Ganesha Final Idol Reveal (Bansuri, Temple Ghanti, Shankh)
 * - Complete Suite of Organic & Polished SFX (Modak Sparkle, Idol Bell, Jump, Landing, Collision, UI)
 * - Zero external asset downloads, zero copyright risk, zero latency, persistent audio controls.
 */

export type MusicMode = 'off' | 'running' | 'devotional';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private devotionalGain: GainNode | null = null;

  // State
  public musicVolume: number = 0.5;
  public sfxVolume: number = 0.7;
  public isMuted: boolean = false;
  
  private currentMode: MusicMode = 'off';
  private timerId: number | null = null;
  private devotionalTimerId: number | null = null;
  
  // Dynamic tempo & music state
  private tempoBpm: number = 118;
  private currentStage: 1 | 2 | 3 = 1;
  private speedMultiplier: number = 1.0;
  private step: number = 0;
  private devotionalStep: number = 0;

  // Indian Festival Raags (Raag Bhupali & Desh celebration scale in C)
  // Sa (261.63), Re (293.66), Ga (329.63), Pa (392.00), Dha (440.00), Sa' (523.25)...
  private readonly scale = [
    261.63, // 0: C4 (Sa)
    293.66, // 1: D4 (Re)
    329.63, // 2: E4 (Ga)
    392.00, // 3: G4 (Pa)
    440.00, // 4: A4 (Dha)
    523.25, // 5: C5 (Sa')
    587.33, // 6: D5 (Re')
    659.25, // 7: E5 (Ga')
    783.99, // 8: G5 (Pa')
    880.00, // 9: A5 (Dha')
    1046.50 // 10: C6 (Sa'')
  ];

  // Festive running melody phrases
  private readonly melodyPhrases = [
    // Phrase 1: Uplifting Festival Morning Call
    [0, 2, 3, 5, 4, 3, 2, 0, 2, 3, 5, 7, 5, 3, 2, 3],
    // Phrase 2: Joyful Rhythm Surge
    [5, 4, 3, 5, 7, 8, 7, 5, 4, 5, 3, 2, 0, 2, 3, 5],
    // Phrase 3: Triumphant Sthapana Celebration
    [7, 8, 10, 8, 7, 5, 7, 5, 3, 5, 4, 3, 2, 3, 5, 7],
    // Phrase 4: Fast Devotional Cadence
    [5, 3, 2, 0, 2, 3, 5, 7, 5, 4, 3, 2, 0, 2, 0, 0]
  ];

  // Devotional Aarti peaceful melody (Soothing Raag Bhupali / Yaman mood)
  private readonly devotionalMelody = [
    0, 2, 3, 5, 7, 5, 3, 2,
    3, 5, 7, 8, 7, 5, 3, 0,
    2, 3, 5, 7, 8, 10, 8, 7,
    5, 3, 2, 3, 2, 0, 0, 0
  ];

  constructor() {
    this.loadSavedPreferences();
  }

  // ==========================================
  // INITIALIZATION & USER GESTURE UNLOCK
  // ==========================================

  public init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      this.ctx = new AudioCtxClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Running music bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Devotional aarti music bus
      this.devotionalGain = this.ctx.createGain();
      this.devotionalGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.devotionalGain.connect(this.masterGain);

      // SFX bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // ==========================================
  // VOLUME CONTROLS & PERSISTENCE
  // ==========================================

  public setVolumes(music: number, sfx: number) {
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));

    if (this.ctx && this.musicGain && !this.isMuted) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
    if (this.ctx && this.sfxGain && !this.isMuted) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }

    this.savePreferences();
  }

  public setMusicVolume(val: number) {
    this.setVolumes(val, this.sfxVolume);
  }

  public setSfxVolume(val: number) {
    this.setVolumes(this.musicVolume, val);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, t);
    }
    this.savePreferences();
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, t);
    }
    this.savePreferences();
  }

  private loadSavedPreferences() {
    try {
      const savedMusic = localStorage.getItem('divine_dash_music_volume');
      const savedSfx = localStorage.getItem('divine_dash_sfx_volume');
      const savedMuted = localStorage.getItem('divine_dash_muted');

      if (savedMusic !== null) this.musicVolume = parseFloat(savedMusic);
      if (savedSfx !== null) this.sfxVolume = parseFloat(savedSfx);
      if (savedMuted !== null) this.isMuted = savedMuted === 'true';
    } catch {
      // Ignore local storage errors if sandboxed
    }
  }

  private savePreferences() {
    try {
      localStorage.setItem('divine_dash_music_volume', this.musicVolume.toString());
      localStorage.setItem('divine_dash_sfx_volume', this.sfxVolume.toString());
      localStorage.setItem('divine_dash_muted', this.isMuted.toString());
    } catch {
      // Ignore local storage errors
    }
  }

  // ==========================================
  // ADAPTIVE DYNAMIC SOUNDTRACK CONTROL
  // ==========================================

  public setSpeedMultiplier(speedMult: number) {
    this.speedMultiplier = speedMult;
    // Dynamically scale festival tempo between 118 BPM (normal) and 160 BPM (high speed sprint)
    const targetBpm = Math.min(160, 118 * (1 + (speedMult - 1) * 0.38));
    if (Math.abs(targetBpm - this.tempoBpm) > 2) {
      this.tempoBpm = targetBpm;
      if (this.currentMode === 'running') {
        this.restartMusicTimer();
      }
    }
  }

  public setStage(stage: 1 | 2 | 3) {
    this.currentStage = stage;
  }

  public startMusic() {
    this.init();
    if (this.currentMode === 'running') return;

    this.stopDevotionalMusic();
    this.currentMode = 'running';
    this.step = 0;

    // Smoothly ramp in running music volume
    if (this.ctx && this.musicGain) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(0.001, t);
      this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, t + 0.5);
    }

    this.restartMusicTimer();
  }

  public stopMusic() {
    this.currentMode = 'off';
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.stopDevotionalMusic();

    if (this.ctx && this.musicGain) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(0, t);
    }
  }

  public pauseMusic() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.devotionalTimerId !== null) {
      window.clearInterval(this.devotionalTimerId);
      this.devotionalTimerId = null;
    }
    this.currentMode = 'off';
  }

  private restartMusicTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    // 16th note subdivision interval
    const intervalMs = (60 / this.tempoBpm / 4) * 1000;
    this.timerId = window.setInterval(() => {
      this.playFestivalBeatStep();
    }, intervalMs);
  }

  // ==========================================
  // FESTIVAL MUSIC SEQUENCER (DHOL-TASHA + FLUTE)
  // ==========================================

  private playFestivalBeatStep() {
    if (!this.ctx || !this.musicGain || this.currentMode !== 'running' || this.musicVolume <= 0.005) {
      this.step++;
      return;
    }

    const t = this.ctx.currentTime;
    const beat16 = this.step % 16;
    const phraseStep = this.step % 64;
    const phraseIdx = Math.floor(phraseStep / 16) % this.melodyPhrases.length;
    const currentMelody = this.melodyPhrases[phraseIdx];

    // --------------------------------------------------
    // 1. AUTHENTIC DHOL BASS (Dhā & Dhum)
    // --------------------------------------------------
    // Primary Dhol hits on beat 0, 6, 8, 10, 14
    if (beat16 === 0) {
      this.playDholBass(t, 1.0, 145, 42); // Heavy downbeat Dha
    } else if (beat16 === 6 || beat16 === 10) {
      this.playDholBass(t, 0.75, 130, 48); // Syncopated groove
    } else if (beat16 === 8) {
      this.playDholBass(t, 0.85, 140, 44); // Mid-bar anchor
    } else if (beat16 === 14 && (this.currentStage >= 2 || this.speedMultiplier > 1.2)) {
      this.playDholBass(t, 0.65, 125, 50); // Double kick at higher speeds
    }

    // --------------------------------------------------
    // 2. DHOL TREBLE & DHOLAK CHAATI (Tā / Na)
    // --------------------------------------------------
    if (beat16 === 4 || beat16 === 12) {
      this.playDholTreble(t, 0.8);
    } else if (beat16 === 2 || beat16 === 14) {
      this.playDholTreble(t, 0.5);
    }

    // --------------------------------------------------
    // 3. TASHA HIGH RIM ROLLS & SYNCOPATION (Fast Snare Cadence)
    // --------------------------------------------------
    if (this.currentStage >= 2 || this.speedMultiplier > 1.15) {
      // Rapid syncopated Tasha rolls
      if (beat16 % 2 === 1 || beat16 === 15) {
        const tashaVol = (beat16 === 15 || beat16 === 7) ? 0.45 : 0.25;
        this.playTashaSnap(t, tashaVol);
      }
    }

    // --------------------------------------------------
    // 4. MANJIRA / GHUNGROO BELL JINGLES (Chime Accents)
    // --------------------------------------------------
    if (beat16 === 4 || beat16 === 12 || beat16 === 0 || beat16 === 8) {
      this.playManjiraChime(t, beat16 % 4 === 0 ? 0.35 : 0.2);
    }

    // --------------------------------------------------
    // 5. TANPURA RESONANT DRONE (Continuous C3 & G3 Pad)
    // --------------------------------------------------
    if (this.step % 32 === 0) {
      this.playTanpuraDrone(t, 130.81); // C3 fundamental
      this.playTanpuraDrone(t + 0.15, 196.00); // G3 harmonic fifth
    }

    // --------------------------------------------------
    // 6. MELODIC LEAD (BANSURI FLUTE & SITAR HARMONICS)
    // --------------------------------------------------
    if (this.step % 2 === 0) {
      const melNoteIdx = currentMelody[(this.step / 2) % currentMelody.length];
      const freq = this.scale[melNoteIdx] || 261.63;
      
      // Play rich Bansuri flute lead note
      this.playBansuriNote(t, freq, 0.28);

      // In Stage 2 & 3: add sympathetic Sitar acoustic pluck
      if (this.currentStage >= 2 && (this.step % 4 === 0)) {
        this.playSitarPluck(t, freq * 0.5, 0.2);
      }
    }

    // --------------------------------------------------
    // 7. TRIUMPHANT TUTARI / SHEHNAI FESTIVAL FANFARE (Stage 3)
    // --------------------------------------------------
    if (this.currentStage === 3 && phraseStep === 0) {
      this.playTutariCall(t);
    }

    this.step++;
  }

  // ==========================================
  // DEVOTIONAL AARTI INSTRUMENTAL (FINAL REVEAL)
  // ==========================================

  public transitionToDevotionalMusic() {
    this.init();
    if (this.currentMode === 'devotional') return;

    // 1. Smoothly fade out running music over 1.6s
    if (this.ctx && this.musicGain) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.linearRampToValueAtTime(0.001, t + 1.6);
    }

    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    this.currentMode = 'devotional';
    this.devotionalStep = 0;

    // 2. Play sacred conch call to introduce the divine scene
    this.playConchShankh();

    // 3. Smoothly fade in peaceful devotional music
    if (this.ctx && this.devotionalGain) {
      const t = this.ctx.currentTime;
      this.devotionalGain.gain.cancelScheduledValues(t);
      this.devotionalGain.gain.setValueAtTime(0.001, t);
      this.devotionalGain.gain.linearRampToValueAtTime(this.musicVolume * 0.9, t + 2.0);
    }

    // Devotional Aarti tempo: serene 76 BPM
    const intervalMs = (60 / 76 / 2) * 1000; // 8th notes
    if (this.devotionalTimerId !== null) {
      window.clearInterval(this.devotionalTimerId);
    }

    this.devotionalTimerId = window.setInterval(() => {
      this.playDevotionalBeatStep();
    }, intervalMs);
  }

  private stopDevotionalMusic() {
    if (this.devotionalTimerId !== null) {
      window.clearInterval(this.devotionalTimerId);
      this.devotionalTimerId = null;
    }
    if (this.ctx && this.devotionalGain) {
      const t = this.ctx.currentTime;
      this.devotionalGain.gain.cancelScheduledValues(t);
      this.devotionalGain.gain.setValueAtTime(0, t);
    }
  }

  private playDevotionalBeatStep() {
    if (!this.ctx || !this.devotionalGain || this.currentMode !== 'devotional' || this.musicVolume <= 0.005) {
      this.devotionalStep++;
      return;
    }

    const t = this.ctx.currentTime;
    const step = this.devotionalStep % this.devotionalMelody.length;

    // 1. Soothing Bansuri Flute devotional melody
    const noteIdx = this.devotionalMelody[step];
    const freq = this.scale[noteIdx] || 261.63;
    this.playDevotionalFluteNote(t, freq, 0.35);

    // 2. Sacred Temple Bell (Ghanti) chiming periodically
    if (step % 4 === 0) {
      const bellFreq = step % 8 === 0 ? 1046.50 : 1318.51;
      this.playTempleGhanti(t, bellFreq, 0.4);
    }

    // 3. Warm Swarpeti / Tanpura chord pad
    if (step % 16 === 0) {
      this.playTanpuraDrone(t, 130.81);
      this.playTanpuraDrone(t + 0.2, 196.00);
      this.playTanpuraDrone(t + 0.4, 261.63);
    }

    // 4. Soft Manjira shimmer
    if (step % 2 === 0) {
      this.playManjiraChime(t, 0.15);
    }

    this.devotionalStep++;
  }

  // ==========================================
  // PROCEDURAL INSTRUMENT SYNTHESIZERS
  // ==========================================

  // 1. Dhol Bass (Dha/Dhum)
  private playDholBass(time: number, vol: number, startFreq: number = 140, endFreq: number = 42) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.2);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(startFreq * 0.5, time);
    subOsc.frequency.exponentialRampToValueAtTime(30, time + 0.22);

    gain.gain.setValueAtTime(vol * 0.75, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.26);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + 0.28);
    subOsc.stop(time + 0.28);
  }

  // 2. Dhol Treble (Ta / Chaati)
  private playDholTreble(time: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, time);
    osc.frequency.exponentialRampToValueAtTime(180, time + 0.09);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480, time);
    filter.Q.setValueAtTime(4, time);

    gain.gain.setValueAtTime(vol * 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.12);
  }

  // 3. Tasha High Snap (Festival Snare Roll)
  private playTashaSnap(time: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, time);
    filter.Q.setValueAtTime(5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
  }

  // 4. Manjira / Ghungroo Bells
  private playManjiraChime(time: number, vol: number) {
    if (!this.ctx) return;
    const targetBus = this.currentMode === 'devotional' ? this.devotionalGain : this.musicGain;
    if (!targetBus) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(3400 + Math.random() * 150, time);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3600, time);
    filter.Q.setValueAtTime(9, time);

    gain.gain.setValueAtTime(vol * 0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(targetBus);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  // 5. Bansuri Flute
  private playBansuriNote(time: number, freq: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Gentle portamento glide
    osc.frequency.setValueAtTime(freq * 0.98, time);
    osc.frequency.linearRampToValueAtTime(freq, time + 0.04);

    sub.type = 'triangle';
    sub.frequency.setValueAtTime(freq * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol * 0.45, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    sub.start(time);
    osc.stop(time + 0.35);
    sub.stop(time + 0.35);
  }

  // 6. Devotional Serene Flute
  private playDevotionalFluteNote(time: number, freq: number, vol: number) {
    if (!this.ctx || !this.devotionalGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.99, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.08);

    // Warm soft breath envelope
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol * 0.5, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.65);

    osc.connect(gain);
    gain.connect(this.devotionalGain);

    osc.start(time);
    osc.stop(time + 0.7);
  }

  // 7. Sitar Pluck
  private playSitarPluck(time: number, freq: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const harmonic = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 3, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, time + 0.2);

    gain.gain.setValueAtTime(vol * 0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(filter);
    harmonic.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    harmonic.start(time);
    osc.stop(time + 0.3);
    harmonic.stop(time + 0.3);
  }

  // 8. Tanpura Drone
  private playTanpuraDrone(time: number, freq: number) {
    if (!this.ctx) return;
    const targetBus = this.currentMode === 'devotional' ? this.devotionalGain : this.musicGain;
    if (!targetBus) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.05, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 2.8);

    osc.connect(gain);
    gain.connect(targetBus);

    osc.start(time);
    osc.stop(time + 2.9);
  }

  // 9. Temple Ghanti (Sacred Bell with rich physical harmonics)
  private playTempleGhanti(time: number, freq: number, vol: number) {
    if (!this.ctx || !this.devotionalGain) return;
    // Bell harmonic ratios: 1x (fundamental), 2.76x, 5.4x
    const harmonics = [
      { ratio: 1.0, amp: 0.6, decay: 1.2 },
      { ratio: 2.76, amp: 0.35, decay: 0.7 },
      { ratio: 5.4, amp: 0.2, decay: 0.4 },
    ];

    harmonics.forEach(h => {
      if (!this.ctx || !this.devotionalGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h.ratio, time);

      gain.gain.setValueAtTime(vol * h.amp, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + h.decay);

      osc.connect(gain);
      gain.connect(this.devotionalGain);

      osc.start(time);
      osc.stop(time + h.decay + 0.05);
    });
  }

  // 10. Triumphant Tutari Fanfare Horn Motif
  private playTutariCall(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const notes = [392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const st = time + idx * 0.08;
      osc.frequency.setValueAtTime(freq, st);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, st);

      gain.gain.setValueAtTime(0.25, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(st);
      osc.stop(st + 0.22);
    });
  }

  // ==========================================
  // COMPLETE SOUND EFFECTS (SFX) SUITE
  // ==========================================

  /**
   * Modak collection: Crisp golden sparkle chime with combo pitch scaling.
   */
  public playModakCollect(combo: number = 1) {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Ascending pentatonic sparkle
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const baseFreq = notes[Math.min(notes.length - 1, (combo - 1) % notes.length)];

    const osc = this.ctx.createOscillator();
    const sparkle = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, t + 0.14);

    sparkle.type = 'triangle';
    sparkle.frequency.setValueAtTime(baseFreq * 2, t);
    sparkle.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, t + 0.12);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    sparkle.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    sparkle.start(t);
    osc.stop(t + 0.25);
    sparkle.stop(t + 0.25);
  }

  /**
   * Idol-piece collection: Magical collection effect (deep brass temple bell + shimmering celestial harmonics)
   */
  public playIdolPieceCollect() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;

    // 1. Shimmering Celestial Arpeggio
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, t + idx * 0.04 + 0.5);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.75);
    });

    // 2. Resonant Temple Bell Fundamental
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'triangle';
    bellOsc.frequency.setValueAtTime(261.63, t);
    bellGain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    bellGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    bellOsc.connect(bellGain);
    bellGain.connect(this.sfxGain);
    bellOsc.start(t);
    bellOsc.stop(t + 1.25);
  }

  /**
   * Jump: Light movement sound (soft ascending airy whoosh)
   */
  public playJump() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);

    gain.gain.setValueAtTime(0.28 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Landing: Soft cushioned impact sound when touching down
   */
  public playLanding() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);

    gain.gain.setValueAtTime(0.24 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Lane switching: Subtle gentle movement sound
   */
  public playLaneSwitch() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.07);

    gain.gain.setValueAtTime(0.18 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Slide: Silk friction whoosh sound
   */
  public playSlide() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.14;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    filter.frequency.exponentialRampToValueAtTime(280, t + 0.14);
    filter.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  /**
   * Collision: Clear but not harsh impact sound (low resonant thud + muffled crunch)
   */
  public playCrash() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Low resonant thud
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const oscGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);

    oscGain.gain.setValueAtTime(0.65 * this.sfxVolume, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.42);

    // Muffled wood/crate noise
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, t);
    noiseFilter.Q.setValueAtTime(1.5, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(t);
  }

  /**
   * Button click / UI tap: Pleasant soft organic wooden/bamboo bell tap
   */
  public playButtonClick() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, t); // G5
    osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.05);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  /**
   * Final idol assembly piece snap: Gentle magical chime
   */
  public playAssemblyPieceSnap() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const chime = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.06);

    chime.type = 'sine';
    chime.frequency.setValueAtTime(1318.51, t);
    chime.frequency.exponentialRampToValueAtTime(1567.98, t + 0.2);

    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain);
    chime.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    chime.start(t);
    osc.stop(t + 0.35);
    chime.stop(t + 0.35);
  }

  /**
   * Sacred Shankh (Conch Shell) resonant call
   */
  public playConchShankh() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(430, t + 0.4);
    osc.frequency.setValueAtTime(430, t + 1.3);
    osc.frequency.linearRampToValueAtTime(370, t + 2.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, t);
    filter.frequency.linearRampToValueAtTime(1450, t + 0.5);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.45 * this.sfxVolume, t + 0.3);
    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t + 1.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 2.35);
  }

  /**
   * Completed idol reveal: Grand celebratory sound with sacred conch + victory bells + triumphant fanfare
   */
  public playVictoryAartiFanfare() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    // Conch call + Grand victory bells
    this.playConchShankh();

    const t = this.ctx.currentTime + 0.4;
    const fanfareNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    fanfareNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const st = t + idx * 0.12;
      osc.frequency.setValueAtTime(freq, st);

      const dur = idx === fanfareNotes.length - 1 ? 1.6 : 0.26;
      gain.gain.setValueAtTime(0.45 * this.sfxVolume, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(st);
      osc.stop(st + dur + 0.05);
    });
  }

  /**
   * Blessing Token Collect: Divine temple bell arpeggio
   */
  public playBlessingTokenCollect() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const freqs = [659.25, 783.99, 1046.50, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + idx * 0.04 + 0.35);

      gain.gain.setValueAtTime(0.3 * this.sfxVolume, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.48);
    });
  }

  /**
   * Power-up collect chime
   */
  public playPowerUp() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.06);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.38);
    });
  }

  /**
   * Shield shatter
   */
  public playShieldBreak() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.28);

    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  /**
   * Stage transition fanfare
   */
  public playStageFanfare() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0.005 || this.isMuted) return;

    const t = this.ctx.currentTime;
    const fanfareNotes = [392.00, 523.25, 659.25, 783.99, 1046.50];
    fanfareNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const startTime = t + idx * 0.09;
      osc.frequency.setValueAtTime(freq, startTime);

      const dur = idx === fanfareNotes.length - 1 ? 0.6 : 0.12;
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.02);
    });
  }
}

export const soundEngine = new SoundEngine();
