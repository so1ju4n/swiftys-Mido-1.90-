/**
 * Web Audio API synthesized pastel sound effects
 * Peaceful, non-intrusive and warm acoustic tones
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check saved audio preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pastel_memory_sound_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pastel_memory_sound_muted', String(this.isMuted));
    }
    if (!this.isMuted) {
      this.playTone(523.25, 'sine', 0.15, 0.08); // C5 confirmation beep
    }
    return this.isMuted;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gainValue: number, delaySec = 0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delaySec);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + delaySec);
      gain.gain.exponentialRampToValueAtTime(gainValue, this.ctx.currentTime + delaySec + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delaySec + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delaySec);
      osc.stop(this.ctx.currentTime + delaySec + duration);
    } catch {
      // Graceful fallback if audio context is blocked
    }
  }

  // Soft page turn / card flip click
  public playFlip() {
    this.playTone(320, 'sine', 0.08, 0.04);
    this.playTone(480, 'triangle', 0.06, 0.02, 0.03);
  }

  // Soft harmonious chime on successful match
  public playMatch() {
    // E5 -> G5 -> C6 soft acoustic arpeggio
    this.playTone(659.25, 'sine', 0.35, 0.06, 0.0);
    this.playTone(783.99, 'sine', 0.4, 0.06, 0.08);
    this.playTone(1046.5, 'sine', 0.5, 0.08, 0.16);
  }

  // Soft subtle muffled tap on mismatch
  public playMismatch() {
    this.playTone(280, 'sine', 0.12, 0.03, 0.0);
    this.playTone(240, 'sine', 0.14, 0.03, 0.08);
  }

  // Joyful yet gentle victory chime sequence
  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.45, 0.06, i * 0.1);
    });
  }

  // Light interface tap
  public playTap() {
    this.playTone(440, 'sine', 0.05, 0.02);
  }
}

export const sound = new SoundController();
