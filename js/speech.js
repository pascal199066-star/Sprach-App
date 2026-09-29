/**
 * Sprachausgabe.
 *
 * 1. Wahl: echte aserbaidschanische Aufnahmen (audio/…/*.mp3), einmalig mit
 *    den neuronalen az-AZ-Stimmen erzeugt (siehe tools/). Sie liegen in der
 *    App selbst und funktionieren offline.
 * 2. Wahl: eine aserbaidschanische Systemstimme, falls das Gerät eine hat.
 * 3. Notlösung: die türkische Systemstimme. Sie kennt ə, q und x nicht,
 *    deshalb wird der Text vorher angenähert – das klingt aber hörbar
 *    türkisch und ist nur ein Behelf, solange keine Aufnahme da ist.
 */
import { audioKey, spokenText, VOICES } from './audio-key.js';

const AZ_TO_TR = { 'ə': 'e', 'Ə': 'E', 'q': 'g', 'Q': 'G', 'x': 'h', 'X': 'H' };

// Winziger stiller Klang – schaltet das Audio-Element auf iOS frei.
const SILENCE = 'data:audio/wav;base64,UklGRuwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YcgAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';

let voices = [];            // Systemstimmen
let chosen = null;          // vom Nutzer gewählte Systemstimme (voiceURI)
let recorded = null;        // Set der vorhandenen Aufnahmen – null = noch nicht geladen
let preferred = 'f';        // bevorzugte Aufnahme-Stimme: 'f' | 'm'
let unlocked = false;
let warnedNoVoice = false;
let current = null;         // { done } – laufende Wiedergabe
const listeners = new Set();

const player = typeof Audio !== 'undefined' ? new Audio() : null;
if (player) {
  player.preload = 'auto';
  player.setAttribute('playsinline', '');
}

const synthOK = typeof window !== 'undefined' && 'speechSynthesis' in window;

function notify() { listeners.forEach(fn => fn()); }

function finishCurrent() {
  const c = current;
  current = null;
  c?.done?.();
}

