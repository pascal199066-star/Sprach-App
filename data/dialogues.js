/** Kurze Alltagsdialoge – jede Zeile einzeln anhörbar. */
export const DIALOGUES = [
  {
    id: 'dlg1', title: 'An der Rezeption', icon: '🏨',
    intro: 'Du kommst im Hotel in Baku an.',
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
    id: 'dlg2', title: 'Kennenlernen', icon: '🤝',
    intro: 'Du triffst jemanden auf einer Feier.',
    lines: [
      { who: 'Leyla', az: 'Salam! Necəsən?',              de: 'Hallo! Wie geht es dir?' },
      { who: 'Du',    az: 'Yaxşıyam, sağ ol. Sən necəsən?', de: 'Mir geht es gut, danke. Und dir?' },
      { who: 'Leyla', az: 'Mən də yaxşıyam. Adın nədir?', de: 'Mir auch gut. Wie heißt du?' },
      { who: 'Du',    az: 'Mənim adım Pascaldır. Sənin?', de: 'Ich heiße Pascal. Und du?' },
      { who: 'Leyla', az: 'Leyla. Tanış olduğuma şadam.', de: 'Leyla. Freut mich, dich kennenzulernen.' },
      { who: 'Du',    az: 'Mən də şadam. Nə işlə məşğulsan?', de: 'Mich auch. Was machst du beruflich?' },
      { who: 'Leyla', az: 'Mən müəlliməm. Sən?',          de: 'Ich bin Lehrerin. Und du?' },
      { who: 'Du',    az: 'Mən mühəndisəm.',              de: 'Ich bin Ingenieur.' }
    ]
  },
  {
    id: 'dlg3', title: 'Im Teehaus', icon: '🫖',
    intro: 'Bestellen im „çayxana“.',
    lines: [
      { who: 'Kellner', az: 'Buyurun, nə istəyirsiniz?',      de: 'Bitte sehr, was möchten Sie?' },
      { who: 'Du',      az: 'Bir çay, zəhmət olmasa.',        de: 'Einen Tee, bitte.' },
      { who: 'Kellner', az: 'Şirniyyat da istəyirsiniz?',     de: 'Möchten Sie auch Süßigkeiten?' },
      { who: 'Du',      az: 'Bəli, bir az.',                  de: 'Ja, ein bisschen.' },
      { who: 'Kellner', az: 'Nuş olsun!',                     de: 'Guten Appetit!' },
      { who: 'Du',      az: 'Çox dadlıdır. Hesab, zəhmət olmasa.', de: 'Sehr lecker. Die Rechnung, bitte.' },
      { who: 'Kellner', az: 'Beş manat.',                     de: 'Fünf Manat.' },
      { who: 'Du',      az: 'Buyurun. Sağ olun!',             de: 'Bitte sehr. Danke!' }
    ]
  },
  {
    id: 'dlg4', title: 'Nach dem Weg fragen', icon: '🗺️',
    intro: 'Du suchst die Metro-Station.',
    lines: [
      { who: 'Du',      az: 'Bağışlayın, metro haradadır?',   de: 'Entschuldigung, wo ist die Metro?' },
      { who: 'Passant', az: 'Düz gedin, sonra sağa dönün.',   de: 'Gehen Sie geradeaus, dann biegen Sie rechts ab.' },
      { who: 'Du',      az: 'Uzaqdır?',                       de: 'Ist es weit?' },
      { who: 'Passant', az: 'Yox, çox yaxındır. Beş dəqiqə.', de: 'Nein, ganz nah. Fünf Minuten.' },
      { who: 'Du',      az: 'Çox sağ olun!',                  de: 'Vielen Dank!' },
      { who: 'Passant', az: 'Dəyməz. Yaxşı yol!',             de: 'Keine Ursache. Gute Reise!' }
    ]
  }
];

export const DIALOG_BY_ID = Object.fromEntries(DIALOGUES.map(d => [d.id, d]));
