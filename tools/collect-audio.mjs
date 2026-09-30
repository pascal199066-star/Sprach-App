/**
 * Sammelt jeden Text in der Zielsprache, den die App vorlesen kann – für
 * alle Sprachpakete –, und schreibt die Auftragsliste für tools/make_audio.py.
 *
 *   node tools/collect-audio.mjs        → tools/audio-jobs.json
 *   python3 tools/make_audio.py         → audio/{f,m,en-f,en-m}/*.mp3 + audio/manifest.json
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { PACKS } from '../data/active.js';
import { audioKey, cleanText, spokenText, VOICES } from '../js/audio-key.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const jobs = [];
let total = 0;
for (const [lang, P] of Object.entries(PACKS)) {
  const texts = new Set();
  const add = t => { const c = cleanText(t); if (c) texts.add(c); };

  P.VOCAB.forEach(v => { add(v.t); if (v.ex) add(v.ex); });
  P.ALPHABET.forEach(l => { add(l.ex); l.more.forEach(m => add(m.t)); });
  P.DIALOGUES.forEach(d => d.lines.forEach(l => add(l.t)));
  P.GRAMMAR.forEach(g => g.blocks.forEach(b => b.t === 'ex' && b.items.forEach(it => add(it.t))));
  P.SPEAKING.forEach(s => add(s.model));
  add(P.DEMO_SENTENCE);

  for (const text of [...texts].sort()) {
    for (const [v, meta] of Object.entries(VOICES[lang])) {
      jobs.push({ key: audioKey(text, v, lang), voice: meta.id, text, say: spokenText(text) });
    }
  }
  total += texts.size;
  console.log(`${lang}: ${texts.size} Texte`);
}

writeFileSync(join(root, 'tools/audio-jobs.json'), JSON.stringify(jobs, null, 1));
console.log(`${total} Texte → ${jobs.length} Aufnahmen in tools/audio-jobs.json`);
