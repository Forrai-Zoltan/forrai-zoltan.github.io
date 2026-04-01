document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggleBtn");
  let muted = localStorage.getItem("audioMuted") === "true";
  btn.classList.toggle("muted", muted);

  btn.addEventListener("click", () => {
    muted = !muted;
    localStorage.setItem("audioMuted", muted);
    btn.classList.toggle("muted", muted);
    playMuteClick(muted);
  });
});

function playMuteClick(muting) {
  const ctx = getCtx();
  const root = 523.25;
  const major = [1, Math.pow(2, 4/12), Math.pow(2, 7/12)];

  major.forEach((ratio, i) => {
    const freq = root * ratio;
    const delay = i * 0.03;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    if (muting) {
      gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.1 - i * 0.05, ctx.currentTime + delay + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.38);
      
    } else {
      gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.1 - i * 0.02, ctx.currentTime + delay + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.38);
    }

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.42);
  });
}

let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playPop(rising = true) {
  const muted = localStorage.getItem("audioMuted") === "true";
  if (muted) return;

  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(rising ? 600 : 440, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(
    rising ? 880 : 280,
    ctx.currentTime + 0.12
  );
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

// Rising tone on all .pop elements
document.querySelectorAll(".pop").forEach((el) => {
  el.addEventListener("click", () => playPop(true));
});

// All checkboxes get rising/falling tone regardless of class
document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
  el.addEventListener("click", () => playPop(el.checked));
});
