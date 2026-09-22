/** „Mehr“: Einstiegspunkte zu allem, was nicht in die Tabs passt. */
import { GRAMMAR } from '../../data/grammar.js';
import { DIALOGUES } from '../../data/dialogues.js';
import { speech } from '../speech.js';

const ITEMS = [
  { href: '#/grammar',   icon: '📐', title: 'Grammatik',          sub: () => `${GRAMMAR.length} Kapitel – das Grundgerüst` },
  { href: '#/dialogues', icon: '💬', title: 'Dialoge',            sub: () => `${DIALOGUES.length} Alltagsszenen zum Anhören` },
  { href: '#/pronounce', icon: '🎙️', title: 'Aussprache-Trainer', sub: () => 'Nachsprechen und mit dem Original vergleichen' },
  { href: '#/stats',     icon: '📊', title: 'Statistik',          sub: () => 'Streak, XP und Wortschatz' },
  { href: '#/settings',  icon: '⚙️', title: 'Einstellungen',      sub: () => 'Stimme, Tempo, Tagesziel' }
];

const QUALITY = {
  native:  ['Aserbaidschanische Stimme aktiv', 'good'],
  turkish: ['Türkische Stimme (klingt Aserbaidschanisch sehr nahe)', 'ok'],
  fallback:['Notstimme – Aussprache kann abweichen', 'warn'],
  none:    ['Keine passende Stimme gefunden', 'warn']
};

export function render() {
  const [label, level] = QUALITY[speech.quality] || QUALITY.none;
  return `<div class="view">
    <h1>Mehr</h1>
    <p class="sub">Nachschlagen, vertiefen, einstellen.</p>

    <div class="card tight" style="margin:14px 0">
      <div class="row">
        <div style="font-size:22px">${level === 'warn' ? '⚠️' : '🔊'}</div>
        <div class="grow" style="font-size:14.5px">
          <b>Sprachausgabe</b><br>
          <span class="muted">${label}</span>
        </div>
      </div>
    </div>

    ${ITEMS.map(i => `<a class="lesson" href="${i.href}" style="text-decoration:none;color:inherit">
      <div class="dot">${i.icon}</div>
      <div class="grow"><b>${i.title}</b><small>${i.sub()}</small></div>
      <div class="chev">›</div>
    </a>`).join('')}

    <p class="muted center" style="font-size:12.5px;margin-top:26px">
      Alle Daten bleiben auf diesem Gerät.<br>Kein Konto, keine Server, kein Tracking.
    </p>
    <div style="height:16px"></div>
  </div>`;
}
