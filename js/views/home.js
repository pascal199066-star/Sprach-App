/** Startseite: Weiterlernen, Tagesziel, fällige Wiederholungen und der Lernpfad. */
import { UNITS } from '../../data/course.js';
import { store } from '../store.js';
import { dueCount, learnedCount } from '../srs.js';
import { VOCAB } from '../../data/vocab.js';
import { esc, fmtInt } from '../ui.js';
import { progressBar, icon, ring, BUTA, callout } from '../components.js';
import { speech } from '../speech.js';

export const KIND = {
  alphabet: { label: 'Alphabet',     icon: 'abc' },
  vocab:    { label: 'Wortschatz',   icon: 'chat' },
  grammar:  { label: 'Grammatik',    icon: 'grammar' },
  dialog:   { label: 'Dialog',       icon: 'users' },
  review:   { label: 'Wiederholung', icon: 'repeat' }
};

function nextLesson() {
  for (const u of UNITS) {
    for (let i = 0; i < u.lessons.length; i++) {
      const l = u.lessons[i];
      if (!store.lessonState(l.id)?.done) return { unit: u, lesson: l, index: i };
    }
  }
  return null;
}

function greetingWord() {
  const h = new Date().getHours();
  return h < 11 ? 'Sabahınız xeyir' : h >= 18 ? 'Axşamınız xeyir' : 'Salam';
}

export function render() {
  const s = store.stats;
  const goal = store.settings.dailyGoal;
  const xp = store.xpToday();
  const pct = Math.min(100, Math.round(xp / goal * 100));
  const next = nextLesson();
  const allLessons = UNITS.flatMap(u => u.lessons);
  const doneCount = allLessons.filter(l => store.lessonState(l.id)?.done).length;
  const revs = dueCount();
  const name = store.settings.name?.trim();
  const streak = s.streak || 0;

  return `<div class="view">
    <div class="home-top">
      <div class="brandmark" aria-hidden="true">ə</div>
      <div class="grow">
        <div class="eyebrow">${esc(greetingWord())}${name ? ',' : ''}</div>
        <h1>${name ? esc(name) : 'Azərbaycanca'}</h1>
      </div>
      <div class="pill fire${streak ? '' : ' off'}" title="Tage in Folge">${icon('flame')}${streak}</div>
    </div>

    ${voiceNotice()}

    ${next ? heroCard(next, doneCount) : `<div class="hero">
        ${BUTA}
        <div class="eyebrow">Kurs abgeschlossen</div>
        <h2>Əla! Alle ${allLessons.length} Lektionen geschafft.</h2>
        <p>Halte dein Wissen mit den Wiederholungen frisch – oder übe die Dialoge noch einmal.</p>
        <a class="btn white block" href="#/practice">${icon('repeat')} Wiederholen</a>
      </div>`}

    ${revs > 0 ? `<a class="review-cta" href="#/practice">
      <div class="ic">${icon('repeat')}</div>
      <div class="grow">
        <h3>${revs} ${revs === 1 ? 'Wort' : 'Wörter'} zur Wiederholung</h3>
        <div class="muted">Jetzt auffrischen, bevor du sie vergisst.</div>
      </div>
      <div class="chev">${icon('chevR')}</div>
    </a>` : ''}

    <div class="card goal">
      ${ring(pct, `${pct}%`, 58)}
      <div class="grow">
        <h3>Tagesziel</h3>
        <div class="muted" style="font-size:14px">${xp >= goal ? 'Geschafft – stark!' : `Noch ${goal - xp} XP bis zum Ziel`} · ${xp}/${goal} XP</div>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi gold">${icon('flame')}<b>${streak}</b><span>${streak === 1 ? 'Tag' : 'Tage'} in Folge</span></div>
      <div class="kpi brand">${icon('chat')}<b>${learnedCount()}</b><span>von ${VOCAB.length} Wörtern</span></div>
      <div class="kpi nar">${icon('star')}<b>${fmtInt(s.totalXp || 0)}</b><span>XP gesamt</span></div>
    </div>

    ${UNITS.map((u, n) => unitBlock(u, n, next)).join('')}

    <p class="muted center" style="font-size:13px;margin-top:22px">${doneCount} von ${allLessons.length} Lektionen abgeschlossen</p>
  </div>`;
}

function voiceNotice() {
  const q = speech.quality;
  if (q === 'recorded' || q === 'native') return '';
  if (!speech.supported) {
    return callout('warn', 'Keine Sprachausgabe', 'Dieser Browser kann nichts vorlesen. Am besten Safari verwenden.');
  }
  if (q === 'none') {
    return callout('warn', 'Keine Stimme gefunden', 'Unter **Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Türkisch** eine Stimme laden – als Notlösung, bis die Aufnahmen da sind.');
  }
  return '';
}

function heroCard({ unit, lesson, index }, doneCount) {
  const k = KIND[lesson.kind];
  const uPct = Math.round(unit.lessons.filter(l => store.lessonState(l.id)?.done).length / unit.lessons.length * 100);
  const unitNo = UNITS.indexOf(unit) + 1;
  return `<div class="hero">
    ${BUTA}
    <div class="eyebrow">Einheit ${unitNo} · ${esc(unit.title)}</div>
    <h2>${esc(lesson.title.replace(/^(Grammatik|Dialog): /, ''))}</h2>
    <div class="meta">
      <span class="tag">${icon(k.icon)}${k.label}</span>
      <span class="tag">Lektion ${index + 1} von ${unit.lessons.length}</span>
    </div>
    ${progressBar(uPct, 'thin')}
    <a class="btn white block" href="#/lesson/${lesson.id}">
      ${doneCount === 0 ? 'Jetzt starten' : 'Weiterlernen'} ${icon('arrowR')}
    </a>
  </div>`;
}

function unitBlock(u, n, next) {
  const done = u.lessons.filter(l => store.lessonState(l.id)?.done).length;
  return `<section class="unit">
    <div class="unit-head">
      <div class="unit-badge" style="--h:${u.hue}">${icon(u.icon)}</div>
      <div class="grow">
        <div class="eyebrow">Einheit ${n + 1}</div>
        <h2>${esc(u.title)}</h2>
        <p class="sub">${esc(u.desc)}</p>
      </div>
      <div class="unit-count">${done}/${u.lessons.length}</div>
    </div>
    <div class="path">
      ${u.lessons.map(l => {
        const st = store.lessonState(l.id);
        const isNext = next?.lesson.id === l.id;
        const cls = st?.done ? 'done' : isNext ? 'next' : '';
        const k = KIND[l.kind];
        const nodeIc = st?.done ? 'check' : isNext ? 'play' : k.icon;
        return `<a class="step ${cls}" href="#/lesson/${l.id}">
          <div class="node">${icon(nodeIc)}</div>
          <div class="body">
            <div class="grow">
              <b>${esc(l.title.replace(/^(Grammatik|Dialog): /, ''))}</b>
              <small><span class="kind">${k.label}</span>${st?.done ? ` · <span class="score">${st.score}%</span>` : ''}</small>
            </div>
            <div class="chev">${icon('chevR')}</div>
          </div>
        </a>`;
      }).join('')}
    </div>
  </section>`;
}
