/**
 * Der Lektions-Player: führt durch die Übungskarten, wertet aus,
 * schreibt Fortschritt und Wiederholungsdaten fort.
 */
import { buildLesson } from '../lesson-engine.js';
import { LESSON_BY_ID } from '../../data/course.js';
import { store } from '../store.js';
import { grade, introduce, GOOD, AGAIN } from '../srs.js';
import { esc, md, checkTyped, toast, buzz } from '../ui.js';
import { speakBtn, progressBar } from '../components.js';
import { speech } from '../speech.js';
import { grammarBlocks } from './grammar.js';

const AZ_KEYS = ['ə', 'ı', 'ö', 'ü', 'ç', 'ş', 'ğ', 'q', 'x'];

let S = null;   // Sitzungszustand

export function render(params) {
  const built = buildLesson(params.id);
  if (!built) return `<div class="view"><p>Lektion nicht gefunden.</p><a class="btn" href="#/home">Zur Übersicht</a></div>`;
  S = {
    id: params.id,
    lesson: built.lesson,
    cards: built.cards,
    i: 0,
    asked: 0,
    right: 0,
    xp: 0,
    answered: false,
    tokens: [],
    typed: ''
  };
  return `<div class="view" id="lesson-wrap">${cardHtml()}</div>`;
}

export function mount() {
  // Haken für den automatisierten Durchlauf (nur mit ?e2e=1 in der Adresse)
  if (location.search.includes('e2e')) window.__answer = () => S.cards[S.i]?.answer;
  wire();
  autoPlay();
}

/* ------------------------------------------------------------------ Rendering */

function topBar() {
  const total = S.cards.length;
  const pct = Math.round(S.i / total * 100);
  return `<div class="lesson-top">
    <a class="x" href="#/home" aria-label="Lektion verlassen" style="text-decoration:none">✕</a>
    ${progressBar(pct)}
    <div class="muted" style="font-size:13px;font-weight:700;min-width:38px;text-align:right">${S.i}/${total}</div>
  </div>`;
}

function cardHtml() {
  if (S.i >= S.cards.length) return summaryHtml();
  const c = S.cards[S.i];
  const body = {
    intro: introCard, choose: chooseCard, build: buildCard, type: typeCard,
    'letter-intro': letterIntroCard, 'letter-pick': letterPickCard,
    'letter-word': letterWordCard, grammar: grammarCard, dialog: dialogCard
  }[c.type](c);
  return topBar() + `<div class="grow">${body}</div>` + footerHtml(c);
}

function footerHtml(c) {
  const passive = ['intro', 'letter-intro', 'grammar', 'dialog'].includes(c.type);
  if (passive) {
    return `<div class="verdict"><button class="btn primary block" data-act="next">Weiter</button></div>`;
  }
  if (!S.answered) {
    const needsBtn = c.type === 'build' || c.type === 'type';
    return needsBtn
      ? `<div class="verdict"><button class="btn primary block" data-act="check" ${c.type === 'build' ? 'disabled' : ''}>Prüfen</button></div>`
      : '';
  }
  const ok = S.lastOk;
  return `<div class="verdict ${ok ? 'ok' : 'no'}">
    <h3>${ok ? '✓ Richtig!' : '✕ Nicht ganz'}</h3>
    ${!ok ? `<div class="sol">${esc(S.lastSolution)}</div>` : ''}
    ${S.lastNote ? `<div class="muted" style="font-size:14px;margin-top:4px">${md(S.lastNote)}</div>` : ''}
    <button class="btn primary block" data-act="next" style="margin-top:12px">Weiter</button>
  </div>`;
}

function phonetic(v) {
  return store.settings.showPhonetic && v?.ph ? `<div class="ph">[${esc(v.ph)}]</div>` : '';
}

function introCard(c) {
  const v = c.item;
  return `<div class="q">Neues Wort</div>
  <div class="card center" style="padding:26px 18px">
    <div class="prompt-big az">${esc(v.az)}</div>
    ${phonetic(v)}
    <div class="row" style="justify-content:center;gap:10px;margin:16px 0 14px">
      ${speakBtn(v.az, { size: 'lg' })}
      ${speakBtn(v.az, { slow: true, title: 'Langsam anhören' })}
    </div>
    <div style="font-size:19px;font-weight:600">${esc(v.de)}</div>
  </div>
  ${v.note ? `<div class="note"><b>Hinweis:</b> ${md(v.note)}</div>` : ''}`;
}

