/**
 * Sprachausgabe.
 *
 * iOS/Safari bringt keine aserbaidschanische Stimme mit. Türkisch und
 * Aserbaidschanisch sind phonologisch aber nahezu deckungsgleich, deshalb
 * sprechen wir den Text mit der türkischen Systemstimme – nachdem wir die
 * drei Buchstaben angepasst haben, die es im Türkischen nicht gibt:
 *
 *   ə → e   (offenes ä; türkisches e ist in geschlossener Silbe [æ])
 *   q → g   (aserb. q wird ohnehin [g] gesprochen)
 *   x → h   (nächste verfügbare Annäherung an [x])
 *
 * Findet sich doch eine echte az-Stimme (manche Android-Geräte, künftige
 * iOS-Versionen), wird der Originaltext unverändert gesprochen.
 */

const AZ_TO_TR = { 'ə': 'e', 'Ə': 'E', 'q': 'g', 'Q': 'G', 'x': 'h', 'X': 'H' };

let voices = [];
let chosen = null;          // vom Nutzer in den Einstellungen gewählte voiceURI
let unlocked = false;
let warnedNoVoice = false;
const listeners = new Set();

export const speech = {
  supported: typeof window !== 'undefined' && 'speechSynthesis' in window,

  /** Für die türkische Stimme lesbar machen. */
  toTurkish(text) {
    return String(text).replace(/[əƏqQxX]/g, c => AZ_TO_TR[c]);
  },

  /** Alle Stimmen, die für Aserbaidschanisch in Frage kommen – beste zuerst. */
  candidates() {
    const score = v => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      if (l.startsWith('az')) return 0;
      if (l.startsWith('tr')) return 1;
      return 9;
    };
    return voices.filter(v => score(v) < 9).sort((a, b) => score(a) - score(b));
  },

  /** Die Stimme, die tatsächlich benutzt wird. */
  current() {
    if (chosen) {
      const v = voices.find(v => v.voiceURI === chosen);
      if (v) return v;
    }
    return this.candidates()[0] || null;
  },

  /** Gibt es überhaupt eine brauchbare Stimme? */
  get quality() {
    const v = this.current();
    if (!v) return 'none';
    const l = (v.lang || '').toLowerCase();
    return l.startsWith('az') ? 'native' : l.startsWith('tr') ? 'turkish' : 'fallback';
  },

  setVoice(uri) { chosen = uri || null; },

  onVoicesChanged(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  /**
   * iOS gibt Sprachausgabe erst nach einer echten Nutzerinteraktion frei.
   * Wird einmalig beim ersten Tippen aufgerufen.
   */
  unlock() {
    if (unlocked || !this.supported) return;
    try {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      speechSynthesis.speak(u);
      unlocked = true;
    } catch { /* still ignorieren */ }
  },

  /**
   * Spricht aserbaidschanischen Text.
   * @param {string} text
   * @param {{rate?:number, slow?:boolean, onend?:Function}} [opts]
   */
  say(text, opts = {}) {
    if (!this.supported || !text) return false;
    const voice = this.current();
    if (!voice && !warnedNoVoice) {
      warnedNoVoice = true;
      window.dispatchEvent(new CustomEvent('speech:novoice'));
    }
    try { speechSynthesis.cancel(); } catch { /* egal */ }

    const native = (voice?.lang || '').toLowerCase().startsWith('az');
    const u = new SpeechSynthesisUtterance(native ? text : this.toTurkish(text));
    if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'tr-TR'; }
    u.rate = Math.max(0.3, Math.min(1.2, opts.slow ? (opts.rate ?? 0.9) * 0.6 : (opts.rate ?? 0.9)));
    u.pitch = 1;
    u.volume = 1;
    if (opts.onend) { u.onend = opts.onend; u.onerror = opts.onend; }
    speechSynthesis.speak(u);
    return true;
  },

  stop() { if (this.supported) { try { speechSynthesis.cancel(); } catch { /* egal */ } } }
};

/** Stimmenliste laden – Safari liefert sie asynchron nach. */
function loadVoices() {
  if (!speech.supported) return;
  const list = speechSynthesis.getVoices();
  if (list && list.length) {
    voices = list;
    listeners.forEach(fn => fn(voices));
  }
}

if (speech.supported) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
  // Safari meldet 'voiceschanged' nicht immer zuverlässig
  let tries = 0;
  const poll = setInterval(() => {
    loadVoices();
    if (voices.length || ++tries > 20) clearInterval(poll);
  }, 250);
}
