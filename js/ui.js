/** Kleine Helfer für DOM, Zufall und Textvergleich. */

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Minimales Markdown: **fett**, `code`, Zeilenumbrüche. */
export function md(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const sample = (arr, n) => shuffle(arr).slice(0, n);
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/**
 * Vergleich getippter Antworten: Groß/Klein, Satzzeichen und die
 * typischen Sonderzeichen-Stolperfallen werden verziehen.
 */
export function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c')
    .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/x/g, 'h')
    .replace(/q/g, 'g')
    .replace(/[.,!?;:„“"'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Levenshtein-Abstand – für „fast richtig“-Rückmeldungen. */
export function editDistance(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** true = richtig, 'close' = kleiner Tippfehler, false = falsch */
export function checkTyped(input, expected) {
  const a = normalize(input), b = normalize(expected);
  if (!a) return false;
  if (a === b) return true;
  const d = editDistance(a, b);
  return d <= Math.max(1, Math.floor(b.length / 8)) ? 'close' : false;
}

let toastTimer = null;
export function toast(msg, ms = 2200) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

/** Dezente Haptik, wo das Gerät sie unterstützt. */
export function buzz(pattern = 10) {
  try { navigator.vibrate?.(pattern); } catch { /* egal */ }
}

export function fmtInt(n) { return new Intl.NumberFormat('de-DE').format(n); }
