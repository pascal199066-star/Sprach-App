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

/** true = richtig, 'close' = kleiner Tippfehler, false = falsch (für einfache Vergleiche) */
export function checkTyped(input, expected) {
  const r = compareTyped(input, expected);
  return r.status === 'right' ? true : r.status === 'close' ? 'close' : false;
}

/*
 * Buchstaben, die beim Tippen typischerweise verwechselt werden:
 * erwarteter Buchstabe → was stattdessen getippt wird (deutsche oder
 * türkische Gewohnheit). Solche Fehler gelten als „fast richtig“ –
 * aber nie als richtig, denn „gapı“ ist kein Aserbaidschanisch.
 */
const CONFUSABLE = {
  'ə': 'eaä', 'e': 'əä', 'ı': 'iu', 'i': 'ı', 'ş': 's', 's': 'şzß', 'ç': 'c', 'c': 'çj',
  'ğ': 'g', 'g': 'ğqk', 'ö': 'o', 'o': 'ö', 'ü': 'u', 'u': 'ü', 'q': 'gk', 'k': 'qg',
  'x': 'hk', 'h': 'x', 'y': 'j', 'j': 'y', 'v': 'w', 'z': 's'
};

/** Kleinbuchstaben, ohne Satzzeichen – mit Rückverweis auf die Originalposition. */
function prep(s) {
  const out = [];
  const map = [];
  let lastSpace = true;
  [...String(s)].forEach((ch, i) => {
    let c = ch === 'İ' ? 'i' : ch === 'I' ? 'i' : ch.toLowerCase();
    c = c.replace(/\u0307/g, '');
    if (/[.,!?;:„“"'’«»()…–-]/.test(c) || !c) return;
    if (/\s/.test(c)) {
      if (lastSpace) return;
      lastSpace = true;
      out.push(' '); map.push(i);
      return;
    }
    lastSpace = false;
    out.push(c); map.push(i);
  });
  while (out[out.length - 1] === ' ') { out.pop(); map.pop(); }
  return { chars: out, map };
}

/** Levenshtein mit Rückverfolgung: Liste der Schritte (gleich/ersetzt/fehlt/zu viel). */
function align(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      ops.unshift({ t: a[i - 1] === b[j - 1] ? 'eq' : 'sub', ai: i - 1, bj: j - 1 });
      i--; j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      ops.unshift({ t: 'miss', ai: i - 1 });     // erwartet, aber nicht getippt
      i--;
    } else {
      ops.unshift({ t: 'extra', bj: j - 1 });    // getippt, aber nicht erwartet
      j--;
    }
  }
  return { ops, dist: d[m][n] };
}

/**
 * Vergleicht eine getippte Antwort mit der Lösung.
 * @returns {{status:'right'|'close'|'wrong', issues:Array<{exp:string,got:string}>,
 *            expectedHtml:string, givenHtml:string}}
 */
export function compareTyped(input, expected) {
  const E = prep(expected), G = prep(input);
  const exp = E.chars, got = G.chars;
  if (!got.length) return { status: 'wrong', issues: [], expectedHtml: esc(expected), givenHtml: '' };
  if (exp.join('') === got.join('')) return { status: 'right', issues: [], expectedHtml: esc(expected), givenHtml: esc(input) };

  const { ops, dist } = align(exp, got);
  const issues = [];
  let other = 0;
  const badExp = new Set();
  const badGot = new Set();
  ops.forEach(o => {
    if (o.t === 'eq') return;
    if (o.ai !== undefined) badExp.add(E.map[o.ai]);
    if (o.bj !== undefined) badGot.add(o.bj);
    if (o.t === 'sub' && (CONFUSABLE[exp[o.ai]] || '').includes(got[o.bj])) {
      if (!issues.some(x => x.exp === exp[o.ai] && x.got === got[o.bj])) issues.push({ exp: exp[o.ai], got: got[o.bj] });
    } else {
      other++;
    }
  });

  const status = other === 0 ? 'close'
    : dist <= Math.max(1, Math.floor(exp.length / 8)) ? 'close'
    : 'wrong';

  const expectedHtml = [...String(expected)].map((ch, i) =>
    badExp.has(i) ? `<mark>${esc(ch)}</mark>` : esc(ch)).join('');
  const givenHtml = got.map((ch, j) =>
    badGot.has(j) ? `<mark>${esc(ch === ' ' ? '␣' : ch)}</mark>` : esc(ch)).join('');

  return { status, issues, expectedHtml, givenHtml };
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
