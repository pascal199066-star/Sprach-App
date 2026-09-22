/** Startbildschirm: Fortschritt auf einen Blick + der komplette Kurs. */
import { UNITS } from '../../data/course.js';
import { store } from '../store.js';
import { dueCount, learnedCount } from '../srs.js';
import { VOCAB } from '../../data/vocab.js';
import { esc, fmtInt } from '../ui.js';
import { progressBar } from '../components.js';
import { speech } from '../speech.js';

const KIND_LABEL = {
  alphabet: 'Alphabet', vocab: 'Wortschatz', grammar: 'Grammatik',
  dialog: 'Dialog', review: 'Wiederholung'
};

function nextLessonId() {
  for (const u of UNITS) for (const l of u.lessons) {
    if (!store.lessonState(l.id)?.done) return l.id;
  }
  return null;
}

export function render() {
  const s = store.stats;
  const goal = store.settings.dailyGoal;
  const xp = store.xpToday();
  const pct = Math.min(100, Math.round(xp / goal * 100));
  const nextId = nextLessonId();
  const allLessons = UNITS.flatMap(u => u.lessons);
  const doneCount = allLessons.filter(l => store.lessonState(l.id)?.done).length;
  const revs = dueCount();
  const name = store.settings.name?.trim();

  const greeting = name ? `Salam, ${esc(name)}!` : 'Salam!';

  const voiceWarn = speech.supported
    ? (speech.quality === 'none'
        ? `<div class="banner warn">Auf diesem Gerät ist keine passende Stimme installiert. Unter <b>Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen</b> die türkische Stimme laden.</div>`
        : '')
    : `<div class="banner warn">Dieser Browser unterstützt keine Sprachausgabe. Am besten Safari verwenden.</div>`;

  return `<div class="view">
    ${voiceWarn}
    <h1>${greeting}</h1>
    <p class="sub">Aserbaidschanisch, Schritt für Schritt.</p>

    <div class="card row" style="gap:16px;margin-top:14px">
      <div class="ring" style="--p:${pct}"><span>${pct}%</span></div>
      <div class="grow">
        <h3 style="margin-bottom:2px">Tagesziel</h3>
        <div class="muted" style="font-size:14px">${xp} von ${goal} XP heute</div>
        <div style="margin-top:8px">${progressBar(pct)}</div>
      </div>
    </div>

    <div class="stat" style="margin-bottom:12px">
      <div class="box"><b>${s.streak || 0}</b><span>Tage in Folge</span></div>
      <div class="box"><b>${learnedCount()}</b><span>von ${VOCAB.length} Wörtern</span></div>
      <div class="box"><b>${fmtInt(s.totalXp || 0)}</b><span>XP gesamt</span></div>
    </div>

    ${revs > 0 ? `<a class="card row" href="#/practice" style="text-decoration:none;color:inherit;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff">
      <div style="font-size:26px">🔁</div>
      <div class="grow">
        <h3 style="margin:0;color:#fff">${revs} ${revs === 1 ? 'Wort' : 'Wörter'} zur Wiederholung</h3>
        <div style="font-size:14px;opacity:.9">Jetzt auffrischen, bevor du sie vergisst.</div>
      </div>
      <div style="opacity:.8">›</div>
    </a>` : ''}

    ${nextId ? `<a class="btn primary block" href="#/lesson/${nextId}" style="text-decoration:none;margin-bottom:6px">
      ${doneCount === 0 ? 'Jetzt starten' : 'Weiterlernen'} · ${esc(lessonTitle(nextId))}
    </a>` : `<div class="card center"><div class="confetti">🏆</div><h3>Alle Lektionen geschafft!</h3><p class="muted">Halte dein Wissen mit den Wiederholungen frisch.</p></div>`}

    <div class="muted center" style="font-size:13px;margin:10px 0 4px">
      ${doneCount} von ${allLessons.length} Lektionen abgeschlossen
    </div>

    ${UNITS.map(unitBlock).join('')}

    <div style="height:20px"></div>
  </div>`;
}

function lessonTitle(id) {
  for (const u of UNITS) for (const l of u.lessons) if (l.id === id) return l.title;
  return '';
}

function unitBlock(u) {
  const done = u.lessons.filter(l => store.lessonState(l.id)?.done).length;
  const pct = Math.round(done / u.lessons.length * 100);
  let nextMarked = false;
  return `<div class="unit-head">
      <div class="em">${u.icon}</div>
      <div class="grow">
        <h2>${esc(u.title)}</h2>
        <div class="muted" style="font-size:13.5px">${esc(u.desc)}</div>
      </div>
      <div class="muted" style="font-size:13px;font-weight:700">${done}/${u.lessons.length}</div>
    </div>
    <div style="margin:-4px 0 10px">${progressBar(pct)}</div>
    ${u.lessons.map(l => {
      const st = store.lessonState(l.id);
      let isNext = false;
      if (!st?.done && !nextMarked) { isNext = true; nextMarked = true; }
      const cls = st?.done ? 'done' : isNext ? 'next' : '';
      const mark = st?.done ? '✓' : isNext ? '▶' : '·';
      const meta = st?.done ? `${KIND_LABEL[l.kind]} · ${st.score}%` : KIND_LABEL[l.kind];
      return `<a class="lesson ${cls}" href="#/lesson/${l.id}" style="text-decoration:none;color:inherit">
        <div class="dot">${mark}</div>
        <div class="grow"><b>${esc(l.title)}</b><small>${meta}</small></div>
        <div class="chev">›</div>
      </a>`;
    }).join('')}`;
}
