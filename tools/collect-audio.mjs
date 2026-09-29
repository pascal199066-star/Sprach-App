/**
 * Sammelt jeden aserbaidschanischen Text, den die App vorlesen kann,
 * und schreibt die Auftragsliste für tools/make_audio.py.
 *
 *   node tools/collect-audio.mjs        → tools/audio-jobs.json
 *   python3 tools/make_audio.py         → audio/{f,m}/*.mp3 + audio/manifest.json
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { VOCAB } from '../data/vocab.js';
import { ALPHABET } from '../data/alphabet.js';
import { GRAMMAR } from '../data/grammar.js';
import { DIALOGUES } from '../data/dialogues.js';
import { EXTRA_AUDIO } from '../data/extra-audio.js';
import { audioKey, cleanText, spokenText, VOICES } from '../js/audio-key.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const texts = new Set();
const add = t => { const c = cleanText(t); if (c) texts.add(c); };

VOCAB.forEach(v => add(v.az));
ALPHABET.forEach(l => { add(l.ex); (l.more || []).forEach(m => add(m.az)); });
DIALOGUES.forEach(d => d.lines.forEach(l => add(l.az)));
GRAMMAR.forEach(g => g.blocks.forEach(b => b.t === 'ex' && b.items.forEach(it => add(it.az))));
EXTRA_AUDIO.forEach(add);

const jobs = [];
for (const text of [...texts].sort()) {
  for (const [v, meta] of Object.entries(VOICES)) {
    jobs.push({ key: audioKey(text, v), voice: meta.id, text, say: spokenText(text) });
  }
}

writeFileSync(join(root, 'tools/audio-jobs.json'), JSON.stringify(jobs, null, 1));
console.log(`${texts.size} Texte → ${jobs.length} Aufnahmen in tools/audio-jobs.json`);
