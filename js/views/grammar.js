/** Grammatik: Übersicht und einzelne Kapitel. */
import { GRAMMAR, GRAMMAR_BY_ID } from '../../data/grammar.js';
import { esc, md } from '../ui.js';
import { speakBtn, backBar } from '../components.js';

/** Rendert die Blöcke eines Kapitels – wird auch vom Lektions-Player benutzt. */
export function grammarBlocks(g) {
  return g.blocks.map(b => {
    switch (b.t) {
      case 'p':
        return `<p class="gr-block">${md(b.text)}</p>`;
      case 'rule':
        return `<div class="rule"><b class="t">${esc(b.title)}</b>${md(b.text)}</div>`;
      case 'table':
        return `<div class="table-wrap"><table>
          <thead><tr>${b.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
          <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>`;
      case 'ex':
        return `<div class="gr-block">${b.items.map(it => `
          <div class="vocab-item">
            ${speakBtn(it.az)}
            <div class="grow">
              <div class="az">${esc(it.az)}</div>
              <div class="de">${esc(it.de)}</div>
            </div>
          </div>`).join('')}</div>`;
      default:
        return '';
    }
  }).join('');
}

export function render(params) {
  if (params.id) {
    const g = GRAMMAR_BY_ID[params.id];
    if (!g) return `<div class="view">${backBar('Grammatik', '#/grammar')}<p>Kapitel nicht gefunden.</p></div>`;
    const idx = GRAMMAR.findIndex(x => x.id === g.id);
    const next = GRAMMAR[idx + 1];
    return `<div class="view">
      ${backBar(g.title, '#/grammar')}
      <p class="sub" style="margin-top:-8px">${esc(g.subtitle)} · ${g.minutes} Min.</p>
      <div class="card">${grammarBlocks(g)}</div>
      ${next ? `<a class="btn ghost block" href="#/grammar/${next.id}" style="text-decoration:none">Weiter: ${esc(next.title)} ›</a>` : ''}
      <div style="height:16px"></div>
    </div>`;
  }

  return `<div class="view">
    ${backBar('Grammatik', '#/more')}
    <p class="sub" style="margin-top:-8px">Elf kurze Kapitel – zusammen das komplette Grundgerüst.</p>
    ${GRAMMAR.map((g, n) => `<a class="lesson" href="#/grammar/${g.id}" style="text-decoration:none;color:inherit">
      <div class="dot">${n + 1}</div>
      <div class="grow"><b>${esc(g.title)}</b><small>${esc(g.subtitle)} · ${g.minutes} Min.</small></div>
      <div class="chev">›</div>
    </a>`).join('')}
    <div style="height:16px"></div>
  </div>`;
}
