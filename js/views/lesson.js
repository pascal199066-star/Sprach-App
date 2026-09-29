/**
 * Der Lektions-Player: führt durch die Übungskarten, wertet aus,
 * erklärt Fehler und schreibt Fortschritt und Wiederholungsdaten fort.
 *
 * Hilfen:
 *  – Tipp-Knopf: 50:50 bei Auswahlfragen, nächster Buchstabe beim Tippen,
 *    nächster Baustein beim Satzbau. Wer einen Tipp nutzt, bekommt weniger XP
 *    und das Wort kommt etwas früher wieder.
 *  – Nach jeder Antwort: Lösung zum Anhören, bei Tippfehlern die genaue
 *    Stelle, bei verwechselten Buchstaben die Ausspracheregel, bei falscher
 *    Auswahl die Bedeutung der gewählten Antwort, dazu die Bausteine.
 */
import { buildLesson } from '../lesson-engine.js';
import { LESSON_BY_ID, LESSONS } from '../../data/course.js';
import { LETTER_BY_LOW } from '../../data/alphabet.js';
import { store } from '../store.js';
import { grade, introduce, GOOD, HARD, AGAIN } from '../srs.js';
import { esc, md, compareTyped, buzz } from '../ui.js';
import { speakBtn, progressBar, icon, breakdown, soundTips, phon, callout } from '../components.js';
import { speech } from '../speech.js';
import { grammarBlocks } from './grammar.js';

const AZ_KEYS = ['ə', 'ı', 'ö', 'ü', 'ç', 'ş', 'ğ', 'q', 'x'];
const HINTABLE = ['choose', 'build', 'type', 'letter-pick', 'letter-word'];

let S = null;   // Sitzungszustand

export function render(params) {
  const built = buildLesson(params.id);
  if (!built) return `<div class="view"><p>Lektion nicht gefunden.</p><a class="btn primary" href="#/home">Zur Übersicht</a></div>`;
  S = {
    id: params.id,
    lesson: built.lesson,
    cards: built.cards,
    i: 0,
    asked: 0,
    right: 0,
    xp: 0,
    missed: [],        // Wörter mit Fehlern – für die Zusammenfassung
    fresh()            // Zustand pro Karte
    { this.answered = false; this.tokens = []; this.typed = ''; this.hints = 0; this.gone = []; this.reveal = false; }
  };
  S.fresh();
  return `<div class="view" id="lesson-wrap">${cardHtml()}</div>`;
}

export function mount() {
  // Haken für den automatisierten Durchlauf (nur mit ?e2e=1 in der Adresse)
  if (location.search.includes('e2e')) window.__answer = () => S.cards[S.i]?.answer;
  wire();
  autoPlay();
}

/* ------------------------------------------------------------------ Rendering */

