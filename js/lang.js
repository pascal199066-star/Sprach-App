/**
 * Welche Sprache gerade gelernt wird.
 *
 * Die Wahl liegt in einem eigenen localStorage-Schlüssel, damit sie schon
 * beim Laden der Datenmodule feststeht. Umschalten lädt die App neu – so
 * greifen alle Ansichten garantiert auf dieselbe Sprache zu.
 */
export const LANGS = {
  az: { id: 'az', name: 'Aserbaidschanisch', short: 'AZ', native: 'Azərbaycanca', mark: 'ə', tts: 'az', title: 'Azərbaycanca' },
  en: { id: 'en', name: 'Englisch',          short: 'EN', native: 'Business English', mark: 'En', tts: 'en', title: 'Business English' }
};

const KEY = 'azaz.lang';

export const LANG = (() => {
  try {
    const l = localStorage.getItem(KEY);
    return LANGS[l] ? l : 'az';
  } catch {
    return 'az';
  }
})();

export const PACK_META = LANGS[LANG];

export function switchLang(id) {
  if (!LANGS[id] || id === LANG) return;
  try { localStorage.setItem(KEY, id); } catch { /* ohne Speicher kein Wechsel */ }
  location.hash = '#/home';
  location.reload();
}
