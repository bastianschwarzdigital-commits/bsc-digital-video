/**
 * Generiert eine ruhige Ambient-Melodie als WAV-Datei.
 * Keine externen Pakete nötig – pure Node.js Sinuswellen-Synthese.
 * Ausgabe: public/background.wav
 */

const fs   = require('fs');
const path = require('path');

const RATE     = 44100;
const DURATION = 42;          // Sekunden (etwas länger als Video)
const TOTAL    = RATE * DURATION;
const BPM      = 70;
const BEAT     = 60 / BPM;   // 0.857s pro Beat
const BAR      = BEAT * 4;   // 3.43s pro Takt

// Audio-Buffer (mono, Float)
const buf = new Float32Array(TOTAL);

// ─── Hilfs-Funktionen ──────────────────────────────────────────

function noteHz(semitones) {
  // A4 = 440 Hz als Basis
  return 440 * Math.pow(2, semitones / 12);
}

// Noten-Semitone relativ zu A4=0
const N = {
  C3: -21, D3: -19, E3: -17, F3: -16, G3: -14, A3: -12, B3: -10,
  C4: -9,  D4: -7,  E4: -5,  F4: -4,  G4: -2,  A4:  0,  B4:  2,
  C5:  3,  D5:  5,  E5:  7,  F5:  8,  G5:  9,  A5: 12,
};

// Addiere eine Note mit ADSR-Hüllkurve
function addNote(note, start, dur, amp, attack = 0.12, decay = 0.1, sustain = 0.75, release = 0.6) {
  const freq = noteHz(N[note]);
  const s0   = Math.floor(start * RATE);
  const s1   = Math.min(Math.floor((start + dur) * RATE), TOTAL);
  const att  = Math.floor(attack  * RATE);
  const dec  = Math.floor(decay   * RATE);
  const rel  = Math.floor(release * RATE);

  for (let i = s0; i < s1; i++) {
    const local = i - s0;
    const rem   = s1 - i;
    let env;
    if (local < att) {
      env = local / att;
    } else if (local < att + dec) {
      env = 1 - ((local - att) / dec) * (1 - sustain);
    } else if (rem < rel) {
      env = sustain * (rem / rel);
    } else {
      env = sustain;
    }
    const t = local / RATE;
    // Soft-Synth: Grundton + schwache Obertöne
    const wave =
      Math.sin(2 * Math.PI * freq * t) * 0.70 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.18 +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.08 +
      Math.sin(2 * Math.PI * freq * 4 * t) * 0.04;
    buf[i] += amp * env * wave;
  }
}

// ─── Komposition ───────────────────────────────────────────────
// Akkorde: Am – F – C – G (Je 1 Takt = BAR Sekunden, loopt 3x)
// Pad (lang sustained) + Arpeggio-Melodie + leiser Bass

const chords = [
  { pad: ['A3','C4','E4'], arp: ['A4','C5','E5','C5'], bass: 'A3' },  // Am
  { pad: ['F3','A3','C4'], arp: ['F4','A4','C5','A4'], bass: 'F3' },  // F
  { pad: ['C3','E4','G4'], arp: ['C5','E5','G5','E5'], bass: 'C3' },  // C
  { pad: ['G3','B3','D4'], arp: ['G4','B4','D5','B4'], bass: 'G3' },  // G
];

const LOOPS = 3;  // 3 Durchläufe → 3 × 4 Takte × BAR ≈ 41 s

for (let loop = 0; loop < LOOPS; loop++) {
  chords.forEach((chord, ci) => {
    const barStart = (loop * chords.length + ci) * BAR;

    // Pad-Akkord (ganzer Takt + etwas Überlapp für Legato)
    chord.pad.forEach(note => {
      addNote(note, barStart, BAR + 0.3, 0.18, 0.18, 0.08, 0.8, 0.5);
    });

    // Bass (halbe Note, weich)
    addNote(chord.bass, barStart, BAR * 0.9, 0.22, 0.1, 0.06, 0.7, 0.4);

    // Arpeggio – 8 Achtel pro Takt
    const eighth = BEAT / 2;
    for (let a = 0; a < 8; a++) {
      const noteIdx  = a % chord.arp.length;
      const noteTime = barStart + a * eighth;
      const noteDur  = eighth * 0.72;
      // Leise, weicher Anschlag
      addNote(chord.arp[noteIdx], noteTime, noteDur, 0.10, 0.04, 0.04, 0.7, 0.18);
    }
  });
}

// ─── Normalisieren ─────────────────────────────────────────────
let peak = 0;
for (let i = 0; i < TOTAL; i++) if (Math.abs(buf[i]) > peak) peak = Math.abs(buf[i]);
const gain = peak > 0 ? 0.85 / peak : 1;

// ─── WAV schreiben ─────────────────────────────────────────────
const pcm = Buffer.alloc(TOTAL * 2);
for (let i = 0; i < TOTAL; i++) {
  const s = Math.max(-1, Math.min(1, buf[i] * gain));
  pcm.writeInt16LE(Math.round(s * 32767), i * 2);
}

function u32le(v) { const b = Buffer.alloc(4); b.writeUInt32LE(v); return b; }
function u16le(v) { const b = Buffer.alloc(2); b.writeUInt16LE(v); return b; }

const dataSize = pcm.length;
const wav = Buffer.concat([
  Buffer.from('RIFF'),
  u32le(36 + dataSize),
  Buffer.from('WAVE'),
  Buffer.from('fmt '),
  u32le(16),
  u16le(1),           // PCM
  u16le(1),           // Mono
  u32le(RATE),
  u32le(RATE * 2),    // ByteRate
  u16le(2),           // BlockAlign
  u16le(16),          // BitsPerSample
  Buffer.from('data'),
  u32le(dataSize),
  pcm,
]);

const out = path.join(__dirname, 'public', 'background.wav');
fs.writeFileSync(out, wav);
console.log(`✓ ${out} (${(wav.length / 1024 / 1024).toFixed(1)} MB, ${DURATION}s)`);
