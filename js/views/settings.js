/** Einstellungen. */
import { store } from '../store.js';
import { speech } from '../speech.js';
import { VOICES } from '../audio-key.js';
import { DEMO_SENTENCE } from '../../data/extra-audio.js';
import { esc, toast } from '../ui.js';
import { backBar, icon } from '../components.js';
import { QUALITY } from './more.js';

export function render() {
  const s = store.settings;
  const voices = speech.candidates();
  const cur = speech.current();
  const hasRec = speech.recordedCount > 0;
  const [label, text, level] = QUALITY[speech.quality] || QUALITY.none;

  return `<div class="view">
    ${backBar('Einstellungen', '#/more')}

    <h2 style="margin-top:6px">Aussprache</h2>
    <div class="card">
      <div class="status" style="margin-bottom:12px">
        <span class="dot ${level}"></span>
        <div class="grow"><b style="font-size:15px">${label}</b><div class="muted" style="font-size:13.5px">${text}</div></div>
      </div>

      ${hasRec ? `
      <div class="list-row" style="padding-top:4px"><div class="grow"><b>Stimme</b><div class="muted">Für Wörter und Übungen</div></div></div>
      <div class="seg" id="rec-voice">
        ${Object.entries(VOICES).map(([k, v]) => `<button data-v="${k}" class="${(s.voice || 'f') === k ? 'on' : ''}">${esc(v.label)} · ${esc(v.desc)}</button>`).join('')}
      </div>` : ''}

      <div class="list-row" style="margin-top:6px">
        <div class="grow">
          <b>Sprechtempo</b>
          <div class="muted"><span id="rate-val">${Math.round(s.rate / 0.9 * 100)}</span> % – langsamer hilft beim Nachsprechen</div>
        </div>
      </div>
      <input type="range" id="rate" min="0.6" max="1.1" step="0.05" value="${s.rate}" aria-label="Sprechtempo">
      <button class="btn soft block small" id="test" style="margin-top:8px">${icon('speaker')} Hörprobe</button>

      ${hasRec ? `<button class="btn ghost block small" id="offline" style="margin-top:8px">${icon('download')} Alle ${speech.recordedCount} Aufnahmen offline speichern</button>` : ''}
    </div>

    <details class="card" ${hasRec ? '' : 'open'}>
      <summary style="font-weight:620;cursor:pointer">Ersatzstimme des Geräts</summary>
      <p class="muted" style="font-size:13.5px;margin:10px 0 8px">Wird nur benutzt, wenn für einen Satz keine Aufnahme vorhanden ist.</p>
      ${voices.length ? `
      <select id="voice" class="search" style="margin:0">
        ${voices.map(v => `<option value="${esc(v.voiceURI)}" ${cur && v.voiceURI === cur.voiceURI ? 'selected' : ''}>
          ${esc(v.name)} (${esc(v.lang)})</option>`).join('')}
      </select>` : `
      <div class="callout warn" style="margin:0">${icon('warn')}<div class="grow">Auf dem iPhone: <b style="display:inline;color:inherit">Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Türkisch</b> laden, dann diese App neu öffnen.</div></div>`}
    </details>

    <h2>Lernen</h2>
    <div class="card">
      <div class="list-row" style="padding-top:0">
        <div class="grow"><b>Tagesziel</b><div class="muted"><span id="goal-val">${s.dailyGoal}</span> XP – etwa ${Math.max(1, Math.round(s.dailyGoal / 20))} Lektion(en) am Tag</div></div>
      </div>
      <input type="range" id="goal" min="10" max="100" step="10" value="${s.dailyGoal}" aria-label="Tagesziel">

      <div class="list-row">
        <div class="grow"><b>Lautschrift anzeigen</b><div class="muted">Deutsche Aussprachehilfe unter jedem Wort</div></div>
        <button class="switch ${s.showPhonetic ? 'on' : ''}" id="sw-ph" role="switch" aria-checked="${s.showPhonetic}" aria-label="Lautschrift anzeigen"><i></i></button>
      </div>
      <div class="list-row" style="padding-bottom:0">
        <div class="grow"><b>Audio automatisch abspielen</b><div class="muted">Neue Wörter sofort vorlesen</div></div>
        <button class="switch ${s.autoPlay ? 'on' : ''}" id="sw-ap" role="switch" aria-checked="${s.autoPlay}" aria-label="Audio automatisch abspielen"><i></i></button>
      </div>
    </div>

    <h2>Persönlich</h2>
    <div class="card">
      <div class="list-row" style="padding-top:0"><div class="grow"><b>Dein Name</b><div class="muted">Für die Begrüßung auf der Startseite</div></div></div>
      <input class="search plain" id="name" type="text" placeholder="z. B. Pascal" value="${esc(store.settings.name || '')}" style="margin:0 0 6px">

      <div class="list-row"><div class="grow"><b>Erscheinungsbild</b></div></div>
      <div class="seg" id="theme">
        ${['auto', 'light', 'dark'].map(t => `<button data-theme="${t}" class="${currentTheme() === t ? 'on' : ''}">${{ auto: 'Automatisch', light: 'Hell', dark: 'Dunkel' }[t]}</button>`).join('')}
      </div>
    </div>

    <h2>Daten</h2>
    <div class="card">
      <button class="btn danger block small" id="reset">Fortschritt zurücksetzen</button>
      <p class="muted" style="font-size:12.5px;margin:10px 0 0">
        Lernstand, Wiederholungen und Einstellungen werden nur lokal in Safari gespeichert.
        Löschst du die Website-Daten, ist auch der Lernstand weg.
      </p>
    </div>
  </div>`;
}

