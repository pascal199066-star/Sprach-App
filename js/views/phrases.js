/** Sprachführer: alle Wörter und Wendungen, durchsuchbar. */
import { CATEGORIES, VOCAB } from '../../data/vocab.js';
import { strength } from '../srs.js';
import { store } from '../store.js';
import { esc, md, normalize } from '../ui.js';
import { speakBtn, pageHead, icon, phon, breakdown } from '../components.js';

let filter = { cat: 'all', q: '' };
let open = null;    // aufgeklappter Eintrag

export function render() {
  return `<div class="view">
    ${pageHead('Wörter & Sätze', `${VOCAB.length} Einträge – alle zum Anhören. Tippe einen Eintrag für Details.`)}
    <div class="search-box">${icon('search')}
      <input class="search" id="ph-search" type="search" placeholder="Suchen, z. B. „danke“ oder „su“"
             autocapitalize="off" autocorrect="off" spellcheck="false" value="${esc(filter.q)}">
    </div>
    <div class="chips" id="ph-chips">
      <button class="chip ${filter.cat === 'all' ? 'on' : ''}" data-cat="all">Alle</button>
      ${CATEGORIES.map(c => `<button class="chip ${filter.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${icon(c.icon)}${esc(c.title)}</button>`).join('')}
    </div>
    <div id="ph-list"></div>
  </div>`;
}

export function mount() {
  const input = document.getElementById('ph-search');
  const chips = document.getElementById('ph-chips');
  input.addEventListener('input', () => { filter.q = input.value; list(); });
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    filter.cat = b.dataset.cat;
    chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
    list();
  });
  document.getElementById('ph-list').addEventListener('click', e => {
    if (e.target.closest('[data-say]')) return;
    const row = e.target.closest('[data-id]');
    if (!row) return;
    open = open === row.dataset.id ? null : row.dataset.id;
    list();
  });
  list();
}

function list() {
  const q = normalize(filter.q);
  const items = VOCAB.filter(v =>
    (filter.cat === 'all' || v.cat === filter.cat) &&
    (!q || normalize(v.az).includes(q) || normalize(v.de).includes(q)));

  const el = document.getElementById('ph-list');
  if (!items.length) {
    el.innerHTML = `<div class="card empty"><div class="empty-ic" style="background:var(--surface-2);color:var(--text-dim)">${icon('search')}</div>
      <p class="muted">Nichts gefunden.</p></div>`;
    return;
  }

  const groups = {};
  items.forEach(v => (groups[v.cat] ??= []).push(v));

  el.innerHTML = Object.entries(groups).map(([cat, vs]) => {
    const c = CATEGORIES.find(x => x.id === cat);
    return `<div class="sec-h">${icon(c.icon)}<h2>${esc(c.title)}</h2></div>
      <div class="card">${vs.map(row).join('')}</div>`;
  }).join('');
}

function row(v) {
  const st = strength(v.id);
  const dot = st >= .8 ? '<span class="dot-strength s2" title="sitzt fest"></span>'
    : st > 0 ? '<span class="dot-strength s1" title="in Arbeit"></span>' : '';
  const isOpen = open === v.id;
  return `<div class="vocab-item" data-id="${v.id}" style="cursor:pointer;align-items:flex-start">
    ${speakBtn(v.az)}
    <div class="grow">
      <div class="az">${esc(v.az)}${dot}</div>
      <div class="de">${esc(v.de)}</div>
      ${store.settings.showPhonetic && v.ph ? phon(v.ph) : ''}
      ${isOpen ? `${v.note ? `<div class="note-s">${md(v.note)}</div>` : ''}${breakdown(v.br)}` : ''}
    </div>
    ${isOpen ? speakBtn(v.az, { slow: true }) : (v.br || v.note ? `<span class="muted" style="margin-top:12px">${icon('chevR')}</span>` : '')}
  </div>`;
}