function chooseCard(c) {
  let head;
  if (c.promptKind === 'audio') {
    head = `<div class="q">Was hörst du?</div>
      <div class="card center" style="padding:28px">
        <div class="row" style="justify-content:center;gap:12px">
          ${speakBtn(c.prompt, { size: 'lg' })}${speakBtn(c.prompt, { slow: true })}
        </div>
      </div>`;
  } else if (c.promptKind === 'az') {
    head = `<div class="q">Was bedeutet das?</div>
      <div class="card row" style="gap:12px">
        ${speakBtn(c.prompt)}
        <div class="grow"><div class="prompt-mid az">${esc(c.prompt)}</div>${phonetic(c.item)}</div>
      </div>`;
  } else {
    head = `<div class="q">Wie sagt man das auf Aserbaidschanisch?</div>
      <div class="card"><div class="prompt-mid">${esc(c.prompt)}</div></div>`;
  }
  return head + optionsHtml(c.options, c.optionLang === 'az');
}

function optionsHtml(options, azStyle) {
  return `<div class="opts">${options.map((o, n) => `
    <button class="opt" data-opt="${esc(o)}">
      <span class="k">${n + 1}</span>
      <span class="grow${azStyle ? ' az' : ''}">${esc(o)}</span>
    </button>`).join('')}</div>`;
}

function buildCard(c) {
  return `<div class="q">Setze den Satz zusammen</div>
    <div class="card"><div class="prompt-mid">${esc(c.prompt)}</div></div>
    <div class="answer-line" id="answer-line">${answerLineHtml()}</div>
    <div class="tokens" id="token-pool">
      ${c.tokens.map((t, n) => `<button class="token ${S.tokens.some(x => x.idx === n) ? 'used' : ''}" data-token="${n}">${esc(t)}</button>`).join('')}
    </div>`;
}

function answerLineHtml() {
  return S.tokens.map((t, n) => `<button class="token" data-chosen="${n}">${esc(t.text)}</button>`).join('');
}

function typeCard(c) {
  return `<div class="q">Schreibe auf Aserbaidschanisch</div>
    <div class="card"><div class="prompt-mid">${esc(c.prompt)}</div></div>
    <input class="type-in" id="type-in" autocapitalize="off" autocorrect="off" autocomplete="off"
           spellcheck="false" placeholder="Deine Antwort" enterkeyhint="done"
           value="${esc(S.typed || '')}" ${S.answered ? 'disabled' : ''}>
    ${S.answered ? '' : `<div class="keys">${AZ_KEYS.map(k => `<button data-key="${k}">${k}</button>`).join('')}</div>`}`;
}

function letterIntroCard(c) {
  const l = c.letter;
  return `<div class="q">Buchstabe</div>
  <div class="card letter-hero">
    <div class="big">${l.up} ${l.low}</div>
    <div class="ipa">klingt wie <b>„${esc(l.ph)}“</b> · ${esc(l.ipa)}</div>
    <div class="row" style="justify-content:center;gap:10px;margin:18px 0 8px">
      ${speakBtn(l.ex, { size: 'lg' })}${speakBtn(l.ex, { slow: true })}
    </div>
    <div class="az" style="font-size:22px">${esc(l.ex)}</div>
    <div class="muted" style="font-size:15px">${esc(l.exDe)}</div>
  </div>
  <div class="note"><b>Merke:</b> ${md(l.tip)}</div>`;
}

function letterPickCard(c) {
  return `<div class="q">${esc(c.question)}</div>
    <div class="card center" style="padding:22px"><div class="prompt-big">„${esc(c.letter.ph)}“</div></div>
    <div class="opts">${c.options.map((o, n) => `
      <button class="opt" data-opt="${esc(o.value)}">
        <span class="k">${n + 1}</span><span class="grow az">${esc(o.label)}</span>
      </button>`).join('')}</div>`;
}

