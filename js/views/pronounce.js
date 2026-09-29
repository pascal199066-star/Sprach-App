/**
 * Aussprache-Trainer: Wort anhören, selbst nachsprechen, direkt vergleichen.
 * Die Aufnahme bleibt im Arbeitsspeicher und verlässt das Gerät nicht.
 */
import { VOCAB, VOCAB_BY_ID } from '../../data/vocab.js';
import { TRICKY } from '../../data/alphabet.js';
import { store } from '../store.js';
import { esc, shuffle, toast } from '../ui.js';
import { speakBtn, backBar, icon, phon, soundTips } from '../components.js';
import { speech } from '../speech.js';

let R = null;          // { rec, chunks, url }
let queue = [];
let idx = 0;

/** Wörter, die genau die schwierigen Laute enthalten – nach vorn sortiert. */
function buildQueue() {
  const hard = VOCAB.filter(v => TRICKY.some(t => v.az.toLowerCase().includes(t)));
  const rest = VOCAB.filter(v => !hard.includes(v));
  return [...shuffle(hard), ...shuffle(rest)].map(v => v.id);
}

export function render() {
  if (!queue.length) { queue = buildQueue(); idx = 0; }
  const v = VOCAB_BY_ID[queue[idx]];
  const canRecord = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

  return `<div class="view">
    ${backBar('Aussprache-Trainer', '#/more', `Anhören, nachsprechen, vergleichen · ${idx + 1} von ${queue.length}`)}

    <div class="card stage">
      <div class="prompt-big az">${esc(v.az)}</div>
      ${phon(v.ph)}
      <div class="de-big" style="font-size:16px;margin-top:6px">${esc(v.de)}</div>
      <div class="speakers">${speakBtn(v.az, { size: 'lg' })}${speakBtn(v.az, { slow: true })}</div>
      ${soundTips(v.az)}
    </div>

    ${canRecord ? `
    <div class="card stage" style="padding:22px">
      <button class="speak lg" id="rec" aria-label="Aufnehmen" style="background:var(--nar);box-shadow:0 10px 24px -12px var(--nar);color:#fff">${icon('mic')}</button>
      <div class="muted" style="font-size:14px;margin-top:10px" id="rec-hint">Zum Aufnehmen tippen – dann das Wort nachsprechen</div>
      <div id="playback" class="hide" style="margin-top:14px">
        <div class="row" style="gap:8px">
          <button class="btn soft grow small" data-say="${esc(v.az)}">${icon('speaker')} Original</button>
          <button class="btn ghost grow small" id="replay">${icon('play')} Meine Aufnahme</button>
        </div>
        <audio id="my-audio" playsinline style="display:none"></audio>
      </div>
    </div>` : `<div class="callout">${icon('info')}<div class="grow">Aufnehmen ist in diesem Browser nicht möglich. Sprich einfach laut mit – das hilft auch ohne Aufnahme.</div></div>`}

    <div class="row" style="gap:10px;margin-top:6px">
      <button class="btn ghost grow" data-nav="-1" ${idx === 0 ? 'disabled' : ''}>${icon('chevL')} Zurück</button>
      <button class="btn primary grow" data-nav="1">Nächstes ${icon('chevR')}</button>
    </div>
  </div>`;
}

export function mount() {
  document.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => {
    stopRecording();
    idx = Math.max(0, Math.min(queue.length - 1, idx + (+b.dataset.nav)));
    document.getElementById('app').innerHTML = render();
    mount();
    if (store.settings.autoPlay) {
      setTimeout(() => speech.say(VOCAB_BY_ID[queue[idx]].az, { rate: store.settings.rate }), 200);
    }
  }));

  const rec = document.getElementById('rec');
  if (rec) rec.addEventListener('click', () => (R?.rec?.state === 'recording' ? stopRecording() : startRecording()));

  document.getElementById('replay')?.addEventListener('click', () => {
    const a = document.getElementById('my-audio');
    speech.stop();
    a.currentTime = 0;
    a.play();
  });
}

async function startRecording() {
  const btn = document.getElementById('rec');
  const hint = document.getElementById('rec-hint');
  try {
    speech.stop();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type: rec.mimeType || 'audio/mp4' });
      if (R?.url) URL.revokeObjectURL(R.url);
      const url = URL.createObjectURL(blob);
      R = { url };
      const wrap = document.getElementById('playback');
      const audio = document.getElementById('my-audio');
      if (wrap && audio) { audio.src = url; wrap.classList.remove('hide'); }
      btn?.classList.remove('playing');
      if (btn) btn.innerHTML = icon('mic');
      if (hint) hint.textContent = 'Vergleiche: erst das Original, dann dich. Nochmal? Einfach erneut tippen.';
    };
    R = { rec, chunks };
    rec.start();
    btn.classList.add('playing');
    btn.innerHTML = icon('stop');
    hint.textContent = 'Aufnahme läuft – zum Stoppen tippen';
    setTimeout(() => { if (R?.rec?.state === 'recording') stopRecording(); }, 6000);
  } catch {
    toast('Kein Zugriff auf das Mikrofon');
  }
}

function stopRecording() {
  if (R?.rec?.state === 'recording') R.rec.stop();
}
