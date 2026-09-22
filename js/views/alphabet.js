/** Alphabet-Übersicht und Buchstaben-Detail. */
import { ALPHABET, TRICKY } from '../../data/alphabet.js';
import { esc, md } from '../ui.js';
import { speakBtn, backBar } from '../components.js';

export function render(params) {
  if (params.id) return detail(decodeURIComponent(params.id));

  return `<div class="view">
    <h1>Alphabet</h1>
    <p class="sub">32 Buchstaben. Jeder wird immer gleich gesprochen – anders als im Deutschen gibt es keine Ausnahmen.</p>

    <div class="card tight" style="margin:14px 0">
      <div class="row"><div style="font-size:22px">💡</div>
      <div class="grow" style="font-size:14.5px">Die acht hervorgehobenen Buchstaben sind die, bei denen Deutsche am häufigsten danebenliegen. Tippe einen Buchstaben für Details.</div></div>
    </div>

    <div class="letters">
      ${ALPHABET.map(l => `<a class="letter ${TRICKY.includes(l.low) ? 'tricky' : ''}" href="#/alphabet/${encodeURIComponent(l.low)}" style="text-decoration:none;color:inherit">
        <b>${l.up} ${l.low}</b>
        <small>„${esc(l.ph)}“</small>
      </a>`).join('')}
    </div>
    <div style="height:16px"></div>
  </div>`;
}

function detail(low) {
  const i = ALPHABET.findIndex(l => l.low === low);
  if (i < 0) return `<div class="view">${backBar('Alphabet', '#/alphabet')}<p>Buchstabe nicht gefunden.</p></div>`;
  const l = ALPHABET[i];
  const prev = ALPHABET[i - 1], next = ALPHABET[i + 1];

  return `<div class="view">
    ${backBar('Buchstabe', '#/alphabet')}
    <div class="card letter-hero">
      <div class="big">${l.up} ${l.low}</div>
      <div class="ipa">klingt wie <b>„${esc(l.ph)}“</b> · ${esc(l.ipa)}</div>
    </div>

    <div class="note"><b>Merke:</b> ${md(l.tip)}</div>

    <h2>Beispielwort</h2>
    <div class="card row">
      ${speakBtn(l.ex, { size: 'lg' })}
      <div class="grow">
        <div class="az" style="font-size:24px">${esc(l.ex)}</div>
        <div class="muted">${esc(l.exDe)}</div>
      </div>
      ${speakBtn(l.ex, { slow: true })}
    </div>

    <h2>Alle Wörter mit „${l.low}“</h2>
    <div class="card">
      ${ALPHABET.filter(x => x.ex.includes(l.low) && x.low !== l.low).slice(0, 6).map(x => `
        <div class="vocab-item">${speakBtn(x.ex)}
          <div class="grow"><div class="az">${esc(x.ex)}</div><div class="de">${esc(x.exDe)}</div></div>
        </div>`).join('') || '<p class="muted" style="margin:0">Keine weiteren Beispiele.</p>'}
    </div>

    <div class="row" style="gap:8px;margin-top:8px">
      ${prev ? `<a class="btn ghost grow" href="#/alphabet/${encodeURIComponent(prev.low)}" style="text-decoration:none">‹ ${prev.up} ${prev.low}</a>` : '<div class="grow"></div>'}
      ${next ? `<a class="btn ghost grow" href="#/alphabet/${encodeURIComponent(next.low)}" style="text-decoration:none">${next.up} ${next.low} ›</a>` : '<div class="grow"></div>'}
    </div>
    <div style="height:16px"></div>
  </div>`;
}