function letterWordCard(c) {
  return `<div class="q">${esc(c.question)}</div>
    <div class="card center" style="padding:28px">
      <div class="row" style="justify-content:center;gap:12px">
        ${speakBtn(c.audio, { size: 'lg' })}${speakBtn(c.audio, { slow: true })}
      </div>
    </div>
    ${optionsHtml(c.options, true)}`;
}

function grammarCard(c) {
  const g = c.grammar;
  return `<div class="q">Grammatik · ${esc(g.subtitle)}</div>
    <h1 style="margin-top:0">${esc(g.title)}</h1>
    <div class="card">${grammarBlocks(g)}</div>`;
}

function dialogCard(c) {
  const d = c.dialog;
  return `<div class="q">Dialog</div>
    <h1 style="margin-top:0">${d.icon} ${esc(d.title)}</h1>
    <p class="sub">${esc(d.intro)}</p>
    <div class="card">
      ${d.lines.map(l => `<div class="dl ${l.who === 'Du' ? 'me' : ''}">
        ${speakBtn(l.az)}
        <div class="bubble">
          <div class="who">${esc(l.who)}</div>
          <div class="az">${esc(l.az)}</div>
          <div class="muted" style="font-size:14.5px">${esc(l.de)}</div>
        </div>
      </div>`).join('')}
    </div>`;
}

function summaryHtml() {
  const pct = S.asked ? Math.round(S.right / S.asked * 100) : 100;
  const first = !store.lessonState(S.id)?.done;
  store.completeLesson(S.id, pct);
  store.addXp(S.xp);
  const next = nextLessonAfter(S.id);
  return `<div class="view center" style="padding-top:30px">
    <div class="confetti">${pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
    <h1>${pct >= 80 ? 'Sehr gut!' : pct >= 50 ? 'Geschafft!' : 'Weiter so!'}</h1>
    <p class="sub">${esc(S.lesson.title)}</p>
    <div class="stat" style="margin:22px 0">
      <div class="box"><b>${pct}%</b><span>richtig</span></div>
      <div class="box"><b>+${S.xp}</b><span>XP</span></div>
      <div class="box"><b>${store.stats.streak}</b><span>Tage Streak</span></div>
    </div>
    ${first && S.xp ? `<p class="muted" style="font-size:14px">Die neuen Wörter kommen in den nächsten Tagen automatisch zur Wiederholung.</p>` : ''}
    <div class="stack" style="margin-top:8px">
      ${next ? `<a class="btn primary block" href="#/lesson/${next}" style="text-decoration:none">Nächste Lektion</a>` : ''}
      <a class="btn ghost block" href="#/home" style="text-decoration:none">Zur Übersicht</a>
    </div>
  </div>`;
}

function nextLessonAfter(id) {
  const keys = Object.keys(LESSON_BY_ID);
  const idx = keys.indexOf(id);
  for (let i = idx + 1; i < keys.length; i++) {
    if (!store.lessonState(keys[i])?.done) return keys[i];
  }
  return null;
}

/* ------------------------------------------------------------------- Ablauf */

function repaint() {
  const wrap = document.getElementById('lesson-wrap') || document.getElementById('app');
  if (S.i >= S.cards.length) {
    document.getElementById('app').innerHTML = cardHtml();
    return;
  }
  wrap.innerHTML = cardHtml();
  wire();
  autoPlay();
}

function autoPlay() {
  if (S.i >= S.cards.length) return;
  const c = S.cards[S.i];
  if (!store.settings.autoPlay) return;
  const text = c.type === 'intro' ? c.item.az
    : c.type === 'letter-intro' ? c.letter.ex
    : c.type === 'letter-word' ? c.audio
    : (c.type === 'choose' && c.promptKind === 'audio') ? c.prompt
    : null;
  if (text) setTimeout(() => speech.say(text, { rate: store.settings.rate }), 260);
}

