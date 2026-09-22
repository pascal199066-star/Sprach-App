/**
 * Verteiltes Wiederholen (SM-2, vereinfacht).
 * Ein Wort wird genau dann wieder abgefragt, wenn du kurz davor bist,
 * es zu vergessen – das ist der Grund, warum Karteikästen funktionieren.
 */
import { store, today } from './store.js';

const DAY = 86400000;

/** Bewertungen */
export const AGAIN = 0, HARD = 1, GOOD = 2, EASY = 3;

export function cardOf(id) {
  return store.state.srs[id] || { reps: 0, ease: 2.5, interval: 0, due: 0, lapses: 0, seen: 0 };
}

export function grade(id, g) {
  const c = { ...cardOf(id) };
  c.seen++;
  if (g === AGAIN) {
    c.reps = 0;
    c.lapses++;
    c.interval = 0;                       // heute noch einmal
    c.ease = Math.max(1.3, c.ease - 0.2);
  } else {
    c.ease = Math.max(1.3, Math.min(2.8, c.ease + (g === EASY ? 0.15 : g === HARD ? -0.15 : 0)));
    c.reps++;
    if (c.reps === 1) c.interval = g === EASY ? 3 : 1;
    else if (c.reps === 2) c.interval = g === EASY ? 6 : 3;
    else c.interval = Math.round(c.interval * c.ease * (g === HARD ? 0.7 : 1));
    c.interval = Math.min(c.interval, 365);
  }
  c.due = Date.now() + c.interval * DAY;
  store.state.srs[id] = c;
  store.set('srs.' + id, c);
  return c;
}

/** Wort als „gesehen“ registrieren, ohne es zu bewerten. */
export function introduce(id) {
  if (store.state.srs[id]) return;
  store.set('srs.' + id, { reps: 0, ease: 2.5, interval: 0, due: Date.now(), lapses: 0, seen: 0 });
}

/** Fällige Karten, schwierigste zuerst. */
export function due(limit = 20) {
  const now = Date.now();
  return Object.entries(store.state.srs)
    .filter(([, c]) => (c.due || 0) <= now)
    .sort((a, b) => (a[1].due || 0) - (b[1].due || 0) || b[1].lapses - a[1].lapses)
    .slice(0, limit)
    .map(([id]) => id);
}

export function dueCount() {
  const now = Date.now();
  return Object.values(store.state.srs).filter(c => (c.due || 0) <= now).length;
}

/** Grobe Einordnung, wie fest ein Wort sitzt (0–1). */
export function strength(id) {
  const c = store.state.srs[id];
  if (!c) return 0;
  return Math.min(1, c.interval / 21);
}

export function learnedCount() {
  return Object.values(store.state.srs).filter(c => c.reps > 0).length;
}

export function statsByDay() {
  return store.state.stats.days || {};
}

export { today };
