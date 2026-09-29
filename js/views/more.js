/** „Mehr“: Einstiegspunkte zu allem, was nicht in die Tabs passt. */
import { GRAMMAR } from '../../data/grammar.js';
import { DIALOGUES } from '../../data/dialogues.js';
import { speech } from '../speech.js';
import { pageHead, icon } from '../components.js';

const GROUPS = [
  [
    { href: '#/grammar',   icon: 'grammar', cls: '',     title: 'Grammatik',          sub: () => `${GRAMMAR.length} kurze Kapitel – das Grundgerüst` },
    { href: '#/dialogues', icon: 'users',   cls: 'nar',  title: 'Dialoge',            sub: () => `${DIALOGUES.length} Alltagsszenen zum Anhören` },
    { href: '#/pronounce', icon: 'mic',     cls: 'gold', title: 'Aussprache-Trainer', sub: () => 'Nachsprechen und mit dem Original vergleichen' },
    { href: '#/help',      icon: 'help',    cls: 'good', title: 'Aussprache-Hilfe',   sub: () => 'Lautschrift lesen, die schwierigen Laute, Betonung' }
  ],
  [
    { href: '#/stats',     icon: 'chart',   cls: 'ink',  title: 'Statistik',          sub: () => 'Streak, XP und Wortschatz' },
    { href: '#/settings',  icon: 'sliders', cls: 'ink',  title: 'Einstellungen',      sub: () => 'Stimme, Tempo, Tagesziel, Design' }
  ]
];

export const QUALITY = {
  recorded: ['Echte aserbaidschanische Aufnahmen', 'Neuronale az-AZ-Stimmen, in der App gespeichert – funktioniert auch offline.', 'good'],
  native:   ['Aserbaidschanische Systemstimme', 'Dein Gerät hat eine eigene aserbaidschanische Stimme.', 'good'],
  turkish:  ['Notlösung: türkische Stimme', 'Klingt hörbar türkisch – ə, q und x werden nur angenähert. Verlass dich auf die Lautschrift.', 'ok'],
  fallback: ['Notlösung: fremde Stimme', 'Die Aussprache kann deutlich abweichen.', 'warn'],
  none:     ['Keine Stimme gefunden', 'Weder Aufnahmen noch eine passende Gerätestimme vorhanden.', 'warn']
};

export function render() {
  const [label, text, level] = QUALITY[speech.quality] || QUALITY.none;
  return `<div class="view">
    ${pageHead('Mehr', 'Nachschlagen, vertiefen, einstellen.')}

    <a class="card status" href="#/settings">
      <span class="dot ${level}"></span>
      <div class="grow"><b style="font-size:15px">${label}</b><div class="muted" style="font-size:13.5px">${text}</div></div>
      <span class="muted">${icon('chevR')}</span>
    </a>

    ${GROUPS.map(g => `<div class="menu">${g.map(i => `<a class="menu-item" href="${i.href}">
      <div class="mi ${i.cls}">${icon(i.icon)}</div>
      <div class="grow"><b>${i.title}</b><small>${i.sub()}</small></div>
      <div class="chev">${icon('chevR')}</div>
    </a>`).join('')}</div>`).join('')}

    <p class="muted center" style="font-size:12.5px;margin-top:22px">
      Alle Daten bleiben auf diesem Gerät.<br>Kein Konto, keine Server, kein Tracking.
    </p>
  </div>`;
}
