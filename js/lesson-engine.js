/**
 * Baut aus einer Lektionsdefinition die konkrete Übungsabfolge.
 * Der Kurs bleibt dadurch schlanke Daten – die Didaktik steckt hier.
 *
 * Jede Auswahl-Übung trägt `alts`: zu jeder Antwortmöglichkeit die
 * Gegenseite (Übersetzung). So kann die App nach einem Fehler zeigen,
 * was die gewählte Antwort eigentlich bedeutet.
 */
import { VOCAB, VOCAB_BY_ID, vocabByCat } from '../data/vocab.js';
import { ALPHABET } from '../data/alphabet.js';
import { GRAMMAR_BY_ID } from '../data/grammar.js';
import { DIALOG_BY_ID } from '../data/dialogues.js';
import { LESSON_BY_ID, unitItems } from '../data/course.js';
import { shuffle, sample, pick } from './ui.js';
import { strength } from './srs.js';

const isPhrase = v => v.az.trim().includes(' ');

/** Drei plausible falsche Antworten – bevorzugt aus derselben Kategorie, ohne Dubletten. */
function distractors(item, field, n = 3) {
  const taken = new Set([item[field]]);
  const out = [];
  const tryAdd = v => {
    if (out.length >= n || v.id === item.id || taken.has(v[field])) return;
    // Ähnlich lange Einträge zuerst: Wörter zu Wörtern, Sätze zu Sätzen
    taken.add(v[field]);
    out.push(v);
  };
  const same = shuffle(vocabByCat(item.cat)).sort((a, b) => (isPhrase(a) === isPhrase(item) ? 0 : 1) - (isPhrase(b) === isPhrase(item) ? 0 : 1));
  same.forEach(tryAdd);
  shuffle(VOCAB.filter(v => v.cat !== item.cat && isPhrase(v) === isPhrase(item))).forEach(tryAdd);
  shuffle(VOCAB).forEach(tryAdd);
  return out;
}

function chooseEx(item, promptKind) {
  // promptKind: 'az' (Wort zeigen → Deutsch wählen) | 'de' | 'audio'
  const field = promptKind === 'de' ? 'az' : 'de';
  const back = field === 'az' ? 'de' : 'az';
  const wrong = distractors(item, field);
  const all = [item, ...wrong];
  return {
    type: 'choose',
    promptKind,
    prompt: promptKind === 'de' ? item.de : item.az,
    answer: item[field],
    options: shuffle(all.map(v => v[field])),
    alts: Object.fromEntries(all.map(v => [v[field], v[back]])),
    optionLang: field === 'az' ? 'az' : 'de',
    item
  };
}

function buildEx(item) {
  const words = item.az.split(/\s+/);
  const extras = sample(
    VOCAB.filter(v => v.id !== item.id && !isPhrase(v) && !words.includes(v.az)).map(v => v.az),
    Math.min(3, Math.max(1, 6 - words.length))
  );
  return {
    type: 'build',
    prompt: item.de,
    answer: item.az,
    words,
    tokens: shuffle([...words, ...extras]),
    item
  };
}

function typeEx(item) {
  return { type: 'type', prompt: item.de, answer: item.az, item };
}

/** Übungsmix für ein einzelnes Wort. */
function exercisesFor(item) {
  const out = [chooseEx(item, 'az'), chooseEx(item, 'audio')];
  if (isPhrase(item)) out.push(buildEx(item));
  else { out.push(chooseEx(item, 'de')); out.push(typeEx(item)); }
  return out;
}

