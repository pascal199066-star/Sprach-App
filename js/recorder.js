/**
 * Kleine Hülle um MediaRecorder: aufnehmen, stoppen, Adresse der Aufnahme.
 * Aufnahmen bleiben im Arbeitsspeicher und verlassen das Gerät nicht.
 */
let rec = null;
let url = null;

export const recorder = {
  get supported() { return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder); },
  get recording() { return rec?.state === 'recording'; },

  /** @param {(url:string)=>void} onDone wird mit der Aufnahme aufgerufen */
  async start(onDone) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const r = new MediaRecorder(stream);
    const chunks = [];
    r.ondataavailable = e => e.data.size && chunks.push(e.data);
    r.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(new Blob(chunks, { type: r.mimeType || 'audio/mp4' }));
      rec = null;
      onDone?.(url);
    };
    rec = r;
    r.start();
  },

  stop() { if (rec?.state === 'recording') rec.stop(); },

  /** Aufnahme verwerfen (beim Verlassen der Seite). */
  discard() {
    if (rec?.state === 'recording') { rec.onstop = null; rec.stop(); rec.stream?.getTracks().forEach(t => t.stop()); }
    rec = null;
    if (url) { URL.revokeObjectURL(url); url = null; }
  }
};