function topBar(c) {
  const total = S.cards.length;
  const pct = Math.round(S.i / total * 100);
  const canHint = c && HINTABLE.includes(c.type) && !S.answered && hintsLeft(c) > 0;
  return `<div class="lesson-top">
    <a class="icon-btn" href="#/home" aria-label="Lektion verlassen">${icon('x')}</a>
    ${progressBar(pct)}
    ${c && HINTABLE.includes(c.type)
      ? `<button class="hint-btn" data-act="hint" ${canHint ? '' : 'disabled'} aria-label="Tipp anzeigen">${icon('bulb')}Tipp</button>`
      : `<div class="count">${S.i}/${total}</div>`}
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
  return topBar(c) + `<div class="grow">${body}</div>` + footerHtml(c);
}

function footerHtml(c) {
  const passive = ['intro', 'letter-intro', 'grammar', 'dialog'].includes(c.type);
  if (passive) {
    return `<div class="verdict plain"><button class="btn primary block" data-act="next">Weiter</button></div>`;
  }
  if (!S.answered) {
    const needsBtn = c.type === 'build' || c.type === 'type';
    return needsBtn
      ? `<div class="verdict plain"><button class="btn primary block" data-act="check" ${c.type === 'build' && !S.tokens.length ? 'disabled' : ''}>Prüfen</button></div>`
      : '';
  }
  return verdictHtml(c);
}

function verdictHtml(c) {
  const st = S.result;          // 'ok' | 'close' | 'no'
  const head = {
    ok:    ['check', S.hints ? 'Richtig – mit Tipp' : pickPraise()],
    close: ['info',  'Fast richtig!'],
    no:    ['x',     'Nicht ganz']
  }[st];
  const azSolution = solutionAz(c);
  const parts = [];

  // Lösung (bei richtig nur, wenn es etwas zu lernen gibt)
  if (st !== 'ok' || c.type === 'type' || c.type === 'build') {
    parts.push(`<div class="lbl">${st === 'ok' ? 'Lösung' : 'Richtig ist'}</div>
      <div class="sol">${azSolution ? speakBtn(azSolution) : ''}<span class="grow">${S.expectedHtml || esc(solutionText(c))}</span></div>`);
  }
  if (S.givenHtml && st !== 'ok') {
    parts.push(`<div class="lbl">Deine Antwort</div><div class="given">${S.givenHtml}</div>`);
  }
  // Erklärung
  const expl = explanation(c);
  if (expl) parts.push(`<div class="expl">${expl}</div>`);
  if (st !== 'ok' && c.item?.br) parts.push(breakdown(c.item.br));
  if (c.item?.note && st !== 'ok') parts.push(`<div class="expl">${md(c.item.note)}</div>`);

  return `<div class="verdict ${st}">
    <div class="vh"><div class="badge-ic">${icon(head[0])}</div><h3>${head[1]}</h3></div>
    ${parts.join('')}
    <button class="btn primary block" data-act="next">Weiter</button>
  </div>`;
}

function pickPraise() {
  const w = ['Richtig!', 'Əla! Sehr gut!', 'Genau!', 'Super!', 'Stimmt!'];
  return w[S.asked % w.length];
}

/** Der aserbaidschanische Text zur Karte (zum Anhören in der Auswertung). */
function solutionAz(c) {
  if (c.type === 'letter-pick') return c.letter.ex;
  if (c.type === 'letter-word') return c.answer;
  if (c.item?.az) return c.item.az;
  return null;
}

function solutionText(c) {
  if (c.type === 'letter-pick') return `${c.letter.up} ${c.letter.low} – klingt wie „${c.letter.ph}“`;
  if (c.type === 'letter-word') return `${c.answer} – ${c.alts?.[c.answer] || ''}`;
  if (c.type === 'choose' && c.item?.az) {
    return c.optionLang === 'de' ? `${c.item.az} = ${c.answer}` : `${c.answer} = ${c.item.de}`;
  }
  return c.answer;
}

/** Warum war das falsch – und was lernt man daraus? */
function explanation(c) {
  const out = [];
  if (S.issues?.length) {
    S.issues.slice(0, 3).forEach(({ exp, got }) => {
      const l = LETTER_BY_LOW[exp];
      out.push(`<p>Du hast <b>${esc(got)}</b> geschrieben – hier gehört <b>${esc(exp)}</b> hin${l ? ` (klingt wie „${esc(l.ph)}“)` : ''}.</p>`);
    });
    if (S.issues.some(x => ['ə', 'q', 'x'].includes(x.exp))) {
      out.push('<p>Mit <b>e, g, h</b> statt <b>ə, q, x</b> wird es Türkisch – im Aserbaidschanischen zählen diese Buchstaben.</p>');
    }
  } else if (S.result === 'close') {
    out.push('<p>Nur ein kleiner Tippfehler – schau dir die markierte Stelle an.</p>');
  }
  if (S.picked && S.picked !== c.answer && c.alts?.[S.picked]) {
    const isAz = c.optionLang === 'az' || c.type === 'letter-word';
    out.push(`<p>Deine Wahl <b>${esc(S.picked)}</b> ${isAz ? 'bedeutet' : 'heißt auf Aserbaidschanisch'} „${esc(c.alts[S.picked])}“.</p>`);
  }
  if (c.type === 'letter-pick' && S.result !== 'ok') out.push(`<p>${md(c.letter.tip)}</p>`);
  return out.join('');
}

function introCard(c) {
  const v = c.item;
  return `<div class="q">${icon('sparkle')}Neu</div>
  <div class="card stage">
    <div class="prompt-big az">${esc(v.az)}</div>
    ${store.settings.showPhonetic ? phon(v.ph) : ''}
    <div class="speakers">${speakBtn(v.az, { size: 'lg' })}${speakBtn(v.az, { slow: true })}</div>
    <div class="de-big">${esc(v.de)}</div>
    ${soundTips(v.az)}
    ${breakdown(v.br)}
  </div>
  ${v.note ? callout('tip', 'Gut zu wissen', v.note) : ''}`;
}

function chooseCard(c) {
  let head;
  if (c.promptKind === 'audio') {
    head = `<div class="q">${icon('ear')}Was hörst du?</div>
      <div class="card stage audio">
        <div class="speakers" style="margin:0">
          ${speakBtn(c.prompt, { size: 'lg', voice: c.voice })}${speakBtn(c.prompt, { slow: true, voice: c.voice })}
        </div>
        ${S.reveal ? `<div class="prompt-mid az" style="margin-top:14px">${esc(c.prompt)}</div>${c.item?.ph ? phon(c.item.ph) : ''}` : ''}
      </div>`;
  } else if (c.promptKind === 'az') {
    head = `<div class="q">${icon('help')}Was bedeutet das?</div>
      <div class="card row" style="gap:14px">
        ${speakBtn(c.prompt)}
        <div class="grow"><div class="prompt-mid az">${esc(c.prompt)}</div>${store.settings.showPhonetic ? phon(c.item?.ph) : ''}</div>
      </div>`;
  } else {
    head = `<div class="q">${icon('chat')}Wie sagt man das auf Aserbaidschanisch?</div>
      <div class="card"><div class="prompt-mid">${esc(c.prompt)}</div></div>`;
  }
  return head + optionsHtml(c.options.map(o => ({ label: o, value: o })), c.optionLang === 'az');
}

function optionsHtml(options, azStyle) {
  return `<div class="opts">${options.map((o, n) => `
    <button class="opt${S.gone.includes(o.value) ? ' gone' : ''}" data-opt="${esc(o.value)}">
      <span class="k">${n + 1}</span>
      <span class="grow${azStyle ? ' az' : ''}">${esc(o.label)}</span>
    </button>`).join('')}</div>`;
}

function buildCard(c) {
  return `<div class="q">${icon('parts')}Bau den Satz zusammen</div>
    <div class="card"><div class="prompt-mid">${esc(c.prompt)}</div></div>
    <div class="answer-line" id="answer-line">${answerLineHtml()}</div>
    <div class="tokens" id="token-pool">
      ${c.tokens.map((t, n) => `<button class="token ${S.tokens.some(x => x.idx === n) ? 'used' : ''}" data-token="${n}">${esc(t)}</button>`).join('')}
    </div>`;
}

function answerLineHtml() {
  return S.tokens.map((t, n) => `<button class="token${t.hint ? ' hinted' : ''}" data-chosen="${n}">${esc(t.text)}</button>`).join('');
}

function typeCard(c) {
  const hintText = S.hints ? typedHintPrefix(c) : '';
  return `<div class="q">${icon('keyboard')}Schreib es auf Aserbaidschanisch</div>
    <div class="card"><div class="prompt-mid">${esc(c.prompt)}</div></div>
    <div class="type-wrap">
      <input class="type-in" id="type-in" autocapitalize="off" autocorrect="off" autocomplete="off"
             spellcheck="false" placeholder="Deine Antwort" enterkeyhint="done" lang="az"
             value="${esc(S.typed || '')}" ${S.answered ? 'disabled' : ''}>
    </div>
    ${hintText ? `<div class="hint-line">${icon('bulb')}Beginnt mit „${esc(hintText)}…“</div>` : ''}
    ${S.answered ? '' : `<div class="keys">${AZ_KEYS.map(k => `<button data-key="${k}" aria-label="${k} einfügen">${k}</button>`).join('')}</div>`}`;
}

function typedHintPrefix(c) {
  const chars = [...c.answer];
  return chars.slice(0, Math.min(chars.length - 1, S.hints)).join('');
}

function letterIntroCard(c) {
  const l = c.letter;
  return `<div class="q">${icon('abc')}Neuer Buchstabe</div>
  <div class="card letter-hero">
    <div class="big">${l.up}<span> ${l.low}</span></div>
    <div class="ipa">klingt wie <b>„${esc(l.ph)}“</b> · ${esc(l.ipa)}</div>
    <div class="speakers" style="display:flex;justify-content:center;gap:12px;margin:18px 0 10px">
      ${speakBtn(l.ex, { size: 'lg' })}${speakBtn(l.ex, { slow: true })}
    </div>
    <div class="az" style="font-size:24px">${esc(l.ex)}</div>
    <div class="muted" style="font-size:15px">${esc(l.exDe)}</div>
  </div>
  ${callout('tip', 'Merke', l.tip)}`;
}

function letterPickCard(c) {
  return `<div class="q">${icon('abc')}${esc(c.question)}</div>
    <div class="card stage"><div class="prompt-big">„${esc(c.letter.ph)}“</div></div>
    ${optionsHtml(c.options, true)}`;
}

function letterWordCard(c) {
  return `<div class="q">${icon('ear')}${esc(c.question)}</div>
    <div class="card stage audio">
      <div class="speakers" style="margin:0">${speakBtn(c.audio, { size: 'lg' })}${speakBtn(c.audio, { slow: true })}</div>
    </div>
    ${optionsHtml(c.options.map(o => ({ label: o, value: o })), true)}`;
}

function grammarCard(c) {
  const g = c.grammar;
  return `<div class="q">${icon('grammar')}Grammatik · ${esc(g.subtitle)}</div>
    <h1 style="margin:0 0 14px;font-size:26px">${esc(g.title)}</h1>
    <div class="card">${grammarBlocks(g)}</div>`;
}

function dialogCard(c) {
  const d = c.dialog;
  return `<div class="q">${icon('users')}Dialog – erst lesen und anhören</div>
    <h1 style="margin:0 0 4px;font-size:26px">${esc(d.title)}</h1>
    <p class="sub" style="margin-bottom:14px">${esc(d.intro)}</p>
    <div class="card">
      ${d.lines.map(l => `<div class="dl ${l.who === 'Du' ? 'me' : ''}">
        ${speakBtn(l.az, { voice: l.who === 'Du' ? undefined : d.voices?.[l.who] })}
        <div class="bubble">
          <div class="who">${esc(l.who)}</div>
          <div class="az">${esc(l.az)}</div>
          <div class="de">${esc(l.de)}</div>
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
  const [medal, title, sub] = pct >= 90 ? ['trophy', 'Əla! Hervorragend!', '']
    : pct >= 70 ? ['star', 'Sehr gut!', 'good']
    : ['target', 'Geschafft!', 'brand'];
  const missed = [...new Map(S.missed.map(v => [v.az, v])).values()].slice(0, 6);
  return `<div class="view" style="padding-bottom:30px">
    <div class="done-hero">
      <div class="medal pop ${sub}">${icon(medal)}</div>
      <h1>${title}</h1>
      <p class="sub">${esc(S.lesson.title)}</p>
    </div>
    <div class="stat">
      <div class="box"><b>${pct}%</b><span>richtig</span></div>
      <div class="box"><b>+${S.xp}</b><span>XP</span></div>
      <div class="box"><b>${store.stats.streak}</b><span>${store.stats.streak === 1 ? 'Tag' : 'Tage'} in Folge</span></div>
    </div>
    ${missed.length ? `<h2>Das schaust du dir besser noch mal an</h2>
      <div class="card">${missed.map(v => `<div class="vocab-item">${speakBtn(v.az)}
        <div class="grow"><div class="az">${esc(v.az)}</div><div class="de">${esc(v.de)}</div></div></div>`).join('')}</div>` : ''}
    ${first && S.xp ? callout('info', 'So geht es weiter', 'Die neuen Wörter kommen in den nächsten Tagen automatisch zur Wiederholung – genau dann, wenn du sie sonst vergessen würdest.') : ''}
    <div class="stack" style="margin-top:14px">
      ${next ? `<a class="btn primary block" href="#/lesson/${next}">Nächste Lektion ${icon('arrowR')}</a>` : ''}
      <a class="btn ghost block" href="#/home">Zur Übersicht</a>
    </div>
  </div>`;
}

function nextLessonAfter(id) {
  const ids = LESSONS.map(l => l.id);
  const idx = ids.indexOf(id);
  for (let i = idx + 1; i < ids.length; i++) {
    if (!store.lessonState(ids[i])?.done) return ids[i];
  }
  return null;
}

/* ------------------------------------------------------------------- Ablauf */

function repaint() {
  const wrap = document.getElementById('lesson-wrap');
  if (S.i >= S.cards.length) {
    document.getElementById('app').innerHTML = cardHtml();
    document.body.classList.remove('immersive');
    return;
  }
  wrap.innerHTML = cardHtml();
  wire();
}

function autoPlay() {
  if (S.i >= S.cards.length || !store.settings.autoPlay) return;
  const c = S.cards[S.i];
  const text = c.type === 'intro' ? c.item.az
    : c.type === 'letter-intro' ? c.letter.ex
    : c.type === 'letter-word' ? c.audio
    : (c.type === 'choose' && c.promptKind === 'audio') ? c.prompt
    : null;
  if (text) setTimeout(() => speech.say(text, { rate: store.settings.rate, voice: c.voice }), 280);
}

function wire() {
  const root = document.getElementById('lesson-wrap');
  if (!root) return;
  const c = S.cards[S.i];

  root.querySelectorAll('[data-opt]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (S.answered) return;
      answerChoice(btn.dataset.opt);
    });
  });

  root.querySelector('[data-act="next"]')?.addEventListener('click', advance);
  root.querySelector('[data-act="hint"]')?.addEventListener('click', useHint);
  root.querySelector('[data-act="check"]')?.addEventListener('click', () => {
    if (c.type === 'type') answerTyped();
    else if (c.type === 'build') answerBuild();
  });

  if (!S.answered) {
    if (c.type === 'build') wireBuild(root, c);
    if (c.type === 'type') wireType(root);
  }
  // Nur Vokabeln wandern in den Karteikasten – Buchstaben werden über die
  // Lektion selbst abgedeckt und hätten die Wiederholung sonst verstopft.
  if (c.type === 'intro' && c.item) introduce(c.item.id);
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
  input.addEventListener('input', () => { S.typed = input.value; });
  root.querySelectorAll('[data-key]').forEach(b => {
    // pointerdown statt click: sonst verliert das Eingabefeld kurz den Fokus
    b.addEventListener('pointerdown', e => {
      e.preventDefault();
      const start = input.selectionStart ?? input.value.length;
      input.value = input.value.slice(0, start) + b.dataset.key + input.value.slice(input.selectionEnd ?? start);
      input.selectionStart = input.selectionEnd = start + 1;
      S.typed = input.value;
      input.focus();
    });
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); S.answered ? advance() : answerTyped(); }
  });
  setTimeout(() => input.focus(), 120);
}

/* -------------------------------------------------------------------- Tipps */

function hintsLeft(c) {
  if (c.type === 'choose' || c.type === 'letter-pick' || c.type === 'letter-word') {
    const max = c.promptKind === 'audio' ? 2 : 1;   // 50:50, beim Hören zusätzlich: Wort zeigen
    return max - S.hints;
  }
  if (c.type === 'type') return Math.max(0, [...c.answer].length - 1 - S.hints);
  if (c.type === 'build') return c.words.length - correctPrefixLength(c);
  return 0;
}

function correctPrefixLength(c) {
  let n = 0;
  while (n < S.tokens.length && n < c.words.length && S.tokens[n].text === c.words[n]) n++;
  return n;
}

function useHint() {
  const c = S.cards[S.i];
  if (S.answered || hintsLeft(c) <= 0) return;
  buzz(6);
  if (c.type === 'choose' || c.type === 'letter-pick' || c.type === 'letter-word') {
    if (S.hints === 0) {
      const values = c.type === 'letter-pick' ? c.options.map(o => o.value) : c.options;
      S.gone = values.filter(v => v !== c.answer).sort(() => Math.random() - .5).slice(0, 2);
    } else {
      S.reveal = true;
    }
  } else if (c.type === 'type') {
    const input = document.getElementById('type-in');
    const chars = [...c.answer];
    const n = Math.min(chars.length - 1, S.hints + 1);
    const typed = input?.value || '';
    // Nur überschreiben, wenn der bisher getippte Anfang nicht schon stimmt
    if (!typed.toLowerCase().startsWith(chars.slice(0, n).join('').toLowerCase())) {
      S.typed = chars.slice(0, n).join('');
    }
  } else if (c.type === 'build') {
    const keep = correctPrefixLength(c);
    S.tokens = S.tokens.slice(0, keep);
    const word = c.words[keep];
    const idx = c.tokens.findIndex((t, n) => t === word && !S.tokens.some(x => x.idx === n));
    if (idx >= 0) S.tokens.push({ idx, text: word, hint: true });
  }
  S.hints++;
  repaint();
}

/* ---------------------------------------------------------------- Auswertung */

function finish(result) {
  S.answered = true;
  S.result = result;              // 'ok' | 'close' | 'no'
  S.asked++;
  const c = S.cards[S.i];
  const ok = result !== 'no';
  if (ok) { S.right++; S.xp += (S.hints || result === 'close') ? 1 : 2; }
  else if (c.item?.az && c.item?.de) S.missed.push(c.item);
  buzz(ok ? 8 : [12, 40, 12]);

  const id = c.item?.id;
  if (id && !String(id).startsWith('dlg:')) {
    grade(id, result === 'no' ? AGAIN : (S.hints || result === 'close') ? HARD : GOOD);
  }
  // Falsch beantwortete Karte kommt am Ende noch einmal – aber nur ein einziges Mal
  if (!ok && !c.requeued) { S.cards.push({ ...c, requeued: true }); }

  // Bei richtiger Antwort das aserbaidschanische Wort noch einmal hören
  const az = solutionAz(c);
  if (ok && az) setTimeout(() => speech.say(az, { rate: store.settings.rate, voice: c.voice }), 150);
  repaint();
}

function clearFeedback() {
  S.picked = null; S.issues = null; S.expectedHtml = null; S.givenHtml = null;
}

function answerChoice(value) {
  const c = S.cards[S.i];
  clearFeedback();
  S.picked = value;
  const ok = value === c.answer;
  finish(ok ? 'ok' : 'no');
  // Markierung nach dem Neuzeichnen setzen
  document.querySelectorAll('[data-opt]').forEach(b => {
    b.classList.add('locked');
    if (b.dataset.opt === c.answer) b.classList.add('right');
    else if (b.dataset.opt === value) b.classList.add('wrong');
  });
}

function answerTyped() {
  const input = document.getElementById('type-in');
  const c = S.cards[S.i];
  S.typed = input.value;
  if (!S.typed.trim()) { input.focus(); return; }
  clearFeedback();
  const r = compareTyped(input.value, c.answer);
  S.issues = r.issues;
  S.expectedHtml = r.expectedHtml;
  S.givenHtml = r.status === 'right' ? null : r.givenHtml;
  finish(r.status === 'right' ? 'ok' : r.status === 'close' ? 'close' : 'no');
}

function answerBuild() {
  const c = S.cards[S.i];
  clearFeedback();
  const given = S.tokens.map(t => t.text).join(' ');
  const r = compareTyped(given, c.answer);
  S.givenHtml = r.status === 'right' ? null : esc(given);
  finish(r.status === 'right' ? 'ok' : 'no');
}

function advance() {
  S.i++;
  S.fresh();
  clearFeedback();
  speech.stop();
  repaint();
  autoPlay();
  window.scrollTo(0, 0);
}
