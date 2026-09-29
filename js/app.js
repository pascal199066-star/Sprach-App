/**
 * Aserbaidschanisch lernen – App-Einstieg.
 * Hält Router, Tableiste, globale Audio-Knöpfe und den Service Worker zusammen.
 */
import { route, resolve } from './router.js';
import { store } from './store.js';
import { speech } from './speech.js';
import { dueCount } from './srs.js';
import { icon } from './components.js';
import { toast } from './ui.js';
import { applyTheme } from './views/settings.js';

import * as home      from './views/home.js';
import * as lesson    from './views/lesson.js';
import * as practice  from './views/practice.js';
import * as alphabet  from './views/alphabet.js';
import * as phrases   from './views/phrases.js';
import * as more      from './views/more.js';
import * as grammar   from './views/grammar.js';
import * as dialogues from './views/dialogues.js';
import * as settings  from './views/settings.js';
import * as stats     from './views/stats.js';
import * as pronounce from './views/pronounce.js';
import * as help      from './views/help.js';

route('/home', home);
route('/lesson/:id', lesson);
route('/practice', practice);
route('/alphabet', alphabet);
route('/alphabet/:id', alphabet);
route('/phrases', phrases);
route('/more', more);
route('/grammar', grammar);
route('/grammar/:id', grammar);
route('/dialogues', dialogues);
route('/dialogues/:id', dialogues);
route('/settings', settings);
route('/stats', stats);
route('/pronounce', pronounce);
route('/help', help);

const TABS = [
  { id: 'home',     href: '#/home',     label: 'Lernen',   icon: 'learn' },
  { id: 'practice', href: '#/practice', label: 'Wiederholen', icon: 'repeat' },
  { id: 'alphabet', href: '#/alphabet', label: 'Alphabet', icon: 'abc' },
  { id: 'phrases',  href: '#/phrases',  label: 'Wörter',   icon: 'chat' },
  { id: 'more',     href: '#/more',     label: 'Mehr',     icon: 'grid' }
];

const TAB_FOR = {
  home: 'home', lesson: 'home',
  practice: 'practice', alphabet: 'alphabet', phrases: 'phrases',
  more: 'more', grammar: 'more', dialogues: 'more',
  settings: 'more', stats: 'more', pronounce: 'more', help: 'more'
};

const app = document.getElementById('app');
const tabbar = document.getElementById('tabbar');

function renderTabs(active) {
  const n = dueCount();
  tabbar.innerHTML = TABS.map(t => `
    <button data-href="${t.href}" class="${t.id === active ? 'active' : ''}" aria-label="${t.label}"${t.id === active ? ' aria-current="page"' : ''}>
      <span class="ic">${icon(t.icon)}${t.id === 'practice' && n ? `<span class="badge">${n > 99 ? '99+' : n}</span>` : ''}</span>
      <span>${t.label}</span>
    </button>`).join('');
}

function render() {
  const match = resolve(location.hash);
  if (!match) { location.replace('#/home'); return; }

  const root = match.path.split('/').filter(Boolean)[0] || 'home';
  document.body.classList.toggle('immersive', root === 'lesson');
  speech.stop();

  app.innerHTML = match.view.render(match.params);
  match.view.mount?.(match.params);
  renderTabs(TAB_FOR[root] || 'home');
  window.scrollTo(0, 0);
}

/* --------------------------------------------------------- globale Handler */

// Ein einziger Handler für alle Abspiel-Knöpfe der App
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-say]');
  if (!btn) return;
  e.preventDefault();
  speech.unlock();
  const text = btn.dataset.say;
  if (!text) return;
  document.querySelectorAll('.speak.playing').forEach(b => b.classList.remove('playing'));
  btn.classList.add('playing');
  const done = () => btn.classList.remove('playing');
  const ok = speech.say(text, {
    rate: store.settings.rate,
    slow: btn.hasAttribute('data-slow'),
    voice: btn.dataset.voice || undefined,
    onend: done
  });
  if (!ok) { done(); toast('Sprachausgabe ist auf diesem Gerät nicht verfügbar.'); }
  setTimeout(done, 8000);
});

// Tableiste
tabbar.addEventListener('click', e => {
  const b = e.target.closest('[data-href]');
  if (b) location.hash = b.dataset.href;
});

// iOS gibt Audio erst nach der ersten Berührung frei
['touchend', 'mousedown', 'keydown'].forEach(ev =>
  window.addEventListener(ev, () => speech.unlock(), { once: true, passive: true }));

window.addEventListener('speech:novoice', () => {
  if (!speech.recordedCount) toast('Keine passende Stimme gefunden – siehe Einstellungen.');
});

// Sobald Aufnahmen oder Stimmen geladen sind, Übersichtsseiten auffrischen
speech.onChange(() => {
  if (store.settings.voiceURI) speech.setVoice(store.settings.voiceURI);
  if (['#/settings', '#/more', '#/home'].includes(location.hash)) render();
});

window.addEventListener('hashchange', render);

/* ------------------------------------------------------------------- Start */

applyTheme();
if (store.settings.voiceURI) speech.setVoice(store.settings.voiceURI);
speech.setPreferred(store.settings.voice || 'f');
if (!location.hash) location.replace('#/home');
render();

if ('serviceWorker' in navigator && !location.search.includes('e2e')) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline ist dann eben nicht */ }));
}