export const speech = {
  get supported() { return !!player || synthOK; },

  /** Für die türkische Notstimme lesbar machen. */
  toTurkish(text) {
    return String(text).replace(/[əƏqQxX]/g, c => AZ_TO_TR[c]);
  },

  /** Systemstimmen, die für Aserbaidschanisch in Frage kommen – beste zuerst. */
  candidates() {
    const score = v => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      if (l.startsWith('az')) return 0;
      if (l.startsWith('tr')) return 1;
      return 9;
    };
    return voices.filter(v => score(v) < 9).sort((a, b) => score(a) - score(b));
  },

  /** Die Systemstimme, die als Ersatz benutzt würde. */
  current() {
    if (chosen) {
      const v = voices.find(v => v.voiceURI === chosen);
      if (v) return v;
    }
    return this.candidates()[0] || null;
  },

  /** Wie gut ist die Aussprache gerade? */
  get quality() {
    if (recorded && recorded.size) return 'recorded';
    const v = this.current();
    if (!v) return 'none';
    const l = (v.lang || '').toLowerCase();
    return l.startsWith('az') ? 'native' : l.startsWith('tr') ? 'turkish' : 'fallback';
  },

  /** Anzahl der mitgelieferten Aufnahmen (0 = keine). */
  get recordedCount() { return recorded ? recorded.size : 0; },

  /** Gibt es für diesen Text eine echte Aufnahme? */
  hasRecording(text, voice = preferred) {
    return !!recorded && (recorded.has(audioKey(text, voice)) || recorded.has(audioKey(text, other(voice))));
  },

  /** Pfade aller Aufnahmen – für „offline speichern“. */
  allRecordings() { return recorded ? [...recorded].map(k => `audio/${k}.mp3`) : []; },

  setVoice(uri) { chosen = uri || null; },
  setPreferred(v) { if (VOICES[v]) preferred = v; },
  get preferred() { return preferred; },

  onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  // alter Name, bleibt für bestehende Aufrufer
  onVoicesChanged(fn) { return this.onChange(fn); },

  /**
   * iOS gibt Audio erst nach einer echten Berührung frei.
   * Wird beim ersten Tippen aufgerufen.
   */
  unlock() {
    if (unlocked) return;
    unlocked = true;
    try {
      if (player) {
        player.src = SILENCE;
        player.play().catch(() => { /* still ignorieren */ });
      }
      if (synthOK) {
        const u = new SpeechSynthesisUtterance('');
        u.volume = 0;
        speechSynthesis.speak(u);
      }
    } catch { /* still ignorieren */ }
  },

  /**
   * Spricht aserbaidschanischen Text.
   * @param {string} text
   * @param {{rate?:number, slow?:boolean, voice?:'f'|'m', onend?:Function}} [opts]
   * @returns {boolean} ob überhaupt etwas abgespielt wird
   */
  say(text, opts = {}) {
    if (!text) return false;
    this.stop();
    const rate = opts.rate ?? 0.9;
    const done = () => opts.onend?.();

    // 1. Echte Aufnahme
    const want = opts.voice || preferred;
    const key = !recorded ? null
      : recorded.has(audioKey(text, want)) ? audioKey(text, want)
      : recorded.has(audioKey(text, other(want))) ? audioKey(text, other(want))
      : null;
    if (key && player) {
      current = { done };
      player.src = `audio/${key}.mp3`;
      // Das Tempo-Setting ist auf die Systemstimme geeicht (0.9 = normal)
      const speed = (opts.slow ? 0.62 : 1) * (rate / 0.9);
      player.playbackRate = Math.max(0.5, Math.min(1.3, speed));
      if ('preservesPitch' in player) player.preservesPitch = true;
      player.onended = finishCurrent;
      player.onerror = () => { current = null; sayWithSystem(text, opts, done); };
      player.play().catch(() => { current = null; sayWithSystem(text, opts, done); });
      return true;
    }

    // 2./3. Systemstimme
    return sayWithSystem(text, opts, done);
  },

  stop() {
    if (player) {
      try { player.pause(); } catch { /* egal */ }
      player.onended = null;
      player.onerror = null;
    }
    if (synthOK) { try { speechSynthesis.cancel(); } catch { /* egal */ } }
    current = null;
  }
};

function other(v) { return v === 'f' ? 'm' : 'f'; }

function sayWithSystem(text, opts, done) {
  if (!synthOK) { done(); return false; }
  const voice = speech.current();
  if (!voice && !warnedNoVoice) {
    warnedNoVoice = true;
    window.dispatchEvent(new CustomEvent('speech:novoice'));
  }
  try { speechSynthesis.cancel(); } catch { /* egal */ }
  const native = (voice?.lang || '').toLowerCase().startsWith('az');
  const spoken = spokenText(text);
  const u = new SpeechSynthesisUtterance(native ? spoken : speech.toTurkish(spoken));
  if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'tr-TR'; }
  const rate = opts.rate ?? 0.9;
  u.rate = Math.max(0.3, Math.min(1.2, opts.slow ? rate * 0.6 : rate));
  u.onend = done;
  u.onerror = done;
  speechSynthesis.speak(u);
  return true;
}

/** Liste der mitgelieferten Aufnahmen laden. */
async function loadRecordings() {
  try {
    const res = await fetch('audio/manifest.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(String(res.status));
    const m = await res.json();
    recorded = new Set(m.files || []);
  } catch {
    recorded = new Set();
  }
  notify();
}

/** Systemstimmen laden – Safari liefert sie asynchron nach. */
function loadVoices() {
  if (!synthOK) return;
  const list = speechSynthesis.getVoices();
  if (list && list.length) {
    voices = list;
    notify();
  }
}

if (typeof window !== 'undefined') {
  loadRecordings();
  if (synthOK) {
    loadVoices();
    speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    // Safari meldet 'voiceschanged' nicht immer zuverlässig
    let tries = 0;
    const poll = setInterval(() => {
      loadVoices();
      if (voices.length || ++tries > 20) clearInterval(poll);
    }, 250);
  }
}
