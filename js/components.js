/** Wiederverwendbare Bausteine (liefern HTML-Strings). */
import { esc, md } from './ui.js';

/* Linien-Symbole, 24×24, Strichstärke über CSS (.i) */
export const ICONS = {
  learn:   '<path d="M3 5.5c3-1.3 6-1.3 9 .5 3-1.8 6-1.8 9-.5v13c-3-1.3-6-1.3-9 .5-3-1.8-6-1.8-9-.5z"/><path d="M12 6v13"/>',
  repeat:  '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5"/><path d="M4 20v-4.5h4.5"/>',
  abc:     '<text x="12" y="16.6" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor" stroke="none" font-family="-apple-system,BlinkMacSystemFont,system-ui,sans-serif">Əə</text>',
  chat:    '<path d="M6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-7A2.5 2.5 0 0 1 6.5 4z"/>',
  grid:    '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
  speaker: '<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18.4 6.2a8.2 8.2 0 0 1 0 11.6"/>',
  slow:    '<path d="M3.5 15.5a7.5 7.5 0 0 1 15 0z"/><path d="M18.5 13.2h1.3a1.7 1.7 0 0 0 0-3.4h-.6a2 2 0 0 0-1.9 1.4"/><path d="M6.5 15.5V18M15.5 15.5V18M3.5 15.5 2 16.5M8 15.5l3-5.5 3 5.5"/>',
  mic:     '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  check:   '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x:       '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  chevR:   '<path d="m9.5 6 6 6-6 6"/>',
  chevL:   '<path d="m14.5 6-6 6 6 6"/>',
  arrowR:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
  bulb:    '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  flame:   '<path d="M12 3c1 3.5 5 5.5 5 10.2a5 5 0 0 1-10 0c0-2 .8-3.6 2-4.6.2 1.6 1 2.6 2 2.6-1-3 0-6.2 1-8.2z"/>',
  star:    '<path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
  target:  '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
  trophy:  '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5.2a3 3 0 0 0 3 4.2M16 6h2.8a3 3 0 0 1-3 4.2M12 13v4M8.5 20.5h7M10 17h4v3.5h-4z"/>',
  lock:    '<rect x="5" y="11" width="14" height="9.5" rx="2.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
  play:    '<path d="M8.5 5.8v12.4L18.5 12z" fill="currentColor"/>',
  stop:    '<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>',
  info:    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>',
  help:    '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.6a2.5 2.5 0 0 1 4.9.7c0 1.8-2.5 2.2-2.5 3.9M12 17v.1"/>',
  warn:    '<path d="M12 4.2 2.8 19.8h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  chart:   '<path d="M5 20V11M11 20V5M17 20v-6M3 20.5h18"/>',
  book:    '<path d="M5.5 4.5A1.5 1.5 0 0 1 7 3h12v15.5H7a1.5 1.5 0 0 0-1.5 1.5z"/><path d="M5.5 20A1.5 1.5 0 0 0 7 21.5h12v-3"/><path d="M9.5 7.5h6"/>',
  sparkle: '<path d="M12 3.5l1.9 5.6 5.6 1.9-5.6 1.9L12 18.5l-1.9-5.6L4.5 11l5.6-1.9z"/>',
  parts:   '<rect x="2.5" y="8.5" width="7.5" height="7" rx="1.8"/><rect x="14" y="8.5" width="7.5" height="7" rx="1.8"/><path d="M10 12h4"/>',
  keyboard:'<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9"/>',
  eye:     '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  search:  '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  download:'<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
  ear:     '<path d="M7 9.5a5 5 0 0 1 10 0c0 3-2.5 3.8-3 6.2A3 3 0 0 1 11 18.5a2.6 2.6 0 0 1-2.4-1.5"/><path d="M10 10a2 2 0 0 1 4 0c0 1.2-1 1.6-1.5 2.3"/>',
  wave:    '<path d="M8 13.5V6.5a1.5 1.5 0 0 1 3 0V12M11 11V4.8a1.5 1.5 0 0 1 3 0V11M14 11.2V6.3a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.3a6 6 0 0 1-5-2.7L3.4 15a1.6 1.6 0 0 1 2.6-1.8L8 15.8"/>',
  user:    '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  users:   '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.3a6.5 6.5 0 0 1 3.5 5.7"/>',
  hash:    '<path d="M9.5 3.5 8 20.5M16.5 3.5 15 20.5M4.5 9h16M3.5 15h16"/>',
  heart:   '<path d="M12 20s-7.5-4.4-7.5-10A4.5 4.5 0 0 1 12 7.2a4.5 4.5 0 0 1 7.5 2.8c0 5.6-7.5 10-7.5 10z"/>',
  brief:   '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"/>',
  cup:     '<path d="M5 8.5h11V13a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M4 21h14"/><path d="M8.5 3.5c-.6.8-.6 1.7 0 2.5M12.5 3.5c-.6.8-.6 1.7 0 2.5"/>',
  bag:     '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  sun:     '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  bed:     '<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11.5" r="2"/>',
  pin:     '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.5"/>',
  car:     '<path d="M6.5 17H5a1 1 0 0 1-1-1v-3.5L6.2 7h11.6l2.2 5.5V16a1 1 0 0 1-1 1h-1.5M9.8 17h4.4M4 12.5h16"/><circle cx="8" cy="17" r="1.8"/><circle cx="16" cy="17" r="1.8"/>',
  mail:    '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  scale:   '<path d="M12 4v16M7 20h10M5 7h14"/><path d="m5 7-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
  timer:   '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/>',
  grammar: '<path d="M4 6h7M4 12h10M4 18h6"/><path d="m15 18 3-8 3 8M16.2 15.5h3.6"/>'
};