function currentTheme() {
  try { return localStorage.getItem('azaz.theme') || 'auto'; } catch { return 'auto'; }
}

export function mount() {
  document.getElementById('rec-voice')?.addEventListener('click', e => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    store.set('settings.voice', b.dataset.v);
    speech.setPreferred(b.dataset.v);
    document.querySelectorAll('#rec-voice button').forEach(x => x.classList.toggle('on', x === b));
    speech.say(DEMO_SENTENCE, { rate: store.settings.rate });
  });

  const voice = document.getElementById('voice');
  voice?.addEventListener('change', () => {
    store.set('settings.voiceURI', voice.value);
    speech.setVoice(voice.value);
  });

  const rate = document.getElementById('rate');
  rate.addEventListener('input', () => {
    document.getElementById('rate-val').textContent = Math.round(+rate.value / 0.9 * 100);
  });
  rate.addEventListener('change', () => store.set('settings.rate', +rate.value));

  document.getElementById('test').addEventListener('click', () =>
    speech.say(DEMO_SENTENCE, { rate: +rate.value }));

  document.getElementById('offline')?.addEventListener('click', async e => {
    const btn = e.currentTarget;
    const files = speech.allRecordings();
    btn.disabled = true;
    let done = 0;
    try {
      const cache = await caches.open('azaz-audio');
      for (let i = 0; i < files.length; i += 8) {
        await Promise.all(files.slice(i, i + 8).map(f => cache.add(f).catch(() => {})));
        done = Math.min(files.length, i + 8);
        btn.textContent = `Speichere … ${done}/${files.length}`;
      }
      toast('Alle Aufnahmen sind jetzt offline verfügbar');
      btn.innerHTML = `${icon('check')} Offline gespeichert`;
    } catch {
      toast('Speichern nicht möglich');
      btn.disabled = false;
    }
  });

  const goal = document.getElementById('goal');
  goal.addEventListener('input', () => { document.getElementById('goal-val').textContent = goal.value; });
  goal.addEventListener('change', () => store.set('settings.dailyGoal', +goal.value));

  toggle('sw-ph', 'settings.showPhonetic');
  toggle('sw-ap', 'settings.autoPlay');

  const name = document.getElementById('name');
  name.addEventListener('change', () => store.set('settings.name', name.value.trim()));

  document.getElementById('theme').addEventListener('click', e => {
    const b = e.target.closest('[data-theme]');
    if (!b) return;
    const t = b.dataset.theme;
    try { localStorage.setItem('azaz.theme', t); } catch { /* egal */ }
    applyTheme(t);
    document.querySelectorAll('#theme button').forEach(x => x.classList.toggle('on', x === b));
  });

  document.getElementById('reset').addEventListener('click', () => {
    if (!confirm('Wirklich den gesamten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.')) return;
    store.reset();
    toast('Fortschritt zurückgesetzt');
    location.hash = '#/home';
  });
}

function toggle(id, path) {
  const el = document.getElementById(id);
  el.addEventListener('click', () => {
    const on = !el.classList.contains('on');
    el.classList.toggle('on', on);
    el.setAttribute('aria-checked', String(on));
    store.set(path, on);
  });
}

export function applyTheme(t = currentTheme()) {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', dark ? '#0c0f13' : '#f5f4f0'));
}
