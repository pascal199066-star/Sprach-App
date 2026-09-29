/** Alphabet-Übersicht und Buchstaben-Detail. */
import { ALPHABET, TRICKY } from '../../data/alphabet.js';
import { VOCAB } from '../../data/vocab.js';
import { esc } from '../ui.js';
import { speakBtn, backBar, pageHead, icon, callout } from '../components.js';

export function render(params) {
  if (params.id) return detail(decodeURIComponent(params.id));

  return `<div class="view">
    ${pageHead('Alphabet', '32 Buchstaben – und jeder wird immer gleich gesprochen. Keine Ausnahmen wie im Deutschen.')}
    <div class="legend"><i></i>Diese Buchstaben klingen anders, als Deutsche erwarten.</div>
    <div class="letters">
      ${ALPHABET.map(l => `<a class="letter ${TRICKY.includes(l.low) ? 'tricky' : ''}" href="#/alphabet/${encodeURIComponent(l.low)}">
        <b>${l.up}${l.low}</b>
        <small>${esc(l.ph)}</small>
      </a>`).join('')}
    </div>
    ${callout('info', 'Lautschrift lesen', 'Unter den Wörtern steht eine deutsche Lautschrift. **GROSS** geschrieben ist die betonte Silbe, **ß** steht für das scharfe s. Mehr dazu unter **Mehr → Aussprache-Hilfe**.')}
  </div>`;
}

function detail(low) {
  const i = ALPHABET.findIndex(l => l.low === low);
  if (i < 0) return `<div class="view">${backBar('Alphabet', '#/alphabet')}<p>Buchstabe nicht gefunden.</p></div>`;
  const l = ALPHABET[i];
  const prev = ALPHABET[i - 1], next = ALPHABET[i + 1];

  // Wörter aus dem Kurs, die diesen Buchstaben enthalten – kurze zuerst
  const words = VOCAB.filter(v => !v.az.includes(' ') && v.az.toLowerCase().includes(l.low) && v.az !== l.ex)
    .sort((a, b) => a.az.length - b.az.length).slice(0, 5);
  const examples = [{ az: l.ex, de: l.exDe }, ...(l.more || []), ...words.map(v => ({ az: v.az, de: v.de }))]
    .filter((x, n, arr) => arr.findIndex(y => y.az === x.az) === n).slice(0, 7);

  return `<div class="view">
    ${backBar(`Buchstabe ${l.up}`, '#/alphabet', `${i + 1} von ${ALPHABET.length}`)}
    <div class="card letter-hero">
      <div class="big">${l.up}<span> ${l.low}</span></div>
      <div class="ipa">klingt wie <b>„${esc(l.ph)}“</b> · ${esc(l.ipa)}</div>
    </div>

    ${callout('tip', 'Merke', l.tip)}

    <div class="sec-h">${icon('speaker')}<h2>Zum Anhören</h2></div>
    <div class="card">
      ${examples.map(x => `<div class="vocab-item">${speakBtn(x.az)}
        <div class="grow"><div class="az">${highlight(x.az, l.low)}</div><div class="de">${esc(x.de)}</div></div>
        ${speakBtn(x.az, { slow: true })}
      </div>`).join('')}
    </div>

    <div class="row" style="gap:10px;margin-top:6px">
      ${prev ? `<a class="btn ghost grow" href="#/alphabet/${encodeURIComponent(prev.low)}">${icon('chevL')} ${prev.up}${prev.low}</a>` : '<div class="grow"></div>'}
      ${next ? `<a class="btn ghost grow" href="#/alphabet/${encodeURIComponent(next.low)}">${next.up}${next.low} ${icon('chevR')}</a>` : '<div class="grow"></div>'}
    </div>
  </div>`;
}

/** Den Buchstaben im Wort farbig hervorheben. */
function highlight(word, low) {
  return [...word].map(ch => ch.toLowerCase() === low || (low === 'i' && ch === 'İ') || (low === 'ı' && ch === 'I')
    ? `<span style="color:var(--nar)">${esc(ch)}</span>` : esc(ch)).join('');
}
