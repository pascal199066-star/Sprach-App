/**
 * Kurze Alltagsdialoge – jede Zeile einzeln anhörbar.
 * voices: welche Aufnahme-Stimme eine Rolle spricht ('f' = Banu, 'm' = Babək).
 * „Du“ spricht immer mit der Stimme, die in den Einstellungen gewählt ist.
 */
export const DIALOGUES = [
  {
    id: 'dlg1', title: 'An der Rezeption', icon: 'bed',
    intro: 'Du kommst im Hotel in Baku an.',
    voices: { Rezeption: 'f' },
    lines: [
      { who: 'Rezeption', az: 'Salam, xoş gəlmisiniz!', de: 'Hallo, herzlich willkommen!' },
      { who: 'Du',        az: 'Salam. Sağ olun.',        de: 'Hallo. Danke.' },
      { who: 'Rezeption', az: 'Adınız nədir?',           de: 'Wie heißen Sie?' },
      { who: 'Du',        az: 'Mənim adım Pascaldır.',   de: 'Mein Name ist Pascal.' },
      { who: 'Rezeption', az: 'Haradansınız?',           de: 'Woher kommen Sie?' },
      { who: 'Du',        az: 'Mən Almaniyadanam.',      de: 'Ich komme aus Deutschland.' },
      { who: 'Rezeption', az: 'Çox gözəl. Otağınız hazırdır.', de: 'Sehr schön. Ihr Zimmer ist fertig.' },
      { who: 'Du',        az: 'Təşəkkür edirəm!',        de: 'Vielen Dank!' }
    ]
  },
  {
    id: 'dlg2', title: 'Kennenlernen', icon: 'users',
    intro: 'Du triffst Leyla auf einer Feier.',
    voices: { Leyla: 'f' },
    lines: [
      { who: 'Leyla', az: 'Salam! Necəsən?',              de: 'Hallo! Wie geht es dir?' },
      { who: 'Du',    az: 'Yaxşıyam, sağ ol. Bəs sən?',   de: 'Mir geht es gut, danke. Und dir?' },
      { who: 'Leyla', az: 'Mən də yaxşıyam. Adın nədir?', de: 'Mir auch. Wie heißt du?' },
      { who: 'Du',    az: 'Mənim adım Pascaldır. Bəs sənin?', de: 'Ich heiße Pascal. Und du?' },
      { who: 'Leyla', az: 'Leyla. Tanış olduğuma şadam.', de: 'Leyla. Freut mich, dich kennenzulernen.' },
      { who: 'Du',    az: 'Mən də şadam. Nə işlə məşğulsan?', de: 'Mich auch. Was machst du beruflich?' },
      { who: 'Leyla', az: 'Mən müəlliməm. Bəs sən?',      de: 'Ich bin Lehrerin. Und du?' },
      { who: 'Du',    az: 'Mən mühəndisəm.',              de: 'Ich bin Ingenieur.' }
    ]
  },
  {
    id: 'dlg3', title: 'Im Teehaus', icon: 'cup',
    intro: 'Bestellen im „çayxana“, dem traditionellen Teehaus.',
    voices: { Kellner: 'm' },
    lines: [
      { who: 'Kellner', az: 'Buyurun, nə istəyirsiniz?',      de: 'Bitte sehr, was möchten Sie?' },
      { who: 'Du',      az: 'Bir çay, zəhmət olmasa.',        de: 'Einen Tee, bitte.' },
      { who: 'Kellner', az: 'Şirniyyat da istəyirsiniz?',     de: 'Möchten Sie auch Süßes dazu?' },
      { who: 'Du',      az: 'Bəli, bir az.',                  de: 'Ja, ein bisschen.' },
      { who: 'Kellner', az: 'Nuş olsun!',                     de: 'Guten Appetit!' },
      { who: 'Du',      az: 'Çox dadlıdır. Hesab, zəhmət olmasa.', de: 'Sehr lecker. Die Rechnung, bitte.' },
      { who: 'Kellner', az: 'Beş manat.',                     de: 'Fünf Manat.' },
      { who: 'Du',      az: 'Buyurun. Sağ olun!',             de: 'Bitte sehr. Danke!' }
    ]
  },
  {
    id: 'dlg4', title: 'Nach dem Weg fragen', icon: 'pin',
    intro: 'Du suchst die Metro-Station.',
    voices: { Passant: 'm' },
    lines: [
      { who: 'Du',      az: 'Bağışlayın, metro haradadır?',   de: 'Entschuldigung, wo ist die Metro?' },
      { who: 'Passant', az: 'Düz gedin, sonra sağa dönün.',   de: 'Gehen Sie geradeaus, dann biegen Sie rechts ab.' },
      { who: 'Du',      az: 'Uzaqdır?',                       de: 'Ist es weit?' },
      { who: 'Passant', az: 'Yox, çox yaxındır. Beş dəqiqə.', de: 'Nein, ganz nah. Fünf Minuten.' },
      { who: 'Du',      az: 'Çox sağ olun!',                  de: 'Vielen Dank!' },
      { who: 'Passant', az: 'Dəyməz. Yaxşı yol!',             de: 'Keine Ursache. Gute Reise!' }
    ]
  },
  {
    id: 'dlg5', title: 'Auf dem Basar', icon: 'bag',
    intro: 'Granatäpfel kaufen – und ein bisschen handeln.',
    voices: { Händler: 'm' },
    lines: [
      { who: 'Händler', az: 'Buyurun, nə lazımdır?',            de: 'Bitte sehr, was brauchen Sie?' },
      { who: 'Du',      az: 'Narın kilosu neçəyədir?',          de: 'Was kostet ein Kilo Granatäpfel?' },
      { who: 'Händler', az: 'Kilosu üç manatdır.',              de: 'Das Kilo kostet drei Manat.' },
      { who: 'Du',      az: 'Çox bahadır. İki manata olar?',    de: 'Das ist zu teuer. Geht es für zwei Manat?' },
      { who: 'Händler', az: 'Yaxşı, sizin üçün iki manat yarım.', de: 'Gut, für Sie zweieinhalb Manat.' },
      { who: 'Du',      az: 'Razıyam. İki kilo verin, zəhmət olmasa.', de: 'Einverstanden. Zwei Kilo, bitte.' },
      { who: 'Händler', az: 'Buyurun. Beş manat.',              de: 'Bitte sehr. Fünf Manat.' },
      { who: 'Du',      az: 'Sağ olun!',                        de: 'Danke!' }
    ]
  },
  {
    id: 'dlg6', title: 'Im Taxi', icon: 'car',
    intro: 'Mit dem Taxi zum Flughafen.',
    voices: { Fahrer: 'm' },
    lines: [
      { who: 'Du',     az: 'Salam. Hava limanına, zəhmət olmasa.', de: 'Hallo. Zum Flughafen, bitte.' },
      { who: 'Fahrer', az: 'Oldu. Hansı terminal?',             de: 'In Ordnung. Welches Terminal?' },
      { who: 'Du',     az: 'Birinci terminal.',                 de: 'Terminal eins.' },
      { who: 'Fahrer', az: 'Tələsirsiniz?',                     de: 'Haben Sie es eilig?' },
      { who: 'Du',     az: 'Bəli, bir az tələsirəm.',           de: 'Ja, ich habe es ein bisschen eilig.' },
      { who: 'Fahrer', az: 'Narahat olmayın, iyirmi dəqiqəyə çatarıq.', de: 'Keine Sorge, in zwanzig Minuten sind wir da.' },
      { who: 'Du',     az: 'Burada saxlayın, zəhmət olmasa. Nə qədər olur?', de: 'Halten Sie bitte hier. Wie viel macht das?' },
      { who: 'Fahrer', az: 'On beş manat.',                     de: 'Fünfzehn Manat.' }
    ]
  }
];

export const DIALOG_BY_ID = Object.fromEntries(DIALOGUES.map(d => [d.id, d]));
