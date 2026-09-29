/**
 * Dateinamen für die vorab aufgenommenen Audiodateien.
 *
 * Wird von der App UND vom Erzeugungsskript (tools/collect-audio.mjs)
 * benutzt – beide müssen für denselben Text denselben Namen berechnen.
 */

/** Stimmen, für die Aufnahmen erzeugt werden. */
export const VOICES = {
  f: { id: 'az-AZ-BanuNeural',  label: 'Banu',  desc: 'Frauenstimme' },
  m: { id: 'az-AZ-BabekNeural', label: 'Babək', desc: 'Männerstimme' }
};

/** Leerraum vereinheitlichen, damit „Salam “ und „Salam“ dieselbe Datei treffen. */
export function cleanText(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Was die Stimme tatsächlich vorlesen soll: Pfeile und Schrägstriche
 * aus Lehrbeispielen („kitab → kitablar“, „da / də“) werden zu Pausen.
 */
export function spokenText(text) {
  return cleanText(text)
    .replace(/\s*→\s*/g, ', ')
    .replace(/\s+\/\s+/g, ', ')
    .replace(/…/g, '');
}

/** FNV-1a (32 Bit) über die UTF-8-Bytes – kurz, stabil, überall gleich. */
function fnv1a(str) {
  const bytes = new TextEncoder().encode(str);
  let h = 0x811c9dc5;
  for (const b of bytes) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Relativer Pfad der Aufnahme, z. B. „f/1a2b3c4d“. */
export function audioKey(text, voice = 'f') {
  return `${voice}/${fnv1a(cleanText(text))}`;
}
