/**
 * Taylor Swift Official Real Audio Player + Synthesizer Fallback
 * Plays the actual official recordings (real vocals & studio production)
 * of Taylor Swift's most famous songs from the official Apple Music / iTunes CDN,
 * with synthesized audio backup.
 */

export interface SongTrack {
  title: string;
  album: string;
  coverImage: string;
  audioUrl: string;
  artist: string;
  durationHint: string;
  bpm: number;
  notes: Array<{ note: string; duration: number }>;
}

const NOTE_FREQS: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99,
  G4: 392.00, 'G#4': 415.30, A4: 440.00, 'A#4': 466.16, B4: 493.88,
  C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99,
  G5: 783.99, 'G#5': 830.61, A5: 880.00, 'A#5': 932.33, B5: 987.77,
  C6: 1046.50,
  REST: 0,
};

export const TS_SONGS: Record<string, SongTrack> = {
  cruel_summer: {
    title: 'Cruel Summer',
    album: 'Lover',
    artist: 'Taylor Swift',
    durationHint: '0:30',
    coverImage: '/src/assets/images/card_ts_lover_vinyl_1792870281598.jpg',
    // Real official studio recording
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a',
    bpm: 170,
    notes: [
      { note: 'A4', duration: 0.5 }, { note: 'A4', duration: 0.5 }, { note: 'B4', duration: 0.5 },
      { note: 'C#5', duration: 1.0 }, { note: 'B4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'F#4', duration: 1.0 }, { note: 'REST', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'C#5', duration: 1.0 }, { note: 'B4', duration: 0.5 },
      { note: 'A4', duration: 0.5 }, { note: 'F#4', duration: 1.5 },
    ],
  },
  blank_space: {
    title: 'Blank Space',
    album: "1989 (Taylor's Version)",
    artist: 'Taylor Swift',
    durationHint: '0:30',
    coverImage: '/src/assets/images/card_ts_1989_polaroid_1792870281861.jpg',
    // Real official studio recording
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/79/55/b1/7955b10c-6cb6-462a-861c-8e5cbcacfb76/mzaf_3395570742482345989.plus.aac.p.m4a',
    bpm: 110,
    notes: [
      { note: 'F#4', duration: 0.5 }, { note: 'F#4', duration: 0.5 }, { note: 'F#4', duration: 0.5 },
      { note: 'A4', duration: 1.0 }, { note: 'F#4', duration: 0.5 }, { note: 'E4', duration: 1.0 },
      { note: 'D4', duration: 1.5 },
    ],
  },
  anti_hero: {
    title: 'Anti-Hero',
    album: 'Midnights',
    artist: 'Taylor Swift',
    durationHint: '0:30',
    coverImage: '/src/assets/images/card_ts_midnights_lavender_1792871101069.jpg',
    // Real official studio recording
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/56/2a/1d562a07-dc5f-a9c0-1f36-2051a8c14eb7/mzaf_7214829135431340590.plus.aac.p.m4a',
    bpm: 97,
    notes: [
      { note: 'C#4', duration: 0.75 }, { note: 'E4', duration: 0.75 }, { note: 'F#4', duration: 0.5 },
      { note: 'G#4', duration: 0.5 }, { note: 'F#4', duration: 0.5 }, { note: 'E4', duration: 1.0 },
      { note: 'C#4', duration: 1.5 },
    ],
  },
  cardigan: {
    title: 'Cardigan',
    album: 'Folklore',
    artist: 'Taylor Swift',
    durationHint: '0:30',
    coverImage: '/src/assets/images/card_ts_folklore_cabin_1792870282375.jpg',
    // Real official studio recording
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/00/b3/f2/00b3f2a0-3228-b65f-7189-91eb26f5adf6/mzaf_3535055549125623460.plus.aac.p.m4a',
    bpm: 110,
    notes: [
      { note: 'A4', duration: 0.75 }, { note: 'C5', duration: 0.75 }, { note: 'B4', duration: 0.5 },
      { note: 'A4', duration: 0.5 }, { note: 'G4', duration: 0.5 }, { note: 'E4', duration: 1.0 },
    ],
  },
  all_too_well: {
    title: 'All Too Well',
    album: "Red (Taylor's Version)",
    artist: 'Taylor Swift',
    durationHint: '0:30',
    coverImage: '/src/assets/images/card_ts_red_autumn_1792871101330.jpg',
    // Real official studio recording
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/98/45/5e/98455e46-746d-c879-c610-48322068929b/mzaf_12082529185475484305.plus.aac.p.m4a',
    bpm: 93,
    notes: [
      { note: 'C4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'E4', duration: 0.75 },
      { note: 'G4', duration: 0.75 }, { note: 'G4', duration: 0.5 }, { note: 'E4', duration: 0.5 },
      { note: 'D4', duration: 1.0 }, { note: 'C4', duration: 1.5 },
    ],
  },
  enchanted: {
    title: 'Enchanted',
    album: "Speak Now (Taylor's Version)",
    artist: 'Taylor Swift',
    durationHint: '0:30',
    coverImage: '/src/assets/images/card_ts_speaknow_lilac_1792871102014.jpg',
    // Real official studio recording
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/f2/da/fff2daa7-e089-c08b-9b34-d2ba8d8ee37c/mzaf_13585740172543756019.plus.aac.p.m4a',
    bpm: 86,
    notes: [
      { note: 'E4', duration: 0.75 }, { note: 'G#4', duration: 0.75 }, { note: 'B4', duration: 0.75 },
      { note: 'C#5', duration: 1.0 }, { note: 'B4', duration: 0.5 }, { note: 'G#4', duration: 1.0 },
    ],
  },
};

class RealAudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private currentSong: SongTrack | null = null;
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private duration: number = 30;
  private listeners: Array<() => void> = [];

  // Synth fallback context in case offline
  private synthCtx: AudioContext | null = null;
  private synthTimeout: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.volume = 0.85;

      this.audioElement.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audioElement.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.notify();
      });

      this.audioElement.addEventListener('timeupdate', () => {
        if (this.audioElement) {
          this.currentTime = this.audioElement.currentTime;
          this.duration = this.audioElement.duration || 30;
          this.notify();
        }
      });

      this.audioElement.addEventListener('error', () => {
        // Fallback to synthesized melody if stream has an issue
        if (this.currentSong) {
          this.playSynthFallback(this.currentSong);
        }
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

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSong(): SongTrack | null {
    return this.currentSong;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.synthTimeout) {
      window.clearTimeout(this.synthTimeout);
      this.synthTimeout = null;
    }
    this.isPlaying = false;
    this.currentTime = 0;
    this.notify();
  }

  public playSongByKey(key: string) {
    const song = TS_SONGS[key];
    if (song) {
      this.playSong(song);
    }
  }

  public playSong(song: SongTrack) {
    this.stop();
    this.currentSong = song;

    if (this.audioElement && song.audioUrl) {
      this.audioElement.src = song.audioUrl;
      this.audioElement.load();
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.notify();
          })
          .catch(() => {
            // If browser blocks audio without prior click, fallback safely
            this.playSynthFallback(song);
          });
      }
    } else {
      this.playSynthFallback(song);
    }
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else if (this.currentSong) {
      this.playSong(this.currentSong);
    } else {
      this.playSong(TS_SONGS['cruel_summer']);
    }
  }

  private playSynthFallback(song: SongTrack) {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.synthCtx && AudioCtx) {
        this.synthCtx = new AudioCtx();
      }
      if (this.synthCtx && this.synthCtx.state === 'suspended') {
        this.synthCtx.resume();
      }
      if (!this.synthCtx) return;

      this.isPlaying = true;
      this.notify();

      const beatDuration = 60 / song.bpm;
      let scheduledTime = this.synthCtx.currentTime + 0.05;

      song.notes.forEach((item) => {
        const dur = item.duration * beatDuration;
        const freq = NOTE_FREQS[item.note] || 0;
        if (freq > 0 && this.synthCtx) {
          const osc = this.synthCtx.createOscillator();
          const gain = this.synthCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, scheduledTime);
          gain.gain.setValueAtTime(0.001, scheduledTime);
          gain.gain.exponentialRampToValueAtTime(0.1, scheduledTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, scheduledTime + dur);
          osc.connect(gain);
          gain.connect(this.synthCtx.destination);
          osc.start(scheduledTime);
          osc.stop(scheduledTime + dur);
        }
        scheduledTime += dur;
      });

      const totalMs = (scheduledTime - this.synthCtx.currentTime) * 1000;
      this.synthTimeout = window.setTimeout(() => {
        this.isPlaying = false;
        this.notify();
      }, totalMs);
    } catch {
      this.isPlaying = false;
      this.notify();
    }
  }
}

export const musicPlayer = new RealAudioPlayer();
