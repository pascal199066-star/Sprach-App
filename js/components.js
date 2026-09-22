/** Wiederverwendbare Bausteine (liefern HTML-Strings). */
import { esc } from './ui.js';

export const ICONS = {
  speaker: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 5V4L8 9H4zm11.5 3a4 4 0 0 0-2.3-3.6v7.2A4 4 0 0 0 15.5 12zM13.2 3.2v2.1A6.8 6.8 0 0 1 13.2 20.8v2.1A8.9 8.9 0 0 0 13.2 3.2z"/></svg>',
  home:    '<svg viewBox="0 0 24 24"><path d="M12 3 2 11h3v9h6v-6h2v6h6v-9h3L12 3z"/></svg>',
  cards:   '<svg viewBox="0 0 24 24"><path d="M4 6h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm14-2v13h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2z"/></svg>',
  abc:     '<svg viewBox="0 0 24 24"><path d="M6.6 4h2.3l3.6 11H10l-.7-2.4H5.9L5.2 15H2.9L6.6 4zm.5 2.9L6.4 10.8h2.4L7.7 6.9h-.6zM14.5 4h4.2c2 0 3.1 1 3.1 2.6 0 1.1-.6 1.9-1.6 2.2 1.2.3 2 1.2 2 2.5 0 1.9-1.4 3-3.6 3h-4.1V4zm2.2 4.4h1.6c.8 0 1.3-.4 1.3-1.1s-.5-1.1-1.3-1.1h-1.6v2.2zm0 4.5h1.8c.9 0 1.4-.4 1.4-1.2s-.5-1.2-1.4-1.2h-1.8v2.4zM3 18h18v2H3z"/></svg>',
  chat:    '<svg viewBox="0 0 24 24"><path d="M12 3c5 0 9 3.3 9 7.4 0 4-4 7.3-9 7.3-.9 0-1.8-.1-2.6-.3L4 20l1.3-3.4C3.9 15.2 3 13 3 10.4 3 6.3 7 3 12 3z"/></svg>',
  more:    '<svg viewBox="0 0 24 24"><path d="M5 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>',
  mic:     '<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z"/></svg>',
  check:   '<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>'
};

/** Abspiel-Knopf. Der globale Klick-Handler in app.js reagiert auf [data-say]. */
export function speakBtn(text, { size = '', slow = false, title = 'Anhören' } = {}) {
  return `<button class="speak ${size}${slow ? ' slow' : ''}" data-say="${esc(text)}"${slow ? ' data-slow' : ''} aria-label="${esc(title)}">`
    + (slow ? '0.5×' : ICONS.speaker) + '</button>';
}

/** Wort + Übersetzung + Lautschrift + Audio. */
export function vocabRow(v, { phonetic = true } = {}) {
  return `<div class="vocab-item">
    ${speakBtn(v.az)}
    <div class="grow">
      <div class="az">${esc(v.az)}</div>
      <div class="de">${esc(v.de)}</div>
      ${phonetic && v.ph ? `<div class="ph">[${esc(v.ph)}]</div>` : ''}
    </div>
  </div>`;
}

export function progressBar(pct) {
  return `<div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
}

export function backBar(title, href = '#/home') {
  return `<div class="row" style="gap:10px;margin:2px 0 14px">
    <a class="x" href="${href}" aria-label="Zurück" style="text-decoration:none">‹</a>
    <h1 style="font-size:22px;margin:0">${esc(title)}</h1>
  </div>`;
}

export function emptyState(emoji, title, text) {
  return `<div class="card center" style="padding:30px 20px">
    <div style="font-size:42px">${emoji}</div>
    <h3 style="margin-top:10px">${esc(title)}</h3>
    <p class="muted" style="margin:0">${esc(text)}</p>
  </div>`;
}
