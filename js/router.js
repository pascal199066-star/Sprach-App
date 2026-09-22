/** Schlanker Hash-Router. */
const routes = [];

/** @param {string} pattern z. B. '/lesson/:id' */
export function route(pattern, view) {
  routes.push({ parts: pattern.split('/').filter(Boolean), view });
}

export function resolve(hash) {
  const path = (hash || '').replace(/^#/, '') || '/home';
  const parts = path.split('/').filter(Boolean);
  for (const r of routes) {
    if (r.parts.length !== parts.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < parts.length; i++) {
      if (r.parts[i].startsWith(':')) params[r.parts[i].slice(1)] = decodeURIComponent(parts[i]);
      else if (r.parts[i] !== parts[i]) { ok = false; break; }
    }
    if (ok) return { view: r.view, params, path };
  }
  return null;
}

export function go(path) {
  location.hash = path.startsWith('#') ? path : '#' + path;
}
