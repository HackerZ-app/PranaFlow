class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.oscillators = [];
        this.isPlaying = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime); // Default volume
        }
    }

    playBinauralBeat(baseFreq, binauralFreq) {
        this.stop(); // Stop any existing sounds
        this.init();

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const startTime = this.ctx.currentTime;
        const fadeTime = 2; // 2 seconds fade in

        // Left Ear (Base Frequency)
        const oscLeft = this.ctx.createOscillator();
        const pannerLeft = this.ctx.createStereoPanner();
        const gainLeft = this.ctx.createGain();

        oscLeft.type = 'sine';
        oscLeft.frequency.setValueAtTime(baseFreq, startTime);
        pannerLeft.pan.setValueAtTime(-1, startTime); // Full Left

        gainLeft.gain.setValueAtTime(0, startTime);
        gainLeft.gain.linearRampToValueAtTime(0.3, startTime + fadeTime); // Soft volume

        oscLeft.connect(gainLeft);
        gainLeft.connect(pannerLeft);
        pannerLeft.connect(this.masterGain);

        oscLeft.start(startTime);

        // Right Ear (Base + Binaural Frequency)
        const oscRight = this.ctx.createOscillator();
        const pannerRight = this.ctx.createStereoPanner();
        const gainRight = this.ctx.createGain();

        oscRight.type = 'sine';
        oscRight.frequency.setValueAtTime(baseFreq + binauralFreq, startTime);
        pannerRight.pan.setValueAtTime(1, startTime); // Full Right

        gainRight.gain.setValueAtTime(0, startTime);
        gainRight.gain.linearRampToValueAtTime(0.3, startTime + fadeTime);

        oscRight.connect(gainRight);
        gainRight.connect(pannerRight);
        pannerRight.connect(this.masterGain);

        oscRight.start(startTime);

        this.oscillators.push({ node: oscLeft, gain: gainLeft });
        this.oscillators.push({ node: oscRight, gain: gainRight });

        this.isPlaying = true;
    }

    playChime() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t); // A5
        osc.frequency.exponentialRampToValueAtTime(440, t + 1.5); // Drop pitch slightly

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.1); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2); // Decay

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 2);
    }

    stop() {
        if (this.oscillators.length > 0) {
            const t = this.ctx.currentTime;
            this.oscillators.forEach(osc => {
                try {
                    osc.gain.gain.cancelScheduledValues(t);
                    osc.gain.gain.setValueAtTime(osc.gain.gain.value, t);
                    osc.gain.gain.linearRampToValueAtTime(0, t + 0.5); // Fade out
                    osc.node.stop(t + 0.5);
                } catch (e) {
                    console.warn("Error stopping oscillator", e);
                }
            });
            this.oscillators = [];
        }
        this.isPlaying = false;
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
        }
    }
}

export const audioEngine = new AudioEngine();
