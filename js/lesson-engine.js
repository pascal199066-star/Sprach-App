/**
 * Baut aus einer Lektionsdefinition die konkrete Übungsabfolge.
 * Der Kurs bleibt dadurch schlanke Daten – die Didaktik steckt hier.
 */
import { VOCAB, VOCAB_BY_ID, vocabByCat } from '../data/vocab.js';
import { ALPHABET } from '../data/alphabet.js';
import { GRAMMAR_BY_ID } from '../data/grammar.js';
import { DIALOG_BY_ID } from '../data/dialogues.js';
import { LESSON_BY_ID, unitItems } from '../data/course.js';
import { shuffle, sample, pick } from './ui.js';

const isPhrase = v => v.az.trim().includes(' ');

/** Drei plausible falsche Antworten – bevorzugt aus derselben Kategorie. */
function distractors(item, field, n = 3) {
  const pool = vocabByCat(item.cat).filter(v => v.id !== item.id && v[field] !== item[field]);
  const extra = VOCAB.filter(v => v.id !== item.id && v.cat !== item.cat);
  const chosen = sample(pool, n);
  if (chosen.length < n) chosen.push(...sample(extra, n - chosen.length));
  return chosen.map(v => v[field]);
}

function chooseEx(item, promptKind) {
  // promptKind: 'az' (Wort zeigen → Deutsch wählen) | 'de' | 'audio'
  const field = promptKind === 'de' ? 'az' : 'de';
  const options = shuffle([item[field], ...distractors(item, field)]);
  return {
    type: 'choose',
    promptKind,
    prompt: promptKind === 'de' ? item.de : item.az,
    answer: item[field],
    options,
    optionLang: field === 'az' ? 'az' : 'de',
    item
  };
}

function buildEx(item) {
  const words = item.az.split(/\s+/);
  const extras = sample(
    VOCAB.filter(v => v.id !== item.id && !isPhrase(v)).map(v => v.az),
    Math.min(2, Math.max(0, 5 - words.length))
  );
  return {
    type: 'build',
    prompt: item.de,
    answer: item.az,
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
    const others = sample(ALPHABET.filter(x => x.low !== l.low), 3);
    out.push({
      type: 'letter-pick', letter: l,
      question: `Welcher Buchstabe klingt wie „${l.ph}“?`,
      options: shuffle([l, ...others]).map(x => ({ label: x.up + ' ' + x.low, value: x.low })),
      answer: l.low
    });
    out.push({
      type: 'letter-word', letter: l,
      question: 'Welches Wort hörst du?',
      audio: l.ex,
      options: shuffle([l.ex, ...sample(ALPHABET.filter(x => x.ex !== l.ex), 3).map(x => x.ex)]),
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
      const others = sample(d.lines.filter(x => x.de !== line.de), 3).map(x => x.de);
      cards.push({
        type: 'choose', promptKind: 'audio', prompt: line.az,
        answer: line.de, options: shuffle([line.de, ...others]),
        optionLang: 'de', item: { az: line.az, de: line.de, id: 'dlg:' + d.id }
      });
    });
    return { lesson, cards };
  }

  const items = (lesson.kind === 'review' ? unitItems(lesson.unitId) : lesson.items || [])
    .map(id => VOCAB_BY_ID[id]).filter(Boolean);

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
