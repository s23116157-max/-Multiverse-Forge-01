/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural audio synthesizer using Web Audio API
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private bgmPlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgmPlaying) {
      this.stopBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Anvil hammer hit sound
  public playHammerHit(rating: 'PERFECT' | 'GREAT' | 'PASS' | 'MISS') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    if (rating === 'MISS') {
      // Dull clonk
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.15);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
      return;
    }

    // High metal resonant strike
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = rating === 'PERFECT' ? 1280 : (rating === 'GREAT' ? 960 : 720);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, t);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, t + 0.4);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, t);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, t + 0.3);

    const volume = rating === 'PERFECT' ? 0.45 : (rating === 'GREAT' ? 0.35 : 0.25);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (rating === 'PERFECT' ? 0.6 : 0.35));

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.65);
    osc2.stop(t + 0.65);

    // If perfect, add a resonant sparkling harmonic
    if (rating === 'PERFECT') {
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(2400, t + 0.05);
      chime.frequency.exponentialRampToValueAtTime(3200, t + 0.3);
      chimeGain.gain.setValueAtTime(0.2, t + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chime.start(t + 0.05);
      chime.stop(t + 0.52);
    }
  }

  // Bellows pumping whoosh
  public playBellows() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(260, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.35);

    gain.gain.setValueAtTime(0.02, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Quench hiss / steam sizzle
  public playQuench() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.7;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t);
    filter.frequency.exponentialRampToValueAtTime(700, t + 0.7);
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.7);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(t);
    whiteNoise.stop(t + 0.72);
  }

  // Thief alert siren
  public playThiefAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.setValueAtTime(580, t + 0.1);
    osc.frequency.setValueAtTime(850, t + 0.2);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Hitting thief (Bonk!)
  public playThiefHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Defeating thief
  public playThiefDefeated() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Fast ascending celebratory bleep
    [400, 600, 900].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);
      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.14);
    });
  }

  // Trap: Spiked Bear Trap Snap
  public playTrapSnap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Trap: EMP Stasis Shock Zap
  public playTrapShock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1200, 1800, 1400, 2200].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + i * 0.04);
      gain.gain.setValueAtTime(0.25, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.04 + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.09);
    });
  }

  // Trap: Oil Tar Slick Slip
  public playTrapSplash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  // Trap: Sticky Asphalt Trap Squish
  public playTrapAsphalt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.3);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Trap: Tesla Shock Mine Explode
  public playTrapTeslaExplode() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Boom + electric spark
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.4);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.46);
  }

  // Trap: Cryo Freeze Trap Chime & Shatter
  public playFreeze() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [2400, 3100, 3800].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, t + idx * 0.05 + 0.2);
      gain.gain.setValueAtTime(0.3, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.26);
    });
  }

  // Trap: Dimensional Vortex Spatial Whoosh
  public playVortex() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.45);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.48);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // Sentry Golem / Drone Electric Laser Zap
  public playGolemZap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1600, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.18);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Autonomous Recon Patrol Drone: Radar Sweep Ping
  public playDroneRadar() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, t);
    osc.frequency.exponentialRampToValueAtTime(2640, t + 0.12);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);

    // Second echo ping
    const echoOsc = this.ctx.createOscillator();
    const echoGain = this.ctx.createGain();
    echoOsc.type = 'triangle';
    echoOsc.frequency.setValueAtTime(2200, t + 0.08);
    echoOsc.frequency.exponentialRampToValueAtTime(3100, t + 0.22);
    echoGain.gain.setValueAtTime(0.12, t + 0.08);
    echoGain.gain.exponentialRampToValueAtTime(0.002, t + 0.32);
    echoOsc.connect(echoGain);
    echoGain.connect(this.ctx.destination);
    echoOsc.start(t + 0.08);
    echoOsc.stop(t + 0.33);
  }

  // Security Alarm Alert (High-tech intruder alert buzzer)
  public playAlarmAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [0, 0.12, 0.24].forEach((delay) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, t + delay);
      osc.frequency.linearRampToValueAtTime(1650, t + delay + 0.08);

      gain.gain.setValueAtTime(0.3, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + delay);
      osc.stop(t + delay + 0.11);
    });
  }

  // Trap: Automated Cycle Reload Mechanism Click & Spring Arm
  public playAutoReload() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Crisp ratchet click 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(600, t);
    osc1.frequency.exponentialRampToValueAtTime(1400, t + 0.04);
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.06);

    // Heavy spring click 2
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(320, t + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(880, t + 0.12);
    gain2.gain.setValueAtTime(0.25, t + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.06);
    osc2.stop(t + 0.15);

    // Metallic locked-and-loaded chime
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1864, t + 0.12);
    gain3.gain.setValueAtTime(0.18, t + 0.12);
    gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc3.connect(gain3);
    gain3.connect(this.ctx.destination);
    osc3.start(t + 0.12);
    osc3.stop(t + 0.35);
  }

  // Mastery Skill: Multiverse Combo Surge Fanfare
  public playMultiverseSurge() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t + idx * 0.05);
      gain.gain.setValueAtTime(0.25, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.32);
    });
  }

  // Special rare loot drop fanfare / chime
  public playSpecialDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1318.51, 1567.98, 2093.0, 2637.02].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.07);
      gain.gain.setValueAtTime(0.22, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.36);
    });
  }

  // Coins clinking
  public playCoins() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1046.5, 1318.5, 1567.98, 2093].forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + idx * 0.06);
      gain.gain.setValueAtTime(0.2, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.22);
    });
  }

  // Portal switch chime
  public playPortalSwitch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.35);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);
  }

  // Ambient forge background rhythm (gentle procedural forge beat)
  public startForgeBgm() {
    if (this.bgmPlaying || this.isMuted) return;
    this.initContext();
    this.bgmPlaying = true;

    let beat = 0;
    const chords = [
      [220, 330, 440], // A minor
      [196, 294, 392], // G
      [174, 261, 349], // F
      [220, 330, 440],
    ];

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || !this.bgmPlaying) return;
      const t = this.ctx.currentTime;
      const chordIndex = Math.floor(beat / 4) % chords.length;
      const note = chords[chordIndex][beat % 3];

      // Soft rhythmic plucked bass / forge harp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);

      beat++;
    }, 450);
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBgm(): boolean {
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startForgeBgm();
      return true;
    }
  }

  public isBgmActive(): boolean {
    return this.bgmPlaying;
  }
}

export const sound = new SoundManager();
