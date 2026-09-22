/** Statistik: was in den letzten Wochen passiert ist. */
import { store } from '../store.js';
import { learnedCount, dueCount, strength } from '../srs.js';
import { VOCAB, CATEGORIES, vocabByCat } from '../../data/vocab.js';
import { UNITS } from '../../data/course.js';
import { fmtInt, esc } from '../ui.js';
import { backBar, progressBar } from '../components.js';

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
    cells.push(`<div title="${d}: ${xp} XP" style="aspect-ratio:1;border-radius:5px;background:${
      ['var(--surface-2)', 'color-mix(in srgb,var(--accent) 25%,var(--surface-2))',
       'color-mix(in srgb,var(--accent) 50%,var(--surface-2))',
       'color-mix(in srgb,var(--accent) 75%,var(--surface-2))', 'var(--accent)'][lvl]}"></div>`);
  }

  const mastered = VOCAB.filter(v => strength(v.id) >= 0.8).length;

  return `<div class="view">
    ${backBar('Statistik', '#/more')}

    <div class="stat" style="margin-bottom:12px">
      <div class="box"><b>${s.streak || 0}</b><span>Tage Streak</span></div>
      <div class="box"><b>${s.best || 0}</b><span>Bestwert</span></div>
      <div class="box"><b>${fmtInt(s.totalXp || 0)}</b><span>XP gesamt</span></div>
    </div>

    <h2>Letzte vier Wochen</h2>
    <div class="card">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px">${cells.join('')}</div>
      <div class="muted center" style="font-size:12px;margin-top:10px">Je dunkler, desto mehr an diesem Tag gelernt.</div>
    </div>

    <h2>Wortschatz</h2>
    <div class="card">
      <div class="row between" style="margin-bottom:6px">
        <span><b>${mastered}</b> sitzen fest</span>
        <span class="muted">${learnedCount()} von ${VOCAB.length} begonnen</span>
      </div>
      ${progressBar(mastered / VOCAB.length * 100)}
      <div class="muted" style="font-size:13.5px;margin-top:10px">${dueCount()} Wörter sind gerade zur Wiederholung fällig.</div>
    </div>

    <h2>Nach Themen</h2>
    <div class="card">
      ${CATEGORIES.map(c => {
        const items = vocabByCat(c.id);
        const known = items.filter(v => strength(v.id) >= 0.8).length;
        const pct = Math.round(known / items.length * 100);
        return `<div style="margin-bottom:12px">
          <div class="row between" style="font-size:14.5px;margin-bottom:5px">
            <span>${c.icon} ${esc(c.title)}</span><span class="muted">${known}/${items.length}</span>
          </div>${progressBar(pct)}
        </div>`;
      }).join('')}
    </div>

    <h2>Kurs</h2>
    <div class="card">
      <div class="row between" style="margin-bottom:6px"><span><b>${done}</b> von ${lessons.length} Lektionen</span>
        <span class="muted">${Math.round(done / lessons.length * 100)}%</span></div>
      ${progressBar(done / lessons.length * 100)}
    </div>
    <div style="height:16px"></div>
  </div>`;
}
