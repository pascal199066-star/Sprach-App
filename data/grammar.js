/**
 * Grammatik-Kapitel.
 * Ein Kapitel besteht aus Blöcken:
 *   { t:'p',     text }                      – Absatz (Markdown-light: **fett**, `code`)
 *   { t:'rule',  title, text }               – hervorgehobene Merkregel
 *   { t:'table', head:[], rows:[[]] }        – Tabelle
 *   { t:'ex',    items:[{az, de, ph?}] }     – Beispielsätze mit Audio-Button
 */
export const GRAMMAR = [
  {
    id: 'gr01',
    title: 'Die gute Nachricht zuerst',
    subtitle: 'Was es im Aserbaidschanischen alles NICHT gibt',
    minutes: 3,
    blocks: [
      { t: 'p', text: 'Aserbaidschanisch wirkt auf den ersten Blick fremd – aber es nimmt dir vier Dinge ab, die Deutschlernende weltweit zur Verzweiflung bringen.' },
      { t: 'rule', title: 'Kein Geschlecht', text: 'Es gibt kein der/die/das. **o** heißt gleichzeitig „er“, „sie“ und „es“.' },
      { t: 'rule', title: 'Keine Artikel', text: '„das Haus“ und „ein Haus“ heißen beide einfach **ev**.' },
      { t: 'rule', title: 'Keine unregelmäßigen Verben', text: 'Jedes Verb folgt demselben Baukasten. Wenn du das System einmal hast, kannst du jedes Verb bilden.' },
      { t: 'rule', title: 'Keine Präpositionen', text: 'Statt „in dem Haus“ hängt man eine Endung an: **evdə**. Das Wort bleibt vorne, die Info kommt hinten dran.' },
      { t: 'p', text: 'Der Preis dafür: Aserbaidschanisch ist eine **agglutinierende** Sprache. Man klebt Silbe für Silbe an den Wortstamm. Ein einziges Wort kann ein ganzer deutscher Satz sein.' },
      { t: 'ex', items: [
        { az: 'ev', de: 'Haus' },
        { az: 'evim', de: 'mein Haus' },
        { az: 'evimdə', de: 'in meinem Haus' },
        { az: 'evimdədir', de: 'er/sie/es ist in meinem Haus' }
      ]}
    ]
  },
  {
    id: 'gr02',
    title: 'Vokalharmonie',
    subtitle: 'Die eine Regel, die alles steuert',
    minutes: 6,
    blocks: [
      { t: 'p', text: 'Das ist das Herzstück der Sprache. Jede Endung, die du anhängst, richtet sich nach dem **letzten Vokal** des Wortes. Wer das versteht, muss Endungen nie auswendig lernen.' },
      { t: 'p', text: 'Die neun Vokale zerfallen in zwei Lager:' },
      { t: 'table', head: ['Lager', 'Vokale', 'Klang'], rows: [
        ['hart (hinten)', 'a · ı · o · u', 'dunkel, hinten im Mund'],
        ['weich (vorne)', 'e · ə · i · ö · ü', 'hell, vorne im Mund']
      ]},
      { t: 'rule', title: 'Zweierharmonie (a / ə)', text: 'Endungen mit nur zwei Formen: nach hartem Vokal → **a**, nach weichem Vokal → **ə**. Beispiel Plural: `-lar` / `-lər`.' },
      { t: 'ex', items: [
        { az: 'kitab → kitablar', de: 'Buch → Bücher (letzter Vokal a = hart)' },
        { az: 'ev → evlər', de: 'Haus → Häuser (letzter Vokal e = weich)' },
        { az: 'uşaq → uşaqlar', de: 'Kind → Kinder' },
        { az: 'gül → güllər', de: 'Blume → Blumen' }
      ]},
      { t: 'rule', title: 'Viererharmonie (ı / i / u / ü)', text: 'Endungen mit vier Formen richten sich zusätzlich nach der Lippenrundung:\n**a, ı → ı** · **e, ə, i → i** · **o, u → u** · **ö, ü → ü**' },
      { t: 'ex', items: [
        { az: 'qapı → qapım', de: 'Tür → meine Tür' },
        { az: 'ev → evim', de: 'Haus → mein Haus' },
        { az: 'yol → yolum', de: 'Weg → mein Weg' },
        { az: 'göz → gözüm', de: 'Auge → mein Auge' }
      ]},
      { t: 'p', text: 'Merke dir nicht die Endungen, sondern **schau auf den letzten Vokal** und lass dein Ohr entscheiden. Falsche Harmonie klingt für Muttersprachler wie ein schiefer Ton.' }
    ]
  },
  {
    id: 'gr03',
    title: 'Ich bin, du bist',
    subtitle: 'Personalendungen statt „sein“',
    minutes: 5,
    blocks: [
      { t: 'p', text: 'Es gibt kein eigenständiges Verb „sein“. Stattdessen hängst du eine **Personalendung** direkt an das Wort, das du aussagen willst.' },
      { t: 'table', head: ['Person', 'Pronomen', 'Endung', 'Beispiel: müəllim (Lehrer)'], rows: [
        ['ich',       'mən',  '-am / -əm',       'müəlliməm – ich bin Lehrer'],
        ['du',        'sən',  '-san / -sən',     'müəllimsən – du bist Lehrer'],
        ['er/sie/es', 'o',    '-dır (4-fach)',   'müəllimdir – er/sie ist Lehrer'],
        ['wir',       'biz',  '-ıq (4-fach)',    'müəllimik – wir sind Lehrer'],
        ['ihr/Sie',   'siz',  '-sınız (4-fach)', 'müəllimsiniz – Sie sind Lehrer'],
        ['sie (Pl.)', 'onlar','-dırlar',         'müəllimdirlər – sie sind Lehrer']
      ]},
      { t: 'p', text: 'Das Pronomen kann weggelassen werden – die Endung sagt schon, wer gemeint ist. „Yaxşıyam“ allein heißt bereits „Mir geht es gut“.' },
      { t: 'ex', items: [
        { az: 'Mən almanam.', de: 'Ich bin Deutscher.' },
        { az: 'Sən haradansan?', de: 'Woher kommst du?' },
        { az: 'O, Bakıdandır.', de: 'Er/Sie ist aus Baku.' },
        { az: 'Biz tələbəyik.', de: 'Wir sind Studenten.' },
        { az: 'Siz almansınız?', de: 'Sind Sie Deutscher?' }
      ]},
      { t: 'rule', title: 'Verneinung mit „deyil“', text: 'Für „nicht sein“ nimmst du **deyil** + Personalendung: `Mən müəllim deyiləm.` – Ich bin kein Lehrer.' }
    ]
  },
  {
    id: 'gr04',
    title: 'Der Satzbau',
    subtitle: 'Das Verb kommt ganz zum Schluss',
    minutes: 4,
    blocks: [
      { t: 'p', text: 'Aserbaidschanisch ist eine **SOV-Sprache**: Subjekt – Objekt – Verb. Das Verb steht praktisch immer am Satzende.' },
      { t: 'table', head: ['Deutsch', 'Aserbaidschanisch'], rows: [
        ['Ich **trinke** Tee.', 'Mən çay **içirəm**.'],
        ['Ich **lese** ein Buch.', 'Mən kitab **oxuyuram**.'],
        ['Er **geht** nach Baku.', 'O, Bakıya **gedir**.']
      ]},
      { t: 'rule', title: 'Faustregel', text: 'Bau den Satz wie einen deutschen Nebensatz: „… dass ich Tee **trinke**.“ Genau diese Reihenfolge ist im Aserbaidschanischen der Normalfall.' },
      { t: 'p', text: 'Zeit- und Ortsangaben stehen meist vorne, direkt nach dem Subjekt:' },
      { t: 'ex', items: [
        { az: 'Mən sabah Bakıya gedirəm.', de: 'Ich fahre morgen nach Baku.' },
        { az: 'Biz axşam restoranda yeyirik.', de: 'Wir essen abends im Restaurant.' }
      ]}
    ]
  },
  {
    id: 'gr05',
    title: 'Mein, dein, sein',
    subtitle: 'Besitz als Endung',
    minutes: 5,
    blocks: [
      { t: 'p', text: 'Besitz wird angehängt, nicht vorangestellt. Das Possessivpronomen davor ist optional und dient nur der Betonung.' },
      { t: 'table', head: ['Person', 'Endung (nach Konsonant)', 'Beispiel: ev'], rows: [
        ['mein',       '-ım / -im / -um / -üm', 'evim'],
        ['dein',       '-ın / -in / -un / -ün', 'evin'],
        ['sein/ihr',   '-ı / -i / -u / -ü',     'evi'],
        ['unser',      '-ımız / -imiz / …',     'evimiz'],
        ['euer/Ihr',   '-ınız / -iniz / …',     'eviniz'],
        ['ihr (Pl.)',  '-ları / -ləri',         'evləri']
      ]},
      { t: 'rule', title: 'Nach Vokal ein -s-', text: 'Endet das Wort auf einen Vokal, schiebt sich bei „sein/ihr“ ein **s** dazwischen: `ata` → `atası` (sein Vater).' },
      { t: 'ex', items: [
        { az: 'mənim adım', de: 'mein Name' },
        { az: 'sənin evin', de: 'dein Haus' },
        { az: 'onun anası', de: 'seine/ihre Mutter' },
        { az: 'bizim şəhərimiz', de: 'unsere Stadt' }
      ]}
    ]
  },
  {
    id: 'gr06',
    title: 'Die sechs Fälle',
    subtitle: 'Wohin, wo, woher – alles Endungen',
    minutes: 7,
    blocks: [
      { t: 'p', text: 'Statt Präpositionen hängt Aserbaidschanisch Fallendungen an. Alle folgen der Vokalharmonie.' },
      { t: 'table', head: ['Fall', 'Frage', 'Endung', 'Beispiel: Bakı'], rows: [
        ['Nominativ', 'wer/was?',   '—',                    'Bakı – Baku'],
        ['Genitiv',   'wessen?',    '-ın/-in/-un/-ün',      'Bakının – Bakus'],
        ['Dativ',     'wohin/wem?', '-a / -ə',              'Bakıya – nach Baku'],
        ['Akkusativ', 'wen/was?',   '-ı/-i/-u/-ü',          'Bakını – Baku (Obj.)'],
        ['Lokativ',   'wo?',        '-da / -də',            'Bakıda – in Baku'],
        ['Ablativ',   'woher?',     '-dan / -dən',          'Bakıdan – aus Baku']
      ]},
      { t: 'rule', title: 'Puffer-Konsonant', text: 'Endet das Wort auf einen Vokal, schiebt sich vor Dativ/Akkusativ/Genitiv ein **y** oder **n** ein: `Bakı` + `a` → `Bakıya`.' },
      { t: 'ex', items: [
        { az: 'Mən Bakıda yaşayıram.', de: 'Ich wohne in Baku.' },
        { az: 'Mən Bakıya gedirəm.', de: 'Ich fahre nach Baku.' },
        { az: 'Mən Almaniyadan gəlirəm.', de: 'Ich komme aus Deutschland.' },
        { az: 'Evdə çay var.', de: 'Zu Hause gibt es Tee.' }
      ]},
      { t: 'p', text: 'Lokativ (**-da/-də**) und Ablativ (**-dan/-dən**) sind im Alltag mit Abstand die wichtigsten. Lerne zuerst diese beiden.' }
    ]
  },
  {
    id: 'gr07',
    title: 'Gegenwart',
    subtitle: 'Was gerade passiert',
    minutes: 6,
    blocks: [
      { t: 'p', text: 'Die Gegenwart (Präsens) baust du in drei Schritten: **Verbstamm + -ır/-ir/-ur/-ür + Personalendung**.' },
      { t: 'p', text: 'Den Verbstamm bekommst du, indem du vom Infinitiv die Endung `-maq/-mək` abschneidest: `getmək` (gehen) → `get-`.' },
      { t: 'table', head: ['Person', 'gəlmək (kommen)', 'Deutsch'], rows: [
        ['mən',   'gəlirəm',   'ich komme'],
        ['sən',   'gəlirsən',  'du kommst'],
        ['o',     'gəlir',     'er/sie kommt'],
        ['biz',   'gəlirik',   'wir kommen'],
        ['siz',   'gəlirsiniz','ihr kommt / Sie kommen'],
        ['onlar', 'gəlirlər',  'sie kommen']
      ]},
      { t: 'rule', title: 'Endet der Stamm auf einen Vokal?', text: 'Dann schiebt sich ein **y** ein: `oxumaq` (lesen) → `oxu-` → `oxuyuram` (ich lese).' },
      { t: 'ex', items: [
        { az: 'Mən çay içirəm.', de: 'Ich trinke Tee.' },
        { az: 'Sən nə edirsən?', de: 'Was machst du?' },
        { az: 'Biz almanca danışırıq.', de: 'Wir sprechen Deutsch.' },
        { az: 'O, işləyir.', de: 'Er/Sie arbeitet.' }
      ]},
      { t: 'rule', title: 'Verneinung', text: 'Ein **-m-** vor die Zeitendung: `gəlirəm` → `gəlmirəm` (ich komme nicht), `başa düşürəm` → `başa düşmürəm` (ich verstehe nicht).' }
    ]
  },
  {
    id: 'gr08',
    title: 'Vergangenheit',
    subtitle: 'Was passiert ist',
    minutes: 5,
    blocks: [
      { t: 'p', text: 'Die einfache Vergangenheit ist noch leichter als die Gegenwart: **Stamm + -dı/-di/-du/-dü + Personalendung**.' },
      { t: 'table', head: ['Person', 'getmək (gehen)', 'Deutsch'], rows: [
        ['mən',   'getdim',   'ich ging'],
        ['sən',   'getdin',   'du gingst'],
        ['o',     'getdi',    'er/sie ging'],
        ['biz',   'getdik',   'wir gingen'],
        ['siz',   'getdiniz', 'ihr gingt / Sie gingen'],
        ['onlar', 'getdilər', 'sie gingen']
      ]},
      { t: 'rule', title: 'Immer mit d geschrieben', text: 'Anders als im Türkischen bleibt die Endung immer **-dı/-di/-du/-dü**, auch nach p, t, k, ç, ş, x, f, s, h. Gesprochen klingt sie dort aber wie ein **t**: `içdim` (ich trank) klingt wie „itschtim“.' },
      { t: 'ex', items: [
        { az: 'Mən dünən Bakıda idim.', de: 'Ich war gestern in Baku.' },
        { az: 'Nə dedin?', de: 'Was hast du gesagt?' },
        { az: 'Biz çay içdik.', de: 'Wir haben Tee getrunken.' }
      ]}
    ]
  },
  {
    id: 'gr09',
    title: 'Fragen stellen',
    subtitle: 'Die Partikel -mı und die Fragewörter',
    minutes: 4,
    blocks: [
      { t: 'p', text: 'Ja/Nein-Fragen bildest du mit der angehängten Partikel **-mı / -mi / -mu / -mü** (Viererharmonie). Die Wortstellung ändert sich nicht.' },
      { t: 'ex', items: [
        { az: 'Sən almansan? / Almanmısan?', de: 'Bist du Deutscher?' },
        { az: 'Çay içirsən?', de: 'Trinkst du Tee?' },
        { az: 'Bakıdasınız?', de: 'Sind Sie in Baku?' }
      ]},
      { t: 'p', text: 'Umgangssprachlich lässt man die Partikel oft weg und hebt nur die Stimme – wie im Deutschen bei „Du kommst mit?“.' },
      { t: 'table', head: ['Fragewort', 'Deutsch'], rows: [
        ['nə', 'was'], ['kim', 'wer'], ['harada', 'wo'], ['hara', 'wohin'],
        ['haradan', 'woher'], ['nə vaxt', 'wann'], ['niyə / nə üçün', 'warum'],
        ['necə', 'wie'], ['neçə', 'wie viele'], ['hansı', 'welcher']
      ]},
      { t: 'rule', title: 'Achtung, Verwechslungsgefahr', text: '**necə** = wie · **neçə** = wie viele. Nur das `ç` unterscheidet die beiden.' }
    ]
  },
  {
    id: 'gr10',
    title: 'Haben und es gibt',
    subtitle: 'var und yoxdur',
    minutes: 4,
    blocks: [
      { t: 'p', text: 'Es gibt kein Verb „haben“. Stattdessen sagst du wörtlich „mein X ist vorhanden“: **Possessivform + var**.' },
      { t: 'ex', items: [
        { az: 'Mənim vaxtım var.', de: 'Ich habe Zeit.' },
        { az: 'Sənin uşağın var?', de: 'Hast du Kinder?' },
        { az: 'Onun maşını var.', de: 'Er/Sie hat ein Auto.' },
        { az: 'Mənim pulum yoxdur.', de: 'Ich habe kein Geld.' }
      ]},
      { t: 'rule', title: 'var ↔ yoxdur', text: '**var** = es gibt / vorhanden · **yoxdur** = es gibt nicht. Das ist das komplette System.' },
      { t: 'p', text: 'Genauso funktioniert „es gibt“ für Orte:' },
      { t: 'ex', items: [
        { az: 'Burada restoran var?', de: 'Gibt es hier ein Restaurant?' },
        { az: 'Otaqda internet yoxdur.', de: 'Im Zimmer gibt es kein Internet.' }
      ]}
    ]
  },
  {
    id: 'gr11',
    title: 'Höflich sprechen',
    subtitle: 'Du, Sie und die Kunst des „zəhmət olmasa“',
    minutes: 4,
    blocks: [
      { t: 'p', text: 'Wie im Deutschen gibt es eine vertraute und eine höfliche Anrede: **sən** (du) und **siz** (Sie/ihr). Fremde, Ältere und Vorgesetzte immer mit `siz`.' },
      { t: 'table', head: ['Vertraut (sən)', 'Höflich (siz)', 'Deutsch'], rows: [
        ['Necəsən?', 'Necəsiniz?', 'Wie geht es dir/Ihnen?'],
        ['Sağ ol', 'Sağ olun', 'Danke'],
        ['Bağışla', 'Bağışlayın', 'Entschuldige/Entschuldigen Sie'],
        ['Adın nədir?', 'Adınız nədir?', 'Wie heißt du / heißen Sie?']
      ]},
      { t: 'rule', title: 'Der Universalschlüssel', text: '**zəhmət olmasa** („wenn es keine Mühe macht“) hängst du an fast jede Bitte an. Es macht jeden Satz sofort höflich.' },
      { t: 'p', text: 'Ältere Menschen spricht man respektvoll mit **müəllim** (wörtlich „Lehrer“) nach dem Vornamen an – das ist in Aserbaidschan ein allgemeiner Höflichkeitstitel, nicht nur für Lehrkräfte.' }
    ]
  }
];

export const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR.map(g => [g.id, g]));
