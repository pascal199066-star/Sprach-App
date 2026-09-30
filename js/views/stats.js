/** Statistik: was in den letzten Wochen passiert ist. */
import { store } from '../store.js';
import { learnedCount, dueCount, strength } from '../srs.js';
import { VOCAB, CATEGORIES, vocabByCat } from '../../data/active.js';
import { UNITS } from '../../data/active.js';
import { fmtInt, esc } from '../ui.js';
import { backBar, progressBar, icon } from '../components.js';

export function render() {
  const s = store.stats;
  const days = s.days || {};
  const lessons = UNITS.flatMap(u => u.lessons);
  const done = lessons.filter(l => store.lessonState(l.id)?.done).length;

  // letzte 28 Tage
  const cells = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const xp = days[d] || 0;
    const lvl = xp === 0 ? 0 : xp < 10 ? 1 : xp < 25 ? 2 : xp < 50 ? 3 : 4;
    cells.push(`<div class="l${lvl}" title="${d}: ${xp} XP"></div>`);
  }

  const mastered = VOCAB.filter(v => strength(v.id) >= 0.8).length;

  return `<div class="view">
    ${backBar('Statistik', '#/more')}

    <div class="kpis">
      <div class="kpi gold">${icon('flame')}<b>${s.streak || 0}</b><span>Tage Streak</span></div>
      <div class="kpi brand">${icon('trophy')}<b>${s.best || 0}</b><span>Bestwert</span></div>
      <div class="kpi nar">${icon('star')}<b>${fmtInt(s.totalXp || 0)}</b><span>XP gesamt</span></div>
    </div>

    <h2>Letzte vier Wochen</h2>
    <div class="card">
      <div class="heat">${cells.join('')}</div>
      <div class="muted center" style="font-size:12.5px;margin-top:10px">Je kräftiger, desto mehr an diesem Tag gelernt.</div>
    </div>

    <h2>Wortschatz</h2>
    <div class="card">
      <div class="row between" style="margin-bottom:8px">
        <span><b>${mastered}</b> sitzen fest</span>
        <span class="muted" style="font-size:14px">${learnedCount()} von ${VOCAB.length} begonnen</span>
      </div>
      ${progressBar(mastered / VOCAB.length * 100, 'good')}
      <div class="muted" style="font-size:13.5px;margin-top:10px">${dueCount()} Wörter sind gerade zur Wiederholung fällig.</div>
    </div>

    <h2>Nach Themen</h2>
    <div class="card">
      ${CATEGORIES.map(c => {
        const items = vocabByCat(c.id);
        const known = items.filter(v => strength(v.id) >= 0.8).length;
        const pct = Math.round(known / items.length * 100);
        return `<div style="margin-bottom:14px">
          <div class="row between" style="font-size:14.5px;margin-bottom:6px">
            <span class="row" style="gap:8px"><span style="color:var(--brand)">${icon(c.icon)}</span>${esc(c.title)}</span><span class="muted">${known}/${items.length}</span>
          </div>${progressBar(pct, 'thin')}
        </div>`;
      }).join('')}
    </div>

    <h2>Kurs</h2>
    <div class="card">
      <div class="row between" style="margin-bottom:8px"><span><b>${done}</b> von ${lessons.length} Lektionen</span>
        <span class="muted">${Math.round(done / lessons.length * 100)} %</span></div>
      ${progressBar(done / lessons.length * 100)}
    </div>
  </div>`;
}
