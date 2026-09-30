#!/usr/bin/env python3
"""
Erzeugt die Aufnahmen für alle Texte aus tools/audio-jobs.json mit den
neuronalen Stimmen von Microsoft (Aserbaidschanisch: az-AZ-BanuNeural,
az-AZ-BabekNeural; Englisch: en-GB-SoniaNeural, en-US-AndrewNeural) über
das Paket edge-tts. Welche Stimme wofür, steht in js/audio-key.js.

    pip install edge-tts
    node tools/collect-audio.mjs
    python3 tools/make_audio.py

Bereits vorhandene Dateien werden übersprungen – nach neuen Wörtern
einfach beide Befehle erneut ausführen. Zum Schluss wird
audio/manifest.json aus allen vorhandenen Dateien neu geschrieben,
damit die App weiß, welche Aufnahmen es gibt.
"""
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
JOBS = ROOT / "tools" / "audio-jobs.json"
PARALLEL = 4
# Etwas langsamer als Standard – für Lernende deutlich besser verständlich
RATE = "-8%"


async def render(job, sem, stats):
    out = AUDIO / f"{job['key']}.mp3"
    if out.exists() and out.stat().st_size > 0:
        stats["skip"] += 1
        return
    out.parent.mkdir(parents=True, exist_ok=True)
    async with sem:
        for attempt in range(4):
            try:
                tmp = out.with_suffix(".part")
                await edge_tts.Communicate(job["say"], job["voice"], rate=RATE).save(str(tmp))
                if tmp.stat().st_size == 0:
                    raise RuntimeError("leere Datei")
                tmp.replace(out)
                stats["new"] += 1
                return
            except Exception as e:  # Netz wackelt – kurz warten, nochmal
                if attempt == 3:
                    stats["fail"].append((job["text"], str(e)))
                    return
                await asyncio.sleep(2 ** attempt)


def write_manifest():
    files = sorted(
        f"{p.parent.name}/{p.stem}"
        for p in AUDIO.glob("*/*.mp3")
        if p.stat().st_size > 0
    )
    (AUDIO / "manifest.json").write_text(
        json.dumps({"files": files}, separators=(",", ":")) + "\n", encoding="utf-8"
    )
    return len(files)


async def main():
    jobs = json.loads(JOBS.read_text(encoding="utf-8"))
    sem = asyncio.Semaphore(PARALLEL)
    stats = {"new": 0, "skip": 0, "fail": []}
    await asyncio.gather(*(render(j, sem, stats) for j in jobs))
    n = write_manifest()
    print(f"neu: {stats['new']}  schon da: {stats['skip']}  fehlgeschlagen: {len(stats['fail'])}")
    print(f"audio/manifest.json: {n} Aufnahmen")
    for text, err in stats["fail"][:10]:
        print(f"  ✗ {text!r}: {err}", file=sys.stderr)
    return 1 if stats["fail"] else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
