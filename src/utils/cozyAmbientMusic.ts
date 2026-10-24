/**
 * Cozy Lo-Fi Ambient Background Soundscape
 * Creates an ultra-peaceful, warm ambient chord progression
 * using Web Audio API so it plays offline without external audio assets.
 */

import { audioController } from './audioController.ts';

class CozyAmbientMusicEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private loopInterval: number | null = null;
  private gainNode: GainNode | null = null;

  // Chord progression frequencies (Cmaj7 -> Am9 -> Fmaj7 -> Gsus4)
  private chords = [
    [261.63, 329.63, 392.00, 493.88], // C E G B
    [220.00, 261.63, 329.63, 392.00, 493.88], // A C E G B
    [174.61, 261.63, 329.63, 349.23], // F C E F
    [196.00, 261.63, 293.66, 392.00], // G C D G
  ];

  private currentChordIndex = 0;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public start() {
    if (this.isRunning) return;
    this.init();
    if (!this.ctx || !this.gainNode) return;

    this.isRunning = true;
    const prefs = audioController.getPreferences();
    const targetVol = prefs.isMasterMuted || prefs.isBgmMuted ? 0 : prefs.bgmVolume * 0.4;

    // Fade in over 2.5s
    this.gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetVol), this.ctx.currentTime + 2.5);

    this.playNextChord();
    this.loopInterval = window.setInterval(() => {
      this.playNextChord();
    }, 4000);
  }

  public stop() {
    if (!this.isRunning) return;
    if (this.loopInterval) {
      window.clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    if (this.ctx && this.gainNode) {
      // Fade out over 1s
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
    }
    this.isRunning = false;
  }

  public setVolume(vol: number) {
    if (this.ctx && this.gainNode) {
      this.gainNode.gain.setValueAtTime(vol * 0.4, this.ctx.currentTime);
    }
  }

  private playNextChord() {
    if (!this.ctx || !this.gainNode || !this.isRunning) return;

    const chord = this.chords[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.025, this.ctx.currentTime + 0.8);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.8);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 3.9);
    });
  }
}

export const cozyAmbientMusic = new CozyAmbientMusicEngine();