function letterExercises(letters) {
  const set = ALPHABET.filter(l => letters.includes(l.low));
  const out = [];
  set.forEach(l => {
    // Buchstaben mit gleicher Lautschrift nicht gegeneinander antreten lassen
    const others = sample(ALPHABET.filter(x => x.low !== l.low && x.ph !== l.ph), 3);
    const opts = shuffle([l, ...others]);
    out.push({
      type: 'letter-pick', letter: l,
      question: `Welcher Buchstabe klingt wie „${l.ph}“?`,
      options: opts.map(x => ({ label: x.up + ' ' + x.low, value: x.low })),
      alts: Object.fromEntries(opts.map(x => [x.low, `klingt wie „${x.ph}“`])),
      answer: l.low
    });
    const words = shuffle([l, ...sample(ALPHABET.filter(x => x.ex !== l.ex), 3)]);
    out.push({
      type: 'letter-word', letter: l,
      question: 'Welches Wort hörst du?',
      audio: l.ex,
      options: words.map(x => x.ex),
      alts: Object.fromEntries(words.map(x => [x.ex, x.exDe])),
      answer: l.ex
    });
  });
  return shuffle(out);
}

/**
 * @param {string} lessonId
 * @returns {{lesson:object, cards:Array}}
 */
export function buildLesson(lessonId) {
  const lesson = LESSON_BY_ID[lessonId];
  if (!lesson) return null;
  const cards = [];

  if (lesson.kind === 'alphabet') {
    const set = ALPHABET.filter(l => lesson.letters.includes(l.low));
    set.forEach(l => cards.push({ type: 'letter-intro', letter: l }));
    cards.push(...letterExercises(lesson.letters).slice(0, 12));
    return { lesson, cards };
  }

  if (lesson.kind === 'dialog') {
    const d = DIALOG_BY_ID[lesson.dialog];
    cards.push({ type: 'dialog', dialog: d });
    // Verständnisfragen aus den Dialogzeilen
    const lines = sample(d.lines, Math.min(5, d.lines.length));
    lines.forEach(line => {
      const others = sample(d.lines.filter(x => x.de !== line.de), 3);
      const all = [line, ...others];
      cards.push({
        type: 'choose', promptKind: 'audio', prompt: line.az,
        voice: line.who === 'Du' ? undefined : d.voices?.[line.who],
        answer: line.de, options: shuffle(all.map(x => x.de)),
        alts: Object.fromEntries(all.map(x => [x.de, x.az])),
        optionLang: 'de', item: { az: line.az, de: line.de, id: 'dlg:' + d.id }
      });
    });
    return { lesson, cards };
  }

  let items = (lesson.kind === 'review' ? unitItems(lesson.unitId) : lesson.items || [])
    .map(id => VOCAB_BY_ID[id]).filter(Boolean);
  // Wiederholung: höchstens 14 Wörter – die wackeligsten zuerst
  if (lesson.kind === 'review' && items.length > 14) {
    items = shuffle(items).sort((a, b) => strength(a.id) - strength(b.id)).slice(0, 14);
  }

  if (lesson.kind === 'grammar') {
    cards.push({ type: 'grammar', grammar: GRAMMAR_BY_ID[lesson.grammar] });
  }

  if (lesson.kind !== 'review') {
    items.forEach(it => cards.push({ type: 'intro', item: it }));
  }

  const pool = shuffle(items.flatMap(exercisesFor));
  const target = lesson.kind === 'review' ? 16 : Math.min(16, Math.max(6, items.length * 2));
  // Erst je eine Übung pro Wort, dann auffüllen – so kommt jedes Wort dran.
  const seen = new Set();
  const first = [];
  const rest = [];
  pool.forEach(ex => {
    const k = ex.item?.id;
    if (k && !seen.has(k)) { seen.add(k); first.push(ex); } else rest.push(ex);
  });
  cards.push(...shuffle([...first, ...rest.slice(0, Math.max(0, target - first.length))]));

  return { lesson, cards };
}

/** Freie Wiederholung: Karten aus beliebigen Vokabel-IDs. */
export function buildPractice(ids, count = 14) {
  const items = ids.map(id => VOCAB_BY_ID[id]).filter(Boolean);
  if (!items.length) return [];
  const pool = shuffle(items.flatMap(exercisesFor));
  const seen = new Set();
  const out = [];
  pool.forEach(ex => {
    if (out.length >= count) return;
    const k = ex.item?.id;
    if (k && seen.has(k)) return;
    seen.add(k); out.push(ex);
  });
  while (out.length < Math.min(count, items.length * 2)) out.push(pick(pool));
  return out;
}
