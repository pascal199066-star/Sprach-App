/**
 * Sprechen – Training für flüssiges Sprechen.
 *
 *  Satz-Sprint:     deutscher Satz → in wenigen Sekunden laut in der
 *                   Zielsprache sagen → Lösung hören → selbst bewerten.
 *                   Der Zeitdruck trainiert, nicht erst im Kopf zu übersetzen.
 *  Freies Sprechen: eine Business-Situation, 60 Sekunden am Stück reden,
 *                   aufnehmen, mit einer Musterantwort vergleichen.
 */
import { VOCAB, SPEAKING, PACK } from '../../data/active.js';
import { store } from '../store.js';
import { grade, introduce, AGAIN, HARD, GOOD } from '../srs.js';
import { esc, shuffle, toast, buzz } from '../ui.js';
import { speakBtn, pageHead, backBar, icon, progressBar, ring, exampleLine, callout, emptyState } from '../components.js';
import { speech } from '../speech.js';
import { recorder } from '../recorder.js';

const TOPIC_SECONDS = 60;
let R = null;        // laufender Sprint
let timer = null;

const sprintable = v => v.t.includes(' ') && !v.t.includes('…');

function clearTimer() { clearInterval(timer); timer = null; }

export function render(params) {
  clearTimer();
  recorder.discard();
  if (params.id) return topicView(params.id);
  document.body.classList.toggle('immersive', !!R);
  if (R) return `<div class="view" id="sprint-wrap">${sprintHtml()}</div>`;

  const doneTopics = SPEAKING.filter(t => store.lessonState('sp:' + t.id)?.done).length;
  return `<div class="view">
    ${pageHead('Sprechen', 'Flüssig wird man nur durch lautes Sprechen – auch wenn es anfangs holpert.')}

    <div class="hero">
      <div class="eyebrow">Satz-Sprint · 10 Sätze</div>
      <h2>Schnell antworten</h2>
      <p>Du siehst einen deutschen Satz und hast ein paar Sekunden, ihn laut auf ${esc(PACK.name)} zu sagen. Dann hörst du die Lösung.</p>
      <button class="btn white block" data-sprint>${icon('timer')} Sprint starten</button>
    </div>

    ${SPEAKING.length ? `
      <div class="sec-h">${icon('mic')}<h2>Freies Sprechen</h2><span class="muted" style="margin-left:auto;font-size:13px;font-weight:700">${doneTopics}/${SPEAKING.length}</span></div>
      <p class="sub" style="margin:-4px 0 12px">Eine Minute am Stück über eine echte Business-Situation. Mit Aufnahme und Musterantwort.</p>
      <div class="menu">${SPEAKING.map(t => {
        const done = store.lessonState('sp:' + t.id)?.done;
        return `<a class="menu-item" href="#/speak/${t.id}">
          <div class="mi ${done ? 'good' : ''}">${icon(done ? 'check' : t.icon)}</div>
          <div class="grow"><b>${esc(t.title)}</b><small>${esc(t.task)}</small></div>
          <div class="chev">${icon('chevR')}</div>
        </a>`;
      }).join('')}</div>` : ''}

    ${callout('tip', 'So holst du am meisten raus', 'Sprich **wirklich laut**, nicht im Kopf. Fehler sind erlaubt – wichtig ist, nicht abzubrechen. Fehlt ein Wort, umschreib es oder nutz eine Fluency-Formel wie „What’s the word I’m looking for?“.')}
  </div>`;
}

export function mount(params) {
  if (params.id) { mountTopic(params.id); return; }
  document.querySelector('[data-sprint]')?.addEventListener('click', startSprint);
  if (R) wireSprint();
}

/* ------------------------------------------------------------- Satz-Sprint */

function startSprint() {
  const pool = VOCAB.filter(sprintable);
  if (!pool.length) { toast('Keine Sätze für den Sprint vorhanden.'); return; }
  // Bekannte Sätze zuerst, aufgefüllt mit neuen
  const seen = shuffle(pool.filter(v => store.state.srs[v.id]));
  const fresh = shuffle(pool.filter(v => !store.state.srs[v.id]));
  R = { queue: [...seen, ...fresh].slice(0, 10), i: 0, shown: false, left: 0, scores: [] };
  paintSprint();
}

function secondsFor(v) {
  return Math.max(6, Math.min(12, Math.round(4 + v.t.split(/\s+/).length * 0.8)));
}

