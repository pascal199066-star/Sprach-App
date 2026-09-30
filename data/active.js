/**
 * Das aktive Sprachpaket. Alle Ansichten holen ihre Inhalte von hier.
 *
 * Die Pakete schreiben den Text in der Zielsprache unter ihrem Sprachkürzel
 * (`az: 'Salam'`, `en: 'Shall we get started?'`). Hier wird daraus einheitlich
 * das Feld `t` – so muss der App-Code nicht wissen, welche Sprache läuft.
 */
import { LANG, PACK_META } from '../js/lang.js';

import * as azVocab from './vocab.js';
import * as azCourse from './course.js';
import * as azGrammar from './grammar.js';
import * as azDialogues from './dialogues.js';
import * as azAlphabet from './alphabet.js';
import { DEMO_SENTENCE as AZ_DEMO } from './extra-audio.js';

import * as enVocab from './en/vocab.js';
import * as enCourse from './en/course.js';
import * as enGrammar from './en/grammar.js';
import * as enDialogues from './en/dialogues.js';
import { SPEAKING as EN_SPEAKING, DEMO_SENTENCE as EN_DEMO } from './en/speaking.js';

/** Ein Paket in die gemeinsame Form bringen (`t` = Text in der Zielsprache). */
function normalize(key, { vocab, course, grammar, dialogues, alphabet, speaking = [], demo }) {
  const t = o => ({ ...o, t: o[key] });
  const VOCAB = vocab.VOCAB.map(t);
  const VOCAB_BY_ID = Object.fromEntries(VOCAB.map(v => [v.id, v]));
  const GRAMMAR = grammar.GRAMMAR.map(g => ({
    ...g,
    blocks: g.blocks.map(b => (b.t === 'ex' ? { ...b, items: b.items.map(t) } : b))
  }));
  const DIALOGUES = dialogues.DIALOGUES.map(d => ({ ...d, lines: d.lines.map(t) }));
  const ALPHABET = (alphabet?.ALPHABET || []).map(l => ({ ...l, more: (l.more || []).map(t) }));
  const LESSONS = course.UNITS.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id, unitTitle: u.title, hue: u.hue })));
  return {
    CATEGORIES: vocab.CATEGORIES,
    VOCAB, VOCAB_BY_ID,
    UNITS: course.UNITS,
    LESSONS,
    LESSON_BY_ID: Object.fromEntries(LESSONS.map(l => [l.id, l])),
    UNIT_BY_ID: Object.fromEntries(course.UNITS.map(u => [u.id, u])),
    GRAMMAR, GRAMMAR_BY_ID: Object.fromEntries(GRAMMAR.map(g => [g.id, g])),
    DIALOGUES, DIALOG_BY_ID: Object.fromEntries(DIALOGUES.map(d => [d.id, d])),
    ALPHABET,
    TRICKY: alphabet?.TRICKY || [],
    LETTER_BY_LOW: Object.fromEntries(ALPHABET.map(l => [l.low, l])),
    SPEAKING: speaking.map(s => ({ ...s, t: s.model })),
    DEMO_SENTENCE: demo
  };
}

export const PACKS = {
  az: normalize('az', { vocab: azVocab, course: azCourse, grammar: azGrammar, dialogues: azDialogues, alphabet: azAlphabet, demo: AZ_DEMO }),
  en: normalize('en', { vocab: enVocab, course: enCourse, grammar: enGrammar, dialogues: enDialogues, speaking: EN_SPEAKING, demo: EN_DEMO })
};

const P = PACKS[LANG];

export const PACK = PACK_META;
export const {
  CATEGORIES, VOCAB, VOCAB_BY_ID, UNITS, LESSONS, LESSON_BY_ID, UNIT_BY_ID,
  GRAMMAR, GRAMMAR_BY_ID, DIALOGUES, DIALOG_BY_ID, ALPHABET, TRICKY, LETTER_BY_LOW,
  SPEAKING, DEMO_SENTENCE
} = P;

export const vocabByCat = cat => VOCAB.filter(v => v.cat === cat);

/** Alle Vokabel-IDs einer Einheit (für die Wiederholungslektion). */
export function unitItems(unitId) {
  const u = UNIT_BY_ID[unitId];
  if (!u) return [];
  return [...new Set(u.lessons.flatMap(l => l.items || []))];
}
