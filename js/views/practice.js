/**
 * Wiederholen: Karteikarten nach dem Prinzip des verteilten Lernens.
 * Zeigt Deutsch, du denkst nach (oder sprichst laut), deckst auf und bewertest dich selbst.
 */
import { due, grade, dueCount, cardOf, AGAIN } from '../srs.js';
import { VOCAB, VOCAB_BY_ID } from '../../data/vocab.js';
import { store } from '../store.js';
import { esc, md, shuffle, buzz } from '../ui.js';
import { speakBtn, emptyState, pageHead, icon, phon, breakdown, soundTips, progressBar } from '../components.js';
import { speech } from '../speech.js';

let P = null;

export function render() {
  const n = dueCount();
  // Während einer laufenden Runde die Tableiste ausblenden, sonst verdeckt sie die Bewertung
  document.body.classList.toggle('immersive', !!P);
  if (!P) {
    const seen = Object.keys(store.state.srs).filter(id => VOCAB_BY_ID[id]).length;
    return `<div class="view">
      ${pageHead('Wiederholen', 'Wörter tauchen genau dann wieder auf, wenn du kurz davor bist, sie zu vergessen.')}
      ${n > 0
        ? `<div class="hero">
            <div class="eyebrow">Fällig</div>
            <h2>${n} ${n === 1 ? 'Wort wartet' : 'Wörter warten'}</h2>
            <p>Etwa ${Math.max(1, Math.round(n * 0.15))} ${Math.round(n * 0.15) > 1 ? 'Minuten' : 'Minute'}. Sag die Antwort laut, bevor du aufdeckst – das wirkt doppelt.</p>
            <button class="btn white block" data-start="due">${icon('play')} Wiederholung starten</button>
          </div>`
        : emptyState('check', 'Alles frisch!', 'Zurzeit ist nichts fällig. Lerne eine neue Lektion oder übe frei.')}
      <div class="sec-h">${icon('repeat')}<h2>Freies Üben</h2></div>
      <p class="sub" style="margin:-4px 0 12px">${seen ? `Zufällige Wörter aus den ${seen}, die du schon kennst.` : 'Zufällige Wörter aus dem ganzen Kurs.'}</p>
      <button class="btn ghost block" data-start="free">15 Wörter üben</button>
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
      <button class="icon-btn" data-quit aria-label="Beenden">${icon('x')}</button>
      ${progressBar(pct)}
      <div class="count">${P.i}/${P.queue.length}</div>
    </div>

    <div class="grow">
      <div class="q">${icon('repeat')}${c.reps === 0 ? 'Neu im Karteikasten' : `Zuletzt vor ${c.interval || 0} ${c.interval === 1 ? 'Tag' : 'Tagen'} gewusst`}</div>
      <div class="card stage" style="min-height:250px;display:flex;flex-direction:column;justify-content:center">
        <div class="prompt-mid">${esc(v.de)}</div>
        ${P.shown ? `
          <div style="margin-top:20px;padding-top:18px;border-top:1px solid var(--line)">
            <div class="prompt-big az">${esc(v.az)}</div>
            ${store.settings.showPhonetic ? phon(v.ph) : ''}
            <div class="speakers">${speakBtn(v.az, { size: 'lg' })}${speakBtn(v.az, { slow: true })}</div>
            ${soundTips(v.az)}
            ${breakdown(v.br)}
          </div>` : `<p class="muted" style="margin:16px 0 0;font-size:14.5px">Wie heißt das auf Aserbaidschanisch?</p>`}
      </div>
      ${P.shown && v.note ? `<div class="callout tip">${icon('bulb')}<div class="grow">${md(v.note)}</div></div>` : ''}
    </div>

    <div class="verdict plain">
      ${P.shown ? `
        <div class="q" style="margin-bottom:10px;justify-content:center">Wie gut wusstest du es?</div>
        <div class="row" style="gap:7px">
          <button class="btn danger grow small" data-grade="0">Nochmal</button>
          <button class="btn ghost grow small" data-grade="1">Schwer</button>
          <button class="btn ghost grow small" data-grade="2">Gut</button>
          <button class="btn primary grow small" data-grade="3">Leicht</button>
        </div>`
      : `<button class="btn primary block" data-show>${icon('eye')} Aufdecken</button>`}
    </div>`;
}

function summary() {
  const n = P.initial;
  P = null;
  document.body.classList.remove('immersive');
  return `<div class="view">
    <div class="done-hero">
      <div class="medal pop good">${icon('check')}</div>
      <h1>Durchgearbeitet</h1>
      <p class="sub">${n} ${n === 1 ? 'Wort' : 'Wörter'} wiederholt. Die nächsten kommen, wenn es Zeit ist.</p>
    </div>
    <div class="stack" style="margin-top:22px">
      <a class="btn primary block" href="#/home">Zur Übersicht</a>
      <button class="btn ghost block" data-again>Noch eine Runde</button>
    </div>
  </div>`;
}

function repaint() {
  const app = document.getElementById('app');
  document.body.classList.toggle('immersive', !!P);
  if (!P) { app.innerHTML = render(); mount(); return; }
  if (P.i >= P.queue.length) {
    app.innerHTML = cardHtml();
    app.querySelector('[data-again]')?.addEventListener('click', () => start(dueCount() ? 'due' : 'free'));
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