function sprintHtml() {
  if (R.i >= R.queue.length) return sprintSummary();
  const v = R.queue[R.i];
  const total = secondsFor(v);
  return `<div class="lesson-top">
      <button class="icon-btn" data-quit aria-label="Beenden">${icon('x')}</button>
      ${progressBar(R.i / R.queue.length * 100)}
      <div class="count">${R.i + 1}/${R.queue.length}</div>
    </div>
    <div class="grow">
      <div class="q">${icon('mic')}Sag es laut auf ${esc(PACK.name)}</div>
      <div class="card stage" style="min-height:260px;display:flex;flex-direction:column;justify-content:center">
        <div class="prompt-mid">${esc(v.de)}</div>
        ${R.shown ? `
          <div style="margin-top:20px;padding-top:18px;border-top:1px solid var(--line)">
            <div class="prompt-mid az" style="color:var(--brand)">${esc(v.t)}</div>
            <div class="speakers">${speakBtn(v.t, { size: 'lg' })}${speakBtn(v.t, { slow: true })}</div>
            ${exampleLine(v)}
          </div>`
        : `<div style="display:flex;justify-content:center;margin-top:22px" id="countdown">${ring(100, String(total), 84)}</div>`}
      </div>
    </div>
    <div class="verdict plain">
      ${R.shown ? `
        <div class="q" style="margin-bottom:10px;justify-content:center">Wie lief es?</div>
        <div class="row" style="gap:7px">
          <button class="btn danger grow small" data-rate="0">Nicht gewusst</button>
          <button class="btn ghost grow small" data-rate="1">Mit Zögern</button>
          <button class="btn primary grow small" data-rate="2">Flüssig</button>
        </div>`
      : `<button class="btn primary block" data-reveal>${icon('eye')} Lösung zeigen</button>`}
    </div>`;
}

function sprintSummary() {
  const n = R.scores.length;
  const fluent = R.scores.filter(x => x === 2).length;
  R = null;
  document.body.classList.remove('immersive');
  return `<div class="view">
    <div class="done-hero">
      <div class="medal pop good">${icon('mic')}</div>
      <h1>${fluent >= n * 0.7 ? 'Richtig flüssig!' : 'Gut gesprochen!'}</h1>
      <p class="sub">${fluent} von ${n} Sätzen flüssig. Sätze mit Zögern kommen bald in der Wiederholung dran.</p>
    </div>
    <div class="stack" style="margin-top:22px">
      <button class="btn primary block" data-sprint>${icon('repeat')} Noch ein Sprint</button>
      <a class="btn ghost block" href="#/speak">Zurück</a>
    </div>
  </div>`;
}

function paintSprint() {
  clearTimer();
  const app = document.getElementById('app');
  document.body.classList.toggle('immersive', !!R && R.i < R.queue.length);
  if (!R) { app.innerHTML = render({}); mount({}); return; }
  if (R.i >= R.queue.length) {
    app.innerHTML = sprintHtml();
    app.querySelector('[data-sprint]')?.addEventListener('click', startSprint);
    return;
  }
  app.innerHTML = `<div class="view" id="sprint-wrap">${sprintHtml()}</div>`;
  wireSprint();
}

function reveal() {
  if (!R || R.shown) return;
  R.shown = true;
  const v = R.queue[R.i];
  paintSprint();
  setTimeout(() => speech.say(v.t, { rate: store.settings.rate }), 150);
}

function wireSprint() {
  const root = document.getElementById('sprint-wrap');
  if (!root) return;
  const v = R.queue[R.i];
  root.querySelector('[data-quit]')?.addEventListener('click', () => { R = null; speech.stop(); paintSprint(); });
  root.querySelector('[data-reveal]')?.addEventListener('click', reveal);
  root.querySelectorAll('[data-rate]').forEach(b => b.addEventListener('click', () => {
    const r = +b.dataset.rate;
    introduce(v.id);
    grade(v.id, [AGAIN, HARD, GOOD][r]);
    store.addXp(r === 2 ? 2 : 1);
    buzz(8);
    R.scores.push(r);
    R.i++;
    R.shown = false;
    speech.stop();
    paintSprint();
  }));

  if (!R.shown) {
    const total = secondsFor(v);
    const t0 = Date.now();
    timer = setInterval(() => {
      const left = Math.max(0, total - (Date.now() - t0) / 1000);
      const box = document.getElementById('countdown');
      if (!box) { clearTimer(); return; }
      box.innerHTML = ring(left / total * 100, String(Math.ceil(left)), 84);
      if (left <= 0) { clearTimer(); buzz(15); reveal(); }
    }, 200);
  }
}

/* --------------------------------------------------------- Freies Sprechen */

