/** Dialoge zum Mitlesen und Anhören. */
import { DIALOGUES, DIALOG_BY_ID } from '../../data/dialogues.js';
import { esc } from '../ui.js';
import { speakBtn, backBar } from '../components.js';
import { speech } from '../speech.js';
import { store } from '../store.js';

let playing = null;

export function render(params) {
  if (params.id) {
    const d = DIALOG_BY_ID[params.id];
    if (!d) return `<div class="view">${backBar('Dialoge', '#/dialogues')}<p>Dialog nicht gefunden.</p></div>`;
    return `<div class="view">
      ${backBar(d.title, '#/dialogues')}
      <p class="sub" style="margin-top:-8px">${esc(d.intro)}</p>
      <button class="btn primary block" id="play-all" style="margin-bottom:14px">▶︎ Ganzen Dialog abspielen</button>
      <div class="card">
        ${d.lines.map((l, n) => `<div class="dl ${l.who === 'Du' ? 'me' : ''}" data-line="${n}">
          ${speakBtn(l.az)}
          <div class="bubble">
            <div class="who">${esc(l.who)}</div>
            <div class="az">${esc(l.az)}</div>
            <div class="muted" style="font-size:14.5px">${esc(l.de)}</div>
          </div>
        </div>`).join('')}
      </div>
      <div style="height:16px"></div>
    </div>`;
  }

  return `<div class="view">
    ${backBar('Dialoge', '#/more')}
    <p class="sub" style="margin-top:-8px">Echte Alltagssituationen – Zeile für Zeile anhörbar.</p>
    ${DIALOGUES.map(d => `<a class="lesson" href="#/dialogues/${d.id}" style="text-decoration:none;color:inherit">
      <div class="dot">${d.icon}</div>
      <div class="grow"><b>${esc(d.title)}</b><small>${d.lines.length} Zeilen · ${esc(d.intro)}</small></div>
      <div class="chev">›</div>
    </a>`).join('')}
    <div style="height:16px"></div>
  </div>`;
}

export function mount(params) {
  const btn = document.getElementById('play-all');
  if (!btn) return;
  const d = DIALOG_BY_ID[params.id];
  btn.addEventListener('click', () => {
    if (playing) { stopAll(btn); return; }
    playing = true;
    btn.textContent = '■ Stoppen';
    let n = 0;
    const step = () => {
      if (!playing || n >= d.lines.length) { stopAll(btn); return; }
      document.querySelectorAll('[data-line]').forEach(el =>
        el.style.opacity = el.dataset.line == n ? '1' : '.45');
      speech.say(d.lines[n].az, { rate: store.settings.rate, onend: () => { n++; setTimeout(step, 450); } });
    };
    step();
  });
}

function stopAll(btn) {
  playing = null;
  speech.stop();
  btn.textContent = '▶︎ Ganzen Dialog abspielen';
  document.querySelectorAll('[data-line]').forEach(el => el.style.opacity = '1');
}
