/** Fortschritt & Einstellungen – lokal im Gerät, nichts verlässt das iPhone. */

const KEY = 'azaz.state.v1';

const DEFAULTS = {
  settings: {
    rate: 0.9,
    voiceURI: null,
    dailyGoal: 20,        // XP pro Tag
    showPhonetic: true,   // Lautschrift einblenden
    autoPlay: true,       // Audio bei neuen Wörtern automatisch abspielen
    name: ''
  },
  lessons: {},            // lessonId → { done, score, ts }
  srs: {},                // vocabId → { reps, ease, interval, due, lapses, seen }
  stats: { streak: 0, best: 0, lastDay: null, totalXp: 0, days: {} }
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return clone(DEFAULTS);
    const parsed = JSON.parse(raw);
    return {
      settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) },
      lessons: parsed.lessons || {},
      srs: parsed.srs || {},
      stats: { ...DEFAULTS.stats, ...(parsed.stats || {}) }
    };
  } catch {
    return clone(DEFAULTS);
  }
}

let state = load();
let saveTimer = null;
const subs = new Set();

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Speichern fehlgeschlagen', e); }
  }, 120);
  subs.forEach(fn => fn(state));
}

export const today = () => new Date().toISOString().slice(0, 10);

function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
}

export const store = {
  get state() { return state; },
  get settings() { return state.settings; },
  get stats() { return state.stats; },

  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

  set(path, value) {
    const parts = path.split('.');
    let node = state;
    for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]] ??= {};
    node[parts.at(-1)] = value;
    persist();
  },

  /** XP gutschreiben, Streak fortschreiben. */
  addXp(xp) {
    const d = today();
    const s = state.stats;
    if (s.lastDay !== d) {
      const gap = s.lastDay ? daysBetween(s.lastDay, d) : 1;
      s.streak = gap === 1 ? (s.streak || 0) + 1 : 1;
      s.best = Math.max(s.best || 0, s.streak);
      s.lastDay = d;
    }
    s.days[d] = (s.days[d] || 0) + xp;
    s.totalXp = (s.totalXp || 0) + xp;
    persist();
  },

  xpToday() { return state.stats.days[today()] || 0; },

  /** Streak neu bewerten (z. B. nach einer Lernpause). */
  refreshStreak() {
    const s = state.stats;
    if (!s.lastDay) return;
    const gap = daysBetween(s.lastDay, today());
    if (gap > 1) { s.streak = 0; persist(); }
  },

  lessonState(id) { return state.lessons[id] || null; },

  completeLesson(id, score) {
    const prev = state.lessons[id];
    state.lessons[id] = {
      done: true,
      score: Math.max(score, prev?.score || 0),
      ts: Date.now(),
      times: (prev?.times || 0) + 1
    };
    persist();
  },

  reset() {
    state = clone(DEFAULTS);
    try { localStorage.removeItem(KEY); } catch { /* egal */ }
    persist();
  },

  export() { return JSON.stringify(state); }
};

store.refreshStreak();
