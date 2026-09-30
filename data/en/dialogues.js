/**
 * Business-Dialoge – jede Zeile einzeln anhörbar (Text unter `en`).
 * voices: Aufnahme-Stimme je Rolle ('f' = Sonia, britisch · 'm' = Andrew, amerikanisch).
 * „Du“ spricht mit der Stimme aus den Einstellungen.
 */
export const DIALOGUES = [
  {
    id: 'ed1', title: 'Ein Meeting eröffnen', icon: 'users',
    intro: 'Du leitest das wöchentliche Projektmeeting.',
    voices: { Sarah: 'f' },
    lines: [
      { who: 'Du',    en: "Good morning, everyone. It's ten past, so shall we get started?", de: 'Guten Morgen zusammen. Es ist zehn nach – wollen wir anfangen?' },
      { who: 'Sarah', en: 'Sure. Is Tom joining us today?', de: 'Klar. Ist Tom heute dabei?' },
      { who: 'Du',    en: "I'm afraid he's tied up with a client, so he'll join later.", de: 'Er ist leider bei einem Kunden eingespannt und kommt später dazu.' },
      { who: 'Du',    en: "The purpose of today's meeting is to agree on the launch date.", de: 'Ziel des heutigen Meetings ist es, uns auf den Starttermin zu einigen.' },
      { who: 'Sarah', en: 'Before we start, could we add the budget to the agenda?', de: 'Bevor wir anfangen: Könnten wir das Budget noch auf die Tagesordnung setzen?' },
      { who: 'Du',    en: "Good idea. Let's cover it at the end if we have time.", de: 'Gute Idee. Lass uns das am Ende besprechen, wenn Zeit bleibt.' },
      { who: 'Sarah', en: "Great. And who's taking the minutes?", de: 'Super. Und wer führt Protokoll?' },
      { who: 'Du',    en: "I'll do it. Right, let's go over the first point.", de: 'Mache ich. Gut, gehen wir den ersten Punkt durch.' }
    ]
  },
  {
    id: 'ed2', title: 'Diplomatisch widersprechen', icon: 'scale',
    intro: 'James will das Produkt früher starten als du.',
    voices: { James: 'm' },
    lines: [
      { who: 'James', en: 'I think we should launch the new product in March.', de: 'Ich finde, wir sollten das neue Produkt im März starten.' },
      { who: 'Du',    en: "I see your point, but I'm not entirely convinced the team is ready.", de: 'Ich verstehe deinen Punkt, bin aber nicht ganz überzeugt, dass das Team so weit ist.' },
      { who: 'James', en: 'Why not? The development is almost finished.', de: 'Warum nicht? Die Entwicklung ist fast fertig.' },
      { who: 'Du',    en: "That's true. Having said that, we haven't tested it with real customers yet.", de: 'Das stimmt. Allerdings haben wir es noch nicht mit echten Kunden getestet.' },
      { who: 'James', en: "That's a fair point. What would you suggest?", de: 'Berechtigter Einwand. Was schlägst du vor?' },
      { who: 'Du',    en: "Wouldn't it make more sense to run a small pilot first?", de: 'Wäre es nicht sinnvoller, erst ein kleines Pilotprojekt zu machen?' },
      { who: 'James', en: 'It might delay the launch by a month.', de: 'Das könnte den Start um einen Monat verzögern.' },
      { who: 'Du',    en: 'True, but it would reduce the risk considerably. Could we agree on April?', de: 'Stimmt, aber es würde das Risiko deutlich senken. Können wir uns auf April einigen?' },
      { who: 'James', en: 'OK, let me run this by the board.', de: 'Okay, ich stimme das mit der Geschäftsführung ab.' }
    ]
  },
  {
    id: 'ed3', title: 'Video-Call mit Hindernissen', icon: 'chat',
    intro: 'Technik-Probleme zu Beginn eines Calls.',
    voices: { Priya: 'f' },
    lines: [
      { who: 'Priya', en: 'Hi, can you hear me?', de: 'Hallo, hörst du mich?' },
      { who: 'Du',    en: "Yes, but you're breaking up a little.", de: 'Ja, aber deine Verbindung ist etwas abgehackt.' },
      { who: 'Priya', en: 'Sorry, is this better?', de: 'Entschuldige, ist es jetzt besser?' },
      { who: 'Du',    en: 'Much better, thanks. Can everyone see my screen?', de: 'Viel besser, danke. Können alle meinen Bildschirm sehen?' },
      { who: 'Priya', en: "Not yet. I think you're sharing the wrong window.", de: 'Noch nicht. Ich glaube, du teilst das falsche Fenster.' },
      { who: 'Du',    en: 'Oh, sorry about that. How about now?', de: 'Oh, sorry. Und jetzt?' },
      { who: 'Priya', en: 'Perfect. By the way, I have to drop off at half past.', de: 'Perfekt. Übrigens muss ich um halb raus.' },
      { who: 'Du',    en: "No problem. I'll keep it short and send you the slides afterwards.", de: 'Kein Problem. Ich halte es kurz und schicke dir die Folien danach.' }
    ]
  },
  {
    id: 'ed4', title: 'Fragen nach der Präsentation', icon: 'chart',
    intro: 'Du hast die Quartalszahlen präsentiert.',
    voices: { Michael: 'm' },
    lines: [
      { who: 'Du',      en: 'That brings me to the end of my presentation. Are there any questions?', de: 'Damit bin ich am Ende meiner Präsentation. Gibt es Fragen?' },
      { who: 'Michael', en: 'Yes, thank you. Could you elaborate on the drop in sales in March?', de: 'Ja, danke. Könnten Sie den Umsatzrückgang im März näher erläutern?' },
      { who: 'Du',      en: "That's a great question. The main reason was a delay with one of our suppliers.", de: 'Sehr gute Frage. Hauptgrund war eine Verzögerung bei einem unserer Lieferanten.' },
      { who: 'Michael', en: 'Has that been sorted out?', de: 'Ist das inzwischen geklärt?' },
      { who: 'Du',      en: "Yes, it has. We've also added a second supplier to reduce the risk.", de: 'Ja. Wir haben außerdem einen zweiten Lieferanten dazugenommen, um das Risiko zu senken.' },
      { who: 'Michael', en: 'And what are the costs of that?', de: 'Und was kostet das?' },
      { who: 'Du',      en: "I don't have the exact figures with me, but I'll get back to you on that by Friday.", de: 'Die genauen Zahlen habe ich nicht dabei, aber ich melde mich bis Freitag dazu.' },
      { who: 'Michael', en: 'Great, thanks.', de: 'Super, danke.' }
    ]
  },
  {
    id: 'ed5', title: 'Preis und Lieferung', icon: 'target',
    intro: 'Eine Kundin verhandelt über dein Angebot.',
    voices: { 'Ms Carter': 'f' },
    lines: [
      { who: 'Ms Carter', en: 'Thanks for your offer. To be honest, the price is a bit outside our budget.', de: 'Danke für Ihr Angebot. Ehrlich gesagt liegt der Preis etwas außerhalb unseres Budgets.' },
      { who: 'Du',        en: 'I understand. What did you have in mind?', de: 'Verstehe. Woran hatten Sie gedacht?' },
      { who: 'Ms Carter', en: 'We were thinking of a discount of around ten percent.', de: 'Wir dachten an einen Rabatt von etwa zehn Prozent.' },
      { who: 'Du',        en: 'Ten percent would be difficult for us. If you could increase your order to five thousand units, we could offer seven percent.', de: 'Zehn Prozent wären schwierig. Wenn Sie Ihre Bestellung auf fünftausend Stück erhöhen könnten, könnten wir sieben Prozent anbieten.' },
      { who: 'Ms Carter', en: 'Would you be willing to include free delivery as well?', de: 'Wären Sie bereit, auch die Lieferung kostenlos dazuzunehmen?' },
      { who: 'Du',        en: 'We can do that, provided that you sign a one-year contract.', de: 'Das geht, vorausgesetzt, Sie unterschreiben einen Vertrag über ein Jahr.' },
      { who: 'Ms Carter', en: 'That sounds reasonable. Can we put that in writing?', de: 'Das klingt vernünftig. Können wir das schriftlich festhalten?' },
      { who: 'Du',        en: "Of course. I'll send you the revised offer this afternoon.", de: 'Natürlich. Ich schicke Ihnen heute Nachmittag das überarbeitete Angebot.' }
    ]
  },
  {
    id: 'ed6', title: 'Networking auf einer Konferenz', icon: 'cup',
    intro: 'In der Kaffeepause sprichst du jemanden an.',
    voices: { Elena: 'f' },
    lines: [
      { who: 'Elena', en: "Hi, I don't think we've met. I'm Elena from Nordic Solutions.", de: 'Hallo, ich glaube, wir kennen uns noch nicht. Ich bin Elena von Nordic Solutions.' },
      { who: 'Du',    en: "Nice to meet you, Elena. I'm Pascal. I work in project management.", de: 'Freut mich, Elena. Ich bin Pascal und arbeite im Projektmanagement.' },
      { who: 'Elena', en: 'Oh, interesting. Is this your first time at this conference?', de: 'Oh, interessant. Sind Sie zum ersten Mal auf dieser Konferenz?' },
      { who: 'Du',    en: "Yes, it is. So far it's been really inspiring. How about you?", de: 'Ja. Bisher ist es wirklich inspirierend. Und Sie?' },
      { who: 'Elena', en: "I've been coming for a few years now. It's a great place to make contacts.", de: 'Ich komme schon seit ein paar Jahren. Man knüpft hier super Kontakte.' },
      { who: 'Du',    en: 'I can imagine. What line of work are you in?', de: 'Das glaube ich. In welcher Branche sind Sie?' },
      { who: 'Elena', en: 'We develop software for supply chain planning.', de: 'Wir entwickeln Software für die Lieferkettenplanung.' },
      { who: 'Du',    en: "That sounds relevant for us. Let's keep in touch – here's my card.", de: 'Das klingt für uns relevant. Lassen Sie uns in Kontakt bleiben – hier ist meine Karte.' },
      { who: 'Elena', en: 'Great. It was lovely talking to you.', de: 'Gern. Es war schön, mit Ihnen zu sprechen.' }
    ]
  }
];

export const DIALOG_BY_ID = Object.fromEntries(DIALOGUES.map(d => [d.id, d]));