function topicView(id) {
  const t = SPEAKING.find(x => x.id === id);
  if (!t) return `<div class="view">${backBar('Sprechen', '#/speak')}${emptyState('warn', 'Nicht gefunden', 'Diese Aufgabe gibt es nicht.')}</div>`;
  const idx = SPEAKING.indexOf(t);
  const next = SPEAKING[idx + 1];
  return `<div class="view">
    ${backBar(t.title, '#/speak', `Freies Sprechen · ${idx + 1} von ${SPEAKING.length}`)}

    <div class="card">
      <div class="lbl-s">Deine Aufgabe</div>
      <p style="margin:4px 0 0;font-size:16.5px;font-weight:600;line-height:1.45">${esc(t.task)}</p>
    </div>

    <div class="sec-h">${icon('parts')}<h2>Bau diese Wendungen ein</h2></div>
    <div class="card" id="phrases">
      ${t.phrases.map((p, n) => `<button class="check-row" data-ph="${n}">
        <span class="box">${icon('check')}</span><span class="grow">${esc(p)}</span>
      </button>`).join('')}
      <p class="muted" style="font-size:12.5px;margin:8px 0 0">Tippe an, was du benutzt hast.</p>
    </div>

    <div class="card stage" style="padding:22px">
      <div style="display:flex;justify-content:center" id="topic-timer">${ring(100, String(TOPIC_SECONDS), 92)}</div>
      ${recorder.supported
        ? `<button class="btn primary block" id="rec" style="margin-top:16px;background:var(--nar);box-shadow:none">${icon('mic')} Aufnahme starten</button>
           <div class="muted" style="font-size:13.5px;margin-top:10px" id="rec-hint">Eine Minute sprechen – du kannst jederzeit stoppen.</div>
           <div id="playback" class="hide" style="margin-top:14px">
             <button class="btn ghost block small" id="replay">${icon('play')} Meine Aufnahme anhören</button>
             <audio id="my-audio" playsinline style="display:none"></audio>
           </div>`
        : `<button class="btn primary block" id="rec-noaudio" style="margin-top:16px">${icon('timer')} Timer starten</button>
           <div class="muted" style="font-size:13.5px;margin-top:10px">Aufnehmen geht in diesem Browser nicht – sprich trotzdem laut mit.</div>`}
    </div>

    <details class="card" id="model">
      <summary style="font-weight:650;cursor:pointer">Musterantwort zeigen</summary>
      <div class="example-line" style="margin-top:12px">${speakBtn(t.model)}<div class="grow">${esc(t.model)}</div></div>
      <p class="muted" style="font-size:13px;margin:10px 0 0">Das ist nur eine Möglichkeit. Vergleiche Aufbau und Wendungen – nicht Wort für Wort.</p>
    </details>

    <button class="btn soft block" id="done">${icon('check')} Erledigt – das saß</button>
    ${next ? `<a class="btn ghost block" style="margin-top:10px" href="#/speak/${next.id}">Nächste Situation ${icon('chevR')}</a>` : ''}
  </div>`;
}

function mountTopic(id) {
  const t = SPEAKING.find(x => x.id === id);
  if (!t) return;

  document.getElementById('phrases').addEventListener('click', e => {
    const b = e.target.closest('[data-ph]');
    if (b) b.classList.toggle('on');
  });

  const runTimer = onEnd => {
    clearTimer();
    const t0 = Date.now();
    timer = setInterval(() => {
      const left = Math.max(0, TOPIC_SECONDS - (Date.now() - t0) / 1000);
      const box = document.getElementById('topic-timer');
      if (!box) { clearTimer(); return; }
      box.innerHTML = ring(left / TOPIC_SECONDS * 100, String(Math.ceil(left)), 92);
      if (left <= 0) { clearTimer(); buzz(20); onEnd?.(); }
    }, 250);
  };

  const rec = document.getElementById('rec');
  rec?.addEventListener('click', async () => {
    if (recorder.recording) { recorder.stop(); return; }
    try {
      speech.stop();
      await recorder.start(url => {
        clearTimer();
        const a = document.getElementById('my-audio');
        if (!a) return;
        a.src = url;
        document.getElementById('playback').classList.remove('hide');
        rec.innerHTML = `${icon('mic')} Noch einmal aufnehmen`;
        document.getElementById('rec-hint').textContent = 'Hör dich an und vergleiche mit der Musterantwort.';
        document.getElementById('model').open = true;
      });
      rec.innerHTML = `${icon('stop')} Stoppen`;
      document.getElementById('rec-hint').textContent = 'Aufnahme läuft …';
      runTimer(() => recorder.stop());
    } catch {
      toast('Kein Zugriff auf das Mikrofon');
    }
  });

  document.getElementById('rec-noaudio')?.addEventListener('click', () => runTimer(() => { document.getElementById('model').open = true; }));

  document.getElementById('replay')?.addEventListener('click', () => {
    const a = document.getElementById('my-audio');
    speech.stop();
    a.currentTime = 0;
    a.play();
  });

  document.getElementById('done').addEventListener('click', e => {
    const first = !store.lessonState('sp:' + id)?.done;
    store.completeLesson('sp:' + id, 100);
    if (first) store.addXp(5);
    e.currentTarget.innerHTML = `${icon('check')} Gespeichert${first ? ' · +5 XP' : ''}`;
    e.currentTarget.disabled = true;
    buzz(8);
  });
}
