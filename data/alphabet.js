/**
 * Das aserbaidschanische Alphabet (32 Buchstaben, lateinische Schrift seit 1991).
 * ph  = Lautschrift für deutsche Muttersprachler
 * tip = Eselsbrücke / typischer Fehler
 */
export const ALPHABET = [
  { up: 'A', low: 'a', ipa: '[ɑ]',  ph: 'a',            tip: 'Wie das a in „Vater“ – offen und dunkel.',            ex: 'ata',      exDe: 'Vater' },
  { up: 'B', low: 'b', ipa: '[b]',  ph: 'b',            tip: 'Wie im Deutschen.',                                    ex: 'baba',     exDe: 'Großvater' },
  { up: 'C', low: 'c', ipa: '[dʒ]', ph: 'dsch',         tip: 'Wie das J in „Jeans“ – NICHT wie deutsches C/Z.',      ex: 'cavan',    exDe: 'jung' },
  { up: 'Ç', low: 'ç', ipa: '[tʃ]', ph: 'tsch',         tip: 'Wie in „Deutsch“.',                                    ex: 'çay',      exDe: 'Tee' },
  { up: 'D', low: 'd', ipa: '[d]',  ph: 'd',            tip: 'Wie im Deutschen.',                                    ex: 'dost',     exDe: 'Freund' },
  { up: 'E', low: 'e', ipa: '[e]',  ph: 'e',            tip: 'Geschlossenes e wie in „Beet“.',                       ex: 'ev',       exDe: 'Haus' },
  { up: 'Ə', low: 'ə', ipa: '[æ]',  ph: 'ä',            tip: 'DER Buchstabe des Aserbaidschanischen: offenes ä wie in „Bär“. Gibt es im Türkischen nicht!', ex: 'əl', exDe: 'Hand' },
  { up: 'F', low: 'f', ipa: '[f]',  ph: 'f',            tip: 'Wie im Deutschen.',                                    ex: 'fikir',    exDe: 'Gedanke' },
  { up: 'G', low: 'g', ipa: '[ɟ]',  ph: 'gj',           tip: 'Weiches g, fast wie „gj“ – nur vor hellen Vokalen.',   ex: 'gecə',     exDe: 'Nacht' },
  { up: 'Ğ', low: 'ğ', ipa: '[ɣ]',  ph: 'gh (gehaucht)',tip: 'Ein im Rachen gehauchtes g; oft dehnt es nur den Vokal davor.', ex: 'ağac', exDe: 'Baum' },
  { up: 'H', low: 'h', ipa: '[h]',  ph: 'h',            tip: 'Immer gehaucht, auch im Wortinneren.',                 ex: 'hava',     exDe: 'Wetter, Luft' },
  { up: 'X', low: 'x', ipa: '[x]',  ph: 'ch',           tip: 'Wie das ch in „Bach“ – nicht wie „ks“!',               ex: 'xoş',      exDe: 'angenehm' },
  { up: 'I', low: 'ı', ipa: '[ɯ]',  ph: 'i-dumpf',      tip: 'Punktloses ı: dumpfer Laut zwischen i und u, wie das zweite e in „Butter“.', ex: 'qızıl', exDe: 'Gold' },
  { up: 'İ', low: 'i', ipa: '[i]',  ph: 'i',            tip: 'Normales i – auch der GROSSBUCHSTABE hat einen Punkt.',ex: 'it',       exDe: 'Hund' },
  { up: 'J', low: 'j', ipa: '[ʒ]',  ph: 'sch (weich)',  tip: 'Wie das J in „Journal“.',                              ex: 'jurnal',   exDe: 'Zeitschrift' },
  { up: 'K', low: 'k', ipa: '[c]',  ph: 'k',            tip: 'Wie im Deutschen, vor hellen Vokalen weicher.',        ex: 'kitab',    exDe: 'Buch' },
  { up: 'Q', low: 'q', ipa: '[g]',  ph: 'g',            tip: 'Achtung: wird wie deutsches G gesprochen, NICHT wie „ku“.', ex: 'qapı', exDe: 'Tür' },
  { up: 'L', low: 'l', ipa: '[l]',  ph: 'l',            tip: 'Wie im Deutschen.',                                    ex: 'limon',    exDe: 'Zitrone' },
  { up: 'M', low: 'm', ipa: '[m]',  ph: 'm',            tip: 'Wie im Deutschen.',                                    ex: 'ana',      exDe: 'Mutter' },
  { up: 'N', low: 'n', ipa: '[n]',  ph: 'n',            tip: 'Wie im Deutschen.',                                    ex: 'nənə',     exDe: 'Großmutter' },
  { up: 'O', low: 'o', ipa: '[o]',  ph: 'o',            tip: 'Wie in „Ofen“.',                                       ex: 'od',       exDe: 'Feuer' },
  { up: 'Ö', low: 'ö', ipa: '[œ]',  ph: 'ö',            tip: 'Wie in „Löffel“.',                                     ex: 'göz',      exDe: 'Auge' },
  { up: 'P', low: 'p', ipa: '[p]',  ph: 'p',            tip: 'Wie im Deutschen.',                                    ex: 'pul',      exDe: 'Geld' },
  { up: 'R', low: 'r', ipa: '[ɾ]',  ph: 'r (gerollt)',  tip: 'Mit der Zungenspitze gerollt, nicht im Rachen.',       ex: 'rəng',     exDe: 'Farbe' },
  { up: 'S', low: 's', ipa: '[s]',  ph: 'ß',            tip: 'Immer stimmlos wie in „Fuß“.',                         ex: 'su',       exDe: 'Wasser' },
  { up: 'Ş', low: 'ş', ipa: '[ʃ]',  ph: 'sch',          tip: 'Wie in „Schule“.',                                     ex: 'şəhər',    exDe: 'Stadt' },
  { up: 'T', low: 't', ipa: '[t]',  ph: 't',            tip: 'Wie im Deutschen.',                                    ex: 'tələbə',   exDe: 'Student' },
  { up: 'U', low: 'u', ipa: '[u]',  ph: 'u',            tip: 'Wie in „Mut“.',                                        ex: 'uşaq',     exDe: 'Kind' },
  { up: 'Ü', low: 'ü', ipa: '[y]',  ph: 'ü',            tip: 'Wie in „müde“.',                                       ex: 'üz',       exDe: 'Gesicht' },
  { up: 'V', low: 'v', ipa: '[v]',  ph: 'w',            tip: 'Wie das W in „Wasser“ – nicht wie deutsches V/F.',     ex: 'vaxt',     exDe: 'Zeit' },
  { up: 'Y', low: 'y', ipa: '[j]',  ph: 'j',            tip: 'Wie das J in „Jahr“.',                                 ex: 'yol',      exDe: 'Weg' },
  { up: 'Z', low: 'z', ipa: '[z]',  ph: 's (stimmhaft)',tip: 'Wie das s in „Rose“.',                                 ex: 'zəng',     exDe: 'Anruf, Klingel' }
];

/** Buchstaben, die deutschen Lernenden erfahrungsgemäß die meisten Probleme machen. */
export const TRICKY = ['ə', 'q', 'x', 'ı', 'c', 'g', 'ğ', 'v'];
