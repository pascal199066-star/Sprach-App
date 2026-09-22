/** Sprachführer: alle Wörter und Wendungen, durchsuchbar. */
import { CATEGORIES, VOCAB } from '../../data/vocab.js';
import { strength } from '../srs.js';
import { store } from '../store.js';
import { esc, normalize } from '../ui.js';
import { speakBtn } from '../components.js';

let filter = { cat: 'all', q: '' };

export function render() {
  return `<div class="view">
    <h1>Sprachführer</h1>
    <p class="sub">${VOCAB.length} Wörter und Sätze – alle zum Anhören.</p>
    <input class="search" id="ph-search" type="search" placeholder="Suchen, z. B. „danke“ oder „su“"
           autocapitalize="off" autocorrect="off" spellcheck="false" value="${esc(filter.q)}">
    <div class="chips" id="ph-chips">
      <button class="chip ${filter.cat === 'all' ? 'on' : ''}" data-cat="all">Alle</button>
      ${CATEGORIES.map(c => `<button class="chip ${filter.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.icon} ${esc(c.title)}</button>`).join('')}
    </div>
    <div id="ph-list"></div>
    <div style="height:16px"></div>
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
  list();
}

function list() {
  const q = normalize(filter.q);
  const items = VOCAB.filter(v =>
    (filter.cat === 'all' || v.cat === filter.cat) &&
    (!q || normalize(v.az).includes(q) || normalize(v.de).includes(q)));

  const el = document.getElementById('ph-list');
  if (!items.length) {
    el.innerHTML = `<div class="card center" style="padding:28px"><div style="font-size:34px">🔍</div>
      <p class="muted" style="margin:8px 0 0">Nichts gefunden.</p></div>`;
    return;
  }

  const groups = {};
  items.forEach(v => (groups[v.cat] ??= []).push(v));

  el.innerHTML = Object.entries(groups).map(([cat, vs]) => {
    const c = CATEGORIES.find(x => x.id === cat);
    return `<h2>${c.icon} ${esc(c.title)}</h2>
      <div class="card">${vs.map(row).join('')}</div>`;
  }).join('');
}

function row(v) {
  const st = strength(v.id);
  const dot = st >= .8 ? '🟢' : st > 0 ? '🟡' : '';
  return `<div class="vocab-item">
    ${speakBtn(v.az)}
    <div class="grow">
      <div class="az">${esc(v.az)} ${dot}</div>
      <div class="de">${esc(v.de)}</div>
      ${store.settings.showPhonetic && v.ph ? `<div class="ph">[${esc(v.ph)}]</div>` : ''}
      ${v.note ? `<div class="muted" style="font-size:13px;margin-top:3px">${esc(v.note)}</div>` : ''}
    </div>
    ${speakBtn(v.az, { slow: true })}
  </div>`;
}
