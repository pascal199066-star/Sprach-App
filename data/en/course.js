/**
 * Business-English-Kurs: Einheiten → Lektionen (gleiches Format wie data/course.js).
 */
export const UNITS = [
  {
    id: 'u1', title: 'Meetings & Calls', icon: 'users', hue: 205,
    desc: 'Meetings eröffnen, leiten und mit klaren Aufgaben beenden.',
    lessons: [
      { id: 'u1l1', kind: 'vocab', title: 'Ein Meeting eröffnen', items: ['m01', 'm02', 'm03', 'm15', 'm06', 'm04'] },
      { id: 'u1l2', kind: 'vocab', title: 'Durch das Meeting führen', items: ['m05', 'm11', 'm13', 'm10', 'm09', 'm14'] },
      { id: 'u1l3', kind: 'vocab', title: 'Aufgaben & nächste Schritte', items: ['m07', 'm08', 'm12', 'm16', 'v04', 'v06'] },
      { id: 'u1l4', kind: 'vocab', title: 'Video-Calls', items: ['c01', 'c02', 'c03', 'c04', 'c11', 'c12'] },
      { id: 'u1l5', kind: 'vocab', title: 'Telefonieren & Termine', items: ['c05', 'c06', 'c07', 'c08', 'c09', 'c10'] },
      { id: 'u1l6', kind: 'grammar', title: 'Grammatik: typische Fehler von Deutschen', grammar: 'eg1', items: ['s04', 'e06', 'v12'] },
      { id: 'u1l7', kind: 'dialog', title: 'Dialog: Ein Meeting eröffnen', dialog: 'ed1' },
      { id: 'u1l8', kind: 'review', title: 'Wiederholung Einheit 1' }
    ]
  },
  {
    id: 'u2', title: 'Meinung & Diplomatie', icon: 'scale', hue: 168,
    desc: 'Zustimmen, widersprechen und flüssig bleiben – ohne anzuecken.',
    lessons: [
      { id: 'u2l1', kind: 'vocab', title: 'Zustimmen & einordnen', items: ['o03', 'o04', 'o12', 'o01', 'o10'] },
      { id: 'u2l2', kind: 'vocab', title: 'Diplomatisch widersprechen', items: ['o02', 'o05', 'o06', 'o08', 'o13', 'o14'] },
      { id: 'u2l3', kind: 'vocab', title: 'Vorschläge & Bedenken', items: ['o07', 'o11', 'o15', 'o16', 'o09'] },
      { id: 'u2l4', kind: 'grammar', title: 'Grammatik: diplomatisch formulieren', grammar: 'eg2', items: ['o02', 'o07', 'o08'] },
      { id: 'u2l5', kind: 'vocab', title: 'Flüssig bleiben', items: ['l01', 'l02', 'l03', 'l04', 'l10', 'l11', 'l12'] },
      { id: 'u2l6', kind: 'grammar', title: 'Fluency: Zeit gewinnen', grammar: 'eg3', items: ['l05', 'l06'] },
      { id: 'u2l7', kind: 'dialog', title: 'Dialog: Diplomatisch widersprechen', dialog: 'ed2' },
      { id: 'u2l8', kind: 'review', title: 'Wiederholung Einheit 2' }
    ]
  },
  {
    id: 'u3', title: 'E-Mails & Schriftliches', icon: 'mail', hue: 28,
    desc: 'Klar, höflich und im richtigen Ton schreiben.',
    lessons: [
      { id: 'u3l1', kind: 'vocab', title: 'Einstieg & Bezug', items: ['e01', 'e03', 'e04', 'e08', 'e02'] },
      { id: 'u3l2', kind: 'vocab', title: 'Bitten & Erinnern', items: ['e05', 'e09', 'e12', 'e10', 'e11'] },
      { id: 'u3l3', kind: 'vocab', title: 'Abschluss & Abwesenheit', items: ['e06', 'e07', 'e13', 'e14'] },
      { id: 'u3l4', kind: 'grammar', title: 'Grammatik: förmlich, neutral, locker', grammar: 'eg4', items: ['e02', 'e06', 'e07'] },
      { id: 'u3l5', kind: 'vocab', title: 'Verbindungswörter', items: ['l13', 'l14', 'l07', 'l08', 'l09'] },
      { id: 'u3l6', kind: 'dialog', title: 'Dialog: Video-Call mit Hindernissen', dialog: 'ed3' },
      { id: 'u3l7', kind: 'review', title: 'Wiederholung Einheit 3' }
    ]
  },
  {
    id: 'u4', title: 'Präsentieren', icon: 'chart', hue: 265,
    desc: 'Strukturiert präsentieren, Zahlen erklären, Fragen souverän beantworten.',
    lessons: [
      { id: 'u4l1', kind: 'vocab', title: 'Einstieg & Struktur', items: ['p01', 'p02', 'p03', 'p04', 'p10'] },
      { id: 'u4l2', kind: 'vocab', title: 'Zahlen & Trends', items: ['p05', 'p06', 'p07', 'p14', 'w04', 'w05'] },
      { id: 'u4l3', kind: 'vocab', title: 'Auf den Punkt bringen', items: ['p08', 'p09', 'p12', 'p13', 'p11'] },
      { id: 'u4l4', kind: 'grammar', title: 'Grammatik: Präsentationen strukturieren', grammar: 'eg5', items: ['p03', 'p09', 'p12'] },
      { id: 'u4l5', kind: 'vocab', title: 'Business-Wortschatz 1', items: ['w01', 'w02', 'w03', 'w06', 'w07', 'w08', 'w16'] },
      { id: 'u4l6', kind: 'dialog', title: 'Dialog: Fragen nach der Präsentation', dialog: 'ed4' },
      { id: 'u4l7', kind: 'review', title: 'Wiederholung Einheit 4' }
    ]
  },
  {
    id: 'u5', title: 'Verhandeln', icon: 'target', hue: 350,
    desc: 'Angebote machen, Bedingungen setzen, zu einer Einigung kommen.',
    lessons: [
      { id: 'u5l1', kind: 'vocab', title: 'Positionen ausloten', items: ['n01', 'n02', 'n08', 'n11', 'n12'] },
      { id: 'u5l2', kind: 'vocab', title: 'Kompromisse finden', items: ['n03', 'n05', 'n09', 'n10', 'n07', 'n13'] },
      { id: 'u5l3', kind: 'vocab', title: 'Harte Punkte', items: ['n04', 'n06', 'n14', 'w12', 'w09'] },
      { id: 'u5l4', kind: 'grammar', title: 'Grammatik: if, unless, provided that', grammar: 'eg6', items: ['n03', 'n09'] },
      { id: 'u5l5', kind: 'vocab', title: 'Phrasal Verbs 1', items: ['v01', 'v02', 'v03', 'v05', 'v07', 'v08'] },
      { id: 'u5l6', kind: 'vocab', title: 'Phrasal Verbs 2', items: ['v09', 'v10', 'v11', 'v13', 'v14'] },
      { id: 'u5l7', kind: 'dialog', title: 'Dialog: Preis und Lieferung', dialog: 'ed5' },
      { id: 'u5l8', kind: 'review', title: 'Wiederholung Einheit 5' }
    ]
  },
  {
    id: 'u6', title: 'Networking & Feinschliff', icon: 'sparkle', hue: 120,
    desc: 'Small Talk, Idioms und die falschen Freunde, die jeder Deutsche kennt.',
    lessons: [
      { id: 'u6l1', kind: 'vocab', title: 'Small Talk', items: ['s01', 's02', 's03', 's04', 's09', 's11'] },
      { id: 'u6l2', kind: 'vocab', title: 'Kontakte knüpfen', items: ['s05', 's06', 's07', 's08', 's10', 's12'] },
      { id: 'u6l3', kind: 'vocab', title: 'Idioms 1', items: ['i01', 'i02', 'i03', 'i04', 'i05', 'i06'] },
      { id: 'u6l4', kind: 'vocab', title: 'Idioms 2', items: ['i07', 'i08', 'i09', 'i10', 'i11', 'i12'] },
      { id: 'u6l5', kind: 'grammar', title: 'Falsche Freunde', grammar: 'eg7', items: ['f01', 'f02', 'f04', 'f06'] },
      { id: 'u6l6', kind: 'vocab', title: 'Falsche Freunde 1', items: ['f01', 'f02', 'f03', 'f04', 'f05', 'f06', 'f07'] },
      { id: 'u6l7', kind: 'vocab', title: 'Falsche Freunde 2', items: ['f08', 'f09', 'f10', 'f11', 'f12', 'f13', 'f14'] },
      { id: 'u6l8', kind: 'vocab', title: 'Business-Wortschatz 2', items: ['w10', 'w11', 'w13', 'w14', 'w15', 'w17', 'w18'] },
      { id: 'u6l9', kind: 'dialog', title: 'Dialog: Networking auf einer Konferenz', dialog: 'ed6' },
      { id: 'u6l10', kind: 'review', title: 'Wiederholung Einheit 6' }
    ]
  }
];
