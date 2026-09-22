/** Einstellungen. */
import { store } from '../store.js';
import { speech } from '../speech.js';
import { esc, toast } from '../ui.js';
import { backBar } from '../components.js';

const DEMO = 'Salam, necəsən? Mən yaxşıyam, sağ ol.';

export function render() {
  const s = store.settings;
  const voices = speech.candidates();
  const cur = speech.current();

  return `<div class="view">
    ${backBar('Einstellungen', '#/more')}

    <h2>Sprachausgabe</h2>
    <div class="card">
      <div class="list-row">
        <div class="grow">
          <b>Stimme</b>
          <div class="muted" style="font-size:13.5px">
            ${voices.length ? 'Türkische Stimmen klingen dem Aserbaidschanischen am nächsten.' : 'Keine passende Stimme installiert.'}
          </div>
        </div>
      </div>
      ${voices.length ? `
      <select id="voice" class="search" style="margin:6px 0 0">
        ${voices.map(v => `<option value="${esc(v.voiceURI)}" ${cur && v.voiceURI === cur.voiceURI ? 'selected' : ''}>
          ${esc(v.name)} (${esc(v.lang)})</option>`).join('')}
      </select>` : `
      <div class="banner warn" style="margin:8px 0 0">
        Auf dem iPhone: <b>Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Türkisch</b> laden, dann diese App neu öffnen.
      </div>`}

      <div class="list-row" style="margin-top:6px">
        <div class="grow">
          <b>Sprechtempo</b>
          <div class="muted" style="font-size:13.5px"><span id="rate-val">${s.rate.toFixed(2)}</span>× – langsamer hilft beim Nachsprechen</div>
        </div>
      </div>
      <input type="range" id="rate" min="0.5" max="1.1" step="0.05" value="${s.rate}">
      <button class="btn ghost block small" id="test" style="margin-top:10px">🔊 Probe anhören</button>
    </div>

    <h2>Lernen</h2>
    <div class="card">
      <div class="list-row">
        <div class="grow"><b>Tagesziel</b><div class="muted" style="font-size:13.5px"><span id="goal-val">${s.dailyGoal}</span> XP – etwa ${Math.max(1, Math.round(s.dailyGoal / 20))} Lektion(en)</div></div>
      </div>
      <input type="range" id="goal" min="10" max="100" step="10" value="${s.dailyGoal}">

      <div class="list-row">
        <div class="grow"><b>Lautschrift anzeigen</b><div class="muted" style="font-size:13.5px">Deutsche Aussprachehilfe unter jedem Wort</div></div>
        <div class="switch ${s.showPhonetic ? 'on' : ''}" id="sw-ph" role="switch" aria-checked="${s.showPhonetic}"><i></i></div>
      </div>
      <div class="list-row">
        <div class="grow"><b>Audio automatisch abspielen</b><div class="muted" style="font-size:13.5px">Neue Wörter sofort vorlesen</div></div>
        <div class="switch ${s.autoPlay ? 'on' : ''}" id="sw-ap" role="switch" aria-checked="${s.autoPlay}"><i></i></div>
      </div>
    </div>

    <h2>Persönlich</h2>
    <div class="card">
      <div class="list-row"><div class="grow"><b>Dein Name</b><div class="muted" style="font-size:13.5px">Für die Begrüßung auf der Startseite</div></div></div>
      <input class="search" id="name" type="text" placeholder="z. B. Pascal" value="${esc(store.settings.name || '')}" style="margin:0">

      <div class="list-row" style="margin-top:10px">
        <div class="grow"><b>Erscheinungsbild</b></div>
      </div>
      <div class="seg" id="theme">
        ${['auto', 'light', 'dark'].map(t => `<button data-theme="${t}" class="${(localStorage.getItem('azaz.theme') || 'auto') === t ? 'on' : ''}">${{ auto: 'System', light: 'Hell', dark: 'Dunkel' }[t]}</button>`).join('')}
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
    <div style="height:16px"></div>
  </div>`;
}

export function mount() {
  const voice = document.getElementById('voice');
  voice?.addEventListener('change', () => {
    store.set('settings.voiceURI', voice.value);
    speech.setVoice(voice.value);
    speech.say(DEMO, { rate: store.settings.rate });
  });

  const rate = document.getElementById('rate');
  rate.addEventListener('input', () => {
    document.getElementById('rate-val').textContent = (+rate.value).toFixed(2);
  });
  rate.addEventListener('change', () => store.set('settings.rate', +rate.value));

  document.getElementById('test').addEventListener('click', () =>
    speech.say(DEMO, { rate: +rate.value }));

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
    localStorage.setItem('azaz.theme', t);
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

export function applyTheme(t = localStorage.getItem('azaz.theme') || 'auto') {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}
