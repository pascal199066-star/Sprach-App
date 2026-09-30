/** „Mehr“: Einstiegspunkte zu allem, was nicht in die Tabs passt. */
import { GRAMMAR, DIALOGUES, SPEAKING, PACK } from '../../data/active.js';
import { speech } from '../speech.js';
import { pageHead, icon } from '../components.js';

const AZ = PACK.id === 'az';
const GROUPS = [
  [
    { href: '#/grammar',   icon: 'grammar', cls: '',     title: AZ ? 'Grammatik' : 'Grammatik & Stil', sub: () => `${GRAMMAR.length} kurze Kapitel – ${AZ ? 'das Grundgerüst' : 'typische Fehler, Ton, Struktur'}` },
    { href: '#/dialogues', icon: 'users',   cls: 'nar',  title: AZ ? 'Dialoge' : 'Business-Dialoge', sub: () => `${DIALOGUES.length} ${AZ ? 'Alltagsszenen' : 'Situationen aus dem Arbeitsalltag'} zum Anhören` },
    AZ ? { href: '#/speak', icon: 'timer', cls: 'good', title: 'Satz-Sprint', sub: () => 'Schnell antworten, laut sprechen' } : null,
    { href: '#/pronounce', icon: 'mic',     cls: 'gold', title: 'Aussprache-Trainer', sub: () => 'Nachsprechen und mit dem Original vergleichen' },
    AZ ? { href: '#/help',  icon: 'help',    cls: 'good', title: 'Aussprache-Hilfe',   sub: () => 'Lautschrift lesen, die schwierigen Laute, Betonung' } : null
  ].filter(Boolean),
  [
    { href: '#/stats',     icon: 'chart',   cls: 'ink',  title: 'Statistik',          sub: () => 'Streak, XP und Wortschatz' },
    { href: '#/settings',  icon: 'sliders', cls: 'ink',  title: 'Einstellungen',      sub: () => 'Stimme, Tempo, Tagesziel, Design' }
  ]
];

export const QUALITY = {
  recorded: AZ
    ? ['Echte aserbaidschanische Aufnahmen', 'Neuronale az-AZ-Stimmen, in der App gespeichert – funktioniert auch offline.', 'good']
    : ['Aufnahmen mit neuronalen Stimmen', 'Britisch und amerikanisch, in der App gespeichert – funktioniert auch offline.', 'good'],
  native:   AZ
    ? ['Aserbaidschanische Systemstimme', 'Dein Gerät hat eine eigene aserbaidschanische Stimme.', 'good']
    : ['Englische Systemstimme', 'Die Stimme deines Geräts – bis die Aufnahmen geladen sind.', 'good'],
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
