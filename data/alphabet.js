/**
 * Das aserbaidschanische Alphabet (32 Buchstaben, lateinische Schrift seit 1991).
 * ph   = Lautschrift für deutsche Muttersprachler
 * tip  = Eselsbrücke / typischer Fehler
 * ex   = Beispielwort (beginnt mit dem Buchstaben, soweit möglich)
 * more = weitere Wörter, in denen der Laut vorkommt
 */
export const ALPHABET = [
  { up: 'A', low: 'a', ipa: '[ɑ]',  ph: 'a',            tip: 'Offenes, dunkles a wie in „Vater“.',
    ex: 'ata', exDe: 'Vater', more: [{ az: 'alma', de: 'Apfel' }, { az: 'ad', de: 'Name' }] },
  { up: 'B', low: 'b', ipa: '[b]',  ph: 'b',            tip: 'Wie im Deutschen.',
    ex: 'baba', exDe: 'Großvater', more: [{ az: 'bal', de: 'Honig' }, { az: 'bazar', de: 'Markt' }] },
  { up: 'C', low: 'c', ipa: '[dʒ]', ph: 'dsch',         tip: 'Wie das J in „Jeans“ – **nie** wie deutsches C oder Z.',
    ex: 'cavan', exDe: 'jung', more: [{ az: 'cib', de: 'Tasche' }, { az: 'gecə', de: 'Nacht' }] },
  { up: 'Ç', low: 'ç', ipa: '[tʃ]', ph: 'tsch',         tip: 'Wie „tsch“ in „Deutsch“.',
    ex: 'çay', exDe: 'Tee', more: [{ az: 'çörək', de: 'Brot' }, { az: 'üç', de: 'drei' }] },
  { up: 'D', low: 'd', ipa: '[d]',  ph: 'd',            tip: 'Wie im Deutschen – auch am Wortende nicht zu „t“ verhärten.',
    ex: 'dost', exDe: 'Freund', more: [{ az: 'dil', de: 'Sprache, Zunge' }, { az: 'dəniz', de: 'Meer' }] },
  { up: 'E', low: 'e', ipa: '[e]',  ph: 'e',            tip: 'Geschlossenes e wie in „Beet“, aber kurz. Nicht mit **ə** verwechseln!',
    ex: 'ev', exDe: 'Haus', more: [{ az: 'sevgi', de: 'Liebe' }, { az: 'pendir', de: 'Käse' }] },
  { up: 'Ə', low: 'ə', ipa: '[æ]',  ph: 'ä',            tip: 'DER Buchstabe des Aserbaidschanischen: offenes ä wie in „Bär“, Mund weit auf. Im Türkischen gibt es ihn nicht – daran erkennt man echtes Aserbaidschanisch sofort.',
    ex: 'əl', exDe: 'Hand', more: [{ az: 'ət', de: 'Fleisch' }, { az: 'şəhər', de: 'Stadt' }] },
  { up: 'F', low: 'f', ipa: '[f]',  ph: 'f',            tip: 'Wie im Deutschen.',
    ex: 'fikir', exDe: 'Gedanke', more: [{ az: 'fincan', de: 'Tasse' }, { az: 'fil', de: 'Elefant' }] },
  { up: 'G', low: 'g', ipa: '[ɟ]',  ph: 'gj',           tip: 'Weiches g, fast wie „gj“. Steht fast nur neben hellen Vokalen (e, ə, i, ö, ü).',
    ex: 'gecə', exDe: 'Nacht', more: [{ az: 'göz', de: 'Auge' }, { az: 'gül', de: 'Rose, Blume' }] },
  { up: 'Ğ', low: 'ğ', ipa: '[ɣ]',  ph: 'gh',           tip: 'Weiches, im Rachen geriebenes „gh“ – ähnlich dem französischen r. Anders als im Türkischen wird es **hörbar gesprochen**. Steht nie am Wortanfang.',
    ex: 'ağac', exDe: 'Baum', more: [{ az: 'dağ', de: 'Berg' }, { az: 'yağış', de: 'Regen' }] },
  { up: 'H', low: 'h', ipa: '[h]',  ph: 'h',            tip: 'Immer hörbar gehaucht – auch mitten im Wort und am Ende (şəhər).',
    ex: 'hava', exDe: 'Wetter, Luft', more: [{ az: 'hər', de: 'jeder' }, { az: 'şəhər', de: 'Stadt' }] },
  { up: 'X', low: 'x', ipa: '[x]',  ph: 'ch',           tip: 'Wie das ch in „Bach“ – **nie** wie „ks“!',
    ex: 'xoş', exDe: 'angenehm', more: [{ az: 'xalça', de: 'Teppich' }, { az: 'yaxşı', de: 'gut' }] },
  { up: 'I', low: 'ı', ipa: '[ɯ]',  ph: 'ı (dumpf)',    tip: 'Punktloses ı: dumpfer Laut zwischen i und u – Lippen breit wie bei i, Zunge hinten wie bei u. Ähnlich dem e in „Butter“.',
    ex: 'qızıl', exDe: 'Gold', more: [{ az: 'qız', de: 'Mädchen' }, { az: 'balıq', de: 'Fisch' }] },
  { up: 'İ', low: 'i', ipa: '[i]',  ph: 'i',            tip: 'Normales i. Achtung: Auch der Großbuchstabe hat einen Punkt (İ).',
    ex: 'it', exDe: 'Hund', more: [{ az: 'iki', de: 'zwei' }, { az: 'bir', de: 'eins' }] },
  { up: 'J', low: 'j', ipa: '[ʒ]',  ph: 'sch (weich)',  tip: 'Weiches sch wie das J in „Journal“. Selten, meist in Fremdwörtern.',
    ex: 'jurnal', exDe: 'Zeitschrift', more: [{ az: 'jaket', de: 'Jacke' }, { az: 'müjdə', de: 'gute Nachricht' }] },
  { up: 'K', low: 'k', ipa: '[c]',  ph: 'k',            tip: 'Neben hellen Vokalen weich, fast wie „kj“; sonst wie deutsches k.',
    ex: 'kitab', exDe: 'Buch', more: [{ az: 'kənd', de: 'Dorf' }, { az: 'kişi', de: 'Mann' }] },
  { up: 'Q', low: 'q', ipa: '[g]',  ph: 'g',            tip: 'Wird wie deutsches **g** gesprochen – nie wie „ku“. Am Wortende klingt es wie „ch“: uşaq ≈ „uschach“.',
    ex: 'qapı', exDe: 'Tür', more: [{ az: 'qar', de: 'Schnee' }, { az: 'uşaq', de: 'Kind' }] },
  { up: 'L', low: 'l', ipa: '[l]',  ph: 'l',            tip: 'Wie im Deutschen.',
    ex: 'limon', exDe: 'Zitrone', more: [{ az: 'lalə', de: 'Tulpe' }, { az: 'gül', de: 'Blume' }] },
  { up: 'M', low: 'm', ipa: '[m]',  ph: 'm',            tip: 'Wie im Deutschen.',
    ex: 'maşın', exDe: 'Auto', more: [{ az: 'mən', de: 'ich' }, { az: 'alma', de: 'Apfel' }] },
  { up: 'N', low: 'n', ipa: '[n]',  ph: 'n',            tip: 'Wie im Deutschen.',
    ex: 'nənə', exDe: 'Großmutter', more: [{ az: 'nar', de: 'Granatapfel' }, { az: 'on', de: 'zehn' }] },
  { up: 'O', low: 'o', ipa: '[o]',  ph: 'o',            tip: 'Wie in „Ofen“, aber kurz.',
    ex: 'od', exDe: 'Feuer', more: [{ az: 'oğul', de: 'Sohn' }, { az: 'yol', de: 'Weg' }] },
  { up: 'Ö', low: 'ö', ipa: '[œ]',  ph: 'ö',            tip: 'Wie in „Löffel“.',
    ex: 'göz', exDe: 'Auge', more: [{ az: 'dörd', de: 'vier' }, { az: 'söz', de: 'Wort' }] },
  { up: 'P', low: 'p', ipa: '[p]',  ph: 'p',            tip: 'Wie im Deutschen.',
    ex: 'pul', exDe: 'Geld', more: [{ az: 'pişik', de: 'Katze' }, { az: 'qapı', de: 'Tür' }] },
  { up: 'R', low: 'r', ipa: '[ɾ]',  ph: 'r (gerollt)',  tip: 'Mit der Zungenspitze angeschlagen – wie im Bairischen, nicht im Rachen.',
    ex: 'rəng', exDe: 'Farbe', more: [{ az: 'bir', de: 'eins' }, { az: 'şəhər', de: 'Stadt' }] },
  { up: 'S', low: 's', ipa: '[s]',  ph: 'ß',            tip: 'Immer scharf (stimmlos) wie in „Fuß“ – nie summend wie in „Sonne“. In der Lautschrift deshalb „ß“.',
    ex: 'su', exDe: 'Wasser', more: [{ az: 'səs', de: 'Stimme' }, { az: 'salam', de: 'Hallo' }] },
  { up: 'Ş', low: 'ş', ipa: '[ʃ]',  ph: 'sch',          tip: 'Wie „sch“ in „Schule“.',
    ex: 'şəhər', exDe: 'Stadt', more: [{ az: 'şir', de: 'Löwe' }, { az: 'beş', de: 'fünf' }] },
  { up: 'T', low: 't', ipa: '[t]',  ph: 't',            tip: 'Wie im Deutschen.',
    ex: 'tələbə', exDe: 'Student', more: [{ az: 'tut', de: 'Maulbeere' }, { az: 'ət', de: 'Fleisch' }] },
  { up: 'U', low: 'u', ipa: '[u]',  ph: 'u',            tip: 'Wie in „Mut“, aber kurz.',
    ex: 'uşaq', exDe: 'Kind', more: [{ az: 'su', de: 'Wasser' }, { az: 'qum', de: 'Sand' }] },
  { up: 'Ü', low: 'ü', ipa: '[y]',  ph: 'ü',            tip: 'Wie in „müde“.',
    ex: 'üz', exDe: 'Gesicht', more: [{ az: 'üç', de: 'drei' }, { az: 'gül', de: 'Blume' }] },
  { up: 'V', low: 'v', ipa: '[v]',  ph: 'w',            tip: 'Wie das W in „Wasser“ – nie wie deutsches V in „Vogel“.',
    ex: 'vaxt', exDe: 'Zeit', more: [{ az: 'ev', de: 'Haus' }, { az: 'var', de: 'es gibt' }] },
  { up: 'Y', low: 'y', ipa: '[j]',  ph: 'j',            tip: 'Wie das J in „Jahr“ – nie wie ü.',
    ex: 'yol', exDe: 'Weg', more: [{ az: 'yağış', de: 'Regen' }, { az: 'çay', de: 'Tee' }] },
  { up: 'Z', low: 'z', ipa: '[z]',  ph: 's (summend)',  tip: 'Summendes s wie in „Rose“ – **nie** wie deutsches z („ts“).',
    ex: 'zəng', exDe: 'Anruf, Klingel', more: [{ az: 'duz', de: 'Salz' }, { az: 'göz', de: 'Auge' }] }
];

/** Buchstaben, die deutschen Lernenden erfahrungsgemäß die meisten Probleme machen. */
export const TRICKY = ['c', 'ə', 'g', 'ğ', 'x', 'ı', 'q', 'v', 'y', 'z'];

export const LETTER_BY_LOW = Object.fromEntries(ALPHABET.map(l => [l.low, l]));
