/**
 * Wiederholen: Karteikarten nach dem Prinzip des verteilten Lernens.
 * Zeigt Deutsch, du denkst nach, deckst auf und bewertest dich selbst.
 */
import { due, grade, dueCount, cardOf, AGAIN } from '../srs.js';
import { VOCAB, VOCAB_BY_ID } from '../../data/vocab.js';
import { store } from '../store.js';
import { esc, md, shuffle, buzz } from '../ui.js';
import { speakBtn, emptyState } from '../components.js';
import { speech } from '../speech.js';

let P = null;

export function render() {
  const n = dueCount();
  // Während einer laufenden Runde die Tableiste ausblenden, sonst verdeckt sie die Bewertung
  document.body.classList.toggle('immersive', !!P);
  if (!P) {
    return `<div class="view">
      <h1>Wiederholen</h1>
      <p class="sub">Wörter tauchen genau dann wieder auf, wenn du kurz davor bist, sie zu vergessen.</p>
      ${n > 0
        ? `<div class="card center" style="padding:26px">
            <div style="font-size:42px">🔁</div>
            <h3 style="margin:10px 0 4px">${n} ${n === 1 ? 'Wort ist' : 'Wörter sind'} fällig</h3>
            <p class="muted" style="font-size:14.5px">Etwa ${Math.max(1, Math.round(n * 0.15))} Minuten.</p>
            <button class="btn primary block" data-start="due" style="margin-top:14px">Wiederholung starten</button>
          </div>`
        : emptyState('✅', 'Alles frisch!', 'Zurzeit ist nichts fällig. Lerne eine neue Lektion oder übe frei.')}
      <h2>Freies Üben</h2>
      <p class="sub" style="margin-top:-6px">Zufällige Wörter aus allem, was du schon gesehen hast.</p>
      <button class="btn ghost block" data-start="free">15 Wörter zufällig üben</button>
      <div style="height:16px"></div>
    </div>`;
  }
  return `<div class="view" id="practice-wrap">${cardHtml()}</div>`;
}

export function mount() {
  document.querySelectorAll('[data-start]').forEach(b => {
    b.addEventListener('click', () => start(b.dataset.start));
  });
  if (P) wire();
}

function start(mode) {
  const ids = (mode === 'due'
    ? due(30)
    : shuffle(Object.keys(store.state.srs)).slice(0, 15)
  ).filter(id => VOCAB_BY_ID[id]);
  // Nichts Passendes gefunden? Dann einfach zufällige Wörter – eine leere Runde hilft niemandem.
  const pool = ids.length ? ids : shuffle(VOCAB.map(v => v.id)).slice(0, 15);
  P = { queue: pool, i: 0, shown: false, initial: pool.length };
  repaint();
}

function cardHtml() {
  if (P.i >= P.queue.length) return summary();
  const v = VOCAB_BY_ID[P.queue[P.i]];
  const c = cardOf(v.id);
  const pct = Math.round(P.i / P.queue.length * 100);

  return `<div class="lesson-top">
      <button class="x" data-quit aria-label="Beenden">✕</button>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="muted" style="font-size:13px;font-weight:700;min-width:38px;text-align:right">${P.i}/${P.queue.length}</div>
    </div>

    <div class="card center" style="padding:34px 20px;min-height:230px;display:flex;flex-direction:column;justify-content:center">
      <div class="q" style="margin:0 0 10px">${c.reps === 0 ? 'Neu' : `Intervall: ${c.interval || 0} ${c.interval === 1 ? 'Tag' : 'Tage'}`}</div>
      <div class="prompt-mid">${esc(v.de)}</div>
      ${P.shown ? `
        <div style="margin-top:20px;padding-top:18px;border-top:.5px solid var(--line)">
          <div class="prompt-big az">${esc(v.az)}</div>
          ${v.ph ? `<div class="ph">[${esc(v.ph)}]</div>` : ''}
          <div class="row" style="justify-content:center;gap:10px;margin-top:14px">
            ${speakBtn(v.az, { size: 'lg' })}${speakBtn(v.az, { slow: true })}
          </div>
        </div>` : ''}
    </div>

    ${P.shown && v.note ? `<div class="note"><b>Hinweis:</b> ${md(v.note)}</div>` : ''}

    <div class="verdict">
      ${P.shown ? `
        <div class="q" style="margin-bottom:8px">Wie gut wusstest du es?</div>
        <div class="row" style="gap:7px">
          <button class="btn danger grow small" data-grade="0">Nochmal</button>
          <button class="btn ghost grow small" data-grade="1">Schwer</button>
          <button class="btn ghost grow small" data-grade="2">Gut</button>
          <button class="btn primary grow small" data-grade="3">Einfach</button>
        </div>`
      : `<button class="btn primary block" data-show>Antwort zeigen</button>`}
    </div>`;
}

function summary() {
  const n = P.initial;
  P = null;
  document.body.classList.remove('immersive');
  return `<div class="view center" style="padding-top:36px">
    <div class="confetti">🧠</div>
    <h1>Durchgearbeitet</h1>
    <p class="sub">${n} ${n === 1 ? 'Wort' : 'Wörter'} wiederholt.</p>
    <div class="stack" style="margin-top:22px">
      <a class="btn primary block" href="#/home" style="text-decoration:none">Zur Übersicht</a>
      <button class="btn ghost block" data-again>Noch eine Runde</button>
    </div>
  </div>`;
}

function repaint() {
  const app = document.getElementById('app');
  document.body.classList.toggle('immersive', !!P);
  if (!P) { app.innerHTML = render(); mount(); return; }
  if (P.i >= P.queue.length) {
    app.innerHTML = `<div class="view">${cardHtml()}</div>`;
    app.querySelector('[data-again]')?.addEventListener('click', () => start('due'));
    return;
  }
  const wrap = document.getElementById('practice-wrap');
  if (wrap) { wrap.innerHTML = cardHtml(); } else { app.innerHTML = `<div class="view" id="practice-wrap">${cardHtml()}</div>`; }
  wire();
}

function wire() {
  const root = document.getElementById('practice-wrap');
  if (!root) return;
  root.querySelector('[data-quit]')?.addEventListener('click', () => { P = null; speech.stop(); repaint(); });
  root.querySelector('[data-show]')?.addEventListener('click', () => {
    P.shown = true;
    const v = VOCAB_BY_ID[P.queue[P.i]];
    repaint();
    if (store.settings.autoPlay) setTimeout(() => speech.say(v.az, { rate: store.settings.rate }), 160);
  });
  root.querySelectorAll('[data-grade]').forEach(b => {
    b.addEventListener('click', () => {
      const g = +b.dataset.grade;
      const id = P.queue[P.i];
      grade(id, g);
      buzz(8);
      store.addXp(g === AGAIN ? 1 : 2);
      if (g === AGAIN) P.queue.push(id);   // heute noch einmal
      P.i++;
      P.shown = false;
      speech.stop();
      repaint();
    });
  });
}
