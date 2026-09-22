# Azərbaycanca — Aserbaidschanisch lernen

Eine Lern-App für die Grundkenntnisse des Aserbaidschanischen, gebaut für das iPhone.
Sie läuft als installierbare Web-App (PWA): Icon auf dem Home-Bildschirm, Vollbild,
offline nutzbar, kein App Store, kein Konto, keine Server.

![Alphabet, Startseite, Grammatik](docs/screens.png)

---

## Auf dem iPhone installieren

### 1. Die App veröffentlichen (einmalig, ~2 Minuten)

Die App besteht nur aus statischen Dateien und kann direkt über GitHub Pages laufen:

1. Auf GitHub im Repository auf **Settings → Pages** gehen.
2. Unter **Build and deployment → Source** den Eintrag **GitHub Actions** wählen.
3. Fertig. Der mitgelieferte Workflow (`.github/workflows/pages.yml`) veröffentlicht die App
   bei jedem Push automatisch.

Die Adresse lautet danach:

```
https://<dein-github-name>.github.io/Sprach-App/
```

> Alternative ohne GitHub Pages: den Ordner auf einen beliebigen Webspace legen.
> Wichtig ist nur **HTTPS** — Sprachausgabe, Mikrofon und Offline-Betrieb setzen das voraus.

### 2. Zum Home-Bildschirm hinzufügen

1. Die Adresse in **Safari** öffnen (nicht Chrome — nur Safari kann auf iOS installieren).
2. Auf das **Teilen-Symbol** tippen (Quadrat mit Pfeil nach oben).
3. **„Zum Home-Bildschirm“** wählen → **Hinzufügen**.

Ab jetzt startet die App wie eine native App im Vollbild, ganz ohne Safari-Leiste,
und funktioniert auch ohne Internet.

### 3. Die Stimme aktivieren (wichtig!)

iOS bringt keine aserbaidschanische Stimme mit. Türkisch und Aserbaidschanisch sind
lautlich aber nahezu deckungsgleich, deshalb nutzt die App die türkische Systemstimme.
Falls noch keine installiert ist:

**Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Türkisch → Laden**

Danach die App neu öffnen. Unter **Mehr → Einstellungen** lässt sich die Stimme
auswählen und das Sprechtempo anpassen.

---

## Was die App kann

| Bereich | Inhalt |
|---|---|
| **Kurs** | 6 Einheiten, 49 Lektionen — vom Alphabet bis zum Smalltalk |
| **Alphabet** | Alle 32 Buchstaben mit Lautschrift, Beispielwort und Hinweisen für Deutsche |
| **Wortschatz** | 198 Wörter und Wendungen in 11 Themengebieten, alle vertont |
| **Grammatik** | 11 kompakte Kapitel: Vokalharmonie, Fälle, Zeiten, Satzbau, Höflichkeit |
| **Dialoge** | 4 Alltagsszenen, zeilenweise oder am Stück anhörbar |
| **Aussprache** | Wort anhören, selbst aufnehmen, direkt vergleichen |
| **Wiederholen** | Karteikasten mit verteiltem Lernen (SM-2), meldet fällige Wörter |
| **Fortschritt** | Streak, Tagesziel, XP, Statistik nach Themen |

### Übungstypen

Aus dem Wortschatz baut die App automatisch sechs Übungsformen:
Wort einführen · Bedeutung wählen · Übersetzung wählen · Hörverstehen ·
Satz aus Bausteinen zusammensetzen · frei tippen (mit Sonderzeichen-Tastenreihe für `ə ı ö ü ç ş ğ q x`).

Falsch beantwortete Aufgaben kommen am Ende der Lektion noch einmal.

---

## Wie die Aussprache funktioniert

Die App spricht mit der türkischen Systemstimme, passt den Text vorher aber an
den aserbaidschanischen Lautbestand an:

| Aserbaidschanisch | wird gesprochen als | Laut |
|---|---|---|
| `ə` | `e` | offenes ä wie in „Bär“ |
| `q` | `g` | wie deutsches g |
| `x` | `h` | ch wie in „Bach“ (nächste Annäherung) |

Beispiel: `Bağışlayın, qapı xoşdur` → `Bağışlayın, gapı hoşdur`

Findet die App eine echte `az`-Stimme (manche Android-Geräte, künftige iOS-Versionen),
nutzt sie diese automatisch und ohne Umschreibung. Zusätzlich steht unter jedem Wort
eine deutsche Lautschrift — bei `ə`, `q` und `x` ist sie genauer als die Stimme.

---

## Aufbau

```
index.html              App-Hülle
manifest.webmanifest    Name, Icons, Vollbild-Verhalten
sw.js                   Service Worker – macht alles offline verfügbar
css/app.css             Design, helles und dunkles Erscheinungsbild
js/
  app.js                Einstieg: Router, Tableiste, globale Audio-Knöpfe
  speech.js             Sprachausgabe inkl. Umschrift für die türkische Stimme
  store.js              Fortschritt & Einstellungen (localStorage)
  srs.js                Verteiltes Wiederholen (SM-2, vereinfacht)
  lesson-engine.js      Erzeugt die Übungen aus den Kursdaten
  views/                Die einzelnen Ansichten
data/
  alphabet.js           32 Buchstaben
  vocab.js              198 Wörter und Wendungen
  grammar.js            11 Grammatikkapitel
  course.js             Kursaufbau: Einheiten und Lektionen
  dialogues.js          4 Dialoge
```

Kein Build-Schritt, keine Abhängigkeiten — reines ES-Modul-JavaScript.

### Inhalte erweitern

Neues Wort in `data/vocab.js` eintragen (die `id` nie nachträglich ändern, daran hängt
der Lernfortschritt) und die `id` in `data/course.js` einer Lektion zuordnen.
Die Übungen entstehen daraus von selbst.

### Lokal ausprobieren

```bash
python3 -m http.server 8777
# dann http://localhost:8777 öffnen
```

---

## Datenschutz

Lernstand, Einstellungen und Aufnahmen bleiben auf dem Gerät. Es gibt keine Anmeldung,
keine Analyse, keine Netzwerkanfragen außer dem Laden der App selbst. Aufnahmen aus dem
Aussprache-Trainer liegen nur im Arbeitsspeicher und werden beim Wortwechsel verworfen.

Der Lernstand hängt an den Website-Daten von Safari: Werden diese gelöscht,
ist auch der Fortschritt weg.
