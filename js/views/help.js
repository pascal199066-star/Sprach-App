/** Aussprache-Hilfe: wie man die Lautschrift liest und worauf es ankommt. */
import { speakBtn, backBar, icon, callout } from '../components.js';
import { esc } from '../ui.js';

const LEGEND = [
  ['ä',        'offenes ä wie in „Bär“ – so klingt ə', 'əl'],
  ['ı',        'dumpfes i ohne Punkt, zwischen i und u', 'qız'],
  ['ch',       'wie in „Bach“ – so klingt x', 'xoş'],
  ['dsch',     'wie das J in „Jeans“ – so klingt c', 'cavan'],
  ['tsch',     'wie in „Deutsch“ – so klingt ç', 'çay'],
  ['sch',      'wie in „Schule“ – so klingt ş', 'şəhər'],
  ['gh',       'weiches Rachen-g – so klingt ğ', 'dağ'],
  ['gj',       'weiches g vor hellen Vokalen – so klingt g', 'gecə'],
  ['g',        'deutsches g – so klingt q', 'qapı'],
  ['w',        'deutsches w – so klingt v', 'vaxt'],
  ['j',        'wie in „Jahr“ – so klingt y', 'yol'],
  ['ß',        'immer scharfes s – so klingt s', 'su'],
  ['s',        'summendes s wie in „Rose“ – so klingt z', 'zəng']
];

const TRAPS = [
  ['ə ≠ e', 'Das wichtigste Merkmal des Aserbaidschanischen. **ə** ist ein weites „ä“, **e** ein enges „e“. Wer beides gleich spricht, klingt türkisch.', ['ev', 'əl']],
  ['q klingt wie g', 'Nicht „ku“ sprechen: **qapı** = „gapı“. Am Wortende wird q zu „ch“: **uşaq** ≈ „uschach“.', ['qapı', 'uşaq']],
  ['x ist ch', 'Immer wie in „Bach“, nie wie „ks“: **xoş** = „chosch“.', ['xoş', 'yaxşı']],
  ['ı ohne Punkt', 'Ein ganz eigener, dumpfer Laut. **qız** (Mädchen) klingt anders als „kis“.', ['qız', 'balıq']],
  ['c ist dsch', '**cavan** = „dschawan“. Das deutsche „z“ gibt es nicht.', ['cavan', 'gecə']],
  ['ğ wird gesprochen', 'Anders als im Türkischen ist ğ hörbar: ein weiches „gh“ im Rachen, z. B. **dağ** (Berg).', ['dağ', 'ağac']]
];

export function render() {
  return `<div class="view">
    ${backBar('Aussprache-Hilfe', '#/more', 'Lautschrift lesen und die Stolperfallen kennen')}

    ${callout('info', 'So liest du die Lautschrift', 'Unter jedem Wort steht in eckigen Klammern, wie ein Deutscher es aussprechen würde. Die Silbe in **GROSSBUCHSTABEN** wird betont – meist ist es die letzte. Maßgeblich ist aber immer die Aufnahme: erst hören, dann lesen.')}

    <div class="sec-h">${icon('abc')}<h2>Zeichen der Lautschrift</h2></div>
    <div class="card">
      <div class="table-wrap"><table class="legend-table">
        <thead><tr><th>Lautschrift</th><th>Aussprache</th><th></th></tr></thead>
        <tbody>${LEGEND.map(([k, d, ex]) => `<tr><td>${esc(k)}</td><td>${esc(d)}</td><td style="width:44px">${speakBtn(ex)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>

    <div class="sec-h">${icon('warn')}<h2>Die sechs Stolperfallen</h2></div>
    ${TRAPS.map(([t, d, ex]) => `<div class="card">
      <h3>${esc(t)}</h3>
      <p style="font-size:15px;color:var(--text-2);margin:4px 0 10px">${d.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}</p>
      <div class="row" style="gap:8px;flex-wrap:wrap">${ex.map(w => `<button class="chip" data-say="${esc(w)}">${icon('speaker')}${esc(w)}</button>`).join('')}</div>
    </div>`).join('')}

    <div class="sec-h">${icon('target')}<h2>Betonung</h2></div>
    <div class="card">
      <p style="font-size:15px;color:var(--text-2);margin:0">Aserbaidschanisch betont fast immer die <b>letzte Silbe</b>: <b>ki-TAB</b>, <b>şə-HƏR</b>. Ausnahme: Personalendungen wie <b>-am, -san, -dır</b> ziehen die Betonung nicht an – <b>yax-ŞI-yam</b>, <b>al-MA-nam</b>. Bei manchen Wörtern gibt es Ausnahmen – im Zweifel hat die Aufnahme recht.</p>
    </div>
  </div>`;
}
