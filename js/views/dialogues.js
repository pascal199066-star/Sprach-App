/** Dialoge zum Mitlesen und Anhören – mit Hörverstehen-Modus. */
import { DIALOGUES, DIALOG_BY_ID } from '../../data/dialogues.js';
import { esc } from '../ui.js';
import { speakBtn, backBar, icon, callout } from '../components.js';
import { speech } from '../speech.js';
import { store } from '../store.js';

let playing = null;
let hideDe = false;

export function render(params) {
  if (params.id) {
    const d = DIALOG_BY_ID[params.id];
    if (!d) return `<div class="view">${backBar('Dialoge', '#/dialogues')}<p>Dialog nicht gefunden.</p></div>`;
    return `<div class="view">
      ${backBar(d.title, '#/dialogues', d.intro)}
      <div class="row" style="gap:8px;margin-bottom:14px">
        <button class="btn primary grow" id="play-all">${icon('play')} Ganzen Dialog abspielen</button>
        <button class="btn ghost" id="toggle-de" aria-pressed="${hideDe}" title="Übersetzung ein-/ausblenden">${icon('eye')}</button>
      </div>
      <div class="card" id="dlg">
        ${d.lines.map((l, n) => `<div class="dl ${l.who === 'Du' ? 'me' : ''} ${hideDe ? 'hide-de' : ''}" data-line="${n}">
          ${speakBtn(l.az, { voice: voiceOf(d, l) })}
          <div class="bubble">
            <div class="who">${esc(l.who)}</div>
            <div class="az">${esc(l.az)}</div>
            <div class="de">${esc(l.de)}</div>
          </div>
        </div>`).join('')}
      </div>
      ${callout('tip', 'Hörverstehen üben', 'Blende mit dem Auge die Übersetzung aus, hör dir den Dialog an und prüfe dann, wie viel du verstanden hast.')}
    </div>`;
  }

  return `<div class="view">
    ${backBar('Dialoge', '#/more', 'Echte Alltagssituationen – Zeile für Zeile anhörbar')}
    <div class="menu">
    ${DIALOGUES.map(d => `<a class="menu-item" href="#/dialogues/${d.id}">
      <div class="mi nar">${icon(d.icon)}</div>
      <div class="grow"><b>${esc(d.title)}</b><small>${d.lines.length} Zeilen · ${esc(d.intro)}</small></div>
      <div class="chev">${icon('chevR')}</div>
    </a>`).join('')}
    </div>
  </div>`;
}

function voiceOf(d, line) {
  return line.who === 'Du' ? undefined : d.voices?.[line.who];
}

export function mount(params) {
  const btn = document.getElementById('play-all');
  if (!btn) return;
  const d = DIALOG_BY_ID[params.id];
  playing = null;

  document.getElementById('toggle-de').addEventListener('click', e => {
    hideDe = !hideDe;
    e.currentTarget.setAttribute('aria-pressed', String(hideDe));
    document.querySelectorAll('.dl').forEach(el => el.classList.toggle('hide-de', hideDe));
  });
  // Antippen einer verschwommenen Übersetzung deckt nur diese Zeile auf
  document.getElementById('dlg').addEventListener('click', e => {
    const de = e.target.closest('.de');
    if (de && hideDe) de.closest('.dl').classList.remove('hide-de');
  });

  btn.addEventListener('click', () => {
    if (playing) { stopAll(btn); return; }
    playing = true;
    btn.innerHTML = `${icon('stop')} Stoppen`;
    let n = 0;
    const step = () => {
      if (!playing || n >= d.lines.length) { stopAll(btn); return; }
      document.querySelectorAll('[data-line]').forEach(el =>
        el.classList.toggle('dim', el.dataset.line != n));
      document.querySelector(`[data-line="${n}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      const line = d.lines[n];
      speech.say(line.az, { rate: store.settings.rate, voice: voiceOf(d, line), onend: () => { n++; setTimeout(step, 550); } });
    };
    step();
  });
}

function stopAll(btn) {
  playing = null;
  speech.stop();
  btn.innerHTML = `${icon('play')} Ganzen Dialog abspielen`;
  document.querySelectorAll('[data-line]').forEach(el => el.classList.remove('dim'));
}
