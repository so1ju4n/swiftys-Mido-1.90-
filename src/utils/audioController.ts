/**
 * Audio Controller for Little Moments
 * Enforces all audio specifications from Section 8:
 * - Fade-in from 0 volume (1.5 - 3.0s)
 * - Default music volume 20% (0.20)
 * - Independent SFX volume (0.70)
 * - Anti-spam click deduplication (min 60ms between clicks)
 * - Safe HTML5 Audio for real official tracks + Web Audio API synth
 * - Persistent preferences saved in localStorage
 */

import { AudioPreferences } from '../types.ts';

class LittleMomentsAudioController {
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxCtx: AudioContext | null = null;
  private currentFadeInterval: number | null = null;
  private lastClickTime: number = 0;
  private activeSongTitle: string | null = null;
  private isBgmPlaying: boolean = false;

  private prefs: AudioPreferences = {
    bgmVolume: 0.20,
    sfxVolume: 0.70,
    isBgmMuted: false,
    isSfxMuted: false,
    isMasterMuted: false,
  };

  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('little_moments_audio_prefs');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.prefs = { ...this.prefs, ...parsed };
        }
      } catch {
        // default fallback
      }

      this.bgmAudio = new Audio();
      this.bgmAudio.preload = 'none';

      this.bgmAudio.addEventListener('ended', () => {
        this.isBgmPlaying = false;
        this.activeSongTitle = null;
        this.notify();
      });

      this.bgmAudio.addEventListener('pause', () => {
        this.isBgmPlaying = false;
        this.notify();
      });

      this.bgmAudio.addEventListener('playing', () => {
        this.isBgmPlaying = true;
        this.notify();
      });
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getPreferences(): AudioPreferences {
    return { ...this.prefs };
  }

  public getIsPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public getActiveSongTitle(): string | null {
    return this.activeSongTitle;
  }

  public setPreferences(newPrefs: Partial<AudioPreferences>) {
    this.prefs = { ...this.prefs, ...newPrefs };
    try {
      localStorage.setItem('little_moments_audio_prefs', JSON.stringify(this.prefs));
    } catch {
      // ignore storage error
    }

    if (this.bgmAudio) {
      if (this.prefs.isMasterMuted || this.prefs.isBgmMuted) {
        this.bgmAudio.volume = 0;
      } else {
        this.bgmAudio.volume = this.prefs.bgmVolume;
      }
    }
    this.notify();
  }

  private initSfxContext() {
    if (typeof window === 'undefined') return;
    if (!this.sfxCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.sfxCtx = new AudioCtx();
      }
    }
    if (this.sfxCtx && this.sfxCtx.state === 'suspended') {
      this.sfxCtx.resume();
    }
  }

  // Fade In Audio Utility
  public playMusicWithFadeIn(audioUrl: string, songTitle: string, targetDurationSec = 2.0) {
    if (!this.bgmAudio || typeof window === 'undefined') return;

    // Clear existing fade
    if (this.currentFadeInterval) {
      window.clearInterval(this.currentFadeInterval);
      this.currentFadeInterval = null;
    }

    this.activeSongTitle = songTitle;
    this.bgmAudio.pause();
    this.bgmAudio.src = audioUrl;
    this.bgmAudio.currentTime = 0;

    const targetVolume = this.prefs.isMasterMuted || this.prefs.isBgmMuted ? 0 : this.prefs.bgmVolume;
    this.bgmAudio.volume = 0;

    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isBgmPlaying = true;
          this.notify();

          // Ramp up volume from 0 to targetVolume over targetDurationSec
          const steps = 25;
          const stepTimeMs = (targetDurationSec * 1000) / steps;
          const volumeIncrement = targetVolume / steps;
          let currentStep = 0;

          this.currentFadeInterval = window.setInterval(() => {
            if (!this.bgmAudio) return;
            currentStep++;
            const newVol = Math.min(targetVolume, currentStep * volumeIncrement);
            this.bgmAudio.volume = newVol;

            if (currentStep >= steps) {
              if (this.currentFadeInterval) {
                window.clearInterval(this.currentFadeInterval);
                this.currentFadeInterval = null;
              }
            }
          }, stepTimeMs);
        })
        .catch(() => {
          this.isBgmPlaying = false;
          this.notify();
        });
    }
  }

  // Fade Out and Stop
  public stopMusicWithFadeOut(durationSec = 1.0) {
    if (!this.bgmAudio || !this.isBgmPlaying) return;

    if (this.currentFadeInterval) {
      window.clearInterval(this.currentFadeInterval);
      this.currentFadeInterval = null;
    }

    const startVolume = this.bgmAudio.volume;
    const steps = 15;
    const stepTimeMs = (durationSec * 1000) / steps;
    let currentStep = 0;

    this.currentFadeInterval = window.setInterval(() => {
      if (!this.bgmAudio) return;
      currentStep++;
      const factor = 1 - currentStep / steps;
      this.bgmAudio.volume = Math.max(0, startVolume * factor);

      if (currentStep >= steps) {
        if (this.currentFadeInterval) {
          window.clearInterval(this.currentFadeInterval);
          this.currentFadeInterval = null;
        }
        this.bgmAudio.pause();
        this.isBgmPlaying = false;
        this.activeSongTitle = null;
        this.notify();
      }
    }, stepTimeMs);
  }

  // -------------------------------------------------------------
  // SOUND EFFECTS (Web Audio API Synthesized Delicate Tones)
  // -------------------------------------------------------------
  private playSfxTone(freq: number, type: OscillatorType, duration: number, gainBase: number, delaySec = 0) {
    if (this.prefs.isMasterMuted || this.prefs.isSfxMuted) return;

    try {
      this.initSfxContext();
      if (!this.sfxCtx) return;

      const osc = this.sfxCtx.createOscillator();
      const gain = this.sfxCtx.createGain();

      const finalGain = gainBase * this.prefs.sfxVolume;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.sfxCtx.currentTime + delaySec);

      gain.gain.setValueAtTime(0.0001, this.sfxCtx.currentTime + delaySec);
      gain.gain.exponentialRampToValueAtTime(finalGain, this.sfxCtx.currentTime + delaySec + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.sfxCtx.currentTime + delaySec + duration);

      osc.connect(gain);
      gain.connect(this.sfxCtx.destination);

      osc.start(this.sfxCtx.currentTime + delaySec);
      osc.stop(this.sfxCtx.currentTime + delaySec + duration);
    } catch {
      // Graceful silence if audio blocked
    }
  }

  // Clic suave y delicado al seleccionar carta (con deduplicación)
  public playCardFlip() {
    const now = performance.now();
    if (now - this.lastClickTime < 60) return; // Anti-spam 60ms
    this.lastClickTime = now;

    this.playSfxTone(340, 'sine', 0.07, 0.05);
    this.playSfxTone(520, 'triangle', 0.05, 0.03, 0.02);
  }

  // Campanillas discretas para pareja correcta
  public playMatchChime() {
    // Acorde delicado C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
    this.playSfxTone(523.25, 'sine', 0.4, 0.07, 0.0);
    this.playSfxTone(659.25, 'sine', 0.45, 0.07, 0.08);
    this.playSfxTone(783.99, 'sine', 0.5, 0.08, 0.16);
    this.playSfxTone(1046.50, 'sine', 0.6, 0.09, 0.24);
  }

  // Sonido sutil, no agresivo para intento incorrecto
  public playMismatch() {
    this.playSfxTone(260, 'sine', 0.14, 0.035, 0.0);
    this.playSfxTone(220, 'sine', 0.16, 0.03, 0.09);
  }

  // Transición corta para pausa
  public playPause() {
    this.playSfxTone(440, 'sine', 0.1, 0.04, 0.0);
    this.playSfxTone(330, 'sine', 0.15, 0.04, 0.06);
  }

  // Melodía breve de recompensa para victoria
  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playSfxTone(freq, 'sine', 0.45, 0.08, idx * 0.09);
    });
  }

  // Clic suave de interfaz
  public playUiTick() {
    this.playSfxTone(480, 'sine', 0.04, 0.02);
  }
}

export const audioController = new LittleMomentsAudioController();
