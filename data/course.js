/**
 * Der Kurs: Einheiten → Lektionen.
 * Eine Lektion verweist nur auf Vokabel-IDs; die Übungen werden daraus
 * automatisch erzeugt (siehe js/lesson-engine.js).
 *
 *  kind: 'vocab'   – Wortschatzlektion mit gemischten Übungen
 *        'alphabet'– Buchstaben-Training
 *        'grammar' – Grammatikkapitel + Anwendungsübungen
 *        'dialog'  – Dialog hören und verstehen
 *        'review'  – Wiederholung aller Wörter der Einheit
 */
export const UNITS = [
  {
    id: 'u1', title: 'Erste Worte', icon: '👋', hue: 168,
    desc: 'Begrüßen, danken, verabschieden – und das Alphabet.',
    lessons: [
      { id: 'u1l1', kind: 'alphabet', title: 'Das Alphabet, Teil 1', letters: ['a','b','c','ç','d','e','ə','f','g','ğ','h','x'] },
      { id: 'u1l2', kind: 'alphabet', title: 'Das Alphabet, Teil 2', letters: ['ı','i','j','k','q','l','m','n','o','ö','p','r'] },
      { id: 'u1l3', kind: 'alphabet', title: 'Das Alphabet, Teil 3', letters: ['s','ş','t','u','ü','v','y','z'] },
      { id: 'u1l4', kind: 'vocab', title: 'Hallo sagen', items: ['g01','g02','g03','g04','g05','g19'] },
      { id: 'u1l5', kind: 'vocab', title: 'Wie geht es dir?', items: ['g06','g07','g08','g09','g10','e07','e08'] },
      { id: 'u1l6', kind: 'vocab', title: 'Danke & bitte', items: ['g11','g12','g13','g14','g15','g16'] },
      { id: 'u1l7', kind: 'vocab', title: 'Entschuldigung & Abschied', items: ['g17','g18','g20','g21','g22','g23'] },
      { id: 'u1l8', kind: 'grammar', title: 'Grammatik: kein der/die/das', grammar: 'gr01', items: ['b12','j09','j10','j11'] },
      { id: 'u1l9', kind: 'dialog', title: 'Dialog: An der Rezeption', dialog: 'dlg1' },
      { id: 'u1l10', kind: 'review', title: 'Wiederholung Einheit 1' }
    ]
  },
  {
    id: 'u2', title: 'Wer bist du?', icon: '🙋', hue: 205,
    desc: 'Name, Herkunft, Alter – und die Personalendungen.',
    lessons: [
      { id: 'u2l1', kind: 'vocab', title: 'Name & Vorstellung', items: ['i01','i02','i03','i07'] },
      { id: 'u2l2', kind: 'grammar', title: 'Grammatik: ich bin, du bist', grammar: 'gr03', items: ['i06','j04','j02','j03'] },
      { id: 'u2l3', kind: 'vocab', title: 'Woher kommst du?', items: ['i04','i05','t17','i06'] },
      { id: 'u2l4', kind: 'grammar', title: 'Grammatik: Vokalharmonie', grammar: 'gr02', items: ['j09','j11','f12','b15'] },
      { id: 'u2l5', kind: 'vocab', title: 'Wenn du nichts verstehst', items: ['i10','i11','i12','i13','i14','i15','i16','i17'] },
      { id: 'u2l6', kind: 'vocab', title: 'Beruf & Studium', items: ['j01','j02','j03','j04','j05','j06','j07','j08','j12'] },
      { id: 'u2l7', kind: 'dialog', title: 'Dialog: Kennenlernen', dialog: 'dlg2' },
      { id: 'u2l8', kind: 'review', title: 'Wiederholung Einheit 2' }
    ]
  },
  {
    id: 'u3', title: 'Zahlen & Familie', icon: '👨‍👩‍👧', hue: 28,
    desc: 'Zählen, Alter angeben, über Familie sprechen.',
    lessons: [
      { id: 'u3l1', kind: 'vocab', title: 'Zahlen 0–10', items: ['n00','n01','n02','n03','n04','n05','n06','n07','n08','n09','n10'] },
      { id: 'u3l2', kind: 'vocab', title: 'Zahlen 11–1000', items: ['n11','n12','n13','n14','n15','n16','n17','n18','n19','n20','n21','n22'] },
      { id: 'u3l3', kind: 'vocab', title: 'Wie alt bist du?', items: ['i08','i09','z08'] },
      { id: 'u3l4', kind: 'vocab', title: 'Die Familie', items: ['f01','f02','f03','f04','f05','f06','f07','f08','f09'] },
      { id: 'u3l5', kind: 'vocab', title: 'Partner, Kinder, Freunde', items: ['f10','f11','f12','f13','f14','f17','f18','f19'] },
      { id: 'u3l6', kind: 'grammar', title: 'Grammatik: mein, dein, sein', grammar: 'gr05', items: ['f15','f16','i01'] },
      { id: 'u3l7', kind: 'grammar', title: 'Grammatik: haben & es gibt', grammar: 'gr10', items: ['b04','b03','f15'] },
      { id: 'u3l8', kind: 'review', title: 'Wiederholung Einheit 3' }
    ]
  },
  {
    id: 'u4', title: 'Essen & Einkaufen', icon: '🍽️', hue: 350,
    desc: 'Im Restaurant bestellen, auf dem Basar handeln.',
    lessons: [
      { id: 'u4l1', kind: 'vocab', title: 'Getränke & Grundnahrung', items: ['d01','d02','d03','d04','d09','d15','d14'] },
      { id: 'u4l2', kind: 'vocab', title: 'Auf dem Teller', items: ['d05','d06','d07','d08','d10','d11','d12','d13'] },
      { id: 'u4l3', kind: 'vocab', title: 'Im Restaurant bestellen', items: ['d16','d17','d18','d19','d20','d21','d22','d23'] },
      { id: 'u4l4', kind: 'grammar', title: 'Grammatik: Satzbau & Gegenwart', grammar: 'gr07', items: ['d02','d01','e12','e04'] },
      { id: 'u4l5', kind: 'vocab', title: 'Preise & Bezahlen', items: ['s01','s02','s03','s04','s05','s09','s10','s11'] },
      { id: 'u4l6', kind: 'vocab', title: 'Im Geschäft', items: ['s06','s07','s08','s12','b13','b14','b15','b16'] },
      { id: 'u4l7', kind: 'dialog', title: 'Dialog: Im Teehaus', dialog: 'dlg3' },
      { id: 'u4l8', kind: 'review', title: 'Wiederholung Einheit 4' }
    ]
  },
  {
    id: 'u5', title: 'Unterwegs', icon: '🧭', hue: 265,
    desc: 'Nach dem Weg fragen, Verkehrsmittel, Notfälle.',
    lessons: [
      { id: 'u5l1', kind: 'vocab', title: 'Richtungen', items: ['t01','t02','t03','t04','t05','b07'] },
      { id: 'u5l2', kind: 'vocab', title: 'Verkehrsmittel', items: ['t06','t07','t08','t09','t10','t11','j13'] },
      { id: 'u5l3', kind: 'grammar', title: 'Grammatik: wohin, wo, woher', grammar: 'gr06', items: ['t12','t13','i05'] },
      { id: 'u5l4', kind: 'vocab', title: 'Nach dem Weg fragen', items: ['t12','t13','t14','t15','t16','b20'] },
      { id: 'u5l5', kind: 'grammar', title: 'Grammatik: Fragen stellen', grammar: 'gr09', items: ['b05','b06','b08','b09','b10','b11'] },
      { id: 'u5l6', kind: 'dialog', title: 'Dialog: Nach dem Weg fragen', dialog: 'dlg4' },
      { id: 'u5l7', kind: 'review', title: 'Wiederholung Einheit 5' }
    ]
  },
  {
    id: 'u6', title: 'Alltag & Small Talk', icon: '💬', hue: 120,
    desc: 'Gefühle, Wetter, Zeit – und die Vergangenheit.',
    lessons: [
      { id: 'u6l1', kind: 'vocab', title: 'Wie fühlst du dich?', items: ['e01','e02','e03','e04','e05','e06','e09','e11','e12'] },
      { id: 'u6l2', kind: 'vocab', title: 'Zeitangaben', items: ['z01','z02','z03','z04','z05','z06','z07','z09'] },
      { id: 'u6l3', kind: 'vocab', title: 'Wetter & Wochentage', items: ['z10','z11','z12','z13','z14','z15','z16','z17'] },
      { id: 'u6l4', kind: 'grammar', title: 'Grammatik: Vergangenheit', grammar: 'gr08', items: ['z03','z01','t17'] },
      { id: 'u6l5', kind: 'vocab', title: 'Kleine Wörter, große Wirkung', items: ['b13','b14','b17','b18','b19','b01','b02'] },
      { id: 'u6l6', kind: 'grammar', title: 'Grammatik: höflich sprechen', grammar: 'gr11', items: ['g12','g16','g17','i03'] },
      { id: 'u6l7', kind: 'vocab', title: 'Persönliches sagen', items: ['e10','e13','e14','f18'] },
      { id: 'u6l8', kind: 'review', title: 'Wiederholung Einheit 6' }
    ]
  }
];

export const LESSONS = UNITS.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id, unitTitle: u.title, hue: u.hue })));
export const LESSON_BY_ID = Object.fromEntries(LESSONS.map(l => [l.id, l]));
export const UNIT_BY_ID = Object.fromEntries(UNITS.map(u => [u.id, u]));

/** Alle Vokabel-IDs einer Einheit (für die Wiederholungslektion). */
export function unitItems(unitId) {
  const u = UNIT_BY_ID[unitId];
  if (!u) return [];
  return [...new Set(u.lessons.flatMap(l => l.items || []))];
}
