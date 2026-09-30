/**
 * Freies Sprechen: Situationen, in denen du 60 Sekunden am Stück redest.
 *  task    – die Aufgabe (Deutsch)
 *  phrases – Bausteine, die du einbauen sollst
 *  model   – eine mögliche Antwort zum Anhören und Vergleichen
 */
export const DEMO_SENTENCE = "Good morning, everyone. Shall we get started?";

export const SPEAKING = [
  {
    id: 'sp01', title: 'Tell me about yourself', icon: 'user',
    task: 'Bewerbungsgespräch: Stell dich in einer Minute vor – Rolle, Erfahrung, was dich antreibt.',
    phrases: ["I've been working in … for … years.", "I'm currently responsible for …", 'What I enjoy most about my job is …', "I'm looking for a role where I can …"],
    model: "I've been working in project management for about eight years, mainly in logistics. I'm currently responsible for a team of six people and several international customer projects. What I enjoy most about my job is bringing people together and turning complex plans into something that actually works. I'm now looking for a role where I can take on more strategic responsibility."
  },
  {
    id: 'sp02', title: 'Ein Projekt, das schiefging', icon: 'warn',
    task: 'Erzähle von einem Projekt, das nicht nach Plan lief: Was ist passiert, wie hast du reagiert, was hast du gelernt?',
    phrases: ["Things didn't go according to plan.", 'The main challenge was …', 'In hindsight, …', 'What I learned from this is …'],
    model: "Last year we were rolling out a new ordering system, and things didn't go according to plan. The main challenge was that one of our suppliers couldn't deliver the interface on time. We quickly set up a daily call with them and prioritised the most important features. In hindsight, we should have involved them much earlier. What I learned from this is to identify critical dependencies right at the start."
  },
  {
    id: 'sp03', title: 'Das Team überzeugen', icon: 'users',
    task: 'Überzeuge dein Team, ein neues Tool für die Zusammenarbeit einzuführen – und geh auf Bedenken ein.',
    phrases: ["I'd like to propose …", 'The main advantage is …', 'I know some of you are concerned about …', "Let's try it for a month and then review it."],
    model: "I'd like to propose that we switch to a shared project management tool. The main advantage is that everyone can see the status of every task in one place, so we'll spend less time on status meetings and emails. I know some of you are concerned about the extra effort at the beginning, and that's a fair point. That's why I suggest we try it for a month and then review it together."
  },
  {
    id: 'sp04', title: 'Kundenbeschwerde', icon: 'chat',
    task: 'Ein Kunde beschwert sich am Telefon über eine verspätete Lieferung. Entschuldige dich, erkläre und biete eine Lösung an.',
    phrases: ["I'm really sorry to hear that.", 'Let me explain what happened.', 'What I can offer you is …', "I'll personally make sure that …"],
    model: "I'm really sorry to hear that your delivery hasn't arrived yet. Let me explain what happened: there was a problem at our warehouse last week, which caused delays for several customers. What I can offer you is express shipping at no extra cost, so you'll receive the goods by Thursday. I'll personally make sure that everything goes smoothly, and I'll call you as soon as it has been dispatched."
  },
  {
    id: 'sp05', title: 'Meeting zusammenfassen', icon: 'check',
    task: 'Fasse am Ende eines Meetings die Ergebnisse zusammen und nenne die nächsten Schritte.',
    phrases: ['Just to recap, …', "We've agreed to …", 'The action items are …', "Let's touch base again on …"],
    model: "Just to recap, we've agreed to launch the campaign on the first of June. Maria will finalise the budget by Friday, and Tom will brief the agency next week. The question about the target group is still open, so let's circle back to it in our next meeting. Let's touch base again on Tuesday to check where we are. Thanks, everyone."
  },
  {
    id: 'sp06', title: 'Rabatt verhandeln', icon: 'target',
    task: 'Du bist im Einkauf. Verhandle mit einem Lieferanten einen besseren Preis für eine größere Bestellung.',
    phrases: ["We're very interested in your offer, but …", 'Would you be willing to …?', 'If you could …, we would …', 'That would be a win-win situation.'],
    model: "We're very interested in your offer, but the price is slightly above what we had planned. We're considering a much larger order this year, so I was wondering whether there's some flexibility. Would you be willing to offer a volume discount of around eight percent? If you could agree to that, we would commit to a twelve-month contract. I think that would be a win-win situation for both of us."
  },
  {
    id: 'sp07', title: 'Konstruktives Feedback', icon: 'heart',
    task: 'Gib einer Kollegin Feedback: Ihre Präsentation war inhaltlich stark, aber zu lang.',
    phrases: ['I really liked …', 'One thing you might want to consider is …', 'It would be even stronger if …', 'How do you see it?'],
    model: "I really liked your presentation – the analysis was very clear and the examples were spot on. One thing you might want to consider is the length. Some people started checking their phones towards the end. It would be even stronger if you focused on the three key findings and moved the details to the appendix. How do you see it?"
  },
  {
    id: 'sp08', title: 'Zahlen präsentieren', icon: 'chart',
    task: 'Präsentiere die Quartalszahlen: Der Umsatz ist gestiegen, die Kosten auch, der Gewinn blieb stabil.',
    phrases: ['As you can see on this slide, …', '… increased significantly', '… levelled off', 'The key takeaway is …'],
    model: "As you can see on this slide, revenue increased significantly in the third quarter, by roughly fifteen percent. At the same time, our costs also went up, mainly because of higher energy prices. As a result, our profit levelled off at about the same level as last quarter. The key takeaway is that growth is strong, but we need to keep a close eye on costs."
  },
  {
    id: 'sp09', title: 'Deadline verschieben', icon: 'repeat',
    task: 'Erkläre deiner Vorgesetzten, warum eine Deadline verschoben werden muss, und schlage einen neuen Termin vor.',
    phrases: ["I'm afraid we won't be able to …", 'The reason is …', "What I'd suggest is …", "I'll keep you posted."],
    model: "I'm afraid we won't be able to meet the deadline at the end of this month. The reason is that the client changed some key requirements last week, and we need time to adjust the design. What I'd suggest is moving the deadline back by two weeks, to the fifteenth. That way we can deliver the quality we promised. I'll keep you posted on our progress."
  },
  {
    id: 'sp10', title: 'Small Talk vor dem Meeting', icon: 'cup',
    task: 'Du wartest mit einem neuen Geschäftspartner darauf, dass das Meeting beginnt. Führe entspannten Small Talk.',
    phrases: ['How was your trip?', 'Is this your first time in …?', 'How long have you been with …?', "I've heard a lot about …"],
    model: "How was your trip? I hope the train wasn't too crowded this morning. Is this your first time in Hamburg? If you have some time after the meeting, the harbour is definitely worth a visit. By the way, how long have you been with the company? I've heard a lot about your new logistics centre."
  },
  {
    id: 'sp11', title: 'Elevator Pitch', icon: 'sparkle',
    task: 'Du hast 60 Sekunden im Aufzug mit der Geschäftsführung. Stelle deine Idee vor.',
    phrases: ["I've been working on an idea that could …", 'At the moment, …', 'What we could do instead is …', 'Could I send you a short summary?'],
    model: "I've been working on an idea that could save us a lot of time in customer service. At the moment, around thirty percent of all calls are simple questions about delivery status. What we could do instead is send customers automatic updates by text message. A pilot would cost very little and could reduce the number of calls significantly. Could I send you a short summary?"
  },
  {
    id: 'sp12', title: 'Höflich unterbrechen', icon: 'scale',
    task: 'Jemand redet in der Diskussion sehr lange. Unterbrich höflich, fasse zusammen und bring das Gespräch zurück zur Tagesordnung.',
    phrases: ['Sorry to interrupt, but …', 'If I understand you correctly, …', "That's a fair point, and …", 'In the interest of time, …'],
    model: "Sorry to interrupt, but I'm conscious of the time. If I understand you correctly, your main concern is that the budget is too tight. That's a fair point, and I suggest we look at it in more detail in a separate meeting. In the interest of time, let's move on to the next point on the agenda."
  }
];