/** Linien-Symbol als SVG. */
export function icon(name, cls = '') {
  return `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.star}</svg>`;
}

/** Buta – das tropfenförmige Ornament aus Teppichen und Tüchern. */
export const BUTA = '<svg class="buta" viewBox="0 0 60 60" aria-hidden="true"><path d="M31 53c15-7 20-24 11-35C35 9 21 8 16 17c-4 7 0 15 8 15 6 0 8-6 5-9-2-2-6-1-6 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="27" cy="20" r="2" fill="currentColor"/></svg>';

/**
 * Abspiel-Knopf. Der globale Klick-Handler in app.js reagiert auf [data-say].
 * @param {string} text  aserbaidschanischer Text
 * @param {{size?:string, slow?:boolean, title?:string, voice?:string}} [o]
 */
export function speakBtn(text, { size = '', slow = false, title, voice } = {}) {
  const label = title || (slow ? 'Langsam anhören' : 'Anhören');
  return `<button class="speak${size ? ' ' + size : ''}${slow ? ' slow' : ''}" data-say="${esc(text)}"`
    + `${slow ? ' data-slow' : ''}${voice ? ` data-voice="${voice}"` : ''} aria-label="${esc(label)}" title="${esc(label)}">`
    + icon(slow ? 'slow' : 'speaker') + '</button>';
}

/** Lautschrift in eckigen Klammern. */
export function phon(ph) {
  return ph ? `<span class="ph">[${esc(ph)}]</span>` : '';
}

/** Wort + Übersetzung + Lautschrift + Audio. */
export function vocabRow(v, { phonetic = true, extra = '' } = {}) {
  return `<div class="vocab-item">
    ${speakBtn(v.t)}
    <div class="grow">
      <div class="az">${esc(v.t)}</div>
      <div class="de">${esc(v.de)}</div>
      ${phonetic && v.ph ? phon(v.ph) : ''}
      ${extra}
    </div>
  </div>`;
}

/**
 * Bausteine eines Satzes: „Almaniya · -dan · -am“ mit Bedeutung darunter.
 * Endungen (mit „-“) werden optisch an das vorige Stück angehängt.
 */
export function breakdown(br, { title = true } = {}) {
  if (!br?.length) return '';
  return `<div class="parts">
    ${title ? `<div class="parts-h">${icon('parts')}<span>So ist es gebaut</span></div>` : ''}
    <div class="parts-row">${br.map(([piece, gloss]) => {
      const suffix = piece.startsWith('-');
      return `<span class="part${suffix ? ' suf' : ''}"><b>${esc(piece)}</b><small>${esc(gloss)}</small></span>`;
    }).join('')}</div>
  </div>`;
}