function wire() {
  const root = document.getElementById('lesson-wrap');
  if (!root) return;
  const c = S.cards[S.i];

  root.querySelectorAll('[data-opt]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (S.answered) return;
      answerChoice(btn.dataset.opt, btn);
    });
  });

  root.querySelector('[data-act="next"]')?.addEventListener('click', advance);
  root.querySelector('[data-act="check"]')?.addEventListener('click', () => {
    if (c.type === 'type') answerTyped();
    else if (c.type === 'build') answerBuild();
  });

  if (!S.answered) {
    if (c.type === 'build') wireBuild(root, c);
    if (c.type === 'type') wireType(root);
  }
  if (['intro', 'letter-intro'].includes(c.type)) {
    introduce(c.item?.id || ('L:' + c.letter.low));
  }
}

function wireBuild(root, c) {
  const pool = root.querySelector('#token-pool');
  const line = root.querySelector('#answer-line');
  const checkBtn = root.querySelector('[data-act="check"]');

  const redraw = () => {
    line.innerHTML = answerLineHtml();
    pool.querySelectorAll('[data-token]').forEach(b => {
      b.classList.toggle('used', S.tokens.some(t => t.idx === +b.dataset.token));
    });
    if (checkBtn) checkBtn.disabled = S.tokens.length === 0;
    line.querySelectorAll('[data-chosen]').forEach(b => {
      b.addEventListener('click', () => {
        S.tokens.splice(+b.dataset.chosen, 1);
        redraw();
      });
    });
  };

  pool.querySelectorAll('[data-token]').forEach(b => {
    b.addEventListener('click', () => {
      if (S.answered) return;
      S.tokens.push({ idx: +b.dataset.token, text: c.tokens[+b.dataset.token] });
      redraw();
    });
  });
  redraw();
}

function wireType(root) {
  const input = root.querySelector('#type-in');
  root.querySelectorAll('[data-key]').forEach(b => {
    b.addEventListener('click', e => {
      e.preventDefault();
      const start = input.selectionStart ?? input.value.length;
      input.value = input.value.slice(0, start) + b.dataset.key + input.value.slice(input.selectionEnd ?? start);
      input.selectionStart = input.selectionEnd = start + 1;
      input.focus();
    });
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); S.answered ? advance() : answerTyped(); }
  });
  setTimeout(() => input.focus(), 120);
}

/* ---------------------------------------------------------------- Auswertung */

function finish(ok, solution, note) {
  S.answered = true;
  S.lastOk = ok;
  S.lastSolution = solution;
  S.lastNote = note || null;
  S.asked++;
  if (ok) { S.right++; S.xp += 2; }
  buzz(ok ? 8 : [12, 40, 12]);

  const c = S.cards[S.i];
  const id = c.item?.id;
  if (id && !String(id).startsWith('dlg:')) grade(id, ok ? GOOD : AGAIN);
  // Falsch beantwortete Karte kommt am Ende noch einmal – aber nur ein einziges Mal
  if (!ok && !c.requeued) { c.requeued = true; S.cards.push(c); }

  // Bei richtiger Antwort das aserbaidschanische Wort noch einmal hören
  const az = c.item?.az || (c.letter ? c.letter.ex : null);
  if (ok && az) setTimeout(() => speech.say(az, { rate: store.settings.rate }), 120);
  repaint();
}

function answerChoice(value, btn) {
  const c = S.cards[S.i];
  const ok = value === c.answer;
  btn.classList.add(ok ? 'right' : 'wrong');
  if (!ok) {
    document.querySelectorAll(`[data-opt="${CSS.escape(c.answer)}"]`).forEach(b => b.classList.add('right'));
  }
  const sol = c.type === 'letter-pick'
    ? `${c.letter.up} ${c.letter.low} — ${c.letter.tip}`
    : c.answer;
  finish(ok, sol, c.item?.note);
}

function answerTyped() {
  const input = document.getElementById('type-in');
  const c = S.cards[S.i];
  S.typed = input.value;
  const res = checkTyped(input.value, c.answer);
  if (res === 'close') toast('Fast! Achte auf die Sonderzeichen.');
  finish(res === true || res === 'close', c.answer, c.item?.note);
}

function answerBuild() {
  const c = S.cards[S.i];
  const given = S.tokens.map(t => t.text).join(' ');
  const ok = checkTyped(given, c.answer) === true;
  finish(ok, c.answer, c.item?.note);
}

function advance() {
  S.answered = false;
  S.tokens = [];
  S.typed = '';
  S.i++;
  speech.stop();
  repaint();
}
