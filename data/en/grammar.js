/**
 * Grammatik & Stil für Business English (gleiches Blockformat wie data/grammar.js).
 * Beispielsätze stehen unter `en`.
 */
export const GRAMMAR = [
  {
    id: 'eg1',
    title: 'Typische Fehler von Deutschen',
    subtitle: 'Die Klassiker, die sofort auffallen',
    minutes: 6,
    blocks: [
      { t: 'p', text: 'Auf B2/C1-Niveau fallen nicht mehr fehlende Wörter auf, sondern kleine, typisch deutsche Muster. Diese sechs zu vermeiden, bringt mehr als hundert neue Vokabeln.' },
      { t: 'rule', title: 'since / for + Present Perfect', text: 'Etwas, das bis heute andauert, steht im **Present Perfect**, nicht im Präsens: ~~I work here since 2019~~ → **I have worked here since 2019.** Bei Zeitpunkten **since**, bei Zeitspannen **for**.' },
      { t: 'ex', items: [
        { en: "I've been with the company for five years.", de: 'Ich bin seit fünf Jahren in der Firma.' },
        { en: "We've known each other since university.", de: 'Wir kennen uns seit der Uni.' }
      ]},
      { t: 'rule', title: 'information, advice, feedback', text: 'Diese Wörter sind **unzählbar**: kein Plural, kein „an“. ~~informations~~, ~~an advice~~ → **some information**, **a piece of advice**, **some feedback**.' },
      { t: 'rule', title: 'discuss, explain, look forward to', text: '~~discuss about~~ → **discuss** the plan · ~~explain me~~ → **explain to me** · ~~look forward to hear~~ → **look forward to hearing**.' },
      { t: 'ex', items: [
        { en: "Let's discuss the budget tomorrow.", de: 'Lass uns morgen über das Budget sprechen.' },
        { en: 'Could you explain to me how it works?', de: 'Könntest du mir erklären, wie es funktioniert?' }
      ]},
      { t: 'rule', title: 'make oder do?', text: '**make** = etwas erschaffen/entscheiden: make a decision, make a mistake, make an offer. **do** = Tätigkeit/Arbeit: do business, do research, do a good job.' },
      { t: 'rule', title: 'until oder by?', text: '**until** = die ganze Zeit bis dahin: I’m in the office until five. **by** = spätestens bis: Please send it **by** Friday. Deutsch sagt beides mit „bis“.' },
      { t: 'ex', items: [
        { en: 'Please send me the report by Friday.', de: 'Bitte schick mir den Bericht bis Freitag.' },
        { en: "I'll be in meetings until three.", de: 'Ich bin bis drei in Besprechungen.' }
      ]}
    ]
  },
  {
    id: 'eg2',
    title: 'Diplomatisch formulieren',
    subtitle: 'Warum Deutsche auf Englisch oft zu direkt wirken',
    minutes: 6,
    blocks: [
      { t: 'p', text: 'Im Deutschen gilt Direktheit als ehrlich und effizient. Im Englischen – besonders im britischen – wirkt derselbe Satz schnell unhöflich. Die Lösung sind kleine **Weichmacher**, die den Inhalt nicht ändern, nur den Ton.' },
      { t: 'table', head: ['Zu direkt', 'Diplomatisch'], rows: [
        ['That is wrong.', "I'm not sure that's quite right."],
        ['I disagree.', "I'd see it slightly differently."],
        ['We need a decision now.', 'It would be great if we could decide today.'],
        ['Send me the report.', 'Could you send me the report, please?'],
        ['Your offer is too expensive.', "Your offer is a bit outside our budget."]
      ]},
      { t: 'rule', title: 'Vier Werkzeuge', text: '**1.** Modalverben: could, might, would · **2.** Einleitung: I’m afraid …, To be honest … · **3.** Untertreibung: not entirely, a bit, slightly · **4.** Frage statt Aussage: Wouldn’t it be better to …?' },
      { t: 'ex', items: [
        { en: "I'm afraid we won't be able to meet the deadline.", de: 'Wir werden die Frist leider nicht einhalten können.' },
        { en: 'Would it be possible to move the meeting to Thursday?', de: 'Wäre es möglich, das Meeting auf Donnerstag zu verschieben?' },
        { en: "Wouldn't it be better to wait for the final figures?", de: 'Wäre es nicht besser, auf die endgültigen Zahlen zu warten?' }
      ]},
      { t: 'rule', title: 'Die Vergangenheit macht höflich', text: '**I was wondering if** you could help me. · **I wanted to ask** whether … – das klingt weicher als die Gegenwart, obwohl es um jetzt geht.' },
      { t: 'p', text: 'Achtung beim Hören: „That’s an **interesting** idea“ oder „I’ll **bear it in mind**“ können auch höfliche Ablehnung sein. Achte auf Tonfall und Zusammenhang.' }
    ]
  },
  {
    id: 'eg3',
    title: 'Fluency: Zeit gewinnen',
    subtitle: 'Flüssig wirken, auch wenn das Wort fehlt',
    minutes: 5,
    blocks: [
      { t: 'p', text: 'Flüssig sprechen heißt nicht, nie zu stocken. Muttersprachler suchen ständig nach Wörtern – sie füllen die Pause nur mit **Formeln** statt mit Schweigen oder „ähm“. Diese Formeln lernst du am besten als ganze Blöcke.' },
      { t: 'rule', title: 'Zeit gewinnen', text: 'Let me think about that for a second. · That’s a good question. · How can I put this? · What’s the word I’m looking for?' },
      { t: 'rule', title: 'Umformulieren', text: 'What I mean is … · In other words … · Let me rephrase that. · To put it another way …' },
      { t: 'rule', title: 'Einleiten & gliedern', text: 'To be honest … · The thing is … · First of all … · On the other hand … · Having said that …' },
      { t: 'ex', items: [
        { en: "That's a good question. Let me think about that for a second.", de: 'Gute Frage. Lassen Sie mich kurz nachdenken.' },
        { en: "The thing is, we don't have enough data yet.", de: 'Die Sache ist: Wir haben noch nicht genug Daten.' },
        { en: "What I mean is that we need more time, not more people.", de: 'Ich meine: Wir brauchen mehr Zeit, nicht mehr Leute.' }
      ]},
      { t: 'rule', title: 'Übungstipp', text: 'Nutze den Tab **Sprechen**: Beim Satz-Sprint hast du nur wenige Sekunden – genau dieser Druck trainiert, nicht erst auf Deutsch zu denken.' }
    ]
  },
  {
    id: 'eg4',
    title: 'Förmlich, neutral, locker',
    subtitle: 'Den richtigen Ton in E-Mails treffen',
    minutes: 5,
    blocks: [
      { t: 'p', text: 'Englische Business-E-Mails sind meist **neutraler und kürzer** als deutsche. Sehr förmliche Sätze wirken schnell altmodisch; zu lockere unprofessionell. Die mittlere Spalte passt fast immer.' },
      { t: 'table', head: ['Förmlich', 'Neutral', 'Locker'], rows: [
        ['Dear Mr Smith,', 'Dear John, / Hello John,', 'Hi John,'],
        ['I am writing to inform you …', "I'm writing to let you know …", 'Just a quick note …'],
        ['Please find attached …', "I've attached …", "Here's the …"],
        ['I would be grateful if you could …', 'Could you please …?', 'Can you …?'],
        ['I look forward to hearing from you.', 'Looking forward to hearing from you.', 'Speak soon.'],
        ['Yours sincerely,', 'Kind regards,', 'Best, / Cheers,']
      ]},
      { t: 'rule', title: 'Kurzformen', text: 'In neutralen E-Mails sind **I’m, we’ve, don’t** völlig normal. In sehr förmlichen Schreiben (Verträge, Beschwerden) lieber ausschreiben.' },
      { t: 'ex', items: [
        { en: "I've attached the updated proposal. Could you please confirm by Friday?", de: 'Anbei das aktualisierte Angebot. Könnten Sie bitte bis Freitag bestätigen?' },
        { en: 'I would be grateful if you could send us the invoice.', de: 'Ich wäre Ihnen dankbar, wenn Sie uns die Rechnung schicken könnten.' }
      ]},
      { t: 'rule', title: 'Kein „Dear Sirs“', text: 'Unbekannte Empfänger: **Dear Sir or Madam** (sehr förmlich) oder besser gleich den Namen herausfinden. Nach der Anrede folgt ein Komma, danach geht es mit Großbuchstaben weiter.' }
    ]
  },
  {
    id: 'eg5',
    title: 'Präsentationen strukturieren',
    subtitle: 'Signposting: dem Publikum den Weg zeigen',
    minutes: 5,
    blocks: [
      { t: 'p', text: 'Englische Präsentationen sagen ständig, **wo** man gerade ist. Das wirkt auf Deutsche fast übertrieben – für das Publikum ist es aber eine große Hilfe. Man nennt diese Sätze **Signposting**.' },
      { t: 'table', head: ['Zweck', 'Formulierung'], rows: [
        ['Einstieg', "Today I'd like to walk you through …"],
        ['Überblick', "I've divided my talk into three parts."],
        ['Übergang', 'This brings me to my next point.'],
        ['Zurückverweisen', 'As I mentioned earlier, …'],
        ['Hervorheben', "What's really important here is …"],
        ['Abschluss', 'To sum up, … / The key takeaway is …'],
        ['Fragen', "I'd be happy to take any questions."]
      ]},
      { t: 'rule', title: 'Zahlen beschreiben', text: 'Steigen: **rise, increase, go up** · Fallen: **fall, decrease, drop** · Stark: **sharply, significantly** · Leicht: **slightly** · Gleichbleiben: **remain stable, level off**.' },
      { t: 'ex', items: [
        { en: 'Sales rose sharply in the first quarter.', de: 'Der Absatz stieg im ersten Quartal stark an.' },
        { en: 'Costs remained stable throughout the year.', de: 'Die Kosten blieben das ganze Jahr über stabil.' },
        { en: "As I mentioned earlier, the main risk is the timeline.", de: 'Wie bereits erwähnt, ist der Zeitplan das größte Risiko.' }
      ]}
    ]
  },
  {
    id: 'eg6',
    title: 'Bedingungen: if, unless, provided that',
    subtitle: 'Die Grammatik des Verhandelns',
    minutes: 5,
    blocks: [
      { t: 'p', text: 'Verhandeln heißt, Bedingungen zu formulieren. Der zweite Konditional (**if + past, would**) klingt dabei weicher und offener als der erste – ideal für Vorschläge.' },
      { t: 'table', head: ['Form', 'Wirkung', 'Beispiel'], rows: [
        ['if + Präsens, will', 'fest, verbindlich', 'If you order today, we will deliver on Monday.'],
        ['if + Vergangenheit, would', 'vorsichtig, verhandelbar', 'If you ordered more, we would lower the price.'],
        ['unless', 'wenn nicht', 'We can’t agree unless the price changes.'],
        ['provided that / as long as', 'nur unter dieser Bedingung', 'We accept, provided that delivery is free.']
      ]},
      { t: 'rule', title: 'Kein „would“ im if-Teil', text: '~~If you would order more, …~~ → **If you ordered more, we would …** Das „würde“ steht nur im Hauptsatz.' },
      { t: 'ex', items: [
        { en: 'If you could increase the volume, we would lower the price.', de: 'Wenn Sie die Menge erhöhen könnten, würden wir den Preis senken.' },
        { en: "We can't sign unless the delivery date is guaranteed.", de: 'Wir können nicht unterschreiben, solange der Liefertermin nicht garantiert ist.' },
        { en: "We'll accept the offer as long as the payment terms stay the same.", de: 'Wir nehmen das Angebot an, solange die Zahlungsbedingungen gleich bleiben.' }
      ]}
    ]
  },
  {
    id: 'eg7',
    title: 'Falsche Freunde',
    subtitle: 'Wörter, die deutsch klingen und etwas anderes meinen',
    minutes: 4,
    blocks: [
      { t: 'p', text: 'Diese Wörter verraten selbst sehr gute Sprecher als Deutsche. Das Tückische: Der Satz klingt richtig – bedeutet aber etwas anderes.' },
      { t: 'table', head: ['Englisch', 'heißt', 'Deutsch gemeint? Dann:'], rows: [
        ['eventually', 'schließlich', 'eventuell → possibly'],
        ['actually', 'eigentlich, tatsächlich', 'aktuell → current(ly)'],
        ['to become', 'werden', 'bekommen → to get, to receive'],
        ['sensible', 'vernünftig', 'sensibel → sensitive'],
        ['consequent', 'daraus folgend', 'konsequent → consistent'],
        ['to control', 'steuern', 'kontrollieren → to check'],
        ['handy', 'praktisch', 'Handy → mobile (phone)'],
        ['concern', 'Anliegen, Sorge', 'Konzern → group, corporation'],
        ['provision', 'Bereitstellung', 'Provision → commission'],
        ['chef', 'Koch', 'Chef → boss, manager']
      ]},
      { t: 'ex', items: [
        { en: 'We might possibly need more time.', de: 'Wir brauchen eventuell mehr Zeit.' },
        { en: 'I received your offer yesterday.', de: 'Ich habe Ihr Angebot gestern bekommen.' },
        { en: 'Our current figures look promising.', de: 'Unsere aktuellen Zahlen sehen vielversprechend aus.' }
      ]}
    ]
  }
];

export const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR.map(g => [g.id, g]));