/*
 * Aussprache-Tipps: erkennt die Stolperlaute in einem Wort.
 * Reihenfolge = Reihenfolge im Wort, höchstens drei.
 */
const SOUND_TIPS = {
  'ə': ['ə', 'offenes ä wie in „Bär“'],
  'x': ['x', 'ch wie in „Bach“'],
  'q': ['q', 'wie deutsches g'],
  'q$': ['q am Ende', 'klingt wie „ch“'],
  'ı': ['ı', 'dumpfes i ohne Punkt'],
  'c': ['c', 'dsch wie in „Jeans“'],
  'ğ': ['ğ', 'weiches Rachen-gh, hörbar'],
  'v': ['v', 'wie deutsches w'],
  'z': ['z', 'summendes s wie in „Rose“'],
  'y': ['y', 'wie deutsches j'],
  '^s': ['s am Anfang', 'scharf wie „ß“']
};

export function soundTips(az, max = 3) {
  const text = String(az).toLowerCase();
  const found = [];
  const seen = new Set();
  const words = text.split(/[^a-zəçğıöşüq]+/i).filter(Boolean);
  words.forEach(w => {
    [...w].forEach((ch, i) => {
      let key = ch;
      if (ch === 'q' && i === w.length - 1) key = 'q$';
      if (ch === 's' && i === 0) key = '^s';
      if (SOUND_TIPS[key] && !seen.has(key)) { seen.add(key); found.push(SOUND_TIPS[key]); }
    });
  });
  if (!found.length) return '';
  return `<div class="sound-tips">${found.slice(0, max).map(([l, t]) =>
    `<span class="stip"><b>${esc(l)}</b>${esc(t)}</span>`).join('')}</div>`;
}

export function progressBar(pct, cls = '') {
  return `<div class="bar${cls ? ' ' + cls : ''}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
}

/** Kreis-Fortschritt (0–100). */
export function ring(pct, label = '', size = 56) {
  const r = 22, c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return `<div class="ring" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="${r}" class="ring-bg"/><circle cx="26" cy="26" r="${r}" class="ring-fg" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
    <span>${label}</span>
  </div>`;
}

export function backBar(title, href = '#/home', sub = '') {
  return `<header class="page-head sub-page">
    <a class="icon-btn" href="${href}" aria-label="Zurück">${icon('chevL')}</a>
    <div class="grow"><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>
  </header>`;
}

export function pageHead(title, sub = '', right = '') {
  return `<header class="page-head">
    <div class="grow"><h1>${esc(title)}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>${right}
  </header>`;
}

export function emptyState(iconName, title, text) {
  return `<div class="card empty">
    <div class="empty-ic">${icon(iconName)}</div>
    <h3>${esc(title)}</h3>
    <p class="muted">${esc(text)}</p>
  </div>`;
}

/** Beispielsatz mit Audio. */
export function exampleLine(v) {
  if (!v?.ex) return '';
  return `<div class="example-line">${speakBtn(v.ex)}<div class="grow"><div class="lbl-s">Beispiel</div><div>${esc(v.ex)}</div></div></div>`;
}

/** Umschalter zwischen den Sprachkursen. */
export function langSwitch(active) {
  const opts = [['az', 'Azərbaycanca'], ['en', 'Business English']];
  return `<div class="seg lang-switch" role="group" aria-label="Sprache wählen">
    ${opts.map(([id, label]) => `<button data-lang="${id}" class="${id === active ? 'on' : ''}" aria-pressed="${id === active}">${label}</button>`).join('')}
  </div>`;
}

/** Hinweisbox mit Symbol. */
export function callout(kind, title, body) {
  const ic = { tip: 'bulb', info: 'info', warn: 'warn', ok: 'check' }[kind] || 'info';
  return `<div class="callout ${kind}">${icon(ic)}<div class="grow">${title ? `<b>${esc(title)}</b>` : ''}<div>${md(body)}</div></div></div>`;
}
